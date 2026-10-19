const fs = require("fs");

const HSK2_EXAM = {
  id: "hsk2_mock_01",
  title: "Đề Thi Thử HSK 2 — Đề Số 1",
  durationMinutes: 55,
  passingScore: 120,
  totalScore: 200,
  listeningCount: 35,
  readingCount: 25,
  questions: [
    /* ================= PHẦN 1: NGHE HIỂU (听力) 35 CÂU ================= */
    // Phần 1.1: Phán đoán Đúng/Sai (Câu 1-10)
    { id: 1, section: "listening", part: 1, type: "judge", audio: "他在跑步。", prompt: "他在跑步", pinyin: "tā zài pǎobù", meaningPrompt: "Anh ấy đang chạy bộ", correct: true, explanation: "Khớp: tā zài pǎobù nghĩa là anh ấy đang chạy bộ." },
    { id: 2, section: "listening", part: 1, type: "judge", audio: "外面在下雪。", prompt: "外面在下雨", pinyin: "wàimiàn zài xiàyǔ", meaningPrompt: "Bên ngoài đang mưa", correct: false, explanation: "Âm thanh đọc 下雪 (tuyết rơi), câu hiển thị là 下雨 (mưa) -> Sai." },
    { id: 3, section: "listening", part: 1, type: "judge", audio: "她喜欢喝牛奶。", prompt: "喝牛奶", pinyin: "hē niúnǎi", meaningPrompt: "Uống sữa bò", correct: true, explanation: "Khớp: hē niúnǎi nghĩa là uống sữa bò." },
    { id: 4, section: "listening", part: 1, type: "judge", audio: "火车站离这里很远。", prompt: "离这里很近", pinyin: "lí zhèlǐ hěn jìn", meaningPrompt: "Cách đây rất gần", correct: false, explanation: "Âm thanh đọc 很远 (rất xa), câu ghi 很近 (rất gần) -> Sai." },
    { id: 5, section: "listening", part: 1, type: "judge", audio: "请进，请坐。", prompt: "请坐", pinyin: "qǐng zuò", meaningPrompt: "Mời ngồi", correct: true, explanation: "Khớp: qǐng zuò nghĩa là mời ngồi." },
    { id: 6, section: "listening", part: 1, type: "judge", audio: "妹妹在唱歌。", prompt: "妹妹在跳舞", pinyin: "mèimei zài tiàowǔ", meaningPrompt: "Em gái đang khiêu vũ", correct: false, explanation: "Âm thanh đọc 唱歌 (hát), câu ghi 跳舞 (múa/khiêu vũ) -> Sai." },
    { id: 7, section: "listening", part: 1, type: "judge", audio: "今天是星期日，我不去上班。", prompt: "不用上班", pinyin: "bú yòng shàngbān", meaningPrompt: "Không phải đi làm", correct: true, explanation: "Khớp: hôm nay chủ nhật không đi làm." },
    { id: 8, section: "listening", part: 1, type: "judge", audio: "这块手表太贵了。", prompt: "很便宜", pinyin: "hěn piányi", meaningPrompt: "Rất rẻ", correct: false, explanation: "Âm thanh đọc 太贵了 (quá đắt), câu ghi 很便宜 (rất rẻ) -> Sai." },
    { id: 9, section: "listening", part: 1, type: "judge", audio: "医生让我多喝温水。", prompt: "多喝水", pinyin: "duō hē shuǐ", meaningPrompt: "Uống nhiều nước", correct: true, explanation: "Khớp: bác sĩ dặn uống nhiều nước." },
    { id: 10, section: "listening", part: 1, type: "judge", audio: "他坐飞机去北京旅游了。", prompt: "坐火车", pinyin: "zuò huǒchē", meaningPrompt: "Đi tàu hỏa", correct: false, explanation: "Âm thanh đọc 坐飞机 (đi máy bay), câu ghi 坐火车 (đi tàu hỏa) -> Sai." },

    // Phần 1.2: Chọn đáp án đúng qua hình ảnh / nội dung (Câu 11-20)
    { id: 11, section: "listening", part: 2, type: "choice", audio: "你在找什么呢？——我的自行车。", question: "男的在找什么？", options: ["A. 钥匙 (Chìa khóa)", "B. 自行车 (Xe đạp)", "C. 手机 (Điện thoại)"], correct: 1, explanation: "Người nam tìm xe đạp (自行车)." },
    { id: 12, section: "listening", part: 2, type: "choice", audio: "今天天气真好，我们去踢足球吧。", question: "他们打算去做什么？", options: ["A. 踢足球 (Đá bóng)", "B. 打篮球 (Chơi bóng rổ)", "C. 游泳 (Bơi lội)"], correct: 0, explanation: "Họ rủ nhau đi đá bóng (踢足球)." },
    { id: 13, section: "listening", part: 2, type: "choice", audio: "服务员，请给我们两杯咖啡。", question: "他们想要什么？", options: ["A. 两杯茶 (2 cốc trà)", "B. 两瓶水 (2 chai nước)", "C. 两杯咖啡 (2 cốc cà phê)"], correct: 2, explanation: "Gọi 2 cốc cà phê (两杯咖啡)." },
    { id: 14, section: "listening", part: 2, type: "choice", audio: "你哥哥多大了？——他今年二十五岁。", question: "哥哥今年几岁？", options: ["A. 20岁", "B. 25岁", "C. 30岁"], correct: 1, explanation: "Người nam nói 25 tuổi (二十五岁)." },
    { id: 15, section: "listening", part: 2, type: "choice", audio: "这件红色的衣服真好看。", question: "衣服是什么颜色的？", options: ["A. 红色 (Màu đỏ)", "B. 白色 (Màu trắng)", "C. 黑色 (Màu đen)"], correct: 0, explanation: "Áo màu đỏ (红色)." },
    { id: 16, section: "listening", part: 2, type: "choice", audio: "明天早上八点半我们在校门口见。", question: "他们什么时候见面？", options: ["A. 8:00", "B. 8:30", "C. 9:00"], correct: 1, explanation: "Hẹn gặp lúc 8 giờ rưỡi (八点半)." },
    { id: 17, section: "listening", part: 2, type: "choice", audio: "西瓜两块钱一斤，很甜。", question: "什么东西很甜？", options: ["A. 苹果 (Táo)", "B. 香蕉 (Chuối)", "C. 西瓜 (Dưa hấu)"], correct: 2, explanation: "Dưa hấu rất ngọt (西瓜很甜)." },
    { id: 18, section: "listening", part: 2, type: "choice", audio: "你在看什么呢？——在看今天的报纸。", question: "他在看什么？", options: ["A. 电影 (Phim)", "B. 报纸 (Báo chí)", "C. 电视 (Tivi)"], correct: 1, explanation: "Đang xem báo (报纸)." },
    { id: 19, section: "listening", part: 2, type: "choice", audio: "这道题太难了，我不会做。", question: "这道题怎么样？", options: ["A. 很难 (Rất khó)", "B. 很容易 (Rất dễ)", "C. 很有意思 (Rất thú vị)"], correct: 0, explanation: "Câu hỏi này quá khó (太难了)." },
    { id: 20, section: "listening", part: 2, type: "choice", audio: "妈妈正在厨房做鱼呢。", question: "妈妈在做什么？", options: ["A. 买鱼 (Mua cá)", "B. 做鱼 (Nấu cá)", "C. 吃水果 (Ăn hoa quả)"], correct: 1, explanation: "Mẹ đang nấu món cá (做鱼)." },

    // Phần 1.3: Đối thoại 2 người, hỏi chi tiết (Câu 21-30)
    { id: 21, section: "listening", part: 3, type: "choice", audio: "男：你看见我的猫了吗？女：在桌子下面睡觉呢。", question: "猫在做什么？", options: ["A. 吃东西 (Ăn đồ)", "B. 玩儿 (Chơi)", "C. 睡觉 (Ngủ)"], correct: 2, explanation: "Mèo đang ngủ dưới bàn (在桌子下面睡觉)." },
    { id: 22, section: "listening", part: 3, type: "choice", audio: "女：你想喝点儿什么？男：给我一杯热水吧，我有点儿感冒。", question: "男的怎么了？", options: ["A. 累了 (Mệt)", "B. 感冒了 (Bị cảm)", "C. 饿了 (Đói)"], correct: 1, explanation: "Người nam bị cảm (感冒了)." },
    { id: 23, section: "listening", part: 3, type: "choice", audio: "男：这块手表是新买的吗？女：不是，是我去年生日妈妈送的。", question: "手表是谁送的？", options: ["A. 妈妈 (Mẹ)", "B. 爸爸 (Bố)", "C. 朋友 (Bạn bè)"], correct: 0, explanation: "Mẹ tặng sinh nhật năm ngoái (妈妈送的)." },
    { id: 24, section: "listening", part: 3, type: "choice", audio: "女：我们走着去超市吧。男：太远了，还是坐公共汽车吧。", question: "男的想怎么去超市？", options: ["A. 走路 (Đi bộ)", "B. 开车 (Lái xe)", "C. 坐公共汽车 (Đi xe buýt)"], correct: 2, explanation: "Người nam muốn đi xe buýt (坐公共汽车)." },
    { id: 25, section: "listening", part: 3, type: "choice", audio: "男：今天下午有考试，你准备好了吗？女：准备好了，别担心。", question: "女的准备得怎么样？", options: ["A. 没准备好 (Chưa chuẩn bị tốt)", "B. 准备好了 (Chuẩn bị xong rồi)", "C. 不想考 (Không muốn thi)"], correct: 1, explanation: "Nữ nói đã chuẩn bị tốt rồi (准备好了)." },
    { id: 26, section: "listening", part: 3, type: "choice", audio: "女：你每天几点起床？男：我六点起床，然后去跑步。", question: "男的起床后做什么？", options: ["A. 吃早饭 (Ăn sáng)", "B. 跑步 (Chạy bộ)", "C. 看书 (Đọc sách)"], correct: 1, explanation: "Sau khi dậy thì đi chạy bộ (然后去跑步)." },
    { id: 27, section: "listening", part: 3, type: "choice", audio: "男：张老师在办公室吗？女：他去教室上课了。", question: "张老师在哪儿？", options: ["A. 办公室 (Văn phòng)", "B. 教室 (Lớp học)", "C. 家里 (Ở nhà)"], correct: 1, explanation: "Thầy Trương đi lớp học rồi (去教室上课了)." },
    { id: 28, section: "listening", part: 3, type: "choice", audio: "女：这个电影好看吗？男：非常有意思，大家都喜欢。", question: "这个电影怎么样？", options: ["A. 不好看 (Không hay)", "B. 太长了 (Quá dài)", "C. 很有意思 (Rất thú vị)"], correct: 2, explanation: "Phim rất hay và thú vị (非常有意思)." },
    { id: 29, section: "listening", part: 3, type: "choice", audio: "男：我们星期六去爬山，怎么样？女：好啊，几点出发？", question: "他们打算星期几去爬山？", options: ["A. 星期五 (Thứ 6)", "B. 星期六 (Thứ 7)", "C. 星期日 (Chủ nhật)"], correct: 1, explanation: "Họ hẹn thứ 7 đi leo núi (星期六)." },
    { id: 30, section: "listening", part: 3, type: "choice", audio: "女：你的汉语说得真好！男：谢谢，我学了一年了。", question: "男的学了多长时间汉语？", options: ["A. 一个月 (1 tháng)", "B. 半年 (Nửa năm)", "C. 一年 (1 năm)"], correct: 2, explanation: "Nam học tiếng Trung được 1 năm (学了一年了)." },

    // Phần 1.4: Đoạn thoại dài / phát biểu ngắn (Câu 31-35)
    { id: 31, section: "listening", part: 4, type: "choice", audio: "明天是王朋的生日，我们打算在饭馆为他庆祝，还要买一个大蛋糕。", question: "他们为什么要买蛋糕？", options: ["A. 庆祝生日 (Mừng sinh nhật)", "B. 庆祝新年 (Mừng năm mới)", "C. 找工作 (Tìm việc làm)"], correct: 0, explanation: "Mua bánh ngọt để mừng sinh nhật Vương Bằng." },
    { id: 32, section: "listening", part: 4, type: "choice", audio: "虽然今天下大雨，天气很冷，但是教室里所有的学生都到了，没有一个人迟到。", question: "今天谁迟到了？", options: ["A. 老师 (Thầy giáo)", "B. 一个学生 (Một học sinh)", "C. 没有人 (Không có ai)"], correct: 2, explanation: "Không có ai đi muộn (没有一个人迟到)." },
    { id: 33, section: "listening", part: 4, type: "choice", audio: "我最喜欢的水果是西瓜，夏天吃西瓜最舒服，不仅甜而且水很多。", question: "他最喜欢什么水果？", options: ["A. 苹果 (Táo)", "B. 西瓜 (Dưa hấu)", "C. 葡萄 (Nho)"], correct: 1, explanation: "Hoa quả thích nhất là dưa hấu (最喜欢的水果是西瓜)." },
    { id: 34, section: "listening", part: 4, type: "choice", audio: "小李生病住院了，我们下午四点一起去医院看他，买点儿水果带过去吧。", question: "他们下午去哪儿？", options: ["A. 医院 (Bệnh viện)", "B. 学校 (Trường học)", "C. 商店 (Cửa hàng)"], correct: 0, explanation: "Đến bệnh viện thăm Tiểu Lý (去医院看他)." },
    { id: 35, section: "listening", part: 4, type: "choice", audio: "我每天早上七点起床，吃完早饭后走路上学，八点开始上第一节课。", question: "他怎么去上学？", options: ["A. 坐车 (Đi xe)", "B. 走路 (Đi bộ)", "C. 骑自行车 (Đi xe đạp)"], correct: 1, explanation: "Đi bộ đi học (走路上学)." },

    /* ================= PHẦN 2: ĐỌC HIỂU (阅读) 25 CÂU ================= */
    // Phần 2.1: Nối ý nghĩa / nhận định tranh (Câu 36-40)
    { id: 36, section: "reading", part: 1, type: "choice", question: "外面下着雪，天气非常冷，出门要多穿点儿衣服。", options: ["A. 天气晴朗 (Trời quang đãng)", "B. 天气寒冷下雪 (Trời lạnh có tuyết)", "C. 天气很热 (Trời rất nóng)"], correct: 1, explanation: "Câu văn miêu tả tuyết rơi, trời rất lạnh (下着雪，天气非常冷)." },
    { id: 37, section: "reading", part: 1, type: "choice", question: "这家饭馆的菜很好吃，服务员也很有礼貌。", options: ["A. 菜不好吃 (Món không ngon)", "B. 饭馆服务不好 (Phục vụ không tốt)", "C. 菜好吃且服务好 (Món ngon & phục vụ chu đáo)"], correct: 2, explanation: "Món ăn ngon và nhân viên phục vụ rất lịch sự." },
    { id: 38, section: "reading", part: 1, type: "choice", question: "李老师在黑板上写了几个汉字，让大家读一读。", options: ["A. 李老师在写汉字 (Thầy Lý đang viết chữ Hán)", "B. 大家在唱歌 (Mọi người đang hát)", "C. 李老师在跑步 (Thầy Lý đang chạy)"], correct: 0, explanation: "Thầy Lý viết chữ Hán lên bảng đen (在黑板上写了几个汉字)." },
    { id: 39, section: "reading", part: 1, type: "choice", question: "妹妹今天穿了一条白色的裙子，非常漂亮。", options: ["A. 妹妹穿黑裤子 (Em gái mặc quần đen)", "B. 妹妹穿白裙子 (Em gái mặc váy trắng)", "C. 妹妹买红衣服 (Em gái mua áo đỏ)"], correct: 1, explanation: "Em gái mặc một chiếc váy màu trắng (白色的裙子)." },
    { id: 40, section: "reading", part: 1, type: "choice", question: "医生说我的身体没什么问题，多休息两天就好了。", options: ["A. 生了重病 (Bị bệnh nặng)", "B. 身体没大问题 (Sức khỏe không vấn đề lớn)", "C. 要立刻去住院 (Phải nhập viện ngay)"], correct: 1, explanation: "Bác sĩ bảo cơ thể không vấn đề gì lớn, nghỉ ngơi 2 ngày là khỏi." },

    // Phần 2.2: Điền từ vào chỗ trống (Câu 41-45)
    { id: 41, section: "reading", part: 2, type: "choice", question: "这本词典很（ ），对我学汉语很有帮助。", options: ["A. 有用 (Hữu ích)", "B. 便宜 (Rẻ)", "C. 慢 (Chậm)"], correct: 0, explanation: "Cuốn từ điển này rất hữu ích (有用), giúp ích nhiều cho việc học." },
    { id: 42, section: "reading", part: 2, type: "choice", question: "虽然工作很累，但是他（ ）很高兴。", options: ["A. 已经 (Đã)", "B. 仍然 (Vẫn)", "C. 正在 (Đang)"], correct: 1, explanation: "Tuy công việc mệt nhưng anh ấy vẫn rất vui (仍然很高兴)." },
    { id: 43, section: "reading", part: 2, type: "choice", question: "你（ ）一下，门外是谁在敲门？", options: ["A. 看 (Xem)", "B. 听 (Nghe)", "C. 说 (Nói)"], correct: 1, explanation: "Bạn nghe thử xem (听一下), ngoài cửa ai đang gõ cửa." },
    { id: 44, section: "reading", part: 2, type: "choice", question: "从学校到火车站，（ ）出租车只要十五分钟。", options: ["A. 走 (Đi bộ)", "B. 坐 (Ngồi, đi)", "C. 骑 (Cưỡi, đạp)"], correct: 1, explanation: "Đi xe taxi dùng động từ 坐 (坐出租车)." },
    { id: 45, section: "reading", part: 2, type: "choice", question: "时间不早了，我们（ ）走吧。", options: ["A. 马上 (Ngay lập tức)", "B. 过去 (Quá khứ)", "C. 以前 (Trước đây)"], correct: 0, explanation: "Thời gian không còn sớm, chúng ta đi ngay thôi (马上走吧)." },

    // Phần 2.3: Ghép câu hỏi - đáp logic (Câu 46-50)
    { id: 46, section: "reading", part: 3, type: "choice", question: "问：“请问，洗手间在哪儿？”——答：（ ）", options: ["A. 在前面右拐 (Ở phía trước rẽ phải)", "B. 昨天买的 (Hôm qua mua)", "C. 两个人 (Hai người)"], correct: 0, explanation: "Hỏi địa điểm nhà vệ sinh -> Đáp chỉ đường (在前面右拐)." },
    { id: 47, section: "reading", part: 3, type: "choice", question: "问：“你喜欢吃中国菜还是西餐？”——答：（ ）", options: ["A. 我喜欢中国菜 (Tôi thích món Trung Quốc)", "B. 一共三十块 (Tổng cộng 30 tệ)", "C. 他很好 (Anh ấy rất tốt)"], correct: 0, explanation: "Câu hỏi lựa chọn đồ ăn -> Đáp chọn món Trung Quốc (我喜欢中国菜)." },
    { id: 48, section: "reading", part: 3, type: "choice", question: "问：“今天晚上你去看电影吗？”——答：（ ）", options: ["A. 电影院很大 (Rạp rất to)", "B. 我有事，不去了 (Tôi bận việc, không đi nữa)", "C. 是星期一 (Là thứ 2)"], correct: 1, explanation: "Hỏi có đi xem phim không -> Đáp từ chối vì có việc (我有事，不去了)." },
    { id: 49, section: "reading", part: 3, type: "choice", question: "问：“祝你生日快乐！”——答：（ ）", options: ["A. 没关系 (Không sao)", "B. 谢谢你！(Cảm ơn bạn!)", "C. 再见 (Tạm biệt)"], correct: 1, explanation: "Nhận lời chúc mừng sinh nhật -> Đáp cảm ơn (谢谢你)." },
    { id: 50, section: "reading", part: 3, type: "choice", question: "问：“这本书你看完了吗？”——答：（ ）", options: ["A. 还没呢，还有三十页 (Chưa xong, còn 30 trang)", "B. 是一百块 (Là 100 tệ)", "C. 我写完了 (Tôi viết xong rồi)"], correct: 0, explanation: "Hỏi đã đọc xong sách chưa -> Đáp chưa xong, còn 30 trang." },

    // Phần 2.4: Đọc hiểu đoạn văn ngắn (Câu 51-60)
    { id: 51, section: "reading", part: 4, type: "choice", question: "小王在北京工作了三年，现在他的汉语说得非常流利。小王在哪里工作？", options: ["A. 上海 (Thượng Hải)", "B. 北京 (Bắc Kinh)", "C. 广州 (Quảng Châu)"], correct: 1, explanation: "Tiểu Vương làm việc ở Bắc Kinh (在北京工作了三年)." },
    { id: 52, section: "reading", part: 4, type: "choice", question: "昨天下午小明买了两斤苹果和一斤香蕉，一共花了二十块钱。小明花了多少钱？", options: ["A. 10块", "B. 15块", "C. 20块"], correct: 2, explanation: "Tổng cộng tiêu hết 20 tệ (一共花了二十块钱)." },
    { id: 53, section: "reading", part: 4, type: "choice", question: "妈妈说喝牛奶对身体好，所以弟弟每天早饭都要喝一杯热牛奶。弟弟早饭喝什么？", options: ["A. 豆浆 (Sữa đậu nành)", "B. 热牛奶 (Sữa bò nóng)", "C. 咖啡 (Cà phê)"], correct: 1, explanation: "Mỗi sáng em trai đều uống 1 cốc sữa bò nóng (喝一杯热牛奶)." },
    { id: 54, section: "reading", part: 4, type: "choice", question: "飞机今天下午两点起飞，我们最好十二点半就到机场。他们打算几点到机场？", options: ["A. 12:00", "B. 12:30", "C. 14:00"], correct: 1, explanation: "Tốt nhất 12 giờ rưỡi đến sân bay (十二点半就到机场)." },
    { id: 55, section: "reading", part: 4, type: "choice", question: "大卫喜欢运动，他每天早晨六点去公园跑步，风雨无阻。大卫在公园做什么？", options: ["A. 散步 (Đi dạo)", "B. 跑步 (Chạy bộ)", "C. 打太极 (Tập thái cực quyền)"], correct: 1, explanation: "David đến công viên chạy bộ (去公园跑步)." },
    { id: 56, section: "reading", part: 4, type: "choice", question: "这张桌子比那张椅子贵一百块钱。椅子是一百五十块，桌子多少钱？", options: ["A. 150块", "B. 200块", "C. 250块"], correct: 2, explanation: "Ghế 150 tệ, bàn đắt hơn ghế 100 tệ -> Bàn giá 150 + 100 = 250 tệ (两百五十块)." },
    { id: 57, section: "reading", part: 4, type: "choice", question: "虽然今天下雪很冷，但是孩子们在外面堆雪人玩得非常开心。孩子们在做什么？", options: ["A. 堆雪人 (Đắp người tuyết)", "B. 滑冰 (Trượt băng)", "C. 踢足球 (Đá bóng)"], correct: 0, explanation: "Bọn trẻ đắp người tuyết chơi rất vui (在外面堆雪人)." },
    { id: 58, section: "reading", part: 4, type: "choice", question: "玛丽去超市买了面包、鸡蛋和西瓜，但是她忘了买牛奶。玛丽没买什么？", options: ["A. 面包 (Bánh mì)", "B. 西瓜 (Dưa hấu)", "C. 牛奶 (Sữa bò)"], correct: 2, explanation: "Mary quên mua sữa bò (忘了买牛奶)." },
    { id: 59, section: "reading", part: 4, type: "choice", question: "李老师教我们汉语已经两年了，他讲课非常认真，大家都喜欢上他的课。李老师教什么？", options: ["A. 英语 (Tiếng Anh)", "B. 汉语 (Tiếng Trung)", "C. 历史 (Lịch sử)"], correct: 1, explanation: "Thầy Lý dạy tiếng Trung (教我们汉语)." },
    { id: 60, section: "reading", part: 4, type: "choice", question: "明天是星期六，小红打算去图书馆借两本中文小说看。小红明天去哪儿？", options: ["A. 图书馆 (Thư viện)", "B. 电影院 (Rạp phim)", "C. 书店 (Hiệu sách)"], correct: 0, explanation: "Tiểu Hồng dự định đến thư viện (去图书馆)." }
  ]
};

// Đọc exam-data.js hiện có và bổ sung HSK2_EXAM_PRACTICE
let currentExamData = fs.readFileSync("exam-data.js", "utf8");

// Bỏ đoạn export cũ nếu có
currentExamData = currentExamData.replace(/if \(typeof window !== "undefined"\)[\s\S]*$/, "");

const newContent = currentExamData.trim() + "\n\n" +
  "const HSK2_EXAM_PRACTICE = " + JSON.stringify(HSK2_EXAM, null, 2) + ";\n\n" +
  'if (typeof window !== "undefined") {\n' +
  '  window.HSK1_EXAM_PRACTICE = HSK1_EXAM_PRACTICE;\n' +
  '  window.HSK2_EXAM_PRACTICE = HSK2_EXAM_PRACTICE;\n' +
  '  window.HSK_EXAMS = { 1: HSK1_EXAM_PRACTICE, 2: HSK2_EXAM_PRACTICE };\n' +
  '}\n' +
  'if (typeof module !== "undefined") {\n' +
  '  module.exports = HSK1_EXAM_PRACTICE;\n' +
  '  module.exports.HSK1 = HSK1_EXAM_PRACTICE;\n' +
  '  module.exports.HSK2 = HSK2_EXAM_PRACTICE;\n' +
  '  module.exports.HSK_EXAMS = { 1: HSK1_EXAM_PRACTICE, 2: HSK2_EXAM_PRACTICE };\n' +
  '}\n';

fs.writeFileSync("exam-data.js", newContent, "utf8");
console.log("Đã cập nhật exam-data.js với đề thi thử HSK 2 chuẩn 60 câu!");
