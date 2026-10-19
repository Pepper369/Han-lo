const assert = require("assert");
const Core = require("../core.js");
const HSK1 = require("../data.js");
const HSK2 = require("../data.js").HSK2;
const HSK3 = require("../hsk3-data.js");

console.log("Checking HSK 3 data...");
assert.strictEqual(HSK3.length, 300, "HSK 3 phải có 300 từ");

const hsk1Set = new Set(HSK1.map(x => x[0]));
const hsk2Set = new Set(HSK2.map(x => x[0]));
const seen = new Set();

const neutralOnly = new Set(["的", "得", "地", "子", "头", "们", "了", "着", "过", "吧", "吗", "呢"]);

for (let i = 0; i < HSK3.length; i++) {
  const row = HSK3[i];
  assert.strictEqual(row.length, 4, `Row ${i} must have 4 fields: ${JSON.stringify(row)}`);
  for (const v of row) {
    assert.ok(String(v).trim().length > 0, `Row ${i} has empty field: ${JSON.stringify(row)}`);
  }
  const [h, p, hv, vi] = row;
  assert.ok(!seen.has(h), `Trùng lặp trong HSK 3: ${h}`);
  assert.ok(!hsk1Set.has(h), `Trùng với HSK 1: ${h}`);
  assert.ok(!hsk2Set.has(h), `Trùng với HSK 2: ${h}`);
  seen.add(h);

  assert.ok(/^[a-zāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜüńňǹr ]+$/i.test(p), `Pinyin lạ trong ${h}: ${p}`);
  const tones = Core.syllables(p).map(Core.toneOf);
  assert.ok(tones.every(n => n >= 0 && n <= 4), `Thanh điệu lạ trong ${h}: ${p}`);
}

console.log("HSK 3 validation passed 100%! All 300 words unique, valid tones, no collisions.");
