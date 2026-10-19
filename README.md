# Hán Lộ — web học tiếng Trung HSK 1

Website/PWA hoàn chỉnh (HTML + CSS + JavaScript thuần, không build, không backend) để học **300 từ HSK 1 theo chuẩn HSK 3.0** dành cho người Việt: pinyin tô màu thanh điệu, âm Hán–Việt, nghĩa tiếng Việt, phát âm, ôn tập cách quãng, luyện viết bút thuận. Cài được lên màn hình chính và dùng offline.

## Chạy

**Cách 1 — mở trực tiếp:** nhấp đôi `index.html`. Chạy được ngay (tiến độ lưu trong trình duyệt), nhưng **không cài PWA/offline** vì `file://` không dùng được service worker.

**Cách 2 — chạy qua HTTP (khuyến nghị):**

```bat
serve.cmd
```

hoặc:

```bash
python -m http.server 8000
# mở http://localhost:8000
```

**Cài như app:** mở bằng Chrome/Edge trên điện thoại hoặc máy tính → menu trình duyệt → *Thêm vào màn hình chính* / *Cài đặt ứng dụng*.

## Có gì trong web

| Trang / khu vực | Nội dung |
|---|---|
| `index.html` | Ứng dụng học: màn hình chào (chọn mục tiêu + số từ/ngày), Học, Từ điển, Viết, Tiến độ, Cài đặt |
| `gioi-thieu.html` | Giới thiệu HSK 3.0 (bảng 9 cấp), mốc chuyển đổi 2026–2027, cách app dạy, nguồn tham khảo |
| `404.html` | Trang không tìm thấy |
| `manifest.webmanifest` + `sw.js` + `icons/` | PWA: cài lên màn hình chính, cache app, dùng offline 100% |
| `phonics-data.js` | Hệ thống ngữ âm: 23 thanh mẫu, 36 vận mẫu, 5 thanh điệu kèm Tone Curve Visualizer SVG |
| `grammar-data.js` | Ngữ pháp thực chiến & so sánh sắc thái (二/两, 会/能/可以, 的/得/地...) |
| `reader-data.js` | Bài đọc phân cấp HSK tương tác, bật/tắt pinyin, tra từ tức thì (Instant Click-Lookup) |
| `exam-data.js` | Đề thi thử HSK 1 chuẩn 40 câu (20 câu Nghe + 20 câu Đọc), đếm giờ & chấm điểm tự động |
| `audio-fx.js` | Web Audio Synthesizer: âm thanh phách gỗ, khánh ngọc, chuông thiền không cần file âm thanh ngoài |

Tính năng học & luyện tập:

- **500 từ vựng HSK 1 & HSK 2** (300 từ HSK 1 + 200 từ HSK 2) chuẩn đề cương HSK 3.0.
- **Bộ chuyển cấp độ linh hoạt**: Học riêng HSK 1, riêng HSK 2 hoặc gộp cả 2 cấp độ.
- **Ôn tập cách quãng (SM-2)**: Quên → 10 phút; nhớ → 1, 3, 6… ngày.
- **4 dạng câu hỏi tương tác**: Hán → nghĩa, nghĩa → Hán, Hán → pinyin, nghe → chọn chữ.
- **Pinyin tô màu 4 thanh điệu**, âm Hán–Việt in hoa làm cầu nối tư duy, phát âm TTS chuẩn bản địa.
- **Bảng Ngữ âm Pinyin Master**: Biểu đồ cao độ thanh điệu trực quan (Tone Curve Visualizer) giúp khắc phục lỗi thanh 1 và thanh 4.
- **Luyện đọc tương tác (HSK Reader)**: Ẩn/hiện pinyin, nhấp vào từ bất kỳ để mở popup tra cứu tức thì mà không cần chuyển trang.
- **Thi thử HSK 1 Mock Exam**: 40 câu / 35 phút (Nghe & Đọc), tự động tính điểm chuẩn thang 200 điểm (đỗ ≥ 120 điểm), lưu lịch sử thi.
- **Hiệu ứng âm thanh phương Đông**: Tự động tổng hợp âm phách gỗ, khánh ngọc, chuông thiền qua Web Audio API.
- **Luyện viết chữ Hán**: Xem bút thuận hoạt họa, tự viết lại từng nét (hanzi-writer).
- **Từ điển thông minh**: Tìm kiếm không dấu (`dien thoai` → 电话), lọc theo trạng thái (chưa học, đang học, đã thuộc).
- **Sao lưu & Khôi phục**: Xuất/nhập tiến độ ra file JSON 1-click để đồng bộ giữa các thiết bị.
- **Giao diện Imperial Jade**: Bento Grid, Dark/Light mode, linh vật rồng nhỏ thuần SVG ("Long-er") biểu cảm theo ngữ cảnh.

## Cấu trúc file

```
han-lo/
  index.html            ứng dụng chính (Bento Grid, 5 phân hệ học)
  gioi-thieu.html       trang giới thiệu HSK 3.0
  404.html              trang lỗi
  styles.css            toàn bộ giao diện (sáng/tối, bento grid, thi thử, modal)
  data.js               500 từ HSK 1 & HSK 2: [Hán, pinyin, Hán–Việt, nghĩa]
  phonics-data.js       dữ liệu ngữ âm, thanh mẫu, vận mẫu, tone curve SVG
  grammar-data.js       ngữ pháp và các cặp so sánh sắc thái
  reader-data.js        bài đọc phân cấp kèm token tra cứu
  exam-data.js          đề thi thử HSK 1 chuẩn 40 câu
  audio-fx.js           Web Audio Synthesizer (phách gỗ, khánh ngọc, chuông thiền)
  core.js               logic thuần: thanh điệu, lịch ôn SM-2, time utils
  app.js                controller toàn bộ giao diện, thi thử, đọc hiểu, sao lưu/khôi phục
  sw.js                 service worker (cache shell app, offline 100%)
  manifest.webmanifest  khai báo PWA
  icons/                icon PWA (192, 512, maskable, apple-touch)
  check.cjs             bộ 22 test tự động: dữ liệu, thi thử, audio-fx, PWA
  docs/                 đề án nâng cấp kiến trúc và tài liệu nghiên cứu
  serve.cmd             chạy server tĩnh nhanh
```

## Kiểm tra

```bash
node check.cjs
```

Chạy toàn bộ **22 bài kiểm tra tự động**:
1. 300 từ HSK 1 & 200 từ HSK 2 đúng 4 trường, không trùng lặp.
2. Pinyin hợp lệ âm tiết Latinh + dấu thanh chuẩn.
3. Toàn bộ file tham chiếu trong HTML, Manifest, Service Worker tồn tại.
4. Thuật toán SM-2, toneOf, colorizePinyin.
5. Đề thi thử HSK 1 đủ 40 câu (nghe + đọc) và logic chấm điểm chuẩn xác.
6. Cú pháp và dữ liệu của `audio-fx.js`, `phonics-data.js`, `grammar-data.js`, `reader-data.js`.

## Triển khai (deploy)

Đây là web tĩnh offline-first, đưa nguyên thư mục lên bất kỳ host tĩnh nào (HTTPS để service worker hoạt động):

- **GitHub Pages**: push thư mục, bật Pages cho nhánh `main`.
- **Netlify/Vercel/Cloudflare Pages**: kéo–thả thư mục, không cần build command.
- **Nginx/Apache**: trỏ document root vào thư mục này.

Sau khi sửa file tĩnh, tăng `VERSION` trong `sw.js` để tự động làm mới cache cho người dùng.

## Dữ liệu & giấy phép

- Danh sách từ: đề cương HSK 2026 (HSK 3.0) do Trung tâm Hợp tác Giao lưu Ngôn ngữ (汉考国际/CTI) công bố. 500 từ HSK 1 + HSK 2 khớp 100% danh sách chính thức.
- Pinyin, âm Hán–Việt, nghĩa tiếng Việt: biên soạn cho dự án. Tham chiếu Unihan (`kMandarin`, `kVietnamese`) và CC-CEDICT (CC BY-SA 3.0).
- Luyện viết: [hanzi-writer](https://github.com/chanind/hanzi-writer) (MIT) + dữ liệu nét chữ [Make Me a Hanzi](https://github.com/skishore/makemeahanzi) (Arphic Public License).
- Âm thanh: Sử dụng Web Audio API và Web Speech API có sẵn trên trình duyệt.
- Không sử dụng đề thi thật hay giáo trình có bản quyền.

## Định hướng nâng cấp tiếp theo (Giai đoạn tiếp theo)

- Bổ sung trọn bộ **HSK 3 (973 từ)** và ngân hàng đề thi thử HSK 2.
- Nâng cấp lưu trữ từ `localStorage` sang **IndexedDB API thuần** (`HanLoIndexedDB`) để chứa kho dữ liệu khổng lồ và nhật ký học tập chi tiết.
- Tích hợp **Web Speech Recognition** để luyện nói và chấm điểm phát âm tương tác.
- Luyện viết chữ Hán bằng **Virtual Canvas SVG** nội bộ độc lập không cần nạp thư viện ngoài.
