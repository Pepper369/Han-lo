# Prompt: xây web app "Hán Lộ" — học HSK 1 cho người Việt

> Dán toàn bộ đoạn dưới vào một AI agent (hoặc dùng làm spec cho dev). Prompt đã gói đủ nghiên cứu + yêu cầu sản phẩm + tiêu chí kiểm thử để tái tạo đúng app trong `han-lo/`.

---

Bạn là kỹ sư full-stack kiêm giáo viên tiếng Trung. Hãy xây **"Hán Lộ"** — một web app/PWA hoàn chỉnh giúp người Việt học **300 từ HSK 1 theo chuẩn HSK 3.0**.

## 0. Ràng buộc cốt lõi
- Web tĩnh: HTML + CSS + JavaScript thuần. Không framework, không bundler, không backend, không tài khoản, không thanh toán.
- Chạy được khi mở trực tiếp `file://` **và** khi phục vụ qua HTTP. Tiến độ lưu `localStorage`, không gửi đi đâu.
- Mobile-first (390×844), có dark mode, toàn bộ giao diện tiếng Việt.
- PWA: cài lên màn hình chính, dùng offline sau lần mở đầu tiên.

## 1. Dữ liệu (bắt buộc chính xác)
- Nguồn: danh sách HSK 1 của đề cương HSK 2026 (HSK 3.0), bản raw:
  `https://raw.githubusercontent.com/krmanik/HSK-3.0/master/New%20HSK%20(2025)/HSK%20Words/HSK_Level_1_words.txt`
- Chuẩn hóa các mục có hậu tố: 本1→本, 点1→点, 和1→和, 会1→会, 两1→两, 喂1→喂, 没（有）→没有, 有（一）点儿→有点儿.
- Giữ nguyên **thứ tự chính thức**, đủ **300 từ**, chia **10 từ/bài = 30 bài**.
- Mỗi từ 4 trường: `[chữ Hán, pinyin tách từng âm tiết có dấu thanh (vd "bú kè qi"), âm Hán–Việt, nghĩa tiếng Việt ngắn]`.
- Tự kiểm tra: 300 dòng, không trùng, **đúng tập hợp và đúng thứ tự** so với file nguồn.
- Không dùng đề thi thật, không sao chép từ điển có bản quyền.

## 2. Màn hình & luồng
1. **Màn hình chào (lần đầu)**: giới thiệu 1 câu, chọn mục tiêu (Thi HSK / Đi làm / Sở thích) và số từ/ngày (5/10/20), nút "Bắt đầu học"; lưu `onboarded`.
2. **Học (home)**: lời chào theo giờ, "Đến hạn ôn N từ", "Từ mới hôm nay x/goal", nút Ôn tập / Học từ mới, thanh tiến độ 300 từ, chú giải đã thuộc/đang học/chưa học, lưới 30 bài (bài đã học đổi màu), link "Tìm hiểu thêm".
3. **Phiên học (overlay)**: thẻ từ mới (Hán lớn, pinyin tô màu, Hán–Việt, nghĩa, nút nghe) → "Đã hiểu → Kiểm tra" → trắc nghiệm 4 đáp án → phản hồi đúng/sai kèm đáp án + audio → Tiếp tục. Kết thúc: tổng kết (đúng/tổng, % chính xác, chuỗi ngày).
4. **Ôn tập**: các từ đến hạn, mỗi câu hỏi ngẫu nhiên 1 trong 4 dạng:
   Hán → nghĩa · Nghĩa → chọn chữ Hán · Hán → pinyin · Nghe (TTS) → chọn chữ Hán.
5. **Từ điển**: 300 từ; tìm **không dấu** (NFD + đ→d); lọc Tất cả/Chưa học/Đang học/Đã thuộc; mỗi dòng có Hán, pinyin, Hán–Việt, nghĩa, nút nghe, vạch màu trạng thái.
6. **Viết**: lưới chữ Hán rút từ các từ (lọc "Chữ đã gặp"/"Tất cả"); bấm chữ mở hộp thoại xem bút thuận + "Luyện viết" (hanzi-writer tải CDN lazy, báo rõ khi không có mạng).
7. **Tiến độ**: 4 số (đã học/đã thuộc/đến hạn/chuỗi ngày), thanh phân bố 4 trạng thái, biểu đồ 14 ngày, độ chính xác 7 ngày.
8. **Cài đặt**: ẩn/hiện pinyin, bật/tắt âm thanh, mục tiêu 5–20 từ/ngày, xóa tiến độ (có xác nhận), link giới thiệu, xem lại màn hình chào.

## 3. Thuật toán & nội dung
- **Ôn tập SM-2**: đúng → 1 ngày, 3 ngày, sau đó `interval × ease`; sai → học lại sau 10 phút, `lapses+1`, `ease−0.2`; ease kẹp `[1.3, 3]`; lần học đầu đúng = 1 ngày.
- **Pinyin**: tách âm tiết, nhận thanh từ dấu (ā á ǎ à …), tô màu: thanh 1 `#c0392b`, thanh 2 `#b97a12`, thanh 3 `#2f6f5e`, thanh 4 `#2b5fa8`, thanh nhẹ `#8b857c`.
- **Phát âm**: `SpeechSynthesis`, `lang="zh-CN"`, ưu tiên voice `zh-*`, rate ~0.82.
- **Đáp án nhiễu**: 3 từ khác, loại trùng giá trị đúng, trộn vị trí.
- "Đã thuộc" = `interval ≥ 21` ngày.

## 4. Giao diện
- Palette: giấy `#f6f2ea`, card `#fffdf9`, mực `#211f1b`, đỏ `#b23a2f`, lục `#2f6f5e`, lam `#2b5fa8`, viền `#e6ddcd`; dark mode đảo tương ứng.
- Font: `system-ui` cho UI; serif CJK (`"Noto Serif SC","Songti SC","SimSun"`) cho chữ Hán; chữ Hán lớn ~19vw.
- Bottom nav 4 tab (Học, Từ điển, Viết, Tiến độ), icon SVG nét 2px; header dính trên có logo 汉, chuỗi ngày 🔥, nút cài đặt.
- Bo góc 20px, viền mảnh, bóng nhẹ, nút cao ≥ 44px, `:focus-visible` rõ ràng.

## 5. Kỹ thuật & PWA
- File: `index.html`, `gioi-thieu.html`, `404.html`, `styles.css`, `data.js`, `core.js` (logic thuần), `app.js`, `manifest.webmanifest`, `sw.js`, `icons/`, `favicon.svg`, `favicon-32.png`, `robots.txt`, `tools/make-icons.py`, `check.cjs`, `serve.cmd`, `README.md`, `screenshots/`.
- `core.js`: UMD, export `toneOf/syllables/dayKey/prevDayKey/newCard/grade/stage/isDue` để Node test được.
- `localStorage` key `"hanlo.v1"`:
  `{ cards:{id:{reps,lapses,ease,interval,due,seen}}, settings:{pinyin,audio,goal,onboarded,goalType}, streak:{count,last}, history:{"YYYY-MM-DD":{n,c}}, daily:{date,new} }`.
- Service worker: cache shell 14 file; **navigation network-first** (offline fallback `index.html`); tài nguyên cùng origin **stale-while-revalidate**; CDN (hanzi-writer + dữ liệu nét) stale-while-revalidate; có `VERSION` để xóa cache cũ. Chỉ đăng ký SW khi protocol là http(s).
- Manifest: `start_url ./index.html`, `display standalone`, icon 192/512 + maskable, theme/background `#f6f2ea`.
- Icon: nền `#211f1b`, chữ 汉 màu `#f6f2ea`, bản maskable chừa safe zone (sinh bằng Python/Pillow).

## 6. Trang giới thiệu
- `gioi-thieu.html` dùng chung `styles.css`, có bảng 9 cấp: từ vựng cộng dồn 300/500/1.000/2.000/3.600/5.400/11.000; chữ mới 246/125/284/441/431/413/1.148; viết tay 50/50/150/150/150/150/500; ngữ pháp 70/78/96/95/70/50/134.
- Nêu mốc **13/12/2026** (thi HSK 3.0 đầu tiên) và **01/2027** (3.0 thành chuẩn), cách app dạy, nguồn tham khảo, nút quay lại học.
- Bảng phải **vừa 390px**, không cần cuộn ngang.

## 7. Kiểm thử (bắt buộc)
- `node check.cjs` ≥ **14 test pass**: dữ liệu 300 từ; pinyin/thanh hợp lệ; manifest + icon + start_url tồn tại; mọi `href/src` nội bộ trong 3 file HTML tồn tại; `SHELL` của SW chỉ chứa file có thật; SM-2 (1→3→×ease, sai→10 phút, ease ≥ 1.3); stage; dayKey.
- Chạy **Chrome headless qua CDP**: onboarding → học 1 từ (đúng và sai) → ôn tập 4 dạng câu hỏi → từ điển → viết bút thuận → tiến độ → cài đặt; **không có lỗi console**; chụp ảnh từng màn hình.
- **Offline**: sau khi SW cài, bật offline rồi reload → app vẫn render từ cache.
- **390px**: không tràn ngang (`document.documentElement.scrollWidth === 390`).

## 8. Định nghĩa hoàn thành
- [ ] 300 từ khớp 100% danh sách chính thức, đúng thứ tự.
- [ ] Onboarding lưu mục tiêu; home hiển thị đúng số từ mới/ngày.
- [ ] Học → kiểm tra → phản hồi → tổng kết chạy mượt; reload vẫn còn tiến độ.
- [ ] 4 dạng câu hỏi hoạt động; SRS cập nhật `due` đúng.
- [ ] Từ điển tìm không dấu; viết có bút thuận; số liệu tiến độ chính xác.
- [ ] PWA cài được, offline chạy; manifest/icon hợp lệ.
- [ ] 14 test pass; không lỗi console; README đầy đủ; có screenshots.

## 9. Không làm (để giữ phạm vi)
Không backend/tài khoản/thanh toán; không AI chat; không HSK 2–9; không thi thử; không social/leaderboard; không framework/CSS lib; không dùng đề thi thật.

## 10. Bàn giao
README (cách chạy, cấu trúc, nguồn & license, giới hạn), `serve.cmd`, 3–4 ảnh chụp màn hình, và báo cáo ngắn: đã kiểm tra gì, còn giới hạn gì.

---

**Bản tham chiếu:** app đã hoàn thành nằm trong `han-lo/` — dùng để đối chiếu khi cần.
