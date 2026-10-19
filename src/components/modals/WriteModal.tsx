import React, { useEffect, useRef, useState } from 'react';

declare const HanziWriter: any;

interface WriteModalProps {
  char: string;
  onClose: () => void;
}

export const WriteModal: React.FC<WriteModalProps> = ({ char, onClose }) => {
  const writerContainerRef = useRef<HTMLDivElement | null>(null);
  const writerInstanceRef = useRef<any>(null);
  const [note, setNote] = useState<string>('');
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    function initWriter() {
      if (!writerContainerRef.current) return;
      writerContainerRef.current.innerHTML = '';

      if (typeof HanziWriter === 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/hanzi-writer@3/dist/hanzi-writer.min.js';
        script.onload = () => {
          if (!isMounted) return;
          setIsLoaded(true);
          createWriterInstance();
        };
        script.onerror = () => {
          if (!isMounted) return;
          setNote('Không tải được thư viện nét chữ online. Bạn có thể dùng bảng vẽ offline ở tab Viết.');
        };
        document.head.appendChild(script);
      } else {
        setIsLoaded(true);
        createWriterInstance();
      }
    }

    function createWriterInstance() {
      if (!writerContainerRef.current || typeof HanziWriter === 'undefined') return;
      try {
        writerContainerRef.current.innerHTML = '';
        const writer = HanziWriter.create(writerContainerRef.current, char, {
          width: 260,
          height: 260,
          padding: 8,
          showCharacter: false,
          showOutline: true,
          strokeColor: '#211f1b',
          outlineColor: '#e6ddcd',
          highlightColor: '#b23a2f',
          strokeAnimationSpeed: 1.1,
          delayBetweenStrokes: 130
        });
        writerInstanceRef.current = writer;
        writer.animateCharacter();
      } catch (err) {
        setNote('Đang tải dữ liệu nét chữ…');
      }
    }

    initWriter();

    return () => {
      isMounted = false;
      writerInstanceRef.current = null;
    };
  }, [char]);

  function handleAnimate() {
    if (writerInstanceRef.current) {
      setNote('');
      writerInstanceRef.current.animateCharacter();
    }
  }

  function handleQuiz() {
    if (!writerInstanceRef.current) return;
    setNote('Viết lại theo đúng thứ tự nét bút thuận.');
    writerInstanceRef.current.quiz({
      onComplete: function (res: { totalMistakes: number }) {
        setNote(
          res.totalMistakes === 0
            ? 'Hoàn hảo, không sai nét nào! 太棒了!'
            : `Hoàn thành! Số nét sai: ${res.totalMistakes}. Hãy thử lại nhé.`
        );
      }
    });
  }

  return (
    <div
      id="writeSheet"
      className="sheet center-sheet"
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="sheet-card write-card">
        <div className="row-between">
          <h2 id="write-title" style={{ fontFamily: 'var(--serif)', fontSize: 32 }}>
            {char}
          </h2>
          <button className="icon-btn" onClick={onClose} aria-label="Đóng">
            ✕
          </button>
        </div>

        <div className="writer-wrap" style={{ display: 'flex', justifyContent: 'center', margin: '14px 0' }}>
          <div ref={writerContainerRef} id="writer"></div>
        </div>

        <div className="write-actions">
          <button className="btn ghost" onClick={handleAnimate}>
            Xem bút thuận
          </button>
          <button className="btn primary" onClick={handleQuiz}>
            Luyện viết
          </button>
        </div>

        {note && <p className="muted small center" id="write-note" style={{ marginTop: 10 }}>{note}</p>}
      </div>
    </div>
  );
};
