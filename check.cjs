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
  assert.ok(html.includes('id="lookupSheet"'), "thiếu modal #lookupSheet");
  assert.ok(html.includes('id="set-sfx"'), "thiếu cài đặt âm thanh #set-sfx");
  assert.ok(html.includes('id="import-file-input"'), "thiếu input khôi phục #import-file-input");

  const appJs = fs.readFileSync(path.join(DIR, "app.js"), "utf8");
  assert.ok(appJs.includes("renderPhonics"), "thiếu hàm renderPhonics");
  assert.ok(appJs.includes("renderGrammar"), "thiếu hàm renderGrammar");
  assert.ok(appJs.includes("renderReader"), "thiếu hàm renderReader");
  assert.ok(appJs.includes("openLookup"), "thiếu hàm openLookup");
  assert.ok(appJs.includes("exportBackup"), "thiếu hàm exportBackup");
  assert.ok(appJs.includes("importBackup"), "thiếu hàm importBackup");
});

console.log("\n" + pass + " test(s) pass" + (process.exitCode ? " — CÓ LỖI" : ""));
