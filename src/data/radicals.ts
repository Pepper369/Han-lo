export interface Radical {
  id: number;
  r: string;
  v: string[];
  s: number;
  p: string;
  hv: string;
  m: string;
  ex: string;
}

export interface Decomposition {
  char?: string;
  parts: string[];
  story: string;
}

export const RADICALS_DATA: Radical[] = [
  // 1 NÉT (6 bộ: 1 - 6)
  { id: 1, r: "一", v: [], s: 1, p: "yī", hv: "NHẤT", m: "Số một, duy nhất, bắt đầu, đồng nhất", ex: "一, 三, 不, 世, 天" },
  { id: 2, r: "丨", v: [], s: 1, p: "gǔn", hv: "CỔN", m: "Nét sổ đứng, thông suốt từ trên xuống", ex: "中, 丰, 串, 临" },
  { id: 3, r: "丶", v: [], s: 1, p: "zhǔ", hv: "CHỦ", m: "Điểm, giọt nước, dấu chấm", ex: "丸, 丹, 主, 太" },
  { id: 4, r: "丿", v: [], s: 1, p: "piě", hv: "PHIỆT", m: "Nét phẩy, quét từ phải qua trái", ex: "九, 乃, 乏, 乘" },
  { id: 5, r: "乙", v: ["乚", "乛"], s: 1, p: "yǐ", hv: "ẤT", m: "Vị trí thứ hai trong Thiên Can, uốn lượn mềm mại", ex: "九, 也, 乞, 乱" },
  { id: 6, r: "亅", v: [], s: 1, p: "jué", hv: "QUYẾT", m: "Nét móc đứng, cái móc câu", ex: "了, 予, 争, 事" },

  // 2 NÉT (23 bộ: 7 - 29)
  { id: 7, r: "二", v: [], s: 2, p: "èr", hv: "NHỊ", m: "Số hai, cân bằng âm dương", ex: "二, 于, 亏, 井, 些" },
  { id: 8, r: "亠", v: [], s: 2, p: "tóu", hv: "ĐẦU", m: "Phần trên cùng, nắp đậy, cái mũ", ex: "亡, 亢, 交, 亥, 亮" },
  { id: 9, r: "人", v: ["亻"], s: 2, p: "rén", hv: "NHÂN", m: "Con người, đứng thẳng 2 chân; 亻 là nhân đứng", ex: "你, 他, 们, 会, 休, 做" },
  { id: 10, r: "儿", v: [], s: 2, p: "ér", hv: "NHI", m: "Đứa trẻ, người đang đi bước nhỏ", ex: "先, 光, 克, 免, 兔" },
  { id: 11, r: "入", v: [], s: 2, p: "rù", hv: "NHẬP", m: "Đi vào, thâm nhập", ex: "入, 内, 全, 两" },
  { id: 12, r: "八", v: ["丷"], s: 2, p: "bā", hv: "BÁT", m: "Số tám, phân chia ra hai bên", ex: "八, 公, 六, 共, 兵, 具" },
  { id: 13, r: "冂", v: [], s: 2, p: "jiōng", hv: "QUYNH", m: "Vùng đất xa xôi ngoài bờ cõi", ex: "冈, 册, 再, 冒, 冕" },
  { id: 14, r: "冖", v: [], s: 2, p: "mì", hv: "MỊCH", m: "Khăn trùm đầu, che phủ kín đáo", ex: "冗, 写, 军, 冠, 冢" },
  { id: 15, r: "冫", v: [], s: 2, p: "bīng", hv: "BĂNG", m: "Băng giá, giọt nước đóng băng lạnh buốt", ex: "冷, 冻, 凉, 决, 净, 冰" },
  { id: 16, r: "几", v: [], s: 2, p: "jī", hv: "KỶ", m: "Cái bàn con, ghế nhỏ", ex: "几, 凡, 凤, 凭, 凰" },
  { id: 17, r: "凵", v: [], s: 2, p: "qū", hv: "KHẢM", m: "Hố đất, lòng trũng mở miệng lên trên", ex: "凶, 出, 击, 函, 凿" },
  { id: 18, r: "刀", v: ["刂"], s: 2, p: "dāo", hv: "ĐAO", m: "Con dao, vũ khí chém gọt; 刂 là đao đứng", ex: "分, 到, 别, 前, 刻, 刚" },
  { id: 19, r: "力", v: [], s: 2, p: "lì", hv: "LỰC", m: "Sức mạnh, bắp tay cuồn cuộn cày cấy", ex: "力, 加, 助, 努, 动, 胜" },
  { id: 20, r: "勹", v: [], s: 2, p: "bāo", hv: "BAO", m: "Bao bọc, ôm lấy quanh mình", ex: "勺, 勾, 包, 勿, 匆" },
  { id: 21, r: "匕", v: [], s: 2, p: "bǐ", hv: "CHỦY", m: "Cái thìa múc cơm, con dao găm nhỏ", ex: "匕, 化, 北, 匙" },
  { id: 22, r: "匚", v: [], s: 2, p: "fāng", hv: "PHƯƠNG", m: "Hộp chứa đồ hình chữ nhật mở nắp bên phải", ex: "匠, 匡, 匣, 匪, 匹" },
  { id: 23, r: "匸", v: [], s: 2, p: "xì", hv: "HỆ", m: "Chỗ giấu kín, che chắn bảo vệ", ex: "匹, 匿, 区" },
  { id: 24, r: "十", v: [], s: 2, p: "shí", hv: "THẬP", m: "Số mười, hoàn chỉnh bốn phương tám hướng", ex: "十, 千, 华, 协, 南, 博" },
  { id: 25, r: "卜", v: [], s: 2, p: "bǔ", hv: "BỐC", m: "Bói toán, vết nứt trên mai rùa khi nung lửa", ex: "卜, 占, 卡, 卢, 卦" },
  { id: 26, r: "卩", v: ["⺋"], s: 2, p: "jié", hv: "TIẾT", m: "Đốt tre, ngọc ấn tín của quan lại", ex: "卫, 却, 即, 卵, 卷" },
  { id: 27, r: "厂", v: [], s: 2, p: "chǎng", hv: "HÁN", m: "Vách núi đá nhô ra làm nơi trú ẩn", ex: "厅, 历, 厌, 原, 厕" },
  { id: 28, r: "厶", v: [], s: 2, p: "sī", hv: "KHỨ", m: "Riêng tư, kín đáo (tự tư tự lợi)", ex: "去, 参, 县, 丢" },
  { id: 29, r: "又", v: [], s: 2, p: "yòu", hv: "HỰU", m: "Bàn tay phải, lặp lại lần nữa", ex: "又, 友, 双, 反, 发, 取" },

  // 3 NÉT (31 bộ: 30 - 60)
  { id: 30, r: "口", v: [], s: 3, p: "kǒu", hv: "KHẨU", m: "Cái miệng, lời nói, ăn uống, cổng vào", ex: "吃, 喝, 叫, 听, 问, 告" },
  { id: 31, r: "囗", v: [], s: 3, p: "wéi", hv: "VI", m: "Bao quanh bốn phía, bờ tường rào khép kín", ex: "国, 四, 回, 因, 团, 园" },
  { id: 32, r: "土", v: [], s: 3, p: "tǔ", hv: "THỔ", m: "Đất đai, mầm cây trồi lên từ lòng đất", ex: "在, 地, 坐, 块, 场, 坏" },
  { id: 33, r: "士", v: [], s: 3, p: "shì", hv: "SĨ", m: "Kẻ sĩ, người có học thức và đức hạnh", ex: "士, 壬, 壮, 声, 壳" },
  { id: 34, r: "夂", v: [], s: 3, p: "zhǐ", hv: "TRUY", m: "Đi sau, bước chân chậm rãi đi tới", ex: "条, 各, 复, 处, 夏" },
  { id: 35, r: "夊", v: [], s: 3, p: "suī", hv: "SUY", m: "Đi chậm chạp, kéo lê bước chân", ex: "冬, 夌" },
  { id: 36, r: "夕", v: [], s: 3, p: "xī", hv: "TỊCH", m: "Buổi chiều tối, trăng khuyết ló dạng", ex: "外, 多, 夜, 够, 梦" },
  { id: 37, r: "大", v: [], s: 3, p: "dà", hv: "ĐẠI", m: "To lớn, hình người dang rộng hai tay hai chân", ex: "大, 太, 天, 头, 夫, 夸" },
  { id: 38, r: "女", v: [], s: 3, p: "nǚ", hv: "NỮ", m: "Phụ nữ, người con gái đoan trang", ex: "好, 她, 妈, 姐, 妹, 奶" },
  { id: 39, r: "子", v: [], s: 3, p: "zǐ", hv: "TỬ", m: "Đứa con, con nít, mầm mống", ex: "字, 学, 孩, 存, 季, 孤" },
  { id: 40, r: "宀", v: [], s: 3, p: "mián", hv: "MIÊN", m: "Mái nhà che chở, tổ ấm", ex: "家, 安, 定, 室, 客, 完" },
  { id: 41, r: "寸", v: [], s: 3, p: "cùn", hv: "THỐN", m: "Tấc đo chiều dài, khoảng cách mạch máu cổ tay", ex: "对, 封, 射, 寺, 寻, 导" },
  { id: 42, r: "小", v: ["⺌", "⺍"], s: 3, p: "xiǎo", hv: "TIỂU", m: "Nhỏ bé, chia nhỏ ra", ex: "小, 少, 尖, 当, 光, 尝" },
  { id: 43, r: "尢", v: ["尣"], s: 3, p: "wāng", hv: "UÔNG", m: "Chân què quặt, dáng đi xiêu vẹo", ex: "尤, 尴, 尬, 就" },
  { id: 44, r: "尸", v: [], s: 3, p: "shī", hv: "THI", m: "Thân thể người ngồi gập, xác chết, nơi ở", ex: "居, 屋, 展, 岁, 局, 层" },
  { id: 45, r: "屮", v: [], s: 3, p: "chè", hv: "TRIỆT", m: "Mầm cỏ non mới nhú lên mặt đất", ex: "屯, 屮" },
  { id: 46, r: "山", v: [], s: 3, p: "shān", hv: "SƠN", m: "Núi non trùng điệp 3 ngọn nhô cao", ex: "山, 岁, 岛, 峰, 峡, 岗" },
  { id: 47, r: "巛", v: ["川"], s: 3, p: "chuān", hv: "XUYÊN", m: "Dòng sông chảy cuồn cuộn", ex: "川, 州, 巡, 巢" },
  { id: 48, r: "工", v: [], s: 3, p: "gōng", hv: "CÔNG", m: "Thước thợ làm việc, công cụ lao động", ex: "工, 左, 差, 巧, 巨, 功" },
  { id: 49, r: "己", v: ["已", "巳"], s: 3, p: "jǐ", hv: "KỶ", m: "Bản thân mình, cuộn dây đo", ex: "己, 已, 导, 异, 卷" },
  { id: 50, r: "巾", v: [], s: 3, p: "jīn", hv: "CÂN", m: "Cái khăn vải dệt treo rủ xuống", ex: "市, 希, 带, 帮, 席, 帽" },
  { id: 51, r: "干", v: [], s: 3, p: "gān", hv: "CAN", m: "Cái khiên chắn, phạm vào, can thiệp", ex: "平, 年, 并, 幸, 幹" },
  { id: 52, r: "幺", v: [], s: 3, p: "yāo", hv: "YÊU", m: "Sợi tơ nhỏ xíu, nhỏ bé nhất", ex: "幻, 幼, 幽, 几" },
  { id: 53, r: "广", v: [], s: 3, p: "yǎn", hv: "QUẢNG", m: "Mái hiên nhà rộng lớn nương tựa vách núi", ex: "店, 床, 府, 库, 康, 庆" },
  { id: 54, r: "廴", v: [], s: 3, p: "yǐn", hv: "DẪN", m: "Bước dài, kéo dài quãng đường đi", ex: "延, 建, 廷" },
  { id: 55, r: "廾", v: [], s: 3, p: "gǒng", hv: "CỦNG", m: "Hai tay chắp lại cung kính nâng đồ vật", ex: "开, 弃, 弄, 弊, 弈" },
  { id: 56, r: "弋", v: [], s: 3, p: "yì", hv: "DẬC", m: "Cây cọc đóng đất, mũi tên có buộc dây", ex: "弋, 式, 弑, 甙" },
  { id: 57, r: "弓", v: [], s: 3, p: "gōng", hv: "CUNG", m: "Cánh cung uốn cong giương dây", ex: "张, 引, 弟, 弱, 弯, 强" },
  { id: 58, r: "彐", v: ["彑"], s: 3, p: "jì", hv: "KỆ", m: "Đầu con nhím, móng vuốt thú nhỏ", ex: "归, 当, 录, 寻, 慧" },
  { id: 59, r: "彡", v: [], s: 3, p: "shān", hv: "SÂM", m: "Lông thú dài, hoa văn trang trí ba nét rủ", ex: "形, 彩, 影, 须, 彭, 彰" },
  { id: 60, r: "彳", v: [], s: 3, p: "chì", hv: "SÁCH", m: "Bước chân trái, ngã ba đường (xích bước)", ex: "很, 行, 得, 往, 待, 微" },

  // 4 NÉT (34 bộ: 61 - 94)
  { id: 61, r: "心", v: ["忄", "⺗"], s: 4, p: "xīn", hv: "TÂM", m: "Trái tim, tình cảm, tâm tư; 忄 là tâm đứng", ex: "想, 快, 忙, 慢, 懂, 怕, 意" },
  { id: 62, r: "戈", v: [], s: 4, p: "gē", hv: "QUA", m: "Ngọn giáo, vũ khí chiến đấu cổ xưa", ex: "我, 成, 战, 或, 戴, 戚" },
  { id: 63, r: "戶", v: ["户"], s: 4, p: "hù", hv: "HỘ", m: "Cửa một cánh, hộ gia đình", ex: "房, 扁, 所, 扇, 扉" },
  { id: 64, r: "手", v: ["扌"], s: 4, p: "shǒu", hv: "THỦ", m: "Bàn tay 5 ngón; 扌 là thủ gảy hành động", ex: "打, 找, 拿, 把, 提, 扫, 推" },
  { id: 65, r: "支", v: [], s: 4, p: "zhī", hv: "CHI", m: "Cành cây cầm trên tay, chi nhánh", ex: "支, 翅, 攲" },
  { id: 66, r: "攴", v: ["攵"], s: 4, p: "pū", hv: "PHÁC", m: "Gõ nhẹ, cầm roi đánh khẽ dạy bảo", ex: "放, 教, 数, 敢, 散, 整" },
  { id: 67, r: "文", v: [], s: 4, p: "wén", hv: "VĂN", m: "Hoa văn xăm mình, chữ viết, văn học", ex: "文, 齐, 斌, 斐, 斑" },
  { id: 68, r: "斗", v: [], s: 4, p: "dǒu", hv: "ĐẨU", m: "Cái đấu đong gạo, chòm sao Bắc Đẩu", ex: "料, 斜, 斟, 斡" },
  { id: 69, r: "斤", v: [], s: 4, p: "jīn", hv: "CÂN", m: "Cái rìu đẽo gỗ, đơn vị cân nặng", ex: "新, 断, 斩, 斯, 斧" },
  { id: 70, r: "方", v: [], s: 4, p: "fāng", hv: "PHƯƠNG", m: "Hình vuông, phương hướng, hai thuyền ghép lại", ex: "方, 旁, 旅, 族, 旋, 旗" },
  { id: 71, r: "无", v: ["旡"], s: 4, p: "wú", hv: "VÔ", m: "Không có, trống rỗng", ex: "无, 既, 暨" },
  { id: 72, r: "日", v: [], s: 4, p: "rì", hv: "NHẬT", m: "Mặt trời, ban ngày, thời gian sáng tỏ", ex: "早, 时, 明, 是, 昨, 晴, 暖" },
  { id: 73, r: "曰", v: [], s: 4, p: "yuē", hv: "VIẾT", m: "Nói rằng, miệng thốt ra lời", ex: "曰, 曹, 曼, 曾" },
  { id: 74, r: "月", v: [], s: 4, p: "yuè", hv: "NGUYỆT", m: "Mặt trăng khuyết; cũng dùng chỉ xác thịt (nhục)", ex: "期, 朋, 胖, 脑, 脚, 腿, 脸" },
  { id: 75, r: "木", v: [], s: 4, p: "mù", hv: "MỘC", m: "Cây cối, gỗ, rễ và cành vươn ra", ex: "本, 机, 杯, 条, 校, 桌, 树" },
  { id: 76, r: "欠", v: [], s: 4, p: "qiàn", hv: "KHIẾM", m: "Người há miệng ngáp thiếu dưỡng khí, nợ nần", ex: "歌, 欢, 次, 款, 欧, 欺" },
  { id: 77, r: "止", v: [], s: 4, p: "zhǐ", hv: "CHỈ", m: "Dừng lại, bàn chân đặt xuống đất ngưng bước", ex: "此, 正, 步, 武, 歧, 歪" },
  { id: 78, r: "歹", v: ["歺"], s: 4, p: "dǎi", hv: "ĐÃI", m: "Mẩu xương tàn, chết chóc, xấu xa nguy hại", ex: "死, 没, 殊, 残, 殃, 殉" },
  { id: 79, r: "殳", v: [], s: 4, p: "shū", hv: "THÙ", m: "Binh khí bằng tre nhọn không có ngạnh", ex: "段, 殿, 殷, 毁, 毅" },
  { id: 80, r: "毋", v: ["母"], s: 4, p: "wú", hv: "VÔ", m: "Đừng, chớ; 母 là người mẹ có bầu sữa", ex: "母, 每, 毒, 贯" },
  { id: 81, r: "比", v: [], s: 4, p: "bǐ", hv: "TỶ", m: "So sánh, hai người đứng kề vai sát cánh", ex: "比, 皆, 毙, 毖" },
  { id: 82, r: "毛", v: [], s: 4, p: "máo", hv: "MAO", m: "Lông thú, sợi tóc mềm mại", ex: "毛, 毫, 毯, 毯" },
  { id: 83, r: "氏", v: [], s: 4, p: "shì", hv: "THỊ", m: "Dòng họ, chức tước quý tộc", ex: "民, 氏, 氓" },
  { id: 84, r: "气", v: [], s: 4, p: "qì", hv: "KHÍ", m: "Khí quyển, mây khói bốc lên, hơi thở", ex: "气, 汽, 氛, 氧, 氢" },
  { id: 85, r: "水", v: ["氵", "氺"], s: 4, p: "shuǐ", hv: "THỦY", m: "Nước, sông hồ, chất lỏng; 氵 là ba chấm thủy", ex: "水, 洗, 汉, 海, 渴, 没, 河" },
  { id: 86, r: "火", v: ["灬"], s: 4, p: "huǒ", hv: "HỎA", m: "Ngọn lửa bốc cháy; 灬 là 4 chấm lửa dưới đáy", ex: "热, 点, 然, 照, 烧, 烟, 灯" },
  { id: 87, r: "爪", v: ["爫"], s: 4, p: "zhǎo", hv: "TRẢO", m: "Móng vuốt chim thú từ trên cào xuống", ex: "爱, 爬, 抓, 采, 妥" },
  { id: 88, r: "父", v: [], s: 4, p: "fù", hv: "PHỤ", m: "Người cha tay cầm roi dạy dỗ gia đình", ex: "父, 爸, 爷, 爹" },
  { id: 89, r: "爻", v: [], s: 4, p: "yáo", hv: "HÀO", m: "Các vạch đan chéo quẻ Bát quái Dịch học", ex: "爽, 尔" },
  { id: 90, r: "爿", v: ["丬"], s: 4, p: "pán", hv: "TƯỜNG", m: "Tấm ván gỗ chẻ đôi bên trái", ex: "床, 墙, 壮, 状, 将" },
  { id: 91, r: "片", v: [], s: 4, p: "piàn", hv: "PHIẾN", m: "Mảnh gỗ chẻ đôi bên phải, mảnh mỏng", ex: "片, 版, 牌, 牒" },
  { id: 92, r: "牙", v: [], s: 4, p: "yá", hv: "NHA", m: "Răng hàm đan cài vào nhau cắn xé", ex: "牙, 邪, 雅" },
  { id: 93, r: "牛", v: ["牜"], s: 4, p: "niú", hv: "NGƯU", m: "Con trâu, con bò với cặp sừng cong", ex: "牛, 件, 物, 特, 牧, 告" },
  { id: 94, r: "犬", v: ["犭"], s: 4, p: "quǎn", hv: "KHUYỂN", m: "Con chó; 犭 là chó săn đứng chạy", ex: "狗, 猫, 狂, 犯, 猪, 猜, 独" },

  // 5 NÉT (23 bộ: 95 - 117)
  { id: 95, r: "玄", v: [], s: 5, p: "xuán", hv: "HUYỀN", m: "Màu đen huyền bí, sâu thẳm khôn lường", ex: "玄, 率" },
  { id: 96, r: "玉", v: ["王"], s: 5, p: "yù", hv: "NGỌC", m: "Viên ngọc quý có dây xâu chuỗi; 王 là ngọc/vua", ex: "玩, 球, 现, 班, 理, 环" },
  { id: 97, r: "瓜", v: [], s: 5, p: "guā", hv: "QUA", m: "Quả dưa lúc lỉu trên giàn leo", ex: "西, 瓜, 瓣, 瓢" },
  { id: 98, r: "瓦", v: [], s: 5, p: "wǎ", hv: "NGOÃ", m: "Viên ngói đất nung lợp mái", ex: "瓶, 瓷, 甄" },
  { id: 99, r: "甘", v: [], s: 5, p: "gān", hv: "CAM", m: "Ngọt ngào, ngậm thức ăn ngon trong miệng", ex: "甜, 甚, 某" },
  { id: 100, r: "生", v: [], s: 5, p: "shēng", hv: "SINH", m: "Sinh sôi, cỏ cây mọc lên tươi tốt", ex: "生, 产, 甥, 甦" },
  { id: 101, r: "用", v: [], s: 5, p: "yòng", hv: "DỤNG", m: "Sử dụng, chiếc thùng gỗ có quai xách", ex: "用, 甫, 甩" },
  { id: 102, r: "田", v: [], s: 5, p: "tián", hv: "ĐIỀN", m: "Ruộng đất chia bờ ngăn lối", ex: "男, 画, 留, 界, 略, 细" },
  { id: 103, r: "疋", v: ["⺪"], s: 5, p: "pǐ", hv: "THẤT", m: "Cuộn vải, bàn chân duỗi thẳng", ex: "疏, 蛋, 疑" },
  { id: 104, r: "疒", v: [], s: 5, p: "nè", hv: "NẬCH", m: "Người ốm nằm liệt giường toát mồ hôi, bệnh tật", ex: "病, 疼, 瘦, 痛, 疯, 痒" },
  { id: 105, r: "癶", v: [], s: 5, p: "bō", hv: "BÁT", m: "Hai chân dang ra bước đi ngược hướng", ex: "登, 发, 癸" },
  { id: 106, r: "白", v: [], s: 5, p: "bái", hv: "BẠCH", m: "Màu trắng tinh khôi, hạt gạo xát sạch", ex: "百, 的, 的, 皇, 皎" },
  { id: 107, r: "皮", v: [], s: 5, p: "pí", hv: "BÌ", m: "Tấm da thú lột ra cầm trên tay", ex: "皮, 破, 颇, 皱" },
  { id: 108, r: "皿", v: [], s: 5, p: "mǐn", hv: "MÃNH", m: "Đĩa bát, đồ đựng thức ăn cạn đáy", ex: "盆, 益, 盒, 盘, 盖, 盛" },
  { id: 109, r: "目", v: [], s: 5, p: "mù", hv: "MỤC", m: "Con mắt với tròng mắt nhìn thẳng", ex: "看, 眼, 睛, 睡, 盼, 盯" },
  { id: 110, r: "矛", v: [], s: 5, p: "máo", hv: "MÂU", m: "Ngọn mâu dài để đâm từ xa", ex: "矛, 柔, 矜" },
  { id: 111, r: "矢", v: [], s: 5, p: "shǐ", hv: "THỈ", m: "Mũi tên bay thẳng", ex: "知, 短, 矩, 矮" },
  { id: 112, r: "石", v: [], s: 5, p: "shí", hv: "THẠCH", m: "Hòn đá rơi dưới chân núi", ex: "破, 硬, 研, 码, 矿, 确" },
  { id: 113, r: "示", v: ["礻"], s: 5, p: "shì", hv: "THỊ", m: "Bàn thờ thần linh, thần phước; 礻 là thị nghiêng", ex: "视, 祝, 礼, 神, 票, 祥, 福" },
  { id: 114, r: "禸", v: [], s: 5, p: "róu", hv: "NHỰU", m: "Dấu chân dã thú đạp lên bùn", ex: "禹, 离, 禽" },
  { id: 115, r: "禾", v: [], s: 5, p: "hé", hv: "HÒA", m: "Cây lúa trĩu hạt uốn cong ngọn", ex: "和, 秋, 种, 科, 称, 秒" },
  { id: 116, r: "穴", v: [], s: 5, p: "xué", hv: "HUYỆT", m: "Hang động đào trong lòng đất làm nơi ở", ex: "空, 穿, 突, 窄, 窗, 窃" },
  { id: 117, r: "立", v: [], s: 5, p: "lì", hv: "LẬP", m: "Đứng vững vàng trên mặt đất", ex: "站, 亲, 音, 童, 端, 竞" },

  // 6 NÉT (29 bộ: 118 - 146)
  { id: 118, r: "竹", v: ["⺮"], s: 6, p: "zhú", hv: "TRÚC", m: "Cây tre, lá tre rủ xuống; ⺮ trên đầu chữ", ex: "笔, 笑, 第, 筷, 等, 答, 管" },
  { id: 119, r: "米", v: [], s: 6, p: "mǐ", hv: "MỄ", m: "Hạt gạo, lương thực quý báu", ex: "米, 类, 糖, 精, 糕, 粮" },
  { id: 120, r: "糸", v: ["纟"], s: 6, p: "mì", hv: "MỊCH", m: "Cuộn tơ tằm, sợi chỉ may vá", ex: "红, 绿, 细, 绍, 给, 经, 练" },
  { id: 121, r: "缶", v: [], s: 6, p: "fǒu", hv: "PHẪU", m: "Đồ gốm nung, vò sành đựng rượu", ex: "缺, 缸, 罐" },
  { id: 122, r: "网", v: ["罒", "罓"], s: 6, p: "wǎng", hv: "VÕNG", m: "Lưới đánh cá, pháp luật nghiêm minh", ex: "罗, 置, 罪, 罚, 署" },
  { id: 123, r: "羊", v: ["⺶"], s: 6, p: "yáng", hv: "DƯƠNG", m: "Con dê, con cừu hiền lành tượng trưng điều tốt", ex: "美, 差, 着, 群, 翔" },
  { id: 124, r: "羽", v: [], s: 6, p: "yǔ", hv: "VŨ", m: "Lông vũ cánh chim bay lượn", ex: "习, 翅, 翁, 翻, 翼" },
  { id: 125, r: "老", v: ["耂"], s: 6, p: "lǎo", hv: "LÃO", m: "Người già chống gậy tóc bạc", ex: "老, 考, 者, 煮" },
  { id: 126, r: "而", v: [], s: 6, p: "ér", hv: "NHI", m: "Chòm râu mép, từ nối mà/và", ex: "而, 耐, 耍" },
  { id: 127, r: "耒", v: [], s: 6, p: "lěi", hv: "LỖI", m: "Cái cày gỗ làm ruộng nông nghiệp", ex: "耕, 耗, 耘, 耙" },
  { id: 128, r: "耳", v: [], s: 6, p: "ěr", hv: "NHĨ", m: "Cái tai để lắng nghe âm thanh", ex: "听, 取, 最, 职, 聪, 闻" },
  { id: 129, r: "聿", v: ["⺻"], s: 6, p: "yù", hv: "DUẬT", m: "Bàn tay cầm bút lông đứng viết", ex: "建, 肃, 肆" },
  { id: 130, r: "肉", v: ["⺼"], s: 6, p: "ròu", hv: "NHỤC", m: "Thịt, cơ bắp cơ thể (thường viết dạng 月)", ex: "肉, 胖, 腿, 脚, 胃, 腹" },
  { id: 131, r: "臣", v: [], s: 6, p: "chén", hv: "THẦN", m: "Bầy tôi, quan lại cúi đầu vâng lệnh", ex: "臣, 卧, 臧" },
  { id: 132, r: "自", v: [], s: 6, p: "zì", hv: "TỰ", m: "Cái mũi của mình, tự thân", ex: "自, 臭, 息" },
  { id: 133, r: "至", v: [], s: 6, p: "zhì", hv: "CHÍ", m: "Mũi tên bay tới mặt đất, đạt đến tột cùng", ex: "到, 致, 臻, 窒" },
  { id: 134, r: "臼", v: [], s: 6, p: "jiù", hv: "CỮU", m: "Cái cối giã gạo có vết lõm", ex: "儿, 舅, 鼠, 舂" },
  { id: 135, r: "舌", v: [], s: 6, p: "shé", hv: "THIỆT", m: "Cái lưỡi thè ra từ miệng nếm vị", ex: "话, 乱, 甜, 舒, 辞" },
  { id: 136, r: "舛", v: [], s: 6, p: "chuǎn", hv: "SUYỄN", m: "Hai bàn chân quay lưng ngược nhau", ex: "舜, 舞" },
  { id: 137, r: "舟", v: [], s: 6, p: "zhōu", hv: "CHU", m: "Chiếc thuyền gỗ bơi trên mặt sông", ex: "船, 般, 盘, 航, 艘" },
  { id: 138, r: "艮", v: [], s: 6, p: "gèn", hv: "CẤN", m: "Quẻ Cấn, kiên định ngưng lại", ex: "很, 跟, 银, 限, 根" },
  { id: 139, r: "色", v: [], s: 6, p: "sè", hv: "SẮC", m: "Màu sắc, vẻ mặt tình cảm", ex: "色, 艳, 绝" },
  { id: 140, r: "艸", v: ["艹"], s: 6, p: "cǎo", hv: "THẢO", m: "Cỏ cây hoa lá; 艹 là hai nhánh cỏ trên đầu", ex: "茶, 菜, 药, 花, 草, 节, 蓝" },
  { id: 141, r: "虍", v: [], s: 6, p: "hū", hv: "HÔ", m: "Vằn lông vượn cọp, chúa sơn lâm oai phong", ex: "虎, 虚, 虑, 虔" },
  { id: 142, r: "虫", v: [], s: 6, p: "chóng", hv: "TRÙNG", m: "Côn trùng, sâu bọ, rắn rết bò lan", ex: "蛋, 虽, 蛮, 蛇, 蜂, 蚂" },
  { id: 143, r: "血", v: [], s: 6, p: "xuè", hv: "HUYẾT", m: "Giọt máu cúng trong chén tế lễ", ex: "血, 衅, 衄" },
  { id: 144, r: "行", v: [], s: 6, p: "xíng", hv: "HÀNH", m: "Ngã tư đường lớn, đi lại hoạt động", ex: "行, 街, 律, 衍" },
  { id: 145, r: "衣", v: ["衤"], s: 6, p: "yī", hv: "Y", m: "Áo quần may mặc; 衤 là bộ y có chấm", ex: "被, 裤, 裙, 衫, 袋, 装" },
  { id: 146, r: "襾", v: ["西"], s: 6, p: "yà", hv: "TÂY", m: "Cái nắp đậy úp xuống, phương Tây lặn", ex: "西, 要, 票, 覆" },

  // 7 NÉT (20 bộ: 147 - 166)
  { id: 147, r: "見", v: ["见"], s: 7, p: "jiàn", hv: "KIẾN", m: "Người có mắt to trông thấy nhìn rõ", ex: "见, 规, 视, 觉, 览" },
  { id: 148, r: "角", v: [], s: 7, p: "jiǎo", hv: "GIÁC", m: "Sừng động vật nhọn hoắt, góc cạnh", ex: "角, 解, 触, 觞" },
  { id: 149, r: "言", v: ["讠"], s: 7, p: "yán", hv: "NGÔN", m: "Lời nói xuất từ miệng; 讠 là ngôn giản thể", ex: "语, 说, 话, 读, 课, 识, 谢" },
  { id: 150, r: "谷", v: [], s: 7, p: "gǔ", hv: "CỐC", m: "Thung lũng sâu có suối chảy róc rách", ex: "谷, 欲, 豁" },
  { id: 151, r: "豆", v: [], s: 7, p: "dòu", hv: "ĐẬU", m: "Hạt đậu, cái chén cao chân đựng đồ ăn", ex: "短, 豆, 登, 鼓" },
  { id: 152, r: "豕", v: [], s: 7, p: "shǐ", hv: "THỈ", m: "Con heo, con lợn mập mạp", ex: "家, 豪, 象, 毅" },
  { id: 153, r: "豸", v: [], s: 7, p: "zhì", hv: "TRÃI", m: "Loài thú săn mồi không sừng rình rập", ex: "豹, 豺, 貌, 貂" },
  { id: 154, r: "貝", v: ["贝"], s: 7, p: "bèi", hv: "BỐI", m: "Vỏ sò tiền tệ thời cổ, tiền của tài bảo", ex: "贵, 费, 员, 财, 购, 贫" },
  { id: 155, r: "赤", v: [], s: 7, p: "chì", hv: "XÍCH", m: "Màu đỏ rực của ngọn lửa lớn", ex: "赤, 赦, 赫" },
  { id: 156, r: "走", v: [], s: 7, p: "zǒu", hv: "TẨU", m: "Đi lại nhanh chóng, người vung tay rảo bước", ex: "起, 越, 超, 赶, 趁" },
  { id: 157, r: "足", v: ["⻊"], s: 7, p: "zú", hv: "TÚC", m: "Bàn chân người, đầy đủ trọn vẹn", ex: "跑, 跳, 踢, 路, 跟, 跌" },
  { id: 158, r: "身", v: [], s: 7, p: "shēn", hv: "THÂN", m: "Thân thể người phụ nữ mang bầu", ex: "身, 躺, 躲, 躯" },
  { id: 159, r: "車", v: ["车"], s: 7, p: "chē", hv: "XA", m: "Chiếc xe ngựa kéo hai bánh có trục", ex: "车, 轮, 辅, 较, 轻, 辆" },
  { id: 160, r: "辛", v: [], s: 7, p: "xīn", hv: "TÂN", m: "Cay đắng, hình mũi dao trừng phạt tội nhân", ex: "辛苦, 辣, 辜, 辟" },
  { id: 161, r: "辰", v: [], s: 7, p: "chén", hv: "THẦN", m: "Can Chi Thần, vỏ sò nhô lên làm ruộng", ex: "晨, 农, 辱" },
  { id: 162, r: "辵", v: ["辶"], s: 7, p: "chuò", hv: "SƯỚC", m: "Vừa đi vừa dừng lại; 辶 là quai xước", ex: "近, 远, 迎, 进, 边, 过, 还" },
  { id: 163, r: "邑", v: ["阝(phải)"], s: 7, p: "yì", hv: "ẤP", m: "Xóm làng, đô thị; 阝 bên phải chữ", ex: "都, 邮, 邻, 部, 郊, 那" },
  { id: 164, r: "酉", v: [], s: 7, p: "yǒu", hv: "DẬU", m: "Bình rượu ủ men thơm ngon, giờ Dậu", ex: "酒, 酸, 醋, 醒, 醉, 酌" },
  { id: 165, r: "釆", v: [], s: 7, p: "biàn", hv: "BIỆN", m: "Vết chân thú phân biệt rõ ràng", ex: "番, 释" },
  { id: 166, r: "里", v: [], s: 7, p: "lǐ", hv: "LÝ", m: "Làng mạc nơi có ruộng đất (điền + thổ), dặm", ex: "重, 野, 量, 厘" },

  // 8 NÉT (9 bộ: 167 - 175)
  { id: 167, r: "金", v: ["钅"], s: 8, p: "jīn", hv: "KIM", m: "Kim loại, vàng bạc chôn dưới đất; 钅 giản thể", ex: "错, 钱, 针, 钟, 铁, 银, 锋" },
  { id: 168, r: "長", v: ["长"], s: 8, p: "cháng", hv: "TRƯỜNG", m: "Dài lâu, tóc dài người già, trưởng thành", ex: "长, 肆" },
  { id: 169, r: "門", v: ["门"], s: 8, p: "mén", hv: "MÔN", m: "Cánh cổng lớn hai cánh; 门 giản thể", ex: "门, 问, 间, 关, 闭, 闪, 阅" },
  { id: 170, r: "阜", v: ["阝(trái)"], s: 8, p: "fù", hv: "PHỤ", m: "Gò đất cao nhấp nhô; 阝 bên trái chữ", ex: "院, 阴, 阳, 附, 险, 阻" },
  { id: 171, r: "隶", v: [], s: 8, p: "lì", hv: "ĐÃI", m: "Nô lệ bắt được giam giữ", ex: "隶, 康" },
  { id: 172, r: "隹", v: [], s: 8, p: "zhuī", hv: "CHUY", m: "Loài chim đuôi ngắn đậu trên cành", ex: "难, 谁, 准, 焦, 雀, 雕" },
  { id: 173, r: "雨", v: [], s: 8, p: "yǔ", hv: "VŨ", m: "Mưa rơi từ bầu trời mây giăng", ex: "雨, 雪, 零, 雷, 需, 露" },
  { id: 174, r: "靑", v: ["青"], s: 8, p: "qīng", hv: "THANH", m: "Màu xanh ngát của mầm non và khoáng sản", ex: "青, 靓, 靛" },
  { id: 175, r: "非", v: [], s: 8, p: "fēi", hv: "PHI", m: "Hai cánh chim dang ngược, sai lầm, không phải", ex: "非, 悲, 靠, 辈" },

  // 9 NÉT (11 bộ: 176 - 186)
  { id: 176, r: "面", v: [], s: 9, p: "miàn", hv: "DIỆN", m: "Khuôn mặt người, bề mặt phẳng", ex: "面, 靥" },
  { id: 177, r: "革", v: [], s: 9, p: "gé", hv: "CÁCH", m: "Tấm da thú đã thuộc bỏ lông, đổi mới", ex: "鞋, 靴, 鞭, 靶" },
  { id: 178, r: "韋", v: ["韦"], s: 9, p: "wéi", hv: "VI", m: "Da bao quanh thành trì phòng thủ", ex: "韧, 韩, 韬" },
  { id: 179, r: "韭", v: [], s: 9, p: "jiǔ", hv: "CỬU", m: "Rau hẹ cắt rồi mọc lại", ex: "韭, 齑" },
  { id: 180, r: "音", v: [], s: 9, p: "yīn", hv: "ÂM", m: "Âm thanh thốt ra từ trong lòng thành điệu", ex: "音, 韵, 韶, 响" },
  { id: 181, r: "頁", v: ["页"], s: 9, p: "yè", hv: "HIỆT", m: "Cái đầu người, trang sách, trang giấy", ex: "题, 颜, 顺, 顶, 须, 预" },
  { id: 182, r: "風", v: ["风"], s: 9, p: "fēng", hv: "PHONG", m: "Gió thổi côn trùng sinh sôi mùa xuân", ex: "风, 刮, 飘, 飒" },
  { id: 183, r: "飛", v: ["飞"], s: 9, p: "fēi", hv: "PHI", m: "Chim vỗ cánh bay lượn trên bầu trời", ex: "飞, 翻" },
  { id: 184, r: "食", v: ["饣"], s: 9, p: "shí", hv: "THỰC", m: "Ăn uống, lương thực đựng trong bát có nắp", ex: "饭, 馆, 饱, 饺, 饼, 饮" },
  { id: 185, r: "首", v: [], s: 9, p: "shǒu", hv: "THỦ", m: "Cái đầu, chỏm tóc, đứng đầu thủ lĩnh", ex: "首, 馗" },
  { id: 186, r: "香", v: [], s: 9, p: "xiāng", hv: "HƯƠNG", m: "Mùi hương lúa chín thơm ngát (hòa + nhật)", ex: "香, 馨" },

  // 10 NÉT (8 bộ: 187 - 194)
  { id: 187, r: "馬", v: ["马"], s: 10, p: "mǎ", hv: "MÃ", m: "Con ngựa với bờm dài và bốn vó phi", ex: "马, 骑, 验, 驶, 骗, 骄" },
  { id: 188, r: "骨", v: [], s: 10, p: "gǔ", hv: "CỐT", m: "Xương khớp chống đỡ cơ thể", ex: "骨, 骼, 髓, 髅" },
  { id: 189, r: "高", v: [], s: 10, p: "gāo", hv: "CAO", m: "Lầu gác cao vút có cửa vọng lâu", ex: "高, 亮, 亭, 毫" },
  { id: 190, r: "髟", v: [], s: 10, p: "biāo", hv: "BÊU", m: "Mái tóc dài rủ xuống", ex: "髦, 髻, 髭, 髯" },
  { id: 191, r: "鬥", v: [], s: 10, p: "dòu", hv: "ĐẤU", m: "Hai người xông vào đánh lộn", ex: "闹, 斗, 争" },
  { id: 192, r: "鬯", v: [], s: 10, p: "chàng", hv: "SƯỚNG", m: "Rượu nếp thơm dùng để tế lễ thần linh", ex: "鬯, 郁" },
  { id: 193, r: "鬲", v: [], s: 10, p: "lì", hv: "CÁCH", m: "Cái nồi ba chân rỗng đáy nấu thức ăn", ex: "融, 鬲" },
  { id: 194, r: "鬼", v: [], s: 10, p: "guǐ", hv: "QUỶ", m: "Hồn ma đầu to chân quặp lang thang", ex: "鬼, 魂, 魄, 魅, 魔" },

  // 11 NÉT (6 bộ: 195 - 200)
  { id: 195, r: "魚", v: ["鱼"], s: 11, p: "yú", hv: "NGƯ", m: "Con cá bơi dưới nước có vây và vảy", ex: "鱼, 鲜, 鲁, 鲨, 鲸, 鲜" },
  { id: 196, r: "鳥", v: ["鸟"], s: 11, p: "niǎo", hv: "ĐIỂU", m: "Loài chim đuôi dài có lông cánh", ex: "鸟, 鸡, 鸭, 鸣, 鹅, 鹰" },
  { id: 197, r: "鹵", v: ["卤"], s: 11, p: "lǔ", hv: "LỖ", m: "Đất mặn chứa tinh thể muối biển", ex: "卤, 咸, 碱" },
  { id: 198, r: "鹿", v: [], s: 11, p: "lù", hv: "LỘC", m: "Con hươu nai có cặp sừng đẹp", ex: "丽, 麟, 麝" },
  { id: 199, r: "麥", v: ["麦"], s: 11, p: "mài", hv: "MẠCH", m: "Cây lúa mạch bông vàng", ex: "麦, 面, 麸" },
  { id: 200, r: "麻", v: [], s: 11, p: "má", hv: "MA", m: "Cây gai dầu phơi trong nhà lấy sợi dệt", ex: "麻, 磨, 糜" },

  // 12 NÉT (4 bộ: 201 - 204)
  { id: 201, r: "黃", v: ["黄"], s: 12, p: "huáng", hv: "HOÀNG", m: "Màu vàng tươi của đất đai trung nguyên", ex: "黄, 黄金" },
  { id: 202, r: "黍", v: [], s: 12, p: "shǔ", hv: "THỬ", m: "Cây lúa nếp hạt dính dùng nấu xôi ủ rượu", ex: "黏, 黎" },
  { id: 203, r: "黑", v: [], s: 12, p: "hēi", hv: "HẮC", m: "Màu đen muội than khói lò đốt", ex: "黑, 默, 墨, 黛" },
  { id: 204, r: "黹", v: [], s: 12, p: "zhǐ", hv: "CHỈ", m: "Thêu thùa may vá họa tiết tinh xảo", ex: "黹, 黼" },

  // 13 NÉT (4 bộ: 205 - 208)
  { id: 205, r: "黽", v: ["黾"], s: 13, p: "mǐn", hv: "MÃNH", m: "Con ếch, con nhái bụng bự", ex: "黾, 鼋, 鼍" },
  { id: 206, r: "鼎", v: [], s: 13, p: "dǐng", hv: "ĐỈNH", m: "Cái vạc đồng ba chân hai tai của vua", ex: "鼎, 鼎盛" },
  { id: 207, r: "鼓", v: [], s: 13, p: "gǔ", hv: "CỔ", m: "Chiếc trống căng da tay cầm dùi gõ vang", ex: "鼓, 鼓励, 彭" },
  { id: 208, r: "鼠", v: [], s: 13, p: "shǔ", hv: "THỬ", m: "Con chuột gặm nhấm có râu và đuôi dài", ex: "鼠, 鼹" },

  // 14 NÉT (2 bộ: 209 - 210)
  { id: 209, r: "鼻", v: [], s: 14, p: "bí", hv: "TỴ", m: "Cái mũi hít thở không khí", ex: "鼻, 鼾" },
  { id: 210, r: "齊", v: ["齐"], s: 14, p: "qí", hv: "TỀ", m: "Bằng phẳng, đều tăm tắp như ruộng lúa", ex: "齐, 斋, 齑" },

  // 15 NÉT (1 bộ: 211)
  { id: 211, r: "齒", v: ["齿"], s: 15, p: "chǐ", hv: "XỈ", m: "Hàm răng nhai nghiền thức ăn", ex: "齿, 龄, 龃, 龇" },

  // 16 NÉT (2 bộ: 212 - 213)
  { id: 212, r: "龍", v: ["龙"], s: 16, p: "lóng", hv: "LONG", m: "Con rồng linh thiêng uốn lượn cưỡi mây", ex: "龙, 龚, 庞" },
  { id: 213, r: "龜", v: ["龟"], s: 16, p: "guī", hv: "QUY", m: "Con rùa mai cứng trường thọ", ex: "龟, 龟缩" },

  // 17 NÉT (1 bộ: 214)
  { id: 214, r: "龠", v: [], s: 17, p: "yuè", hv: "DƯỢC", m: "Cây sáo ba lỗ tấu nhạc hòa âm", ex: "龠, 吁, 龢" }
];

export const DECOMPOSITIONS: Record<string, Decomposition> = {
  "休": { parts: ["亻(Nhân)", "木(Mộc)"], story: "Người (亻) dựa lưng vào gốc cây (木) để nghỉ ngơi (休)." },
  "明": { parts: ["日(Nhật)", "月(Nguyệt)"], story: "Mặt trời (日) cùng mặt trăng (月) tỏa sáng rực rỡ (明)." },
  "好": { parts: ["女(Nữ)", "子(Tử)"], story: "Phụ nữ (女) sinh được con cái (子) là điều tốt lành, viên mãn (好)." },
  "看": { parts: ["手(Thủ)", "目(Mục)"], story: "Lấy bàn tay (手) che trên mắt (目) để phóng tầm mắt nhìn xa (看)." },
  "泪": { parts: ["氵(Thủy)", "目(Mục)"], story: "Nước (氵) chảy ra từ khóe mắt (目) gọi là giọt nước mắt (泪)." },
  "男": { parts: ["田(Điền)", "力(Lực)"], story: "Người dốc sức lực (力) cày cấy trên đồng ruộng (田) chính là đàn ông (男)." },
  "从": { parts: ["人(Nhân)", "人(Nhân)"], story: "Một người đi trước, một người đi theo sau gọi là tùng (从 - đi theo)." },
  "众": { parts: ["人(Nhân)", "人(Nhân)", "人(Nhân)"], story: "Ba người tụ họp lại thành một đám đông quần chúng (众)." },
  "森": { parts: ["木(Mộc)", "木(Mộc)", "木(Mộc)"], story: "Ba cái cây hợp lại tạo nên cánh rừng rậm rạp (森)." },
  "林": { parts: ["木(Mộc)", "木(Mộc)"], story: "Hai cái cây đứng cạnh nhau tạo thành rừng thưa (林)." },
  "问": { parts: ["门(Môn)", "口(Khẩu)"], story: "Đứng ở trước cổng cửa (门) hé miệng (口) cất tiếng hỏi thăm (问)." },
  "间": { parts: ["门(Môn)", "日(Nhật)"], story: "Ánh nắng mặt trời (日) lọt qua khe cửa (门) tạo thành khoảng không gian (间)." },
  "闭": { parts: ["门(Môn)", "才(Tài)"], story: "Đóng cửa (门) chặn tài năng (才) lại gọi là bế quan (闭)." },
  "家": { parts: ["宀(Miên)", "豕(Thỉ)"], story: "Dưới mái nhà (宀) có nuôi một chú lợn (豕) mới thành một gia đình trù phú (家)." },
  "字": { parts: ["宀(Miên)", "子(Tử)"], story: "Dưới mái ấm (宀), con trẻ (子) chăm chỉ học từng con chữ (字)." },
  "安": { parts: ["宀(Miên)", "女(Nữ)"], story: "Dưới mái nhà (宀) có người phụ nữ (女) giữ lửa thì gia đạo ắt bình an (安)." },
  "会": { parts: ["人(Nhân)", "云(Vân)"], story: "Mọi người (人) cùng tụ họp bàn chuyện nói lời như mây bay (云) là hội họp, biết làm (会)." },
  "语": { parts: ["讠(Ngôn)", "五(Ngũ)", "口(Khẩu)"], story: "Lời nói (讠) từ năm (五) cái miệng (口) cất lên thành ngôn ngữ (语)." },
  "话": { parts: ["讠(Ngôn)", "舌(Thiệt)"], story: "Lời nói (讠) phát ra từ chuyển động của đầu lưỡi (舌) là thoại (话 - trò chuyện)." },
  "说": { parts: ["讠(Ngôn)", "兑(Đoái)"], story: "Dùng lời nói (讠) làm người nghe vui vẻ hoan hỉ (兑) gọi là thuyết (说 - nói)." },
  "读": { parts: ["讠(Ngôn)", "卖(Mại)"], story: "Đọc to lời nói (讠) bán (卖) chữ cho thiên hạ hiểu gọi là đọc (读)." },
  "谢": { parts: ["讠(Ngôn)", "身(Thân)", "寸(Thốn)"], story: "Dùng lời nói (讠) cúi mình (身) từng tấc (寸) để bày tỏ lòng cảm tạ (谢)." },
  "喝": { parts: ["口(Khẩu)", "日(Nhật)", "勹(Bao)", "人(Nhân)"], story: "Há miệng (口) ngửa cổ uống nước dưới nắng mặt trời (日)." },
  "吃": { parts: ["口(Khẩu)", "乞(Khất)"], story: "Mở miệng (口) xin (乞) thức ăn để ăn (吃)." },
  "听": { parts: ["口(Khẩu)", "斤(Cân)"], story: "Dùng miệng (口) phân tích từng cân lượng (斤) lời nói nghe được (听)." },
  "想": { parts: ["相(Tương)", "心(Tâm)"], story: "Trái tim (心) nhớ nhung tương tư một bóng hình (相) gọi là tưởng (想 - nghĩ, nhớ)." },
  "懂": { parts: ["忄(Tâm)", "董(Đổng)"], story: "Trong tim (忄) đã thấu tỏ rõ ràng mọi việc gọi là hiểu, đổng (懂)." },
  "快": { parts: ["忄(Tâm)", "夬(Quái)"], story: "Tâm trạng (忄) dứt khoát vui sướng trôi qua rất nhanh (快)." },
  "慢": { parts: ["忄(Tâm)", "曼(Mạn)"], story: "Trong lòng (忄) thong thả kéo dài thời gian gọi là mạn (慢 - chậm chạp)." },
  "忙": { parts: ["忄(Tâm)", "亡(Vong)"], story: "Trong lòng (忄) bấn loạn như muốn mất trí (亡) gọi là bận rộn (忙)." },
  "时": { parts: ["日(Nhật)", "寸(Thốn)"], story: "Mỗi tấc (寸) bóng nắng mặt trời (日) trôi qua là một tấc thời gian (时)." },
  "早": { parts: ["日(Nhật)", "十(Thập)"], story: "Mặt trời (日) vừa ló dạng mười phần (十) là buổi sáng sớm (早)." },
  "晴": { parts: ["日(Nhật)", "青(Thanh)"], story: "Mặt trời (日) chiếu trên nền trời xanh biếc (青) là ngày nắng đẹp (晴)." },
  "冷": { parts: ["冫(Băng)", "令(Lệnh)"], story: "Băng giá (冫) tuân theo mệnh lệnh (令) của mùa đông lạnh giá (冷)." },
  "热": { parts: ["执(Chấp)", "灬(Hỏa)"], story: "Cầm nắm (执) vật đặt trên bốn chấm lửa (灬) bốc cháy hừng hực gọi là nóng (热)." },
  "点": { parts: ["占(Chiêm)", "灬(Hỏa)"], story: "Lửa (灬) đốt mai rùa bốc lên từng điểm (占) vết nứt gọi là điểm (点 - giờ, dấu chấm)." },
  "电": { parts: ["日(Nhật)", "乚(Cong)"], story: "Tia sét ngoằn ngoèo xé toạc bầu trời sáng lóa gọi là điện (电)." },
  "信": { parts: ["亻(Nhân)", "言(Ngôn)"], story: "Lời nói (言) của con người (亻) phải giữ chữ tín (信 - tin tưởng, thư từ)." },
  "化": { parts: ["亻(Nhân)", "匕(Chủy)"], story: "Người sống bên người quay ngược lại là biến hóa (化 - biến đổi)." },
  "胖": { parts: ["月(Nhục)", "半(Bán)"], story: "Phần da thịt (月) tăng thêm một nửa (半) nữa gọi là béo mập (胖)." },
  "坐": { parts: ["人(Nhân)", "人(Nhân)", "土(Thổ)"], story: "Hai người (人) ngồi kề bên nhau trên ụ đất (土) gọi là tọa (坐 - ngồi)." },
  "位": { parts: ["亻(Nhân)", "立(Lập)"], story: "Vị trí người (亻) đang đứng thẳng (立) gọi là vị (位 - vị trí, ngài)." },
  "名": { parts: ["夕(Tịch)", "口(Khẩu)"], story: "Trời tối (夕) không thấy mặt, phải dùng miệng (口) xưng tên gọi là danh (名)." },
  "教": { parts: ["孝(Hiếu)", "攵(Phác)"], story: "Dùng roi gõ nhẹ (攵) rèn giũa đạo hiếu (孝) gọi là dạy dỗ, giáo (教)." },
  "友": { parts: ["又(Hựu)", "又(Hựu)"], story: "Hai bàn tay (又) nắm chặt lấy nhau gọi là bạn bè (友)." },
  "学": { parts: ["冖(Mịch)", "子(Tử)"], story: "Đứa con (子) ngồi dưới mái trường (冖) tiếp thu tinh hoa tri thức gọi là học (学)." }
};

export function searchRadicals(query: string): Radical[] {
  if (!query) return RADICALS_DATA.slice();
  const q = query.toLowerCase().trim();
  return RADICALS_DATA.filter((rad) => {
    if (rad.r.toLowerCase().includes(q)) return true;
    if (rad.hv.toLowerCase().includes(q)) return true;
    if (rad.p.toLowerCase().includes(q)) return true;
    if (rad.m.toLowerCase().includes(q)) return true;
    if (rad.ex.toLowerCase().includes(q)) return true;
    if (rad.v && rad.v.some((v) => v.toLowerCase().includes(q))) return true;
    return false;
  });
}

export function getRadicalByStrokes(strokes: number | string): Radical[] {
  if (!strokes || strokes === "all") return RADICALS_DATA.slice();
  if (strokes === "8+") return RADICALS_DATA.filter((r) => r.s >= 8);
  const s = Number(strokes);
  return RADICALS_DATA.filter((r) => r.s === s);
}

export function getDecomposition(ch: string): Decomposition | null {
  if (!ch) return null;
  const first = ch.trim()[0];
  if (DECOMPOSITIONS[first]) {
    return { char: first, ...DECOMPOSITIONS[first] };
  }
  return null;
}
