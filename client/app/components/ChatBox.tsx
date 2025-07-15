"use client";
import React, { useState } from 'react'
type IMessage = {
  role: "user" | "assistant";
  content?: string
}
const ChatBox = () => {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<IMessage[]>([]);

  const handleOnClick = async () => {
    if (!query.trim()) return;
    console.log("ck")

    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: query }),
    });
    const data = await response.json();
    const ai_response = data.assistant_response?.candidates?.[0]?.content?.parts?.[0]?.text || "⚠️ No response received from AI.";
    console.log("res", ai_response)
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: query,
      },
      {
        role: "assistant",
        content: ai_response,
      }
    ]);
    setQuery("");
  }

  return (
    <div className='fixed bottom-5 w-full'>
      <div>
        {messages.map((message, index) => (
          <span key={index}>
            {message.role == 'assistant' ? <span className='bg-amber-200'>
              {message.content}
            </span> : <span className='bg-blue-500'> {message.content}</span>}
          </span>
        ))}
      </div>
      <div>
        <label>input</label>
        <input className='p-2 mx-3 border-2 border-black rounded-2xl' placeholder='type your message' onChange={(e) => setQuery(e.target.value)}
          value={query}
          type='text' />
        <button className='cursor-pointer bg-blue-400 px-3 py-1 m-4'
          onClick={handleOnClick}
        >Ask</button>
      </div>
    </div>
  )
}

export default ChatBox
