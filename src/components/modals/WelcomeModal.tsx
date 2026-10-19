import React, { useState } from 'react';

interface WelcomeModalProps {
  initialGoalType: string;
  initialGoalCount: number;
  onComplete: (goalType: string, goalCount: number) => void;
  onOpenIntro: () => void;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({
  initialGoalType,
  initialGoalCount,
  onComplete,
  onOpenIntro
}) => {
  const [goalType, setGoalType] = useState<string>(initialGoalType || 'thi');
  const [goalCount, setGoalCount] = useState<number>(initialGoalCount || 10);

  return (
    <div id="welcome" className="welcome" role="dialog" aria-modal="true">
      <div className="welcome-card">
        <div className="brand-mark welcome-mark" aria-hidden="true">
          汉
        </div>
        <p className="eyebrow">HSK 3.0 · Lộ trình từ Con Số 0 đến HSK 3</p>
        <h1>Học tiếng Trung bài bản từ số 0</h1>
        <p className="welcome-lede">
          Bắt đầu từ âm tiết Pinyin, 8 nét cơ bản &amp; quy tắc bút thuận đi nét, 800 từ vựng cốt lõi HSK 1–3, luyện phát âm AI và ôn tập SM-2.
        </p>

        <div className="welcome-block">
          <p className="eyebrow">Mục tiêu của bạn</p>
          <div className="choice-row" role="radiogroup">
            <button
              type="button"
              className={`choice ${goalType === 'thi' ? 'active' : ''}`}
              onClick={() => setGoalType('thi')}
            >
              Thi HSK
            </button>
            <button
              type="button"
              className={`choice ${goalType === 'viec' ? 'active' : ''}`}
              onClick={() => setGoalType('viec')}
            >
              Đi làm
            </button>
            <button
              type="button"
              className={`choice ${goalType === 'vui' ? 'active' : ''}`}
              onClick={() => setGoalType('vui')}
            >
              Sở thích
            </button>
          </div>
        </div>

        <div className="welcome-block">
          <p className="eyebrow">Mỗi ngày học</p>
          <div className="choice-row" role="radiogroup">
            <button
              type="button"
              className={`choice ${goalCount === 5 ? 'active' : ''}`}
              onClick={() => setGoalCount(5)}
            >
              5 từ
            </button>
            <button
              type="button"
              className={`choice ${goalCount === 10 ? 'active' : ''}`}
              onClick={() => setGoalCount(10)}
            >
              10 từ
            </button>
            <button
              type="button"
              className={`choice ${goalCount === 20 ? 'active' : ''}`}
              onClick={() => setGoalCount(20)}
            >
              20 từ
            </button>
          </div>
        </div>

        <button
          className="btn primary wide"
          onClick={() => onComplete(goalType, goalCount)}
        >
          Bắt đầu học
        </button>

        <p className="muted small center" style={{ marginTop: 14 }}>
          Không cần tài khoản · Tiến độ lưu trên máy
          <br />
          <button
            type="button"
            className="link-btn"
            onClick={onOpenIntro}
            style={{ marginTop: 4, textDecoration: 'underline' }}
          >
            HSK 3.0 là gì?
          </button>
        </p>
      </div>
    </div>
  );
};
