// import { Router } from "express";
// import { GoogleGenAI } from "@google/genai";
// import { vectorStore } from "../infra/vectorStore.js";
// import { uploadQueue } from "../infra/queue.js";
// import multer from "multer";
// import { protectMiddleware } from "../middleware/auth.middleware.js";

// const router = Router();
// const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// // Multer setup for file upload
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/');
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     cb(null, uniqueSuffix + '_' + file.originalname);
//   }
// });
// const upload = multer({ storage });


// router.post('/upload/pdf', protectMiddleware, upload.single('pdf'), async (req, res) => {
//   try {
//     // 1. Check if a file was uploaded
//     if (!req.file) {
//       return res.status(400).json({ error: 'No PDF file uploaded' });
//     }

//     // 2. Add file info to queue
//     await uploadQueue.add('process-pdf', {
//       filename: req.file.originalname,
//       destination: req.file.destination,
//       path: req.file.path,
//     });

//     // 3. Return success response
//     return res.status(200).json({
//       message: 'PDF file uploaded successfully and queued',
//     });
//   } catch (error) {
//     console.error('Upload error:', error);
//     return res.status(500).json({
//       error: 'Something went wrong during PDF upload',
//       details: error.message || error,
//     });
//   }
// });

// router.post('/chat', protectMiddleware, async (req, res) => {
//   try {

//     const userQuery = req.body.query;

//     if (!userQuery) {
//       return res.status(400).json({ error: "Some Error is occured." });
//     }
//     const retriever = vectorStore.asRetriever({
//       k: 2,
//     })

//     const result = await retriever.invoke(userQuery)
//     const SYSTEM_PROMPT = `
//       You are a helpful and intelligent AI assistant designed to answer user questions based on an uploaded PDF document.

//       Your task:
//       - Answer the user's question using the **PDF content chunks** provided.
//       - For **factual or information-based questions**, respond using **only the provided context**. If the answer is found:
//         - Provide a **clear, concise explanation**.
//         - Include the **page number** and **section/title** (if available).
//         - Highlight key **bullet points** if present.

//       - For **opinion-based or improvement questions** (e.g., “How can I improve this?”, “Is this suitable for X?”):
//         - Use both the PDF content and general best practices.
//         - Give **specific, actionable feedback** where possible.
//         - If general knowledge is used, mention it clearly.

//       - If the answer is not available in the context and the question is factual, reply with:
//       > "The answer is not available in the uploaded document."

//       🧠 **Answer Format (Markdown):**

//       ## 📝 Answer:
//       <Provide your main answer here. Use **bold** to highlight key terms. Be concise but informative.>

//       ---

//       ## 📄 Reference:
//       - **Page:** <number(s)>
//       - **Section/Topic:** "<title or heading>"

//       ---

//       ## 🔍 Key Points:
//       - 1) Bullet point 1 (important fact or recommendation)
//       - 2) Bullet point 2
//       - 3) Bullet point 3 (optional)

//       Context:
//       ${JSON.stringify(result)}

//       User Question:
//       ${userQuery}
// `;

//     const geminiResponse = await ai.models.generateContent({
//       model: "gemini-2.5-flash",
//       contents: SYSTEM_PROMPT
//     });

//     return res.status(200).json({
//       assistant_response: geminiResponse
//     })

//   } catch (error) {
//     console.error("❌ Error in /chat:", error.message);
//     return res.status(500).json({ error: "Internal Server Error" });
//   }
// })

// export default router;