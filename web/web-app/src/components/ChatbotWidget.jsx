import { useState, useRef, useEffect, useCallback } from 'react';
import { sendChatMessage, streamChat, checkChatStatus } from '../services/chatService';

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const INITIAL_MESSAGES = [
  {
    id: 1,
    sender: 'ai',
    text: 'Xin chào! Tôi là trợ lý AI của TicketBox. Tôi có thể giúp bạn tìm sự kiện, xem giá vé và hỗ trợ đặt vé. Bạn muốn tìm gì hôm nay?',
  },
];

const QUICK_QUESTIONS = [
  'Sự kiện âm nhạc nào đang hot?',
  'Có sự kiện nào ở Hà Nội không?',
  'Cho tôi xem các show cuối tuần này',
  'Sự kiện nào có vé dưới 200k?',
];

// Regex to match Markdown links like [Text](Url) or standalone HTTP/HTTPS URLs
const LINK_OR_URL_REGEX = /\[([^\]]+)\]\(([^)]+)\)|(https?:\/\/[^\s<>"{}|\\^`[\]]+)/g;

// ─────────────────────────────────────────────────────────────────────────────
// Link parser — splits text into text/url tokens
// ─────────────────────────────────────────────────────────────────────────────

function parseMessageParts(text) {
  const parts = [];
  let lastIndex = 0;
  let match;
  const regex = new RegExp(LINK_OR_URL_REGEX.source, 'g');

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: 'text', value: text.slice(lastIndex, match.index) });
    }

    if (match[1] && match[2]) {
      // It's a Markdown link [text](url)
      parts.push({
        type: 'url',
        label: match[1],
        value: match[2]
      });
    } else {
      // It's a standalone URL
      const url = match[3].replace(/[.,;:!?)*~_\/]+$/, '');
      parts.push({
        type: 'url',
        label: null,
        value: url
      });
    }
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push({ type: 'text', value: text.slice(lastIndex) });
  }

  return parts;
}

// ─────────────────────────────────────────────────────────────────────────────
// AiMessageContent — renders text + deep-link CTA buttons & rich event cards
// ─────────────────────────────────────────────────────────────────────────────

function renderFormattedText(text) {
  // Regex to split on **bold** boundaries
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      const boldText = part.slice(2, -2);
      return <strong key={index} className="font-bold text-white">{boldText}</strong>;
    }
    return part;
  });
}

function EventCardBlock({ title, location, price, linkLabel, linkUrl }) {
  const eventIdMatch = linkUrl.match(/\/events?\/(\d+)/);
  let hrefValue = linkUrl;
  if (eventIdMatch) {
    hrefValue = hrefValue.replace(/\/events\/(\d+)/, '/event/$1');
  }

  const cleanLabel = linkLabel.replace(/^[🎟️👉🎫\s]+/, '');

  return (
    <div className="my-2.5 overflow-hidden rounded-xl bg-zinc-950/40 border border-zinc-800/80 hover:border-emerald-500/30 hover:bg-zinc-900/60 transition-all duration-300 shadow-md group">
      <div className="h-1 w-full bg-gradient-to-r from-emerald-500 to-teal-500 opacity-80" />
      <div className="p-3">
        <h4 className="text-xs font-bold text-white leading-snug mb-2 group-hover:text-emerald-400 transition-colors line-clamp-2">
          {title}
        </h4>
        <div className="space-y-1 mb-3">
          <div className="flex items-center gap-1.5 text-[11px] text-zinc-400">
            <span className="text-emerald-400">📍</span>
            <span className="truncate">{location}</span>
          </div>
          {price && (
            <div className="flex items-center gap-1.5 text-[11px] text-zinc-400">
              <span className="text-emerald-400">💵</span>
              <span className="font-semibold text-emerald-400/90">{price}</span>
            </div>
          )}
        </div>
        <a
          href={hrefValue}
          target="_blank"
          rel="noopener noreferrer"
          className="
            w-full py-1.5 px-3 rounded-lg text-center text-xs font-bold
            bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500
            text-white transition-all duration-300
            shadow-md hover:shadow-emerald-950/20 active:scale-[0.97]
            flex items-center justify-center gap-1.5
          "
        >
          <span>{cleanLabel || 'Xem chi tiết & Đặt vé'}</span>
          <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </a>
      </div>
    </div>
  );
}

function parseAiMessage(text) {
  const lines = text.split('\n');
  const blocks = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const eventMatch = line.match(/-\s+\*\*([^*]+)\*\*\s*\|\s*📍\s*([^|\n]+)(?:\|\s*💵\s*([^|\n]+))?/);

    if (eventMatch) {
      const title = eventMatch[1].trim();
      const location = eventMatch[2].trim();
      const price = eventMatch[3] ? eventMatch[3].trim() : '';

      let linkLabel = 'Xem chi tiết';
      let linkUrl = '#';
      if (i + 1 < lines.length) {
        const nextLine = lines[i + 1];
        const linkMatch = nextLine.match(/(?:👉|🎟️)?\s*(?:\*\*)?\[([^\]]+)\]\(([^)]+)\)(?:\*\*)?/);
        if (linkMatch) {
          linkLabel = linkMatch[1].trim();
          linkUrl = linkMatch[2].trim();
          i++;
        }
      }

      blocks.push({
        type: 'event_card',
        title,
        location,
        price,
        linkLabel,
        linkUrl
      });
    } else {
      blocks.push({
        type: 'text',
        value: line
      });
    }
    i++;
  }

  const groupedBlocks = [];
  let currentTextBlock = null;

  for (let idx = 0; idx < blocks.length; idx++) {
    const block = blocks[idx];
    if (block.type === 'text') {
      const val = block.value.trim();
      if (val === '---' || val === '') {
        const prevIsCard = idx > 0 && blocks[idx - 1].type === 'event_card';
        const nextIsCard = idx < blocks.length - 1 && blocks[idx + 1].type === 'event_card';
        if (prevIsCard || nextIsCard) {
          continue;
        }
      }
      
      if (currentTextBlock === null) {
        currentTextBlock = { type: 'text', value: block.value };
        groupedBlocks.push(currentTextBlock);
      } else {
        currentTextBlock.value += '\n' + block.value;
      }
    } else {
      currentTextBlock = null;
      groupedBlocks.push(block);
    }
  }

  return groupedBlocks;
}

function renderTextWithInlineLinks(text) {
  const parts = parseMessageParts(text);
  return parts.map((part, i) => {
    if (part.type === 'url') {
      const eventIdMatch = part.value.match(/\/events?\/(\d+)/);

      let hrefValue = part.value;
      if (eventIdMatch) {
        hrefValue = hrefValue.replace(/\/events\/(\d+)/, '/event/$1');
      }

      let label = part.label;
      if (!label) {
        label = eventIdMatch
          ? `Xem chi tiết #${eventIdMatch[1]}`
          : 'Xem chi tiết';
      }

      return (
        <a
          key={i}
          href={hrefValue}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-0.5 text-emerald-400 hover:text-emerald-300 font-bold underline transition-colors mx-1"
        >
          <span>{label}</span>
          <svg className="w-3.5 h-3.5 inline shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      );
    }

    return (
      <span key={i}>
        {renderFormattedText(part.value)}
      </span>
    );
  });
}

function AiMessageContent({ text }) {
  const blocks = parseAiMessage(text);

  return (
    <span className="block space-y-1">
      {blocks.map((block, index) => {
        if (block.type === 'event_card') {
          return (
            <EventCardBlock
              key={index}
              title={block.title}
              location={block.location}
              price={block.price}
              linkLabel={block.linkLabel}
              linkUrl={block.linkUrl}
            />
          );
        }

        return (
          <span key={index} className="block whitespace-pre-wrap">
            {renderTextWithInlineLinks(block.value)}
          </span>
        );
      })}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TypingIndicator — animated bouncing dots
// ─────────────────────────────────────────────────────────────────────────────

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 mb-3" aria-label="Đang gõ..." aria-live="polite">
      {/* Bot avatar */}
      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center flex-shrink-0 shadow-md">
        <span className="text-xs" role="img" aria-label="bot">🤖</span>
      </div>

      {/* Bubble */}
      <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-2xl rounded-bl-none px-4 py-3">
        <div className="flex gap-1.5 items-center h-4">
          {[0, 150, 300].map((delay) => (
            <span
              key={delay}
              className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"
              style={{ animationDelay: `${delay}ms`, animationDuration: '0.9s' }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MessageBubble — single chat message
// ─────────────────────────────────────────────────────────────────────────────

function MessageBubble({ message }) {
  const isUser = message.sender === 'user';

  return (
    <div
      className={`flex items-end gap-2 mb-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {/* Bot avatar — only for AI messages */}
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center flex-shrink-0 shadow-md self-end">
          <span className="text-xs" role="img" aria-label="bot">🤖</span>
        </div>
      )}

      {/* Bubble */}
      <div
        className={`
          max-w-[80%] px-3.5 py-2.5 text-sm leading-relaxed rounded-2xl break-words shadow-sm transition-all duration-200
          ${isUser
            ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-br-none shadow-md shadow-emerald-950/15'
            : 'bg-zinc-900/50 border border-zinc-800/80 text-zinc-100 rounded-bl-none shadow-sm'
          }
        `}
      >
        {isUser ? (
          <span className="whitespace-pre-wrap">{message.text}</span>
        ) : (
          <AiMessageContent text={message.text} />
        )}
      </div>
    </div>
  );
}


// ─────────────────────────────────────────────────────────────────────────────
// ChatbotWidget — main component
// ─────────────────────────────────────────────────────────────────────────────

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [isOnline, setIsOnline] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const chatWindowRef = useRef(null);

  // Auto-scroll to newest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Focus input and clear unread badge when opening
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 120);
      setHasUnread(false);
    }
  }, [isOpen]);

  // Check AI service status immediately on mount and every 10 seconds
  useEffect(() => {
    const checkStatus = async () => {
      const online = await checkChatStatus();
      setIsOnline(online);
    };

    checkStatus();

    const interval = setInterval(checkStatus, 10000);
    return () => clearInterval(interval);
  }, []);

  // Also check status immediately when user opens the chat widget
  useEffect(() => {
    if (isOpen) {
      checkChatStatus().then(setIsOnline);
    }
  }, [isOpen]);

  // ── Core send logic ─────────────────────────────────────────────────────────

  const sendMessage = useCallback(
    async (text) => {
      const trimmed = (text ?? '').trim();
      if (!trimmed || isLoading) return;

      // Append user bubble immediately
      const userMsg = { id: Date.now(), sender: 'user', text: trimmed };
      setMessages((prev) => [...prev, userMsg]);
      setInputValue('');
      setIsLoading(true);

      const tempId = Date.now() + 1;

      try {
        await streamChat(
          trimmed,
          (chunk) => {
            setIsLoading(false); // Turn off typing indicator once stream starts
            setMessages((prev) => {
              const exists = prev.some((msg) => msg.id === tempId);
              if (!exists) {
                return [...prev, { id: tempId, sender: 'ai', text: chunk }];
              } else {
                return prev.map((msg) =>
                  msg.id === tempId ? { ...msg, text: msg.text + chunk } : msg
                );
              }
            });
          },
          () => {
            // Stream complete
            setIsLoading(false);
            if (!isOpen) setHasUnread(true);
          },
          (err) => {
            // Stream error
            setIsLoading(false);
            const errText = '⚠️ Không thể kết nối đến trợ lý AI. Vui lòng kiểm tra kết nối mạng và thử lại.';
            setMessages((prev) => {
              const exists = prev.some((msg) => msg.id === tempId);
              if (exists) {
                return prev.map((msg) =>
                  msg.id === tempId ? { ...msg, text: msg.text + '\n\n' + errText } : msg
                );
              } else {
                return [...prev, { id: tempId, sender: 'ai', text: errText }];
              }
            });
          }
        );
      } catch (err) {
        setIsLoading(false);
        const errText = '⚠️ Không thể kết nối đến trợ lý AI. Vui lòng kiểm tra kết nối mạng và thử lại.';
        setMessages((prev) => [
          ...prev,
          { id: tempId, sender: 'ai', text: errText },
        ]);
      }
    },
    [isLoading, isOpen]
  );

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputValue);
    }
  };

  const handleQuickQuestion = (q) => sendMessage(q);

  const showQuickQuestions = messages.length === 1 && !isLoading;

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <>
      {/* ═══════════════════════════════════════════════════════════════
          CHAT WINDOW
      ═══════════════════════════════════════════════════════════════ */}
      <div
        ref={chatWindowRef}
        role="dialog"
        aria-modal="true"
        aria-label="TicketBox AI Chatbot"
        className={`
          fixed bottom-24 right-6 z-50
          w-[340px] sm:w-[380px] flex flex-col
          bg-zinc-950/90 border border-zinc-800/80 rounded-2xl shadow-[0_12px_45px_rgba(0,0,0,0.7)] backdrop-blur-xl
          transition-all duration-300 ease-out origin-bottom-right
          ${isOpen
            ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 scale-95 translate-y-3 pointer-events-none'
          }
        `}
        style={{ height: '520px' }}
      >
        {/* ── Header ──────────────────────────────────────────────────── */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-zinc-850/60 bg-gradient-to-r from-zinc-950 to-zinc-900/60 rounded-t-2xl flex-shrink-0">
          {/* Bot avatar with pulse */}
          <div className="relative flex-shrink-0">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <span className="text-base" role="img" aria-label="bot">🤖</span>
            </div>
            <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-zinc-950 ${isOnline ? 'bg-emerald-400' : 'bg-red-500'}`} />
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white leading-tight">TicketBox AI</p>
            <p className={`text-[10px] font-medium leading-tight ${isOnline ? 'text-emerald-400' : 'text-red-400'}`}>
              {isLoading ? '● Đang xử lý...' : isOnline ? '● Trực tuyến' : '● Ngoại tuyến'}
            </p>
          </div>

          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-900/60 rounded-lg transition-colors border border-zinc-850/40"
            aria-label="Đóng chatbot"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* ── Messages ────────────────────────────────────────────────── */}
        <div
          className="flex-1 overflow-y-auto px-4 py-4 space-y-3.5"
          style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.08) transparent' }}
        >
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}

          {/* Typing indicator */}
          {isLoading && <TypingIndicator />}

          {/* Quick-start questions — only shown on fresh conversation */}
          {showQuickQuestions && (
            <div className="mt-4 space-y-2 px-1 animate-fadeInUp">
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                💡 Gợi ý câu hỏi
              </p>
              {QUICK_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => handleQuickQuestion(q)}
                  className="
                    w-full text-left text-xs text-zinc-300 hover:text-emerald-400
                    border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900/80 hover:border-emerald-500/30
                    px-4 py-3 rounded-xl
                    transition-all duration-200
                    leading-snug shadow-sm hover:shadow-[0_2px_12px_rgba(16,185,129,0.05)]
                  "
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Scroll anchor */}
          <div ref={messagesEndRef} />
        </div>

        {/* ── Input area ──────────────────────────────────────────────── */}
        <div className="flex-shrink-0 px-4 pb-4 pt-2 border-t border-zinc-900 bg-zinc-950/40">
          <div className="flex items-center gap-2 bg-zinc-900/50 border border-zinc-800/80 rounded-xl px-3.5 py-2 focus-within:border-emerald-500/40 focus-within:ring-1 focus-within:ring-emerald-500/20 transition-all duration-200">
            <input
              ref={inputRef}
              id="chatbot-input"
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isOnline ? "Nhập câu hỏi..." : "Trợ lý AI đang ngoại tuyến..."}
              disabled={isLoading || !isOnline}
              autoComplete="off"
              className="flex-1 bg-transparent text-sm text-zinc-100 placeholder-zinc-500 outline-none disabled:opacity-40 min-w-0"
              aria-label="Nhập tin nhắn"
            />

            {/* Send button */}
            <button
              onClick={() => sendMessage(inputValue)}
              disabled={isLoading || !isOnline || !inputValue.trim()}
              className="
                w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-lg
                bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500
                disabled:opacity-20 disabled:cursor-not-allowed
                active:scale-95 transition-all duration-200
                shadow-sm shadow-emerald-950/40 text-white
              "
              aria-label="Gửi tin nhắn"
            >
              {isLoading ? (
                /* Spinner */
                <svg className="w-4 h-4 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
              ) : (
                /* Paper-plane icon */
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              )}
            </button>
          </div>

          <p className="text-center text-[9px] text-zinc-600 mt-2 select-none font-medium">
            Powered by <span className="text-zinc-500">Ollama (Qwen 2.5 7B)</span> · TicketBox AI
          </p>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          FLOATING ACTION BUTTON (FAB)
      ═══════════════════════════════════════════════════════════════ */}
      <button
        id="chatbot-fab"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`
          fixed bottom-6 right-6 z-50
          w-14 h-14 rounded-full
          flex items-center justify-center
          shadow-2xl transition-all duration-300 ease-out
          focus:outline-none focus:ring-2 focus:ring-[#26bc71] focus:ring-offset-2 focus:ring-offset-transparent
          ${isOpen
            ? 'bg-zinc-900 border border-zinc-800 shadow-lg'
            : 'bg-gradient-to-br from-emerald-500 to-teal-600 hover:scale-110 hover:shadow-emerald-500/30 shadow-[0_4px_20px_rgba(16,185,129,0.3)]'
          }
        `}
        aria-label={isOpen ? 'Đóng chatbot' : 'Mở chatbot TicketBox AI'}
        aria-expanded={isOpen}
        aria-controls="chatbot-window"
      >
        {/* Unread notification badge */}
        {hasUnread && !isOpen && (
          <span
            className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-[#121212] animate-pulse"
            aria-label="Có tin nhắn mới"
          />
        )}

        {/* Animated icon — chat bubble → ✕ */}
        <span
          className={`transition-all duration-300 ${isOpen ? 'rotate-90 opacity-80' : 'rotate-0 opacity-100'}`}
        >
          {isOpen ? (
            <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          )}
        </span>
      </button>
    </>
  );
}
