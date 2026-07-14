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

/** Supported language options displayed in the selector. */
const LANGUAGE_OPTIONS = [
  Language.English, Language.Spanish, Language.French,
  Language.Arabic, Language.Hindi, Language.Chinese,
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

  const handleLanguageChange = useCallback(
    (lang: Language) => dispatch({ type: 'SET_LANGUAGE', payload: lang }),
    [dispatch],
  );

  return (
    <main className="page chat-page" id="main-content" role="main">
      <LiveRegion message={announcement} politeness="polite" />

      {/* Header */}
      <header className="chat-header">
        <h1 className="page-title">🤖 {t('assistant', language)}</h1>
        <p className="page-subtitle">Ask me anything about the stadium</p>
      </header>

      {/* Language selector */}
      <div className="chat-lang-bar">
        {LANGUAGE_OPTIONS.map((lang) => (
          <button
            key={lang}
            className={`btn btn-sm ${language === lang ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => handleLanguageChange(lang)}
            aria-label={`Switch language to ${getLanguageName(lang)}`}
            aria-pressed={language === lang}
          >
            {getLanguageName(lang)}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="chat-messages" role="log" aria-label="Chat messages" aria-live="polite">
        {chatMessages.length === 0 && (
          <div className="chat-empty">
            <div className="chat-empty__icon">🤖</div>
            <h2 className="chat-empty__title">{t('welcome', language)}</h2>
            <p className="chat-empty__desc">{t('askAI', language)}</p>
            <div className="chat-chips">
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
            className={`chat-msg ${msg.role === 'user' ? 'chat-msg--user' : 'chat-msg--ai'}`}
            role="article"
            aria-label={`${msg.role === 'user' ? 'You' : 'StadiumAI'} said`}
          >
            <div className={`chat-bubble ${msg.role === 'user' ? 'chat-bubble--user' : 'chat-bubble--ai'}`}>
              {msg.content}
            </div>
            <div className={`chat-timestamp ${msg.role === 'user' ? 'chat-timestamp--right' : 'chat-timestamp--left'}`}>
              {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        ))}

        {isAILoading && (
          <div className="chat-msg--ai" aria-label="StadiumAI is typing">
            <div className="glass-card-flat chat-typing">
              <span className="animate-pulse">🤖 Thinking...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="chat-form" aria-label="Send a message">
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
          className="chat-input"
        />
        <button
          type="submit"
          disabled={!input.trim() || isAILoading}
          className="btn btn-primary chat-send"
          aria-label={t('send', language)}
        >
          {t('send', language)}
        </button>
      </form>
    </main>
  );
}

export default memo(AIAssistant);
