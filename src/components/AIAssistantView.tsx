import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  Bot,
  User,
  Trash2,
  HelpCircle,
  ShieldCheck,
  Zap,
  Calendar,
  CreditCard,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { askAIAssistant } from '../services/aiEngine';
import { store } from '../services/store';
import { ChatMessage, User as UserType } from '../types';

interface AIAssistantViewProps {
  currentUser: UserType;
}

export const AIAssistantView: React.FC<AIAssistantViewProps> = ({ currentUser }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'msg-1',
      sender: 'assistant',
      text: `Hello ${currentUser.fullName}! I'm DayFlow AI, your personal HR, workday, and wellbeing assistant. How can I help you today? You can ask me about your leave balances, attendance logs, company benefits, or request tips for workload pacing.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      category: 'general'
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  const quickPrompts = [
    'How many paid leaves do I have left?',
    'What was my net salary in my latest payslip?',
    'What is my attendance rate this month?',
    'Explain the company health insurance and 401(k) matching',
    'Give me a tip to prevent afternoon fatigue',
    'How do I submit an emergency leave request?'
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query || isThinking) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsThinking(true);

    // Call DayFlow AI Engine
    const aiResponse = await askAIAssistant(query, currentUser, store);

    const assistantMsg: ChatMessage = {
      id: `ai-${Date.now()}`,
      sender: 'assistant',
      text: aiResponse.text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      category: (aiResponse.category as any) || 'general'
    };

    setMessages((prev) => [...prev, assistantMsg]);
    setIsThinking(false);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        text: `Conversation cleared. Ready for your next HR or workday question, ${currentUser.fullName}!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        category: 'general'
      }
    ]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">DayFlow AI Copilot & Knowledge Assistant</h1>
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-indigo-100 text-indigo-800">
              Active Neural Engine
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Instant answers on company HR policies, compensation, leave balances, and workday analytics.
          </p>
        </div>

        <button
          onClick={handleClearChat}
          className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
        >
          <Trash2 className="w-3.5 h-3.5 text-slate-400" />
          <span>Clear Chat</span>
        </button>
      </div>

      {/* Main Chat Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden flex flex-col h-[580px]">
        {/* Chat Header */}
        <div className="p-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/30 text-sky-300 border border-indigo-400/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-sm">DayFlow HR Intelligent Assistant</h2>
              <p className="text-[11px] text-slate-300">Grounded in DayFlow company handbook & employee record</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Private & Confidential</span>
          </div>
        </div>

        {/* Quick Prompts Carousel */}
        <div className="p-3 bg-slate-50 border-b border-slate-100 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-[11px] font-bold text-slate-500 shrink-0">Suggestions:</span>
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(p)}
              className="px-3 py-1 bg-white hover:bg-indigo-50 hover:border-indigo-200 border border-slate-200 rounded-full text-slate-700 font-medium whitespace-nowrap transition-colors text-[11px] shadow-2xs"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Message Stream */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-50/40 text-xs">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  msg.sender === 'user'
                    ? 'bg-slate-900 text-white'
                    : 'bg-gradient-to-tr from-indigo-600 to-sky-500 text-white shadow-2xs'
                }`}
              >
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-xl p-4 rounded-2xl leading-relaxed space-y-1.5 ${
                  msg.sender === 'user'
                    ? 'bg-indigo-600 text-white rounded-tr-none shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-2xs'
                }`}
              >
                <div className="flex items-center justify-between gap-4 text-[10px] opacity-70">
                  <span className="font-semibold">{msg.sender === 'user' ? currentUser.fullName : 'DayFlow AI'}</span>
                  <span>{msg.timestamp}</span>
                </div>
                <div className="text-xs whitespace-pre-wrap">{msg.text}</div>

                {msg.category && msg.sender === 'assistant' && (
                  <div className="pt-1 flex items-center gap-1.5 text-[10px] text-indigo-600 font-medium">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                    <span>Verified DayFlow Policy Source</span>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isThinking && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-sky-500 text-white flex items-center justify-center shadow-2xs">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-3.5 bg-white border border-slate-200 rounded-2xl rounded-tl-none shadow-2xs flex items-center gap-2 text-xs text-slate-500">
                <Sparkles className="w-4 h-4 text-indigo-600 animate-spin" />
                <span>DayFlow AI is analyzing policies & records...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-3.5 bg-white border-t border-slate-200 flex items-center gap-2"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ask DayFlow AI about leaves, salary breakdown, working hours, or company policies..."
            className="flex-1 px-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          />

          <button
            type="submit"
            disabled={!inputQuery.trim() || isThinking}
            className="p-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl shadow-md shadow-indigo-600/20 transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
