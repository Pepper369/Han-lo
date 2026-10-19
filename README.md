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
| `manifest.webmanifest` + `sw.js` + `icons/` | PWA: cài lên màn hình chính, cache app, dùng offline |

Tính năng học:

- **300 từ HSK 1** đúng danh sách chính thức đề cương 2025, giữ nguyên thứ tự, chia 30 bài × 10 từ.
- **Ôn tập cách quãng (SM-2)**: quên → 10 phút; nhớ → 1, 3, 6… ngày.
- **4 dạng câu hỏi**: Hán → nghĩa, nghĩa → Hán, Hán → pinyin, nghe → chọn chữ.
- **Pinyin tô màu 4 thanh**, âm Hán–Việt, nghĩa tiếng Việt, phát âm bằng giọng zh-CN của máy.
- **Luyện viết**: xem bút thuận, tự viết lại từng nét (hanzi-writer).
- **Từ điển**: tìm không dấu (`dien thoai` → 电话), lọc theo trạng thái học.
- **Tiến độ**: đã học / đã thuộc / đến hạn, chuỗi ngày, độ chính xác 7 ngày, biểu đồ 14 ngày.
- **Cài đặt**: ẩn/hiện pinyin, tắt âm thanh, mục tiêu 5–20 từ/ngày, xóa tiến độ.
- Giao diện sáng/tối, mobile-first, dùng được bàn phím và trình đọc màn hình cơ bản.

## Cấu trúc file

```
han-lo/
  index.html            ứng dụng chính
  gioi-thieu.html       trang giới thiệu HSK 3.0
  404.html              trang lỗi
  styles.css            toàn bộ giao diện (sáng/tối)
  data.js               300 từ HSK 1: [Hán, pinyin, Hán–Việt, nghĩa]
  core.js               logic thuần: thanh điệu + lịch ôn SM-2
  app.js                giao diện, phiên học, từ điển, tiến độ, tập viết, onboarding
  sw.js                 service worker (cache app, offline)
  manifest.webmanifest  khai báo PWA
  icons/                icon PWA (192, 512, maskable, apple-touch)
  favicon.svg
  favicon-32.png
  robots.txt
  check.cjs             14 test: dữ liệu, thanh điệu, lịch ôn, file/PWA
  tools/make-icons.py   sinh lại bộ icon từ chữ 汉 (cần Pillow)
  screenshots/          ảnh chụp màn hình
  serve.cmd             chạy server tĩnh nhanh
```

## Kiểm tra

```bash
node check.cjs
```

Kiểm tra: 300 từ đúng 4 trường và không trùng; pinyin/dấu thanh hợp lệ; lịch ôn SM-2 (1 → 3 → ×ease, quên 10 phút, ease ≥ 1.3); stage; ngày; **mọi file HTML tham chiếu đều tồn tại**; manifest hợp lệ và icon đủ; service worker chỉ cache file có thật.

## Triển khai (deploy)

Đây là web tĩnh, đưa nguyên thư mục lên bất kỳ host tĩnh nào (HTTPS để service worker hoạt động):

- **GitHub Pages**: push thư mục, bật Pages cho nhánh.
- **Netlify/Vercel/Cloudflare Pages**: kéo–thả thư mục, không cần build command.
- **Bất kỳ nginx/Apache**: trỏ document root vào thư mục này.

Sau khi sửa file tĩnh, tăng `VERSION` trong `sw.js` để buộc cập nhật cache (nếu không, bản cũ có thể được phục vụ từ cache).

## Dữ liệu & giấy phép

- Danh sách từ: đề cương HSK 2026 (HSK 3.0) do Trung tâm Hợp tác Giao lưu Ngôn ngữ (汉考国际/CTI) công bố; bản OCR tham khảo [krmanik/HSK-3.0](https://github.com/krmanik/HSK-3.0). 300 từ khớp 100% danh sách chính thức.
- Pinyin, âm Hán–Việt, nghĩa tiếng Việt: biên soạn cho dự án. Tham chiếu Unihan (`kMandarin`, `kVietnamese`) và CC-CEDICT (CC BY-SA 3.0).
- Luyện viết: [hanzi-writer](https://github.com/chanind/hanzi-writer) (MIT) + dữ liệu nét chữ [Make Me a Hanzi](https://github.com/skishore/makemeahanzi) (Arphic Public License), tải từ CDN jsDelivr.
- Không sử dụng đề thi thật hay giáo trình có bản quyền.

## Giới hạn hiện tại

- Mới có **HSK 1**; HSK 2–9 thêm bằng cách bổ sung dữ liệu cùng định dạng vào `data.js`.
- Chưa có **luyện nói/chấm phát âm**, **thi thử HSK** đúng cấu trúc đề, **tài khoản đồng bộ** nhiều thiết bị (tiến độ nằm trong `localStorage`).
- Lịch ôn dùng **SM-2**, nâng lên FSRS khi cần tối ưu tỉ lệ nhớ theo từng người.
- Giọng đọc phụ thuộc gói giọng zh-CN của hệ điều hành; phần tập viết và lần đầu tải thư viện cần mạng (sau đó được cache).
- Tiến độ chỉ nằm trên đúng trình duyệt/thiết bị đã học; xóa dữ liệu trình duyệt là mất tiến độ.
