import React from 'react';
import { Word, Card } from '../../types';
import { isDue, stage } from '../../utils/core';
import { NavTab } from '../TabBar';

interface HomeViewProps {
  currentLvl: string;
  words: Word[];
  allWords: Word[];
  cards: Record<number, Card>;
  dailyNew: number;
  goal: number;
  onStartLearn: (lessonNum?: number, count?: number) => void;
  onStartReview: () => void;
  onNavigate: (tab: NavTab) => void;
  onSelectLevel: (lvl: string) => void;
}

const LESSON_SIZE = 10;

export const HomeView: React.FC<HomeViewProps> = ({
  currentLvl,
  words,
  allWords,
  cards,
  dailyNew,
  goal,
  onStartLearn,
  onStartReview,
  onNavigate,
  onSelectLevel
}) => {
  const now = Date.now();
  const due = words.filter((w) => isDue(cards[w.id], now));
  const learned = words.filter((w) => !!cards[w.id]).length;
  const pct = words.length ? Math.round((learned / words.length) * 100) : 0;
  const mastered = words.filter((w) => stage(cards[w.id], now) === 'mastered').length;
  const left = goal - dailyNew;

  const nextWords = words.filter((w) => !cards[w.id]);
  const nextLesson = nextWords.length ? nextWords[0].lesson : null;
  const totalLessons = Math.ceil(words.length / LESSON_SIZE);

  function todayLabel(): string {
    try {
      return new Date().toLocaleDateString("vi-VN", {
        weekday: "long",
        day: "2-digit",
        month: "2-digit"
      });
    } catch (e) {
      return "";
    }
  }

  function greeting(): string {
    const h = new Date().getHours();
    if (h < 11) return "Chào buổi sáng";
    if (h < 14) return "Chào buổi trưa";
    if (h < 18) return "Chào buổi chiều";
    return "Chào buổi tối";
  }

  // Mascot dynamic message
  let mascotMsg = "Mỗi ngày tiến một bước nhỏ, đường dài vạn dặm cũng tới nơi!";
  if (due.length > 0) {
    mascotMsg = `Bạn có <b>${due.length} từ</b> đến hạn cần ôn lại hôm nay. Ôn cách quãng đúng giờ giúp nhớ sâu gấp 3 lần đấy!`;
  } else if (dailyNew >= goal) {
    mascotMsg = `Xuất sắc! Bạn đã hoàn thành mục tiêu <b>${goal} từ mới</b> hôm nay. Hãy giữ vững ngọn lửa streak nhé!`;
  } else if (learned === 0) {
    mascotMsg = "Chào mừng bạn đến với Hán Lộ! Hãy bắt đầu với bài học đầu tiên ngay thôi.";
  }

  // Level 0: Roadmap
  if (currentLvl === "0") {
    return (
      <main id="view-home" className="view">
        <section className="card zero-welcome-card">
          <div className="eyebrow">Lộ Trình Nhập Môn Số 0 · HSK 3.0</div>
          <h2>Bắt Đầu Từ Con Số 0</h2>
          <p className="muted">
            Trước khi học từ vựng HSK 1, người mới bắt đầu cần nắm vững 3 trụ cột căn bản: <b>Ngữ âm Pinyin (thanh mẫu, vận mẫu, thanh điệu)</b>, <b>8 nét cơ bản</b> và <b>8 quy tắc bút thuận vàng</b>.
          </p>

          <div className="zero-lesson-list">
            <div className="zero-lesson-item" onClick={() => onNavigate('phonics')}>
              <div className="zli-left">
                <span className="zli-icon">🎵</span>
                <div className="zli-text">
                  <h4>1. 4 Thanh Điệu Pinyin Chuẩn</h4>
                  <p>Thanh 1 (cao phẳng), Thanh 2 (vút lên), Thanh 3 (lượn sâu), Thanh 4 (dứt khoát)</p>
                </div>
              </div>
              <span className="badge s-learning">Học ngay →</span>
            </div>

            <div className="zero-lesson-item" onClick={() => onNavigate('phonics')}>
              <div className="zli-left">
                <span className="zli-icon">🗣️</span>
                <div className="zli-text">
                  <h4>2. 23 Thanh Mẫu (Phụ Âm Đầu)</h4>
                  <p>b, p, m, f, d, t, n, l, g, k, h, j, q, x, zh, ch, sh, r, z, c, s, y, w</p>
                </div>
              </div>
              <span className="badge s-learning">Xem bảng →</span>
            </div>

            <div className="zero-lesson-item" onClick={() => onNavigate('phonics')}>
              <div className="zli-left">
                <span className="zli-icon">🎼</span>
                <div className="zli-text">
                  <h4>3. 36 Vận Mẫu (Nguyên Âm &amp; Âm Mũi)</h4>
                  <p>6 đơn (a, o, e, i, u, ü), 13 kép, 16 âm mũi (-n, -ng) &amp; uốn lưỡi (er)</p>
                </div>
              </div>
              <span className="badge s-learning">Luyện phát âm →</span>
            </div>

            <div className="zero-lesson-item" onClick={() => onNavigate('phonics')}>
              <div className="zli-left">
                <span className="zli-icon">✍️</span>
                <div className="zli-text">
                  <h4>4. 8 Nét Chữ Hán Cơ Bản (Vĩnh Tự Bát Pháp)</h4>
                  <p>Chấm (点), Ngang (横), Sổ (竖), Phẩy (撇), Mác (捺), Hất (提), Gập (折), Móc (钩)</p>
                </div>
              </div>
              <span className="badge s-mastered">Tập đi nét →</span>
            </div>

            <div className="zero-lesson-item" onClick={() => onNavigate('write')}>
              <div className="zli-left">
                <span className="zli-icon">📜</span>
                <div className="zli-text">
                  <h4>5. 8 Quy Tắc Bút Thuận Vàng</h4>
                  <p>Ngang trước sổ sau, trên trước dưới sau, trái trước phải sau, ngoài trước trong sau...</p>
                </div>
              </div>
              <span className="badge s-mastered">Xem quy tắc →</span>
            </div>

            <div className="zero-lesson-item" onClick={() => onNavigate('speech')}>
              <div className="zli-left">
                <span className="zli-icon">🎙️</span>
                <div className="zli-text">
                  <h4>6. Web Speech AI Luyện Phát Âm Trực Tiếp</h4>
                  <p>Bật micro đọc thử chữ Hán &amp; nhận phản hồi chấm điểm tức thì</p>
                </div>
              </div>
              <span className="badge s-learning">Luyện nói →</span>
            </div>
          </div>

          <div style={{ marginTop: 16 }}>
            <button
              className="btn primary wide"
              onClick={() => onSelectLevel("1")}
            >
              🚀 Tiến lên Chặng 1: Học từ vựng HSK 1 (300 từ)
            </button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main id="view-home" className="view">
      {/* Mascot bubble */}
      <div className="mascot-box">
        <svg className="mascot-avatar" viewBox="0 0 64 64" fill="none" aria-hidden="true">
          <circle cx="32" cy="32" r="28" fill="#eaf4f0" stroke="#2f6f5e" strokeWidth="2"/>
          <path d="M22 18 Q20 10 15 12 Q18 16 22 20" fill="#b97a12"/>
          <path d="M42 18 Q44 10 49 12 Q46 16 42 20" fill="#b97a12"/>
          <ellipse cx="32" cy="34" rx="18" ry="16" fill="#2f6f5e"/>
          <circle cx="26" cy="32" r="4.5" fill="#fff"/>
          <circle cx="26" cy="32" r="2.5" fill="#211f1b"/>
          <circle cx="27" cy="30.5" r="1" fill="#fff"/>
          <circle cx="38" cy="32" r="4.5" fill="#fff"/>
          <circle cx="38" cy="32" r="2.5" fill="#211f1b"/>
          <circle cx="39" cy="30.5" r="1" fill="#fff"/>
          <circle cx="21" cy="38" r="3" fill="#f5c2bc" opacity="0.8"/>
          <circle cx="43" cy="38" r="3" fill="#f5c2bc" opacity="0.8"/>
          <circle cx="30" cy="37" r="1" fill="#eaf4f0"/>
          <circle cx="34" cy="37" r="1" fill="#eaf4f0"/>
          <path d="M28 41 Q32 45 36 41" stroke="#fff" strokeWidth="2" strokeLinecap="round" fill="none"/>
        </svg>
        <div className="mascot-bubble" dangerouslySetInnerHTML={{ __html: mascotMsg }}></div>
      </div>

      {/* Hero Study Plan Card */}
      <section className="card hero">
        <p className="eyebrow">{todayLabel()}</p>
        <h2>{greeting()}</h2>
        <div className="plan">
          <div className="plan-row">
            <span className="dot due"></span>
            <span>Đến hạn ôn</span>
            <b>{due.length} từ</b>
          </div>
          <div className="plan-row">
            <span className="dot new"></span>
            <span>Từ mới hôm nay</span>
            <b>{dailyNew} / {goal}</b>
          </div>
        </div>
        <div className="hero-actions">
          {due.length > 0 && (
            <button className="btn primary" onClick={onStartReview}>
              Ôn tập ngay ({due.length})
            </button>
          )}
          <button
            className={`btn ${due.length > 0 ? "ghost" : "primary"}`}
            onClick={() => onStartLearn(undefined, left > 0 ? left : 10)}
          >
            {left > 0 ? `Học ${left} từ mới` : "Học thêm 10 từ"}
          </button>
        </div>
      </section>

      {/* Bento Grid Feature Explore */}
      <section className="card">
        <div className="row-between">
          <h3>Khám Phá Toàn Diện</h3>
          <span className="muted small">Chuẩn HSK 3.0</span>
        </div>
        <div className="bento-grid">
          <div className="bento-card" onClick={() => onNavigate('phonics')}>
            <span className="bento-icon">🎵</span>
            <h4>Ngữ Âm Pinyin</h4>
            <p>23 thanh mẫu, 36 vận mẫu &amp; 4 thanh điệu.</p>
          </div>
          <div className="bento-card" onClick={() => onNavigate('speech')}>
            <span className="bento-icon">🎙️</span>
            <h4>Luyện Nói zh-CN</h4>
            <p>Web Speech AI chấm điểm phát âm trực tiếp.</p>
          </div>
          <div className="bento-card" onClick={() => onNavigate('reader')}>
            <span className="bento-icon">📖</span>
            <h4>Đọc Tương Tác</h4>
            <p>Bài đọc ngắn, ẩn/hiện Pinyin, tra từ 1-chạm.</p>
          </div>
          <div className="bento-card" onClick={() => onNavigate('grammar')}>
            <span className="bento-icon">⚖️</span>
            <h4>Sắc Thái &amp; Ngữ Pháp</h4>
            <p>So sánh 二/两, 会/能/可以, 的/得/地...</p>
          </div>
          <div className="bento-card" onClick={() => onNavigate('exam')}>
            <span className="bento-icon">📝</span>
            <h4>Thi Thử HSK 1 &amp; 2</h4>
            <p>Đề chuẩn 40–60 câu, đếm giờ, chấm điểm.</p>
          </div>
        </div>
      </section>

      {/* Progress Breakdown */}
      <section className="card">
        <div className="row-between">
          <h3>
            Tiến độ {currentLvl === "1" ? "HSK 1" : currentLvl === "2" ? "HSK 2" : currentLvl === "3" ? "HSK 3" : "HSK 1+2+3"}
          </h3>
          <span className="muted">{learned}/{words.length} từ</span>
        </div>
        <div
          className="bar"
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Tiến độ từ vựng"
        >
          <i style={{ width: `${pct}%` }}></i>
        </div>
        <div className="legend">
          <span><i className="dot mastered"></i>Đã thuộc {mastered}</span>
          <span><i className="dot learning"></i>Đang học {learned - mastered}</span>
          <span><i className="dot new"></i>Chưa học {words.length - learned}</span>
        </div>
      </section>

      {/* Lessons Grid */}
      <section className="card">
        <div className="row-between">
          <h3>Bài học</h3>
          {nextLesson && <span className="muted">Bài tiếp theo: {nextLesson}</span>}
        </div>
        <p className="muted small">10 từ / bài · nhấn số để học riêng bài đó</p>
        <div className="lessons">
          {Array.from({ length: totalLessons }, (_, i) => i + 1).map((lessonNum) => {
            const lessonWords = words.filter((w) => w.lesson === lessonNum);
            const lessonLearned = lessonWords.filter((w) => !!cards[w.id]).length;
            const isAllMastered = lessonWords.every((w) => stage(cards[w.id], now) === 'mastered');
            const isNext = lessonNum === nextLesson;

            let cls = "lesson";
            if (isAllMastered && lessonWords.length > 0) cls += " mastered";
            else if (lessonLearned > 0) cls += " active";
            else if (isNext) cls += " next";

            return (
              <button
                key={lessonNum}
                className={cls}
                onClick={() => onStartLearn(lessonNum, LESSON_SIZE)}
                title={`Bài ${lessonNum}: ${lessonLearned}/${lessonWords.length} từ`}
              >
                <span>{lessonNum}</span>
                <span className="lesson-sub">{lessonLearned}/{lessonWords.length}</span>
              </button>
            );
          })}
        </div>
      </section>
    </main>
  );
};
