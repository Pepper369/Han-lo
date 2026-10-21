export interface DialogueTurn {
  id: number;
  speaker: 'A' | 'B';
  h: string;
  p: string;
  hv: string;
  vi: string;
  suggestedAnswers?: string[];
}

export interface ConversationScenario {
  id: string;
  title: string;
  category: string;
  level: number;
  icon: string;
  description: string;
  roleA: string;
  roleB: string;
  turns: DialogueTurn[];
}

export const CONVERSATION_SCENARIOS: ConversationScenario[] = [
  {
    id: "sc_greet",
    title: "Chào Hỏi & Làm Quen",
    category: "Đời sống hàng ngày",
    level: 1,
    icon: "🤝",
    description: "Cách xưng hô lịch sự, hỏi thăm tên tuổi và quốc tịch khi lần đầu gặp gỡ.",
    roleA: "Du học sinh (Lý Minh)",
    roleB: "Bạn cùng lớp (Trương Vĩ)",
    turns: [
      {
        id: 1,
        speaker: 'A',
        h: "你好！请问你叫什么名字？",
        p: "nǐ hǎo! qǐng wèn nǐ jiào shén me míng zi?",
        hv: "NHĨ HẢO! THỈNH VẤN NHĨ KHIẾU THẬP MA MINH TỰ?",
        vi: "Xin chào! Xin hỏi bạn tên là gì?",
        suggestedAnswers: ["你好！我叫张伟。", "我叫李明，你呢？"]
      },
      {
        id: 2,
        speaker: 'B',
        h: "你好！我叫张伟。很高兴认识你！",
        p: "nǐ hǎo! wǒ jiào zhāng wěi. hěn gāo xìng rèn shi nǐ!",
        hv: "NHĨ HẢO! NGÃ KHIẾU TRƯƠNG VĨ. HẨN CAO HỨNG NHẬN THỨC NHĨ!",
        vi: "Chào bạn! Tôi tên là Trương Vĩ. Rất vui được quen biết bạn!"
      },
      {
        id: 3,
        speaker: 'A',
        h: "认识你我也很高兴。你是哪国人？",
        p: "rèn shi nǐ wǒ yě hěn gāo xìng. nǐ shì nǎ guó rén?",
        hv: "NHẬN THỨC NHĨ NGÃ DÃ HẨN CAO HỨNG. NHĨ THỊ NÁ QUỐC NHÂN?",
        vi: "Quen bạn tôi cũng rất vui. Bạn là người nước nào?",
        suggestedAnswers: ["我是中国人。", "我是越南人。"]
      },
      {
        id: 4,
        speaker: 'B',
        h: "我是中国人。你也是学生吗？",
        p: "wǒ shì zhōng guó rén. nǐ yě shì xué sheng ma?",
        hv: "NGÃ THỊ TRUNG QUỐC NHÂN. NHĨ DÃ THỊ HỌC SINH MA?",
        vi: "Tôi là người Trung Quốc. Bạn cũng là học sinh à?"
      },
      {
        id: 5,
        speaker: 'A',
        h: "对，我是留学生，我学习汉语。",
        p: "duì, wǒ shì liú xué shēng, wǒ xué xí hàn yǔ.",
        hv: "ĐỐI, NGÃ THỊ LƯU HỌC SINH, NGÃ HỌC TẬP HÁN NGỮ.",
        vi: "Đúng vậy, tôi là du học sinh, tôi học tiếng Trung.",
        suggestedAnswers: ["对，我是留学生。", "是的，我在这里上大学。"]
      },
      {
        id: 6,
        speaker: 'B',
        h: "太好了！以后我们可以一起练习口语。",
        p: "tài hǎo le! yǐ hòu wǒ men kě yǐ yì qǐ liàn xí kǒu yǔ.",
        hv: "THÁI HẢO LIỄU! DĨ HẬU NGÃ MÔN KHẢ DĨ NHẤT KHỞI LUYỆN TẬP KHẨU NGỮ.",
        vi: "Tuyệt quá! Sau này chúng ta có thể cùng nhau luyện khẩu ngữ."
      }
    ]
  },
  {
    id: "sc_restaurant",
    title: "Gọi Món Tại Nhà Hàng",
    category: "Ẩm thực",
    level: 1,
    icon: "🍜",
    description: "Thực hành gọi món, hỏi món đặc sắc, dặn không cho ớt và thanh toán.",
    roleA: "Khách ăn (Thực khách)",
    roleB: "Phục vụ viên (Nhân viên quán)",
    turns: [
      {
        id: 1,
        speaker: 'B',
        h: "欢迎光临！请问几位？",
        p: "huān yíng guāng lín! qǐng wèn jǐ wèi?",
        hv: "HOAN NGHÊNH QUANG LÂM! THỈNH VẤN KỶ VỊ?",
        vi: "Nhiệt liệt chào mừng! Xin hỏi quý khách đi mấy người ạ?"
      },
      {
        id: 2,
        speaker: 'A',
        h: "两位，请给我们菜单。",
        p: "liǎng wèi, qǐng gěi wǒ men cài dān.",
        hv: "LƯỠNG VỊ, THỈNH CẤP NGÃ MÔN THÁI ĐƠN.",
        vi: "Hai người, xin cho chúng tôi thực đơn.",
        suggestedAnswers: ["两位，有靠窗的桌子吗？", "我们两个人。"]
      },
      {
        id: 3,
        speaker: 'B',
        h: "好的，这是菜单。请问想吃点儿什么？",
        p: "hǎo de, zhè shì cài dān. qǐng wèn xiǎng chī diǎnr shén me?",
        hv: "HẢO ĐÍCH, GIÁ THỊ THÁI ĐƠN. THỈNH VẤN TƯỞNG NGẪN ĐIỂM THẬP MA?",
        vi: "Vâng, đây là thực đơn. Xin hỏi quý khách muốn dùng món gì?"
      },
      {
        id: 4,
        speaker: 'A',
        h: "我们要一份宫保鸡丁和一份饺子，请不要太辣。",
        p: "wǒ men yào yí fèn gōng bǎo jī dīng hé yí fèn jiǎo zi, qǐng bú yào tài là.",
        hv: "NGÃ MÔN YẾU NHẤT PHẦN CUNG BẢO KÊ ĐINH HÒA NHẤT PHẦN GIẢO TỬ, THỈNH BẤT YẾU THÁI LẠT.",
        vi: "Cho chúng tôi một suất gà Cung Bảo và một đĩa sủi cảo, xin đừng làm cay quá nhé.",
        suggestedAnswers: ["我们要一碗米饭。", "一份牛肉面，不要辣。"]
      },
      {
        id: 5,
        speaker: 'B',
        h: "没问题。还需要喝点儿什么饮料吗？",
        p: "méi wèn tí. hái xū yào hē diǎnr shén me yǐn liào ma?",
        hv: "MỘT VẤN ĐỀ. HOÀN NHU YẾU HÁT ĐIỂM THẬP MA ẨM LIỆU MA?",
        vi: "Không thành vấn đề. Quý khách có cần dùng thêm đồ uống gì không ạ?"
      },
      {
        id: 6,
        speaker: 'A',
        h: "来一壶热绿茶，谢谢！",
        p: "lái yì hú rè lǜ chá, xiè xie!",
        hv: "LAI NHẤT HỒ NHIỆT LỤC TRÀ, TẠ TẠ!",
        vi: "Cho một ấm trà xanh nóng nhé, cảm ơn!",
        suggestedAnswers: ["请来两瓶矿泉水。", "不用了，谢谢。"]
      },
      {
        id: 7,
        speaker: 'A',
        h: "服务员，买单！一共多少钱？",
        p: "fú wù yuán, mǎi dān! yí gòng duō shao qián?",
        hv: "PHỤC VỤ VIÊN, MÃI ĐƠN! NHẤT CỘNG ĐA THIẾU TIỀN?",
        vi: "Phục vụ ơi, tính tiền! Tổng cộng hết bao nhiêu tiền vậy?",
        suggestedAnswers: ["请问可以用微信支付吗？", "买单！"]
      },
      {
        id: 8,
        speaker: 'B',
        h: "一共六十八块。您可以扫码支付。",
        p: "yí gòng liù shí bā kuài. nín kě yǐ sǎo mǎ zhī fù.",
        hv: "NHẤT CỘNG LỤC THẬP BÁT KHỐI. NÂM KHẢ DĨ TẢO MÃ CHI PHỤ.",
        vi: "Tổng cộng 68 tệ ạ. Quý khách có thể quét mã thanh toán."
      }
    ]
  },
  {
    id: "sc_taxi",
    title: "Đi Taxi & Hỏi Đường",
    category: "Di chuyển",
    level: 2,
    icon: "🚖",
    description: "Cách nói địa chỉ với bác tài, hướng dẫn rẽ và yêu cầu dừng xe xuất hóa đơn.",
    roleA: "Hành khách",
    roleB: "Bác tài xế Taxi",
    turns: [
      {
        id: 1,
        speaker: 'B',
        h: "你好，请问去哪儿？",
        p: "nǐ hǎo, qǐng wèn qù nǎr?",
        hv: "NHĨ HẢO, THỈNH VẤN KHỨ NÁ NHI?",
        vi: "Chào bạn, xin hỏi bạn đi đâu?"
      },
      {
        id: 2,
        speaker: 'A',
        h: "师傅，我想去北京火车站，大概要多长时间？",
        p: "shī fu, wǒ xiǎng qù běi jīng huǒ chē zhàn, dà gài yào duō cháng shí jiān?",
        hv: "SƯ PHÓ, NGÃ TƯỞNG KHỨ BẮC KINH HỎA XA TRẠM, ĐẠI KHÁI YẾU ĐA TRƯỜNG THỜI GIAN?",
        vi: "Bác tài ơi, cháu muốn đến ga tàu Bắc Kinh, mất khoảng bao lâu ạ?",
        suggestedAnswers: ["师傅，去首都机场。", "去王府井大街。"]
      },
      {
        id: 3,
        speaker: 'B',
        h: "现在有点儿堵车，大约需要半个小时。",
        p: "xiàn zài yǒu diǎnr dǔ chē, dà yuē xū yào bàn ge xiǎo shí.",
        hv: "HIỆN TẠI HỮU ĐIỂM ĐỔ XA, ĐẠI ƯỚC NHU YẾU BÁN CÁ TIỂU THỜI.",
        vi: "Giờ này hơi tắc đường một chút, khoảng chừng nửa tiếng nhé."
      },
      {
        id: 4,
        speaker: 'A',
        h: "好的。师傅，前边十字路口请右拐。",
        p: "hǎo de. shī fu, qián biān shí zì lù kǒu qǐng yòu guǎi.",
        hv: "HẢO ĐÍCH. SƯ PHÓ, TIỀN BIÊN THẬP TỰ LỘ KHẨU THỈNH HỮU QUẢI.",
        vi: "Vâng ạ. Bác tài ơi, đến ngã tư phía trước xin rẽ phải nhé.",
        suggestedAnswers: ["请在这里靠边停车。", "请直走。"]
      },
      {
        id: 5,
        speaker: 'B',
        h: "到了，火车站就在马路对面。",
        p: "dào le, huǒ chē zhàn jiù zài mǎ lù duì miàn.",
        hv: "ĐÁO LIỄU, HỎA XA TRẠM TỰU TẠI MÃ LỘ ĐỐI DIỆN.",
        vi: "Đến nơi rồi, ga tàu hỏa nằm ngay ở đối diện bên kia đường nhé."
      },
      {
        id: 6,
        speaker: 'A',
        h: "好的，给您钱。请给我发票，谢谢！",
        p: "hǎo de, gěi nín qián. qǐng gěi wǒ fā piào, xiè xie!",
        hv: "HẢO ĐÍCH, CẤP NÂM TIỀN. THỈNH CẤP NGÃ PHÁT PHIẾU, TẠ TẠ!",
        vi: "Vâng, gửi bác tiền ạ. Bác cho cháu xin hóa đơn nhé, cảm ơn bác!",
        suggestedAnswers: ["谢谢师傅，再见！", "好的，不用找了。"]
      }
    ]
  },
  {
    id: "sc_shopping",
    title: "Mua Sắm & Mặc Cả Ở Chợ",
    category: "Mua sắm",
    level: 2,
    icon: "🛍️",
    description: "Thực hành hỏi giá tiền, thử size quần áo, khen chê và mặc cả thông minh.",
    roleA: "Người mua hàng",
    roleB: "Chủ sạp bán hàng",
    turns: [
      {
        id: 1,
        speaker: 'A',
        h: "老板，请问这件黑色的大衣多少钱？",
        p: "lǎo bǎn, qǐng wèn zhè jiàn hēi sè de dà yī duō shao qián?",
        hv: "LÃO BẢN, THỈNH VẤN GIÁ KIỆN HẮC SẮC ĐÍCH ĐẠI Y ĐA THIẾU TIỀN?",
        vi: "Ông chủ ơi, xin hỏi chiếc áo khoác đen này giá bao nhiêu tiền vậy?",
        suggestedAnswers: ["这件衣服可以试一下吗？", "老板，这个怎么卖？"]
      },
      {
        id: 2,
        speaker: 'B',
        h: "这件质量非常好，三百八十块。",
        p: "zhè jiàn zhì liàng fēi cháng hǎo, sān bǎi bā shí kuài.",
        hv: "GIÁ KIỆN CHÍ LƯỢNG PHI THƯỜNG HẢO, TAM BÁCH BÁT THẬP KHỐI.",
        vi: "Chiếc này chất lượng vô cùng xịn xò đấy, 380 tệ nha."
      },
      {
        id: 3,
        speaker: 'A',
        h: "太贵了！便宜一点儿吧，二百块怎么样？",
        p: "tài guì le! pián yi yì diǎnr ba, èr bǎi kuài zěn me yàng?",
        hv: "THÁI QUÝ LIỄU! TIỆN NGHI NHẤT ĐIỂM BA, NHỊ BÁCH KHỐI CHẨM MA DẠNG?",
        vi: "Đắt quá à! Bớt cho tôi một chút đi, 200 tệ được không?",
        suggestedAnswers: ["能打个折吗？", "最低多少钱卖？"]
      },
      {
        id: 4,
        speaker: 'B',
        h: "二百太少了，进价都拿不到！二百六，最低了！",
        p: "èr bǎi tài shǎo le, jìn jià dōu ná bú dào! èr bǎi liù, zuì dī le!",
        hv: "NHỊ BÁCH THÁI THIỂU LIỄU, TIẾN GIÁ ĐÔ NOA BẤT ĐÁO! NHỊ BÁCH LỤC, TỐI ĐÊ LIỄU!",
        vi: "200 ít quá, giá nhập còn không lấy nổi ấy! 260 tệ, giá chót rồi đó!"
      },
      {
        id: 5,
        speaker: 'A',
        h: "二百二，可以的话我现在就买。",
        p: "èr bǎi èr, kě yǐ de huà wǒ xiàn zài jiù mǎi.",
        hv: "NHỊ BÁCH NHỊ, KHẢ DĨ ĐÍCH THOẠI NGÃ HIỆN TẠI TỰU MÃI.",
        vi: "220 tệ nhé, nếu được thì tôi lấy luôn bây giờ ạ.",
        suggestedAnswers: ["那我去别家看看。", "行，包起来吧！"]
      },
      {
        id: 6,
        speaker: 'B',
        h: "行吧行吧，看你也是爽快人，卖给你了！",
        p: "xíng ba xíng ba, kàn nǐ yě shì shuǎng kuai rén, mài gěi nǐ le!",
        hv: "HÀNH BA HÀNH BA, KHÁN NHĨ DÃ THỊ SẢNG KHOÁI NHÂN, MẠI CẤP NHĨ LIỄU!",
        vi: "Thôi được rồi, trông bạn cũng là người xởi lởi, bán cho bạn luôn!"
      }
    ]
  },
  {
    id: "sc_hotel",
    title: "Đặt Phòng & Check-in Khách Sạn",
    category: "Du lịch",
    level: 2,
    icon: "🏨",
    description: "Nhận phòng khách sạn, hỏi mật khẩu WiFi, giờ ăn sáng và gửi hành lý.",
    roleA: "Khách du lịch",
    roleB: "Lễ tân khách sạn",
    turns: [
      {
        id: 1,
        speaker: 'A',
        h: "您好，我网上预订了一间大床房。",
        p: "nín hǎo, wǒ wǎng shang yù dìng le yì jiān dà chuáng fáng.",
        hv: "NÂM HẢO, NGÃ VÕNG THƯỢNG DỰ ĐỊNH LIỄU NHẤT GIAN ĐẠI SÀNG PHÒNG.",
        vi: "Chào bạn, tôi đã đặt trước một phòng giường đôi qua mạng rồi.",
        suggestedAnswers: ["请帮我办理入住。", "我想定一间房间。"]
      },
      {
        id: 2,
        speaker: 'B',
        h: "您好！请出示您的护照或身份证，我帮您查一下。",
        p: "nín hǎo! qǐng chū shì nín de hù zhào huò shēn fèn zhèng, wǒ bāng nín chá yí xià.",
        hv: "NÂM HẢO! THỈNH XUẤT THỊ NÂM ĐÍCH HỘ CHIẾU HOẶC THÂN PHẬN CHỨNG, NGÃ BANG NÂM TRA NHẤT HẠ.",
        vi: "Chào quý khách! Xin vui lòng xuất trình hộ chiếu hoặc CCCD, tôi kiểm tra giúp bạn."
      },
      {
        id: 3,
        speaker: 'A',
        h: "好的，给您护照。请问无线网络密码是多少？",
        p: "hǎo de, gěi nín hù zhào. qǐng wèn wú xiàn wǎng luò mì mǎ shì duō shao?",
        hv: "HẢO ĐÍCH, CẤP NÂM HỘ CHIẾU. THỈNH VẤN VÔ TUYẾN VÕNG LẠC MẬT MÃ THỊ ĐA THIẾU?",
        vi: "Vâng, gửi bạn hộ chiếu. Cho tôi hỏi mật khẩu mạng WiFi là gì vậy?",
        suggestedAnswers: ["房间里有热水吗？", "早餐几点开始？"]
      },
      {
        id: 4,
        speaker: 'B',
        h: "WiFi不需要密码，连上酒店名字就可以。这是您的房卡，在八楼808室。",
        p: "WiFi bù xū yào mì mǎ, lián shang jiǔ diàn míng zi jiù kě yǐ. zhè shì nín de fáng kǎ, zài bā lóu 808 shì.",
        hv: "WiFi BẤT NHU YẾU MẬT MÃ, LIÊN THƯỢNG TỬU ĐIẾM MINH TỰ TỰU KHẢ DĨ. GIÁ THỊ NÂM ĐÍCH PHÒNG TẠP, TẠI BÁT LÂU 808 THẤT.",
        vi: "WiFi không cần mật khẩu đâu ạ, kết nối tên khách sạn là được. Đây là thẻ phòng của bạn, phòng 808 tầng 8 nhé."
      },
      {
        id: 5,
        speaker: 'A',
        h: "请问明天早上的早餐是几点到几点？",
        p: "qǐng wèn míng tiān zǎo shang de zǎo cān shì jǐ diǎn dào jǐ diǎn?",
        hv: "THỈNH VẤN MINH THIÊN TẢO THƯỢNG ĐÍCH TẢO XAN THỊ KỶ ĐIỂM ĐÁO KỶ ĐIỂM?",
        vi: "Cho hỏi bữa sáng ngày mai bắt đầu từ mấy giờ đến mấy giờ ạ?",
        suggestedAnswers: ["退房时间是几点？", "餐厅在哪儿？"]
      },
      {
        id: 6,
        speaker: 'B',
        h: "早餐在二楼餐厅，早上七点到九点半。祝您入住愉快！",
        p: "zǎo cān zài èr lóu cān tīng, zǎo shang qī diǎn dào jiǔ diǎn bàn. zhù nín rù zhù yú kuài!",
        hv: "TẢO XAN TẠI NHỊ LÂU XÁN SẢNH, TẢO THƯỢNG THẤT ĐIỂM ĐÁO CỬU ĐIỂM BÁN. CHÚC NÂM NHẬP TRÚ DU KHOÁI!",
        vi: "Bữa sáng ở nhà hàng tầng 2, từ 7 giờ đến 9 giờ rưỡi sáng. Chúc bạn lưu trú vui vẻ!"
      }
    ]
  },
  {
    id: "sc_interview",
    title: "Phỏng Vấn Xin Việc (Job Interview)",
    category: "Công việc",
    level: 3,
    icon: "💼",
    description: "Giới thiệu bản thân chuyên nghiệp, nói về kinh nghiệm làm việc và định hướng nghề nghiệp.",
    roleA: "Ứng viên (Người phỏng vấn)",
    roleB: "Giám đốc nhân sự (HR)",
    turns: [
      {
        id: 1,
        speaker: 'B',
        h: "请进！请先简单做一下自我介绍吧。",
        p: "qǐng jìn! qǐng xiān jiǎn dān zuò yí xià zì wǒ jiè shào ba.",
        hv: "THỈNH TIẾN! THỈNH TIÊN GIẢN ĐƠN TỐ NHẤT HẠ TỰ NGÃ GIỚI THIỆU BA.",
        vi: "Mời vào! Trước hết xin bạn hãy giới thiệu ngắn gọn về bản thân nhé."
      },
      {
        id: 2,
        speaker: 'A',
        h: "您好！我叫阮文南，毕业于河内大学中文系。我有两年的进出口贸易工作经验。",
        p: "nín hǎo! wǒ jiào ruǎn wén nán, bì yè yú hé nèi dà xué zhōng wén xì. wǒ yǒu liǎng nián de jìn chū kǒu mào yì gōng zuò jīng yàn.",
        hv: "NÂM HẢO! NGÃ KHIẾU NGUYỄN VĂN NAM, TẤT NGHIỆP VU HÀ NỘI ĐẠI HỌC TRUNG VĂN HỆ. NGÃ HỮU LƯỠNG NIÊN ĐÍCH TIẾN XUẤT KHẨU MẬU DỊCH CÔNG TÁC KINH NGHIỆM.",
        vi: "Kính chào anh/chị! Tôi tên là Nguyễn Văn Nam, tốt nghiệp khoa Trung văn Đại học Hà Nội. Tôi có 2 năm kinh nghiệm làm việc trong ngành xuất nhập khẩu.",
        suggestedAnswers: ["我喜欢这份工作。", "我的汉语水平达到了HSK 5级。"]
      },
      {
        id: 3,
        speaker: 'B',
        h: "你的中文口语很流利。你为什么想来我们公司工作？",
        p: "nǐ de zhōng wén kǒu yǔ hěn liú lì. nǐ wèi shén me xiǎng lái wǒ men gōng sī gōng zuò?",
        hv: "NHĨ ĐÍCH TRUNG VĂN KHẨU NGỮ HẨN LƯU LỢI. NHĨ VỊ THẬP MA TƯỞNG LAI NGÃ MÔN CÔNG TY CÔNG TÁC?",
        vi: "Khẩu ngữ tiếng Trung của bạn rất lưu loát. Tại sao bạn lại muốn đến công ty chúng tôi làm việc?"
      },
      {
        id: 4,
        speaker: 'A',
        h: "贵公司在这个行业发展非常快，我希望能在这里发挥我的语言和专业优势。",
        p: "guì gōng sī zài zhè ge háng yè fā zhǎn fēi cháng kuài, wǒ xī wàng néng zài zhè lǐ fā huī wǒ de yǔ yán hé zhuān yè yōu shì.",
        hv: "QUÝ CÔNG TY TẠI GIÁ CÁ HÀNG NGHIỆP PHÁT TRIỂN PHI THƯỜNG KHOÁI, NGÃ HI VỌNG NĂNG TẠI GIÁ LÝ PHÁT HUY NGÃ ĐÍCH NGỮ NGÔN HÒA CHUYÊN NGHIỆP ƯU THẾ.",
        vi: "Quý công ty phát triển rất nhanh trong ngành này, tôi hy vọng có thể phát huy thế mạnh ngôn ngữ và chuyên môn của mình tại đây.",
        suggestedAnswers: ["我很认同贵公司的文化。", "我想学习更多新知识。"]
      },
      {
        id: 5,
        speaker: 'B',
        h: "很好！如果有结果，我们人事部会在三天内通知你。",
        p: "hěn hǎo! rú guǒ yǒu jié guǒ, wǒ men rén shì bù huì zài sān tiān nèi tōng zhī nǐ.",
        hv: "HẨN HẢO! NHƯ QUẢ HỮU KẾT QUẢ, NGÃ MÔN NHÂN SỰ BỘ HỘI TẠI TAM THIÊN NỘI THÔNG TRI NHĨ.",
        vi: "Rất tốt! Nếu có kết quả, phòng nhân sự chúng tôi sẽ thông báo cho bạn trong vòng 3 ngày."
      },
      {
        id: 6,
        speaker: 'A',
        h: "非常感谢您抽出宝贵时间面试我。再见！",
        p: "fēi cháng gǎn xiè nín chōu chū bǎo guì shí jiān miàn shì wǒ. zài jiàn!",
        hv: "PHI THƯỜNG CẢM TẠ NÂM TRỪU XUẤT BẢO QUÝ THỜI GIAN DIỆN THỊ NGÃ. TÁI KIẾN!",
        vi: "Rất cảm ơn anh/chị đã dành thời gian quý báu phỏng vấn tôi. Xin chào tạm biệt!",
        suggestedAnswers: ["谢谢您，期待您的好消息！", "再见！"]
      }
    ]
  }
];
