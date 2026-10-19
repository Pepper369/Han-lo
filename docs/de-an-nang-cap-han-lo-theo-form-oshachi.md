# Đề Án Nghiên Cứu & Nâng Cấp Dự Án "Hán Lộ" Theo Chuẩn Mực Kiến Trúc O-Shachi

**Tài liệu tham chiếu:** Kiến trúc O-Shachi (Oshachi) tại `D:\Antigravity IDE\01_EdTech_Languages\Oshachi`  
**Mục tiêu:** Chuyển hóa và nâng tầm Hán Lộ từ một web app tĩnh cơ bản (Vanilla HTML/JS, 300 từ HSK 1, localStorage) thành một **Nền tảng EdTech học tiếng Trung HSK 3.0 Toàn Diện (Client-side, Offline-First, IndexedDB, Zero-Backend)** đẳng cấp cao.

---

## I. Tổng Kết & Đúc Rút Tinh Hoa Từ Dự Án O-Shachi

Sau khi phân tích toàn bộ mã nguồn của O-Shachi (`Oshachi`), các trụ cột kỹ thuật và sản phẩm cốt lõi tạo nên sự vượt trội bao gồm:

### 1. Kiến Trúc Kỹ Thuật (Tech Stack & Architecture)
- **Core Framework:** React 19 + TypeScript + Vite 7 + `vite-plugin-singlefile`.
- **Styling & UI:** Tailwind CSS v4, Lucide React, giao diện Bento Grid, Dark Mode Cyber-Ocean cao cấp.
- **Client-Side Persistence:** Sử dụng **IndexedDB thuần** (`OrcaIndexedDB`) với 8 Object Stores (cards, user_stats, bookmarked_items, custom_tags, user_history, study_streaks, kanji, grammar), phá bỏ hoàn toàn giới hạn 5MB của `localStorage`.
- **Hệ Thống Âm Thanh Đa Tầng:**
  - **Web Speech API** cho phát âm ngữ âm bản địa.
  - **Web Audio API Synthesizer** tự động tổng hợp sóng âm (Oscillator) tạo SFX tương tác (Click, Correct, Error, Streak, Level-up) mà không cần tải file âm thanh nặng.
- **Linh Vật Nhận Diện Thương Hiệu Thuần SVG (Contextual Mascot):** Linh vật tự đổi biểu cảm sinh động theo ngữ cảnh học tập (Chào hỏi, Học chữ, Đọc sâu, Ăn mừng streak).
- **Tiện Ích Cao Cấp:** Command Palette (Ctrl+K), Backup/Restore JSON 1-click, PWA Install Banner, Study Heatmap (Github-style).

### 2. Mô Hình 5 Phân Hệ Học Tập Hoàn Chỉnh
- **Phân hệ 1 (Nền tảng ngữ âm):** Bảng chữ cái, Stroke order, Mẹo liên tưởng hình ảnh (Mnemonics), Speed Game phản xạ.
- **Phân hệ 2 (Hán tự & Từ vựng chuyên sâu):** Phân rã bộ thủ, số nét, âm Hán–Việt viết hoa làm cầu nối tư duy, quy tắc chuyển âm, từ ghép (Jukugo) và Bảng vẽ nét ảo (Virtual Canvas).
- **Phân hệ 3 (Ngữ pháp thực chiến):** Cấu trúc câu trực quan tô màu thành phần câu, biến đổi động từ, công cụ so sánh sắc thái (Nuance Comparator).
- **Phân hệ 4 (Đọc hiểu tương tác - Dokkai Reader):** Bật/tắt Furigana, **Instant Click-Lookup** (nhấp từ vựng bung popup tra cứu tại chỗ không chuyển trang).
- **Phân hệ 5 (Cỗ máy SRS & Dự báo):** Thuật toán SM-2, Memory Matrix, Dự báo ngày sẵn sàng thi (Readiness Card).

---

## II. Bảng So Sánh Hiện Trạng "Hán Lộ" vs Chuẩn Nâng Cấp "Oshachi"

| Tiêu chí | Hán Lộ (Hiện tại - v1.0) | Hán Lộ Nâng Cấp (Form O-Shachi) |
|---|---|---|
| **Công nghệ** | Vanilla HTML/CSS/JS thuần, không build tool | React 19 + TypeScript + Vite 7 + Tailwind CSS v4 |
| **Phạm vi nội dung** | 300 từ HSK 1 | HSK 1 (300 từ) ➔ HSK 2 (200 từ) ➔ HSK 3 (973 từ), bộ thủ, ngữ pháp |
| **Lưu trữ dữ liệu** | `localStorage` ("hanlo.v1", < 5MB) | **IndexedDB API thuần** (`HanLoIndexedDB`), hỗ trợ hàng vạn từ vựng và lịch sử chi tiết |
| **Âm thanh** | TTS cơ bản | TTS giọng zh-CN + **Web Audio API Synthesizer** (hiệu ứng chiêng đồng, khánh đá, chuông thiền) |
| **Luyện viết** | Hanzi-writer tải nét từ jsDelivr (cần mạng lần đầu) | **Virtual Canvas SVG** nội bộ kết hợp thuật toán kiểm tra hướng nét & nhận dạng nét |
| **Luyện đọc** | Chưa có | **Interactive HSK Reader**: Đọc văn bản tiếng Trung, ẩn/hiện Pinyin, Instant Click-Lookup tra từ |
| **Ngữ pháp** | Chưa có | **Sentence Builder** (Kéo thả cấu trúc câu tiếng Trung) + **Nuance Comparator** (So sánh từ đồng nghĩa/dễ nhầm) |
| **Thi thử** | Chưa có | **HSK Mock Exam Engine**: Đúng cấu trúc chuẩn 40 câu / 40 phút, đếm giờ, chấm điểm tự động |
| **Design System** | Giao diện cơ bản | **Imperial Jade & Vermilion Theme**, Bento Grid, Mascot Rồng nhỏ thuần SVG ("Long-er") |

---

## III. Kiến Trúc Chi Tiết Nâng Cấp Dự Án "Hán Lộ"

### 1. Phân Hệ 1: Bảng Ngữ Âm Pinyin & Thanh Điệu (Phonics Master)
- **Thanh mẫu & Vận mẫu:** 23 thanh mẫu (b, p, m, f, d, t, n, l, g, k, h, j, q, x, zh, ch, sh, r, z, c, s, y, w) và 36 vận mẫu (đơn, kép, mũi).
- **Tone Curve Visualizer:** Mô phỏng trực quan biểu đồ cao độ 5 mức của 4 thanh điệu (Thanh 1: 55, Thanh 2: 35, Thanh 3: 214, Thanh 4: 51) giúp người Việt khắc phục triệt để lỗi phát âm thanh 4 và thanh 1.
- **Pinyin Speed Game:** Trò chơi nghe âm chọn thanh điệu và gõ Pinyin phản xạ nhanh tính điểm.

### 2. Phân Hệ 2: Thư Viện Chữ Hán, Bộ Thủ & Quy Tắc Hán–Việt (Hanzi Explorer)
- **214 Bộ Thủ Thần Thánh:** Chú thích ý nghĩa, thơ nhớ chữ Hán, mẹo liên tưởng hình ảnh (Mnemonics).
- **Tận dụng tối đa Lợi thế Hán–Việt:**
  - Quy tắc chuyển đổi thanh điệu tương đồng giữa tiếng Việt và tiếng Trung.
  - Phân tích từ ghép thực chiến (Ví dụ: 机场 = Cơ trường = Sân bay; 电脑 = Điện não = Máy tính; 医生 = Y sinh = Bác sĩ).
- **Virtual Stroke Canvas:** Bảng luyện viết nét chữ với lưới Mễ (米) và lưới Điền (田), hướng dẫn quy tắc bút thuận:
  - *Ngang trước sổ sau, Phẩy trước mác sau, Trên trước dưới sau, Ngoài trước trong sau, Vào trước đóng sau*.

### 3. Phân Hệ 3: Ngữ Pháp Thực Chiến & So Sánh Sắc Thái (Grammar & Nuance)
- **Sentence Builder:** Kéo thả ghép câu tiếng Trung theo đúng trật tự:  
  `[Chủ ngữ] + [Thời gian] + [Địa điểm] + [Phó từ/Phương thức] + [Động từ] + [Tân ngữ]`
- **Nuance Comparator tiếng Trung:**
  - `二 (èr)` vs `两 (liǎng)` (Số đếm vs Số lượng).
  - `会 (huì)` vs `能 (néng)` vs `可以 (kěyǐ)` (Biết do học vs Khả năng bẩm sinh/điều kiện vs Cho phép).
  - `一点儿 (yīdiǎnr)` vs `有点儿 (yǒudiǎnr)` (Bổ ngữ vs Phó từ tiêu cực).
  - `的 (de)` vs `得 (de)` vs `地 (de)` (Định ngữ vs Bổ ngữ vs Trạng ngữ).

### 4. Phân Hệ 4: Trình Luyện Đọc Tương Tác (HSK Interactive Reader)
- Tuyển tập 30+ bài đọc ngắn chuẩn chủ đề HSK 1, HSK 2, HSK 3 (Gia đình, Mua sắm, Du lịch, Công sở, Ẩm thực).
- **Chế độ đọc linh hoạt:** Bật/tắt Pinyin toàn bài, tô màu thanh điệu theo chuẩn quốc tế.
- **Instant Click-Lookup:** Nhấp vào bất kỳ từ nào để hiển thị modal tra cứu:
  - Chữ Hán, Pinyin, Âm Hán-Việt, Nghĩa tiếng Việt, Ví dụ minh họa và nút nghe phát âm.

### 5. Phân Hệ 5: Cỗ Máy SRS & Thi Thử HSK (Exam & Spaced Repetition)
- **Thuật toán SuperMemo-2** tối ưu hóa trên IndexedDB (`cards`, `reviews`, `heatmaps`).
- **HSK Readiness Prediction:** Phân tích độ thuần thục từ vựng & ngữ pháp để đưa ra tỷ lệ đỗ kỳ thi HSK 3.0.
- **HSK Mock Test Engine:**
  - Đề thi thử HSK 1 chuẩn: 40 câu / 40 phút (20 câu Nghe + 20 câu Đọc).
  - Đề thi thử HSK 2 chuẩn: 60 câu / 55 phút (35 câu Nghe + 25 câu Đọc).
  - Hệ thống chấm điểm tự động, phân tích kỹ năng yếu và đề xuất kế hoạch ôn tập.

---

## IV. Lộ Trình Triển Khai Thực Tế

1. **Giai đoạn 1 (Ngay lập tức):** Bổ sung dữ liệu HSK 2 (200 từ) vào cơ sở dữ liệu hiện có để nâng tổng vốn từ lên 500 từ; cập nhật bộ chọn cấp độ và mở rộng bộ test `check.cjs`.
2. **Giai đoạn 2:** Khởi tạo kiến trúc nâng cấp `han-lo-pro` (React 19 + TypeScript + Vite + Tailwind v4 + IndexedDB) song song để bảo toàn 100% phiên bản chạy hiện tại.
3. **Giai đoạn 3:** Di chuyển logic SM-2 và dữ liệu từ vựng sang IndexedDB, tích hợp Web Audio Synthesizer SFX và hệ thống linh vật Rồng nhỏ SVG ("Long-er").
4. **Giai đoạn 4:** Xây dựng module Thi thử HSK 1/2 và Trình đọc tương tác Instant Click-Lookup.
