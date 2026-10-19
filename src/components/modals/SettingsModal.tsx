import React, { useRef } from 'react';
import { Settings } from '../../types';

interface SettingsModalProps {
  settings: Settings;
  onUpdateSettings: (newSettings: Partial<Settings>) => void;
  onExportBackup: () => void;
  onImportBackupFile: (file: File) => void;
  onResetProgress: () => void;
  onOpenIntro: () => void;
  onOpenWelcome: () => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onUpdateSettings,
  onExportBackup,
  onImportBackupFile,
  onResetProgress,
  onOpenIntro,
  onOpenWelcome,
  onClose
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div
      id="settings"
      className="sheet"
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="sheet-card">
        <div className="row-between">
          <h2 id="set-title">Cài đặt</h2>
          <button className="icon-btn" onClick={onClose} aria-label="Đóng cài đặt">
            ✕
          </button>
        </div>

        <label className="set-row">
          <span>Hiện pinyin khi học</span>
          <input
            type="checkbox"
            checked={settings.pinyin}
            onChange={(e) => onUpdateSettings({ pinyin: e.target.checked })}
          />
        </label>

        <label className="set-row">
          <span>Âm thanh (giọng đọc máy)</span>
          <input
            type="checkbox"
            checked={settings.audio}
            onChange={(e) => onUpdateSettings({ audio: e.target.checked })}
          />
        </label>

        <label className="set-row">
          <span>Hiệu ứng âm thanh (khánh ngọc)</span>
          <input
            type="checkbox"
            checked={settings.sfx}
            onChange={(e) => onUpdateSettings({ sfx: e.target.checked })}
          />
        </label>

        <label className="set-row">
          <span>Mục tiêu từ mới / ngày</span>
          <select
            value={settings.goal}
            onChange={(e) => onUpdateSettings({ goal: Number(e.target.value) })}
          >
            <option value="5">5 từ</option>
            <option value="10">10 từ</option>
            <option value="15">15 từ</option>
            <option value="20">20 từ</option>
          </select>
        </label>

        <div style={{ display: 'flex', gap: 8, margin: '14px 0' }}>
          <button
            className="btn ghost small"
            onClick={onExportBackup}
            style={{ flex: 1 }}
          >
            💾 Sao lưu
          </button>
          <button
            className="btn ghost small"
            onClick={() => fileInputRef.current?.click()}
            style={{ flex: 1 }}
          >
            📂 Khôi phục
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            style={{ display: 'none' }}
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                onImportBackupFile(e.target.files[0]);
              }
            }}
          />
        </div>

        <button className="btn ghost danger wide" onClick={onResetProgress}>
          Xóa toàn bộ tiến độ
        </button>

        <div className="set-links" style={{ marginTop: 14 }}>
          <button
            className="link-btn"
            onClick={() => {
              onClose();
              onOpenIntro();
            }}
          >
            Giới thiệu HSK 3.0 &amp; cách học
          </button>
          <button
            className="link-btn"
            onClick={() => {
              onClose();
              onOpenWelcome();
            }}
          >
            Xem lại màn hình chào
          </button>
        </div>

        <p className="muted small" style={{ marginTop: 14 }}>
          Dữ liệu HSK 1, HSK 2 &amp; HSK 3 (HSK 3.0) — 800 từ vựng cốt lõi, pinyin, âm Hán–Việt, nghĩa tiếng Việt.
          Tiến độ lưu an toàn trên máy này. Hỗ trợ đầy đủ âm thanh khánh ngọc phương Đông và hoạt động offline 100%.
        </p>
      </div>
    </div>
  );
};
