import React, { useState, useMemo } from 'react';
import { Word, Card } from '../../types';
import { stage, norm, syllables, toneOf } from '../../utils/core';
import { speak } from '../../utils/tts';

interface DictViewProps {
  words: Word[];
  cards: Record<number, Card>;
  showPinyin: boolean;
  audioEnabled: boolean;
  onOpenLookup: (word: Word) => void;
}

export function renderPinyinElements(pinyin: string): React.ReactNode {
  return syllables(pinyin).map((s, idx) => {
    const tone = toneOf(s);
    return (
      <span key={idx} className={`t${tone}`}>
        {s}{' '}
      </span>
    );
  });
}

export const DictView: React.FC<DictViewProps> = ({
  words,
  cards,
  showPinyin,
  audioEnabled,
  onOpenLookup
}) => {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'new' | 'learning' | 'mastered'>('all');

  const filteredWords = useMemo(() => {
    const q = norm(query.trim());
    return words.filter((w) => {
      const s = stage(cards[w.id]);
      if (filter === 'new' && s !== 'new') return false;
      if (filter === 'learning' && (s !== 'learning' && s !== 'review')) return false;
      if (filter === 'mastered' && s !== 'mastered') return false;
      if (!q) return true;
      return (
        norm(w.h).includes(q) ||
        norm(w.p).includes(q) ||
        norm(w.hv).includes(q) ||
        norm(w.vi).includes(q)
      );
    });
  }, [words, cards, query, filter]);

  return (
    <main id="view-dict" className="view">
      <div className="dict-head">
        <div className="search">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <circle cx="11" cy="11" r="7"/><line x1="16.5" y1="16.5" x2="21" y2="21"/>
          </svg>
          <input
            id="search"
            type="search"
            placeholder="Tìm chữ Hán, pinyin, Hán–Việt, nghĩa…"
            autoComplete="off"
            aria-label="Tìm từ"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="chips" role="group" aria-label="Lọc từ">
          <button
            className={`chip ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            Tất cả
          </button>
          <button
            className={`chip ${filter === 'new' ? 'active' : ''}`}
            onClick={() => setFilter('new')}
          >
            Chưa học
          </button>
          <button
            className={`chip ${filter === 'learning' ? 'active' : ''}`}
            onClick={() => setFilter('learning')}
          >
            Đang học
          </button>
          <button
            className={`chip ${filter === 'mastered' ? 'active' : ''}`}
            onClick={() => setFilter('mastered')}
          >
            Đã thuộc
          </button>
        </div>
        <p className="muted small" id="dict-count">
          {filteredWords.length} / {words.length} từ
        </p>
      </div>

      <ul className="word-list" id="dict-list">
        {filteredWords.length === 0 ? (
          <li className="empty">Không tìm thấy từ phù hợp.</li>
        ) : (
          filteredWords.map((w) => {
            const s = stage(cards[w.id]);
            return (
              <li
                key={w.id}
                className={`word-row ${s}`}
                onClick={() => onOpenLookup(w)}
              >
                <div className="w-main">
                  <span className="w-hz">{w.h}</span>
                  {showPinyin && (
                    <span className="w-py">{renderPinyinElements(w.p)}</span>
                  )}
                </div>
                <div className="w-sub">
                  <span className="w-hv">{w.hv}</span>
                  <span className="w-vi">{w.vi}</span>
                </div>
                <button
                  className="icon-btn say"
                  onClick={(e) => {
                    e.stopPropagation();
                    speak(w.h, 0.82, audioEnabled);
                  }}
                  aria-label={`Nghe ${w.h}`}
                >
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 9v6h4l5 4V5L8 9z"/>
                    <path d="M17 8a5 5 0 0 1 0 8"/>
                  </svg>
                </button>
              </li>
            );
          })
        )}
      </ul>
    </main>
  );
};
