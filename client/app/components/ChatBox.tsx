"use client";
import React, { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
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
  const [error, setError] = useState<string | null>(null);

  const handleOnClick = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    setError(null);
    const qu = query;
    setQuery("");
    
    // Add user message immediately
    setMessages((prev) => [
      ...prev,
      { role: "user", content: qu },
    ]);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: qu }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const ai_response =
        data.assistant_response?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "⚠️ No response received from AI.";

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: ai_response },
      ]);
    } catch (err) {
      let errorMessage = "An unexpected error occurred";
      
      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          errorMessage = "Request timed out. Please try again.";
        } else if (err.message.includes('Failed to fetch')) {
          errorMessage = "Network error. Please check your connection.";
        } else {
          errorMessage = err.message;
        }
      }
      
      setError(errorMessage);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "❌ Sorry, I encountered an error while processing your request. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading) {
      handleOnClick();
    }
  };

  const retryLastMessage = () => {
    if (messages.length > 0) {
      const lastUserMessage = [...messages].reverse().find(msg => msg.role === "user");
      if (lastUserMessage) {
        setQuery(lastUserMessage.content || "");
        setError(null);
      }
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
      className="w-full h-full flex flex-col rounded-tl-4xl rounded-bl-4xl overflow-hidden shadow-2xl chat-container"
    >
      {/* Chat Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center mr-4 shadow-lg ai-avatar"
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
        className="flex-1 overflow-y-auto p-6 space-y-6 chat-messages"
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
          <>
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex items-start ${message.role === "user" ? "justify-end" : ""} animate-fadeIn message-slide`}
                data-index={index}
              >
                {message.role === "assistant" && (
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center mr-4 shadow-md assistant-avatar"
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
                    className="w-10 h-10 rounded-2xl flex items-center justify-center ml-4 shadow-md user-avatar"
                  >
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                  </div>
                )}
              </div>
            ))}
            
            {/* Loading Indicator */}
            {loading && (
              <div className="flex items-start animate-fadeIn">
                <div
                  className="w-10 h-10 rounded-2xl flex items-center justify-center mr-4 shadow-md assistant-avatar"
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <div className="max-w-2/3 px-6 py-4 rounded-3xl shadow-lg bg-white rounded-tl-lg">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce loading-dot-1"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce loading-dot-2"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce loading-dot-3"></div>
                    </div>
                    <span className="text-gray-500 text-sm font-medium">AI is thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        
        {/* Error Display */}
        {error && (
          <div className="mx-4 p-4 bg-red-50 border border-red-200 rounded-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.732 15.5c-.77.833.192 2.5 1.732 2.5z"></path>
                </svg>
                <div>
                  <p className="text-red-800 font-medium">Connection Error</p>
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={retryLastMessage}
                  className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-sm hover:bg-red-200 transition-colors"
                >
                  Retry
                </button>
                <button 
                  onClick={() => setError(null)}
                  className="text-red-500 hover:text-red-700"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
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
              className="w-full px-6 py-4 bg-white rounded-2xl focus:outline-none border border-gray-100 shadow-md font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed message-input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
            />
          
          </div>
          <button
            onClick={handleOnClick}
            disabled={!query.trim() || loading}
            className={`px-8 py-4 rounded-2xl font-semibold shadow-lg transition-all duration-300 hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center send-button cursor-pointer ${query.trim() && !loading ? 'send-button-active' : ''}`}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin "></div>
            ) : (
              <Send size={20} />
            )}
          </button>
        </div>
      </div>

      <style jsx>{`
        .chat-container {
          background: linear-gradient(135deg, #FFFBFC 0%, #F8F9FA 100%);
          font-family: 'Inter', sans-serif;
        }

        .ai-avatar {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .assistant-avatar {
          background: linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%);
        }

        .user-avatar {
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
        }

        .chat-messages {
          scrollbar-width: thin;
          scrollbar-color: rgba(0,0,0,0.1) transparent;
        }

        .message-input:focus {
          box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.1);
        }

        .send-button {
          background: linear-gradient(135deg, #1a1a1a 0%, #000 100%);
          color: white;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          min-width: 80px;
        }

        .send-button-active {
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        }

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

        .message-slide {
          animation: messageSlide 0.3s ease-out both;
        }

        .message-slide[data-index="0"] {
          animation-delay: 0s;
        }

        .message-slide[data-index="1"] {
          animation-delay: 0.1s;
        }

        .message-slide[data-index="2"] {
          animation-delay: 0.2s;
        }

        .message-slide[data-index="3"] {
          animation-delay: 0.3s;
        }

        .message-slide[data-index="4"] {
          animation-delay: 0.4s;
        }

        .loading-dot-1 {
          animation-delay: 0ms;
        }

        .loading-dot-2 {
          animation-delay: 150ms;
        }

        .loading-dot-3 {
          animation-delay: 300ms;
        }
      `}</style>
    </div>
  );
};

export default ChatBox;