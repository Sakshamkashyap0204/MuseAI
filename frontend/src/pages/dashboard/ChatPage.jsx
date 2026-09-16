import { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { RiDeleteBinLine, RiSendPlaneLine, RiSparklingLine } from 'react-icons/ri';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { chatApi } from '../../api/chat.api';
import { useWorkspace } from '../../store/WorkspaceContext';
import Button from '../../components/ui/Button';
import Textarea from '../../components/ui/Textarea';

function notifyChatUpdated() {
  window.dispatchEvent(new Event('chat-updated'));
}

function formatAssistantContent(content) {
  return content
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]*>/g, '')
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => !/^\|?\s*:?-+:?\s*(\|\s*:?-+:?\s*)+\|?$/.test(line))
    .map((line) => {
      if (line.includes('|')) {
        return line.split('|').map((cell) => cell.trim().replace(/\*\*/g, '')).filter(Boolean).join(' - ');
      }
      return line.replace(/\*\*/g, '').replace(/^#{1,6}\s*/, '').replace(/^[*-]\s+/, '• ');
    })
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

// Typewriter hook
function useTypewriter(text, enabled = true) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  const rafRef = useRef(null);
  const indexRef = useRef(0);

  useEffect(() => {
    if (!enabled || !text) {
      setDisplayed(text || '');
      setDone(true);
      return;
    }

    indexRef.current = 0;
    setDisplayed('');
    setDone(false);

    const CHARS_PER_FRAME = 4;

    const tick = () => {
      indexRef.current = Math.min(indexRef.current + CHARS_PER_FRAME, text.length);
      setDisplayed(text.slice(0, indexRef.current));
      if (indexRef.current < text.length) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setDone(true);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [text, enabled]);

  return { displayed, done };
}

function ThinkingDots() {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-[var(--color-text-muted)]"
          animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1, 0.8] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
    </div>
  );
}

function AssistantMessage({ content, animate }) {
  const formatted = formatAssistantContent(content);
  const { displayed, done } = useTypewriter(formatted, animate);

  return (
    <span className="whitespace-pre-wrap">
      {displayed}
      {!done && (
        <span className="inline-block w-0.5 h-3.5 bg-[var(--color-accent)] ml-0.5 animate-pulse align-middle" />
      )}
    </span>
  );
}

function ChatPage() {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [latestAssistantId, setLatestAssistantId] = useState(null);
  const messagesEndRef = useRef(null);
  const { importConversation } = useWorkspace();

  useEffect(() => {
    let active = true;
    async function loadConversation() {
      if (!conversationId) {
        if (active) { setConversation(null); setMessages([]); setIsLoading(false); }
        return;
      }
      setIsLoading(true);
      try {
        const { data } = await chatApi.getConversation(conversationId);
        if (active) {
          setConversation(data.data.conversation);
          setMessages(data.data.messages);
          setLatestAssistantId(null); // no animation for loaded messages
        }
      } catch (error) {
        if (active) {
          toast.error(error.response?.data?.message || 'Unable to load this chat');
          navigate('/dashboard/chat', { replace: true });
        }
      } finally {
        if (active) setIsLoading(false);
      }
    }
    loadConversation();
    return () => { active = false; };
  }, [conversationId, navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const message = content.trim();
    if (!message || isSending) return;

    setContent('');
    setIsSending(true);
    try {
      let activeConversationId = conversationId;
      if (!activeConversationId) {
        const { data } = await chatApi.createConversation();
        activeConversationId = data.data.conversation._id;
      }
      const { data } = await chatApi.sendMessage(activeConversationId, message);
      if (!conversationId) navigate(`/dashboard/chat/${activeConversationId}`, { replace: true });
      setConversation(data.data.conversation);
      const newMessages = data.data.messages;
      setMessages((current) => [...current, ...newMessages]);
      // Mark the latest assistant message for animation
      const assistantMsg = newMessages.find((m) => m.role === 'assistant');
      if (assistantMsg) setLatestAssistantId(assistantMsg._id);
      notifyChatUpdated();
    } catch (error) {
      setContent(message);
      toast.error(error.response?.data?.message || 'Unable to send message');
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  };

  const handleDelete = async () => {
    if (!conversationId) return;
    try {
      await chatApi.deleteConversation(conversationId);
      notifyChatUpdated();
      navigate('/dashboard/chat', { replace: true });
      toast.success('Chat deleted');
    } catch {
      toast.error('Unable to delete this chat');
    }
  };

  const handleUseForGeneration = () => {
    importConversation({ id: conversationId, title: conversation?.title });
    navigate('/dashboard');
    toast.success('Chat context added to Generate');
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
          <div className="w-4 h-4 border-2 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin" />
          Loading chat...
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col max-w-4xl mx-auto">
      <header className="h-16 shrink-0 flex items-center justify-between px-6 border-b border-[var(--color-border)]">
        <div className="min-w-0">
          <h1 className="text-sm font-semibold text-[var(--color-text-primary)] truncate">{conversation?.title || 'New chat'}</h1>
          <p className="text-xs text-[var(--color-text-muted)]">Muse AI Chat</p>
        </div>
        {conversationId && (
          <div className="flex items-center gap-1">
            <Button type="button" variant="secondary" size="sm" onClick={handleUseForGeneration}>Use for Generation</Button>
            <Button type="button" variant="ghost" size="sm" onClick={handleDelete} title="Delete chat" aria-label="Delete chat">
              <RiDeleteBinLine className="text-base" />
            </Button>
          </div>
        )}
      </header>

      <div className="flex-1 overflow-y-auto px-6 py-8">
        {messages.length === 0 && !isSending ? (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-14 h-14 rounded-2xl bg-[var(--color-accent-subtle)] border border-[var(--color-accent)]/20 flex items-center justify-center mb-5 mx-auto">
                <RiSparklingLine className="text-2xl text-[var(--color-accent)]" />
              </div>
              <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">What will you create?</h2>
              <p className="text-sm text-[var(--color-text-secondary)] max-w-xs">Ask Muse anything about writing, ideas, creativity, or filmmaking.</p>
            </motion.div>
          </div>
        ) : (
          <div className="space-y-5 max-w-3xl mx-auto">
            <AnimatePresence initial={false}>
              {messages.map((message) => (
                <motion.div
                  key={message._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.role === 'assistant' && (
                    <div className="w-7 h-7 rounded-lg bg-[var(--color-accent-subtle)] border border-[var(--color-accent)]/20 flex items-center justify-center mr-2.5 mt-0.5 shrink-0">
                      <RiSparklingLine className="text-xs text-[var(--color-accent)]" />
                    </div>
                  )}
                  <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-6
                    ${message.role === 'user'
                      ? 'bg-[var(--color-accent)] text-white rounded-br-sm'
                      : 'bg-[var(--color-surface-2)] border border-[var(--color-border)] text-[var(--color-text-primary)] rounded-bl-sm'
                    }`}
                  >
                    {message.role === 'assistant' ? (
                      <AssistantMessage
                        content={message.content}
                        animate={message._id === latestAssistantId}
                      />
                    ) : (
                      message.content
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {isSending && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="w-7 h-7 rounded-lg bg-[var(--color-accent-subtle)] border border-[var(--color-accent)]/20 flex items-center justify-center mr-2.5 mt-0.5 shrink-0">
                  <RiSparklingLine className="text-xs text-[var(--color-accent)]" />
                </div>
                <div className="bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-2xl rounded-bl-sm">
                  <ThinkingDots />
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="shrink-0 px-6 pb-6">
        <div className="relative max-w-3xl mx-auto p-2 rounded-xl bg-[var(--color-surface-1)] border border-[var(--color-border)] shadow-[var(--shadow-card)] focus-within:border-[var(--color-accent)]/50 transition-colors duration-150">
          <Textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message Muse..."
            rows={2}
            maxLength={10000}
            aria-label="Message Muse"
            className="border-0 bg-transparent focus:border-0 px-2 py-2 pr-14"
          />
          <Button
            type="submit"
            size="md"
            isLoading={isSending}
            disabled={!content.trim()}
            aria-label="Send message"
            title="Send message"
            className="absolute right-3 top-1/2 h-12 w-12 -translate-y-1/2 p-0"
          >
            {!isSending && <RiSendPlaneLine className="text-3xl" />}
          </Button>
        </div>
        <p className="mt-2 text-center text-xs text-[var(--color-text-muted)]">Enter to send · Shift+Enter for a new line</p>
      </form>
    </div>
  );
}

export default ChatPage;
