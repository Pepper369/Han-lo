# Học tiếng Trung & Kế hoạch xây app học tiếng Trung cho người Việt

> Bản nghiên cứu + kế hoạch sản phẩm. Cập nhật: 19/10/2026. Nguồn tham khảo ở [mục 10](#10-nguồn-tham-khảo).
> Đối tượng đọc: founder / dev / giáo viên nội dung muốn ra app trong 3–6 tháng.

---

## 0. Tóm tắt trong 60 giây

1. **Tiếng Trung = chữ Hán + pinyin + 4 thanh.** Chuẩn dùng ở Việt Nam là **tiếng Phổ thông (普通话), chữ giản thể**. Người Việt có lợi thế lớn về **âm Hán–Việt** nhưng yếu ở **thanh điệu, âm uốn lưỡi, viết tay**.
2. **Hệ thống cấp học đang đổi:** HSK 2.0 (6 cấp) vẫn là đề thi thường ngày trong 2026, nhưng **HSK 3.0 (9 cấp) thi chính thức lần đầu 13/12/2026** và **thành chuẩn toàn cầu từ 01/2027**. Từ vựng tăng mạnh (HSK1: 150 → 300 từ), **viết tay bắt buộc từ cấp 1**, có **thi nói cho cấp 3–6**.
3. **Đây là cửa sổ cơ hội 6–12 tháng:** gần như toàn bộ app/giáo trình hiện có vẫn dạy theo danh sách từ HSK 2.0. Ai làm nội dung **HSK 3.0 chuẩn + tiếng Việt** trước sẽ chiếm được vị trí.
4. **Thị trường Việt Nam là số 1 thế giới về thi HSK:** 146.000 thí sinh năm 2025 (18% toàn cầu), 13.000 việc làm cần tiếng Trung (gấp 2,4 lần tiếng Nhật, +95% so với 2023, lương cao hơn 10–40%), HSK3+ được miễn thi ngoại ngữ tốt nghiệp THPT.
5. **Sản phẩm đề xuất:** app mobile **"Hán Lộ"** — lộ trình HSK 3.0 9 cấp cho người Việt, 15 phút/ngày, **SRS (FSRS) + luyện viết tay + thi thử đúng format + giải thích bằng tiếng Việt + âm Hán–Việt**, offline, giá sinh viên.
6. **MVP 8–10 tuần:** chỉ HSK 1 + 2 (500 từ, 371 chữ, 148 điểm ngữ pháp, ~64 chủ đề), 1 placement test, 2 đề thi thử, chưa có AI/chat/social/B2B dashboard.
7. **Mốc:** beta cuối 11/2026 → soft-launch trước 13/12/2026 (ngày thi 3.0 đầu tiên) → public launch 01/2027 khi 3.0 thành chuẩn.

---

# PHẦN A — NGHIÊN CỨU

## 1. Tiếng Trung: cấu trúc ngôn ngữ

### 1.1 Bức tranh tổng thể

| Khái niệm | Giải thích ngắn | Ghi chú cho app |
|---|---|---|
| Tiếng Phổ thông (普通话) | Chuẩn chính thức của Trung Quốc đại lục, gốc Bắc Kinh | Dạy chuẩn này |
| Chữ giản thể / phồn thể | Giản thể (đại lục, Singapore); phồn thể (Đài Loan, Hồng Kông) | Việt Nam dùng **giản thể**, không cần phồn thể ở MVP |
| Phương ngữ | Quảng Đông, Mân, Ngô… khác biệt lớn với phổ thông | Không dạy; chỉ ghi chú |
| Pinyin | Hệ Latinh ghi âm, có dấu thanh | Là "phao" cho người mới, phải giảm dần phụ thuộc |
| Chữ Hán | Đơn vị nghĩa–âm, không phải chữ cái | Dạy theo bộ thủ + cấu tạo |
| Đơn vị âm tiết | ~400 âm tiết cơ bản, ~1.100 âm tiết có thanh | Mỗi chữ Hán = 1 âm tiết |

**Ngữ âm (quan trọng nhất với người Việt):**
- 21 thanh mẫu (phụ âm đầu) + 36 vận mẫu (vần) + 4 thanh điệu + thanh nhẹ.
- Thanh: 1 (ˉ cao ngang), 2 (ˊ lên), 3 (ˇ xuống–lên), 4 (ˋ xuống), nhẹ (không dấu).
- Biến điệu: hai thanh 3 liền nhau → thanh 3 + thanh 2 (你好 nǐ hǎo → ní hǎo); 不/一 đổi thanh theo ngữ cảnh.
- Các cụm khó với người Việt: **zh/ch/sh/r** (uốn lưỡi), **j/q/x**, **ü/üe/üan**, phân biệt **-n / -ng**, **z/c/s**.

**Chữ Hán:**
- 214 bộ thủ; 8 nét cơ bản; quy tắc bút thuận (ngang trước sổ sau, trên trước dưới, trái trước phải, vào trong trước đóng sau…).
- ~80% chữ là **hình thanh** (một phần gợi nghĩa + một phần gợi âm) → dạy theo cụm bộ thủ hiệu quả hơn học từng chữ rời.
- HSK 3.0 cần **~3.000 chữ để đọc**, **1.200 chữ viết tay** (cộng dồn 9 cấp).

**Từ vựng & ngữ pháp đặc trưng:**
- Không biến hình (không chia thì, ngôi, số). Trật tự câu **SVO**, trạng ngữ đứng trước động từ.
- **Lượng từ** bắt buộc (个, 只, 条, 张, 本…), tương tự "cái/con/chiếc" trong tiếng Việt.
- Trợ từ thể: 了 (hoàn thành), 过 (trải nghiệm), 着 (tiếp diễn).
- **Bổ ngữ**: kết quả (吃完), xu hướng (进来), khả năng (看得懂), mức độ (好极了).
- Câu **把** (xử lý tân ngữ), **被** (bị động), so sánh **比 / 没有 / 跟…一样**.

### 1.2 Người Việt: lợi thế và khó khăn

| Lợi thế | Cách khai thác trong app |
|---|---|
| **Âm Hán–Việt** (khoảng 60–70% từ Hán–Việt trong tiếng Việt có gốc Hán): 电话 = điện thoại, 经济 = kinh tế, 政府 = chính phủ | Hiện âm Hán–Việt cạnh mọi từ mới; liên kết các từ cùng gốc; bài "từ Hán–Việt → từ tiếng Trung" |
| Ngữ pháp tương đồng: SVO, không biến hình, có lượng từ | Giải thích bằng so sánh trực tiếp Việt–Trung, không dùng thuật ngữ tiếng Anh |
| Tiếng Việt cũng có thanh điệu | Dạy thanh bằng "neo" thanh Việt gần nhất (không hoàn toàn trùng) |
| Văn hóa gần, phim ảnh phổ biến | Nội dung nghe dựa trên phim/đời sống, không chỉ giáo trình |

| Khó khăn | Cách xử lý trong app |
|---|---|
| Thanh 2 ↔ thanh 3, thanh 4, thanh nhẹ; biến điệu 3+3 | Bài luyện cặp thanh + minimal pair, nghe–chọn thanh, ghi âm so sánh |
| Âm uốn lưỡi zh/ch/sh/r, j/q/x, ü | Drills theo nhóm âm, video khẩu hình, chấm bằng ASR |
| Nhớ mặt chữ, bút thuận, tốc độ viết | Luyện viết tay có chấm nét + bài thi viết theo yêu cầu 3.0 |
| Pinyin làm "phao" quá lâu | Chế độ giảm dần pinyin theo cấp (L1 có, L2 ẩn một phần, L3+ ẩn) |

### 1.3 Thời gian học ước tính (người Việt, học đều)

| Mốc | Số giờ tích lũy (ước tính) | Với 45 phút/ngày |
|---|---|---|
| HSK 1 | 40–60 giờ | ~2–3 tháng |
| HSK 2 | 100–140 giờ | ~4–6 tháng |
| HSK 3 | 200–290 giờ | ~9–12 tháng |
| HSK 4 | 400–540 giờ | ~18–24 tháng |
| HSK 5 | 700–900 giờ | ~2,5–3 năm |
| HSK 6 | 1.100–1.400 giờ | ~3,5–4,5 năm |

> Người Việt học nhanh hơn người nói tiếng Anh (FSI xếp tiếng Trung nhóm IV, ~2.200 giờ) nhờ thanh điệu + Hán–Việt, nhưng **không nên hứa "3 tháng thành thạo"**. App nên bán "lộ trình + kết quả thi", không bán "thần tốc".

---

## 2. Các cấp học của tiếng Trung

### 2.1 HSK 2.0 — hệ 6 cấp (đang dùng cho các kỳ thi thường ngày năm 2026)

| Cấp | Từ vựng (cộng dồn) | Cấu trúc đề | Thời gian | Điểm đạt |
|---|---|---|---|---|
| HSK 1 | 150 | 40 câu: Nghe + Đọc | ~40 phút | 120/200 |
| HSK 2 | 300 | 60 câu: Nghe + Đọc | ~55 phút | 120/200 |
| HSK 3 | 600 | 80 câu: Nghe + Đọc + Viết | ~90 phút | 180/300 |
| HSK 4 | 1.200 | 100 câu: Nghe + Đọc + Viết | ~105 phút | 180/300 |
| HSK 5 | 2.500 | 100 câu: Nghe + Đọc + Viết | ~125 phút | 180/300 |
| HSK 6 | 5.000+ | 101 câu: Nghe + Đọc + Viết | ~140 phút | 180/300 |

- **Nói tách riêng:** HSKK 3 cấp (sơ cấp / trung cấp / cao cấp), thi ghi âm, đăng ký riêng.
- Viết bắt đầu từ HSK 3 (xếp câu, viết chữ, viết đoạn ngắn); HSK 6 viết tóm tắt.
- Kết quả HSK có giá trị **2 năm**.

### 2.2 HSK 3.0 — hệ 3 cấp 9 bậc (chuẩn mới, đề thi từ 13/12/2026)

Nguồn: Đề cương HSK 2026 (công bố 11/2025) do Trung tâm Hợp tác Giao lưu Ngôn ngữ (汉考国际/CTI) phát hành; số liệu đối chiếu với danh sách chính thức tải về được.

| Cấp | Bậc | Từ vựng mới | Từ vựng cộng dồn | Chữ Hán mới | Chữ viết tay | Ngữ pháp | Chủ đề/nhiệm vụ |
|---|---|---|---|---|---|---|---|
| Sơ cấp (初等) | HSK 1 | 300 | 300 | 246 | 50 | 70 | 30 |
| | HSK 2 | 200 | 500 | 125 | 50 | 78 | 34 |
| | HSK 3 | 500 | 1.000 | 284 | 150 | 96 | 54 |
| Trung cấp (中等) | HSK 4 | 1.000 | 2.000 | 441 | 150 | 95 | 77 |
| | HSK 5 | 1.600 | 3.600 | 431 | 150 | 70 | 72 |
| | HSK 6 | 1.800 | 5.400 | 413 | 150 | 50 | 68 |
| Cao cấp (高等) | HSK 7–9 | 5.600 | ~11.000 | 1.148 | 500 | 134 | 92 |

**Tổng toàn hệ:** ~11.100 từ, 3.088 chữ đọc, 1.200 chữ viết tay, 593 điểm ngữ pháp.
(Lưu ý: file danh sách chính thức có 11.105 mục do có biến thể/trùng; con số làm sản phẩm nên dùng là 11.000.)

**Cấu trúc đề HSK 3.0 (theo tài liệu cấu trúc/đề mẫu mới):**

| Cấp | Tổng câu | Nghe | Đọc | Viết | Thời gian | Thi nói |
|---|---|---|---|---|---|---|
| HSK 1 | 40 | 20 | 20 | — | ~40 phút | Không |
| HSK 2 | 60 | 25 | 25 | 10 | ~60 phút | Không |
| HSK 3 | 70 | 30 | 30 | 10 | ~83 phút | 15 phút |
| HSK 4 | 70 | 32 | 32 | 6 | ~85 phút | 20 phút |
| HSK 5 | 72 | 35 | 35 | 2 bài | ~110 phút | 23 phút |
| HSK 6 | 82 | 40 | 40 | 2 bài | ~125 phút | 23 phút |
| HSK 7–9 | 98 | 40 | 47 | 2 bài | ~210 phút (thi trên máy) | Tích hợp 5 câu |

- HSK 7–9 là **một đề gộp**: Nghe + Đọc + Viết + **Dịch (4 câu)** + **Nói (5 câu)**; kết quả quyết định đạt bậc 7, 8 hay 9.
- **Khác biệt lớn so với 2.0:** viết tay từ cấp 1; viết luận từ cấp 2; đề **ít câu hơn nhưng nặng sản sinh ngôn ngữ hơn**; cấp 3–6 có bài thi nói riêng đi kèm.
- Thang điểm & chuẩn đạt của 3.0: cần lấy từ đề cương/đề mẫu chính thức trước khi làm module chấm điểm — **không hard-code** trong code.

### 2.3 Mốc chuyển đổi (rất quan trọng cho kế hoạch)

| Thời điểm | Sự kiện |
|---|---|
| 11/2025 | Công bố đề cương HSK 2026 (3.0) + danh sách từ/chữ/ngữ pháp mới |
| 20/09/2026 | Kỳ thi thử/thí điểm HSK 3.0 (cấp 3–6 có thi nói) |
| 16/11/2026 | Hạn đăng ký thi giấy kỳ 13/12 |
| 03/12/2026 | Hạn đăng ký thi máy kỳ 13/12 |
| **13/12/2026** | **Kỳ thi HSK 3.0 chính thức đầu tiên toàn cầu** |
| 01/2027 | HSK 3.0 trở thành chuẩn toàn cầu; giáo trình/đề cũ dần lỗi thời |

> Các kỳ thi HSK 1–6 thường ngày trong 2026 **vẫn dùng format 2.0**; 3.0 chỉ ở các kỳ được công bố riêng. App nên hỗ trợ **cả hai** trong giai đoạn chuyển đổi (chọn "thi 2.0 hay 3.0" ở onboarding).

### 2.4 Các khung khác (biết để không nhầm)

| Khung | Dùng cho | Ghi chú |
|---|---|---|
| HSKK | Thi nói 2.0 (sơ/trung/cao) | Tách riêng, đăng ký riêng |
| YCT | Thiếu nhi (4 cấp) | Thị trường phụ huynh, có thể làm sau |
| BCT | Tiếng Trung thương mại (A/B) | Ngách B2B/doanh nghiệp |
| TOCFL | Đài Loan, 6 band | Không ưu tiên thị trường Việt |
| CEFR (A1–C2) | Tham chiếu châu Âu | Ánh xạ HSK↔CEFR chỉ là tương đối, không chính thức |
| CTCSOL | Chứng chỉ giáo viên | Không liên quan app học |

### 2.5 Hàm ý cho sản phẩm

1. **Nội dung phải là HSK 3.0** (danh sách 11/2025), không dùng danh sách 2.0 — đây là điểm khác biệt số 1 trong 12 tháng tới.
2. **Luyện viết tay là tính năng bắt buộc**, không phải phụ: 50 chữ ngay cấp 1, 1.200 chữ đến cấp 9, có yêu cầu tốc độ.
3. **Thi nói** phải có từ cấp 3 (ghi âm + chấm), vì 3.0 gộp nói vào kỳ thi.
4. **Task-based:** đề cương định nghĩa nhiệm vụ giao tiếp (đặt món, hỏi đường, mô tả triệu chứng…) → bài học nên là **tình huống**, không chỉ flashcard.
5. **Kiến trúc nội dung data-driven:** cấu trúc đề có thể còn điều chỉnh đến 13/12/2026 → đừng hard-code số câu/thang điểm; lưu trong DB/config có version.

---

## 3. Thị trường

### 3.1 Việt Nam — số liệu then chốt

| Chỉ số | Giá trị | Nguồn |
|---|---|---|
| Thí sinh HSK năm 2025 | **146.000** — đứng **số 1 thế giới**, chiếm 18% toàn cầu | 光明日报 14/05/2026 |
| Nhu cầu tuyển dụng cần tiếng Trung | 13.000 vị trí, gấp **2,4 lần** tiếng Nhật, **5,4 lần** tiếng Hàn, **+95%** so với 2023 | Joboko, báo cáo lương 2025 |
| Mức lương | Cao hơn **10–40%** so với vị trí tương đương | Joboko 2025 |
| Trung tâm tiếng Trung | **500+** | 光明日报 |
| Trường phổ thông dạy tiếng Trung | **600+** (từ 2024 là ngoại ngữ tự chọn lớp 3–4) | 光明日报 |
| Đại học có ngành tiếng Trung | **50+** | 光明日报 |
| Chính sách | HSK 3+ được **miễn thi ngoại ngữ tốt nghiệp THPT** và quy đổi điểm (Thông tư 24/2024) | Bộ GD&ĐT |
| Động lực học | Việc làm (chính) + phim ảnh/giải trí + du học | 光明日报 |

**Kết luận:** đây là thị trường **exam-driven + job-driven**, không phải "học cho vui". Người dùng sẵn sàng trả tiền khi thấy **lộ trình rõ + kết quả thi + ứng dụng được vào việc làm**. Giá phải hợp túi tiền sinh viên Việt Nam.

### 3.2 Đối thủ & khoảng trống

| Nhóm | Ví dụ | Điểm mạnh | Điểm yếu với người Việt |
|---|---|---|---|
| App quốc tế | Duolingo, HelloChinese, SuperChinese, ChineseSkill | Gamification, nội dung đẹp, AI | Giao diện/giải thích tiếng Anh; **vẫn dạy HSK 2.0**; viết tay yếu; giá cao |
| Từ điển/app Việt | Hanzii, từ điển Hán–Việt | Thương hiệu Việt, tra cứu tốt, có HSK | Chủ yếu tra cứu/flashcard, **không có lộ trình + thi thử + viết tay** |
| Công cụ SRS | Anki + deck HSK | Miễn phí, mạnh | Không hướng dẫn, không lộ trình, không chấm viết/nói |
| Nền tảng thi | HSK Mock, Pass HSK, HSK GO | Đề thi thử, nội dung 3.0 sớm | Tiếng Anh là chính; không tối ưu ngữ âm/Hán–Việt cho người Việt; ít nội dung học từ đầu |
| Offline | Trung tâm, gia sư, sách | Chất lượng, có người chấm | Đắt (150–300k/buổi), không luyện tập hằng ngày, không đo tiến bộ |

**Khoảng trống:** chưa có app nào hội đủ **HSK 3.0 + tiếng Việt + âm Hán–Việt + luyện viết tay + thi thử đúng format + giá Việt Nam**. Đây là định vị.

### 3.3 Personas & việc cần làm (JTBD)

| Persona | Mô tả | Việc cần làm | Điều họ trả tiền cho |
|---|---|---|---|
| **Sinh viên / học sinh** (16–24) | Cần HSK 3–4 để tốt nghiệp, du học, xin việc | "Cho tôi lộ trình 6 tháng tới HSK 3, học trên điện thoại, có đề thi thử" | Lộ trình + đề thi thử + streak, giá rẻ |
| **Người đi làm** (22–35) | Nhà máy, thương mại, logistics, xuất nhập khẩu; ít thời gian | "Tôi cần tiếng Trung công việc trong 3–6 tháng, học 15 phút/ngày" | Nội dung ngắn, thuật ngữ ngành, học offline trên xe |
| **Người học vì sở thích** (25–45) | Phim, du lịch, văn hóa; kiên trì kém | "Dạy tôi đủ để xem phim/du lịch, đừng khô khan" | Nội dung thú vị, gamification, cộng đồng |
| **Trung tâm / giáo viên** (B2B) | 500+ trung tâm, 600+ trường | "Giao bài tập về nhà + theo dõi lớp" | Dashboard lớp, báo cáo, giá theo đầu học viên |

---

# PHẦN B — KẾ HOẠCH SẢN PHẨM

## 4. Sản phẩm

### 4.1 Định vị

> **"Hán Lộ — lộ trình HSK 3.0 cho người Việt: 15 phút/ngày, viết tay chuẩn, thi thử đúng format, giải thích bằng tiếng Việt."**

(Tên "Hán Lộ / 汉路" là tên tạm; có thể đổi. Ưu tiên tên dễ đọc, dễ search, không trùng thương hiệu.)

**3 trụ cột khác biệt:**
1. **HSK 3.0 first-mover** — nội dung đúng đề cương 11/2025, sẵn sàng trước 13/12/2026.
2. **Việt hóa sâu** — giải thích ngữ pháp bằng tiếng Việt, âm Hán–Việt cho mọi từ, so sánh Việt–Trung, bắt đúng lỗi người Việt.
3. **Kết quả đo được** — điểm sẵn sàng thi theo từng kỹ năng (nghe/đọc/viết/nói), thi thử chấm theo format, dự đoán khả năng đạt cấp.

### 4.2 Sáu nguyên tắc thiết kế học tập

| Nguyên tắc | Cụ thể hóa |
|---|---|
| **Ôn tập cách quãng (SRS)** | Dùng **FSRS** (thư viện `ts-fsrs`), không dùng SM-2. 4 loại thẻ: nhận diện (Hán→nghĩa), sản sinh (nghĩa→Hán/pinyin), nghe (audio→nghĩa), thanh điệu (audio→thanh). Mục tiêu ~90% nhớ. |
| **Retrieval + interleaving** | Mỗi bài có quiz ngay; trộn từ cũ/mới; không học 1 từ quá lâu. |
| **Input dễ hiểu** | Câu ví dụ chỉ chứa từ đã học + 1–2 từ mới; audio chậm ở cấp 1, tăng dần. |
| **Sản sinh ngay từ đầu** | Nói nhại (shadowing), gõ chữ, viết tay — không chỉ bấm chọn. |
| **Thanh điệu từ ngày 1** | Bài thanh điệu 5 phút/buổi, cặp thanh, minimal pair, ghi âm so sánh. |
| **Task-based** | Bài học gắn với 15 nhiệm vụ chính thức của cấp 1 (đặt món, hỏi giờ, mua hàng…), không dạy từ rời. |

### 4.3 Vòng lặp học hằng ngày (15 phút)

```
Mở app → Kế hoạch hôm nay (1 màn hình duy nhất)
  1. Ôn SRS  (~6 phút, 20–60 thẻ đến hạn)
  2. Học bài mới (~6 phút, 10–12 từ + 1 ngữ pháp + 1 tình huống)
     Nghe → hiểu → nhại → viết tay 2–3 chữ → quiz
  3. Luyện thêm (~2 phút): thanh điệu HOẶC nghe hiểu
  4. Chốt: +XP, chuỗi ngày, dự báo "còn X ngày tới HSK 1"
```

**Buổi/tuần:** 5 buổi học + 1 buổi checkpoint (kiểm tra 20 câu) + 1 buổi thi thử mini.
**Nhịp độ:** 1 bài/ngày → HSK 1 trong ~1 tháng rưỡi; HSK 2 trong ~3 tháng.

### 4.4 Phạm vi tính năng theo phiên bản

| Tính năng | MVP (8–10 tuần) | v1.1 (+2 tháng) | v2 (+3–6 tháng) |
|---|---|---|---|
| Placement test đầu vào | ✅ (20 câu) | cải thiện | thích ứng (adaptive) |
| Bài học HSK 1–2 | ✅ | HSK 3–4 | HSK 5–6, 7–9 |
| SRS FSRS + sync | ✅ | tối ưu tham số theo user | — |
| Luyện viết tay (chấm nét) | ✅ | tốc độ viết + bài viết tay theo cấp | luyện chữ đẹp |
| Nghe + audio offline | ✅ | shadowing | podcast/bản tin |
| Thi thử đúng format | ✅ HSK 1–2 | HSK 3–4 | HSK 5–6, 7–9 gộp |
| Ghi âm & so sánh phát âm | ❌ (chỉ nghe lại) | ✅ waveform + tự đánh giá | chấm bằng Azure Speech |
| Thi nói (cấp 3–6) | ❌ | ✅ ghi âm + rubric | chấm tự động |
| Giải thích ngữ pháp tiếng Việt | ✅ | video ngắn | — |
| Âm Hán–Việt + từ cùng gốc | ✅ | bộ thủ tương tác | — |
| Gamification | streak + XP | huy hiệu, nhiệm vụ tuần | giải đấu, bạn bè |
| Thanh toán | IAP (RevenueCat) | mã giảm giá, gói trường | B2B seat |
| B2B dashboard | ❌ | ❌ | ✅ (lớp, bài tập, báo cáo) |
| AI chat/gia sư | ❌ | ❌ | có thể (chi phí cao, làm sau) |

**Không làm ở giai đoạn này (và lý do):**
- ❌ AI chat tutor: chi phí/độ trễ/chất lượng; chưa phải lý do mua.
- ❌ Video bài giảng: đắt, khó cập nhật; audio + text đủ cho SRS.
- ❌ Social feed/leaderboard phức tạp: không giải quyết vấn đề học.
- ❌ Phồn thể, Quảng Đông, tiếng Trung thương mại (BCT): ngoài thị trường lõi.
- ❌ Desktop/web B2C: mobile-first (Android chiếm đa số).
- ❌ Marketplace gia sư: vận hành nặng; làm sau khi có người dùng.

### 4.5 Màn hình chính (7 màn hình)

1. **Onboarding**: chọn mục tiêu (thi HSK / đi làm / sở thích) → chọn format thi (2.0 hay 3.0) → placement 20 câu → cam kết 15 phút/ngày.
2. **Home**: kế hoạch hôm nay (ôn → học → luyện), chuỗi ngày, "điểm sẵn sàng thi".
3. **Lesson player**: thẻ từ (Hán, pinyin, Hán–Việt, nghĩa, audio, câu ví dụ) → nhại → viết tay → quiz 5 câu.
4. **Review**: SRS queue, 4 loại thẻ, nút "khó/vừa/dễ".
5. **Hanzi Lab**: bộ thủ, bút thuận, luyện viết có chấm điểm nét, danh sách 50/100 chữ phải viết.
6. **Thi thử**: chọn cấp → đề đúng cấu trúc (40/60 câu) → đếm giờ → chấm điểm + báo cáo kỹ năng + từ cần ôn.
7. **Tiến độ**: % từ đã thuộc theo cấp, biểu đồ nghe/đọc/viết/nói, dự báo ngày thi, quản lý offline.

### 4.6 Nội dung cho MVP (con số cụ thể)

| Hạng mục | HSK 1 | HSK 2 | Tổng MVP |
|---|---|---|---|
| Từ vựng | 300 | 200 mới (500 cộng dồn) | 500 |
| Chữ Hán đọc | 246 | 125 mới | 371 |
| Chữ viết tay | 50 | 50 | 100 |
| Điểm ngữ pháp | 70 | 78 | 148 |
| Chủ đề/nhiệm vụ | 30 | 34 | ~64 |
| Bài học | ~20 | ~18 | ~38 bài |
| Câu ví dụ + audio | ~350 | ~250 | ~600 |
| Câu hỏi quiz | ~700 | ~500 | ~1.200 |
| Đề thi thử | 1 (40 câu) | 1 (60 câu) | 2 đề |

**Công thức làm nội dung:** mỗi bài 12 từ → tự động sinh thẻ SRS 4 loại → giáo viên viết câu ví dụ + audio TTS → 2 vòng review (giáo viên tiếng Trung + biên tập tiếng Việt). Thời gian: **5–6 tuần cho 1 giáo viên + 1 biên tập** (dùng LLM hỗ trợ bản nháp, người duyệt 100%).

### 4.7 Mô hình dữ liệu (rút gọn)

```
word(id, hanzi, pinyin, tone, han_viet, vi_meaning, pos, level, freq, audio_url)
char(id, hanzi, pinyin, han_viet, strokes, components, radical, level, must_write)
grammar(id, level, pattern, vi_explanation, examples_json)
topic(id, level, name_vi, task_type)          -- theo đề cương
lesson(id, level, order, topic_id, word_ids, grammar_ids, type)
question(id, lesson_id, type, payload_json, answer_json)
card(user_id, item_type, item_id, card_type, fsrs_state, due_at)
review_log(user_id, card_id, rating, reviewed_at)
exam(id, level, format_version, sections_json, time_limit)
exam_attempt(user_id, exam_id, answers_json, score_json, started_at)
user(id, goal, exam_format, level_estimate, streak, timezone)
subscription(user_id, plan, expires_at, store, receipt)
content_version(id, version, changelog, published_at)
```

Nguyên tắc: **nội dung tách khỏi app** (JSON/CSV → build thành SQLite bundle) để cập nhật nhanh và cho phép tải theo cấp (offline).

---

## 5. Kỹ thuật

### 5.1 Stack đề xuất (một codebase, offline-first)

| Lớp | Chọn | Lý do | Thay thế |
|---|---|---|---|
| App | **Expo (React Native) + TypeScript** | 1 codebase iOS/Android + web; build nhanh; hệ sinh thái mạnh | Flutter + Drift (tương đương) |
| Điều hướng | expo-router | Chuẩn Expo | React Navigation |
| Local DB | **expo-sqlite + Drizzle ORM** | Offline-first, migration rõ ràng | WatermelonDB |
| State | Zustand | Nhẹ, đủ dùng | Redux (thừa) |
| SRS | **`ts-fsrs`** | Thuật toán FSRS mã nguồn mở, có sẵn TS | SM-2 tự viết |
| Viết tay | `hanzi-writer` (WebView) cho v1 → Skia renderer cho v2 | Nhanh ra mắt; dữ liệu nét có sẵn | react-native-skia từ đầu |
| Audio | expo-audio + file Opus bundle/CDN | Offline, nhẹ | — |
| Backend | **Supabase** (Auth + Postgres + Storage) | Free tier đủ MVP, RLS, nhanh | Firebase |
| Audio CDN | Cloudflare R2 | Egress miễn phí | Supabase Storage |
| Thanh toán | **RevenueCat** (IAP Google/Apple) | Chuẩn hóa receipt, free đến 2.5k$ MRR | Tự làm |
| Analytics | PostHog + Sentry | Free tier, funnel/cohort/CR | Firebase |
| Admin nội dung | CSV trong repo + script validate → publish | Đơn giản nhất, không cần web admin | Airtable/Retool |

**Kiến trúc:** `app (RN)` ⇄ `SQLite local` ⇄ `sync (Supabase)`; nội dung là **bundle JSON/SQLite** tải theo cấp; server chỉ giữ user/card/subscription/attempt.

### 5.2 Offline & sync

- Tải "gói HSK 1" (~20–30MB gồm audio) → học hoàn toàn offline (quan trọng với người đi làm/3G yếu).
- Sync card state theo **event log** (review_log) + merge last-write-wins; 1 người dùng có thể dùng 2 thiết bị.
- Khi mất mạng: xếp hàng event, đẩy lại khi có mạng; không chặn học.

### 5.3 Audio & phát âm

- **TTS pre-generate** toàn bộ từ + câu ví dụ bằng Azure Neural TTS (giọng zh-CN), encode **Opus 24–32kbps** (≈15–25KB/câu) → 600 câu ≈ 12–15MB.
- Từ cấp 1 nên thu âm người thật (giáo viên) sau khi có doanh thu — chất lượng cảm nhận tốt hơn.
- Phát âm: v1 chỉ ghi âm–nghe lại; v1.1 dùng **Azure Pronunciation Assessment** (zh-CN) để chấm thanh điệu/âm tiết; luôn hiển thị "điểm tham khảo", không hứa chính xác tuyệt đối.

### 5.4 Nguồn dữ liệu & bản quyền

| Dữ liệu | Nguồn | License / lưu ý |
|---|---|---|
| Danh sách từ/chữ/ngữ pháp HSK 3.0 | Đề cương chính thức 2025 (chinesetest.cn) + bản OCR cộng đồng | Danh sách chuẩn là dữ kiện; **không sao chép đề thi/giáo trình** |
| Nghĩa tiếng Việt | Tự biên soạn (LLM nháp + giáo viên duyệt) | Tránh copy từ điển có bản quyền |
| Pinyin | Unihan (`kMandarin`) + đối chiếu | Unihan license mở (Unicode) |
| **Âm Hán–Việt** | Unihan (`kVietnamese`) + đối chiếu | Miễn phí, chính xác cao |
| Nghĩa tiếng Anh (tham chiếu) | CC-CEDICT | CC BY-SA 3.0 — ghi nguồn, chia sẻ tương tự phần dẫn xuất |
| Dữ liệu nét chữ | Make Me a Hanzi / hanzi-writer-data | Arphic Public License — ghi attribution |
| Câu ví dụ | Tự viết; tham khảo Tatoeba (CC BY 2.0 FR) | Lọc câu ngắn, đúng ngữ pháp |
| Đề thi thử | **Tự soạn 100% theo cấu trúc**, không dùng đề thật | Đề thật có bản quyền |

> Quy tắc: **dùng dữ kiện chuẩn (danh sách, pinyin, âm Hán–Việt) + tự viết nội dung sáng tạo (câu, bài, đề)**. Ghi attribution ở màn hình About.

### 5.5 Chi phí hạ tầng (ước tính)

| Khoản | MVP | Khi 10k MAU |
|---|---|---|
| Supabase | 0 | ~$25/tháng |
| R2/CDN | ~$0–5 | ~$20/tháng |
| TTS (một lần) | <$20 | — |
| RevenueCat | 0 | 1% doanh thu |
| PostHog/Sentry | 0 | ~$0–50/tháng |
| Store | $25 Google (một lần) + $99/năm Apple | — |
| **Tổng** | **~$30–150/năm** | **~$100–200/tháng** |

Chi phí thật nằm ở **nội dung + người**, không phải server.

### 5.6 Tiêu chí nghiệm thu MVP (test được)

- [ ] Cài mới → placement → bài học đầu tiên trong **< 90 giây**.
- [ ] Học **offline hoàn toàn** sau khi tải gói HSK 1 (chế độ máy bay).
- [ ] FSRS có test đơn vị: không mất/không nhân đôi thẻ khi sync 2 thiết bị.
- [ ] Viết tay: chấm đúng/sai nét với dung sai hợp lý; hiển thị bút thuận.
- [ ] 1 đề thi thử HSK 1 (40 câu, 40 phút) chấm điểm + báo cáo theo kỹ năng.
- [ ] Thanh toán + khôi phục giao dịch hoạt động trên Android & iOS.
- [ ] Crash-free ≥ 99,5%; cold start < 3s trên máy Android tầm trung; app < 80MB.
- [ ] 100 người beta dùng 2 tuần: D7 ≥ 25%, hoàn thành bài đầu ≥ 70%.

---

## 6. Kế hoạch triển khai

### 6.1 Lộ trình 12 tháng

| Thời gian | Mục tiêu | Kết quả bàn giao |
|---|---|---|
| **T10/2026** | Sprint 0: chốt scope, pipeline nội dung, prototype 1 bài | Repo, 1 bài học chạy được trên máy thật, 5 người thử |
| **T11/2026** | Build MVP L1–L2 | App beta nội bộ, 50–100 beta tester |
| **T12/2026** | Soft launch trước **13/12** (mốc thi 3.0 đầu tiên) | App trên 2 store, chiến dịch "HSK 3.0 đầu tiên" |
| **T01/2027** | Public launch khi 3.0 thành chuẩn | Paywall, nội dung HSK 3, vòng lặp tăng trưởng |
| **T02–03/2027** | HSK 4 + thi nói + B2B pilot | 3–5 trung tâm dùng thử, dashboard lớp |
| **T04–06/2027** | HSK 5–6, chấm phát âm, web | 5–10k MAU, 500+ người trả phí |
| **T07–09/2027** | HSK 7–9, B2B scale | 20k+ MAU, doanh thu ổn định |
| **T10–12/2027** | Mở rộng (Campuchia/Lào? hoặc B2B mạnh hơn) | Quyết định vòng gọi vốn tiếp theo |

### 6.2 10 tuần tới (chi tiết)

| Tuần | Việc chính | Output |
|---|---|---|
| 0 | Chốt scope MVP; dựng repo + pipeline content (CSV → SQLite); prototype 1 bài học (10 từ + SRS + audio + viết tay) | Bản demo trên máy thật |
| 1 | Spike kỹ thuật: Expo, hanzi-writer WebView, audio offline, FSRS | Quyết định stack, ước lượng rủi ro |
| 2 | Onboarding + placement test + màn hình Home | Luồng vào app hoàn chỉnh |
| 3–4 | Lesson player + Review SRS + tiến độ | Học được 10 bài |
| 5 | Hanzi Lab (bút thuận, chấm nét, 100 chữ) | Luyện viết hoạt động |
| 6 | Nội dung HSK 1 hoàn chỉnh (300 từ, 70 ngữ pháp, audio) | Gói nội dung L1 |
| 7 | Đề thi thử HSK 1 + báo cáo kỹ năng | Thi thử end-to-end |
| 8 | Auth + sync + paywall (RevenueCat) + analytics | Sẵn sàng beta |
| 9 | Beta 50–100 người, sửa lỗi, đo D1/D7 | Báo cáo beta + backlog |
| 10 | Submit store, chuẩn bị marketing 13/12 | App chờ duyệt |

**Đường găng (critical path):** nội dung HSK 1 phải xong trước tuần 7 → **tuyển giáo viên ngay tuần 0**, song song với dev.

### 6.3 Đội & ngân sách

**Đội tối thiểu (bootstrap):**
- 1 founder (product + code) — full-time.
- 1 mobile dev — 2–3 tháng (hoặc founder tự làm nếu có kinh nghiệm RN).
- 1 giáo viên tiếng Trung (bản ngữ/giỏi) — part-time 20–25h/tuần.
- 1 biên tập tiếng Việt — part-time.
- 0,5 designer (thuê ngoài theo gói).

**Ngân sách 6 tháng (VNĐ, ước tính):**

| Khoản | Chi phí |
|---|---|
| Nội dung HSK 1–2 (giáo viên + biên tập + review) | 30–45 triệu |
| Nội dung HSK 3–4 | 60–90 triệu |
| Designer UI/UX + icon + store assets | 15–25 triệu |
| Hạ tầng + store + công cụ | 3–8 triệu |
| Marketing thử nghiệm (TikTok/Facebook/SEO) | 30–50 triệu |
| Pháp lý, hóa đơn, kế toán | 5–10 triệu |
| **Tổng 6 tháng** | **~150–230 triệu** (chưa gồm lương founder) |

Nếu thuê dev ngoài: +20–35 triệu/tháng → tổng ~300–400 triệu cho 6 tháng.

### 6.4 Bám mốc HSK 3.0

- **Trước 13/12/2026:** app phải có ít nhất HSK 1–2 theo 3.0 + 1 đề thi thử. Thông điệp marketing: *"Kỳ thi HSK 3.0 đầu tiên 13/12/2026 — ôn đúng chuẩn mới, đừng học danh sách cũ."*
- **01/2027:** 3.0 thành chuẩn → đẩy mạnh SEO từ khóa "HSK 3.0", "HSK 9 cấp", "danh sách từ vựng HSK 2026".
- **Trong 2026:** vẫn hỗ trợ người thi 2.0 (chọn format khi onboarding) — không bỏ rơi nhóm này.

---

## 7. Kinh doanh

### 7.1 Giá & gói

| Gói | Giá đề xuất | Quyền lợi |
|---|---|---|
| Free | 0đ | HSK 1: 10 bài đầu; 20 lượt ôn/ngày; 1 đề thi thử/tháng; có quảng cáo nhẹ (tùy chọn) |
| **Pro tháng** | **79.000đ** | Toàn bộ nội dung theo cấp đã mở, ôn không giới hạn, offline, thi thử, báo cáo |
| **Pro năm** | **499.000đ** (~42k/tháng) | Như trên + 2 tháng miễn phí |
| **Pro trọn đời** (early bird) | **699.000đ** (giá thường 1.290.000đ) | Như trên, dùng mãi |
| Sinh viên | giảm 30% | Xác thực email trường |
| B2B trung tâm/trường | 40.000đ/học viên/năm (tối thiểu 100 HV) | Dashboard lớp, giao bài, báo cáo |

**Neo giá:** một buổi học gia sư 150–300k → Pro tháng rẻ hơn 1 buổi. Truyền thông: *"1 buổi gia sư = 2 tháng app"*.

### 7.2 Kênh thu hút

| Kênh | Cách làm | Ưu tiên |
|---|---|---|
| TikTok/Reels/YouTube Shorts | "5 từ Hán–Việt = 5 từ tiếng Trung", mẹo thanh điệu, HSK 3.0 là gì | ⭐⭐⭐ |
| SEO | Trang web tra cứu **từ vựng HSK 3.0 miễn phí** (11.000 từ) + blog so sánh 2.0/3.0 | ⭐⭐⭐ |
| Cộng đồng | Group Zalo/Facebook "HSK 3.0", hợp tác admin group 45k thành viên kiểu "商务中文" | ⭐⭐ |
| Giáo viên/trung tâm | Affiliate 20–30%, tặng tài khoản lớp học thử | ⭐⭐ |
| Trường học | Bán gói trường, tài liệu ôn thi miễn phí cho giáo viên | ⭐ |
| Referral | Tặng 7 ngày Pro cho cả 2 bên | ⭐ |

### 7.3 Chỉ số & mục tiêu

**North-star metric:** số từ đạt trạng thái "đã thuộc" (khoảng cách ôn > 21 ngày) trên mỗi người dùng hoạt động/tuần.

| Chỉ số | Beta | 6 tháng | 12 tháng |
|---|---|---|---|
| Install | 100 | 20.000 | 100.000 |
| D1 / D7 / D30 | 40% / 25% / 10% | 45% / 28% / 12% | 45% / 30% / 15% |
| Bài học hoàn thành/người/tuần | 3 | 4 | 5 |
| Tỉ lệ free → trả phí | — | 3% | 4% |
| Người trả phí | — | 500 | 2.500 |
| MRR | — | 40–60 triệu | 180–220 triệu |
| Hợp đồng B2B | 0 | 1–3 | 5–10 |

---

## 8. Rủi ro & cách giảm

| # | Rủi ro | Mức | Cách giảm |
|---|---|---|---|
| 1 | **Nội dung sai/chậm** — từ vựng, nghĩa, ngữ pháp tiếng Việt | Cao | Pipeline CSV + validate tự động; 2 vòng duyệt; version hóa nội dung; hiển thị nút "báo lỗi" trong app |
| 2 | **Đề 3.0 còn thay đổi** đến 13/12/2026 | Cao | Không hard-code cấu trúc/thang điểm; lưu config có version; bán "lộ trình" trước, "đề" sau khi có đề mẫu chính thức |
| 3 | **Bản quyền** (đề thật, giáo trình, từ điển) | Trung bình | Chỉ dùng dữ kiện chuẩn + tự viết; ghi attribution; rà soát license CC-CEDICT/Arphic |
| 4 | **Đối thủ lớn** (Duolingo, HelloChinese, HSK GO) | Trung bình | Ngách tiếng Việt + Hán–Việt + HSK 3.0 + kết quả thi; tốc độ 6–9 tháng |
| 5 | **Giữ chân thấp** (đặc trưng app ngôn ngữ) | Cao | Bài ngắn 15 phút; streak; thông báo đúng giờ; nhóm học theo lớp; nội dung phim/đời sống |
| 6 | **Chi phí nội dung leo thang** | Trung bình | Chỉ làm L1–L2 trước; LLM nháp + người duyệt; thuê giáo viên theo bài |
| 7 | **Phụ thuộc 1 người** | Trung bình | Tài liệu hóa pipeline; nội dung tách khỏi app; ít nhất 2 người biết build |
| 8 | **Chính sách & pháp lý** (IAP, dữ liệu cá nhân) | Trung bình | Dùng IAP; chính sách quyền riêng tư rõ; tuân thủ Luật Bảo vệ dữ liệu cá nhân (hiệu lực 2026) — kiểm tra với luật sư |
| 9 | **Chất lượng phát âm/viết tay không đủ tốt** | Trung bình | Dùng thư viện có sẵn, không tự research; đặt kỳ vọng "tham khảo" |

---

## 9. Việc cần làm ngay trong 7 ngày

| Ngày | Việc | Kết quả |
|---|---|---|
| 1 | Chốt **1 persona + 1 mục tiêu** (sinh viên, HSK 1→2, 15 phút/ngày) | 1 trang scope |
| 2 | Dựng repo Expo "hello world" + pipeline CSV→JSON cho 300 từ HSK 1 (lấy từ danh sách chính thức + Unihan) | Dữ liệu HSK 1 có pinyin + âm Hán–Việt |
| 3 | Prototype **1 bài học**: 10 từ + audio TTS + SRS + quiz + viết tay 1 chữ | Demo trên điện thoại |
| 4 | Liên hệ 2–3 giáo viên tiếng Trung, chốt 1 người review; tuyển 10 beta tester | Hợp tác + danh sách beta |
| 5 | Landing page + form đăng ký (waitlist) + 3 video TikTok mẫu | 50–100 email đăng ký |
| 6 | Cho 5 người dùng thử bài học, đo thời gian và điểm vướng | Danh sách lỗi UX |
| 7 | **Quyết định build/không + chốt scope 8 tuần** | Kế hoạch sprint 0 |

---

## 10. Nguồn tham khảo

**Chuẩn & đề thi**
- [Kỳ thi HSK 3.0 chính thức đầu tiên 13/12/2026 — Pass HSK (08/09/2026)](https://www.passhsk.app/news/hsk-3-0-exam-date-2026)
- [Đề cương HSK 2026 đầy đủ 9 cấp — Pass HSK](https://www.passhsk.app/hsk-syllabus-2026)
- [Yêu cầu HSK 1 (300 từ, 246 chữ, 70 ngữ pháp, 15 nhiệm vụ) — Pass HSK](https://www.passhsk.app/hsk-1-requirements-2026)
- [HSK 3.0 vs HSK hiện tại: cấu trúc đề, thi nói, viết tay — HSK Mock (31/07/2026)](https://www.hskmock.com/en/blog/370.html)
- [HSK 3.0 chính thức ra mắt từ 12/2026 (tiếng Việt) — HSK Mock](https://hskmock.com/vi/blog/619.html)
- [Cấu trúc đề HSK 2.0 theo từng cấp (số câu, thời gian) — HSK Mock](https://hskmock.com/vi/blog/375.html)
- [Trang thi chính thức — Chinese Test Service (chinesetest.cn)](https://www.chinesetest.cn/)
- [Chuẩn năng lực tiếng Trung quốc tế 2021 — Bộ Giáo dục Trung Quốc](https://hudong.moe.gov.cn/jyb_xwfb/gzdt_gzdt/s5987/202103/t20210329_523304.html)
- [Danh sách từ/chữ/ngữ pháp HSK 3.0 (2021 & 2025), BCT, YCT — GitHub krmanik/HSK-3.0](https://github.com/krmanik/HSK-3.0)

**Thị trường**
- [Vì sao "cơn sốt tiếng Trung" ở Việt Nam tiếp tục tăng — 光明日报, 14/05/2026](https://wap.gmw.cn/2026-05/14/content_38764741.htm) (146.000 thí sinh HSK 2025; 13.000 việc làm; 500+ trung tâm; 600+ trường)
- [Người Việt thi tiếng Trung đông nhất thế giới — Vietnam.vn](https://www.vietnam.vn/it/nguoi-viet-thi-tieng-trung-dong-nhat-the-gioi)

**Dữ liệu & thư viện kỹ thuật**
- [Unihan Database (pinyin `kMandarin`, âm Hán–Việt `kVietnamese`) — Unicode](https://www.unicode.org/charts/unihan.html)
- [CC-CEDICT — từ điển Trung–Anh mã nguồn mở (CC BY-SA 3.0)](https://cc-cedict.org/wiki/)
- [Make Me a Hanzi — dữ liệu nét chữ (Arphic Public License)](https://github.com/skishore/makemeahanzi)
- [hanzi-writer — thư viện luyện viết chữ Hán (MIT)](https://github.com/chanind/hanzi-writer)
- [ts-fsrs — thuật toán ôn tập cách quãng FSRS cho TypeScript](https://github.com/open-spaced-repetition/ts-fsrs)

---

### Phụ lục A — So sánh nhanh HSK 2.0 vs 3.0 (dùng cho landing page/SEO)

| Tiêu chí | HSK 2.0 (2009) | HSK 3.0 (2025–2026) |
|---|---|---|
| Số cấp | 6 | 9 (3 cấp × 3 bậc) |
| Từ vựng HSK 1 | 150 | 300 |
| Từ vựng HSK 4 | 1.200 | 2.000 |
| Từ vựng tối đa | 5.000+ (HSK 6) | ~11.000 (HSK 7–9) |
| Viết tay | Từ HSK 3 | **Từ HSK 1** (50 chữ) |
| Thi nói | HSKK riêng | Gắn với cấp 3–6; tích hợp ở 7–9 |
| Dịch | Không | Có ở 7–9 |
| Định hướng | Kiến thức | **Nhiệm vụ giao tiếp** |
| Hiệu lực kết quả | 2 năm | 2 năm |

### Phụ lục B — Checklist ra mắt (dùng nội bộ)

- [ ] Nội dung HSK 1–2 đã qua 2 vòng duyệt, có version.
- [ ] 100% audio có file, đã kiểm tra phát âm.
- [ ] FSRS có test; sync có test 2 thiết bị.
- [ ] Offline mode đã thử trên máy bay.
- [ ] Paywall + restore purchase trên 2 store.
- [ ] Chính sách quyền riêng tư + điều khoản + xóa tài khoản (bắt buộc store).
- [ ] Phân loại tuổi, mô tả store, ảnh chụp màn hình (5 ngôn ngữ? tối thiểu Việt/Anh).
- [ ] Kênh hỗ trợ (Zalo/email) + form báo lỗi nội dung.
- [ ] Analytics: onboarding, lesson_start, lesson_complete, review_session, exam_attempt, purchase.
- [ ] Kế hoạch ra mắt 13/12/2026: bài đăng, video, email waitlist.
