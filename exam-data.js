/* Ngân hàng đề thi thử HSK 1 chuẩn quốc tế (HSK 3.0 / CTI).
   Đúng cấu trúc 40 câu: 20 câu Nghe hiểu (听力) + 20 câu Đọc hiểu (阅读).
   Thang điểm: 200 điểm (Nghe 100đ + Đọc 100đ). Điểm đỗ: 120/200 (60%). */

const HSK1_EXAM_PRACTICE = {
  id: "hsk1_mock_01",
  title: "Đề Thi Thử HSK 1 — Đề Số 1",
  durationMinutes: 35,
  passingScore: 120,
  totalScore: 200,
  listeningCount: 20,
  readingCount: 20,
  questions: [
    /* ================= PHẦN 1: NGHE HIỂU (听力) - CÂU 1 -> 20 ================= */

    // Phần 1.1: Nghe từ/câu ngắn, xem hình/nghĩa, phán đoán Đúng/Sai (Câu 1-5)
    {
      id: 1, section: "listening", part: 1, type: "judge",
      audio: "苹果。",
      prompt: "苹果", pinyin: "píngguǒ",
      meaningPrompt: "Quả táo",
      correct: true,
      explanation: "Phát âm 'píngguǒ' nghĩa là quả táo, khớp hoàn toàn với nội dung."
    },
    {
      id: 2, section: "listening", part: 1, type: "judge",
      audio: "他在睡觉。",
      prompt: "他在看书", pinyin: "tā zài kàn shū",
      meaningPrompt: "Anh ấy đang đọc sách",
      correct: false,
      explanation: "Âm thanh phát âm là '睡觉' (ngủ), trong khi câu hiển thị là '看书' (đọc sách) -> Sai."
    },
    {
      id: 3, section: "listening", part: 1, type: "judge",
      audio: "喝茶。",
      prompt: "喝茶", pinyin: "hē chá",
      meaningPrompt: "Uống trà",
      correct: true,
      explanation: "Âm thanh đọc 'hē chá' nghĩa là uống trà, khớp với nội dung."
    },
    {
      id: 4, section: "listening", part: 1, type: "judge",
      audio: "飞机。",
      prompt: "出租车", pinyin: "chūzūchē",
      meaningPrompt: "Xe taxi",
      correct: false,
      explanation: "Âm thanh phát âm là '飞机' (máy bay), trong khi câu hiển thị là '出租车' (taxi) -> Sai."
    },
    {
      id: 5, section: "listening", part: 1, type: "judge",
      audio: "现在是下午三点。",
      prompt: "下午三点", pinyin: "xiàwǔ sān diǎn",
      meaningPrompt: "3 giờ chiều",
      correct: true,
      explanation: "Âm thanh đọc 'xiàwǔ sān diǎn' nghĩa là 3 giờ chiều, khớp hoàn toàn."
    },

    // Phần 1.2: Nghe câu ngắn, chọn 1 trong 3 đáp án (Câu 6-10)
    {
      id: 6, section: "listening", part: 2, type: "choice",
      audio: "我想买一个新杯子。",
      question: "Người nói muốn mua gì?",
      options: ["A. 杯子 (Cái cốc)", "B. 衣服 (Quần áo)", "C. 书 (Sách)"],
      correct: 0,
      explanation: "Người nói nói '买一个新杯子' (mua một cái cốc mới) -> Chọn A."
    },
    {
      id: 7, section: "listening", part: 2, type: "choice",
      audio: "今天天气很冷，外面在下雨。",
      question: "Hôm nay thời tiết thế nào?",
      options: ["A. 很热 (Rất nóng)", "B. 在下雪 (Đang rơi tuyết)", "C. 在下雨 (Đang mưa)"],
      correct: 2,
      explanation: "Người nói nói '外面在下雨' (bên ngoài đang mưa) -> Chọn C."
    },
    {
      id: 8, section: "listening", part: 2, type: "choice",
      audio: "我爸爸是医生，他在医院工作。",
      question: "Bố người nói làm nghề gì?",
      options: ["A. 老师 (Thầy giáo)", "B. 医生 (Bác sĩ)", "C. 学生 (Học sinh)"],
      correct: 1,
      explanation: "Người nói nói '我爸爸是医生' (Bố tôi là bác sĩ) -> Chọn B."
    },
    {
      id: 9, section: "listening", part: 2, type: "choice",
      audio: "桌子上有五本书。",
      question: "Trên bàn có bao nhiêu quyển sách?",
      options: ["A. 三本 (3 quyển)", "B. 四本 (4 quyển)", "C. 五本 (5 quyển)"],
      correct: 2,
      explanation: "Người nói nói '有五本书' (có 5 quyển sách) -> Chọn C."
    },
    {
      id: 10, section: "listening", part: 2, type: "choice",
      audio: "我和我朋友在饭店吃米饭。",
      question: "Họ đang ăn ở đâu?",
      options: ["A. 饭店 (Nhà hàng)", "B. 学校 (Trường học)", "C. 家里 (Ở nhà)"],
      correct: 0,
      explanation: "Người nói nói '在饭店吃米饭' (ăn cơm ở nhà hàng) -> Chọn A."
    },

    // Phần 1.3: Nghe đối thoại ngắn 2 người, chọn đáp án đúng (Câu 11-15)
    {
      id: 11, section: "listening", part: 3, type: "choice",
      audio: "男：你好，李老师在吗？女：他在学校，在打电话。",
      question: "Thầy Lý đang ở đâu?",
      options: ["A. 医院 (Bệnh viện)", "B. 学校 (Trường học)", "C. 商店 (Cửa hàng)"],
      correct: 1,
      explanation: "Người nữ trả lời: '他在学校' (Thầy đang ở trường) -> Chọn B."
    },
    {
      id: 12, section: "listening", part: 3, type: "choice",
      audio: "女：你看见我的猫了吗？男：看见了，它在椅子下面。",
      question: "Con mèo đang ở đâu?",
      options: ["A. 桌子上 (Trên bàn)", "B. 椅子下面 (Dưới ghế)", "C. 房间里 (Trong phòng)"],
      correct: 1,
      explanation: "Người nam nói: '在椅子下面' (ở dưới ghế) -> Chọn B."
    },
    {
      id: 13, section: "listening", part: 3, type: "choice",
      audio: "男：你什么时候去中国？女：我明天坐飞机去。",
      question: "Người nữ đi bằng phương tiện gì?",
      options: ["A. 坐飞机 (Đi máy bay)", "B. 开车 (Lái xe ô tô)", "C. 坐出租车 (Đi taxi)"],
      correct: 0,
      explanation: "Người nữ nói: '我明天坐飞机去' (Ngày mai tôi đi máy bay) -> Chọn A."
    },
    {
      id: 14, section: "listening", part: 3, type: "choice",
      audio: "女：这些苹果多少钱一斤？男：三块钱一斤。",
      question: "Táo bao nhiêu tiền một cân (0.5kg)?",
      options: ["A. 两块 (2 tệ)", "B. 三块 (3 tệ)", "C. 四块 (4 tệ)"],
      correct: 1,
      explanation: "Người bán hàng trả lời: '三块钱一斤' (3 tệ một cân) -> Chọn B."
    },
    {
      id: 15, section: "listening", part: 3, type: "choice",
      audio: "男：你会说汉语吗？女：我会说一点儿。",
      question: "Người nữ có biết nói tiếng Trung không?",
      options: ["A. 不会 (Không biết)", "B. 会说一点儿 (Biết một chút)", "C. 说得非常好 (Nói rất tốt)"],
      correct: 1,
      explanation: "Người nữ nói: '我会说一点儿' (Tôi biết nói một chút) -> Chọn B."
    },

    // Phần 1.4: Nghe câu hỏi hoặc hội thoại 2 lượt, chọn đáp án đúng (Câu 16-20)
    {
      id: 16, section: "listening", part: 4, type: "choice",
      audio: "女：你喜欢喝什么？男：我喜欢喝茶，不喜欢喝水。",
      question: "Người nam thích uống gì?",
      options: ["A. 水 (Nước)", "B. 茶 (Trà)", "C. 牛奶 (Sữa)"],
      correct: 1,
      explanation: "Người nam nói '我喜欢喝茶' (Tôi thích uống trà) -> Chọn B."
    },
    {
      id: 17, section: "listening", part: 4, type: "choice",
      audio: "男：王小姐认识他吗？女：认识，他是王小姐的大学同学。",
      question: "Anh ấy là ai của cô Vương?",
      options: ["A. 老师 (Thầy giáo)", "B. 同学 (Bạn học)", "C. 儿子 (Con trai)"],
      correct: 1,
      explanation: "Người nữ nói '他是王小姐的大学同学' (Anh ấy là bạn đại học của cô Vương) -> Chọn B."
    },
    {
      id: 18, section: "listening", part: 4, type: "choice",
      audio: "女：喂，你在哪儿呢？男：我在北京火车站，马上回家。",
      question: "Người nam đang ở đâu?",
      options: ["A. 火车站 (Ga tàu hỏa)", "B. 机场 (Sân bay)", "C. 饭店 (Nhà hàng)"],
      correct: 0,
      explanation: "Người nam nói '我在北京火车站' (Tôi đang ở ga tàu Bắc Kinh) -> Chọn A."
    },
    {
      id: 19, section: "listening", part: 4, type: "choice",
      audio: "男：这个电脑多少钱？女：很便宜，两千块钱。",
      question: "Chiếc máy tính giá bao nhiêu?",
      options: ["A. 一千块 (1.000 tệ)", "B. 两千块 (2.000 tệ)", "C. 三千块 (3.000 tệ)"],
      correct: 1,
      explanation: "Người nữ nói '两千块钱' (2.000 tệ) -> Chọn B."
    },
    {
      id: 20, section: "listening", part: 4, type: "choice",
      audio: "女：今天星期几？男：今天星期六，我们不用去学校。",
      question: "Hôm nay là thứ mấy?",
      options: ["A. 星期五 (Thứ Sáu)", "B. 星期六 (Thứ Bảy)", "C. 星期日 (Chủ Nhật)"],
      correct: 1,
      explanation: "Người nam nói '今天星期六' (Hôm nay là thứ Bảy) -> Chọn B."
    },

    /* ================= PHẦN 2: ĐỌC HIỂU (阅读) - CÂU 21 -> 40 ================= */

    // Phần 2.1: Nhìn từ ngữ & hình ảnh/mô tả, phán đoán Đúng/Sai (Câu 21-25)
    {
      id: 21, section: "reading", part: 1, type: "judge",
      prompt: "米饭", pinyin: "mǐfàn",
      meaningPrompt: "Cơm trắng",
      correct: true,
      explanation: "Từ '米饭' (mǐfàn) nghĩa là cơm trắng -> Đúng."
    },
    {
      id: 22, section: "reading", part: 1, type: "judge",
      prompt: "不客气", pinyin: "bú kèqi",
      meaningPrompt: "Xin lỗi",
      correct: false,
      explanation: "'不客气' nghĩa là đừng khách sáo / không có chi. 'Xin lỗi' trong tiếng Trung là '对不起' (duìbuqǐ) -> Sai."
    },
    {
      id: 23, section: "reading", part: 1, type: "judge",
      prompt: "打电话", pinyin: "dǎ diànhuà",
      meaningPrompt: "Gọi điện thoại",
      correct: true,
      explanation: "'打电话' (dǎ diànhuà) nghĩa là gọi điện thoại -> Đúng."
    },
    {
      id: 24, section: "reading", part: 1, type: "judge",
      prompt: "高", pinyin: "gāo",
      meaningPrompt: "Thấp, lùn",
      correct: false,
      explanation: "'高' nghĩa là cao. 'Thấp, lùn' trong tiếng Trung là '矮' (ǎi) -> Sai."
    },
    {
      id: 25, section: "reading", part: 1, type: "judge",
      prompt: "电影院", pinyin: "diànyǐngyuàn",
      meaningPrompt: "Rạp chiếu phim",
      correct: true,
      explanation: "'电影院' (diànyǐngyuàn) là rạp chiếu phim -> Đúng."
    },

    // Phần 2.2: Điền từ vào chỗ trống trong câu (Câu 26-30)
    {
      id: 26, section: "reading", part: 2, type: "choice",
      question: "我喜欢看书，家里有很____书。",
      options: ["A. 大 (to)", "B. 多 (nhiều)", "C. 少 (ít)"],
      correct: 1,
      explanation: "Cụm từ '很多书' (rất nhiều sách) là cấu trúc chuẩn chỉ số lượng nhiều -> Chọn B."
    },
    {
      id: 27, section: "reading", part: 2, type: "choice",
      question: "她是我的好朋友，我们____在北京工作。",
      options: ["A. 都 (đều)", "B. 不 (không)", "C. 很 (rất)"],
      correct: 0,
      explanation: "Chủ ngữ số nhiều '我们' (chúng tôi) đi với phó từ '都' (đều) để chỉ toàn thể -> Chọn A."
    },
    {
      id: 28, section: "reading", part: 2, type: "choice",
      question: "请问，去火车站怎么____？",
      options: ["A. 吃 (ăn)", "B. 走 (đi)", "C. 读 (đọc)"],
      correct: 1,
      explanation: "Cấu trúc hỏi đường trong tiếng Trung: '怎么走？' (đi như thế nào?) -> Chọn B."
    },
    {
      id: 29, section: "reading", part: 2, type: "choice",
      question: "对不起，我没____听懂你说的话。",
      options: ["A. 有 (có)", "B. 是 (là)", "C. 会 (biết)"],
      correct: 0,
      explanation: "Phủ định hành động chưa hoàn thành dùng '没有' (hoặc '没') -> Chọn A."
    },
    {
      id: 30, section: "reading", part: 2, type: "choice",
      question: "今天是我的生日，妈妈做了一个大____。",
      options: ["A. 杯子 (cái cốc)", "B. 蛋糕 (bánh ga-tô)", "C. 衣服 (quần áo)"],
      correct: 1,
      explanation: "Ngày sinh nhật (生日) phù hợp nhất với bánh ga-tô (蛋糕) -> Chọn B."
    },

    // Phần 2.3: Ghép câu hỏi với câu trả lời tương ứng (Câu 31-35)
    {
      id: 31, section: "reading", part: 3, type: "choice",
      question: "问：『你好，请问张先生在吗？』\n答：『______』",
      options: [
        "A. 在，请进。(Có, mời vào.)",
        "B. 谢谢你。(Cảm ơn bạn.)",
        "C. 我很好。(Tôi rất khỏe.)"
      ],
      correct: 0,
      explanation: "Hỏi 'ông Trương có ở đây không?' thì câu trả lời phù hợp nhất là '在，请进' (Có, mời vào) -> Chọn A."
    },
    {
      id: 32, section: "reading", part: 3, type: "choice",
      question: "问：『你想喝水还是喝茶？』\n答：『______』",
      options: [
        "A. 我是不喝。(Tôi là không uống.)",
        "B. 喝茶吧，谢谢。(Uống trà nhé, cảm ơn.)",
        "C. 好的，明天见。(Được rồi, ngày mai gặp.)"
      ],
      correct: 1,
      explanation: "Câu hỏi lựa chọn 'A 还是 B' trả lời bằng phương án mong muốn '喝茶吧' -> Chọn B."
    },
    {
      id: 33, section: "reading", part: 3, type: "choice",
      question: "问：『你认识前面那个人吗？』\n答：『______』",
      options: [
        "A. 他去医院了。(Anh ấy đi bệnh viện rồi.)",
        "B. 认识，他是我的中文老师。(Quen, thầy là giáo viên tiếng Trung của tôi.)",
        "C. 太热了。(Nóng quá rồi.)"
      ],
      correct: 1,
      explanation: "Hỏi có quen không (你认识...吗) thì trả lời '认识，他是...' -> Chọn B."
    },
    {
      id: 34, section: "reading", part: 3, type: "choice",
      question: "问：『今天晚上我们去看电影好吗？』\n答：『______』",
      options: [
        "A. 太好了，几点去？(Tuyệt quá, mấy giờ đi?)",
        "B. 我不知道名字。(Tôi không biết tên.)",
        "C. 不客气。(Đừng khách sáo.)"
      ],
      correct: 0,
      explanation: "Lời rủ đi xem phim '好吗？' được đồng ý hào hứng bằng '太好了' -> Chọn A."
    },
    {
      id: 35, section: "reading", part: 3, type: "choice",
      question: "问：『谢谢你的帮助！』\n答：『______』",
      options: [
        "A. 没关系。(Không có chi / Không sao.)",
        "B. 没问题。(Không thành vấn đề.)",
        "C. 再见。(Tạm biệt.)"
      ],
      correct: 0,
      explanation: "Đáp lại lời cảm ơn (谢谢) dùng '不客气' hoặc '没关系' -> Chọn A."
    },

    // Phần 2.4: Đọc câu văn ngắn, chọn phương án trả lời đúng (Câu 36-40)
    {
      id: 36, section: "reading", part: 4, type: "choice",
      question: "我家有四口人：爸爸、妈妈、哥哥和我。请问我家一共有几个人？",
      options: ["A. 三个人 (3 người)", "B. 四个人 (4 người)", "C. 五个人 (5 người)"],
      correct: 1,
      explanation: "Câu văn nêu rõ: '我家有四口人' (Nhà tôi có 4 người) -> Chọn B."
    },
    {
      id: 37, section: "reading", part: 4, type: "choice",
      question: "王丽今天生病了，她没来学校，在医院看医生。王丽今天在哪儿？",
      options: ["A. 学校 (Trường học)", "B. 饭店 (Nhà hàng)", "C. 医院 (Bệnh viện)"],
      correct: 2,
      explanation: "Đoạn văn nói: '在医院看医生' (ở bệnh viện khám bác sĩ) -> Chọn C."
    },
    {
      id: 38, section: "reading", part: 4, type: "choice",
      question: "小明上午八点去图书馆看书，中午十二点回家吃午饭。小明在图书馆多长时间？",
      options: ["A. 四个小时 (4 tiếng đồng hồ)", "B. 三个小时 (3 tiếng đồng hồ)", "C. 两个小时 (2 tiếng đồng hồ)"],
      correct: 0,
      explanation: "Từ 8 giờ sáng (八点) đến 12 giờ trưa (十二点) là 4 tiếng đồng hồ (四个小时) -> Chọn A."
    },
    {
      id: 39, section: "reading", part: 4, type: "choice",
      question: "这条裙子是一百块钱，那件衣服是两百块钱。衣服比裙子贵多少钱？",
      options: ["A. 五十块 (50 tệ)", "B. 一百块 (100 tệ)", "C. 两百块 (200 tệ)"],
      correct: 1,
      explanation: "Váy 100 tệ, áo 200 tệ -> Áo đắt hơn váy 200 - 100 = 100 tệ (一百块) -> Chọn B."
    },
    {
      id: 40, section: "reading", part: 4, type: "choice",
      question: "大卫在北京学中文，他很喜欢中国菜，觉得北京烤鸭非常好吃。大卫觉得什么好吃？",
      options: ["A. 面条 (Mì)", "B. 包子 (Bánh bao)", "C. 北京烤鸭 (Vịt quay Bắc Kinh)"],
      correct: 2,
      explanation: "Đoạn văn nói rõ: '觉得北京烤鸭非常好吃' (cảm thấy vịt quay Bắc Kinh rất ngon) -> Chọn C."
    }
  ]
};

if (typeof window !== "undefined") {
  window.HSK1_EXAM_PRACTICE = HSK1_EXAM_PRACTICE;
}
if (typeof module !== "undefined") {
  module.exports = HSK1_EXAM_PRACTICE;
}
