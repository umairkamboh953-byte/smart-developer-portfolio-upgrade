import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, Send, Sparkles, MessageSquare, ArrowRight, ExternalLink } from 'lucide-react';
import { PublicSettings } from '../types';

interface FloatingChatbotProps {
  settings: PublicSettings;
  hideWhenModalOpen?: boolean;
}

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  time: string;
  actionUrl?: string;
  actionLabel?: string;
}

export const FloatingChatbot: React.FC<FloatingChatbotProps> = ({
  settings,
  hideWhenModalOpen = false,
}) => {
  const [mounted, setMounted] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showGreetingBubble, setShowGreetingBubble] = useState(false);
  const [isBuiltInChatOpen, setIsBuiltInChatOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const robotAvatarUrl = '/assets/images/cute-robot.jpg';
  const whatsappNumber = (settings.whatsappNumber || '+923098569707').replace(/[^0-9]/g, '');

  useEffect(() => {
    setMounted(true);

    // Initial welcome message for built-in assistant
    setMessages([
      {
        id: 'msg-1',
        sender: 'bot',
        text: 'Hello there! 👋 I am your Smart Developer AI Assistant. How can I help you today? Ask me about our ready-made demo websites, source code purchase, or custom web projects.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);

    // Show a friendly greeting callout after 2.5 seconds
    const timer = setTimeout(() => {
      setShowGreetingBubble(true);
    }, 2500);

    // Actively purge any default blank Botpress launcher in Light DOM and ShadowRoots
    const purgeBlankFab = () => {
      document.querySelectorAll('.bpFabWrapper, .bpFab, [data-name="fab"], .bpFabContainer').forEach((el) => {
        const h = el as HTMLElement;
        h.style.setProperty('display', 'none', 'important');
        h.style.setProperty('visibility', 'hidden', 'important');
        h.style.setProperty('opacity', '0', 'important');
        h.style.setProperty('pointer-events', 'none', 'important');
      });

      document.querySelectorAll('*').forEach((el) => {
        if (el.shadowRoot) {
          el.shadowRoot.querySelectorAll('.bpFabWrapper, .bpFab, [data-name="fab"], .bpFabContainer, .bpUnreadMessage').forEach((fab) => {
            const h = fab as HTMLElement;
            h.style.setProperty('display', 'none', 'important');
            h.style.setProperty('visibility', 'hidden', 'important');
            h.style.setProperty('opacity', '0', 'important');
            h.style.setProperty('pointer-events', 'none', 'important');
          });
        }
      });
    };

    purgeBlankFab();
    const cleanerInterval = setInterval(purgeBlankFab, 150);

    return () => {
      clearTimeout(timer);
      clearInterval(cleanerInterval);
    };
  }, []);

  useEffect(() => {
    if (isBuiltInChatOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isBuiltInChatOpen, isTyping]);

  // Click handler for the Cute Robot floating button
  const handleBotClick = () => {
    setShowGreetingBubble(false);

    // 1. Try to open official Botpress Webchat first
    const bp = (window as any).botpress;
    if (bp && typeof bp.open === 'function') {
      try {
        bp.open();
        // Check if Botpress open state changed
        setTimeout(() => {
          const bpContainer = document.querySelector('.bpWebchat, [data-name="webchat"]');
          if (!bpContainer || getComputedStyle(bpContainer).display === 'none' || bpContainer.getAttribute('data-open') !== 'true') {
            // Botpress failed or didn't show, fallback to built-in chat
            setIsBuiltInChatOpen(true);
          }
        }, 300);
        return;
      } catch (err) {
        console.warn('Botpress open failed, using built-in chat:', err);
      }
    }

    // 2. Fallback to built-in Smart Developer interactive assistant
    setIsBuiltInChatOpen((prev) => !prev);
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    // Generate intelligent instant reply
    setTimeout(() => {
      const lower = text.toLowerCase();
      let reply = '';
      let actionUrl: string | undefined;
      let actionLabel: string | undefined;

      if (lower.includes('ready') || lower.includes('demo') || lower.includes('portfolio') || lower.includes('browse') || lower.includes('website')) {
        reply = 'We have production-ready websites across multiple categories: E-commerce, SaaS Analytics, Luxury Real Estate, High-End Fashion, Healthcare, and Corporate Agency. Each includes complete source code and commercial license!';
        actionUrl = '#portfolio-gallery';
        actionLabel = 'Explore Website Showcase';
      } else if (lower.includes('buy') || lower.includes('purchase') || lower.includes('source code') || lower.includes('price') || lower.includes('cost')) {
        reply = 'You can purchase any website directly through our instant checkout or WhatsApp. Full source code, complete database schemas, documentation, and 30 days of free deployment support are included with every project.';
        actionUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Hi! I want to purchase website source code.')}`;
        actionLabel = 'Inquire via WhatsApp';
      } else if (lower.includes('custom') || lower.includes('order') || lower.includes('hire') || lower.includes('quote')) {
        reply = 'Looking for a custom web application? We build tailored full-stack solutions using React, TypeScript, Node.js, and Cloudflare. Tell us your goals, or submit our custom inquiry form for a free quote within 4-12 hours!';
        actionUrl = '#custom-order-section';
        actionLabel = 'Request Custom Development';
      } else if (lower.includes('whatsapp') || lower.includes('call') || lower.includes('contact') || lower.includes('phone') || lower.includes('talk')) {
        reply = 'You can chat directly with our lead developer on WhatsApp for instant project discussions and custom quotations!';
        actionUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Hello! I would like to discuss a web project.')}`;
        actionLabel = 'Open WhatsApp Chat';
      } else {
        reply = 'Thanks for reaching out! We build high-performance web applications and ready-made business solutions. Would you like to explore our website catalog or discuss a custom project directly?';
        actionUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Hello! I have a question regarding Smart Developer services: ' + text)}`;
        actionLabel = 'Talk to Developer';
      }

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionUrl,
        actionLabel,
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 700);
  };

  // Do not render floating button if hidden by a modal
  if (hideWhenModalOpen) {
    return null;
  }

  const floatingButton = (
    <>
      {/* 1. FLOATING CUTE ROBOT BUTTON (Bottom-Left) */}
      <div
        id="smart-developer-bot-floating"
        className="fixed bottom-5 left-5 sm:bottom-6 sm:left-6 z-[9990] flex items-center justify-center pointer-events-auto select-none print:hidden"
        style={{
          position: 'fixed',
          bottom: '20px',
          left: '20px',
          zIndex: 9990,
        }}
      >
        {/* Friendly speech bubble callout on initial load */}
        {showGreetingBubble && !isBuiltInChatOpen && (
          <div className="absolute left-0 bottom-20 whitespace-nowrap p-3 bg-[#0d1322] border border-cyan-500/40 rounded-2xl shadow-2xl text-xs text-white animate-in fade-in slide-in-from-bottom-2 duration-300 flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
            <div>
              <div className="font-semibold text-cyan-200">Hi! I&apos;m your AI Assistant</div>
              <div className="text-[11px] text-slate-300">Need help finding a website?</div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowGreetingBubble(false);
              }}
              className="ml-1 text-slate-400 hover:text-white p-0.5 rounded cursor-pointer"
              aria-label="Dismiss greeting"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Desktop Quick Tooltip on Hover (Facing inward to the right) */}
        {showTooltip && !showGreetingBubble && !isBuiltInChatOpen && (
          <div className="hidden sm:block absolute left-20 bottom-2 whitespace-nowrap px-3 py-1.5 bg-[#0e111d] border border-cyan-500/30 rounded-xl shadow-2xl text-xs text-white animate-in fade-in zoom-in-95 duration-150 pointer-events-none">
            <div className="font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              <span>AI Website Assistant</span>
            </div>
            <div className="text-[10px] text-slate-400">Click to chat & explore websites</div>
          </div>
        )}

        {/* Circular Floating Cute Robot Button */}
        <button
          onClick={handleBotClick}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          className="relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#080d1a] hover:scale-108 active:scale-95 transition-all duration-200 cursor-pointer shadow-2xl border-2 border-cyan-400/80 group"
          style={{
            boxShadow: '0 10px 30px -4px rgba(6, 182, 212, 0.5), 0 0 20px 2px rgba(59, 130, 246, 0.4)',
          }}
          aria-label="Open AI Chatbot Assistant"
          title="Chat with AI Assistant"
        >
          {/* Subtle breathing ambient aura */}
          <span className="absolute -inset-1 rounded-full bg-cyan-500/35 blur-sm animate-pulse group-hover:bg-cyan-500/55 transition-all pointer-events-none"></span>

          {/* Cute Robot Avatar Image */}
          <img
            src={robotAvatarUrl}
            alt="AI Robot Assistant"
            className="w-full h-full rounded-full object-cover relative z-10 select-none pointer-events-none transition-transform duration-200 group-hover:scale-105"
            onError={(e) => {
              // Fallback to cute robot SVG if JPG has an issue
              (e.currentTarget as HTMLImageElement).src = '/assets/images/cute-robot.svg';
            }}
          />

          {/* Top-Right Glowing Online Indicator */}
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#00ff87] border-2 border-[#08090E] flex items-center justify-center z-20 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-950 animate-ping"></span>
          </span>
        </button>
      </div>

      {/* 2. BUILT-IN INTERACTIVE AI CHATBOT DRAWER (Bottom-Left) */}
      {isBuiltInChatOpen && (
        <div
          className="fixed bottom-24 left-4 sm:left-6 w-[92vw] sm:w-[380px] max-h-[580px] h-[78vh] z-[9995] flex flex-col rounded-2xl bg-[#0c101c] border border-cyan-500/30 shadow-2xl shadow-cyan-950/50 backdrop-blur-xl overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200"
          style={{
            boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 35px 2px rgba(6, 182, 212, 0.25)',
          }}
        >
          {/* Header */}
          <div className="p-4 bg-[#111728] border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={robotAvatarUrl}
                  alt="Assistant"
                  className="w-10 h-10 rounded-full object-cover border-2 border-cyan-400 shadow-md"
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#00ff87] border-2 border-[#111728]"></span>
              </div>
              <div>
                <div className="text-sm font-bold text-white flex items-center gap-1.5">
                  <span>Smart AI Assistant</span>
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                </div>
                <div className="text-[11px] text-cyan-300/80 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span>Instant Sales & Project Support</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsBuiltInChatOpen(false)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close Chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Starters Carousel */}
          <div className="p-2.5 bg-[#080d1a]/80 border-b border-white/5 flex gap-2 overflow-x-auto no-scrollbar">
            {[
              '🚀 Ready Websites',
              '💰 Source Code Pricing',
              '💼 Custom Web App',
              '💬 Chat on WhatsApp',
            ].map((starter) => (
              <button
                key={starter}
                onClick={() => handleSendMessage(starter)}
                className="whitespace-nowrap px-2.5 py-1 text-[11px] font-medium bg-cyan-950/40 hover:bg-cyan-900/60 text-cyan-300 border border-cyan-700/30 rounded-lg transition-all cursor-pointer shrink-0"
              >
                {starter}
              </button>
            ))}
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-xs shadow-md'
                      : 'bg-[#151c30] text-slate-200 border border-white/10 rounded-bl-xs'
                  }`}
                >
                  <p>{msg.text}</p>

                  {/* Optional Action Button */}
                  {msg.actionUrl && (
                    <div className="mt-2.5 pt-2 border-t border-white/10">
                      <a
                        href={msg.actionUrl}
                        target={msg.actionUrl.startsWith('http') ? '_blank' : undefined}
                        rel={msg.actionUrl.startsWith('http') ? 'noopener noreferrer' : undefined}
                        onClick={() => {
                          if (!msg.actionUrl?.startsWith('http')) {
                            setIsBuiltInChatOpen(false);
                          }
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-[11px] shadow-sm transition-all cursor-pointer"
                      >
                        <span>{msg.actionLabel || 'Learn More'}</span>
                        {msg.actionUrl.startsWith('http') ? (
                          <ExternalLink className="w-3 h-3" />
                        ) : (
                          <ArrowRight className="w-3 h-3" />
                        )}
                      </a>
                    </div>
                  )}
                </div>
                <span className="text-[10px] text-slate-500 mt-1 px-1">{msg.time}</span>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-slate-400 text-xs py-1">
                <div className="flex gap-1 bg-[#151c30] px-3 py-2 rounded-xl border border-white/10">
                  <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
                <span className="text-[11px] text-slate-500">AI is thinking...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input Bar */}
          <div className="p-3 bg-[#111728] border-t border-white/10">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask about websites, source code, pricing..."
                className="flex-1 px-3 py-2.5 bg-[#090d18] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim()}
                className="p-2.5 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 disabled:hover:bg-cyan-500 text-slate-950 font-bold rounded-xl transition-all cursor-pointer shrink-0"
                aria-label="Send Message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );

  if (mounted && typeof document !== 'undefined' && document.body) {
    return createPortal(floatingButton, document.body);
  }

  return floatingButton;
};
