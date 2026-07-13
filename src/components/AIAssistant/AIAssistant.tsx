/**
 * @fileoverview AI Assistant — conversational chat interface with GenAI.
 * Supports multilingual queries, suggestion chips, and accessible messaging.
 */

import { memo, useState, useCallback, useRef, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { Language, type ChatMessage } from '@/types';
import { t, getLanguageName } from '@/utils/i18n';
import { sanitizeInput } from '@/utils/sanitize';
import { validateInput, chatMessageSchema } from '@/utils/validation';
import { getAIResponse } from '@/services/aiService';
import { LiveRegion } from '@/components/common/Accessibility';

/** Suggestion chips for quick queries. */
const SUGGESTIONS = [
  '🧭 Find my seat',
  '🍔 Where to eat?',
  '🚻 Nearest restroom',
  '🚗 Transport options',
  '♿ Accessibility help',
  '👥 Crowd status',
  '⚽ Match score',
  '♻️ Sustainability',
] as const;

function AIAssistant() {
  const { state, dispatch } = useApp();
  const { chatMessages, isAILoading, language } = state;
  const [input, setInput] = useState('');
  const [announcement, setAnnouncement] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, scrollToBottom]);

  const sendMessage = useCallback(
    async (text: string) => {
      const sanitized = sanitizeInput(text);
      const validation = validateInput(chatMessageSchema, { content: sanitized, language });

      if (!validation.success) {
        setAnnouncement(validation.errors[0] ?? 'Invalid input');
        return;
      }

      const userMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        role: 'user',
        content: validation.data.content,
        timestamp: Date.now(),
        language,
      };

      dispatch({ type: 'ADD_CHAT_MESSAGE', payload: userMsg });
      dispatch({ type: 'SET_AI_LOADING', payload: true });
      setInput('');
      setAnnouncement('Processing your message...');

      try {
        const response = await getAIResponse(validation.data.content, state, language);
        const aiMsg: ChatMessage = {
          id: `msg-${Date.now()}-ai`,
          role: 'assistant',
          content: response,
          timestamp: Date.now(),
          language,
        };
        dispatch({ type: 'ADD_CHAT_MESSAGE', payload: aiMsg });
        setAnnouncement('StadiumAI has responded');
      } catch {
        const errorMsg: ChatMessage = {
          id: `msg-${Date.now()}-err`,
          role: 'assistant',
          content: '❌ Sorry, I encountered an error. Please try again.',
          timestamp: Date.now(),
          language,
        };
        dispatch({ type: 'ADD_CHAT_MESSAGE', payload: errorMsg });
        setAnnouncement('Error occurred while processing');
      } finally {
        dispatch({ type: 'SET_AI_LOADING', payload: false });
      }
    },
    [state, language, dispatch],
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (input.trim() && !isAILoading) {
        void sendMessage(input);
      }
    },
    [input, isAILoading, sendMessage],
  );

  const handleChipClick = useCallback(
    (suggestion: string) => {
      const cleanText = suggestion.replace(/^[^\s]+\s/, '');
      void sendMessage(cleanText);
    },
    [sendMessage],
  );

  return (
    <main className="page" id="main-content" role="main" style={{ display: 'flex', flexDirection: 'column', padding: 0 }}>
      <LiveRegion message={announcement} politeness="polite" />

      {/* Header */}
      <header style={{ padding: 'var(--space-lg) var(--space-md) var(--space-sm)' }}>
        <h1 className="page-title">🤖 {t('assistant', language)}</h1>
        <p className="page-subtitle">Ask me anything about the stadium</p>
      </header>

      {/* Language selector */}
      <div style={{ padding: '0 var(--space-md) var(--space-sm)', display: 'flex', gap: 'var(--space-xs)', flexWrap: 'wrap' }}>
        {[Language.English, Language.Spanish, Language.French, Language.Arabic, Language.Hindi, Language.Chinese].map((lang) => (
          <button
            key={lang}
            className={`btn btn-sm ${language === lang ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => dispatch({ type: 'SET_LANGUAGE', payload: lang })}
            aria-label={`Switch language to ${getLanguageName(lang)}`}
            aria-pressed={language === lang}
          >
            {getLanguageName(lang)}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: 'var(--space-md)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-sm)',
        }}
        role="log"
        aria-label="Chat messages"
        aria-live="polite"
      >
        {chatMessages.length === 0 && (
          <div style={{ textAlign: 'center', padding: 'var(--space-xl) 0' }}>
            <div style={{ fontSize: '3rem', marginBottom: 'var(--space-md)' }}>🤖</div>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: 'var(--space-sm)' }}>
              {t('welcome', language)}
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-lg)' }}>
              {t('askAI', language)}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-xs)', justifyContent: 'center' }}>
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  className="btn btn-secondary btn-sm"
                  onClick={() => handleChipClick(s)}
                  aria-label={`Ask: ${s}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {chatMessages.map((msg) => (
          <div
            key={msg.id}
            style={{
              alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '85%',
            }}
            role="article"
            aria-label={`${msg.role === 'user' ? 'You' : 'StadiumAI'} said`}
          >
            <div
              style={{
                padding: 'var(--space-sm) var(--space-md)',
                borderRadius: 'var(--radius-md)',
                borderBottomRightRadius: msg.role === 'user' ? '4px' : undefined,
                borderBottomLeftRadius: msg.role === 'assistant' ? '4px' : undefined,
                background: msg.role === 'user'
                  ? 'linear-gradient(135deg, var(--color-accent-primary), var(--color-accent-secondary))'
                  : 'var(--color-bg-card)',
                border: msg.role === 'assistant' ? '1px solid var(--color-border-glass)' : 'none',
                fontSize: '0.875rem',
                lineHeight: 1.6,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}
            >
              {msg.content}
            </div>
            <div style={{ fontSize: '0.625rem', color: 'var(--color-text-muted)', marginTop: '2px', textAlign: msg.role === 'user' ? 'right' : 'left' }}>
              {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        ))}

        {isAILoading && (
          <div style={{ alignSelf: 'flex-start', maxWidth: '85%' }} aria-label="StadiumAI is typing">
            <div className="glass-card-flat" style={{ padding: 'var(--space-sm) var(--space-md)', fontSize: '0.875rem' }}>
              <span style={{ animation: 'pulse 1.5s ease-in-out infinite' }}>🤖 Thinking...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        style={{
          padding: 'var(--space-md)',
          paddingBottom: 'calc(var(--navbar-height) + var(--space-md))',
          display: 'flex',
          gap: 'var(--space-sm)',
          background: 'rgba(10, 15, 44, 0.95)',
          borderTop: '1px solid var(--color-border-glass)',
        }}
        aria-label="Send a message"
      >
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t('askAI', language)}
          maxLength={500}
          disabled={isAILoading}
          aria-label="Type your message"
          autoComplete="off"
          style={{
            flex: 1,
            padding: 'var(--space-sm) var(--space-md)',
            background: 'var(--color-bg-input)',
            border: '1px solid var(--color-border-glass)',
            borderRadius: 'var(--radius-full)',
            color: 'var(--color-text-primary)',
            fontSize: '0.875rem',
            fontFamily: 'var(--font-body)',
            outline: 'none',
          }}
        />
        <button
          type="submit"
          disabled={!input.trim() || isAILoading}
          className="btn btn-primary"
          style={{ borderRadius: 'var(--radius-full)', padding: 'var(--space-sm) var(--space-md)' }}
          aria-label={t('send', language)}
        >
          {t('send', language)}
        </button>
      </form>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </main>
  );
}

export default memo(AIAssistant);
