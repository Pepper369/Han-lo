import React from 'react';
import { ExamHistoryItem } from '../../types';

interface ExamViewProps {
  examHistory: ExamHistoryItem[];
  onStartExam: (level: 1 | 2) => void;
}

export const ExamView: React.FC<ExamViewProps> = ({ examHistory, onStartExam }) => {
  return (
    <main id="view-exam" className="view">
      <section className="card exam-intro">
        <div className="eyebrow">Chuẩn CTI / HSK 3.0</div>
        <h2>Thi Thử HSK Chuẩn Quốc Tế</h2>
        <p className="muted">
          Bộ đề trắc nghiệm chuẩn mô phỏng đúng 100% cấu trúc phòng thi thật: đồng hồ đếm ngược, audio phát âm zh-CN, tự động chấm điểm và phân tích kỹ năng.
        </p>

        <div className="exam-badge-row">
          <span className="exam-tag">⏱️ 35 – 55 phút</span>
          <span className="exam-tag">📝 40 – 60 câu</span>
          <span className="exam-tag">🎯 Đạt: ≥ 120 / 200 điểm</span>
          <span className="exam-tag">🔊 Giọng đọc zh-CN</span>
        </div>

        <ul className="exam-rule-list muted">
          <li><b>Phần 1 — Nghe hiểu (听力):</b> Nghe phát âm chuẩn zh-CN và chọn đáp án đúng.</li>
          <li><b>Phần 2 — Đọc hiểu (阅读):</b> Kiểm tra từ vựng, ngữ pháp, điền từ và đọc hiểu đối thoại.</li>
          <li>Hệ thống tự động chấm điểm và lưu lịch sử thi chi tiết.</li>
        </ul>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, margin: '18px 0 10px' }}>
          <button
            className="btn primary wide"
            onClick={() => onStartExam(1)}
            style={{ padding: 14, fontSize: 15, fontWeight: 600 }}
          >
            🎯 Thi Thử HSK 1 (40 câu / 35 phút)
          </button>
          <button
            className="btn ghost wide"
            onClick={() => onStartExam(2)}
            style={{ padding: 14, fontSize: 15, fontWeight: 600 }}
          >
            🚀 Thi Thử HSK 2 (60 câu / 55 phút)
          </button>
        </div>

        {examHistory && examHistory.length > 0 && (
          <div className="exam-history" style={{ marginTop: 24 }}>
            <h3>Lịch sử thi thử ({examHistory.length} lần)</h3>
            {examHistory.map((item, idx) => {
              const cls = item.passed ? "score-pass" : "score-fail";
              const badge = item.passed ? "ĐỖ (合格)" : "CHƯA ĐẠT (不合格)";
              return (
                <div key={idx} className="exam-history-item">
                  <div>
                    <b>Lần {examHistory.length - idx} · {item.date}</b>
                    <div className="muted small">
                      Nghe: {item.lScore}/100 · Đọc: {item.rScore}/100 · Đúng: {item.accuracy}%
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <b className={cls} style={{ fontSize: 18 }}>
                      {item.score}/200
                    </b>
                    <div className={`small ${cls}`} style={{ fontWeight: 600 }}>
                      {badge}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
};
