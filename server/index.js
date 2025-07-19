import express, { response } from 'express';
import cors from 'cors';
import multer from 'multer';
import { Queue } from 'bullmq';
import IORedis from 'ioredis';
import { MistralAIEmbeddings } from "@langchain/mistralai";
import { QdrantVectorStore } from "@langchain/qdrant";
import { GoogleGenAI } from "@google/genai";
import * as dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

//IMP: Initialized worker in main server file only for development purpose. The worker should run on different instance
import './worker.js';

dotenv.config();
const PORT = process.env.PORT || 8000;

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const app = express();
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 🔌 Redis connection using Upstash
const connection = new IORedis(process.env.REDIS_URL, { maxRetriesPerRequest: null });

// 🛠️ BullMQ queue setup
const queue = new Queue('file-upload-queue', { connection });

const embeddings = new MistralAIEmbeddings({
  model: "mistral-embed",
  apiKey: process.env.MISTRAL_API_KEY,
});

const vectorStore = await QdrantVectorStore.fromExistingCollection(
  embeddings,
  {
    url: process.env.QDRANT_URL,
    apiKey: process.env.QDRANT_API_KEY,
    collectionName: "pdf-docs",
  }
);


// Multer setup for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '_' + file.originalname);
  }
});

const upload = multer({ storage });

app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// PDF upload route
app.post('/upload/pdf', upload.single('pdf'), async (req, res) => {
  try {
    // 1. Check if a file was uploaded
    if (!req.file) {
      return res.status(400).json({ error: 'No PDF file uploaded' });
    }

    // 2. Add file info to queue
    await queue.add('file-upload-queue', {
      filename: req.file.originalname,
      destination: req.file.destination,
      path: req.file.path,
    });

    // 3. Return success response
    return res.status(200).json({
      message: 'PDF file uploaded successfully and queued',
    });
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({
      error: 'Something went wrong during PDF upload',
      details: error.message || error,
    });
  }
});


app.post('/chat', async (req, res) => {
  try {

    const userQuery = req.body.query;

    if (!userQuery) {
      return res.status(400).json({ error: "Some Error is occured." });
    }
    const retriever = vectorStore.asRetriever({
      k: 2,
    })

    const result = await retriever.invoke(userQuery)
    const SYSTEM_PROMPT = `
      You are a helpful and intelligent AI assistant designed to answer user questions based on an uploaded PDF document.

      Your task:
      - Answer the user's question using the **PDF content chunks** provided.
      - For **factual or information-based questions**, respond using **only the provided context**. If the answer is found:
        - Provide a **clear, concise explanation**.
        - Include the **page number** and **section/title** (if available).
        - Highlight key **bullet points** if present.

      - For **opinion-based or improvement questions** (e.g., “How can I improve this?”, “Is this suitable for X?”):
        - Use both the PDF content and general best practices.
        - Give **specific, actionable feedback** where possible.
        - If general knowledge is used, mention it clearly.

      - If the answer is not available in the context and the question is factual, reply with:
      > "The answer is not available in the uploaded document."

      🧠 **Answer Format (Markdown):**

      ## 📝 Answer:
      <Provide your main answer here. Use **bold** to highlight key terms. Be concise but informative.>

      ---

      ## 📄 Reference:
      - **Page:** <number(s)>
      - **Section/Topic:** "<title or heading>"

      ---

      ## 🔍 Key Points:
      - 1) Bullet point 1 (important fact or recommendation)
      - 2) Bullet point 2
      - 3) Bullet point 3 (optional)

      Context:
      ${JSON.stringify(result)}

      User Question:
      ${userQuery}
`;


    const geminiResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: SYSTEM_PROMPT
    });
    return res.status(200).json({
      assistant_response: geminiResponse
    })

  } catch (error) {
    console.error("❌ Error in /chat:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
})

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
