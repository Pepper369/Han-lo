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

console.log("\n" + pass + " test(s) pass" + (process.exitCode ? " — CÓ LỖI" : ""));
