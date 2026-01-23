import { Worker } from 'bullmq';
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf"
import { CharacterTextSplitter } from "@langchain/textsplitters";
import path from 'path';
import { vectorStore } from './infra/vectorStore.js';
import IORedis from 'ioredis';

console.log("Worker running...");

export const connection = new IORedis(process.env.REDIS_URL,
  { maxRetriesPerRequest: null }
);

const worker = new Worker(
  'file-upload-queue',
  async job => {
    if (job.name !== 'ingest-pdf') return;
    try {
      const pdfInfo = job.data;
      const absolutePath = path.resolve(pdfInfo.filePath)
      const loader = new PDFLoader(absolutePath);

      const doc = await loader.load();

      const splitter = new CharacterTextSplitter({
        chunkSize: 500,
        chunkOverlap: 50,
      });

      const chunks = await splitter.splitDocuments(doc);

      for(let i = 0; i < chunks.length; i++){
        chunks[i].metadata.pdfId = pdfInfo.pdfId;
      }

      console.log(`📄 PDF split into ${chunks.length} chunks`);

      await vectorStore.addDocuments(chunks);
      console.log(`✅ Embedded and stored in MongoDB`);

    } catch (error) {
      //TODO: update status of pdf in mongo 
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
