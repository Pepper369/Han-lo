export interface DictationSentence {
  id: string;
  level: number;
  h: string;
  p: string;
  hv: string;
  vi: string;
}

export interface DiffCharToken {
  char: string;
  status: 'correct' | 'wrong' | 'pending' | 'extra';
  got: string;
}

export interface DiffResult {
  tokens: DiffCharToken[];
  isPerfect: boolean;
  score: number;
  correctCount: number;
  totalCount: number;
}

export const DICTATION_SENTENCES: DictationSentence[] = [
  // HSK 1
  { id: "s1", level: 1, h: "你好！", p: "nǐ hǎo", hv: "NHĨ HẢO", vi: "Xin chào!" },
  { id: "s2", level: 1, h: "谢谢你。", p: "xiè xie nǐ", hv: "TẠ TẠ NHĨ", vi: "Cảm ơn bạn." },
  { id: "s3", level: 1, h: "不客气。", p: "bú kè qi", hv: "BẤT KHÁCH KHÍ", vi: "Không có gì (đừng khách sáo)." },
  { id: "s4", level: 1, h: "对不起。", p: "duì bu qǐ", hv: "ĐỐI BẤT KHỞI", vi: "Xin lỗi." },
  { id: "s5", level: 1, h: "没关系。", p: "méi guān xi", hv: "MỘT QUAN HỆ", vi: "Không sao đâu." },
  { id: "s6", level: 1, h: "再见！", p: "zài jiàn", hv: "TÁI KIẾN", vi: "Tạm biệt!" },
  { id: "s7", level: 1, h: "你叫什么名字？", p: "nǐ jiào shén me míng zi", hv: "NHĨ KHIẾU THẬP MA MINH TỰ", vi: "Bạn tên là gì?" },
  { id: "s8", level: 1, h: "我是老师。", p: "wǒ shì lǎo shī", hv: "NGÃ THỊ LÃO SƯ", vi: "Tôi là giáo viên." },
  { id: "s9", level: 1, h: "他是我的同学。", p: "tā shì wǒ de tóng xué", hv: "THA THỊ NGÃ ĐÍCH ĐỒNG HỌC", vi: "Cậu ấy là bạn học của tôi." },
  { id: "s10", level: 1, h: "你喝水吗？", p: "nǐ hē shuǐ ma", hv: "NHĨ HÁT THỦY MA", vi: "Bạn uống nước không?" },
  { id: "s11", level: 1, h: "我想吃米饭。", p: "wǒ xiǎng chī mǐ fàn", hv: "NGÃ TƯỞNG NGẪN MỄ PHẠN", vi: "Tôi muốn ăn cơm trắng." },
  { id: "s12", level: 1, h: "今天天气怎么样？", p: "jīn tiān tiān qì zěn me yàng", hv: "KIM THIÊN THIÊN KHÍ CHẨM MA DẠNG", vi: "Hôm nay thời tiết thế nào?" },
  { id: "s13", level: 1, h: "今天很冷。", p: "jīn tiān hěn lěng", hv: "KIM THIÊN HẨN LÃNH", vi: "Hôm nay rất lạnh." },
  { id: "s14", level: 1, h: "现在几点？", p: "xiàn zài jǐ diǎn", hv: "HIỆN TẠI KỶ ĐIỂM", vi: "Bây giờ là mấy giờ?" },
  { id: "s15", level: 1, h: "他在医院工作。", p: "tā zài yī yuàn gōng zuò", hv: "THA TẠI Y VIỆN CÔNG TÁC", vi: "Anh ấy làm việc ở bệnh viện." },
  { id: "s16", level: 1, h: "这个苹果多少钱？", p: "zhè ge píng guǒ duō shao qián", hv: "GIÁ CÁ BÌNH QUẢ ĐA THIẾU TIỀN", vi: "Quả táo này bao nhiêu tiền?" },
  { id: "s17", level: 1, h: "你会说汉语吗？", p: "nǐ huì shuō hàn yǔ ma", hv: "NHĨ HỘI THUYẾT HÁN NGỮ MA", vi: "Bạn biết nói tiếng Trung không?" },
  { id: "s18", level: 1, h: "我不会写汉字。", p: "wǒ bú huì xiě hàn zì", hv: "NGÃ BẤT HỘI TẢ HÁN TỰ", vi: "Tôi không biết viết chữ Hán." },
  { id: "s19", level: 1, h: "我的猫在桌子下面。", p: "wǒ de māo zài zhuō zi xià mian", hv: "NGÃ ĐÍCH MIÊU TẠI TRÁC TỬ HẠ DIỆN", vi: "Con mèo của tôi ở dưới bàn." },
  { id: "s20", level: 1, h: "明天星期几？", p: "míng tiān xīng qī jǐ", hv: "MINH THIÊN TINH KỲ KỶ", vi: "Ngày mai là thứ mấy?" },
  // HSK 2
  { id: "s21", level: 2, h: "很高兴认识你。", p: "hěn gāo xìng rèn shi nǐ", hv: "HẨN CAO HỨNG NHẬN THỨC NHĨ", vi: "Rất vui được quen biết bạn." },
  { id: "s22", level: 2, h: "今天比昨天热。", p: "jīn tiān bǐ zuó tiān rè", hv: "KIM THIÊN BỈ TÁC THIÊN NHIỆT", vi: "Hôm nay nóng hơn hôm qua." },
  { id: "s23", level: 2, h: "这件衣服太贵了。", p: "zhè jiàn yī fu tài guì le", hv: "GIÁ KIỆN Y PHỤC THÁI QUÝ LIỄU", vi: "Bộ quần áo này đắt quá." },
  { id: "s24", level: 2, h: "我们一起去运动吧。", p: "wǒ men yì qǐ qù yùn dòng ba", hv: "NGÃ MÔN NHẤT KHỞI KHỨ VẬN ĐỘNG BA", vi: "Chúng ta cùng đi tập thể dục đi." },
  { id: "s25", level: 2, h: "欢迎你来我家玩儿。", p: "huān yíng nǐ lái wǒ jiā wánr", hv: "HOAN NGHÊNH NHĨ LAI NGÃ GIA NGOẠN NHI", vi: "Hoan nghênh bạn đến nhà tôi chơi." },
  { id: "s26", level: 2, h: "别说话，请听老师讲。", p: "bié shuō huà qǐng tīng lǎo shī jiǎng", hv: "BIỆT THUYẾT THOẠI THỈNH THÍNH LÃO SƯ GIẢNG", vi: "Đừng nói chuyện, xin hãy nghe cô giáo giảng." },
  { id: "s27", level: 2, h: "火车站离这里不远。", p: "huǒ chē zhàn lí zhè lǐ bù yuǎn", hv: "HỎA XA TRẠM LY GIÁ LÝ BẤT VIỄN", vi: "Ga xe lửa cách đây không xa." },
  { id: "s28", level: 2, h: "我每天早上跑半个小时步。", p: "wǒ měi tiān zǎo shang pǎo bàn gè xiǎo shí bù", hv: "NGÃ MỖI THIÊN TẢO THƯỢNG BÀO BÁN CÁ TIỂU THỜI BỘ", vi: "Mỗi sáng tôi đều chạy bộ nửa tiếng." },
  { id: "s29", level: 2, h: "请等一下，他马上来。", p: "qǐng děng yí xià tā mǎ shàng lái", hv: "THỈNH ĐẲNG NHẤT HẠ THA MÃ THƯỢNG LAI", vi: "Xin đợi một chút, anh ấy tới ngay." },
  { id: "s30", level: 2, h: "你可以帮我一下吗？", p: "nǐ kě yǐ bāng wǒ yí xià ma", hv: "NHĨ KHẢ DĨ BANG NGÃ NHẤT HẠ MA", vi: "Bạn có thể giúp tôi một chút không?" },
  // HSK 3
  { id: "s31", level: 3, h: "虽然天气不好，但是我们还是去了。", p: "suī rán tiān qì bù hǎo dàn shì wǒ men hái shì qù le", hv: "TUY NHIÊN THIÊN KHÍ BẤT HẢO ĐÃN THỊ NGÃ MÔN HOÀN THỊ KHỨ LIỄU", vi: "Tuy thời tiết không tốt, nhưng chúng tôi vẫn đi." },
  { id: "s32", level: 3, h: "不仅学汉语，他还学画画。", p: "bù jǐn xué hàn yǔ tā hái xué huà huà", hv: "BẤT CẬN HỌC HÁN NGỮ THA HOÀN HỌC HỌA HỌA", vi: "Không chỉ học tiếng Trung, anh ấy còn học vẽ tranh." },
  { id: "s33", level: 3, h: "如果你有时间，请给我打电话。", p: "rú guǒ nǐ yǒu shí jiān qǐng gěi wǒ dǎ diàn huà", hv: "NHƯ QUẢ NHĨ HỮU THỜI GIAN THỈNH CẤP NGÃ ĐẢ ĐIỆN THOẠI", vi: "Nếu bạn có thời gian, xin hãy gọi điện cho tôi." },
  { id: "s34", level: 3, h: "我对中国历史很感兴趣。", p: "wǒ duì zhōng guó lì shǐ hěn gǎn xìng qù", hv: "NGÃ ĐỐI TRUNG QUỐC LỊCH SỬ HẨN CẢM HƯNG THÚ", vi: "Tôi rất có hứng thú với lịch sử Trung Quốc." },
  { id: "s35", level: 3, h: "为了健康，他坚持每天锻炼。", p: "wèi le jiàn kāng tā jiān chí měi tiān duàn liàn", hv: "VỊ LIỄU KIỆN KHANG THA KIÊN TRÌ MỖI THIÊN ĐOÁN LUYỆN", vi: "Vì sức khỏe, anh ấy kiên trì rèn luyện mỗi ngày." }
];

export function stripPinyinTones(p: string): string {
  if (!p) return "";
  const map: Record<string, string> = {
    ā: "a", á: "a", ǎ: "a", à: "a",
    ē: "e", é: "e", ě: "e", è: "e",
    ī: "i", í: "i", ǐ: "i", ì: "i",
    ō: "o", ó: "o", ǒ: "o", ò: "o",
    ū: "u", ú: "u", ǔ: "u", ù: "u",
    ǖ: "v", ǘ: "v", ǚ: "v", ǜ: "v", ü: "v"
  };
  return p
    .toLowerCase()
    .replace(/[āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜü]/g, (m) => map[m] || m)
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function diffChars(input: string, target: string): DiffResult {
  const inChars = Array.from(String(input || "").trim().replace(/[.,!?;:，。！？\s]/g, ""));
  const tgtChars = Array.from(String(target || "").trim().replace(/[.,!?;:，。！？\s]/g, ""));
  const result: DiffCharToken[] = [];

  for (let i = 0; i < tgtChars.length; i++) {
    const exp = tgtChars[i];
    const got = inChars[i];
    if (got === undefined) {
      result.push({ char: exp, status: "pending", got: "" });
    } else if (got === exp) {
      result.push({ char: exp, status: "correct", got: got });
    } else {
      result.push({ char: exp, status: "wrong", got: got });
    }
  }

  for (let j = tgtChars.length; j < inChars.length; j++) {
    result.push({ char: inChars[j], status: "extra", got: inChars[j] });
  }

  const correctCount = result.filter((r) => r.status === "correct").length;
  const isPerfect = inChars.length === tgtChars.length && correctCount === tgtChars.length;
  const score = tgtChars.length > 0 ? Math.round((correctCount / tgtChars.length) * 100) : 0;

  return {
    tokens: result,
    isPerfect,
    score,
    correctCount,
    totalCount: tgtChars.length
  };
}

export function diffPinyin(input: string, targetPinyin: string): DiffResult {
  const inClean = stripPinyinTones(input);
  const tgtClean = stripPinyinTones(targetPinyin);
  const inSyllables = inClean.split(/\s+/).filter(Boolean);
  const tgtSyllables = tgtClean.split(/\s+/).filter(Boolean);
  const tokens: DiffCharToken[] = [];

  for (let i = 0; i < tgtSyllables.length; i++) {
    const exp = tgtSyllables[i];
    const got = inSyllables[i];
    if (got === undefined) {
      tokens.push({ char: exp, status: "pending", got: "" });
    } else if (got === exp) {
      tokens.push({ char: exp, status: "correct", got: got });
    } else {
      tokens.push({ char: exp, status: "wrong", got: got });
    }
  }

  for (let j = tgtSyllables.length; j < inSyllables.length; j++) {
    tokens.push({ char: inSyllables[j], status: "extra", got: inSyllables[j] });
  }

  const correctCount = tokens.filter((t) => t.status === "correct").length;
  const isPerfect = inSyllables.length === tgtSyllables.length && correctCount === tgtSyllables.length;
  const score = tgtSyllables.length > 0 ? Math.round((correctCount / tgtSyllables.length) * 100) : 0;

  return {
    tokens,
    isPerfect,
    score,
    correctCount,
    totalCount: tgtSyllables.length
  };
}
