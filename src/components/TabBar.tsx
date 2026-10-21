import React from 'react';

export type NavTab = 'home' | 'exam' | 'dict' | 'write' | 'progress' | 'phonics' | 'grammar' | 'reader' | 'speech' | 'dictation' | 'radicals';

interface TabBarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
}

export const TabBar: React.FC<TabBarProps> = ({ currentTab, onSelectTab }) => {
  const isLearnActive =
    currentTab === 'home' ||
    currentTab === 'phonics' ||
    currentTab === 'grammar' ||
    currentTab === 'reader' ||
    currentTab === 'speech' ||
    currentTab === 'dictation' ||
    currentTab === 'radicals';

  return (
    <nav className="tabbar" aria-label="Điều hướng chính">
      <button
        className={`tab ${isLearnActive ? 'active' : ''}`}
        onClick={() => onSelectTab('home')}
      >
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 7c-1.7-1.5-3.8-2-8-2v12c4.2 0 6.3.5 8 2 1.7-1.5 3.8-2 8-2V5c-4.2 0-6.3.5-8 2z"/>
          <path d="M12 7v12"/>
        </svg>
        <span>Học</span>
      </button>

      <button
        className={`tab ${currentTab === 'exam' ? 'active' : ''}`}
        onClick={() => onSelectTab('exam')}
      >
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
          <polyline points="10 9 9 9 8 9"/>
        </svg>
        <span>Thi thử</span>
      </button>

      <button
        className={`tab ${currentTab === 'dict' ? 'active' : ''}`}
        onClick={() => onSelectTab('dict')}
      >
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="11" cy="11" r="7"/>
          <line x1="16.5" y1="16.5" x2="21" y2="21"/>
        </svg>
        <span>Từ điển</span>
      </button>

      <button
        className={`tab ${currentTab === 'write' ? 'active' : ''}`}
        onClick={() => onSelectTab('write')}
      >
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 20h9"/>
          <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>
        </svg>
        <span>Viết</span>
      </button>

      <button
        className={`tab ${currentTab === 'progress' ? 'active' : ''}`}
        onClick={() => onSelectTab('progress')}
      >
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="4" y1="20" x2="4" y2="12"/>
          <line x1="10" y1="20" x2="10" y2="5"/>
          <line x1="16" y1="20" x2="16" y2="9"/>
          <line x1="22" y1="20" x2="2" y2="20"/>
        </svg>
        <span>Tiến độ</span>
      </button>
    </nav>
  );
};
