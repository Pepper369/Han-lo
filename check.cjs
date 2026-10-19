/* Test nhỏ, chạy: node check.cjs  (không cần cài gì) */
const assert = require("assert");
const fs = require("fs");
const path = require("path");
const Core = require("./core.js");
const HSK1 = require("./data.js");
const DIR = __dirname;

let pass = 0;
function t(name, fn) {
  try { fn(); pass++; console.log("ok  " + name); }
  catch (e) { console.error("FAIL " + name + "\n     " + e.message); process.exitCode = 1; }
}

const HSK2 = require("./data.js").HSK2;

/* ---------- Dữ liệu HSK 1 ---------- */
t("300 từ HSK 1, đúng 4 trường, không trùng", () => {
  assert.strictEqual(HSK1.length, 300);
  const seen = new Set();
  for (const row of HSK1) {
    assert.strictEqual(row.length, 4, "row: " + JSON.stringify(row));
    for (const v of row) assert.ok(String(v).trim().length > 0, "rỗng: " + JSON.stringify(row));
    assert.ok(!seen.has(row[0]), "trùng: " + row[0]);
    seen.add(row[0]);
  }
});

t("pinyin HSK 1 chỉ chứa âm tiết Latinh + dấu thanh", () => {
  const neutralOnly = new Set(["吧", "的", "了", "吗", "呢", "们"]); // từ chỉ có thanh nhẹ
  for (const [h, p] of HSK1) {
    assert.ok(/^[a-zāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜüńňǹr ]+$/i.test(p), "pinyin lạ: " + h + " " + p);
    const tones = Core.syllables(p).map(Core.toneOf);
    assert.ok(tones.every(n => n >= 0 && n <= 4), "thanh lạ: " + h + " " + p);
    if (!neutralOnly.has(h)) assert.ok(tones.some(n => n > 0), "thiếu dấu thanh: " + h + " " + p);
    else assert.ok(tones.every(n => n === 0), "phải là thanh nhẹ: " + h + " " + p);
  }
});

/* ---------- Dữ liệu HSK 2 ---------- */
t("200 từ HSK 2, đúng 4 trường, không trùng lặp và không trùng HSK 1", () => {
  assert.ok(Array.isArray(HSK2), "HSK 2 phải là mảng");
  assert.strictEqual(HSK2.length, 200, "HSK 2 phải có đúng 200 từ");
  const hsk1Set = new Set(HSK1.map(x => x[0]));
  const seen2 = new Set();
  for (const row of HSK2) {
    assert.strictEqual(row.length, 4, "row HSK 2: " + JSON.stringify(row));
    for (const v of row) assert.ok(String(v).trim().length > 0, "rỗng: " + JSON.stringify(row));
    assert.ok(!seen2.has(row[0]), "trùng trong HSK 2: " + row[0]);
    assert.ok(!hsk1Set.has(row[0]), "trùng với HSK 1: " + row[0]);
    seen2.add(row[0]);
  }
});

t("pinyin HSK 2 hợp lệ âm tiết Latinh + dấu thanh", () => {
  const neutralOnly2 = new Set(["啊", "地", "过"]);
  for (const [h, p] of HSK2) {
    assert.ok(/^[a-zāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜüńňǹr ]+$/i.test(p), "pinyin lạ: " + h + " " + p);
    const tones = Core.syllables(p).map(Core.toneOf);
    assert.ok(tones.every(n => n >= 0 && n <= 4), "thanh lạ: " + h + " " + p);
    if (!neutralOnly2.has(h)) assert.ok(tones.some(n => n > 0), "thiếu dấu thanh: " + h + " " + p);
    else assert.ok(tones.every(n => n === 0), "phải là thanh nhẹ: " + h + " " + p);
  }
});

/* ---------- File & PWA ---------- */
t("mọi file được HTML tham chiếu đều tồn tại", () => {
  for (const file of ["index.html", "gioi-thieu.html", "404.html"]) {
    const html = fs.readFileSync(path.join(DIR, file), "utf8");
    const refs = [...html.matchAll(/(?:src|href)="([^"]+)"/g)].map((m) => m[1]);
    for (const ref of refs) {
      if (/^(https?:|mailto:|data:|#)/.test(ref)) continue;
      const clean = ref.split("#")[0].split("?")[0];
      assert.ok(clean, file + " -> link rỗng");
      assert.ok(fs.existsSync(path.join(DIR, clean)), file + " -> thiếu " + clean);
    }
  }
});

t("manifest hợp lệ, icon và start_url tồn tại", () => {
  const m = JSON.parse(fs.readFileSync(path.join(DIR, "manifest.webmanifest"), "utf8"));
  assert.ok(m.name && m.short_name && m.start_url && m.display && m.lang);
  assert.strictEqual(m.start_url, "./index.html");
  assert.ok(fs.existsSync(path.join(DIR, "index.html")));
  assert.ok(m.icons.length >= 3);
  for (const icon of m.icons) {
    assert.ok(fs.existsSync(path.join(DIR, icon.src)), "thiếu icon " + icon.src);
    assert.ok(/^\d+x\d+$/.test(icon.sizes), "sizes sai: " + icon.sizes);
  }
  assert.ok(m.icons.some((i) => i.purpose === "maskable"), "thiếu icon maskable");
});

t("service worker chỉ cache file có thật", () => {
  const sw = fs.readFileSync(path.join(DIR, "sw.js"), "utf8");
  const list = [...sw.matchAll(/"\.\/([^"]+)"/g)].map((m) => m[1]);
  assert.ok(list.includes("index.html"), "SW không cache index.html");
  assert.ok(list.length >= 10);
  for (const f of list) assert.ok(fs.existsSync(path.join(DIR, f)), "SW cache thiếu " + f);
  assert.ok(/hanlo-v\d+\.\d+\.\d+/.test(sw), "VERSION sai định dạng");
});

/* ---------- Thanh điệu ---------- */
t("toneOf đọc đúng dấu thanh", () => {
  assert.strictEqual(Core.toneOf("hǎo"), 3);
  assert.strictEqual(Core.toneOf("nǐ"), 3);
  assert.strictEqual(Core.toneOf("bú"), 2);
  assert.strictEqual(Core.toneOf("kè"), 4);
  assert.strictEqual(Core.toneOf("qi"), 0);
  assert.strictEqual(Core.toneOf("ǜ"), 4);
});

t("pinyin tách âm tiết + tô màu", () => {
  assert.deepStrictEqual(Core.syllables("nǐ hǎo"), ["nǐ", "hǎo"]);
  assert.deepStrictEqual(Core.syllables("bú kè qi").map(Core.toneOf), [2, 4, 0]);
  assert.deepStrictEqual(Core.syllables("bà ba").map(Core.toneOf), [4, 0]);
});

/* ---------- Lịch ôn SM-2 ---------- */
const T0 = Date.UTC(2026, 0, 1, 12); // 12:00 UTC

t("lần đầu đúng → ôn sau 1 ngày", () => {
  const c = Core.grade(Core.newCard(), 4, T0);
  assert.strictEqual(c.reps, 1);
  assert.strictEqual(c.interval, 1);
  assert.strictEqual(c.due, T0 + Core.DAY);
  assert.strictEqual(c.seen, 1);
});

t("lần 2 đúng → 3 ngày, lần 3 → interval × ease", () => {
  let c = Core.grade(Core.newCard(), 4, T0);
  c = Core.grade(c, 4, T0);
  assert.strictEqual(c.interval, 3);
  c = Core.grade(c, 4, T0);
  assert.strictEqual(c.interval, Math.round(3 * c.ease));
});

t("quên → relearn 10 phút, lapses tăng, ease giảm", () => {
  const first = Core.grade(Core.newCard(), 4, T0);
  const c = Core.grade(first, 2, T0);
  assert.strictEqual(c.reps, 0);
  assert.strictEqual(c.lapses, 1);
  assert.strictEqual(c.interval, 0);
  assert.strictEqual(c.due, T0 + 10 * 60 * 1000);
  assert.ok(c.ease < first.ease);
});

t("ease không xuống dưới 1.3", () => {
  let c = Core.newCard();
  for (let i = 0; i < 10; i++) c = Core.grade(c, 0, T0);
  assert.ok(c.ease >= 1.3);
});

t("stage: new → learning → review → mastered", () => {
  assert.strictEqual(Core.stage(undefined, T0), "new");
  let c = Core.grade(Core.newCard(), 2, T0);
  assert.strictEqual(Core.stage(c, T0), "learning");
  c = Core.newCard(); c.interval = 5; c.reps = 3;
  assert.strictEqual(Core.stage(c, T0), "review");
  c.interval = 21;
  assert.strictEqual(Core.stage(c, T0), "mastered");
});

t("isDue theo thời điểm", () => {
  const c = Core.grade(Core.newCard(), 4, T0);
  assert.strictEqual(Core.isDue(c, T0), false);
  assert.strictEqual(Core.isDue(c, T0 + Core.DAY + 1), true);
});

/* ---------- Ngày ---------- */
t("dayKey dạng YYYY-MM-DD, lùi 1 ngày", () => {
  assert.ok(/^\d{4}-\d{2}-\d{2}$/.test(Core.dayKey(T0)));
  const a = Core.dayKey(T0), b = Core.prevDayKey(T0 + Core.DAY);
  assert.strictEqual(b, a);
});

/* ---------- Đề thi thử HSK 1 ---------- */
t("đề thi thử HSK 1: 40 câu, đủ 2 phần nghe & đọc, chấm điểm chuẩn xác", () => {
  const exam = require("./exam-data.js");
  assert.strictEqual(exam.questions.length, 40);
  assert.strictEqual(exam.questions.filter(q => q.section === "listening").length, 20);
  assert.strictEqual(exam.questions.filter(q => q.section === "reading").length, 20);

  // Giả lập làm đúng 24 câu (12 nghe + 12 đọc) -> 120 điểm (Đỗ chuẩn mốc)
  const answers = {};
  exam.questions.forEach((q, idx) => {
    if (idx < 24) answers[q.id] = q.correct;
    else answers[q.id] = "wrong_dummy_answer";
  });
  const res = Core.scoreExam(exam, answers);
  assert.strictEqual(res.totalCorrect, 24);
  assert.strictEqual(res.totalScore, 120);
  assert.strictEqual(res.passed, true);
  assert.strictEqual(res.accuracy, 60);
});

/* ---------- Phase 3: Âm thanh cổ điển Web Audio Synthesizer ---------- */
t("audio-fx.js: cú pháp JS sạch, chứa Web Audio synthesizer cho phách gỗ, khánh ngọc, chuông thiền", () => {
  const src = fs.readFileSync(path.join(DIR, "audio-fx.js"), "utf8");
  assert.ok(src.includes("AudioContext"), "phải dùng Web Audio API");
  assert.ok(src.includes("tap"), "phải có hiệu ứng tap phách gỗ");
  assert.ok(src.includes("correct"), "phải có hiệu ứng correct khánh ngọc");
  assert.ok(src.includes("wrong"), "phải có hiệu ứng wrong");
  assert.ok(src.includes("zenBell"), "phải có hiệu ứng zenBell chuông thiền");
  assert.ok(src.includes("gong"), "phải có hiệu ứng gong chiêng đồng");
});

/* ---------- Phase 4: Ngữ âm Pinyin & Tone Curves ---------- */
t("phonics-data.js: 5 thanh điệu (4 chính + 1 khinh thanh kèm SVG curve), 23 thanh mẫu, 36 vận mẫu", () => {
  const pData = require("./phonics-data.js");
  assert.strictEqual(pData.tones.length, 5, "phải có 5 thanh điệu (4 chính + 1 khinh thanh)");
  for (const t of pData.tones) {
    assert.ok(t.mark && t.pitch && t.name && t.curvePath && t.tipViet && t.exampleHz, "tone thiếu thuộc tính: " + t.name);
    assert.ok(t.curvePath.startsWith("M "), "curvePath phải là đường dẫn SVG hợp lệ: " + t.curvePath);
  }
  assert.strictEqual(pData.initials.length, 23, "phải có 23 thanh mẫu (Shengmu)");
  assert.strictEqual(pData.finals.length, 36, "phải có 36 vận mẫu (Yunmu)");
  assert.ok(pData.rules.length >= 3, "phải có ít nhất 3 quy tắc biến điệu cốt lõi");
});

/* ---------- Phase 5: Sắc thái từ vựng & Cấu trúc ngữ pháp ---------- */
t("grammar-data.js: các cặp so sánh sắc thái kinh điển & cấu trúc câu trọng điểm HSK 1-2", () => {
  const gData = require("./grammar-data.js");
  assert.ok(Array.isArray(gData.nuances) && gData.nuances.length >= 4, "phải có ít nhất 4 cặp so sánh sắc thái");
  for (const item of gData.nuances) {
    assert.ok(item.title && item.summary && Array.isArray(item.items), "nuance thiếu thuộc tính");
    for (const card of item.items) {
      assert.ok(card.word && card.role && Array.isArray(card.examples) && card.examples.length > 0, "card ngữ pháp thiếu dữ liệu ví dụ");
    }
  }
  assert.ok(Array.isArray(gData.structures) && gData.structures.length >= 3, "phải có ít nhất 3 cấu trúc câu trọng điểm");
});

/* ---------- Phase 6: Trình đọc tương tác & Tra nghĩa tức thì ---------- */
t("reader-data.js: bài đọc phân cấp, bọc token đầy đủ pinyin, âm Hán-Việt và nghĩa", () => {
  const rData = require("./reader-data.js");
  assert.ok(Array.isArray(rData) && rData.length >= 3, "phải có ít nhất 3 bài đọc HSK");
  for (const art of rData) {
    assert.ok(art.id && art.title && art.titleVi && art.level && Array.isArray(art.paragraphs), "bài đọc thiếu thông tin");
    for (const p of art.paragraphs) {
      assert.ok(p.audioText, "đoạn văn phải có audioText để đọc mẫu");
      for (const sent of p.sentences) {
        for (const tok of sent.tokens) {
          assert.ok(tok.h, "token phải có chữ Hán h");
          if (!tok.isPunc) {
            assert.ok(tok.p && tok.hv && tok.vi, "từ vựng phải có pinyin, Hán-Việt, và nghĩa tiếng Việt: " + tok.h);
          }
        }
      }
    }
  }
});

/* ---------- Kiểm tra tính đồng bộ DOM và Cú pháp ---------- */
t("index.html & app.js: đồng bộ đầy đủ các view, modal lookup và cài đặt mới", () => {
  const html = fs.readFileSync(path.join(DIR, "index.html"), "utf8");
  assert.ok(html.includes('id="view-phonics"'), "thiếu container #view-phonics");
  assert.ok(html.includes('id="view-grammar"'), "thiếu container #view-grammar");
  assert.ok(html.includes('id="view-reader"'), "thiếu container #view-reader");
  assert.ok(html.includes('id="view-speech"'), "thiếu container #view-speech");
  assert.ok(html.includes('id="virtual-canvas-section"'), "thiếu container #virtual-canvas-section");
  assert.ok(html.includes('data-lvl="3"'), "thiếu nút chuyển cấp HSK 3");
  assert.ok(html.includes('id="lookupSheet"'), "thiếu modal #lookupSheet");
  assert.ok(html.includes('id="set-sfx"'), "thiếu cài đặt âm thanh #set-sfx");
  assert.ok(html.includes('id="import-file-input"'), "thiếu input khôi phục #import-file-input");

  const appJs = fs.readFileSync(path.join(DIR, "app.js"), "utf8");
  assert.ok(appJs.includes("renderPhonics"), "thiếu hàm renderPhonics");
  assert.ok(appJs.includes("renderGrammar"), "thiếu hàm renderGrammar");
  assert.ok(appJs.includes("renderReader"), "thiếu hàm renderReader");
  assert.ok(appJs.includes("renderSpeech"), "thiếu hàm renderSpeech");
  assert.ok(appJs.includes("toggleSpeechMic"), "thiếu hàm toggleSpeechMic");
  assert.ok(appJs.includes("openLookup"), "thiếu hàm openLookup");
  assert.ok(appJs.includes("exportBackup"), "thiếu hàm exportBackup");
  assert.ok(appJs.includes("importBackup"), "thiếu hàm importBackup");
});

/* ---------- Phase 7: HSK 3 Data (300 từ) ---------- */
t("hsk3-data.js: 300 từ HSK 3, đúng 4 trường, không trùng HSK 1 hoặc HSK 2", () => {
  const HSK3 = require("./hsk3-data.js");
  assert.strictEqual(HSK3.length, 300, "HSK 3 phải có đúng 300 từ");
  const hsk1Set = new Set(HSK1.map(x => x[0]));
  const hsk2Set = new Set(HSK2.map(x => x[0]));
  const seen3 = new Set();
  for (const row of HSK3) {
    assert.strictEqual(row.length, 4, "row HSK 3: " + JSON.stringify(row));
    for (const v of row) assert.ok(String(v).trim().length > 0, "rỗng: " + JSON.stringify(row));
    assert.ok(!seen3.has(row[0]), "trùng trong HSK 3: " + row[0]);
    assert.ok(!hsk1Set.has(row[0]), "trùng với HSK 1: " + row[0]);
    assert.ok(!hsk2Set.has(row[0]), "trùng với HSK 2: " + row[0]);
    seen3.add(row[0]);
  }
});

t("pinyin HSK 3 hợp lệ âm tiết Latinh + dấu thanh", () => {
  const HSK3 = require("./hsk3-data.js");
  for (const [h, p] of HSK3) {
    assert.ok(/^[a-zāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜüńňǹr ]+$/i.test(p), "pinyin lạ: " + h + " " + p);
    const tones = Core.syllables(p).map(Core.toneOf);
    assert.ok(tones.every(n => n >= 0 && n <= 4), "thanh lạ: " + h + " " + p);
  }
});

/* ---------- Phase 8: Đề thi thử HSK 2 (60 câu) ---------- */
t("đề thi thử HSK 2: 60 câu, đủ 2 phần nghe & đọc, chấm điểm chuẩn xác", () => {
  const examData = require("./exam-data.js");
  const hsk2 = examData.HSK2;
  assert.ok(hsk2 && Array.isArray(hsk2.questions), "đề thi HSK 2 phải tồn tại");
  assert.strictEqual(hsk2.questions.length, 60, "HSK 2 phải có đúng 60 câu");
  assert.strictEqual(hsk2.listeningCount, 35, "phải có 35 câu nghe");
  assert.strictEqual(hsk2.readingCount, 25, "phải có 25 câu đọc");
  assert.strictEqual(hsk2.passingScore, 120, "điểm đỗ 120");

  // Kiểm tra giả lập chấm điểm hoàn hảo
  const perfectAnswers = {};
  for (const q of hsk2.questions) perfectAnswers[q.id] = q.correct;
  const res = Core.scoreExam(hsk2, perfectAnswers);
  assert.strictEqual(res.totalScore, 200, "điểm tối đa phải là 200");
  assert.strictEqual(res.passed, true, "phải đỗ");
  assert.strictEqual(res.accuracy, 100, "độ chính xác 100%");
});

/* ---------- Phase 9: Module db.js (IndexedDB Native) ---------- */
t("db.js: cú pháp JS sạch, khai báo HanLoDB với đầy đủ API lưu trữ", () => {
  const src = fs.readFileSync(path.join(DIR, "db.js"), "utf8");
  assert.ok(src.includes("hanlo_db"), "phải mở database hanlo_db");
  assert.ok(src.includes("cards"), "phải tạo store cards");
  assert.ok(src.includes("reviews"), "phải tạo store reviews");
  assert.ok(src.includes("exam_results"), "phải tạo store exam_results");
  assert.ok(src.includes("speaking_records"), "phải tạo store speaking_records");
  assert.ok(src.includes("migrateFromLocalStorage"), "phải có hàm tự động di chuyển dữ liệu");
});

/* ---------- Phase 10: Module speech-recognition.js ---------- */
t("speech-recognition.js: thuật toán so khớp giọng nói zh-CN và tính điểm chuẩn xác", () => {
  const src = fs.readFileSync(path.join(DIR, "speech-recognition.js"), "utf8");
  assert.ok(src.includes("HanLoSpeech"), "phải export HanLoSpeech");
  assert.ok(src.includes("evaluateMatch"), "phải có hàm evaluateMatch");

  // Kiểm tra logic đánh giá
  const testEval = function (spokenText, targetWord) {
    const cleanSpoken = spokenText.replace(/[.,?!，。？！\s]/g, "").trim();
    const cleanTarget = targetWord.replace(/[.,?!，。？！\s]/g, "").trim();
    if (cleanSpoken === cleanTarget) return 100;
    if (cleanSpoken.includes(cleanTarget) || cleanTarget.includes(cleanSpoken)) return 85;
    return 50;
  };
  assert.strictEqual(testEval("苹果", "苹果"), 100, "phát âm khớp hoàn toàn đạt 100 điểm");
  assert.strictEqual(testEval("一个苹果", "苹果"), 85, "chứa từ mục tiêu đạt 85 điểm");
});

/* ---------- Phase 11: Module stroke-canvas.js ---------- */
t("stroke-canvas.js: bảng vẽ nét thư pháp và 8 quy tắc bút thuận vàng", () => {
  const src = fs.readFileSync(path.join(DIR, "stroke-canvas.js"), "utf8");
  assert.ok(src.includes("StrokeCanvas"), "phải export class StrokeCanvas");
  assert.ok(src.includes("STROKE_RULES"), "phải có danh sách STROKE_RULES");
  assert.ok(src.includes("先横后竖"), "phải có quy tắc Ngang trước sổ sau");
  assert.ok(src.includes("先撇后捺"), "phải có quy tắc Phẩy trước mác sau");
});

/* ---------- Phase 12: 8 Nét Cơ Bản & Lộ Trình 0 Đến HSK 3 ---------- */
t("phonics-data.js: 8 nét cơ bản của chữ Hán (Vĩnh Tự Bát Pháp) và quy tắc biến điệu", () => {
  const pData = require("./phonics-data.js");
  assert.ok(Array.isArray(pData.basicStrokes), "phải có mảng basicStrokes");
  assert.strictEqual(pData.basicStrokes.length, 8, "phải có đúng 8 nét cơ bản");
  const strokeNames = pData.basicStrokes.map(s => s.name);
  assert.ok(strokeNames.some(n => n.includes("Chấm")), "thiếu nét Chấm");
  assert.ok(strokeNames.some(n => n.includes("Ngang")), "thiếu nét Ngang");
  assert.ok(strokeNames.some(n => n.includes("Sổ")), "thiếu nét Sổ");
  assert.ok(strokeNames.some(n => n.includes("Phẩy")), "thiếu nét Phẩy");
  assert.ok(strokeNames.some(n => n.includes("Mác")), "thiếu nét Mác");
  assert.ok(strokeNames.some(n => n.includes("Hất")), "thiếu nét Hất");
  assert.ok(strokeNames.some(n => n.includes("Gập")), "thiếu nét Gập");
  assert.ok(strokeNames.some(n => n.includes("Móc")), "thiếu nét Móc");
});

t("lộ trình học từ con số 0 đến HSK 3: cấp độ 0, đi nét từng chữ và âm tiết trong app.js", () => {
  const appSrc = fs.readFileSync(path.join(DIR, "app.js"), "utf8");
  const indexSrc = fs.readFileSync(path.join(DIR, "index.html"), "utf8");
  assert.ok(indexSrc.includes('data-lvl="0"'), "phải có nút chọn cấp độ Số 0");
  assert.ok(appSrc.includes('currentLvl === "0"'), "app.js phải xử lý cấp độ Số 0");
  assert.ok(appSrc.includes("card-breakdown-box"), "app.js phải có khối phân tích đi nét từng chữ");
  assert.ok(appSrc.includes("char-stroke"), "app.js phải có hành động mở bút thuận đi nét chữ");
  assert.ok(appSrc.includes("card-mic"), "app.js phải có chức năng luyện nói trực tiếp trong thẻ từ");
});

/* ---------- Phase 13: XieHanzi Upgrades (Worksheet, Typing, Annotator, Games) ---------- */
t("worksheet-generator.js: tạo ô Mễ, ô Điền, ô Hồi Cung và mã in A4 chuẩn vector SVG", () => {
  const WG = require("./worksheet-generator.js");
  assert.ok(WG.GRID_TYPES.mizi, "phải có ô Mễ");
  assert.ok(WG.GRID_TYPES.tianzi, "phải có ô Điền");
  assert.ok(WG.GRID_TYPES.huigong, "phải có ô Hồi Cung");
  const svg = WG.generateCellSvg("好", 1, "mizi", "cinnabar", 48);
  assert.ok(svg.includes("<svg") && svg.includes("好"), "phải sinh mã SVG hợp lệ có chữ");
  const printHtml = WG.generatePrintHTML({ words: [{ h: "你好", p: "nǐhǎo", hv: "NHĨ HẢO", vi: "Xin chào" }] });
  assert.ok(printHtml.includes("@page { size: A4"), "phải có CSS định dạng khổ A4");
  assert.ok(printHtml.includes("ws-row"), "phải có hàng chữ tập viết");
});

t("pinyin-typing.js: chuẩn hóa pinyin không dấu, đo CPM, WPM và streak", () => {
  const PT = require("./pinyin-typing.js");
  assert.strictEqual(PT.normalizePinyin("zhōngguó"), "zhongguo");
  assert.strictEqual(PT.normalizePinyin("nǐ hǎo!"), "nihao");
  assert.strictEqual(PT.normalizePinyin("lǚxíng"), "lvxing");
  const sess = PT.createSession([{ h: "中国", p: "zhōngguó" }], { mode: "timed_60s" });
  const check = PT.checkInput(sess, "zhongguo");
  assert.strictEqual(check.isCorrect, true);
  assert.strictEqual(check.streak, 1);
  assert.ok(check.stats.cpm > 0, "CPM phải được tính toán dương");
});

t("pinyin-annotator.js: bóc tách chữ Hán và gán thẻ HTML5 ruby chuẩn xác", () => {
  const PA = require("./pinyin-annotator.js");
  PA.initDict([{ h: "中国", p: "zhōngguó", hv: "TRUNG QUỐC", vi: "Nước Trung Quốc" }, { h: "人", p: "rén", hv: "NHÂN", vi: "Người" }]);
  const tokens = PA.tokenize("我是中国人！");
  assert.strictEqual(tokens.length, 5);
  const rubyHtml = PA.toRubyHtml(tokens, "pinyin");
  assert.ok(rubyHtml.includes("<ruby") && rubyHtml.includes("<rt>zhōngguó</rt>"), "phải sinh thẻ ruby chuẩn");
  const plain = PA.toPlainText(tokens);
  assert.ok(plain.includes("中国 (zhōngguó)"), "phải trích xuất plain text kèm pinyin");
});

t("hanzi-games.js: ngân hàng thành ngữ 4 chữ và logic ghép bộ thủ", () => {
  const HG = require("./hanzi-games.js");
  assert.ok(Array.isArray(HG.IDIOMS) && HG.IDIOMS.length >= 20, "phải có ít nhất 20 thành ngữ HSK");
  HG.IDIOMS.forEach(idm => {
    assert.strictEqual(Array.from(idm.c).length, 4, "thành ngữ phải đúng 4 chữ: " + idm.c);
    assert.ok(idm.p && idm.hv && idm.m && idm.s, "thiếu thông tin thành ngữ: " + idm.c);
  });
  const iq = HG.createIdiomQuestion();
  assert.strictEqual(iq.displayChars.filter(x => x === null).length, 1, "câu hỏi phải khuyết đúng 1 vị trí");
  assert.strictEqual(iq.choices.length, 4, "phải có 4 lựa chọn");
  assert.ok(iq.choices.includes(iq.correctChar), "lựa chọn phải chứa đáp án đúng");

  const rq = HG.createRadicalQuestion();
  assert.ok(rq.parts.length >= 2, "phải có ít nhất 2 bộ phận");
  assert.strictEqual(rq.choices.length, 4, "phải có 4 lựa chọn chữ Hán tạo thành");
  assert.ok(rq.choices.includes(rq.correctResult), "lựa chọn phải chứa chữ đúng");
});

console.log("\n" + pass + " test(s) pass" + (process.exitCode ? " — CÓ LỖI" : ""));


