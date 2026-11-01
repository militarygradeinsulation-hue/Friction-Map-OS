import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bot, 
  Send, 
  X, 
  Sparkles, 
  Loader2, 
  MessageSquare, 
  ArrowRight,
  Maximize2,
  Minimize2,
  RotateCcw
} from 'lucide-react';
import { IndustryData } from '../data/mockData';

interface Message {
  role: 'user' | 'model';
  text: string;
}

interface FrictionChatbotProps {
  activeScan: IndustryData | null;
  isOpen: boolean;
  onClose: () => void;
  externalPrompt?: string | null;
  onClearExternalPrompt?: () => void;
}

export function FrictionChatbot({
  activeScan,
  isOpen,
  onClose,
  externalPrompt,
  onClearExternalPrompt,
}: FrictionChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      text: `Hello! I am your **Friction Radar Copilot**. I have analyzed your diagnostic scan${
        activeScan?.targetUrl ? ` for **${activeScan.targetUrl}**` : activeScan?.industry ? ` for **${activeScan.industry}**` : ''
      }. 

Ask me anything—such as how to fix specific conversion leaks, copy recommendations to boost quote requests, or a 30-day execution plan for automating manual processes.`,
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Handle external prompt injection (e.g. clicking "Consult AI" on a friction point)
  useEffect(() => {
    if (externalPrompt && externalPrompt.trim()) {
      handleSend(externalPrompt);
      if (onClearExternalPrompt) onClearExternalPrompt();
    }
  }, [externalPrompt]);

  const handleSend = async (textToSend?: string) => {
    const userQuery = textToSend || input;
    if (!userQuery.trim() || isLoading) return;

    const newMessages: Message[] = [...messages, { role: 'user', text: userQuery }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          context: activeScan,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to get response from Friction Radar Copilot.');
      }

      const data = await res.json();
      setMessages([...newMessages, { role: 'model', text: data.text || 'No response generated.' }]);
    } catch (err: any) {
      setMessages([
        ...newMessages,
        {
          role: 'model',
          text: `**Notice:** ${err.message || 'Error communicating with assistant. Please try again.'}`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const starterSuggestions = [
    'How do I fix our biggest conversion leak?',
    'Write high-converting hero copy for our site',
    'What is the 30-day plan to automate quoting?',
    'Calculate ROI for fixing lead response delay',
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.95 }}
          className={`fixed z-50 bottom-4 right-4 ${
            isExpanded ? 'w-[94vw] max-w-3xl h-[85vh]' : 'w-[92vw] max-w-md h-[580px]'
          } bg-zinc-950 border border-zinc-500/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden backdrop-blur-xl transition-all duration-200`}
        >
          {/* Header */}
          <div className="p-4 bg-zinc-900 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-zinc-500/20 border border-zinc-500/40 flex items-center justify-center text-zinc-400">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5 uppercase tracking-wider">
                  Friction Radar Copilot
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-pulse" />
                </h4>
                <p className="text-[11px] text-zinc-400 truncate max-w-[200px]">
                  {activeScan?.targetUrl || activeScan?.industry || 'Business Friction Advisor'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() =>
                  setMessages([
                    {
                      role: 'model',
                      text: `Conversation reset. How can I help optimize your business friction profile?`,
                    },
                  ])
                }
                className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
                title="Reset conversation"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer hidden sm:block"
                title={isExpanded ? 'Minimize' : 'Expand'}
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
                title="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.role === 'model' && (
                  <div className="w-6 h-6 rounded-md bg-zinc-500/10 border border-zinc-500/20 text-zinc-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-xl p-3 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                    m.role === 'user'
                      ? 'bg-zinc-500 text-zinc-950 font-medium'
                      : 'bg-zinc-900 border border-white/5 text-zinc-200'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2.5 justify-start">
                <div className="w-6 h-6 rounded-md bg-zinc-500/10 border border-zinc-500/20 text-zinc-400 flex items-center justify-center shrink-0">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                </div>
                <div className="bg-zinc-900 border border-white/5 text-zinc-400 rounded-xl p-3 text-xs flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-ping" />
                  Synthesizing operational recommendations...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Starter Chips */}
          {messages.length <= 2 && (
            <div className="px-4 py-2 border-t border-white/5 bg-zinc-950/50 flex flex-wrap gap-1.5">
              {starterSuggestions.map((prompt, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSend(prompt)}
                  disabled={isLoading}
                  className="text-[11px] bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-zinc-400 border border-white/5 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span>{prompt}</span>
                  <ArrowRight className="w-2.5 h-2.5 opacity-60" />
                </button>
              ))}
            </div>
          )}

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-zinc-900 border-t border-white/10 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Copilot about any friction point..."
              disabled={isLoading}
              className="flex-1 bg-zinc-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-500"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-zinc-500 hover:bg-zinc-400 active:bg-zinc-600 disabled:opacity-40 text-zinc-950 p-2.5 rounded-xl font-bold transition-all shrink-0 cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
