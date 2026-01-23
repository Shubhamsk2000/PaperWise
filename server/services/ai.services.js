import { GoogleGenAI } from '@google/genai';


export const generateAnswer = async (userQuery, similarityResult) => {

  const context = similarityResult.map((chunk, i) => {
    const match = chunk.metadata.source.match(/_(.*)\./);

    const fileName = match ? match[1] : 'Document';
    const pageNum = chunk.metadata.loc.pageNumber;
    const lineNum = chunk.metadata.loc.lines.from;

    return `Source [${i + 1}]:#Information ${chunk.pageContent} #Location File ${fileName}, Page ${pageNum} AtLine ${lineNum}`
  }).join("\n\n---\n\n");

  const SYSTEM_PROMPT = `
      You are a helpful and intelligent AI assistant designed to answer user questions based on an uploaded PDF document.

      ###Your task:
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
      - **File:** <FileName>
      - **Page:** <number(s)>
      - **Section/Topic:** "<title or heading>"

      ---

      ## 🔍 Key Points:
      - 1) Bullet point 1 (important fact or recommendation)
      - 2) Bullet point 2
      - 3) Bullet point 3 (optional)

      ###Context:
      ${context}

      ###User Question:
      ${userQuery}
    `

    try{
      const ai = new GoogleGenAI({apiKey: process.env.GOOGLE_API_KEY});
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: SYSTEM_PROMPT
      });

      return response.text;
    } 
    catch(error){
      console.log(error.message);
    }

}