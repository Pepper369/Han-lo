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

const HSK2_EXAM_PRACTICE = {
  "id": "hsk2_mock_01",
  "title": "Đề Thi Thử HSK 2 — Đề Số 1",
  "durationMinutes": 55,
  "passingScore": 120,
  "totalScore": 200,
  "listeningCount": 35,
  "readingCount": 25,
  "questions": [
    {
      "id": 1,
      "section": "listening",
      "part": 1,
      "type": "judge",
      "audio": "他在跑步。",
      "prompt": "他在跑步",
      "pinyin": "tā zài pǎobù",
      "meaningPrompt": "Anh ấy đang chạy bộ",
      "correct": true,
      "explanation": "Khớp: tā zài pǎobù nghĩa là anh ấy đang chạy bộ."
    },
    {
      "id": 2,
      "section": "listening",
      "part": 1,
      "type": "judge",
      "audio": "外面在下雪。",
      "prompt": "外面在下雨",
      "pinyin": "wàimiàn zài xiàyǔ",
      "meaningPrompt": "Bên ngoài đang mưa",
      "correct": false,
      "explanation": "Âm thanh đọc 下雪 (tuyết rơi), câu hiển thị là 下雨 (mưa) -> Sai."
    },
    {
      "id": 3,
      "section": "listening",
      "part": 1,
      "type": "judge",
      "audio": "她喜欢喝牛奶。",
      "prompt": "喝牛奶",
      "pinyin": "hē niúnǎi",
      "meaningPrompt": "Uống sữa bò",
      "correct": true,
      "explanation": "Khớp: hē niúnǎi nghĩa là uống sữa bò."
    },
    {
      "id": 4,
      "section": "listening",
      "part": 1,
      "type": "judge",
      "audio": "火车站离这里很远。",
      "prompt": "离这里很近",
      "pinyin": "lí zhèlǐ hěn jìn",
      "meaningPrompt": "Cách đây rất gần",
      "correct": false,
      "explanation": "Âm thanh đọc 很远 (rất xa), câu ghi 很近 (rất gần) -> Sai."
    },
    {
      "id": 5,
      "section": "listening",
      "part": 1,
      "type": "judge",
      "audio": "请进，请坐。",
      "prompt": "请坐",
      "pinyin": "qǐng zuò",
      "meaningPrompt": "Mời ngồi",
      "correct": true,
      "explanation": "Khớp: qǐng zuò nghĩa là mời ngồi."
    },
    {
      "id": 6,
      "section": "listening",
      "part": 1,
      "type": "judge",
      "audio": "妹妹在唱歌。",
      "prompt": "妹妹在跳舞",
      "pinyin": "mèimei zài tiàowǔ",
      "meaningPrompt": "Em gái đang khiêu vũ",
      "correct": false,
      "explanation": "Âm thanh đọc 唱歌 (hát), câu ghi 跳舞 (múa/khiêu vũ) -> Sai."
    },
    {
      "id": 7,
      "section": "listening",
      "part": 1,
      "type": "judge",
      "audio": "今天是星期日，我不去上班。",
      "prompt": "不用上班",
      "pinyin": "bú yòng shàngbān",
      "meaningPrompt": "Không phải đi làm",
      "correct": true,
      "explanation": "Khớp: hôm nay chủ nhật không đi làm."
    },
    {
      "id": 8,
      "section": "listening",
      "part": 1,
      "type": "judge",
      "audio": "这块手表太贵了。",
      "prompt": "很便宜",
      "pinyin": "hěn piányi",
      "meaningPrompt": "Rất rẻ",
      "correct": false,
      "explanation": "Âm thanh đọc 太贵了 (quá đắt), câu ghi 很便宜 (rất rẻ) -> Sai."
    },
    {
      "id": 9,
      "section": "listening",
      "part": 1,
      "type": "judge",
      "audio": "医生让我多喝温水。",
      "prompt": "多喝水",
      "pinyin": "duō hē shuǐ",
      "meaningPrompt": "Uống nhiều nước",
      "correct": true,
      "explanation": "Khớp: bác sĩ dặn uống nhiều nước."
    },
    {
      "id": 10,
      "section": "listening",
      "part": 1,
      "type": "judge",
      "audio": "他坐飞机去北京旅游了。",
      "prompt": "坐火车",
      "pinyin": "zuò huǒchē",
      "meaningPrompt": "Đi tàu hỏa",
      "correct": false,
      "explanation": "Âm thanh đọc 坐飞机 (đi máy bay), câu ghi 坐火车 (đi tàu hỏa) -> Sai."
    },
    {
      "id": 11,
      "section": "listening",
      "part": 2,
      "type": "choice",
      "audio": "你在找什么呢？——我的自行车。",
      "question": "男的在找什么？",
      "options": [
        "A. 钥匙 (Chìa khóa)",
        "B. 自行车 (Xe đạp)",
        "C. 手机 (Điện thoại)"
      ],
      "correct": 1,
      "explanation": "Người nam tìm xe đạp (自行车)."
    },
    {
      "id": 12,
      "section": "listening",
      "part": 2,
      "type": "choice",
      "audio": "今天天气真好，我们去踢足球吧。",
      "question": "他们打算去做什么？",
      "options": [
        "A. 踢足球 (Đá bóng)",
        "B. 打篮球 (Chơi bóng rổ)",
        "C. 游泳 (Bơi lội)"
      ],
      "correct": 0,
      "explanation": "Họ rủ nhau đi đá bóng (踢足球)."
    },
    {
      "id": 13,
      "section": "listening",
      "part": 2,
      "type": "choice",
      "audio": "服务员，请给我们两杯咖啡。",
      "question": "他们想要什么？",
      "options": [
        "A. 两杯茶 (2 cốc trà)",
        "B. 两瓶水 (2 chai nước)",
        "C. 两杯咖啡 (2 cốc cà phê)"
      ],
      "correct": 2,
      "explanation": "Gọi 2 cốc cà phê (两杯咖啡)."
    },
    {
      "id": 14,
      "section": "listening",
      "part": 2,
      "type": "choice",
      "audio": "你哥哥多大了？——他今年二十五岁。",
      "question": "哥哥今年几岁？",
      "options": [
        "A. 20岁",
        "B. 25岁",
        "C. 30岁"
      ],
      "correct": 1,
      "explanation": "Người nam nói 25 tuổi (二十五岁)."
    },
    {
      "id": 15,
      "section": "listening",
      "part": 2,
      "type": "choice",
      "audio": "这件红色的衣服真好看。",
      "question": "衣服是什么颜色的？",
      "options": [
        "A. 红色 (Màu đỏ)",
        "B. 白色 (Màu trắng)",
        "C. 黑色 (Màu đen)"
      ],
      "correct": 0,
      "explanation": "Áo màu đỏ (红色)."
    },
    {
      "id": 16,
      "section": "listening",
      "part": 2,
      "type": "choice",
      "audio": "明天早上八点半我们在校门口见。",
      "question": "他们什么时候见面？",
      "options": [
        "A. 8:00",
        "B. 8:30",
        "C. 9:00"
      ],
      "correct": 1,
      "explanation": "Hẹn gặp lúc 8 giờ rưỡi (八点半)."
    },
    {
      "id": 17,
      "section": "listening",
      "part": 2,
      "type": "choice",
      "audio": "西瓜两块钱一斤，很甜。",
      "question": "什么东西很甜？",
      "options": [
        "A. 苹果 (Táo)",
        "B. 香蕉 (Chuối)",
        "C. 西瓜 (Dưa hấu)"
      ],
      "correct": 2,
      "explanation": "Dưa hấu rất ngọt (西瓜很甜)."
    },
    {
      "id": 18,
      "section": "listening",
      "part": 2,
      "type": "choice",
      "audio": "你在看什么呢？——在看今天的报纸。",
      "question": "他在看什么？",
      "options": [
        "A. 电影 (Phim)",
        "B. 报纸 (Báo chí)",
        "C. 电视 (Tivi)"
      ],
      "correct": 1,
      "explanation": "Đang xem báo (报纸)."
    },
    {
      "id": 19,
      "section": "listening",
      "part": 2,
      "type": "choice",
      "audio": "这道题太难了，我不会做。",
      "question": "这道题怎么样？",
      "options": [
        "A. 很难 (Rất khó)",
        "B. 很容易 (Rất dễ)",
        "C. 很有意思 (Rất thú vị)"
      ],
      "correct": 0,
      "explanation": "Câu hỏi này quá khó (太难了)."
    },
    {
      "id": 20,
      "section": "listening",
      "part": 2,
      "type": "choice",
      "audio": "妈妈正在厨房做鱼呢。",
      "question": "妈妈在做什么？",
      "options": [
        "A. 买鱼 (Mua cá)",
        "B. 做鱼 (Nấu cá)",
        "C. 吃水果 (Ăn hoa quả)"
      ],
      "correct": 1,
      "explanation": "Mẹ đang nấu món cá (做鱼)."
    },
    {
      "id": 21,
      "section": "listening",
      "part": 3,
      "type": "choice",
      "audio": "男：你看见我的猫了吗？女：在桌子下面睡觉呢。",
      "question": "猫在做什么？",
      "options": [
        "A. 吃东西 (Ăn đồ)",
        "B. 玩儿 (Chơi)",
        "C. 睡觉 (Ngủ)"
      ],
      "correct": 2,
      "explanation": "Mèo đang ngủ dưới bàn (在桌子下面睡觉)."
    },
    {
      "id": 22,
      "section": "listening",
      "part": 3,
      "type": "choice",
      "audio": "女：你想喝点儿什么？男：给我一杯热水吧，我有点儿感冒。",
      "question": "男的怎么了？",
      "options": [
        "A. 累了 (Mệt)",
        "B. 感冒了 (Bị cảm)",
        "C. 饿了 (Đói)"
      ],
      "correct": 1,
      "explanation": "Người nam bị cảm (感冒了)."
    },
    {
      "id": 23,
      "section": "listening",
      "part": 3,
      "type": "choice",
      "audio": "男：这块手表是新买的吗？女：不是，是我去年生日妈妈送的。",
      "question": "手表是谁送的？",
      "options": [
        "A. 妈妈 (Mẹ)",
        "B. 爸爸 (Bố)",
        "C. 朋友 (Bạn bè)"
      ],
      "correct": 0,
      "explanation": "Mẹ tặng sinh nhật năm ngoái (妈妈送的)."
    },
    {
      "id": 24,
      "section": "listening",
      "part": 3,
      "type": "choice",
      "audio": "女：我们走着去超市吧。男：太远了，还是坐公共汽车吧。",
      "question": "男的想怎么去超市？",
      "options": [
        "A. 走路 (Đi bộ)",
        "B. 开车 (Lái xe)",
        "C. 坐公共汽车 (Đi xe buýt)"
      ],
      "correct": 2,
      "explanation": "Người nam muốn đi xe buýt (坐公共汽车)."
    },
    {
      "id": 25,
      "section": "listening",
      "part": 3,
      "type": "choice",
      "audio": "男：今天下午有考试，你准备好了吗？女：准备好了，别担心。",
      "question": "女的准备得怎么样？",
      "options": [
        "A. 没准备好 (Chưa chuẩn bị tốt)",
        "B. 准备好了 (Chuẩn bị xong rồi)",
        "C. 不想考 (Không muốn thi)"
      ],
      "correct": 1,
      "explanation": "Nữ nói đã chuẩn bị tốt rồi (准备好了)."
    },
    {
      "id": 26,
      "section": "listening",
      "part": 3,
      "type": "choice",
      "audio": "女：你每天几点起床？男：我六点起床，然后去跑步。",
      "question": "男的起床后做什么？",
      "options": [
        "A. 吃早饭 (Ăn sáng)",
        "B. 跑步 (Chạy bộ)",
        "C. 看书 (Đọc sách)"
      ],
      "correct": 1,
      "explanation": "Sau khi dậy thì đi chạy bộ (然后去跑步)."
    },
    {
      "id": 27,
      "section": "listening",
      "part": 3,
      "type": "choice",
      "audio": "男：张老师在办公室吗？女：他去教室上课了。",
      "question": "张老师在哪儿？",
      "options": [
        "A. 办公室 (Văn phòng)",
        "B. 教室 (Lớp học)",
        "C. 家里 (Ở nhà)"
      ],
      "correct": 1,
      "explanation": "Thầy Trương đi lớp học rồi (去教室上课了)."
    },
    {
      "id": 28,
      "section": "listening",
      "part": 3,
      "type": "choice",
      "audio": "女：这个电影好看吗？男：非常有意思，大家都喜欢。",
      "question": "这个电影怎么样？",
      "options": [
        "A. 不好看 (Không hay)",
        "B. 太长了 (Quá dài)",
        "C. 很有意思 (Rất thú vị)"
      ],
      "correct": 2,
      "explanation": "Phim rất hay và thú vị (非常有意思)."
    },
    {
      "id": 29,
      "section": "listening",
      "part": 3,
      "type": "choice",
      "audio": "男：我们星期六去爬山，怎么样？女：好啊，几点出发？",
      "question": "他们打算星期几去爬山？",
      "options": [
        "A. 星期五 (Thứ 6)",
        "B. 星期六 (Thứ 7)",
        "C. 星期日 (Chủ nhật)"
      ],
      "correct": 1,
      "explanation": "Họ hẹn thứ 7 đi leo núi (星期六)."
    },
    {
      "id": 30,
      "section": "listening",
      "part": 3,
      "type": "choice",
      "audio": "女：你的汉语说得真好！男：谢谢，我学了一年了。",
      "question": "男的学了多长时间汉语？",
      "options": [
        "A. 一个月 (1 tháng)",
        "B. 半年 (Nửa năm)",
        "C. 一年 (1 năm)"
      ],
      "correct": 2,
      "explanation": "Nam học tiếng Trung được 1 năm (学了一年了)."
    },
    {
      "id": 31,
      "section": "listening",
      "part": 4,
      "type": "choice",
      "audio": "明天是王朋的生日，我们打算在饭馆为他庆祝，还要买一个大蛋糕。",
      "question": "他们为什么要买蛋糕？",
      "options": [
        "A. 庆祝生日 (Mừng sinh nhật)",
        "B. 庆祝新年 (Mừng năm mới)",
        "C. 找工作 (Tìm việc làm)"
      ],
      "correct": 0,
      "explanation": "Mua bánh ngọt để mừng sinh nhật Vương Bằng."
    },
    {
      "id": 32,
      "section": "listening",
      "part": 4,
      "type": "choice",
      "audio": "虽然今天下大雨，天气很冷，但是教室里所有的学生都到了，没有一个人迟到。",
      "question": "今天谁迟到了？",
      "options": [
        "A. 老师 (Thầy giáo)",
        "B. 一个学生 (Một học sinh)",
        "C. 没有人 (Không có ai)"
      ],
      "correct": 2,
      "explanation": "Không có ai đi muộn (没有一个人迟到)."
    },
    {
      "id": 33,
      "section": "listening",
      "part": 4,
      "type": "choice",
      "audio": "我最喜欢的水果是西瓜，夏天吃西瓜最舒服，不仅甜而且水很多。",
      "question": "他最喜欢什么水果？",
      "options": [
        "A. 苹果 (Táo)",
        "B. 西瓜 (Dưa hấu)",
        "C. 葡萄 (Nho)"
      ],
      "correct": 1,
      "explanation": "Hoa quả thích nhất là dưa hấu (最喜欢的水果是西瓜)."
    },
    {
      "id": 34,
      "section": "listening",
      "part": 4,
      "type": "choice",
      "audio": "小李生病住院了，我们下午四点一起去医院看他，买点儿水果带过去吧。",
      "question": "他们下午去哪儿？",
      "options": [
        "A. 医院 (Bệnh viện)",
        "B. 学校 (Trường học)",
        "C. 商店 (Cửa hàng)"
      ],
      "correct": 0,
      "explanation": "Đến bệnh viện thăm Tiểu Lý (去医院看他)."
    },
    {
      "id": 35,
      "section": "listening",
      "part": 4,
      "type": "choice",
      "audio": "我每天早上七点起床，吃完早饭后走路上学，八点开始上第一节课。",
      "question": "他怎么去上学？",
      "options": [
        "A. 坐车 (Đi xe)",
        "B. 走路 (Đi bộ)",
        "C. 骑自行车 (Đi xe đạp)"
      ],
      "correct": 1,
      "explanation": "Đi bộ đi học (走路上学)."
    },
    {
      "id": 36,
      "section": "reading",
      "part": 1,
      "type": "choice",
      "question": "外面下着雪，天气非常冷，出门要多穿点儿衣服。",
      "options": [
        "A. 天气晴朗 (Trời quang đãng)",
        "B. 天气寒冷下雪 (Trời lạnh có tuyết)",
        "C. 天气很热 (Trời rất nóng)"
      ],
      "correct": 1,
      "explanation": "Câu văn miêu tả tuyết rơi, trời rất lạnh (下着雪，天气非常冷)."
    },
    {
      "id": 37,
      "section": "reading",
      "part": 1,
      "type": "choice",
      "question": "这家饭馆的菜很好吃，服务员也很有礼貌。",
      "options": [
        "A. 菜不好吃 (Món không ngon)",
        "B. 饭馆服务不好 (Phục vụ không tốt)",
        "C. 菜好吃且服务好 (Món ngon & phục vụ chu đáo)"
      ],
      "correct": 2,
      "explanation": "Món ăn ngon và nhân viên phục vụ rất lịch sự."
    },
    {
      "id": 38,
      "section": "reading",
      "part": 1,
      "type": "choice",
      "question": "李老师在黑板上写了几个汉字，让大家读一读。",
      "options": [
        "A. 李老师在写汉字 (Thầy Lý đang viết chữ Hán)",
        "B. 大家在唱歌 (Mọi người đang hát)",
        "C. 李老师在跑步 (Thầy Lý đang chạy)"
      ],
      "correct": 0,
      "explanation": "Thầy Lý viết chữ Hán lên bảng đen (在黑板上写了几个汉字)."
    },
    {
      "id": 39,
      "section": "reading",
      "part": 1,
      "type": "choice",
      "question": "妹妹今天穿了一条白色的裙子，非常漂亮。",
      "options": [
        "A. 妹妹穿黑裤子 (Em gái mặc quần đen)",
        "B. 妹妹穿白裙子 (Em gái mặc váy trắng)",
        "C. 妹妹买红衣服 (Em gái mua áo đỏ)"
      ],
      "correct": 1,
      "explanation": "Em gái mặc một chiếc váy màu trắng (白色的裙子)."
    },
    {
      "id": 40,
      "section": "reading",
      "part": 1,
      "type": "choice",
      "question": "医生说我的身体没什么问题，多休息两天就好了。",
      "options": [
        "A. 生了重病 (Bị bệnh nặng)",
        "B. 身体没大问题 (Sức khỏe không vấn đề lớn)",
        "C. 要立刻去住院 (Phải nhập viện ngay)"
      ],
      "correct": 1,
      "explanation": "Bác sĩ bảo cơ thể không vấn đề gì lớn, nghỉ ngơi 2 ngày là khỏi."
    },
    {
      "id": 41,
      "section": "reading",
      "part": 2,
      "type": "choice",
      "question": "这本词典很（ ），对我学汉语很有帮助。",
      "options": [
        "A. 有用 (Hữu ích)",
        "B. 便宜 (Rẻ)",
        "C. 慢 (Chậm)"
      ],
      "correct": 0,
      "explanation": "Cuốn từ điển này rất hữu ích (有用), giúp ích nhiều cho việc học."
    },
    {
      "id": 42,
      "section": "reading",
      "part": 2,
      "type": "choice",
      "question": "虽然工作很累，但是他（ ）很高兴。",
      "options": [
        "A. 已经 (Đã)",
        "B. 仍然 (Vẫn)",
        "C. 正在 (Đang)"
      ],
      "correct": 1,
      "explanation": "Tuy công việc mệt nhưng anh ấy vẫn rất vui (仍然很高兴)."
    },
    {
      "id": 43,
      "section": "reading",
      "part": 2,
      "type": "choice",
      "question": "你（ ）一下，门外是谁在敲门？",
      "options": [
        "A. 看 (Xem)",
        "B. 听 (Nghe)",
        "C. 说 (Nói)"
      ],
      "correct": 1,
      "explanation": "Bạn nghe thử xem (听一下), ngoài cửa ai đang gõ cửa."
    },
    {
      "id": 44,
      "section": "reading",
      "part": 2,
      "type": "choice",
      "question": "从学校到火车站，（ ）出租车只要十五分钟。",
      "options": [
        "A. 走 (Đi bộ)",
        "B. 坐 (Ngồi, đi)",
        "C. 骑 (Cưỡi, đạp)"
      ],
      "correct": 1,
      "explanation": "Đi xe taxi dùng động từ 坐 (坐出租车)."
    },
    {
      "id": 45,
      "section": "reading",
      "part": 2,
      "type": "choice",
      "question": "时间不早了，我们（ ）走吧。",
      "options": [
        "A. 马上 (Ngay lập tức)",
        "B. 过去 (Quá khứ)",
        "C. 以前 (Trước đây)"
      ],
      "correct": 0,
      "explanation": "Thời gian không còn sớm, chúng ta đi ngay thôi (马上走吧)."
    },
    {
      "id": 46,
      "section": "reading",
      "part": 3,
      "type": "choice",
      "question": "问：“请问，洗手间在哪儿？”——答：（ ）",
      "options": [
        "A. 在前面右拐 (Ở phía trước rẽ phải)",
        "B. 昨天买的 (Hôm qua mua)",
        "C. 两个人 (Hai người)"
      ],
      "correct": 0,
      "explanation": "Hỏi địa điểm nhà vệ sinh -> Đáp chỉ đường (在前面右拐)."
    },
    {
      "id": 47,
      "section": "reading",
      "part": 3,
      "type": "choice",
      "question": "问：“你喜欢吃中国菜还是西餐？”——答：（ ）",
      "options": [
        "A. 我喜欢中国菜 (Tôi thích món Trung Quốc)",
        "B. 一共三十块 (Tổng cộng 30 tệ)",
        "C. 他很好 (Anh ấy rất tốt)"
      ],
      "correct": 0,
      "explanation": "Câu hỏi lựa chọn đồ ăn -> Đáp chọn món Trung Quốc (我喜欢中国菜)."
    },
    {
      "id": 48,
      "section": "reading",
      "part": 3,
      "type": "choice",
      "question": "问：“今天晚上你去看电影吗？”——答：（ ）",
      "options": [
        "A. 电影院很大 (Rạp rất to)",
        "B. 我有事，不去了 (Tôi bận việc, không đi nữa)",
        "C. 是星期一 (Là thứ 2)"
      ],
      "correct": 1,
      "explanation": "Hỏi có đi xem phim không -> Đáp từ chối vì có việc (我有事，不去了)."
    },
    {
      "id": 49,
      "section": "reading",
      "part": 3,
      "type": "choice",
      "question": "问：“祝你生日快乐！”——答：（ ）",
      "options": [
        "A. 没关系 (Không sao)",
        "B. 谢谢你！(Cảm ơn bạn!)",
        "C. 再见 (Tạm biệt)"
      ],
      "correct": 1,
      "explanation": "Nhận lời chúc mừng sinh nhật -> Đáp cảm ơn (谢谢你)."
    },
    {
      "id": 50,
      "section": "reading",
      "part": 3,
      "type": "choice",
      "question": "问：“这本书你看完了吗？”——答：（ ）",
      "options": [
        "A. 还没呢，还有三十页 (Chưa xong, còn 30 trang)",
        "B. 是一百块 (Là 100 tệ)",
        "C. 我写完了 (Tôi viết xong rồi)"
      ],
      "correct": 0,
      "explanation": "Hỏi đã đọc xong sách chưa -> Đáp chưa xong, còn 30 trang."
    },
    {
      "id": 51,
      "section": "reading",
      "part": 4,
      "type": "choice",
      "question": "小王在北京工作了三年，现在他的汉语说得非常流利。小王在哪里工作？",
      "options": [
        "A. 上海 (Thượng Hải)",
        "B. 北京 (Bắc Kinh)",
        "C. 广州 (Quảng Châu)"
      ],
      "correct": 1,
      "explanation": "Tiểu Vương làm việc ở Bắc Kinh (在北京工作了三年)."
    },
    {
      "id": 52,
      "section": "reading",
      "part": 4,
      "type": "choice",
      "question": "昨天下午小明买了两斤苹果和一斤香蕉，一共花了二十块钱。小明花了多少钱？",
      "options": [
        "A. 10块",
        "B. 15块",
        "C. 20块"
      ],
      "correct": 2,
      "explanation": "Tổng cộng tiêu hết 20 tệ (一共花了二十块钱)."
    },
    {
      "id": 53,
      "section": "reading",
      "part": 4,
      "type": "choice",
      "question": "妈妈说喝牛奶对身体好，所以弟弟每天早饭都要喝一杯热牛奶。弟弟早饭喝什么？",
      "options": [
        "A. 豆浆 (Sữa đậu nành)",
        "B. 热牛奶 (Sữa bò nóng)",
        "C. 咖啡 (Cà phê)"
      ],
      "correct": 1,
      "explanation": "Mỗi sáng em trai đều uống 1 cốc sữa bò nóng (喝一杯热牛奶)."
    },
    {
      "id": 54,
      "section": "reading",
      "part": 4,
      "type": "choice",
      "question": "飞机今天下午两点起飞，我们最好十二点半就到机场。他们打算几点到机场？",
      "options": [
        "A. 12:00",
        "B. 12:30",
        "C. 14:00"
      ],
      "correct": 1,
      "explanation": "Tốt nhất 12 giờ rưỡi đến sân bay (十二点半就到机场)."
    },
    {
      "id": 55,
      "section": "reading",
      "part": 4,
      "type": "choice",
      "question": "大卫喜欢运动，他每天早晨六点去公园跑步，风雨无阻。大卫在公园做什么？",
      "options": [
        "A. 散步 (Đi dạo)",
        "B. 跑步 (Chạy bộ)",
        "C. 打太极 (Tập thái cực quyền)"
      ],
      "correct": 1,
      "explanation": "David đến công viên chạy bộ (去公园跑步)."
    },
    {
      "id": 56,
      "section": "reading",
      "part": 4,
      "type": "choice",
      "question": "这张桌子比那张椅子贵一百块钱。椅子是一百五十块，桌子多少钱？",
      "options": [
        "A. 150块",
        "B. 200块",
        "C. 250块"
      ],
      "correct": 2,
      "explanation": "Ghế 150 tệ, bàn đắt hơn ghế 100 tệ -> Bàn giá 150 + 100 = 250 tệ (两百五十块)."
    },
    {
      "id": 57,
      "section": "reading",
      "part": 4,
      "type": "choice",
      "question": "虽然今天下雪很冷，但是孩子们在外面堆雪人玩得非常开心。孩子们在做什么？",
      "options": [
        "A. 堆雪人 (Đắp người tuyết)",
        "B. 滑冰 (Trượt băng)",
        "C. 踢足球 (Đá bóng)"
      ],
      "correct": 0,
      "explanation": "Bọn trẻ đắp người tuyết chơi rất vui (在外面堆雪人)."
    },
    {
      "id": 58,
      "section": "reading",
      "part": 4,
      "type": "choice",
      "question": "玛丽去超市买了面包、鸡蛋和西瓜，但是她忘了买牛奶。玛丽没买什么？",
      "options": [
        "A. 面包 (Bánh mì)",
        "B. 西瓜 (Dưa hấu)",
        "C. 牛奶 (Sữa bò)"
      ],
      "correct": 2,
      "explanation": "Mary quên mua sữa bò (忘了买牛奶)."
    },
    {
      "id": 59,
      "section": "reading",
      "part": 4,
      "type": "choice",
      "question": "李老师教我们汉语已经两年了，他讲课非常认真，大家都喜欢上他的课。李老师教什么？",
      "options": [
        "A. 英语 (Tiếng Anh)",
        "B. 汉语 (Tiếng Trung)",
        "C. 历史 (Lịch sử)"
      ],
      "correct": 1,
      "explanation": "Thầy Lý dạy tiếng Trung (教我们汉语)."
    },
    {
      "id": 60,
      "section": "reading",
      "part": 4,
      "type": "choice",
      "question": "明天是星期六，小红打算去图书馆借两本中文小说看。小红明天去哪儿？",
      "options": [
        "A. 图书馆 (Thư viện)",
        "B. 电影院 (Rạp phim)",
        "C. 书店 (Hiệu sách)"
      ],
      "correct": 0,
      "explanation": "Tiểu Hồng dự định đến thư viện (去图书馆)."
    }
  ]
};

if (typeof window !== "undefined") {
  window.HSK1_EXAM_PRACTICE = HSK1_EXAM_PRACTICE;
  window.HSK2_EXAM_PRACTICE = HSK2_EXAM_PRACTICE;
  window.HSK_EXAMS = { 1: HSK1_EXAM_PRACTICE, 2: HSK2_EXAM_PRACTICE };
}
if (typeof module !== "undefined") {
  module.exports = HSK1_EXAM_PRACTICE;
  module.exports.HSK1 = HSK1_EXAM_PRACTICE;
  module.exports.HSK2 = HSK2_EXAM_PRACTICE;
  module.exports.HSK_EXAMS = { 1: HSK1_EXAM_PRACTICE, 2: HSK2_EXAM_PRACTICE };
}
