import { GrammarNuance, GrammarStructure } from "../types";

export interface GrammarData {
  nuances: GrammarNuance[];
  structures: GrammarStructure[];
}

export const GRAMMAR_DATA: GrammarData = {
  "nuances": [
    {
      "id": "er_vs_liang",
      "title": "二 (èr) vs 两 (liǎng)",
      "category": "Từ dễ nhầm",
      "summary": "Đều là 'số 2', nhưng 二 dùng cho số đếm/thứ tự, 两 dùng trước lượng từ để chỉ số lượng.",
      "items": [
        {
          "word": "二 (èr)",
          "role": "Số thứ tự, số đếm, số điện thoại, phân số.",
          "formula": "二 + [số đếm / thứ tự / ngày tháng]",
          "examples": [
            {
              "hz": "一、二、三。",
              "py": "Yī, èr, sān.",
              "vi": "Một, hai, ba."
            },
            {
              "hz": "第二课。",
              "py": "Dì èr kè.",
              "vi": "Bài học thứ hai."
            },
            {
              "hz": "二月。",
              "py": "Èr yuè.",
              "vi": "Tháng Hai."
            }
          ]
        },
        {
          "word": "两 (liǎng)",
          "role": "Chỉ số lượng, luôn đứng trước LƯỢNG TỪ hoặc danh từ chỉ đơn vị đo.",
          "formula": "两 + Lượng từ + Danh từ",
          "examples": [
            {
              "hz": "两个人。",
              "py": "Liǎng gè rén.",
              "vi": "Hai người (không dùng 二个人)."
            },
            {
              "hz": "两本书。",
              "py": "Liǎng běn shū.",
              "vi": "Hai quyển sách."
            },
            {
              "hz": "两点。",
              "py": "Liǎng diǎn.",
              "vi": "Hai giờ (thời gian)."
            }
          ]
        }
      ],
      "quickTip": "Thấy có lượng từ (个, 本, 块, 点...) ➔ 99% dùng 两!"
    },
    {
      "id": "hui_neng_keyi",
      "title": "会 (huì) vs 能 (néng) vs 可以 (kěyǐ)",
      "category": "Động từ năng nguyện",
      "summary": "Cả 3 đều mang nghĩa 'có thể / biết', nhưng phân biệt rõ theo nguồn gốc năng lực.",
      "items": [
        {
          "word": "会 (huì)",
          "role": "Biết do HỌC TẬP, rèn luyện mà có kỹ năng.",
          "formula": "S + 会 + V",
          "examples": [
            {
              "hz": "我会说汉语。",
              "py": "Wǒ huì shuō hànyǔ.",
              "vi": "Tôi biết nói tiếng Trung (do tôi đã học)."
            },
            {
              "hz": "你会做饭吗？",
              "py": "Nǐ huì zuò fàn ma?",
              "vi": "Bạn biết nấu cơm không?"
            }
          ]
        },
        {
          "word": "能 (néng)",
          "role": "Năng lực tự nhiên hoặc ĐIỀU KIỆN hoàn cảnh cho phép làm được.",
          "formula": "S + 能 + V",
          "examples": [
            {
              "hz": "我今天感冒，不能去学校。",
              "py": "Wǒ jīntiān gǎnmào, bù néng qù xuéxiào.",
              "vi": "Hôm nay tôi bị cảm, không thể đi học (hoàn cảnh sức khỏe)."
            },
            {
              "hz": "他一分钟能游50米。",
              "py": "Tā yì fēnzhōng néng yóu 50 mǐ.",
              "vi": "Anh ấy một phút có thể bơi 50m (năng lực thể chất)."
            }
          ]
        },
        {
          "word": "可以 (kěyǐ)",
          "role": "Được phép, thỉnh cầu xin phép hoặc đưa ra đề xuất.",
          "formula": "S + 可以 + V / 可以...吗？",
          "examples": [
            {
              "hz": "我可以进来吗？",
              "py": "Wǒ kěyǐ jìnlái ma?",
              "vi": "Tôi có thể vào không? (xin phép lịch sự)."
            },
            {
              "hz": "这里可以拍照。",
              "py": "Zhèlǐ kěyǐ pāizhào.",
              "vi": "Ở đây được phép chụp ảnh."
            }
          ]
        }
      ],
      "quickTip": "Biết do học ➔ 会 | Điều kiện/sức khỏe ➔ 能 | Xin phép được làm ➔ 可以."
    },
    {
      "id": "yidianr_vs_youdianr",
      "title": "一点儿 (yīdiǎnr) vs 有点儿 (yǒudiǎnr)",
      "category": "Từ chỉ lượng & mức độ",
      "summary": "Phân biệt vị trí đứng trước hay sau tính từ và sắc thái cảm xúc tích cực/tiêu cực.",
      "items": [
        {
          "word": "一点儿 (yīdiǎnr)",
          "role": "Đứng SAU Tính từ (chỉ so sánh) hoặc TRƯỚC Danh từ (chỉ số lượng ít khách quan).",
          "formula": "Adj + 一点儿  |  一点儿 + Noun",
          "examples": [
            {
              "hz": "我想喝一点儿水。",
              "py": "Wǒ xiǎng hē yìdiǎnr shuǐ.",
              "vi": "Tôi muốn uống một chút nước."
            },
            {
              "hz": "请快一点儿！",
              "py": "Qǐng kuài yìdiǎnr!",
              "vi": "Xin hãy nhanh lên một chút (nhanh hơn)."
            }
          ]
        },
        {
          "word": "有点儿 (yǒudiǎnr)",
          "role": "Đứng TRƯỚC Tính từ/Động từ tâm lý, thường biểu thị sự KHÔNG VỪA Ý, tiêu cực, phàn nàn.",
          "formula": "有点儿 + Adj / V tâm lý (thường tiêu cực)",
          "examples": [
            {
              "hz": "今天有点儿冷。",
              "py": "Jīntiān yǒudiǎnr lěng.",
              "vi": "Hôm nay hơi lạnh (lạnh làm tôi khó chịu)."
            },
            {
              "hz": "这件衣服有点儿贵。",
              "py": "Zhè jiàn yīfu yǒudiǎnr guì.",
              "vi": "Bộ quần áo này hơi đắt (không thích mua)."
            }
          ]
        }
      ],
      "quickTip": "Phàn nàn khó chịu đứng trước Adj ➔ 有点儿 | Lượng nước/thức ăn đứng sau ➔ 一点儿."
    },
    {
      "id": "three_de",
      "title": "Bộ ba chữ 'Đích': 的 (de) · 得 (de) · 地 (de)",
      "category": "Trợ từ kết cấu",
      "summary": "3 chữ viết khác nhau hoàn toàn nhưng đều đọc là 'de' (thanh nhẹ). Là xương sống ngữ pháp tiếng Trung.",
      "items": [
        {
          "word": "的 (de) — Đích",
          "role": "Dùng trước DANH TỪ. Nối định ngữ với trung tâm ngữ (sở hữu, tính chất).",
          "formula": "Định ngữ (Ai / Cái gì) + 的 + Danh từ",
          "examples": [
            {
              "hz": "我的书包。",
              "py": "Wǒ de shūbāo.",
              "vi": "Cặp sách của tôi."
            },
            {
              "hz": "漂亮的衣服。",
              "py": "Piàoliang de yīfu.",
              "vi": "Quần áo đẹp."
            }
          ]
        },
        {
          "word": "得 (de) — Đắc",
          "role": "Dùng sau ĐỘNG TỪ hoặc TÍNH TỪ để dẫn ra Bổ ngữ chỉ trình độ/kết quả.",
          "formula": "Động từ + 得 + Bổ ngữ (trạng thái thế nào)",
          "examples": [
            {
              "hz": "跑得很快。",
              "py": "Pǎo de hěn kuài.",
              "vi": "Chạy rất nhanh (mức độ chạy)."
            },
            {
              "hz": "学得很好。",
              "py": "Xué de hěn hǎo.",
              "vi": "Học rất giỏi."
            }
          ]
        },
        {
          "word": "地 (de) — Địa",
          "role": "Dùng trước ĐỘNG TỪ để biến tính từ thành TRẠNG NGỮ (làm gì một cách như thế nào).",
          "formula": "Tính từ + 地 + Động từ",
          "examples": [
            {
              "hz": "高兴地笑。",
              "py": "Gāoxìng de xiào.",
              "vi": "Cười một cách vui vẻ."
            },
            {
              "hz": "认真地听。",
              "py": "Rènzhēn de tīng.",
              "vi": "Chăm chú lắng nghe."
            }
          ]
        }
      ],
      "quickTip": "Trước Danh từ dùng 的 | Sau Động từ chỉ trình độ dùng 得 | Trước Động từ làm trạng từ dùng 地."
    }
  ],
  "structures": [
    {
      "title": "Trật tự câu cơ bản trong tiếng Trung",
      "rule": "Khác tiếng Việt: Thời gian và Địa điểm luôn đứng TRƯỚC Động từ chính!",
      "formula": "[Chủ ngữ] + [Thời gian] + [Địa điểm] + [Động từ] + [Tân ngữ]",
      "example": "我明天在学校学习汉语。(Wǒ míngtiān zài xuéxiào xuéxí hànyǔ) ➔ 'Tôi ngày mai ở trường học tiếng Trung', KHÔNG nói 'Tôi học tiếng Trung ở trường ngày mai'."
    },
    {
      "title": "Câu vị ngữ Hình dung từ (Tính từ) — Tuyệt đối không dùng 是",
      "rule": "Khi muốn miêu tả tính chất (tốt, bận, đẹp), tiếng Trung dùng 很 (hěn) chứ không dùng 是 (shì).",
      "formula": "Chủ ngữ + 很 + Tính từ (không dùng 是)",
      "example": "我很好 (Tôi rất khỏe) ➔ Đúng!  |  我是好 ➔ Sai hoàn toàn!"
    },
    {
      "title": "Câu chữ 比 (bǐ) — So sánh hơn",
      "rule": "Muốn so sánh A hơn B ở một đặc điểm nào đó.",
      "formula": "A + 比 + B + Tính từ (+ Số lượng chênh lệch)",
      "example": "他比我大三岁。(Tā bǐ wǒ dà sān suì) ➔ Anh ấy lớn hơn tôi 3 tuổi."
    }
  ]
};
