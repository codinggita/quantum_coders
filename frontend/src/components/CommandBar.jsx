import { useState, useRef } from 'react';
import WaveformBars from './WaveformBars';
import './CommandBar.css';

/**
 * CommandBar — mic button + text input + listening state controls.
 */
export default function CommandBar({
  state = 'idle',
  amplitude = 0,
  partialTranscript = '',
  onSend,
  onStartListening,
  onStopListening,
  onStopSpeaking,
  disabled = false,
}) {
  const [text, setText] = useState('');
  const inputRef = useRef(null);

  const isListening = state === 'listening';
  const isSpeaking  = state === 'speaking';
  const isThinking  = state === 'thinking';
  const isExtracting = state === 'extracting';
  const isBusy = isThinking || isExtracting;

  const handleSubmit = (e) => {
    e?.preventDefault();
    const msg = text.trim();
    if (msg && onSend) {
      onSend(msg);
      setText('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // ── Listening state UI
  if (isListening) {
    return (
      <div className="cmd-bar cmd-bar--listening">
        <div className="cmd-bar__listening-display">
          <WaveformBars amplitude={amplitude} color="coral" bars={9} />
          <span className="cmd-bar__partial-text" aria-live="polite">
            {partialTranscript || <span className="cmd-bar__partial-hint">Listening…</span>}
          </span>
        </div>
        <button
          className="cmd-bar__stop-btn"
          onClick={onStopListening}
          aria-label="Stop listening"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <rect x="4" y="4" width="16" height="16" rx="2" />
          </svg>
          Stop
        </button>
      </div>
    );
  }

  // ── Speaking state UI
  if (isSpeaking) {
    return (
      <div className="cmd-bar cmd-bar--speaking">
        <WaveformBars amplitude={amplitude} color="cyan" bars={9} />
        <span className="cmd-bar__speaking-label">Speaking…</span>
        <button
          className="cmd-bar__stop-btn cmd-bar__stop-btn--speaking"
          onClick={onStopSpeaking}
          aria-label="Stop speaking"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <rect x="4" y="4" width="16" height="16" rx="2" />
          </svg>
          Stop
        </button>
      </div>
    );
  }

  // ── Default idle/thinking UI
  return (
    <form className="cmd-bar" onSubmit={handleSubmit} aria-label="Message input">
      {/* Mic button */}
      <button
        type="button"
        className="cmd-bar__mic-btn"
        onClick={onStartListening}
        disabled={disabled || isBusy}
        aria-label="Start voice input"
        title="Hold to speak"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
          <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
          <line x1="12" y1="19" x2="12" y2="23" />
          <line x1="8"  y1="23" x2="16" y2="23" />
        </svg>
      </button>

      {/* Text input */}
      <input
        ref={inputRef}
        className="cmd-bar__input"
        type="text"
        placeholder={isBusy ? 'Lumen is working…' : 'Ask anything about this page…'}
        value={text}
        onChange={e => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled || isBusy}
        aria-label="Type your question"
        autoComplete="off"
        spellCheck="true"
      />

      {/* Send button */}
      <button
        type="submit"
        className="cmd-bar__send-btn"
        disabled={!text.trim() || disabled || isBusy}
        aria-label="Send message"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="22" y1="2" x2="11" y2="13" />
          <polygon points="22 2 15 22 11 13 2 9 22 2" />
        </svg>
      </button>
    </form>
  );
}
