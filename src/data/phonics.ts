import { ToneItem, InitialItem, FinalItem, PhonicsRule, BasicStroke } from "../types";

export interface PinyinData {
  tones: ToneItem[];
  initials: InitialItem[];
  finals: FinalItem[];
  rules: PhonicsRule[];
  basicStrokes: BasicStroke[];
}

export const PINYIN_DATA: PinyinData = {
  "tones": [
    {
      "tone": 1,
      "name": "Thanh 1 (Âm Bình)",
      "mark": "ā",
      "pitch": "5-5 (Cao phẳng)",
      "desc": "Cao độ giữ ổn định ở mức 5 (mức cao nhất). Giọng kéo dài, đều và vang, không lên không xuống.",
      "tipViet": "Giống như nốt nhạc ngân cao bằng phẳng, cao hơn thanh không của tiếng Việt.",
      "exampleHz": "妈",
      "examplePy": "mā",
      "exampleVi": "Mẹ",
      "curvePath": "M 10 20 L 90 20"
    },
    {
      "tone": 2,
      "name": "Thanh 2 (Dương Bình)",
      "mark": "á",
      "pitch": "3-5 (Vút lên)",
      "desc": "Bắt đầu từ độ cao trung bình (mức 3) rồi vút nhanh lên đỉnh (mức 5).",
      "tipViet": "Gần giống dấu sắc trong tiếng Việt nhưng âm vút từ trung bình lên dứt khoát.",
      "exampleHz": "麻",
      "examplePy": "má",
      "exampleVi": "Cây gai / Tê",
      "curvePath": "M 10 70 Q 50 45 90 20"
    },
    {
      "tone": 3,
      "name": "Thanh 3 (Thượng Thanh)",
      "mark": "ǎ",
      "pitch": "2-1-4 (Trầm - Lượn lên)",
      "desc": "Hạ từ mức 2 xuống đáy mức 1 (rất trầm) rồi lượn nhẹ lên mức 4 khi đọc đứng một mình.",
      "tipViet": "Gần giống dấu hỏi tiếng Việt nhưng xuống trầm sâu hơn trước khi bật nhẹ lên.",
      "exampleHz": "马",
      "examplePy": "mǎ",
      "exampleVi": "Ngựa",
      "curvePath": "M 10 50 Q 45 90 90 35"
    },
    {
      "tone": 4,
      "name": "Thanh 4 (Khứ Thanh)",
      "mark": "à",
      "pitch": "5-1 (Rơi dứt khoát)",
      "desc": "Rơi thẳng từ đỉnh mức 5 xuống tận đáy mức 1 một cách nhanh, mạnh và dứt khoát.",
      "tipViet": "Người Việt hay nhầm với dấu huyền. Phải dứt khoát và ngắn, như một cú hạ lệnh.",
      "exampleHz": "骂",
      "examplePy": "mà",
      "exampleVi": "Mắng",
      "curvePath": "M 10 20 L 90 85"
    },
    {
      "tone": 0,
      "name": "Thanh nhẹ (Khinh Thanh)",
      "mark": "a",
      "pitch": "Ngắn, nhẹ",
      "desc": "Không đánh dấu thanh. Phát âm ngắn và nhẹ hơn các âm tiết có thanh điệu.",
      "tipViet": "Đọc thật nhẹ, buông lỏng hơi.",
      "exampleHz": "吗",
      "examplePy": "ma",
      "exampleVi": "Không? (trợ từ nghi vấn)",
      "curvePath": "M 45 50 A 5 5 0 1 1 55 50"
    }
  ],
  "initials": [
    {
      "py": "b",
      "ipa": "[p]",
      "tip": "Âm môi: Giống 'p' tiếng Việt nhưng không bật hơi (đọc như 'bô').",
      "ex": "爸爸 (bàba)"
    },
    {
      "py": "p",
      "ipa": "[pʰ]",
      "tip": "Âm môi: Giống 'p' nhưng bật hơi thật mạnh qua hai môi.",
      "ex": "朋友 (péngyou)"
    },
    {
      "py": "m",
      "ipa": "[m]",
      "tip": "Âm môi: Giống 'm' trong tiếng Việt ('mẹ').",
      "ex": "妈妈 (māma)"
    },
    {
      "py": "f",
      "ipa": "[f]",
      "tip": "Âm môi răng: Giống 'ph' trong tiếng Việt ('phở').",
      "ex": "飞机 (fēijī)"
    },
    {
      "py": "d",
      "ipa": "[t]",
      "tip": "Âm đầu lưỡi: Giống 't' tiếng Việt không bật hơi.",
      "ex": "大 (dà)"
    },
    {
      "py": "t",
      "ipa": "[tʰ]",
      "tip": "Âm đầu lưỡi: Bật hơi mạnh, giống 'th' tiếng Việt.",
      "ex": "天气 (tiānqì)"
    },
    {
      "py": "n",
      "ipa": "[n]",
      "tip": "Âm đầu lưỡi: Giống 'n' tiếng Việt.",
      "ex": "你 (nǐ)"
    },
    {
      "py": "l",
      "ipa": "[l]",
      "tip": "Âm đầu lưỡi: Giống 'l' tiếng Việt.",
      "ex": "老师 (lǎoshī)"
    },
    {
      "py": "g",
      "ipa": "[k]",
      "tip": "Âm gốc lưỡi: Giống 'c/k' tiếng Việt không bật hơi.",
      "ex": "高 (gāo)"
    },
    {
      "py": "k",
      "ipa": "[kʰ]",
      "tip": "Âm gốc lưỡi: Bật hơi mạnh từ cuống họng, giống 'kh'.",
      "ex": "看 (kàn)"
    },
    {
      "py": "h",
      "ipa": "[x]",
      "tip": "Âm gốc lưỡi: Lai giữa 'h' và 'kh' tiếng Việt.",
      "ex": "好 (hǎo)"
    },
    {
      "py": "j",
      "ipa": "[tɕ]",
      "tip": "Âm mặt lưỡi: Gần giống 'ch' nhẹ, mặt lưỡi áp ngạc cứng.",
      "ex": "家 (jiā)"
    },
    {
      "py": "q",
      "ipa": "[tɕʰ]",
      "tip": "Âm mặt lưỡi: Giống 'j' nhưng bật hơi cực mạnh.",
      "ex": "去 (qù)"
    },
    {
      "py": "x",
      "ipa": "[ɕ]",
      "tip": "Âm mặt lưỡi: Giống 'x' tiếng Việt nhưng mềm và xuýt nhẹ.",
      "ex": "想 (xiǎng)"
    },
    {
      "py": "zh",
      "ipa": "[ʈʂ]",
      "tip": "Âm uốn lưỡi: Uốn cong đầu lưỡi lên ngạc cứng, không bật hơi.",
      "ex": "中国 (zhōngguó)"
    },
    {
      "py": "ch",
      "ipa": "[ʈʂʰ]",
      "tip": "Âm uốn lưỡi: Vị trí như 'zh' nhưng bật hơi thật mạnh.",
      "ex": "吃 (chī)"
    },
    {
      "py": "sh",
      "ipa": "[ʂ]",
      "tip": "Âm uốn lưỡi: Giống 's' miền Nam uốn lưỡi thật sâu.",
      "ex": "水 (shuǐ)"
    },
    {
      "py": "r",
      "ipa": "[ʐ]",
      "tip": "Âm uốn lưỡi: Gần giống 'r' nhưng rung nhẹ ngạc cứng.",
      "ex": "热 (rè)"
    },
    {
      "py": "z",
      "ipa": "[ts]",
      "tip": "Âm đầu lưỡi trước: Ép đầu lưỡi vào răng trên rồi nhả ra nhẹ.",
      "ex": "在 (zài)"
    },
    {
      "py": "c",
      "ipa": "[tsʰ]",
      "tip": "Âm đầu lưỡi trước: Vị trí như 'z' nhưng bật hơi cực mạnh.",
      "ex": "菜 (cài)"
    },
    {
      "py": "s",
      "ipa": "[s]",
      "tip": "Âm đầu lưỡi trước: Giống 'x' tiếng Việt ('xe').",
      "ex": "岁 (suì)"
    },
    {
      "py": "y",
      "ipa": "[j]",
      "tip": "Bán nguyên âm: Khởi âm bằng 'i'.",
      "ex": "月 (yuè)"
    },
    {
      "py": "w",
      "ipa": "[w]",
      "tip": "Bán nguyên âm: Khởi âm bằng 'u'.",
      "ex": "我 (wǒ)"
    }
  ],
  "finals": [
    {
      "py": "a",
      "tip": "Đơn: Đọc như 'a' tiếng Việt, mở rộng miệng.",
      "ex": "八 (bā)"
    },
    {
      "py": "o",
      "tip": "Đơn: Đọc tròn môi, hơi lai giữa 'ô' và 'ua'.",
      "ex": "多 (duō)"
    },
    {
      "py": "e",
      "tip": "Đơn: Đọc như 'ơ' dẹt miệng, thả lỏng lưỡi.",
      "ex": "喝 (hē)"
    },
    {
      "py": "i",
      "tip": "Đơn: Đọc như 'i' tiếng Việt (sau zh,ch,sh,r,z,c,s đọc là 'ư').",
      "ex": "米 (mǐ)"
    },
    {
      "py": "u",
      "tip": "Đơn: Đọc như 'u' tiếng Việt, môi chu tròn nhỏ.",
      "ex": "不 (bù)"
    },
    {
      "py": "ü",
      "tip": "Đơn: Giữ nguyên môi tròn như huýt sáo rồi phát âm 'uy'.",
      "ex": "雨 (yǔ)"
    },
    {
      "py": "ai",
      "tip": "Kép: Bắt đầu từ 'a' trượt nhanh sang 'i'.",
      "ex": "爱 (ài)"
    },
    {
      "py": "ei",
      "tip": "Kép: Bắt đầu từ 'e' trượt sang 'i', giống 'ây'.",
      "ex": "杯 (bēi)"
    },
    {
      "py": "ao",
      "tip": "Kép: Bắt đầu từ 'a' trượt sang 'o', giống 'ao'.",
      "ex": "包 (bāo)"
    },
    {
      "py": "ou",
      "tip": "Kép: Bắt đầu từ 'o' trượt sang 'u', giống 'âu'.",
      "ex": "狗 (gǒu)"
    },
    {
      "py": "ia",
      "tip": "Kép: 'i' trượt nhanh sang 'a', giống 'ia'.",
      "ex": "家 (jiā)"
    },
    {
      "py": "ie",
      "tip": "Kép: 'i' trượt sang 'ê', giống 'iê'.",
      "ex": "谢 (xiè)"
    },
    {
      "py": "ua",
      "tip": "Kép: 'u' trượt nhanh sang 'a', giống 'oa'.",
      "ex": "画 (huà)"
    },
    {
      "py": "uo",
      "tip": "Kép: 'u' trượt sang 'o', giống 'ua/uô'.",
      "ex": "过 (guò)"
    },
    {
      "py": "üe",
      "tip": "Kép: 'ü' trượt sang 'ê', giống 'uyê'.",
      "ex": "月 (yuè)"
    },
    {
      "py": "iao",
      "tip": "Kép: 'i' kết hợp 'ao', giống 'ieo'.",
      "ex": "小 (xiǎo)"
    },
    {
      "py": "iu",
      "tip": "Kép: (iou) 'i' kết hợp 'ou', giống 'iêu'.",
      "ex": "九 (jiǔ)"
    },
    {
      "py": "uai",
      "tip": "Kép: 'u' kết hợp 'ai', giống 'oai'.",
      "ex": "快 (kuài)"
    },
    {
      "py": "ui",
      "tip": "Kép: (uei) 'u' kết hợp 'ei', giống 'uây'.",
      "ex": "对 (duì)"
    },
    {
      "py": "an",
      "tip": "Mũi trước: 'a' kết hợp 'n', giống 'an'.",
      "ex": "看 (kàn)"
    },
    {
      "py": "en",
      "tip": "Mũi trước: 'e' kết hợp 'n', giống 'ân'.",
      "ex": "门 (mén)"
    },
    {
      "py": "in",
      "tip": "Mũi trước: 'i' kết hợp 'n', giống 'in'.",
      "ex": "心 (xīn)"
    },
    {
      "py": "ün",
      "tip": "Mũi trước: 'ü' kết hợp 'n', giống 'uyn'.",
      "ex": "云 (yún)"
    },
    {
      "py": "ian",
      "tip": "Mũi trước: 'i' kết hợp 'an', giống 'iên'.",
      "ex": "前 (qián)"
    },
    {
      "py": "uan",
      "tip": "Mũi trước: 'u' kết hợp 'an', giống 'oan'.",
      "ex": "关 (guān)"
    },
    {
      "py": "üan",
      "tip": "Mũi trước: 'ü' kết hợp 'an', giống 'uyên'.",
      "ex": "元 (yuán)"
    },
    {
      "py": "un",
      "tip": "Mũi trước: (uen) 'u' kết hợp 'en', giống 'uân'.",
      "ex": "春 (chūn)"
    },
    {
      "py": "ang",
      "tip": "Mũi sau: 'a' kết hợp 'ng', mở to miệng.",
      "ex": "帮 (bāng)"
    },
    {
      "py": "eng",
      "tip": "Mũi sau: 'e' kết hợp 'ng', giống 'âng'.",
      "ex": "冷 (lěng)"
    },
    {
      "py": "ing",
      "tip": "Mũi sau: 'i' kết hợp 'ng', giống 'inh'.",
      "ex": "明 (míng)"
    },
    {
      "py": "ong",
      "tip": "Mũi sau: 'o' kết hợp 'ng', giống 'ung'.",
      "ex": "中 (zhōng)"
    },
    {
      "py": "iang",
      "tip": "Mũi sau: 'i' kết hợp 'ang', giống 'iang'.",
      "ex": "想 (xiǎng)"
    },
    {
      "py": "iong",
      "tip": "Mũi sau: 'i' kết hợp 'ong', giống 'iung'.",
      "ex": "用 (yòng)"
    },
    {
      "py": "uang",
      "tip": "Mũi sau: 'u' kết hợp 'ang', giống 'oang'.",
      "ex": "黄 (huáng)"
    },
    {
      "py": "ueng",
      "tip": "Mũi sau: 'u' kết hợp 'eng', đứng đầu chữ đọc weng.",
      "ex": "翁 (wēng)"
    },
    {
      "py": "er",
      "tip": "Uốn lưỡi: Âm 'ơ' đồng thời uốn cong đầu lưỡi lên vòm họng.",
      "ex": "二 (èr)"
    }
  ],
  "rules": [
    {
      "title": "Quy tắc 2 thanh 3 đi liền nhau (3 + 3 ➔ 2 + 3)",
      "rule": "Khi hai âm tiết mang thanh 3 đứng cạnh nhau, âm tiết đầu đổi thành thanh 2.",
      "example": "你好 (nǐ hǎo) ➔ Đọc là: [ní hǎo]. Có thể viết vẫn giữ nǐ hǎo."
    },
    {
      "title": "Biến điệu của chữ 不 (bù)",
      "rule": "Bình thường đọc là bù (thanh 4). Nếu đứng trước một từ thanh 4 khác, 不 đổi thành bú (thanh 2).",
      "example": "不是 (bù shì) ➔ Đọc là: [bú shì]; 不要 (bù yào) ➔ [bú yào]."
    },
    {
      "title": "Biến điệu của chữ 一 (yī)",
      "rule": "Đứng một mình đọc là yī. Đứng trước thanh 4 đổi thành yí (thanh 2). Đứng trước thanh 1, 2, 3 đổi thành yì (thanh 4).",
      "example": "一个 (yī gè) ➔ [yí gè]; 一天 (yī tiān) ➔ [yì tiān]; 一起 (yī qǐ) ➔ [yì qǐ]."
    }
  ],
  "basicStrokes": [
    {
      "name": "Nét Chấm (点)",
      "zh": "点 diǎn",
      "symbol": "丶",
      "direction": "Chấm từ trên nhẹ xuống dưới sang phải đậm dần rồi thu bút",
      "tip": "Như giọt nước rơi hoặc tảng đá rơi từ trên cao",
      "examples": [
        "六",
        "主",
        "方",
        "门",
        "字"
      ],
      "strokeChar": "丶"
    },
    {
      "name": "Nét Ngang (横)",
      "zh": "横 héng",
      "symbol": "一",
      "direction": "Từ trái sang phải, hơi chếch nhẹ lên 3-5 độ, đuôi nhấn nhẹ thu bút",
      "tip": "Đặt bút nhẹ, đi ngang đều tay, đuôi nét hơi nhấn dừng",
      "examples": [
        "一",
        "二",
        "三",
        "十",
        "大"
      ],
      "strokeChar": "一"
    },
    {
      "name": "Nét Sổ (竖)",
      "zh": "竖 shù",
      "symbol": "丨",
      "direction": "Từ trên thẳng đứng xuống dưới (sổ kim vuốt nhọn hoặc sổ huyền tròn đuôi)",
      "tip": "Thẳng đứng như cột nhà, vững chãi không xiên vẹo",
      "examples": [
        "十",
        "中",
        "木",
        "日",
        "山"
      ],
      "strokeChar": "丨"
    },
    {
      "name": "Nét Phẩy (撇)",
      "zh": "撇 piě",
      "symbol": "丿",
      "direction": "Từ trên cao chếch cong sang trái, đầu đậm đuôi vuốt nhọn dần",
      "tip": "Lướt như chiếc lá rơi, cong mềm thanh thoát",
      "examples": [
        "八",
        "人",
        "大",
        "月",
        "白"
      ],
      "strokeChar": "丿"
    },
    {
      "name": "Nét Mác (捺)",
      "zh": "捺 nà",
      "symbol": "㇏",
      "direction": "Từ trên lượn nghiêng sang phải, càng xuống càng đậm, cuối nét bẹt rồi vuốt nhọn sang ngang",
      "tip": "Nét chân trụ vững chãi, đuôi nét có gót chân bẹt nhẹ",
      "examples": [
        "人",
        "大",
        "天",
        "文",
        "水"
      ],
      "strokeChar": "人"
    },
    {
      "name": "Nét Hất (提)",
      "zh": "提 tí",
      "symbol": "㇀",
      "direction": "Từ dưới sang phải chếch lên, đặt bút đậm, hất nhanh và vuốt nhọn lên trên",
      "tip": "Hất dứt khoát từ trái dưới lên phải trên",
      "examples": [
        "地",
        "冷",
        "我",
        "江",
        "习"
      ],
      "strokeChar": "习"
    },
    {
      "name": "Nét Gập (折)",
      "zh": "折 zhé",
      "symbol": "𠃍",
      "direction": "Đang đi ngang hoặc sổ thì nhấn góc dừng lại rồi chuyển hướng vuông góc",
      "tip": "Góc gập vuông vức, có lực nhấn tại góc cua",
      "examples": [
        "口",
        "日",
        "四",
        "五",
        "田"
      ],
      "strokeChar": "口"
    },
    {
      "name": "Nét Móc (钩)",
      "zh": "钩 gōu",
      "symbol": "亅",
      "direction": "Đi nét sổ/ngang/nghiêng đến cuối thì dừng nhấn rồi móc nhọn nhanh ra ngoài",
      "tip": "Móc nhọn dứt khoát như lưỡi câu",
      "examples": [
        "小",
        "水",
        "你",
        "了",
        "于"
      ],
      "strokeChar": "小"
    }
  ]
};
