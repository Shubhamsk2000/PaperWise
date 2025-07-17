"use client";
import React, { useState, useRef, useEffect } from "react";
import { Send, Paperclip } from "lucide-react";
import Markdown from "react-markdown";

type IMessage = {
  role: "user" | "assistant";
  content?: string;
};

const ChatBox = () => {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<IMessage[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);

  const handleOnClick = async () => {
    setLoading(true);
    const qu = query;
    if (!qu.trim()) return;
    setQuery("");
    setMessages((prev) => [
      ...prev,
      { role: "user", content: qu },
    ]);

    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: qu }),
    });
    const data = await response.json();
    const ai_response =
      data.assistant_response?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "⚠️ No response received from AI.";

    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: ai_response },
    ]);
    setLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleOnClick();
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div
      className="w-full h-full flex flex-col  rounded-tl-4xl rounded-bl-4xl  overflow-hidden shadow-2xl"
      style={{
        background: 'linear-gradient(135deg, #FFFBFC 0%, #F8F9FA 100%)',
        fontFamily: 'Inter, sans-serif'
      }}
    >
      {/* Chat Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center mr-4 shadow-lg"
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }}
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 text-lg">AI Assistant</h3>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
              <p className="text-sm text-gray-500">Ready to chat</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Messages Area */}
      <div
        className="flex-1 overflow-y-auto p-6 space-y-6"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(0,0,0,0.1) transparent',

        }}
      >
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                </svg>
              </div>
              <p className="text-gray-500 text-lg font-medium">Start chatting with your PDF...</p>
              <p className="text-gray-400 text-sm mt-2">Ask me anything about your document! ✨</p>
            </div>
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`flex items-start ${message.role === "user" ? "justify-end" : ""} animate-fadeIn`}
              style={{
                animation: `messageSlide 0.3s ease-out ${index * 0.1}s both`
              }}
            >
              {message.role === "assistant" && (
                <div
                  className="w-10 h-10 rounded-2xl flex items-center justify-center mr-4 shadow-md"
                  style={{
                    background: 'linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%)'
                  }}
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                </div>
              )}

              <div
                className={`max-w-2/3 px-6 py-4 rounded-3xl shadow-lg transition-all duration-200 hover:-translate-y-1 ${message.role === "assistant"
                    ? "bg-white rounded-tl-lg"
                    : "bg-black text-white rounded-tr-lg"
                  }`}
              >
                <span className={`font-medium ${message.role === "assistant" ? "text-gray-800" : "text-white"}`}>
                 <Markdown>{message.content}</Markdown> 
                </span>
                <span className={`text-xs mt-2 block ${message.role === "assistant" ? "text-gray-400" : "text-gray-300"}`}>
                  {getCurrentTime()}
                </span>
              </div>

              {message.role === "user" && (
                <div
                  className="w-10 h-10 rounded-2xl flex items-center justify-center ml-4 shadow-md"
                  style={{
                    background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)'
                  }}
                >
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                </div>
              )}
            </div>
          ))
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Message Input Area */}
      <div className="p-6 border-t border-gray-100">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Type your message..."
              className="w-full px-6 py-4 bg-white rounded-2xl focus:outline-none border border-gray-100 shadow-md font-medium transition-all duration-200"
              style={{
                boxShadow: 'focus:0 0 0 3px rgba(0, 0, 0, 0.1)'
              }}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <Paperclip size={20} />
            </button>
          </div>
          <button
            onClick={handleOnClick}
            disabled={!query.trim()}
            className="px-8 py-4 rounded-2xl font-semibold shadow-lg transition-all duration-300 hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            style={{
              background: 'linear-gradient(135deg, #1a1a1a 0%, #000 100%)',
              color: 'white',
              boxShadow: query.trim() ? '0 10px 25px rgba(0, 0, 0, 0.2)' : '0 4px 15px rgba(0, 0, 0, 0.1)'
            }}
          >
            <Send size={20} />
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes messageSlide {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default ChatBox;