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
// AiMessageContent — renders text + deep-link CTA buttons
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

function AiMessageContent({ text }) {
  const parts = parseMessageParts(text);

  return (
    <span className="block">
      {parts.map((part, i) => {
        if (part.type === 'url') {
          // Extract eventId from deep link (supports /event/id and /events/id)
          const eventIdMatch = part.value.match(/\/events?\/(\d+)/);

          let hrefValue = part.value;
          if (eventIdMatch) {
            hrefValue = hrefValue.replace(/\/events\/(\d+)/, '/event/$1');
          }

          let label = part.label;
          if (!label) {
            label = eventIdMatch
              ? `🎫 Xem chi tiết & Đặt vé – Sự kiện #${eventIdMatch[1]}`
              : '🎫 Xem chi tiết & Đặt vé';
          }

          return (
            <a
              key={i}
              href={hrefValue}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-2 px-4 py-2 bg-[#26bc71] hover:bg-[#1fa05f] active:scale-95 text-white rounded-md font-bold text-center w-full text-xs leading-snug transition-all duration-200 shadow-md shadow-green-900/30"
            >
              {label}
            </a>
          );
        }

        // Render plain text, preserving newlines and formatting bold text
        return (
          <span key={i} className="whitespace-pre-wrap">
            {renderFormattedText(part.value)}
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
      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#26bc71] to-emerald-600 flex items-center justify-center flex-shrink-0 shadow-md">
        <span className="text-xs" role="img" aria-label="bot">🤖</span>
      </div>

      {/* Bubble */}
      <div className="bg-[#252525] border border-white/10 rounded-2xl rounded-bl-sm px-4 py-3">
        <div className="flex gap-1.5 items-center h-4">
          {[0, 150, 300].map((delay) => (
            <span
              key={delay}
              className="w-2 h-2 bg-[#26bc71] rounded-full animate-bounce"
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
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#26bc71] to-emerald-600 flex items-center justify-center flex-shrink-0 shadow-md self-end">
          <span className="text-xs" role="img" aria-label="bot">🤖</span>
        </div>
      )}

      {/* Bubble */}
      <div
        className={`
          max-w-[82%] px-3 py-2.5 text-sm leading-relaxed rounded-2xl break-words
          ${isUser
            ? 'bg-gradient-to-br from-[#26bc71] to-emerald-600 text-white rounded-br-sm shadow-lg shadow-green-900/30'
            : 'bg-[#252525] border border-white/10 text-gray-200 rounded-bl-sm'
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
          w-80 flex flex-col
          bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-2xl
          transition-all duration-300 ease-out origin-bottom-right
          ${isOpen
            ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 scale-95 translate-y-3 pointer-events-none'
          }
        `}
        style={{ height: '26rem' }}
      >
        {/* ── Header ──────────────────────────────────────────────────── */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10 bg-gradient-to-r from-[#1a1a1a] to-[#1a2a1e] rounded-t-2xl flex-shrink-0">
          {/* Bot avatar with pulse */}
          <div className="relative flex-shrink-0">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#26bc71] to-emerald-600 flex items-center justify-center shadow-lg shadow-green-900/40">
              <span className="text-base" role="img" aria-label="bot">🤖</span>
            </div>
            <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-[#1a1a1a] ${isOnline ? 'bg-green-400' : 'bg-red-500'}`} />
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white leading-tight">TicketBox AI</p>
            <p className={`text-[11px] leading-tight ${isOnline ? 'text-green-400' : 'text-red-400'}`}>
              {isLoading ? '● Đang xử lý...' : isOnline ? '● Trực tuyến' : '● Ngoại tuyến'}
            </p>
          </div>

          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Đóng chatbot"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* ── Messages ────────────────────────────────────────────────── */}
        <div
          className="flex-1 overflow-y-auto px-3 py-3"
          style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.1) transparent' }}
        >
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}

          {/* Typing indicator */}
          {isLoading && <TypingIndicator />}

          {/* Quick-start questions — only shown on fresh conversation */}
          {showQuickQuestions && (
            <div className="mt-1 space-y-1.5">
              <p className="text-[11px] text-gray-500 px-1 font-medium">💡 Gợi ý câu hỏi</p>
              {QUICK_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => handleQuickQuestion(q)}
                  className="
                    w-full text-left text-xs text-green-300
                    border border-green-500/25 bg-green-500/8
                    hover:bg-green-500/20 hover:border-green-500/50
                    px-3 py-2 rounded-xl
                    transition-all duration-200
                    leading-snug
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
        <div className="flex-shrink-0 px-3 pb-3 pt-2 border-t border-white/10">
          <div className="flex items-center gap-2 bg-[#252525] border border-white/10 rounded-xl px-3 py-2 focus-within:border-[#26bc71]/50 transition-colors duration-200">
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
              className="flex-1 bg-transparent text-sm text-white placeholder-gray-500 outline-none disabled:opacity-40 min-w-0"
              aria-label="Nhập tin nhắn"
            />

            {/* Send button */}
            <button
              onClick={() => sendMessage(inputValue)}
              disabled={isLoading || !isOnline || !inputValue.trim()}
              className="
                w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-lg
                bg-[#26bc71] hover:bg-[#1fa05f]
                disabled:opacity-35 disabled:cursor-not-allowed
                active:scale-95 transition-all duration-200
                shadow-sm shadow-green-900/40
              "
              aria-label="Gửi tin nhắn"
            >
              {isLoading ? (
                /* Spinner */
                <svg className="w-3.5 h-3.5 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
              ) : (
                /* Paper-plane icon */
                <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              )}
            </button>
          </div>

          <p className="text-center text-[10px] text-gray-600 mt-1.5 select-none">
            Powered by <span className="text-gray-500">Ollama (Qwen 2.5 7B)</span> · TicketBox AI
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
            ? 'bg-[#252525] border border-white/20 shadow-black/30'
            : 'bg-gradient-to-br from-[#26bc71] to-emerald-600 hover:scale-110 hover:shadow-green-500/50 shadow-green-900/50'
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
