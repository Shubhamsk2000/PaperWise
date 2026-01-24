// import { MistralAIEmbeddings } from "@langchain/mistralai";
// import { QdrantVectorStore } from "@langchain/qdrant";
// import * as dotenv from 'dotenv';

// dotenv.config();

// const embeddings = new MistralAIEmbeddings({
//   model: "mistral-embed",
//   apiKey: process.env.MISTRAL_API_KEY,
// });

// export const vectorStore = await QdrantVectorStore.fromExistingCollection(
//   embeddings,
//   {
//     url: process.env.QDRANT_URL,
//     apiKey: process.env.QDRANT_API_KEY,
//     collectionName: "pdf-docs",
//   }
// );

import { MongoDBAtlasVectorSearch } from "@langchain/mongodb"
import { MongoClient } from "mongodb";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import * as dotenv from 'dotenv';
dotenv.config();

const client = new MongoClient(process.env.MONGODB_URI || "");
const collection = client.db("PaperWise").collection("pdf_chunks_emb");

const embeddings = new GoogleGenerativeAIEmbeddings({
    model: "text-embedding-004" //768
});

export const vectorStore = new MongoDBAtlasVectorSearch(embeddings, {
    collection: collection,
    indexName: "vector_index",
    textKey: "text",
    embeddingKey: "embedding",
});