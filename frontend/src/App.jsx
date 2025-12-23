import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  Plus, Trash2, Send, MessageSquare, Bot, User,
  Hash, LogOut, Lock, UserCircle, ChevronRight
} from 'lucide-react';

const API_BASE = "http://127.0.0.1:8000";

function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("chat_user")) || null);
  const [isLoginView, setIsLoginView] = useState(true);
  const [authData, setAuthData] = useState({ username: "", password: "" });

  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (user) fetchConvos();
  }, [user]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (activeId) {
      axios.get(`${API_BASE}/history/${activeId}`).then(res => setMessages(res.data));
    }
  }, [activeId]);

  // Auth Logic 
  const handleAuth = async (e) => {
    e.preventDefault();
    const endpoint = isLoginView ? "/login" : "/register";

    try {
      // Send data as a JSON object (Body)
      const res = await axios.post(`${API_BASE}${endpoint}`, {
        username: authData.username,
        password: authData.password
      });

      if (isLoginView) {
        localStorage.setItem("chat_user", JSON.stringify(res.data));
        setUser(res.data);
      } else {
        alert("Registration successful! Please sign in.");
        setIsLoginView(true);
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.detail || "Auth Error - Check console");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("chat_user");
    setUser(null);
    setActiveId(null);
    setMessages([]);
  };

  // Chat Logic
  const fetchConvos = async () => {
    const res = await axios.get(`${API_BASE}/conversations/${user.id}`);
    setConversations(res.data);
  };

  const startNewChat = async () => {
    const res = await axios.post(`${API_BASE}/conversations/${user.id}`);
    setActiveId(res.data.id);
    fetchConvos();
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input || !activeId) return;

    const userMsg = input;
    setInput("");
    setMessages(prev => [...prev, { sender: 'user', content: userMsg }]);
    setLoading(true);

    try {
      await axios.post(`${API_BASE}/chat/${activeId}?user_message=${encodeURIComponent(userMsg)}`);
      const res = await axios.get(`${API_BASE}/history/${activeId}`);
      setMessages(res.data);
    } finally {
      setLoading(false);
    }
  };

  // Rendering Login screen 
  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#0A0A0A] text-white font-sans">
        <div className="w-full max-w-md p-8 bg-[#141414] border border-white/5 rounded-[2rem] shadow-2xl relative overflow-hidden">
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-blue-600/20 blur-[100px]"></div>

          <div className="relative z-10">
            <div className="text-center mb-10">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-blue-600/20">
                <Bot size={32} />
              </div>
              <h1 className="text-3xl font-bold tracking-tight">
                {isLoginView ? "Welcome Back" : "Get Started"}
              </h1>
              <p className="text-gray-500 mt-2 text-sm font-medium">
                {isLoginView ? "Sign in to access your private chats" : "Create an account to save conversations"}
              </p>
            </div>

            <form onSubmit={handleAuth} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500 ml-1">Username</label>
                <div className="relative">
                  <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <input
                    type="text" required
                    className="w-full bg-[#1D1D1D] border border-white/5 p-4 pl-12 rounded-2xl focus:border-blue-500 outline-none transition-all"
                    placeholder="Enter username"
                    onChange={(e) => setAuthData({ ...authData, username: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500 ml-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <input
                    type="password" required
                    className="w-full bg-[#1D1D1D] border border-white/5 p-4 pl-12 rounded-2xl focus:border-blue-500 outline-none transition-all"
                    placeholder="••••••••"
                    onChange={(e) => setAuthData({ ...authData, password: e.target.value })}
                  />
                </div>
              </div>

              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 py-4 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 group">
                {isLoginView ? "Sign In" : "Register Now"}
                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            <button
              onClick={() => setIsLoginView(!isLoginView)}
              className="w-full mt-6 text-sm text-gray-500 hover:text-white transition-colors text-center"
            >
              {isLoginView ? "Don't have an account? Sign Up" : "Already have an account? Log In"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Rendering chat interface
  return (
    <div className="flex h-screen bg-[#0F0F0F] text-gray-100 overflow-hidden">
      {/* SIDEBAR */}
      <div className="w-72 bg-[#080808] border-r border-white/5 flex flex-col">
        <div className="p-4">
          <button onClick={startNewChat} className="w-full flex items-center justify-center gap-2 bg-white text-black font-bold py-3.5 rounded-2xl hover:bg-gray-200 transition-all">
            <Plus size={18} /> New Chat
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 space-y-1">
          {conversations.map(c => (
            <div key={c.id} onClick={() => setActiveId(c.id)} className={`group flex items-center justify-between p-3.5 rounded-xl cursor-pointer transition-all ${activeId === c.id ? 'bg-[#1D1D1D]' : 'hover:bg-[#121212]'}`}>
              <div className="flex items-center gap-3">
                <Hash size={14} className="text-gray-600" />
                <span className="text-sm font-medium">Chat session #{c.id}</span>
              </div>
              <Trash2 size={14} className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-red-500 transition-all" />
            </div>
          ))}
        </div>


        {/* Sidebar footer  */}
        <div className="mt-auto p-4 border-t border-white/5 bg-[#050505]">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-xs font-bold shadow-lg">
              {user.username ? user.username[0].toUpperCase() : "U"}
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-semibold truncate">{user.username}</span>
              <span className="text-[10px] text-gray-500 uppercase tracking-tighter">Pro Member</span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-all text-sm font-medium group"
          >
            <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span>Log Out</span>
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col relative">
        {!activeId ? (
          <div className="flex-1 flex items-center justify-center opacity-20">
            <MessageSquare size={80} />
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-6 md:p-12 space-y-6">
              {messages.map((m, i) => (
                <div key={i} className={`flex gap-4 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {m.sender !== 'user' && <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0"><Bot size={18} /></div>}
                  <div className={`max-w-xl p-4 rounded-2xl text-[15px] leading-relaxed ${m.sender === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-[#1D1D1D] border border-white/5 rounded-tl-none'}`}>
                    {m.content}
                  </div>
                  {m.sender === 'user' && <div className="w-8 h-8 rounded-lg bg-gray-700 flex items-center justify-center flex-shrink-0"><User size={18} /></div>}
                </div>
              ))}
              {loading && <div className="text-xs text-gray-500 animate-pulse ml-12 italic">Bot is thinking...</div>}
              <div ref={scrollRef} />
            </div>

            <div className="p-6 bg-gradient-to-t from-[#0F0F0F] to-transparent">
              <form onSubmit={sendMessage} className="max-w-3xl mx-auto flex gap-2 bg-[#1D1D1D] p-2 rounded-2xl border border-white/5 focus-within:border-blue-600/50 transition-all">
                <input
                  value={input} onChange={(e) => setInput(e.target.value)}
                  className="flex-1 bg-transparent p-3 outline-none"
                  placeholder="Ask your local bot anything..."
                />
                <button type="submit" disabled={!input} className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-500 disabled:opacity-20 transition-all">
                  <Send size={18} />
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;