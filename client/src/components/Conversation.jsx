import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthProvider.jsx';
import { BotMessageSquare, Send, Sparkles, User } from 'lucide-react';
import MarkdownMessage from './MarkdownMessage.jsx';

const Conversation = ({ workspaceId, activePdfs }) => {
  const sourcesLen = activePdfs.length;
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [userQuery, setUserQuery] = useState("");
  const messageEndRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);


  useEffect(() => {
    const fetchOldMessages = async () => {
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/workspace/${workspaceId}/chats`, {
        headers: {
          "authorization": `Bearer ${localStorage.getItem('jwt-token')}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error);
      }

      setMessages(data.chats);
    }

    fetchOldMessages();
  }, [workspaceId]);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!userQuery.trim()) return;
    const tempId = Date.now().toString();

    const tempUserQuery = {
      '_id': tempId,
      'role': 'user',
      'content': userQuery,
      'createdAt': new Date().toDateString(),
    };
    setUserQuery("");

    setMessages(prev => [...prev, tempUserQuery]);

    try {
      setIsLoading(true);
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/workspace/${workspaceId}/chats`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "authorization": `Bearer ${localStorage.getItem('jwt-token')}`,
        },
        body: JSON.stringify({
          query: tempUserQuery.content,
          activePdfs
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message);
      }

      setMessages(prev => {
        const filtered = prev.filter(message => message._id !== tempId);
        return [...filtered, ...data.newMessages];
      });

    } catch (error) {
      console.log(error.message);

    }
    finally {
      setIsLoading(false);
    }

  };

  return (
    <div className='flex flex-col justify-between border-2 h-full rounded-xl border-[#4b4b4b] bg-[#1a1a1a] w-full relative'>

      <div className="flex justify-between items-center p-4 border-b-2 border-[#4b4b4b] shrink-0">
        <span>Chat</span>
      </div>

      {/* messages section */}
      <div className='flex-1 overflow-y-auto p-4 flex flex-col custom-scrollbar'>
        {
          messages?.map((message) => {
            return (
              <div key={message._id} className={`flex my-4 items-start gap-3 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>

                <div className={`w-10 h-10 shrink-0 rounded-full border flex items-center justify-center text-xs font-bold overflow-hidden ${message.role === 'user'
                  ? 'bg-zinc-100 text-black border-zinc-300'
                  : 'bg-blue-600 text-white border-blue-500'
                  }`}>
                  {message.role === 'user' ? <User /> : <BotMessageSquare />}
                </div>
                <div className={`flex flex-col gap-1 max-w-[80%] ${message.role === 'user' ? 'items-end' : 'items-start'}`}>

                  <div className={` border p-2 rounded-2xl ${message.role === 'user' ? 'bg-zinc-800 text-white rounded-tr-none' : ' text-zinc-200 border border-[#333] rounded-tl-none'}`}>

                    {/* message.content inside markdown */}
                    <MarkdownMessage content={message.content} />

                  </div>

                  <span className="text-[10px] text-zinc-600 px-1">
                    {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' })}
                  </span>
                </div>
              </div>
            )
          })
        }
        {
          isLoading && (
            <div className="flex items-start gap-3 my-4 flex-row animate-pulse">
              <div className="w-10 h-10 shrink-0 rounded-full border flex items-center justify-center bg-blue-600 text-white border-blue-500">
                <BotMessageSquare size={20} />
              </div>

              <div className="flex flex-col gap-1 items-start">
                <div className="bg-[#222] text-zinc-400 border border-[#333] p-3 rounded-2xl rounded-tl-none flex gap-1">
                  <span className="animate-bounce [animation-delay:-0.3s]">.</span>
                  <span className="animate-bounce [animation-delay:-0.15s]">.</span>
                  <span className="animate-bounce">.</span>
                </div>
              </div>
            </div>
          )
        }
        <div ref={messageEndRef}> </div>
      </div>

      {/* input section */}
      <div className="shrink-0 m-4 mt-2 flex relative group">
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