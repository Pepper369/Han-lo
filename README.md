# Hán Lộ — Nền Tảng Học Tiếng Trung HSK 1–3 (React + TypeScript + Vite)

Ứng dụng web hiện đại xây dựng bằng **React 19**, **TypeScript**, và **Vite** để học **800 từ vựng cốt lõi HSK 1–3 theo chuẩn HSK 3.0** dành cho người Việt: Pinyin tô màu thanh điệu, âm Hán–Việt làm cầu nối tư duy, phát âm AI, ôn tập cách quãng SM-2 Spaced Repetition, cẩm nang ngữ âm, bài đọc tương tác, luyện nói AI và luyện viết chữ Hán thư pháp.

---

## 🚀 Cách chạy ứng dụng

### Chế độ phát triển (Dev server)
```bash
npm run dev
```
Ứng dụng sẽ khởi chạy tại: `http://localhost:3000`

### Kiểm tra cú pháp (Lint)
```bash
npm run lint
```

### Build sản phẩm (Production)
```bash
npm run build
```

---

## 🏗️ Cấu trúc dự án mới (React SPA)

```
├── index.html                  # HTML entry point với meta tags và HanziWriter
├── vite.config.ts              # Cấu hình Vite dev server (host: 0.0.0.0, port: 3000)
├── tsconfig.json               # Cấu hình TypeScript nghiêm ngặt
├── package.json                # Dependencies: React 19, Lucide, Vite
├── styles.css                  # Toàn bộ CSS phong cách thiền họa / tuyên chỉ phương Đông
└── src/
    ├── main.tsx                # Entry point gắn kết React vào #root
    ├── App.tsx                 # Quản lý trạng thái trung tâm, tabs, modal điều hướng
    ├── types.ts                # Định nghĩa kiểu dữ liệu TypeScript
    ├── data/
    │   ├── words.ts            # 800 từ vựng chuẩn HSK 1 (300), HSK 2 (200), HSK 3 (300)
    │   ├── exams.ts            # Ngân hàng đề thi thử HSK 1 & HSK 2 (40–60 câu chuẩn CTI)
    │   ├── phonics.ts          # 23 thanh mẫu, 36 vận mẫu, 4 thanh điệu, 8 nét cơ bản
    │   ├── grammar.ts          # Cặp từ dễ nhầm (二/两, 会/能/可以, 的/得/地...) & cấu trúc câu
    │   └── readers.ts          # Bài đọc tương tác phân cấp với click tra từ 1-chạm
    ├── utils/
    │   ├── core.ts             # Thuật toán lặp lại cách quãng SM-2, toneOf, scoreExam
    │   ├── audioFx.ts          # Web Audio Synthesizer: phách gỗ, khánh ngọc, chuông thiền
    │   ├── tts.ts              # SpeechSynthesis tiếng Trung phổ thông (zh-CN)
    │   ├── speech.ts           # Web Speech API nhận diện giọng nói & chấm điểm phát âm
    │   └── storage.ts          # Quản lý localStorage, streak, thống kê, xuất/nhập file JSON
    └── components/
        ├── TopBar.tsx          # Thanh điều hướng trên cùng, chuyển cấp độ (0, 1, 2, 3, Tất cả)
        ├── TabBar.tsx          # Thanh điều hướng tab dưới đáy (Học, Thi thử, Từ điển, Viết, Tiến độ)
        ├── Toast.tsx           # Thông báo nhanh
        ├── views/
        │   ├── HomeView.tsx    # Trang chủ: kế hoạch học, linh vật, bento shortcuts, danh sách bài
        │   ├── ExamView.tsx    # Trang thi thử HSK: giới thiệu đề, lịch sử thi
        │   ├── DictView.tsx    # Từ điển tra cứu nhanh, lọc theo trạng thái
        │   ├── WriteView.tsx   # Luyện viết chữ Hán, bảng vẽ mực tàu, 8 quy tắc vàng
        │   ├── ProgressView.tsx# Thống kê tiến độ, biểu đồ 14 ngày, heatmap 52 tuần, ma trận trí nhớ
        │   ├── PhonicsView.tsx # Bảng ngữ âm Pinyin, biểu đồ cao độ thanh điệu, 8 nét cơ bản
        │   ├── GrammarView.tsx # So sánh sắc thái ngữ pháp & công thức câu
        │   ├── ReaderView.tsx  # Trình đọc tương tác tra từ tức thì
        │   └── SpeechView.tsx  # Luyện phát âm AI zh-CN với micro
        └── modals/
            ├── StudySessionModal.tsx # Phiên học thẻ ghi nhớ / trắc nghiệm phản xạ
            ├── ExamModal.tsx   # Phòng thi thử trực tuyến đếm ngược thời gian, chấm điểm
            ├── LookupModal.tsx # Popup tra từ nhanh
            ├── WriteModal.tsx  # Popup vẽ động bút thuận chữ Hán (HanziWriter)
            ├── SettingsModal.tsx # Cài đặt âm thanh, mục tiêu, sao lưu/khôi phục
            ├── WelcomeModal.tsx # Màn hình chào mừng onboarding
            └── IntroModal.tsx  # Giới thiệu chi tiết lộ trình HSK 3.0
```

---

## 🌟 Các tính năng cốt lõi

1. **800 từ vựng HSK 1, HSK 2 & HSK 3** (Chuẩn HSK 3.0): Đầy đủ chữ Hán, Pinyin có màu thanh điệu, âm Hán–Việt và nghĩa tiếng Việt.
2. **Thuật toán Spaced Repetition (SM-2)**: Lập lịch ôn tập tối ưu cho từng từ vựng dựa trên độ ghi nhớ của người học.
3. **Phòng thi thử chuẩn quốc tế**:
   - HSK 1: 40 câu trắc nghiệm (Nghe + Đọc), 35 phút.
   - HSK 2: 60 câu trắc nghiệm (Nghe + Đọc), 55 phút.
   - Chấm điểm tự động thang 200 điểm, phân tích chi tiết đáp án và lưu lịch sử thi.
4. **Bảng ngữ âm Pinyin & 8 nét chữ Hán**: Biểu đồ trực quan đường cong cao độ của 4 thanh điệu và 8 nét cơ bản (Vĩnh Tự Bát Pháp).
5. **AI Speech Recognition zh-CN**: Chấm điểm phát âm bằng Web Speech API trực tiếp trong trình duyệt, phản hồi % độ chính xác.
6. **Bảng thư pháp tự do (Virtual Stroke Canvas)**: Mô phỏng nét bút lông biến thiên độ dày theo tốc độ di chuyển, hỗ trợ lưới Mễ (米) và Điền (田).
7. **Trình đọc tương tác (HSK Reader)**: Đoạn văn ngắn phân cấp, bật/tắt pinyin, chạm vào từ bất kỳ để mở popup tra cứu tức thì.
8. **Âm thanh tổng hợp Web Audio API**: Tự động tạo âm thanh phách gỗ gõ nhịp, khánh ngọc ngũ cung ngân vang và chuông thiền thư thái.
9. **Bảo mật & Không cần tài khoản**: Lưu trữ 100% dữ liệu cục bộ, hỗ trợ xuất/nhập file backup JSON an toàn.
