import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthProvider.jsx';
import { BotMessageSquare, Send, Sparkles, User } from 'lucide-react';

const Conversation = ({ workspaceId, sourcesLen }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [userQuery, setUserQuery] = useState("");

  const messagess = [
    {
      "workspaceId": "695f5d884d46970f865a082c",
      "userId": "6954110abafb245d024fae67",
      "role": "user",
      "content": "What are the main components of my PaperWise project architecture?",
      "createdAt": "2026-01-22T12:00:00.000Z"
    },
    {
      "workspaceId": "695f5d884d46970f865a082c",
      "userId": "6954110abafb245d024fae67",
      "role": "assistant",
      "content": "PaperWise uses a RAG (Retrieval-Augmented Generation) stack. The frontend is built with React and Tailwind CSS. The backend uses Node.js and Express, which communicates with MongoDB Atlas for both document metadata and vector storage. For the AI logic, you are using LangChain and Gemini for processing PDF context and generating answers.",
      "createdAt": "2026-01-22T12:00:05.000Z"
    },
    {
      "workspaceId": "695f5d884d46970f865a082c",
      "userId": "6954110abafb245d024fae67",
      "role": "user",
      "content": "How does the vector search work when I select specific PDFs?",
      "createdAt": "2026-01-22T12:05:00.000Z"
    },
    {
      "workspaceId": "695f5d884d46970f865a082c",
      "userId": "6954110abafb245d024fae67",
      "role": "assistant",
      "content": "When you select specific PDFs in the sidebar, your backend sends an array of PDF IDs to the vector search query. MongoDB then applies a 'pre-filter' to only look at chunks belonging to those IDs. It then performs a cosine similarity search between your question's vector and the filtered chunks to find the most relevant context.",
      "createdAt": "2026-01-22T12:05:10.000Z"
    },
    {
      "workspaceId": "695f5d884d46970f865a082c",
      "userId": "6954110abafb245d024fae67",
      "role": "user",
      "content": "Can I add YouTube transcripts as a source as well?",
      "createdAt": "2026-01-22T12:10:00.000Z"
    },
    {
      "workspaceId": "695f5d884d46970f865a082c",
      "userId": "6954110abafb245d024fae67",
      "role": "assistant",
      "content": "Yes, by integrating youtubei.js, you can fetch video transcripts, chunk them using LangChain, and store them as vectors in MongoDB. This allows you to chat with video content just like you do with PDF documents.",
      "createdAt": "2026-01-22T12:10:08.000Z"
    }
  ]

  useEffect(() => {
    const fetchOldMessages = async () => {
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/workspace/${workspaceId}/chats`, {
        headers: {
          "authorization": `Bearer ${localStorage.getItem('jwt-token')}`
        }
      });

      const data = await response.json();

      console.log("get chats", data);

    }

    fetchOldMessages();
  }, []);

  const handleSendMessage = (e) => {
    e.preventDefault();
    console.log("clicked")
  }
  return (
    <div className='flex flex-col justify-between border-2 h-full rounded-xl border-[#4b4b4b] bg-[#1a1a1a] w-full relative'>
      <div className="flex justify-between items-center p-4 border-b-2 border-[#4b4b4b] shrink-0">
        <span>Chat</span>
      </div>

      <div className='flex-1 overflow-y-auto p-4 flex flex-col'>
        {
          messagess.map((message, i) => {
            return (
              <div key={i} className={`flex my-4 items-start gap-3 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>

                <div className={`w-10 h-10 shrink-0 rounded-full border flex items-center justify-center text-xs font-bold overflow-hidden ${message.role === 'user'
                  ? 'bg-zinc-100 text-black border-zinc-300'
                  : 'bg-blue-600 text-white border-blue-500'
                  }`}>
                  {message.role === 'user' ? <User /> : <BotMessageSquare />}
                </div>
                <div className={`flex flex-col gap-1 max-w-[80%] ${message.role === 'user' ? 'items-end' : 'items-start'}`}>

                  <div className={` border p-2 rounded-2xl ${message.role === 'user' ? 'bg-zinc-800 text-white rounded-tr-none' : 'g-[#222] text-zinc-200 border border-[#333] rounded-tl-none'}`}>
                    {message.content}
                  </div>

                  <span className="text-[10px] text-zinc-600 px-1">
                    {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' })}
                  </span>
                </div>
              </div>
            )
          })
        }
      </div>

      <div className="m-4 mt-2 flex relative group">
        <form onSubmit={handleSendMessage} className="w-full relative">
          <input
            type="text"
            value={userQuery}
            onChange={(e) => setUserQuery(e.target.value)}
            placeholder={sourcesLen > 0 ? "Ask your questions here..." : "Select a source to start chatting"}
            className="w-full bg-[#111111] border border-[#2a2a2a] text-zinc-200 rounded-2xl py-3 px-6 pr-44 outline-none focus:border-[#444] focus:ring-1 focus:ring-[#333] transition-all placeholder:text-zinc-600"
          />

          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-3">

            <div className={`flex items-center  gap-1.5 px-3 py-1.5 rounded-xl border transition-all duration-500 ${sourcesLen > 0 ? 'bg-zinc-800/50 border-zinc-700 text-zinc-300' : 'bg-transparent border-zinc-800 text-zinc-600'
              }`}>

              <span className="text-[12px] font-semibold tracking-widest tabular-nums">
                {sourcesLen} {sourcesLen === 1 ? 'source' : 'sources'}
              </span>
            </div>

            <button
              type="submit"
              disabled={sourcesLen === 0 || !userQuery.trim()}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-zinc-100 text-black transition-all duration-300 hover:bg-white hover:scale-110 active:scale-90 disabled:bg-zinc-900 disabled:text-zinc-700 disabled:scale-100 disabled:cursor-not-allowed cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>

    </div >
  )
}

export default Conversation;