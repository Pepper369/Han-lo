import React from 'react';

interface TopBarProps {
  currentLvl: string;
  onSelectLevel: (lvl: string) => void;
  streakCount: number;
  onOpenSettings: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentLvl,
  onSelectLevel,
  streakCount,
  onOpenSettings
}) => {
  let subText = "HSK 1 · 300 từ";
  if (currentLvl === "0") subText = "Chặng 0 · Nhập môn Phát âm & Bút thuận";
  else if (currentLvl === "1") subText = "HSK 1 · 300 từ";
  else if (currentLvl === "2") subText = "HSK 2 · 200 từ";
  else if (currentLvl === "3") subText = "HSK 3 · 300 từ";
  else subText = "HSK 1+2+3 · 800 từ";

  return (
    <header className="topbar">
      <div className="brand">
        <span className="brand-mark" aria-hidden="true">汉</span>
        <div className="brand-text">
          <h1>Hán Lộ</h1>
          <p id="brand-sub">{subText}</p>
        </div>
      </div>
      <div className="top-actions">
        <div className="level-switch" role="group" aria-label="Chọn cấp độ HSK">
          <button
            className={`level-pill ${currentLvl === "0" ? "active" : ""}`}
            onClick={() => onSelectLevel("0")}
          >
            Số 0
          </button>
          <button
            className={`level-pill ${currentLvl === "1" ? "active" : ""}`}
            onClick={() => onSelectLevel("1")}
          >
            HSK 1
          </button>
          <button
            className={`level-pill ${currentLvl === "2" ? "active" : ""}`}
            onClick={() => onSelectLevel("2")}
          >
            HSK 2
          </button>
          <button
            className={`level-pill ${currentLvl === "3" ? "active" : ""}`}
            onClick={() => onSelectLevel("3")}
          >
            HSK 3
          </button>
          <button
            className={`level-pill ${currentLvl === "all" ? "active" : ""}`}
            onClick={() => onSelectLevel("all")}
          >
            Tất cả
          </button>
        </div>
        <span className="streak" title="Chuỗi ngày học">
          🔥 <b>{streakCount}</b>
        </span>
        <button
          className="icon-btn"
          onClick={onOpenSettings}
          aria-label="Cài đặt"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="4" y1="7" x2="20" y2="7"/><circle cx="9" cy="7" r="2.5"/>
            <line x1="4" y1="17" x2="20" y2="17"/><circle cx="15" cy="17" r="2.5"/>
          </svg>
        </button>
      </div>
    </header>
  );
};
