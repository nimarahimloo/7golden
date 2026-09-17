import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import ReactMarkdown from 'react-markdown';

export default function SupportChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [conversationId, setConversationId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [starting, setStarting] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    if (!conversationId) return;
    const unsubscribe = base44.agents.subscribeToConversation(conversationId, (data) => {
      setMessages(data.messages || []);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [conversationId]);

  const handleOpen = async () => {
    setOpen(true);
    if (!conversationId) {
      setStarting(true);
      try {
        const conv = await base44.agents.createConversation({
          agent_name: 'support_agent',
          metadata: { name: 'پشتیبانی هفت‌طلایی' },
        });
        setConversationId(conv.id);
        setMessages(conv.messages || []);
      } catch (e) {
        console.error(e);
      }
      setStarting(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || !conversationId || loading) return;
    const text = input.trim();
    setInput('');
    setLoading(true);
    try {
      const conv = await base44.agents.getConversation(conversationId);
      await base44.agents.addMessage(conv, { role: 'user', content: text });
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating button */}
      {!open && (
        <button
          onClick={handleOpen}
          className="fixed z-50 w-14 h-14 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95"
          style={{
            bottom: 'calc(1.5rem + var(--safe-area-bottom))',
            left: 'calc(1.5rem + var(--safe-area-left))',
            background: 'var(--accent)',
            color: 'hsl(var(--accent-foreground))',
            boxShadow: '0 8px 32px rgba(212,175,55,0.4), inset 0 1px 1px rgba(255,255,255,0.2)',
          }}
          aria-label="پشتیبانی آنلاین"
        >
          <MessageCircle size={24} />
          <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full" style={{ background: '#22c55e', border: '2px solid var(--bg)' }} />
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div
          className="fixed z-50 w-[calc(100vw-3rem)] max-w-sm rounded-3xl flex flex-col overflow-hidden"
          style={{
            bottom: 'calc(1.5rem + var(--safe-area-bottom))',
            left: 'calc(1.5rem + var(--safe-area-left))',
            height: 'min(60vh, 520px)',
            background: 'var(--liquid-glass-strong-bg)',
            backdropFilter: 'blur(56px) saturate(260%)',
            WebkitBackdropFilter: 'blur(56px) saturate(260%)',
            border: '1px solid var(--liquid-glass-strong-border)',
            boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.15), 0 24px 64px rgba(0,0,0,0.4)',
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid var(--surface-border)' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.25)' }}>
                <MessageCircle size={18} style={{ color: 'var(--accent)' }} />
              </div>
              <div>
                <h3 className="font-heading font-black text-sm" style={{ color: 'var(--fg)', fontFamily: 'Peyda, serif' }}>پشتیبانی هفت‌طلایی</h3>
                <p className="font-body text-[10px] flex items-center gap-1" style={{ color: '#22c55e' }}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#22c55e' }} /> آنلاین
                </p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="w-8 h-8 rounded-full flex items-center justify-center glass-pill transition-all hover:scale-110" style={{ color: 'var(--fg)' }}>
              <X size={16} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
            {messages.length === 0 && !starting && (
              <div className="flex flex-col items-center text-center py-8 gap-3">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.15)' }}>
                  <MessageCircle size={24} style={{ color: 'var(--accent)' }} />
                </div>
                <p className="font-body text-xs" style={{ color: 'var(--fg-muted)' }}>
                  سلام! 👋 من دستیار هوشمند هفت‌طلایی هستم.<br />هر سوالی درباره محصولات، قیمت یا ارسال دارید بپرسید.
                </p>
              </div>
            )}
            {starting && (
              <div className="flex justify-center py-8">
                <div className="w-6 h-6 border-2 rounded-full animate-spin" style={{ borderColor: 'rgba(212,175,55,0.2)', borderTopColor: 'var(--accent)' }} />
              </div>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className="max-w-[80%] px-4 py-2.5 rounded-2xl"
                  style={{
                    background: msg.role === 'user' ? 'var(--accent)' : 'var(--surface-subtle)',
                    color: msg.role === 'user' ? 'hsl(var(--accent-foreground))' : 'var(--fg)',
                    border: msg.role === 'user' ? 'none' : '1px solid var(--surface-border)',
                    boxShadow: msg.role === 'user' ? '0 4px 16px rgba(212,175,55,0.2)' : 'inset 0 1px 1px rgba(255,255,255,0.05)',
                  }}
                >
                  {msg.role === 'user' ? (
                    <p className="font-body text-xs leading-relaxed">{msg.content}</p>
                  ) : (
                    <div className="font-body text-xs leading-relaxed prose prose-sm prose-invert max-w-none [&>*]:mb-1 [&>*:last-child]:mb-0">
                      <ReactMarkdown>{msg.content || ''}</ReactMarkdown>
                    </div>
                  )}
                  {msg.tool_calls?.map((tc, j) => (
                    <div key={j} className="mt-1.5 font-body text-[10px] opacity-60" style={{ color: 'var(--fg-muted)' }}>
                      ⚙ {tc.name}...
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="px-4 py-3 rounded-2xl" style={{ background: 'var(--surface-subtle)', border: '1px solid var(--surface-border)' }}>
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: 'var(--accent)', animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: 'var(--accent)', animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: 'var(--accent)', animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="px-4 py-3" style={{ borderTop: '1px solid var(--surface-border)' }}>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                placeholder="پیام خود را بنویسید..."
                disabled={loading || starting}
                className="flex-1 px-4 py-2.5 rounded-full text-xs font-body outline-none transition-all"
                style={{
                  background: 'var(--glass-input-bg)',
                  border: '1px solid var(--surface-border)',
                  color: 'var(--fg)',
                  boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.3)',
                }}
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || loading || starting}
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-105 active:scale-95 disabled:opacity-40"
                style={{ background: 'var(--accent)', color: 'hsl(var(--accent-foreground))', boxShadow: '0 4px 16px rgba(212,175,55,0.2)' }}
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}