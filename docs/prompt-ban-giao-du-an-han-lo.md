# Prompt bàn giao dự án "Hán Lộ"

> Khác với `prompt-tao-app-han-lo.md` (spec để **xây lại** app), prompt này để **bàn giao/tiếp tục**: gói toàn bộ nghiên cứu + kế hoạch + những gì đã build + trạng thái + việc tiếp theo, để agent khác tiếp nhận mà không làm lại từ đầu.

---

Bạn tiếp nhận dự án **"Hán Lộ"** — web app/PWA học 300 từ HSK 1 cho người Việt. Phần nền đã xong và đang chạy; **đừng làm lại từ đầu**. Dưới đây là toàn bộ bối cảnh, trạng thái và việc cần làm tiếp.

## 1. Tóm tắt dự án
- **Sản phẩm:** web tĩnh (HTML/CSS/JS thuần, không framework, không build, không backend) tại thư mục `han-lo/`.
- **Chạy:** `python -m http.server 8000` trong `han-lo/` rồi mở `http://localhost:8000`, hoặc nhấp đôi `index.html` (bản `file://` không cài được PWA).
- **Hiện trạng:** MVP hoàn chỉnh, 14/14 test pass (`node check.cjs`), PWA cài được và chạy offline, đã kiểm thử luồng chính bằng Chrome headless.
- **Tài liệu kèm theo:** `nghien-cuu-va-ke-hoach-app-hoc-tieng-trung.md` (nghiên cứu + kế hoạch), `han-lo/README.md` (cách chạy/cấu trúc/giới hạn), `prompt-tao-app-han-lo.md` (spec xây lại).

## 2. Nghiên cứu nền (đã xong — không cần tra lại)
- **Ngôn ngữ:** tiếng Phổ thông + chữ giản thể; pinyin + 4 thanh; ~3.000 chữ Hán để đọc. Người Việt có lợi thế **âm Hán–Việt** nhưng yếu thanh điệu, âm uốn lưỡi, viết tay.
- **HSK 2.0 (6 cấp):** từ 150 → 5.000+; viết từ HSK 3; nói thi riêng HSKK.
- **HSK 3.0 (3 cấp 9 bậc):** HSK 1 = 300 từ; HSK 4 = 2.000; 7–9 ≈ 11.000; **viết tay bắt buộc từ cấp 1**; cấp 3–6 có thi nói; 7–9 gộp nghe/đọc/viết/dịch/nói.
- **Mốc:** 13/12/2026 kỳ thi HSK 3.0 chính thức đầu tiên; 01/2027 thành chuẩn toàn cầu.
- **Thị trường Việt Nam:** 146.000 thí sinh HSK năm 2025 (số 1 thế giới, 18% toàn cầu); 13.000 việc làm cần tiếng Trung (gấp 2,4 lần tiếng Nhật, +95% so với 2023, lương cao hơn 10–40%); HSK 3+ được miễn thi ngoại ngữ tốt nghiệp THPT; 500+ trung tâm, 600+ trường.
- **Kết luận chiến lược:** thị trường exam-driven + job-driven → bán "lộ trình + kết quả", ưu tiên nội dung HSK 3.0 và tiếng Việt.

## 3. Kế hoạch đã chốt (trong file nghiên cứu)
- **Định vị:** HSK 3.0 first-mover + Việt hóa sâu + kết quả đo được.
- **MVP:** HSK 1–2, ôn tập cách quãng, viết tay, thi thử, onboarding 15 phút/ngày.
- **Roadmap 12 tháng:** beta 11/2026 → soft-launch trước 13/12/2026 → public 01/2027 → HSK 3–4 + B2B → HSK 5–9.
- **Giá:** Free giới hạn; Pro 79k/tháng, 499k/năm, 699k trọn đời early bird; B2B 40k/học viên/năm.
- **North-star:** số từ đạt "đã thuộc" (interval ≥ 21 ngày)/người dùng/tuần.

## 4. Đã build những gì
**File trong `han-lo/`:**
`index.html`, `gioi-thieu.html`, `404.html`, `styles.css`, `data.js` (300 từ), `core.js` (logic thuần), `app.js` (toàn bộ UI), `manifest.webmanifest`, `sw.js`, `icons/` (192/512/maskable/apple-touch), `favicon.svg`, `favicon-32.png`, `robots.txt`, `tools/make-icons.py`, `check.cjs` (14 test), `serve.cmd`, `README.md`, `screenshots/`.

**Tính năng:**
- Onboarding chọn mục tiêu (thi/đi làm/sở thích) + số từ/ngày (5/10/20).
- 300 từ HSK 1 **đúng danh sách chính thức 2025, đúng thứ tự**, 30 bài × 10 từ.
- Học từ mới → kiểm tra ngay → phản hồi → tổng kết.
- Ôn tập SM-2 (quên 10 phút; đúng 1 → 3 → ×ease; ease 1.3–3).
- 4 dạng câu hỏi: Hán→nghĩa, nghĩa→Hán, Hán→pinyin, nghe→chữ Hán.
- Pinyin tô màu thanh điệu, âm Hán–Việt, nghĩa tiếng Việt, TTS zh-CN.
- Từ điển tìm không dấu, lọc theo trạng thái, nghe từng từ.
- Luyện viết bút thuận + tự viết (hanzi-writer qua CDN, cache offline).
- Tiến độ: đã học/đã thuộc/đến hạn/chuỗi ngày, phân bố, biểu đồ 14 ngày, độ chính xác 7 ngày.
- Cài đặt: pinyin, âm thanh, mục tiêu, xóa tiến độ, xem lại onboarding.
- PWA: manifest, service worker (navigation network-first, tài nguyên stale-while-revalidate, CDN cache), icon maskable.
- Trang giới thiệu HSK 3.0 + bảng 9 cấp vừa 390px; trang 404; robots.txt.
- Dark mode, mobile-first, focus-visible, nút ≥ 44px.

**Quyết định kỹ thuật đáng nhớ:**
- Vanilla JS + `localStorage` key `"hanlo.v1"`; không backend, không tài khoản.
- `core.js` UMD để test bằng Node.
- SM-2 thay FSRS (đơn giản, đã kiểm chứng); nâng cấp khi cần.
- Viết chữ dùng hanzi-writer + dữ liệu nét từ CDN (cần mạng lần đầu).
- `VERSION` trong `sw.js` (hiện `hanlo-v1.0.2`) để xóa cache cũ.

**Đã kiểm chứng:**
- `node check.cjs`: 14 test pass (dữ liệu, thanh điệu, SM-2, stage, ngày, manifest/icon, file tham chiếu, SW shell).
- Chrome headless: onboarding → học → quiz → tổng kết → ôn tập → từ điển → viết → tiến độ → cài đặt, **không lỗi console**.
- Offline: tắt mạng rồi reload vẫn render từ cache.
- 390px: không tràn ngang.

## 5. Giới hạn đã biết
- Chỉ có **HSK 1**; chưa HSK 2–9.
- Chưa có **luyện nói/chấm phát âm**, **thi thử HSK**, **tài khoản đồng bộ**.
- Giọng đọc phụ thuộc gói zh-CN của hệ điều hành.
- Lần đầu dùng phần viết cần mạng; Safari/iOS chưa kiểm thử thật.
- Chưa minify/không có CI; deploy thủ công.

## 6. Việc tiếp theo (ưu tiên từ trên xuống)
1. **Thêm HSK 2** (200 từ) cùng định dạng `data.js`, cập nhật bộ chọn cấp + tiến độ + test.
2. **Thi thử HSK 1**: 40 câu/40 phút đúng cấu trúc (nghe + đọc), tự soạn đề, chấm điểm và báo cáo kỹ năng.
3. **Luyện nói**: ghi âm + nghe lại; sau đó chấm bằng Azure Pronunciation Assessment.
4. **Deploy** (GitHub Pages/Netlify), test cài PWA trên Android + iOS thật.
5. **Đo lường**: thêm PostHog (onboarding → bài đầu → D1/D7), sau đó tối ưu giữ chân.
6. **Tài khoản + sync** (Supabase) chỉ khi có người dùng thật cần đa thiết bị.

## 7. Ràng buộc khi tiếp tục
- Giữ **vanilla, không build**, mobile-first, toàn bộ tiếng Việt.
- Dữ liệu từ vựng phải khớp danh sách chính thức; không dùng đề thi thật.
- Mọi logic mới phải có test trong `check.cjs`; **không được làm fail 14 test hiện có**.
- Sửa file tĩnh thì **tăng `VERSION`** trong `sw.js`.
- Cập nhật `README.md` và `screenshots/` khi thêm tính năng.
- Trước khi sửa: chạy `node check.cjs`, mở app kiểm tra hiện trạng.

## 8. Cách nhận bàn giao (làm trước khi code)
1. `cd han-lo && node check.cjs` → phải 14 test pass.
2. `python -m http.server 8000` → mở `http://localhost:8000`.
3. Đọc theo thứ tự: `README.md` → `data.js` → `core.js` → `app.js` → `sw.js`.
4. Chạy thử 1 phiên học + 1 phiên ôn + mở 1 chữ ở tab Viết để hiểu luồng.

## 9. Định nghĩa "tiếp tục đúng"
- Không phá vỡ hành vi hiện có; test cũ vẫn pass và có test mới cho logic mới.
- Dữ liệu từ vựng đúng nguồn, đúng thứ tự; UI nhất quán với palette/font hiện tại.
- Mỗi thay đổi kèm kiểm chứng thực tế (chạy app, không chỉ đọc code).
- Báo cáo ngắn: đã làm gì, kiểm tra gì, còn giới hạn gì.
