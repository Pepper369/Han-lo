const fs = require("fs");
const HSK1 = require("../data.js");
const HSK2 = HSK1.HSK2;
const s1 = new Set(HSK1.map(x => x[0]));
const s2 = new Set(HSK2.map(x => x[0]));
let HSK3 = require("../hsk3-data.js");

let filtered = HSK3.filter(w => !s1.has(w[0]) && !s2.has(w[0])).slice(0, 300);
console.log("Filtered count:", filtered.length);

const rows = filtered.map(r => JSON.stringify(r)).join(",\n  ");
const content = `/* HSK 3 (HSK 3.0) — 300 từ vựng cốt lõi chuẩn đề cương HSK 3.0.
   Trường: [chữ Hán, pinyin (theo âm tiết), âm Hán–Việt, nghĩa tiếng Việt] */
const HSK3 = [
  ${rows}
];

if (typeof window !== "undefined") {
  window.HSK3 = HSK3;
}
if (typeof module !== "undefined") {
  module.exports = HSK3;
}
`;

fs.writeFileSync("hsk3-data.js", content, "utf8");
console.log("Written 300 words successfully to hsk3-data.js");
