import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Sparkles, Wand2 } from 'lucide-react';
import { ChatMessage } from '../types';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  isSending: boolean;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, onSendMessage, isSending }) => {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isSending]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isSending) return;
    onSendMessage(input);
    setInput('');
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border-l border-vintage-pink/20 shadow-xl transition-colors duration-300 overflow-hidden">
      {/* Header Panel */}
      <div className="px-6 py-5 border-b border-vintage-cream dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-vintage-teal text-white rounded-xl shadow-vibrant">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-vintage-teal dark:text-white leading-tight">BoardVision Copilot</h3>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-vintage-gold rounded-full animate-pulse"></span>
              <span className="text-[10px] text-vintage-teal/40 dark:text-slate-500 font-bold uppercase tracking-widest">Live Assistant</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Messaging Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-8 bg-vintage-cream/10 dark:bg-slate-950/20 scrollbar-thin"
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-10 animate-in fade-in duration-1000">
            <div className="w-20 h-20 bg-vintage-pink/10 dark:bg-slate-800 rounded-3xl flex items-center justify-center mb-6 animate-float">
              <Sparkles className="w-10 h-10 text-vintage-teal opacity-60" />
            </div>
            <p className="font-extrabold text-vintage-teal dark:text-slate-200 text-lg">AI Vision Companion</p>
            <p className="text-sm text-vintage-teal/50 dark:text-slate-500 mt-2 leading-relaxed">
              Ask questions about the logic, request refactoring, or just say hello. Copilot sees what you see.
            </p>
            <div className="grid grid-cols-1 gap-2 mt-8 w-full">
               {["Explain this better", "Optimize the code", "Check for bugs"].map((suggestion) => (
                  <button 
                    key={suggestion}
                    onClick={() => onSendMessage(suggestion)}
                    className="px-4 py-2 text-xs font-bold text-vintage-teal/60 dark:text-slate-400 bg-white dark:bg-slate-800 border border-vintage-pink/10 dark:border-slate-700 rounded-xl hover:border-vintage-teal hover:text-vintage-teal transition-all text-left flex items-center gap-2"
                  >
                    <Wand2 className="w-3 h-3" /> {suggestion}
                  </button>
               ))}
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm border ${
                msg.role === 'user' 
                  ? 'bg-vintage-teal border-vintage-teal text-white' 
                  : 'bg-white dark:bg-slate-800 border-vintage-pink/20 dark:border-slate-700 text-vintage-teal'
              }`}>
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              
              <div className={`rounded-2xl px-5 py-3 text-sm max-w-[88%] shadow-soft break-words ${
                msg.role === 'user' 
                  ? 'bg-vintage-teal text-white rounded-tr-none' 
                  : 'bg-white dark:bg-slate-800 text-vintage-teal dark:text-slate-200 rounded-tl-none border border-vintage-pink/20 dark:border-slate-700'
              }`}>
                 <div className={`markdown-content prose prose-sm prose-stone dark:prose-invert prose-p:leading-relaxed prose-pre:bg-slate-900 overflow-hidden ${msg.role === 'user' ? 'text-white' : 'text-vintage-teal dark:text-slate-200'}`}>
                   <ReactMarkdown 
                    remarkPlugins={[remarkMath]} 
                    rehypePlugins={[rehypeKatex]}
                   >
                    {msg.text}
                   </ReactMarkdown>
                 </div>
              </div>
            </div>
          ))
        )}
        {isSending && (
           <div className="flex gap-4">
             <div className="w-9 h-9 rounded-xl bg-white dark:bg-slate-800 border border-vintage-pink/20 dark:border-slate-700 flex items-center justify-center shrink-0 shadow-sm">
               <Bot className="w-4 h-4 text-vintage-teal" />
             </div>
             <div className="bg-white dark:bg-slate-800 rounded-2xl rounded-tl-none px-5 py-4 flex items-center border border-vintage-pink/20 dark:border-slate-700 shadow-sm">
               <div className="flex gap-1.5">
                 <span className="w-2 h-2 bg-vintage-teal/40 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                 <span className="w-2 h-2 bg-vintage-teal/70 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                 <span className="w-2 h-2 bg-vintage-teal rounded-full animate-bounce"></span>
               </div>
             </div>
           </div>
        )}
      </div>

      {/* Input Bar */}
      <form onSubmit={handleSubmit} className="p-5 bg-white dark:bg-slate-900 border-t border-vintage-cream dark:border-slate-800 shrink-0">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="w-full bg-vintage-cream/20 dark:bg-slate-800 border-2 border-vintage-pink/10 dark:border-slate-700 rounded-2xl pl-5 pr-14 py-4 text-sm font-semibold focus:outline-none focus:border-vintage-teal focus:bg-white dark:focus:bg-slate-950 transition-all text-vintage-teal dark:text-white placeholder-vintage-teal/20 shadow-inner-soft"
            disabled={isSending}
          />
          <button
            type="submit"
            disabled={!input.trim() || isSending}
            className="absolute right-2 bg-vintage-teal hover:bg-vintage-tealHover text-white p-3 rounded-xl disabled:opacity-50 transition-all shadow-vibrant active:scale-95"
          >
            {isSending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;