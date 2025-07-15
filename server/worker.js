import { Worker } from 'bullmq';
import IORedis from 'ioredis';
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { QdrantVectorStore } from "@langchain/qdrant";
import { CharacterTextSplitter } from "@langchain/textsplitters";
import * as dotenv from 'dotenv';
import { MistralAIEmbeddings } from "@langchain/mistralai";

dotenv.config();

const connection = new IORedis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});

const worker = new Worker(
  'file-upload-queue',
  async job => {
    try {
      console.log('📥 Processing job:', job.id);
      console.log('Job data:', job.data);

      // 1. Load PDF
      const loader = new PDFLoader(job.data.path);
      const doc = await loader.load();

      // 2. Split into chunks
      const splitter = new CharacterTextSplitter({
        chunkSize: 500,
        chunkOverlap: 50,
      });
      const chunks = await splitter.splitDocuments(doc);
      console.log(`📄 PDF split into ${chunks.length} chunks`);

      // 3. Set up embeddings
      const embeddings = new MistralAIEmbeddings({
        model: "mistral-embed",
        apiKey: process.env.MISTRAL_API_KEY,
      });

      // 4. Store in Qdrant
      const vectorStore = await QdrantVectorStore.fromExistingCollection(
        embeddings,
        {
          url: process.env.QDRANT_URL,
          apiKey: process.env.QDRANT_API_KEY,
          collectionName: "pdf-docs",
        }
      );

      await vectorStore.addDocuments(chunks);
      console.log(`✅ Embedded and stored in Qdrant`);

    } catch (error) {
      console.error('❌ Error processing job:', error.message);
    }
  },
  { connection }
);

worker.on('completed', job => {
  console.log(`🎉 Job ${job.id} completed`);
});

worker.on('failed', (job, err) => {
  console.error(`❌ Job ${job?.id} failed`, err);
});
