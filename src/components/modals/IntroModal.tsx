import React from 'react';

interface IntroModalProps {
  onClose: () => void;
}

export const IntroModal: React.FC<IntroModalProps> = ({ onClose }) => {
  return (
    <div
      className="sheet"
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      style={{ zIndex: 110 }}
    >
      <div className="sheet-card" style={{ maxHeight: '88vh', overflowY: 'auto' }}>
        <div className="row-between">
          <div className="brand">
            <span className="brand-mark" aria-hidden="true">汉</span>
            <div className="brand-text">
              <h2 style={{ margin: 0, fontSize: 18 }}>Giới thiệu HSK 3.0</h2>
              <p style={{ margin: 0, fontSize: 12, color: 'var(--muted)' }}>Tiêu chuẩn mới 2026–2027</p>
            </div>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Đóng">
            ✕
          </button>
        </div>

        <div style={{ marginTop: 14 }}>
          <h3>Học tiếng Trung theo chuẩn HSK 3.0</h3>
          <p className="muted small" style={{ lineHeight: 1.5 }}>
            HSK đang chuyển đổi từ 6 cấp sang <b>9 cấp</b> (3 cấp 9 bậc), tăng mạnh lượng từ vựng thực chiến và bắt buộc kỹ năng viết chữ tay ngay từ cấp 1. Hán Lộ xây dựng đúng theo lộ trình mới nhất.
          </p>

          <div className="table-wrap" style={{ overflowX: 'auto', margin: '14px 0' }}>
            <table className="doc-table" style={{ width: '100%', fontSize: 13, borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--line)', background: 'var(--paper-2)' }}>
                  <th style={{ padding: '8px 10px' }}>Cấp</th>
                  <th style={{ padding: '8px 10px' }}>Từ vựng</th>
                  <th style={{ padding: '8px 10px' }}>Chữ mới</th>
                  <th style={{ padding: '8px 10px' }}>Viết tay</th>
                  <th style={{ padding: '8px 10px' }}>Ngữ pháp</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid var(--line)' }}>
                  <td style={{ padding: '8px 10px' }}><b>HSK 1</b></td>
                  <td style={{ padding: '8px 10px' }}>300</td>
                  <td style={{ padding: '8px 10px' }}>246</td>
                  <td style={{ padding: '8px 10px' }}>50</td>
                  <td style={{ padding: '8px 10px' }}>70</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--line)' }}>
                  <td style={{ padding: '8px 10px' }}><b>HSK 2</b></td>
                  <td style={{ padding: '8px 10px' }}>500</td>
                  <td style={{ padding: '8px 10px' }}>125</td>
                  <td style={{ padding: '8px 10px' }}>50</td>
                  <td style={{ padding: '8px 10px' }}>78</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--line)' }}>
                  <td style={{ padding: '8px 10px' }}><b>HSK 3</b></td>
                  <td style={{ padding: '8px 10px' }}>1.000</td>
                  <td style={{ padding: '8px 10px' }}>284</td>
                  <td style={{ padding: '8px 10px' }}>150</td>
                  <td style={{ padding: '8px 10px' }}>96</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--line)' }}>
                  <td style={{ padding: '8px 10px' }}><b>HSK 4</b></td>
                  <td style={{ padding: '8px 10px' }}>2.000</td>
                  <td style={{ padding: '8px 10px' }}>441</td>
                  <td style={{ padding: '8px 10px' }}>150</td>
                  <td style={{ padding: '8px 10px' }}>95</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--line)' }}>
                  <td style={{ padding: '8px 10px' }}><b>HSK 5</b></td>
                  <td style={{ padding: '8px 10px' }}>3.600</td>
                  <td style={{ padding: '8px 10px' }}>431</td>
                  <td style={{ padding: '8px 10px' }}>150</td>
                  <td style={{ padding: '8px 10px' }}>70</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--line)' }}>
                  <td style={{ padding: '8px 10px' }}><b>HSK 6</b></td>
                  <td style={{ padding: '8px 10px' }}>5.400</td>
                  <td style={{ padding: '8px 10px' }}>413</td>
                  <td style={{ padding: '8px 10px' }}>150</td>
                  <td style={{ padding: '8px 10px' }}>50</td>
                </tr>
                <tr>
                  <td style={{ padding: '8px 10px' }}><b>HSK 7–9</b></td>
                  <td style={{ padding: '8px 10px' }}>~11.000</td>
                  <td style={{ padding: '8px 10px' }}>1.148</td>
                  <td style={{ padding: '8px 10px' }}>500</td>
                  <td style={{ padding: '8px 10px' }}>134</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>4 Điểm Cải Tiến Trong Hán Lộ</h3>
          <ul className="doc-list muted small" style={{ lineHeight: 1.6, paddingLeft: 18 }}>
            <li><b>Lặp lại cách quãng SM-2:</b> Tính toán lịch ôn tập tự động chính xác theo chu kỳ quên tự nhiên của não bộ.</li>
            <li><b>Âm Hán–Việt độc quyền:</b> Tận dụng 70% từ vựng tiếng Việt có gốc Hán để nhớ từ vựng tiếng Trung nhanh gấp 3 lần.</li>
            <li><b>Web Speech AI zh-CN:</b> Luyện phát âm trực tiếp trên trình duyệt, nhận diện và chấm điểm tương tác.</li>
            <li><b>Bút thuận thư pháp &amp; Vĩnh Tự Bát Pháp:</b> Bảng vẽ thư pháp mực tàu kết hợp cẩm nang 8 nét và 8 quy tắc đi nét vàng.</li>
          </ul>

          <div style={{ marginTop: 20 }}>
            <button className="btn primary wide" onClick={onClose}>
              Đã hiểu &amp; Vào học ngay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
