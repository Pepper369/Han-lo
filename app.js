"use strict";
/* Hán Lộ — app học HSK 1 (HSK 3.0). Không framework, không backend, dữ liệu lưu localStorage. */
(function () {
  var ALL_WORDS = [];
  (window.HSK1 || []).forEach(function (row, id) {
    ALL_WORDS.push({ id: id, level: 1, h: row[0], p: row[1], hv: row[2], vi: row[3] });
  });
  (window.HSK2 || []).forEach(function (row, i) {
    ALL_WORDS.push({ id: 300 + i, level: 2, h: row[0], p: row[1], hv: row[2], vi: row[3] });
  });
  (window.HSK3 || []).forEach(function (row, i) {
    ALL_WORDS.push({ id: 500 + i, level: 3, h: row[0], p: row[1], hv: row[2], vi: row[3] });
  });

  var LESSON_SIZE = 10;
  var currentLvl = "1";
  var WORDS = [];
  var LESSONS = 0;
  var CHARS = [];

  function setLevel(lvl) {
    currentLvl = String(lvl != null ? lvl : "1");
    if (currentLvl === "0") {
      WORDS = ALL_WORDS.filter(function (w) { return w.level === 1; });
    } else if (currentLvl === "1") {
      WORDS = ALL_WORDS.filter(function (w) { return w.level === 1; });
    } else if (currentLvl === "2") {
      WORDS = ALL_WORDS.filter(function (w) { return w.level === 2; });
    } else if (currentLvl === "3") {
      WORDS = ALL_WORDS.filter(function (w) { return w.level === 3; });
    } else {
      WORDS = ALL_WORDS.slice();
    }
    WORDS.forEach(function (w, idx) {
      w.lesson = Math.floor(idx / LESSON_SIZE) + 1;
    });
    LESSONS = Math.ceil(WORDS.length / LESSON_SIZE);

    var seen = {}, out = [];
    WORDS.forEach(function (w) {
      Array.from(w.h).forEach(function (ch) {
        if (!seen[ch]) { seen[ch] = true; out.push(ch); }
      });
    });
    CHARS = out;

    var subEl = $("#brand-sub");
    if (subEl) {
      if (currentLvl === "0") subEl.textContent = "Chặng 0 · Nhập môn Phát âm & Bút thuận";
      else if (currentLvl === "1") subEl.textContent = "HSK 1 · 300 từ";
      else if (currentLvl === "2") subEl.textContent = "HSK 2 · 200 từ";
      else if (currentLvl === "3") subEl.textContent = "HSK 3 · 300 từ";
      else subEl.textContent = "HSK 1+2+3 · 800 từ";
    }

    document.querySelectorAll(".level-pill").forEach(function (btn) {
      btn.classList.toggle("active", btn.dataset.lvl === currentLvl);
    });

    if (S && S.settings && S.settings.level !== currentLvl) {
      S.settings.level = currentLvl;
      save();
    }
  }

  var KEY = "hanlo.v1";
  var $ = function (sel) { return document.querySelector(sel); };

  /* ================= lưu trữ ================= */
  function defaults() {
    return {
      v: 1,
      cards: {},
      settings: { pinyin: true, audio: true, sfx: true, goal: 10, onboarded: false, goalType: "thi", level: "1" },
      streak: { count: 0, last: "" },
      history: {},
      daily: { date: "", new: 0 },
      examHistory: []
    };
  }
  function load() {
    var d = defaults();
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return d;
      var s = JSON.parse(raw);
      var loaded = Object.assign({}, d, s, {
        settings: Object.assign({}, d.settings, s.settings || {}),
        streak: Object.assign({}, d.streak, s.streak || {}),
        daily: Object.assign({}, d.daily, s.daily || {}),
        examHistory: s.examHistory || []
      });
      if (window.SoundFX) SoundFX.enabled = loaded.settings.sfx !== false;
      return loaded;
    } catch (e) { return d; }
  }
  var S = load();
  if (typeof window !== "undefined" && window.HanLoDB && window.HanLoDB.isSupported) {
    window.HanLoDB.init().catch(function () {});
  }
  setLevel(S.settings.level || "1");

  function save() {
    try {
      localStorage.setItem(KEY, JSON.stringify(S));
      if (window.SoundFX) SoundFX.enabled = S.settings.sfx !== false;
      if (typeof window !== "undefined" && window.HanLoDB && window.HanLoDB.isSupported) {
        window.HanLoDB.put("settings", Object.assign({ key: "main_settings" }, S.settings)).catch(function () {});
      }
    } catch (e) { /* chế độ riêng tư: bỏ qua */ }
  }
  function todayFresh() {
    var t = Core.dayKey();
    if (S.daily.date !== t) S.daily = { date: t, "new": 0 };
  }

  /* ================= tiện ích ================= */
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function pinyinHTML(p) {
    return Core.syllables(p).map(function (s) {
      return '<span class="t' + Core.toneOf(s) + '">' + esc(s) + "</span>";
    }).join(" ");
  }
  function shuffle(a) {
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
    return a;
  }
  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  function todayLabel() {
    try {
      return new Date().toLocaleDateString("vi-VN", { weekday: "long", day: "2-digit", month: "2-digit" });
    } catch (e) { return ""; }
  }
  function greeting() {
    var h = new Date().getHours();
    if (h < 11) return "Chào buổi sáng";
    if (h < 14) return "Chào buổi trưa";
    if (h < 18) return "Chào buổi chiều";
    return "Chào buổi tối";
  }
  function toast(msg) {
    var el = $("#toast");
    el.textContent = msg;
    el.classList.remove("hidden");
    clearTimeout(toast._t);
    toast._t = setTimeout(function () { el.classList.add("hidden"); }, 2200);
  }

  /* ================= giọng đọc ================= */
  var ttsVoice = null, ttsReady = false;
  function initTTS() {
    if (!("speechSynthesis" in window)) return;
    var loadVoices = function () {
      var vs = window.speechSynthesis.getVoices() || [];
      ttsVoice = vs.find(function (v) { return /^zh([-_](cn|hans|sg))?$/i.test(v.lang); }) ||
        vs.find(function (v) { return /^zh/i.test(v.lang); }) ||
        vs.find(function (v) { return /chinese|cmn|putonghua/i.test(v.name); }) || null;
      ttsReady = vs.length > 0;
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }
  function hasTTS() { return "speechSynthesis" in window; }
  function speak(text, rate) {
    if (!hasTTS() || !S.settings.audio) return;
    try {
      window.speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(text);
      u.lang = "zh-CN";
      u.rate = rate || 0.82;
      if (ttsVoice) u.voice = ttsVoice;
      window.speechSynthesis.speak(u);
    } catch (e) { /* trình duyệt không hỗ trợ */ }
  }

  /* ================= trạng thái ================= */
  function dueWords() {
    var t = Date.now();
    return WORDS.filter(function (w) { return Core.isDue(S.cards[w.id], t); });
  }
  function cardStage(w) { return Core.stage(S.cards[w.id], Date.now()); }
  function learnedCount() { return Object.keys(S.cards).length; }
  function accuracy(days) {
    var n = 0, c = 0, t = Date.now();
    for (var i = 0; i < days; i++) {
      var h = S.history[Core.dayKey(t - i * Core.DAY)];
      if (h) { n += h.n; c += h.c; }
    }
    return n ? Math.round((c / n) * 100) : 0;
  }
  function recordAnswer(correct) {
    todayFresh();
    var key = Core.dayKey();
    if (S.streak.last !== key) {
      S.streak.count = S.streak.last === Core.prevDayKey() ? S.streak.count + 1 : 1;
      S.streak.last = key;
    }
    var h = S.history[key] || { n: 0, c: 0 };
    h.n += 1;
    if (correct) h.c += 1;
    S.history[key] = h;
    save();
  }

  /* ================= điều hướng ================= */
  var view = "home";
  function go(v) {
    view = v;
    if (location.hash !== "#" + v) history.replaceState(null, "", "#" + v);
    render();
  }
  function render() {
    todayFresh();
    $("#streak-n").textContent = S.streak.count;
    document.querySelectorAll(".tab").forEach(function (b) {
      b.classList.toggle("active", b.dataset.nav === view);
    });
    document.querySelectorAll(".view").forEach(function (m) {
      m.classList.toggle("hidden", m.id !== "view-" + view);
    });
    if (view === "home") renderHome();
    else if (view === "exam") renderExam();
    else if (view === "phonics") renderPhonics();
    else if (view === "grammar") renderGrammar();
    else if (view === "reader") renderReader();
    else if (view === "speech") renderSpeech();
    else if (view === "worksheet") renderWorksheet();
    else if (view === "typing") renderTyping();
    else if (view === "annotator") renderAnnotator();
    else if (view === "game") renderGame();
    else if (view === "dict") renderDictList();
    else if (view === "write") renderWrite();
    else renderProgress();
  }

  /* ================= trang Học ================= */
  function renderHome() {
    var due = dueWords();
    var learned = learnedCount();
    var pct = Math.round((learned / WORDS.length) * 100);
    var mastered = WORDS.filter(function (w) { return cardStage(w) === "mastered"; }).length;
    var left = S.settings.goal - S.daily["new"];
    var nextWords = WORDS.filter(function (w) { return !S.cards[w.id]; });
    var nextLesson = nextWords.length ? nextWords[0].lesson : null;

    var lessonChips = "";
    for (var l = 1; l <= LESSONS; l++) {
      var words = WORDS.filter(function (w) { return w.lesson === l; });
      var seen = words.filter(function (w) { return !!S.cards[w.id]; }).length;
      var cls = seen === words.length ? "done" : seen > 0 ? "partial" : "";
      lessonChips += '<button class="lesson ' + cls + '" data-act="lesson" data-lesson="' + l + '" ' +
        'aria-label="Bài ' + l + '">' + l + "</button>";
    }

    var mascotMsg = S.streak.count >= 3
      ? "Chuỗi <b>" + S.streak.count + " ngày</b> rồi! Tinh thần ngút ngàn, tiếp tục phát huy nhé!"
      : (due.length ? "Hôm nay có <b>" + due.length + " từ</b> cần ôn tập. Ôn xong hãy học từ mới nhé!" : "Mỗi ngày 15 phút, kiên trì tích tiểu thành đại!");

    var roadmapHtml =
      '<section class="roadmap-card">' +
        '<div class="roadmap-head">' +
          '<div>' +
            '<p class="eyebrow" style="margin:0">Lộ Trình Toàn Diện</p>' +
            '<h3 style="margin:2px 0">Từ Con Số 0 Đến HSK 3</h3>' +
          '</div>' +
          '<button class="btn ghost small" data-act="set-roadmap-lvl" data-lvl="0">Bắt đầu từ số 0</button>' +
        '</div>' +
        '<div class="roadmap-track">' +
          '<div class="roadmap-step' + (currentLvl === "0" ? ' active' : '') + '" data-act="set-roadmap-lvl" data-lvl="0">' +
            '<span class="roadmap-step-badge">Khởi động</span>' +
            '<span class="roadmap-step-icon">🌱</span>' +
            '<span class="roadmap-step-title">Chặng 0</span>' +
            '<span class="roadmap-step-desc">Âm tiết &amp; Nét</span>' +
          '</div>' +
          '<div class="roadmap-step' + (currentLvl === "1" ? ' active' : '') + '" data-act="set-roadmap-lvl" data-lvl="1">' +
            '<span class="roadmap-step-badge">Nền tảng</span>' +
            '<span class="roadmap-step-icon">🥉</span>' +
            '<span class="roadmap-step-title">HSK 1</span>' +
            '<span class="roadmap-step-desc">300 từ cốt lõi</span>' +
          '</div>' +
          '<div class="roadmap-step' + (currentLvl === "2" ? ' active' : '') + '" data-act="set-roadmap-lvl" data-lvl="2">' +
            '<span class="roadmap-step-badge">Mở rộng</span>' +
            '<span class="roadmap-step-icon">🥈</span>' +
            '<span class="roadmap-step-title">HSK 2</span>' +
            '<span class="roadmap-step-desc">+200 từ vựng</span>' +
          '</div>' +
          '<div class="roadmap-step' + (currentLvl === "3" ? ' active' : '') + '" data-act="set-roadmap-lvl" data-lvl="3">' +
            '<span class="roadmap-step-badge">Bứt phá</span>' +
            '<span class="roadmap-step-icon">🥇</span>' +
            '<span class="roadmap-step-title">HSK 3</span>' +
            '<span class="roadmap-step-desc">+300 từ vựng</span>' +
          '</div>' +
        '</div>' +
      '</section>';

    if (currentLvl === "0") {
      $("#view-home").innerHTML =
        '<div class="mascot-box">' +
          '<svg class="mascot-avatar" viewBox="0 0 64 64" fill="none" aria-hidden="true">' +
            '<circle cx="32" cy="32" r="28" fill="#eaf4f0" stroke="#2f6f5e" stroke-width="2"/>' +
            '<path d="M22 18 Q20 10 15 12 Q18 16 22 20" fill="#b97a12"/>' +
            '<path d="M42 18 Q44 10 49 12 Q46 16 42 20" fill="#b97a12"/>' +
            '<ellipse cx="32" cy="34" rx="18" ry="16" fill="#2f6f5e"/>' +
            '<circle cx="26" cy="32" r="4.5" fill="#fff"/>' +
            '<circle cx="26" cy="32" r="2.5" fill="#211f1b"/>' +
            '<circle cx="38" cy="32" r="4.5" fill="#fff"/>' +
            '<circle cx="38" cy="32" r="2.5" fill="#211f1b"/>' +
            '<path d="M28 41 Q32 45 36 41" stroke="#fff" stroke-width="2" stroke-linecap="round" fill="none"/>' +
          '</svg>' +
          '<div class="mascot-bubble">Chào mừng bạn bắt đầu từ con số 0! Hãy học vững <b>âm tiết Pinyin</b> và <b>8 nét chữ Hán</b> trước khi học từ vựng nhé!</div>' +
        '</div>' +
        roadmapHtml +
        '<section class="card hero">' +
          '<p class="eyebrow">Chặng 0 · Vạch Xuất Phát Cho Người Mới</p>' +
          '<h2>Khởi Động: Âm Tiết, Đi Nét &amp; Phát Âm</h2>' +
          '<p class="muted small" style="margin:4px 0 14px">Hoàn thành 6 bài học nhập môn để tạo nền tảng vững chắc nhất trước khi học 300 từ HSK 1.</p>' +
          '<div class="zero-lesson-list">' +
            '<div class="zero-lesson-item" data-nav="phonics">' +
              '<div class="zli-left">' +
                '<span class="zli-icon">🎵</span>' +
                '<div class="zli-text">' +
                  '<h4>1. 5 Thanh Điệu &amp; Đồ Thị Cao Độ</h4>' +
                  '<p>Thanh 1, 2, 3, 4, khinh thanh &amp; quy tắc biến điệu 3+3, 不, 一</p>' +
                '</div>' +
              '</div>' +
              '<span class="badge s-learning">Học ngay →</span>' +
            '</div>' +
            '<div class="zero-lesson-item" data-nav="phonics">' +
              '<div class="zli-left">' +
                '<span class="zli-icon">🗣️</span>' +
                '<div class="zli-text">' +
                  '<h4>2. 23 Thanh Mẫu (Phụ Âm Đầu)</h4>' +
                  '<p>Phân biệt âm môi b/p/m/f, âm uốn lưỡi zh/ch/sh/r, âm răng z/c/s</p>' +
                '</div>' +
              '</div>' +
              '<span class="badge s-learning">Khám phá →</span>' +
            '</div>' +
            '<div class="zero-lesson-item" data-nav="phonics">' +
              '<div class="zli-left">' +
                '<span class="zli-icon">🎶</span>' +
                '<div class="zli-text">' +
                  '<h4>3. 36 Vận Mẫu (Nguyên Âm Đơn, Kép, Mũi)</h4>' +
                  '<p>6 nguyên âm đơn, 13 nguyên âm kép, 16 âm mũi &amp; âm uốn lưỡi er</p>' +
                '</div>' +
              '</div>' +
              '<span class="badge s-learning">Xem bảng →</span>' +
            '</div>' +
            '<div class="zero-lesson-item" data-nav="phonics">' +
              '<div class="zli-left">' +
                '<span class="zli-icon">✍️</span>' +
                '<div class="zli-text">' +
                  '<h4>4. 8 Nét Chữ Hán Cơ Bản (Vĩnh Tự Bát Pháp)</h4>' +
                  '<p>Chấm (点), Ngang (横), Sổ (竖), Phẩy (撇), Mác (捺), Hất (提), Gập (折), Móc (钩)</p>' +
                '</div>' +
              '</div>' +
              '<span class="badge s-mastered">Tập đi nét →</span>' +
            '</div>' +
            '<div class="zero-lesson-item" data-nav="write">' +
              '<div class="zli-left">' +
                '<span class="zli-icon">📜</span>' +
                '<div class="zli-text">' +
                  '<h4>5. 8 Quy Tắc Bút Thuận Vàng</h4>' +
                  '<p>Ngang trước sổ sau, trên trước dưới sau, trái trước phải sau, ngoài trước trong sau...</p>' +
                '</div>' +
              '</div>' +
              '<span class="badge s-mastered">Xem quy tắc →</span>' +
            '</div>' +
            '<div class="zero-lesson-item" data-nav="speech">' +
              '<div class="zli-left">' +
                '<span class="zli-icon">🎙️</span>' +
                '<div class="zli-text">' +
                  '<h4>6. Web Speech AI Luyện Phát Âm Trực Tiếp</h4>' +
                  '<p>Bật micro đọc thử chữ Hán &amp; nhận phản hồi chấm điểm tức thì</p>' +
                '</div>' +
              '</div>' +
              '<span class="badge s-learning">Luyện nói →</span>' +
            '</div>' +
          '</div>' +
          '<div style="margin-top:16px">' +
            '<button class="btn primary wide" data-act="set-roadmap-lvl" data-lvl="1">🚀 Tiến lên Chặng 1: Học từ vựng HSK 1 (300 từ)</button>' +
          '</div>' +
        '</section>';
      return;
    }

    $("#view-home").innerHTML =
      '<div class="mascot-box">' +
        '<svg class="mascot-avatar" viewBox="0 0 64 64" fill="none" aria-hidden="true">' +
          '<circle cx="32" cy="32" r="28" fill="#eaf4f0" stroke="#2f6f5e" stroke-width="2"/>' +
          '<path d="M22 18 Q20 10 15 12 Q18 16 22 20" fill="#b97a12"/>' +
          '<path d="M42 18 Q44 10 49 12 Q46 16 42 20" fill="#b97a12"/>' +
          '<ellipse cx="32" cy="34" rx="18" ry="16" fill="#2f6f5e"/>' +
          '<circle cx="26" cy="32" r="4.5" fill="#fff"/>' +
          '<circle cx="26" cy="32" r="2.5" fill="#211f1b"/>' +
          '<circle cx="27" cy="30.5" r="1" fill="#fff"/>' +
          '<circle cx="38" cy="32" r="4.5" fill="#fff"/>' +
          '<circle cx="38" cy="32" r="2.5" fill="#211f1b"/>' +
          '<circle cx="39" cy="30.5" r="1" fill="#fff"/>' +
          '<circle cx="21" cy="38" r="3" fill="#f5c2bc" opacity="0.8"/>' +
          '<circle cx="43" cy="38" r="3" fill="#f5c2bc" opacity="0.8"/>' +
          '<circle cx="30" cy="37" r="1" fill="#eaf4f0"/>' +
          '<circle cx="34" cy="37" r="1" fill="#eaf4f0"/>' +
          '<path d="M28 41 Q32 45 36 41" stroke="#fff" stroke-width="2" stroke-linecap="round" fill="none"/>' +
        '</svg>' +
        '<div class="mascot-bubble">' + mascotMsg + '</div>' +
      '</div>' +

      roadmapHtml +

      '<section class="card hero">' +
        '<p class="eyebrow">' + esc(todayLabel()) + "</p>" +
        "<h2>" + esc(greeting()) + "</h2>" +
        '<div class="plan">' +
          '<div class="plan-row"><span class="dot due"></span><span>Đến hạn ôn</span><b>' + due.length + " từ</b></div>" +
          '<div class="plan-row"><span class="dot new"></span><span>Từ mới hôm nay</span><b>' + S.daily["new"] + " / " + S.settings.goal + "</b></div>" +
        "</div>" +
        '<div class="hero-actions">' +
          (due.length
            ? '<button class="btn primary" data-act="review">Ôn tập ngay (' + due.length + ")</button>"
            : "") +
          '<button class="btn ' + (due.length ? "ghost" : "primary") + '" data-act="learn">' +
            (left > 0 ? "Học " + left + " từ mới" : "Học thêm 10 từ") + "</button>" +
        "</div>" +
      "</section>" +

      '<section class="card">' +
        '<div class="row-between"><h3>Khám Phá Toàn Diện</h3><span class="muted small">Chuẩn HSK 3.0</span></div>' +
        '<div class="bento-grid">' +
          '<div class="bento-card" data-nav="phonics">' +
            '<span class="bento-icon">🎵</span>' +
            '<h4>Ngữ Âm Pinyin</h4>' +
            '<p>23 thanh mẫu, 36 vận mẫu &amp; 4 thanh điệu.</p>' +
          '</div>' +
          '<div class="bento-card" data-nav="speech">' +
            '<span class="bento-icon">🎙️</span>' +
            '<h4>Luyện Nói zh-CN</h4>' +
            '<p>Web Speech AI chấm điểm phát âm trực tiếp.</p>' +
          '</div>' +
          '<div class="bento-card" data-nav="reader">' +
            '<span class="bento-icon">📖</span>' +
            '<h4>Đọc Tương Tác</h4>' +
            '<p>Bài đọc ngắn, ẩn/hiện Pinyin, tra từ 1-chạm.</p>' +
          '</div>' +
          '<div class="bento-card" data-nav="grammar">' +
            '<span class="bento-icon">⚖️</span>' +
            '<h4>Sắc Thái &amp; Ngữ Pháp</h4>' +
            '<p>So sánh 二/两, 会/能/可以, 的/得/地...</p>' +
          '</div>' +
          '<div class="bento-card" data-nav="exam">' +
            '<span class="bento-icon">📝</span>' +
            '<h4>Thi Thử HSK 1 &amp; 2</h4>' +
            '<p>Đề chuẩn 40–60 câu, đếm giờ, chấm điểm.</p>' +
          '</div>' +
          '<div class="bento-card" data-nav="worksheet">' +
            '<span class="bento-icon">📄</span>' +
            '<h4>Vở Tập Viết A4</h4>' +
            '<p>Ô Mễ, ô Điền nét mờ, in &amp; xuất PDF trực tiếp.</p>' +
          '</div>' +
          '<div class="bento-card" data-nav="typing">' +
            '<span class="bento-icon">⚡</span>' +
            '<h4>Luyện Gõ Pinyin</h4>' +
            '<p>Gõ pinyin ra chữ Hán, đo CPM &amp; độ chuẩn xác.</p>' +
          '</div>' +
          '<div class="bento-card" data-nav="annotator">' +
            '<span class="bento-icon">🔤</span>' +
            '<h4>Thêm Pinyin Đoạn Văn</h4>' +
            '<p>Gán Pinyin &amp; Hán-Việt tự động cho đoạn văn bất kỳ.</p>' +
          '</div>' +
          '<div class="bento-card" data-nav="game">' +
            '<span class="bento-icon">🎮</span>' +
            '<h4>Ghép Thành Ngữ &amp; Bộ Thủ</h4>' +
            '<p>成语消消乐 4 chữ &amp; giải phẫu chữ Hán vui nhộn.</p>' +
          '</div>' +
        '</div>' +
      "</section>" +

      '<section class="card">' +
        '<div class="row-between"><h3>Tiến độ ' + (currentLvl === "1" ? "HSK 1" : currentLvl === "2" ? "HSK 2" : currentLvl === "3" ? "HSK 3" : "HSK 1+2+3") + '</h3><span class="muted">' + learned + "/" + WORDS.length + " từ</span></div>" +
        '<div class="bar" role="progressbar" aria-valuenow="' + pct + '" aria-valuemin="0" aria-valuemax="100" aria-label="Tiến độ từ vựng">' +
          '<i style="width:' + pct + '%"></i></div>' +
        '<div class="legend">' +
          "<span><i class=\"dot mastered\"></i>Đã thuộc " + mastered + "</span>" +
          "<span><i class=\"dot learning\"></i>Đang học " + (learned - mastered) + "</span>" +
          "<span><i class=\"dot new\"></i>Chưa học " + (WORDS.length - learned) + "</span>" +
        "</div>" +
      "</section>" +

      '<section class="card">' +
        '<div class="row-between"><h3>Bài học</h3>' +
          (nextLesson ? '<span class="muted">Bài tiếp theo: ' + nextLesson + "</span>" : "") + "</div>" +
        '<p class="muted small">10 từ / bài · nhấn số để học riêng bài đó</p>' +
        '<div class="lessons">' + lessonChips + "</div>" +
      "</section>";
  }

  /* ================= thi thử HSK 1 ================= */
  var examState = null;

  function renderExam() {
    var historyList = S.examHistory || [];
    var histHtml = "";
    if (historyList.length) {
      histHtml = '<div class="exam-history"><h3>Lịch sử thi thử (' + historyList.length + ' lần)</h3>' +
        historyList.map(function (item, idx) {
          var cls = item.passed ? "score-pass" : "score-fail";
          var badge = item.passed ? "ĐỖ (合格)" : "CHƯA ĐẠT (不合格)";
          return '<div class="exam-history-item">' +
            '<div><b>Lần ' + (historyList.length - idx) + ' · ' + esc(item.date) + '</b>' +
            '<div class="muted small">Nghe: ' + item.lScore + '/100 · Đọc: ' + item.rScore + '/100 · Đúng: ' + item.accuracy + '%</div></div>' +
            '<div style="text-align:right"><b class="' + cls + '" style="font-size:18px">' + item.score + '/200</b>' +
            '<div class="small ' + cls + '" style="font-weight:600">' + badge + '</div></div>' +
            '</div>';
        }).join("") + '</div>';
    }

    $("#view-exam").innerHTML =
      '<section class="card exam-intro">' +
        '<div class="eyebrow">Chuẩn CTI / HSK 3.0</div>' +
        '<h2>Thi Thử HSK Chuẩn Quốc Tế</h2>' +
        '<p class="muted">Bộ đề trắc nghiệm chuẩn mô phỏng đúng 100% cấu trúc phòng thi thật: đồng hồ đếm ngược, audio phát âm zh-CN, tự động chấm điểm và phân tích kỹ năng.</p>' +
        '<div class="exam-badge-row">' +
          '<span class="exam-tag">⏱️ 35 – 55 phút</span>' +
          '<span class="exam-tag">📝 40 – 60 câu</span>' +
          '<span class="exam-tag">🎯 Đạt: ≥ 120 / 200 điểm</span>' +
          '<span class="exam-tag">🔊 Giọng đọc zh-CN</span>' +
        '</div>' +
        '<ul class="exam-rule-list muted">' +
          '<li><b>Phần 1 — Nghe hiểu (听力):</b> Nghe phát âm chuẩn zh-CN và chọn đáp án đúng.</li>' +
          '<li><b>Phần 2 — Đọc hiểu (阅读):</b> Kiểm tra từ vựng, ngữ pháp, điền từ và đọc hiểu đối thoại.</li>' +
          '<li>Hệ thống tự động chấm điểm và lưu lịch sử thi chi tiết.</li>' +
        '</ul>' +
        '<div style="display:flex; flex-direction:column; gap:12px; margin: 18px 0 10px;">' +
          '<button class="btn primary wide" data-act="start-exam-1" style="padding:14px; font-size:15px; font-weight:600">🎯 Thi Thử HSK 1 (40 câu / 35 phút)</button>' +
          '<button class="btn ghost wide" data-act="start-exam-2" style="padding:14px; font-size:15px; font-weight:600">🚀 Thi Thử HSK 2 (60 câu / 55 phút)</button>' +
        '</div>' +
        histHtml +
      '</section>';
  }

  function startExam(level) {
    var lvl = level === 2 ? 2 : 1;
    var exam = (window.HSK_EXAMS && window.HSK_EXAMS[lvl]) || (lvl === 2 ? window.HSK2_EXAM_PRACTICE : window.HSK1_EXAM_PRACTICE);
    if (!exam || !exam.questions || !exam.questions.length) {
      toast("Đang tải dữ liệu đề thi...");
      return;
    }
    if (window.SoundFX) SoundFX.gong();
    examState = {
      exam: exam,
      idx: 0,
      answers: {},
      timeLeft: exam.durationMinutes * 60,
      timer: null
    };

    document.body.classList.add("in-session");
    $("#exam-session").classList.remove("hidden");

    clearInterval(examState.timer);
    examState.timer = setInterval(function () {
      if (!examState) return;
      examState.timeLeft--;
      var timerEl = $("#exam-timer-display");
      if (timerEl) {
        var m = Math.floor(examState.timeLeft / 60);
        var s = examState.timeLeft % 60;
        timerEl.textContent = (m < 10 ? "0" + m : m) + ":" + (s < 10 ? "0" + s : s);
        if (examState.timeLeft <= 300) timerEl.parentElement.classList.add("danger");
      }
      if (examState.timeLeft <= 0) {
        clearInterval(examState.timer);
        toast("Hết thời gian! Tự động nộp bài.");
        finishExam();
      }
    }, 1000);

    renderExamSession();
  }

  function closeExamSession() {
    if (examState && examState.timer) clearInterval(examState.timer);
    examState = null;
    document.body.classList.remove("in-session");
    $("#exam-session").classList.add("hidden");
    render();
  }

  function renderExamSession() {
    if (!examState) return;
    var el = $("#exam-session");
    var q = examState.exam.questions[examState.idx];
    var total = examState.exam.questions.length;
    var currentAns = examState.answers[q.id];

    var m = Math.floor(examState.timeLeft / 60);
    var s = examState.timeLeft % 60;
    var timeStr = (m < 10 ? "0" + m : m) + ":" + (s < 10 ? "0" + s : s);

    var palette = "";
    for (var i = 0; i < total; i++) {
      var itemQ = examState.exam.questions[i];
      var isAns = examState.answers[itemQ.id] !== undefined;
      var isAct = i === examState.idx;
      palette += '<button class="exam-p-item' + (isAns ? " answered" : "") + (isAct ? " active" : "") + '" data-act="exam-jump" data-idx="' + i + '">' + (i + 1) + '</button>';
    }

    var contentHtml = "";
    var secName = q.section === "listening" ? "Phần 1: Nghe hiểu (听力)" : "Phần 2: Đọc hiểu (阅读)";

    var audioHtml = "";
    if (q.audio) {
      audioHtml =
        '<button class="exam-audio-btn" data-act="exam-say" data-text="' + esc(q.audio) + '">' +
          '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9v6h4l5 4V5L8 9z"/><path d="M17 8a5 5 0 0 1 0 8"/></svg>' +
          '<span>🔊 Bấm để nghe phát âm (zh-CN)</span>' +
        '</button>';
    }

    if (q.type === "judge") {
      contentHtml =
        '<div class="center" style="margin: 10px 0 20px;">' +
          '<div style="font-size: 32px; font-family: var(--serif); font-weight: 600; margin-bottom: 6px;">' + esc(q.prompt) + '</div>' +
          '<div class="muted small" style="margin-bottom: 4px;">[' + esc(q.pinyin) + ']</div>' +
          '<div style="font-size: 16px; color: var(--ink); font-weight: 500;">Nghĩa: ' + esc(q.meaningPrompt) + '</div>' +
        '</div>' +
        '<div class="judge-opts">' +
          '<button class="judge-btn true' + (currentAns === true ? " selected" : "") + '" data-act="exam-answer-judge" data-val="true">✓ Đúng</button>' +
          '<button class="judge-btn false' + (currentAns === false ? " selected" : "") + '" data-act="exam-answer-judge" data-val="false">✗ Sai</button>' +
        '</div>';
    } else {
      contentHtml =
        (q.question ? '<div class="exam-q-text">' + esc(q.question) + '</div>' : '') +
        '<div class="exam-options-list">' +
          q.options.map(function (opt, optIdx) {
            var isSel = currentAns === optIdx;
            return '<button class="exam-opt' + (isSel ? " selected" : "") + '" data-act="exam-answer-choice" data-opt="' + optIdx + '">' +
              '<span>' + esc(opt) + '</span>' +
            '</button>';
          }).join("") +
        '</div>';
    }

    el.innerHTML =
      '<div class="exam-topbar">' +
        '<button class="icon-btn" data-act="quit-exam" aria-label="Thoát bài thi">✕</button>' +
        '<div class="exam-timer' + (examState.timeLeft <= 300 ? " danger" : "") + '">⏱️ <span id="exam-timer-display">' + timeStr + '</span></div>' +
        '<button class="btn primary" data-act="submit-exam" style="padding: 6px 14px; font-size: 13px;">Nộp bài</button>' +
      '</div>' +
      '<div class="exam-palette">' + palette + '</div>' +
      '<div class="exam-container">' +
        '<div class="row-between" style="margin-bottom: 12px;">' +
          '<span class="exam-section-badge">' + secName + '</span>' +
          '<span class="exam-progress-num">Câu ' + (examState.idx + 1) + ' / ' + total + '</span>' +
        '</div>' +
        '<div class="exam-q-box">' +
          audioHtml +
          contentHtml +
        '</div>' +
        '<div class="exam-nav-bar">' +
          '<button class="btn ghost" data-act="exam-prev"' + (examState.idx === 0 ? " disabled style='opacity:.4'" : "") + '>← Câu trước</button>' +
          (examState.idx < total - 1
            ? '<button class="btn primary" data-act="exam-next">Câu sau →</button>'
            : '<button class="btn primary" data-act="submit-exam">Hoàn tất &amp; Nộp bài</button>') +
        '</div>' +
      '</div>';
  }

  function finishExam() {
    if (!examState) return;
    if (examState.timer) clearInterval(examState.timer);

    var res = Core.scoreExam(examState.exam, examState.answers);

    S.examHistory = S.examHistory || [];
    S.examHistory.unshift({
      date: Core.dayKey(),
      score: res.totalScore,
      lScore: res.listeningScore,
      rScore: res.readingScore,
      passed: res.passed,
      accuracy: res.accuracy
    });
    if (S.examHistory.length > 20) S.examHistory.pop();
    save();

    if (window.SoundFX) {
      if (res.passed) SoundFX.zenBell();
      else SoundFX.wrong();
    }

    renderExamResult(res);
  }

  function renderExamResult(res) {
    var el = $("#exam-session");
    var passClass = res.passed ? "score-pass" : "score-fail";
    var passTitle = res.passed ? "CHÚC MỪNG: BẠN ĐÃ ĐỖ (合格)!" : "CẦN CỐ GẮNG THÊM (不合格)";
    var passNote = res.passed ? "Bạn đã hoàn thành xuất sắc bài thi thử HSK 1 theo chuẩn mới." : "Điểm chuẩn đỗ là 120/200 điểm. Hãy ôn tập lại các từ chưa thuộc và làm lại nhé.";

    var reviewHtml = res.details.map(function (d, i) {
      var q = examState.exam.questions[i];
      var statusIcon = d.isCorrect ? "✅ Đúng" : "❌ Sai";
      var statusCls = d.isCorrect ? "correct" : "wrong";
      var yourAnsText = d.userAnswer === undefined ? "Chưa trả lời" : (q.type === "judge" ? (d.userAnswer ? "Đúng" : "Sai") : q.options[d.userAnswer]);
      var correctAnsText = q.type === "judge" ? (q.correct ? "Đúng" : "Sai") : q.options[q.correct];

      return '<div class="exam-review-item ' + statusCls + '">' +
        '<div class="row-between"><b>Câu ' + d.id + ' (' + (d.section === "listening" ? "Nghe" : "Đọc") + ')</b><span class="small" style="font-weight:600">' + statusIcon + '</span></div>' +
        '<div class="small" style="margin: 6px 0;">Đáp án của bạn: <span style="font-weight:500">' + esc(yourAnsText) + '</span> · Đáp án đúng: <b style="color:var(--jade)">' + esc(correctAnsText) + '</b></div>' +
        '<div class="small muted" style="line-height:1.45">' + esc(d.explanation) + '</div>' +
        '</div>';
    }).join("");

    el.innerHTML =
      '<div class="exam-result-view">' +
        '<div class="exam-score-banner">' +
          '<div class="eyebrow">Kết quả thi thử HSK 1</div>' +
          '<h2 class="' + passClass + '" style="margin: 6px 0 10px;">' + passTitle + '</h2>' +
          '<div class="exam-score-num ' + passClass + '">' + res.totalScore + ' <span style="font-size:20px; font-weight:normal; color:var(--muted)">/ 200 điểm</span></div>' +
          '<div class="muted small">' + passNote + '</div>' +
          '<div class="exam-score-breakdown">' +
            '<div><span>Phần Nghe</span><b>' + res.listeningScore + '/100</b></div>' +
            '<div><span>Phần Đọc</span><b>' + res.readingScore + '/100</b></div>' +
            '<div><span>Độ chính xác</span><b>' + res.accuracy + '%</b></div>' +
          '</div>' +
          '<div style="display:flex; gap:10px; justify-content:center; margin-top:16px;">' +
            '<button class="btn primary" data-act="start-exam">Thi lại bài này</button>' +
            '<button class="btn ghost" data-act="quit-exam">Đóng &amp; Về trang chủ</button>' +
          '</div>' +
        '</div>' +
        '<h3 style="text-align:left; margin: 24px 0 14px;">Chi tiết đáp án &amp; Giải thích (40 câu)</h3>' +
        reviewHtml +
        '<div style="margin-top:20px;">' +
          '<button class="btn primary wide" data-act="quit-exam">Đóng &amp; Quay lại</button>' +
        '</div>' +
      '</div>';
  }

  /* ================= phân hệ Ngữ Âm Pinyin ================= */
  function renderPhonics() {
    var pData = window.PINYIN_DATA;
    if (!pData) {
      $("#view-phonics").innerHTML = '<div class="card"><p class="muted">Đang tải dữ liệu ngữ âm...</p></div>';
      return;
    }

    var tonesHtml = pData.tones.map(function (t) {
      return '<div class="tone-card">' +
        '<div class="tone-head">' +
          '<span class="tone-mark">' + t.mark + '</span>' +
          '<span class="tone-pitch-badge">' + t.pitch + '</span>' +
        '</div>' +
        '<h4 style="margin:4px 0 6px">' + t.name + '</h4>' +
        '<div class="tone-curve-wrap">' +
          '<svg class="tone-curve-svg" viewBox="0 0 100 100">' +
            '<path class="tone-curve-path" d="' + t.curvePath + '"/>' +
          '</svg>' +
        '</div>' +
        '<p class="muted small" style="margin-bottom:6px">' + t.desc + '</p>' +
        '<div class="muted small" style="color:var(--jade)"><b>Mẹo Việt:</b> ' + t.tipViet + '</div>' +
        '<div class="tone-ex-row">' +
          '<div><b style="font-size:18px;font-family:var(--serif)">' + t.exampleHz + '</b> <span class="muted small">[' + t.examplePy + ' · ' + t.exampleVi + ']</span></div>' +
          '<button class="icon-btn" data-act="say-sfx" data-text="' + t.exampleHz + '" title="Nghe phát âm">🔊</button>' +
        '</div>' +
      '</div>';
    }).join("");

    var initialsHtml = pData.initials.map(function (init) {
      return '<button class="p-chip" data-act="say-sfx" data-text="' + init.py + 'a">' +
        '<b>' + init.py + '</b>' +
        '<span class="muted small">' + init.ex.split(" ")[0] + '</span>' +
      '</button>';
    }).join("");

    var finalsHtml = pData.finals.map(function (fin) {
      return '<button class="p-chip" data-act="say-sfx" data-text="' + fin.py + '">' +
        '<b>' + fin.py + '</b>' +
        '<span class="muted small">' + fin.ex.split(" ")[0] + '</span>' +
      '</button>';
    }).join("");

    var strokesHtml = (pData.basicStrokes || []).map(function (s) {
      return '<div class="stroke-card">' +
        '<div class="stroke-card-header">' +
          '<div class="stroke-symbol-box">' + esc(s.symbol) + '</div>' +
          '<div class="stroke-card-info">' +
            '<h4>' + esc(s.name) + '</h4>' +
            '<span>' + esc(s.zh) + '</span>' +
          '</div>' +
        '</div>' +
        '<div class="stroke-card-dir"><b>Cách đi nét:</b> ' + esc(s.direction) + '</div>' +
        '<div class="small muted" style="margin-bottom:8px">💡 <i>' + esc(s.tip) + '</i></div>' +
        '<div class="stroke-card-footer">' +
          '<span class="stroke-ex-tag">Ví dụ: <b>' + esc(s.examples.join(" · ")) + '</b></span>' +
          '<button class="btn ghost small" data-act="char-stroke" data-char="' + esc(s.examples[0]) + '">' +
            '✍️ Xem đi nét' +
          '</button>' +
        '</div>' +
      '</div>';
    }).join("");

    var strokeRulesHtml = (window.STROKE_RULES || []).map(function (r, idx) {
      return '<div class="rule-item">' +
        '<span class="rule-num">' + (idx + 1) + '</span>' +
        '<div style="flex:1">' +
          '<div><b>' + esc(r.title) + '</b> <span class="muted">(' + esc(r.zh) + ')</span></div>' +
          '<div class="small muted">' + esc(r.desc) + ' · Ví dụ: <b style="color:var(--jade)">' + esc(r.example) + '</b></div>' +
        '</div>' +
      '</div>';
    }).join("");

    $("#view-phonics").innerHTML =
      '<div class="row-between" style="margin-bottom:14px">' +
        '<div>' +
          '<p class="eyebrow">Chặng 0 · Nền Tảng Từ Số 0</p>' +
          '<h2 style="margin:2px 0">Âm Tiết, Thanh Điệu &amp; Đi Nét</h2>' +
        '</div>' +
        '<button class="btn ghost small" data-nav="home">← Trang chủ</button>' +
      '</div>' +
      '<section class="card phonics-section">' +
        '<div class="row-between">' +
          '<h3>1. 8 Nét Cơ Bản Của Chữ Hán (永字八法)</h3>' +
          '<span class="badge s-mastered">Bút Họa</span>' +
        '</div>' +
        '<p class="muted small">Vĩnh Tự Bát Pháp: 8 nét chữ cơ bản cấu thành mọi chữ Hán. Nhấn "Xem đi nét" để xem thứ tự nét viết.</p>' +
        '<div class="basic-strokes-grid">' + strokesHtml + '</div>' +
      '</section>' +
      '<section class="card phonics-section">' +
        '<h3>2. 8 Quy Tắc Bút Thuận Vàng</h3>' +
        '<p class="muted small">Quy tắc viết chữ Hán từ trên xuống dưới, từ trái sang phải, trong ngoài trước sau.</p>' +
        '<div style="margin-top:10px">' + strokeRulesHtml + '</div>' +
      '</section>' +
      '<section class="card phonics-section">' +
        '<h3>3. 5 Thanh Điệu Chính Thức</h3>' +
        '<p class="muted small">Biểu đồ cao độ 5 mức chuẩn quốc tế giúp khắc phục triệt để lỗi phát âm thanh 1 và thanh 4 của người Việt.</p>' +
        '<div class="tone-grid">' + tonesHtml + '</div>' +
      '</section>' +
      '<section class="card phonics-section">' +
        '<h3>4. 23 Thanh Mẫu (Phụ âm đầu)</h3>' +
        '<p class="muted small">Chạm vào từng phụ âm để nghe âm mẫu chuẩn.</p>' +
        '<div class="pinyin-chips">' + initialsHtml + '</div>' +
      '</section>' +
      '<section class="card phonics-section">' +
        '<h3>5. 36 Vận Mẫu (Nguyên âm)</h3>' +
        '<p class="muted small">Chạm vào từng vần để nghe âm mẫu chuẩn.</p>' +
        '<div class="pinyin-chips">' + finalsHtml + '</div>' +
      '</section>' +
      '<section class="card phonics-section">' +
        '<h3>6. Quy Tắc Biến Điệu Quan Trọng</h3>' +
        rulesHtml +
      '</section>';
  }

  /* ================= phân hệ Ngữ Pháp & Nuance ================= */
  function renderGrammar() {
    var gData = window.GRAMMAR_DATA;
    if (!gData) {
      $("#view-grammar").innerHTML = '<div class="card"><p class="muted">Đang tải dữ liệu ngữ pháp...</p></div>';
      return;
    }

    var nuancesHtml = gData.nuances.map(function (n) {
      var itemsHtml = n.items.map(function (it) {
        var exHtml = it.examples.map(function (ex) {
          return '<div style="margin-bottom:4px">' +
            '<b style="font-family:var(--serif)">' + ex.hz + '</b> ' +
            '<span class="muted small">[' + ex.py + ']</span> ' +
            '<span class="small">➔ ' + ex.vi + '</span>' +
          '</div>';
        }).join("");

        return '<div class="nuance-item">' +
          '<h4 style="margin:0;color:var(--ink)">' + it.word + '</h4>' +
          '<div class="nuance-formula">' + it.formula + '</div>' +
          '<p class="small muted" style="margin:0 0 8px">' + it.role + '</p>' +
          '<div class="small">' + exHtml + '</div>' +
        '</div>';
      }).join("");

      return '<div class="nuance-card">' +
        '<div class="row-between">' +
          '<h3 style="margin:0">' + n.title + '</h3>' +
          '<span class="badge s-mastered">' + n.category + '</span>' +
        '</div>' +
        '<p class="muted small" style="margin:6px 0 12px">' + n.summary + '</p>' +
        '<div class="nuance-grid">' + itemsHtml + '</div>' +
        '<div class="nuance-tip-box">💡 ' + n.quickTip + '</div>' +
      '</div>';
    }).join("");

    var structHtml = gData.structures.map(function (s) {
      return '<div class="rule-card" style="margin-bottom:12px">' +
        '<h4 style="margin:0 0 4px;color:var(--jade)">' + s.title + '</h4>' +
        '<div class="nuance-formula" style="margin-bottom:6px">' + s.formula + '</div>' +
        '<p class="small" style="margin:0 0 6px">' + s.rule + '</p>' +
        '<div class="small muted"><b>Ví dụ:</b> ' + s.example + '</div>' +
      '</div>';
    }).join("");

    $("#view-grammar").innerHTML =
      '<div class="row-between" style="margin-bottom:14px">' +
        '<div>' +
          '<p class="eyebrow">Thực Chiến HSK 1-2</p>' +
          '<h2 style="margin:2px 0">Ngữ Pháp &amp; So Sánh Sắc Thái</h2>' +
        '</div>' +
        '<button class="btn ghost small" data-nav="home">← Trang chủ</button>' +
      '</div>' +
      '<section class="card" style="margin-bottom:18px">' +
        '<h3>So Sánh Sắc Thái Từ Dễ Nhầm (Nuance Comparator)</h3>' +
        '<p class="muted small">Phân biệt chính xác các cặp từ kinh điển mà người Việt hay nhầm lẫn nhất.</p>' +
        '<div class="nuance-wrap">' + nuancesHtml + '</div>' +
      '</section>' +
      '<section class="card">' +
        '<h3>Cấu Trúc Câu Trọng Điểm</h3>' +
        structHtml +
      '</section>';
  }

  /* ================= phân hệ Luyện Đọc Tương Tác ================= */
  var readerPinyinVisible = true;
  var currentArticleIdx = 0;

  function renderReader() {
    var rData = window.READER_DATA;
    if (!rData || !rData.length) {
      $("#view-reader").innerHTML = '<div class="card"><p class="muted">Đang tải dữ liệu bài đọc...</p></div>';
      return;
    }

    var article = rData[currentArticleIdx] || rData[0];

    var articleTabs = rData.map(function (a, idx) {
      return '<button class="chip' + (idx === currentArticleIdx ? " active" : "") + '" data-act="select-article" data-idx="' + idx + '">' +
        esc(a.title.slice(0, 8)) + (a.title.length > 8 ? "…" : "") +
      '</button>';
    }).join("");

    var paragraphsHtml = article.paragraphs.map(function (p) {
      var sentencesHtml = p.sentences.map(function (s) {
        return s.tokens.map(function (tok) {
          if (tok.isPunc) return '<span style="font-size:22px">' + esc(tok.h) + '</span>';
          return '<span class="reader-token" data-act="lookup-token" ' +
            'data-hz="' + esc(tok.h) + '" ' +
            'data-py="' + esc(tok.p) + '" ' +
            'data-hv="' + esc(tok.hv) + '" ' +
            'data-vi="' + esc(tok.vi) + '">' +
            '<span class="token-py">' + esc(tok.p) + '</span>' +
            '<span class="token-hz">' + esc(tok.h) + '</span>' +
          '</span>';
        }).join(" ");
      }).join("");

      return '<div style="margin-bottom:16px;display:flex;align-items:flex-start;gap:10px">' +
        '<button class="icon-btn" data-act="say-sfx" data-text="' + esc(p.audioText) + '" title="Nghe đoạn này" style="margin-top:6px">🔊</button>' +
        '<div style="flex:1">' + sentencesHtml + '</div>' +
      '</div>';
    }).join("");

    $("#view-reader").innerHTML =
      '<div class="row-between" style="margin-bottom:14px">' +
        '<div>' +
          '<p class="eyebrow">HSK Interactive Reader</p>' +
          '<h2 style="margin:2px 0">Trình Luyện Đọc Tương Tác</h2>' +
        '</div>' +
        '<button class="btn ghost small" data-nav="home">← Trang chủ</button>' +
      '</div>' +
      '<div class="chips" style="margin-bottom:14px">' + articleTabs + '</div>' +
      '<article class="reader-article ' + (readerPinyinVisible ? '' : 'reader-pinyin-hidden') + '">' +
        '<div class="reader-top-tools">' +
          '<div>' +
            '<span class="badge s-mastered">' + article.level + '</span> ' +
            '<b style="font-size:17px">' + esc(article.title) + '</b>' +
            '<div class="muted small">' + esc(article.titleVi) + '</div>' +
          '</div>' +
          '<button class="btn ghost small" data-act="toggle-reader-pinyin">' +
            (readerPinyinVisible ? "Ẩn Pinyin" : "Hiện Pinyin") +
          '</button>' +
        '</div>' +
        '<div class="reader-body">' + paragraphsHtml + '</div>' +
        '<div class="muted small" style="margin-top:16px;border-top:1px solid var(--line);padding-top:10px">' +
          '💡 Chạm vào bất kỳ từ vựng nào có gạch chân nét đứt để tra nghĩa, âm Hán–Việt và phát âm tức thì.' +
        '</div>' +
      '</article>';
  }

  function openLookup(tok) {
    if (window.SoundFX) SoundFX.tap();
    var chars = Array.from(tok.hz || "");
    var syls = Core.syllables(tok.py || "");
    var charStrokesHtml = "";
    if (chars.length > 0) {
      charStrokesHtml = '<div style="margin:14px 0 6px;text-align:left">' +
        '<div class="muted small" style="margin-bottom:6px;font-weight:600">Tập viết &amp; đi nét từng chữ:</div>' +
        '<div style="display:flex;gap:8px;flex-wrap:wrap">' +
          chars.map(function (ch, idx) {
            var s = syls[idx] || "";
            return '<button class="btn ghost small" data-act="char-stroke" data-char="' + esc(ch) + '" style="font-size:12.5px">' +
              '✍️ Viết chữ <b>' + esc(ch) + '</b>' + (s ? ' [' + esc(s) + ']' : '') +
            '</button>';
          }).join("") +
        '</div>' +
      '</div>';
    }

    $("#lookup-body").innerHTML =
      '<div class="lookup-hz">' + esc(tok.hz) + '</div>' +
      '<div class="lookup-py">' + pinyinHTML(tok.py) + '</div>' +
      '<div class="lookup-hv">Âm Hán–Việt: <b>' + esc(tok.hv) + '</b></div>' +
      '<div class="lookup-vi">' + esc(tok.vi) + '</div>' +
      charStrokesHtml +
      '<button class="btn primary wide" data-act="say-sfx" data-text="' + esc(tok.hz) + '" style="margin-top:12px">🔊 Phát âm chuẩn</button>';
    $("#lookupSheet").classList.remove("hidden");
  }
  function closeLookup() {
    $("#lookupSheet").classList.add("hidden");
  }

  /* ================= luyện nói & chấm phát âm zh-CN ================= */
  var speechWordIdx = 0;
  var speechResult = null;

  function renderSpeech() {
    var list = WORDS.length ? WORDS : ALL_WORDS;
    var word = list[speechWordIdx % list.length];

    var micStatusHtml = "";
    if (window.HanLoSpeech && window.HanLoSpeech.isListening) {
      micStatusHtml = '<div class="speech-status listening"><span class="pulse-ring"></span> Đang lắng nghe giọng bạn... Hãy đọc to rõ chữ Hán!</div>';
    } else if (speechResult) {
      var passCls = speechResult.passed ? "pass" : "fail";
      micStatusHtml = '<div class="speech-result-card ' + passCls + '">' +
        '<div class="score-tag">' + speechResult.score + '% · ' + esc(speechResult.grade) + '</div>' +
        '<div class="speech-detail">Bạn đã nói: <b>' + (esc(speechResult.text) || "(Chưa rõ âm)") + '</b></div>' +
        '</div>';
    } else {
      micStatusHtml = '<p class="muted small center" style="margin-top:12px">Nhấn nút Micro và đọc to chữ Hán để máy chấm điểm phát âm.</p>';
    }

    $("#view-speech").innerHTML =
      '<div class="row-between" style="margin-bottom:14px">' +
        '<div>' +
          '<p class="eyebrow">Web Speech AI · zh-CN</p>' +
          '<h2 style="margin:2px 0">Luyện Nói &amp; Chấm Phát Âm</h2>' +
        '</div>' +
        '<button class="btn ghost small" data-nav="home">← Trang chủ</button>' +
      '</div>' +

      '<section class="card speech-practice-card">' +
        '<div class="speech-target-box">' +
          '<div class="speech-target-char">' + esc(word.h) + '</div>' +
          '<div class="speech-target-pinyin">' + pinyinHTML(word.p) + '</div>' +
          '<div class="speech-target-hv">Âm Hán-Việt: <b>' + esc(word.hv.toUpperCase()) + '</b></div>' +
          '<div class="speech-target-vi">Nghĩa: ' + esc(word.vi) + '</div>' +
          '<button class="audio-listen-btn" data-act="speech-tts" data-word="' + esc(word.h) + '">' +
            '🔊 Nghe phát âm mẫu' +
          '</button>' +
        '</div>' +

        '<div class="speech-mic-area">' +
          '<button class="mic-action-btn' + (window.HanLoSpeech && window.HanLoSpeech.isListening ? ' recording' : '') + '" data-act="speech-mic" aria-label="Bật mic nói">' +
            '<svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
              '<path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/>' +
              '<path d="M19 10v2a7 7 0 0 1-14 0v-2"/>' +
              '<line x1="12" y1="19" x2="12" y2="23"/>' +
              '<line x1="8" y1="23" x2="16" y2="23"/>' +
            '</svg>' +
          '</button>' +
          micStatusHtml +
        '</div>' +

        '<div class="speech-nav-row">' +
          '<button class="btn ghost" data-act="speech-prev">← Từ trước</button>' +
          '<span class="muted small">Từ ' + ((speechWordIdx % list.length) + 1) + ' / ' + list.length + '</span>' +
          '<button class="btn primary" data-act="speech-next">Từ tiếp theo →</button>' +
        '</div>' +
      '</section>';
  }

  function toggleSpeechMic() {
    if (!window.HanLoSpeech || !window.HanLoSpeech.isSupported) {
      toast("Trình duyệt không hỗ trợ Web Speech API (Hãy dùng Chrome hoặc Edge)");
      return;
    }
    var list = WORDS.length ? WORDS : ALL_WORDS;
    var word = list[speechWordIdx % list.length];

    if (window.HanLoSpeech.isListening) {
      window.HanLoSpeech.stopListening();
      renderSpeech();
      return;
    }

    speechResult = null;
    window.HanLoSpeech.startListening(
      word.h,
      function onResult(res) {
        speechResult = res;
        if (window.SoundFX) {
          if (res.score >= 80) SoundFX.bell();
          else if (res.score >= 50) SoundFX.tap();
          else SoundFX.wrong();
        }
        if (window.HanLoDB && window.HanLoDB.isSupported) {
          window.HanLoDB.put("speaking_records", {
            word: word.h,
            pinyin: word.p,
            score: res.score,
            spoken: res.text,
            timestamp: new Date().toISOString()
          }).catch(function(){});
        }
        renderSpeech();
      },
      function onError(err) {
        toast("Nhận diện âm thanh: " + (err || "Hãy thử lại"));
        renderSpeech();
      },
      function onStart() {
        if (window.SoundFX) SoundFX.tap();
        renderSpeech();
      },
      function onEnd() {
        renderSpeech();
      }
    );
  }

  /* ================= virtual stroke canvas ================= */
  var activeStrokeCanvas = null;

  function initVirtualCanvas(char) {
    var host = $("#stroke-canvas-container");
    if (!host || typeof window.StrokeCanvas === "undefined") return;
    activeStrokeCanvas = new window.StrokeCanvas(host, {
      size: Math.min(320, window.innerWidth - 48),
      watermarkChar: char || "永",
      gridType: "mi",
      inkColor: "#1c1917",
      lineWidth: 8
    });
  }

  /* ================= sao lưu & phục hồi tiến độ ================= */
  function exportBackup() {
    if (window.SoundFX) SoundFX.tap();
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(S, null, 2));
    var dl = document.createElement("a");
    dl.setAttribute("href", dataStr);
    dl.setAttribute("download", "hanlo_backup_" + Core.dayKey() + ".json");
    document.body.appendChild(dl);
    dl.click();
    dl.remove();
    toast("Đã xuất file sao lưu tiến độ học!");
  }

  function importBackup(file) {
    var reader = new FileReader();
    reader.onload = function (e) {
      try {
        var imported = JSON.parse(e.target.result);
        if (imported && imported.v && imported.cards) {
          S = imported;
          save();
          render();
          if (window.SoundFX) SoundFX.zenBell();
          toast("Khôi phục tiến độ thành công!");
          $("#settings").classList.add("hidden");
        } else {
          toast("File sao lưu không hợp lệ.");
        }
      } catch (err) {
        toast("Lỗi đọc file sao lưu.");
      }
    };
    reader.readAsText(file);
  }

  /* ================= từ điển ================= */
  var dictQuery = "", dictFilter = "all";
  function norm(s) {
    return String(s).normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D").toLowerCase();
  }
  function renderDictList() {
    var q = norm(dictQuery.trim());
    var list = WORDS.filter(function (w) {
      var stage = cardStage(w);
      if (dictFilter === "new" && stage !== "new") return false;
      if (dictFilter === "learning" && (stage === "new" || stage === "mastered")) return false;
      if (dictFilter === "mastered" && stage !== "mastered") return false;
      if (!q) return true;
      return norm(w.h).indexOf(q) > -1 || norm(w.p).indexOf(q) > -1 || norm(w.hv).indexOf(q) > -1 || norm(w.vi).indexOf(q) > -1;
    });

    $("#dict-count").textContent = list.length + " / " + WORDS.length + " từ";
    if (!list.length) {
      $("#dict-list").innerHTML = '<li class="empty">Không tìm thấy từ phù hợp.</li>';
      return;
    }
    $("#dict-list").innerHTML = list.map(function (w) {
      var stage = cardStage(w);
      var pinyin = S.settings.pinyin ? '<span class="w-py">' + pinyinHTML(w.p) + "</span>" : "";
      return '<li class="word-row ' + stage + '" data-id="' + w.id + '">' +
        '<div class="w-main"><span class="w-hz">' + esc(w.h) + "</span>" + pinyin + "</div>" +
        '<div class="w-sub"><span class="w-hv">' + esc(w.hv) + '</span><span class="w-vi">' + esc(w.vi) + "</span></div>" +
        '<button class="icon-btn say" data-act="say" data-text="' + esc(w.h) + '" aria-label="Nghe ' + esc(w.h) + '">' +
          '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9v6h4l5 4V5L8 9z"/><path d="M17 8a5 5 0 0 1 0 8"/></svg>' +
        "</button>" +
        "</li>";
    }).join("");
  }

  /* ================= tiến độ ================= */
  function renderProgress() {
    var st = { learned: 0, mastered: 0, learning: 0, review: 0 };
    WORDS.forEach(function (w) {
      var s = cardStage(w);
      if (s === "new") return;
      st.learned++;
      if (s === "mastered") st.mastered++;
      else if (s === "learning") st.learning++;
      else st.review++;
    });
    var due = dueWords().length;
    var acc = accuracy(7);

    var bars = "";
    var max = 1;
    var days = [];
    for (var i = 13; i >= 0; i--) {
      var t = Date.now() - i * Core.DAY;
      var key = Core.dayKey(t);
      var h = S.history[key] || { n: 0, c: 0 };
      days.push({ key: key, n: h.n, label: new Date(t).getDate() });
      if (h.n > max) max = h.n;
    }
    days.forEach(function (d) {
      var h = Math.max(3, Math.round((d.n / max) * 100));
      bars += '<div class="day' + (d.n ? "" : " zero") + '" title="' + d.key + ": " + d.n + ' lượt"><i style="height:' + h + '%"></i><span>' + d.label + "</span></div>";
    });

    var total = WORDS.length;
    var seg = function (n, cls) { return '<i class="' + cls + '" style="width:' + (n / total) * 100 + '%"></i>'; };

    // Study Heatmap 52 tuần (364 ngày)
    var heatCells = "";
    var nowMs = Date.now();
    for (var hi = 363; hi >= 0; hi--) {
      var dTime = nowMs - hi * 86400000;
      var dKey = Core.dayKey(dTime);
      var rec = S.history[dKey];
      var cnt = rec ? rec.n : 0;
      var lvl = cnt === 0 ? 0 : cnt <= 5 ? 1 : cnt <= 15 ? 2 : cnt <= 30 ? 3 : 4;
      heatCells += '<div class="heat-cell heat-' + lvl + '" title="' + dKey + ': ' + cnt + ' lượt ôn"></div>';
    }

    // Memory Matrix (4 cấp độ củng cố trí nhớ SM-2)
    var m1 = 0, m2 = 0, m3 = 0, m4 = 0;
    Object.keys(S.cards).forEach(function (k) {
      var c = S.cards[k];
      if (!c) return;
      var iv = c.interval || 0;
      if (iv <= 1) m1++;
      else if (iv <= 6) m2++;
      else if (iv <= 20) m3++;
      else m4++;
    });

    $("#view-progress").innerHTML =
      '<section class="stat-grid">' +
        '<div class="card stat"><b>' + st.learned + "</b><span>Đã học</span></div>" +
        '<div class="card stat"><b>' + st.mastered + "</b><span>Đã thuộc</span></div>" +
        '<div class="card stat"><b>' + due + "</b><span>Đến hạn</span></div>" +
        '<div class="card stat"><b>' + S.streak.count + "</b><span>Chuỗi ngày</span></div>" +
      "</section>" +

      '<section class="card">' +
        '<div class="row-between"><h3>Ma Trận Trí Nhớ (SM-2)</h3><span class="muted small">Độ bền hồi tưởng</span></div>' +
        '<div class="matrix-grid">' +
          '<div class="matrix-card"><b>' + m1 + '</b><span>Mới tiếp nhận (≤ 1 ngày)</span></div>' +
          '<div class="matrix-card"><b>' + m2 + '</b><span>Củng cố ngắn (2–6 ngày)</span></div>' +
          '<div class="matrix-card"><b>' + m3 + '</b><span>Vững chắc (7–20 ngày)</span></div>' +
          '<div class="matrix-card"><b>' + m4 + '</b><span>Trí nhớ dài hạn (&gt; 20 ngày)</span></div>' +
        '</div>' +
      '</section>' +

      '<section class="card">' +
        "<h3>Phân bố " + total + " từ (" + (currentLvl === "1" ? "HSK 1" : currentLvl === "2" ? "HSK 2" : currentLvl === "3" ? "HSK 3" : "Tất cả") + ")</h3>" +
        '<div class="seg">' +
          seg(total - st.learned, "s-new") + seg(st.learning, "s-learning") +
          seg(st.review, "s-review") + seg(st.mastered, "s-mastered") +
        "</div>" +
        '<div class="legend wrap">' +
          "<span><i class=\"dot new\"></i>Chưa học " + (total - st.learned) + "</span>" +
          "<span><i class=\"dot learning\"></i>Đang học " + st.learning + "</span>" +
          "<span><i class=\"dot review\"></i>Đang ôn " + st.review + "</span>" +
          "<span><i class=\"dot mastered\"></i>Đã thuộc " + st.mastered + "</span>" +
        "</div>" +
      "</section>" +

      '<section class="card">' +
        '<div class="row-between"><h3>Bản Đồ Hoạt Động (52 Tuần)</h3><span class="muted small">Phong cách GitHub</span></div>' +
        '<p class="muted small">Mật độ ôn tập và củng cố từ vựng trong 365 ngày qua.</p>' +
        '<div class="heatmap-wrap">' +
          '<div class="heatmap-grid">' + heatCells + '</div>' +
        '</div>' +
        '<div class="legend" style="margin-top:8px;justify-content:flex-end;gap:6px">' +
          '<span class="muted small">Ít</span>' +
          '<span class="heat-cell heat-0"></span>' +
          '<span class="heat-cell heat-1"></span>' +
          '<span class="heat-cell heat-2"></span>' +
          '<span class="heat-cell heat-3"></span>' +
          '<span class="heat-cell heat-4"></span>' +
          '<span class="muted small">Nhiều</span>' +
        '</div>' +
      '</section>' +

      '<section class="card">' +
        "<h3>14 ngày gần đây</h3>" +
        '<div class="chart">' + bars + "</div>" +
        '<p class="muted small">Số lượt trả lời mỗi ngày.</p>' +
      "</section>" +

      '<section class="card">' +
        '<div class="row-between"><h3>Độ chính xác 7 ngày</h3><b class="big-num">' + acc + "%</b></div>" +
        '<div class="bar"><i style="width:' + acc + '%"></i></div>' +
      "</section>" +

      '<p class="muted small center">Hán Lộ HSK 3.0 · PWA Offline-First · Lưu trữ an toàn trên thiết bị.</p>';
  }

  /* ================= phiên học ================= */
  var ses = null;

  function startLearn(lesson, count) {
    todayFresh();
    var pool = WORDS.filter(function (w) { return !S.cards[w.id] && (!lesson || w.lesson === lesson); });
    if (!pool.length) {
      toast(lesson ? "Bài này đã học xong. Dùng Ôn tập nhé." : "Bạn đã học hết 300 từ HSK 1. Ôn tập để nhớ lâu nhé.");
      return;
    }
    var n = Math.min(count || 10, pool.length);
    ses = {
      mode: "learn",
      queue: pool.slice(0, n).map(function (w) { return { word: w }; }),
      i: 0, correct: 0, total: n,
      step: "intro", answered: false, picked: -1, quiz: null, autoPlayed: false
    };
    openSession();
  }

  function startReview() {
    todayFresh();
    var due = dueWords();
    if (!due.length) { toast("Không có từ nào đến hạn. Học từ mới nhé!"); return; }
    var queue = shuffle(due.slice(0, 60)).map(function (w) { return { word: w }; });
    ses = {
      mode: "review",
      queue: queue, i: 0, correct: 0, total: queue.length,
      step: "quiz", answered: false, picked: -1, quiz: null, autoPlayed: false
    };
    openSession();
  }

  function openSession() {
    document.body.classList.add("in-session");
    $("#session").classList.remove("hidden");
    renderSession();
  }
  function closeSession() {
    ses = null;
    document.body.classList.remove("in-session");
    $("#session").classList.add("hidden");
    render();
  }

  function makeQuiz(word, forcedType) {
    var types = (S.settings.pinyin ? ["vi", "hz", "py"] : ["vi", "hz"]).concat(hasTTS() ? ["audio"] : []);
    var type = forcedType || pick(types);
    var field = type === "vi" ? "vi" : type === "py" ? "p" : "h";
    var pool = WORDS.filter(function (w) { return w.id !== word.id && w[field] !== word[field]; });
    shuffle(pool);
    var options = [word].concat(pool.slice(0, 3));
    shuffle(options);
    return {
      type: type,
      field: field,
      options: options,
      answer: options.findIndex(function (w) { return w.id === word.id; })
    };
  }

  function optionLabel(q, w) {
    if (q.field === "p") return pinyinHTML(w.p);
    return esc(w[q.field]);
  }

  function renderSession() {
    var el = $("#session");
    if (!ses) return;

    if (ses.i >= ses.total) return renderSummary();

    var item = ses.queue[ses.i];
    var w = item.word;
    var bar = (ses.i / ses.total) * 100;
    var head =
      '<div class="session-top">' +
        '<button class="icon-btn" data-act="quit" aria-label="Thoát">✕</button>' +
        '<div class="bar slim"><i style="width:' + bar + '%"></i></div>' +
        "<span>" + (ses.i + 1) + "/" + ses.total + "</span>" +
      "</div>";

    if (ses.mode === "learn" && ses.step === "intro" && !ses.answered) {
      var chars = Array.from(w.h);
      var syls = Core.syllables(w.p);
      var charBreakdownHtml = "";
      if (chars.length > 0) {
        charBreakdownHtml =
          '<div class="card-breakdown-box">' +
            '<div class="row-between" style="margin-bottom:6px">' +
              '<b class="small" style="color:var(--ink)">Đi nét &amp; Âm tiết từng chữ:</b>' +
              '<span class="muted small">' + chars.length + ' chữ Hán</span>' +
            '</div>' +
            '<div class="char-breakdown-grid">' +
              chars.map(function (ch, cIdx) {
                var s = syls[cIdx] || "";
                var t = s ? Core.toneOf(s) : 0;
                var tName = t === 0 ? "Thanh nhẹ" : "Thanh " + t;
                return '<div class="char-breakdown-item">' +
                  '<div class="cbi-top">' +
                    '<span class="cbi-char">' + esc(ch) + '</span>' +
                    '<div class="cbi-meta">' +
                      (s ? '<span class="cbi-py t' + t + '">' + esc(s) + '</span>' : '') +
                      '<span class="cbi-tone-badge">' + tName + '</span>' +
                    '</div>' +
                  '</div>' +
                  '<div class="cbi-actions">' +
                    '<button class="btn ghost small cbi-stroke-btn" data-act="char-stroke" data-char="' + esc(ch) + '">' +
                      '✍️ Đi nét' +
                    '</button>' +
                    '<button class="icon-btn small" data-act="say-sfx" data-text="' + esc(ch) + '" title="Nghe âm chữ ' + esc(ch) + '">🔊</button>' +
                  '</div>' +
                '</div>';
              }).join("") +
            '</div>' +
          '</div>';
      }

      el.innerHTML = head +
        '<div class="card study">' +
          '<p class="eyebrow">Bài ' + w.lesson + " · từ mới</p>" +
          '<div class="hanzi">' + esc(w.h) + "</div>" +
          (S.settings.pinyin ? '<div class="pinyin-line">' + pinyinHTML(w.p) + "</div>" : "") +
          '<p class="hv-line">Hán–Việt: <b>' + esc(w.hv) + "</b></p>" +
          '<p class="meaning">' + esc(w.vi) + "</p>" +
          charBreakdownHtml +
          '<div style="display:flex;gap:8px;margin-top:10px">' +
            '<button class="btn ghost say-btn" data-act="say" data-text="' + esc(w.h) + '" style="flex:1">' +
              '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9v6h4l5 4V5L8 9z"/><path d="M17 8a5 5 0 0 1 0 8"/></svg> Nghe phát âm' +
            '</button>' +
            '<button class="btn ghost say-btn" data-act="card-mic" data-word="' + esc(w.h) + '" style="flex:1">' +
              '🎙️ Luyện nói AI' +
            '</button>' +
          '</div>' +
          '<div id="card-mic-status" class="small center muted" style="margin-top:6px"></div>' +
          '<button class="btn primary wide" data-act="continue" style="margin-top:12px">Đã hiểu → Kiểm tra</button>' +
        "</div>";
      if (!ses.autoPlayed) {
        ses.autoPlayed = true;
        setTimeout(function () { speak(w.h); }, 200);
      }
      return;
    }

    var q = ses.quiz || (ses.quiz = makeQuiz(w));
    var promptHTML;
    if (q.type === "vi") {
      promptHTML = '<div class="hanzi">' + esc(w.h) + "</div>";
    } else if (q.type === "py") {
      promptHTML = '<div class="hanzi">' + esc(w.h) + "</div><p class=\"muted small center\">Chọn pinyin đúng</p>";
    } else if (q.type === "hz") {
      promptHTML = '<p class="eyebrow">Nghĩa</p><div class="meaning big">' + esc(w.vi) + "</div>";
    } else {
      promptHTML = '<p class="eyebrow">Nghe và chọn chữ Hán</p>' +
        '<button class="audio-big" data-act="say" data-text="' + esc(w.h) + '" aria-label="Nghe lại">' +
          '<svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9v6h4l5 4V5L8 9z"/><path d="M17 8a5 5 0 0 1 0 8"/><path d="M20 5a9 9 0 0 1 0 14"/></svg>' +
        "</button>";
      if (!ses.autoPlayed) {
        ses.autoPlayed = true;
        setTimeout(function () { speak(w.h); }, 250);
      }
    }

    var opts = q.options.map(function (o, i) {
      var cls = "option";
      if (ses.answered) {
        if (i === q.answer) cls += " correct";
        else if (i === ses.picked) cls += " wrong";
      }
      return '<button class="' + cls + '" data-act="answer" data-i="' + i + '"' + (ses.answered ? " disabled" : "") + ">" +
        (q.field === "h" ? '<span class="opt-hz">' + optionLabel(q, o) + "</span>" : optionLabel(q, o)) +
        "</button>";
    }).join("");

    var feedback = "";
    if (ses.answered) {
      var ok = ses.picked === q.answer;
      feedback =
        '<div class="feedback ' + (ok ? "ok" : "bad") + '">' +
          '<p class="fb-title">' + (ok ? "Chính xác" : "Chưa đúng") + "</p>" +
          '<div class="fb-word">' +
            '<span class="hanzi-sm">' + esc(w.h) + "</span>" +
            '<span class="fb-py">' + pinyinHTML(w.p) + "</span>" +
          "</div>" +
          '<p class="fb-vi"><b>' + esc(w.hv) + "</b> · " + esc(w.vi) + "</p>" +
          '<button class="btn primary wide" data-act="next">Tiếp tục</button>' +
        "</div>";
    }

    el.innerHTML = head +
      '<div class="card quiz-card">' +
        '<p class="eyebrow">' + (ses.mode === "learn" ? "Kiểm tra nhanh" : "Ôn tập") + "</p>" +
        promptHTML +
        '<div class="options">' + opts + "</div>" +
      "</div>" + feedback;
  }

  function answer(i) {
    if (!ses || ses.answered) return;
    var w = ses.queue[ses.i].word;
    var q = ses.quiz;
    var correct = i === q.answer;
    var card = S.cards[w.id] ? Object.assign({}, S.cards[w.id]) : Core.newCard();
    var gradeQ = ses.mode === "learn" ? (correct ? 4 : 2) : (correct ? 5 : 2);
    S.cards[w.id] = Core.grade(card, gradeQ, Date.now());
    recordAnswer(correct);
    if (correct) {
      ses.correct++;
      if (window.SoundFX) SoundFX.correct();
    } else {
      if (window.SoundFX) SoundFX.wrong();
    }
    ses.answered = true;
    ses.picked = i;
    save();
    speak(w.h);
    renderSession();
  }

  function nextStep() {
    if (!ses) return;
    var item = ses.queue[ses.i];
    if (ses.mode === "learn" && ses.step === "intro") {
      ses.step = "quiz";
      ses.quiz = makeQuiz(item.word, Math.random() < 0.5 ? "vi" : "hz");
    } else {
      if (ses.mode === "learn") S.daily["new"] += 1;
      ses.i += 1;
      ses.step = "intro";
      ses.quiz = null;
      ses.answered = false;
      ses.picked = -1;
      ses.autoPlayed = false;
    }
    save();
    renderSession();
  }

  function renderSummary() {
    if (window.SoundFX) SoundFX.zenBell();
    var acc = Math.round((ses.correct / ses.total) * 100);
    var due = dueWords().length;
    var isLearn = ses.mode === "learn";
    $("#session").innerHTML =
      '<div class="summary">' +
        '<div class="summary-badge">' + (acc >= 80 ? "🎉" : "💪") + "</div>" +
        "<h2>" + (isLearn ? "Học xong " + ses.total + " từ" : "Ôn xong " + ses.total + " từ") + "</h2>" +
        '<p class="muted">' + (acc >= 80 ? "Rất tốt, giữ nhịp này nhé." : "Không sao, từ khó sẽ quay lại sớm.") + "</p>" +
        '<div class="summary-stats">' +
          '<div><b>' + ses.correct + "/" + ses.total + "</b><span>đúng</span></div>" +
          '<div><b>' + acc + "%</b><span>chính xác</span></div>" +
          "<div><b>" + S.streak.count + "</b><span>chuỗi ngày</span></div>" +
        "</div>" +
        '<button class="btn primary wide" data-act="home">Về trang chủ</button>' +
        (due && !isLearn ? '<button class="btn ghost wide" data-act="review">Ôn tiếp (' + due + ")</button>" : "") +
      "</div>";
  }

  /* ================= tập viết ================= */
  var writeFilter = "learned";
  var writeChar = null;
  var writer = null;
  var hwState = "idle"; // idle | loading | ready | failed

  function loadHanziWriter() {
    if (hwState === "loading" || hwState === "ready") return;
    hwState = "loading";
    var s = document.createElement("script");
    s.src = "https://cdn.jsdelivr.net/npm/hanzi-writer@3/dist/hanzi-writer.min.js";
    s.onload = function () {
      hwState = "ready";
      if (!$("#writeSheet").classList.contains("hidden") && writeChar) drawWriter();
    };
    s.onerror = function () { hwState = "failed"; };
    document.head.appendChild(s);
  }
  function charKnown(ch) {
    return WORDS.some(function (w) { return w.h.indexOf(ch) > -1 && S.cards[w.id]; });
  }
  function renderWrite() {
    loadHanziWriter();
    var list = writeFilter === "all" ? CHARS : CHARS.filter(charKnown);
    if (!list.length) {
      $("#char-grid").innerHTML = '<p class="muted empty">Chưa có chữ nào. Học vài từ trước nhé.</p>';
    } else {
      $("#char-grid").innerHTML = list.map(function (ch) {
        return '<button class="char-btn' + (charKnown(ch) ? " learned" : "") + '" data-wchar="' + ch + '" aria-label="Tập viết ' + ch + '">' + ch + "</button>";
      }).join("");
    }

    var canvasSection = $("#virtual-canvas-section");
    if (canvasSection) {
      var rulesHtml = (window.STROKE_RULES || []).map(function (r, idx) {
        return '<div class="rule-item">' +
          '<span class="rule-num">' + (idx + 1) + '</span>' +
          '<div style="flex:1">' +
            '<div><b>' + esc(r.title) + '</b> <span class="muted">(' + esc(r.zh) + ')</span></div>' +
            '<div class="small muted">' + esc(r.desc) + ' · Ví dụ: <b style="color:var(--jade)">' + esc(r.example) + '</b></div>' +
          '</div>' +
        '</div>';
      }).join("");

      canvasSection.innerHTML =
        '<section class="card">' +
          '<div class="row-between">' +
            '<div>' +
              '<p class="eyebrow">Offline-First · HTML5 Canvas</p>' +
              '<h3 style="margin:2px 0">Bảng Viết Thư Pháp Tự Do</h3>' +
            '</div>' +
            '<span class="badge s-mastered">Lưới Mễ (米)</span>' +
          '</div>' +
          '<p class="muted small">Luyện viết tự do với mực thư pháp biến thiên nét thanh nét đậm, không cần kết nối mạng.</p>' +
          '<div class="canvas-wrap">' +
            '<div id="stroke-canvas-container"></div>' +
            '<div class="canvas-tools-row">' +
              '<button class="color-dot active" data-act="canvas-color" data-color="#1c1917" style="background:#1c1917" title="Mực tàu đen"></button>' +
              '<button class="color-dot" data-act="canvas-color" data-color="#b91c1c" style="background:#b91c1c" title="Son đỏ hoàng triều"></button>' +
              '<button class="color-dot" data-act="canvas-color" data-color="#0f766e" style="background:#0f766e" title="Ngọc bích"></button>' +
              '<button class="btn ghost small" data-act="canvas-undo">↩ Hoàn tác</button>' +
              '<button class="btn ghost small" data-act="canvas-clear">🗑️ Xóa hết</button>' +
            '</div>' +
          '</div>' +
        '</section>' +

        '<section class="card stroke-rules-card">' +
          '<div class="row-between">' +
            '<h3>8 Quy Tắc Bút Thuận Vàng</h3>' +
            '<span class="muted small">Quy tắc viết chữ Hán</span>' +
          '</div>' +
          '<div style="margin-top:12px">' + rulesHtml + '</div>' +
        '</section>';

      setTimeout(function () {
        initVirtualCanvas("永");
      }, 50);
    }
  }
  function openWriter(ch) {
    writeChar = ch;
    $("#write-title").textContent = ch;
    $("#write-note").textContent = "";
    $("#writeSheet").classList.remove("hidden");
    drawWriter();
  }
  function closeWriter() {
    $("#writeSheet").classList.add("hidden");
    $("#writer").innerHTML = "";
    writer = null;
    writeChar = null;
  }
  function drawWriter() {
    var host = $("#writer");
    host.innerHTML = "";
    writer = null;
    if (typeof HanziWriter === "undefined") {
      loadHanziWriter();
      $("#write-note").textContent = hwState === "failed" ? "Không tải được dữ liệu nét chữ. Cần mạng để dùng phần này." : "Đang tải dữ liệu nét chữ…";
      return;
    }
    var cs = getComputedStyle(document.body);
    var v = function (name, fb) { var x = (cs.getPropertyValue(name) || "").trim(); return x || fb; };
    writer = HanziWriter.create(host, writeChar, {
      width: 252,
      height: 252,
      padding: 6,
      showCharacter: false,
      showOutline: true,
      strokeColor: v("--ink", "#211f1b"),
      outlineColor: v("--line", "#e6ddcd"),
      highlightColor: v("--red", "#b23a2f"),
      strokeAnimationSpeed: 1.1,
      delayBetweenStrokes: 130
    });
    writer.animateCharacter();
  }
  function quizWriter() {
    if (!writer) { toast("Chờ tải dữ liệu nét chữ một chút…"); return; }
    $("#write-note").textContent = "Viết lại theo đúng thứ tự nét.";
    writer.quiz({
      onComplete: function (res) {
        $("#write-note").textContent = res.totalMistakes === 0
          ? "Hoàn hảo, không sai nét nào!"
          : "Xong! Số nét sai: " + res.totalMistakes + ". Thử lại nhé.";
      }
    });
  }

  /* ================= màn hình chào ================= */
  var welcomeType = "thi";
  var welcomeCount = 10;

  function syncWelcome() {
    document.querySelectorAll("#goal-type .choice").forEach(function (b) {
      b.classList.toggle("active", b.dataset.goalType === welcomeType);
    });
    document.querySelectorAll("#goal-count .choice").forEach(function (b) {
      b.classList.toggle("active", Number(b.dataset.goalCount) === welcomeCount);
    });
  }
  function showWelcome() {
    welcomeType = S.settings.goalType || "thi";
    welcomeCount = Number(S.settings.goal) || 10;
    syncWelcome();
    $("#welcome").classList.remove("hidden");
    document.body.classList.add("welcome-open");
  }
  function hideWelcome() {
    $("#welcome").classList.add("hidden");
    document.body.classList.remove("welcome-open");
  }
  function initWelcome() {
    document.querySelectorAll("#goal-type .choice").forEach(function (b) {
      b.addEventListener("click", function () { welcomeType = b.dataset.goalType; syncWelcome(); });
    });
    document.querySelectorAll("#goal-count .choice").forEach(function (b) {
      b.addEventListener("click", function () { welcomeCount = Number(b.dataset.goalCount); syncWelcome(); });
    });
    if (!S.settings.onboarded) showWelcome();
  }

  /* ================= 1. VỞ TẬP VIẾT CHỮ HÁN A4 ================= */
  var wsCurrentWords = [];
  var wsGridType = "mizi";
  var wsFadeMode = "standard";
  var wsColorTheme = "cinnabar";
  var wsSource = "recent";

  function updateWorksheetWords(source) {
    wsSource = source || wsSource;
    if (wsSource === "recent") {
      var learned = WORDS.filter(function (w) { return !!S.cards[w.id]; });
      wsCurrentWords = learned.length >= 5 ? learned.slice(-10) : WORDS.slice(0, 10);
    } else if (wsSource === "hsk1_b1") {
      wsCurrentWords = ALL_WORDS.filter(function (w) { return w.level === 1; }).slice(0, 10);
    } else if (wsSource === "hsk1_all") {
      wsCurrentWords = ALL_WORDS.filter(function (w) { return w.level === 1; });
    } else if (wsSource === "hsk2_all") {
      wsCurrentWords = ALL_WORDS.filter(function (w) { return w.level === 2; });
    } else if (wsSource === "hsk3_all") {
      wsCurrentWords = ALL_WORDS.filter(function (w) { return w.level === 3; });
    } else if (wsSource === "custom") {
      var customInput = $("#ws-custom-input");
      var text = customInput ? customInput.value.trim() : "你好世界 学汉语";
      var chars = Array.from(text).filter(function (ch) { return /[\u4e00-\u9fa5]/.test(ch); });
      var map = {};
      ALL_WORDS.forEach(function (w) { map[w.h] = w; });
      wsCurrentWords = chars.map(function (ch) {
        return map[ch] || { h: ch, p: "", hv: "", vi: "Luyện viết chữ " + ch };
      });
    }
  }

  function renderWorksheet() {
    var el = $("#view-worksheet");
    if (!el) return;
    if (!wsCurrentWords.length) updateWorksheetWords("recent");

    var previewRows = wsCurrentWords.slice(0, 4).map(function (w) {
      var cells = [];
      for (var i = 0; i < 8; i++) {
        var op = WorksheetGenerator.getCellOpacity(i, wsFadeMode);
        cells.push('<div style="width:38px;height:38px">' + WorksheetGenerator.generateCellSvg(w.h ? w.h[0] : "", op, wsGridType, wsColorTheme, 38) + '</div>');
      }
      return '<div class="ws-live-row">' +
        '<div class="ws-live-meta">' +
          '<div style="font-weight:700;color:var(--jade)">' + esc(w.p || '') + '</div>' +
          '<div style="font-weight:600;font-size:10px">' + esc(w.hv || '') + '</div>' +
        '</div>' +
        '<div class="ws-live-cells">' + cells.join("") + '</div>' +
      '</div>';
    }).join("");

    el.innerHTML =
      '<div class="row-between" style="margin-bottom:14px">' +
        '<div>' +
          '<p class="eyebrow">Offline-First · Xuất In &amp; PDF</p>' +
          '<h2 style="margin:2px 0">Trình Tạo Vở Tập Viết A4</h2>' +
        '</div>' +
        '<button class="btn ghost small" data-nav="home">← Trang chủ</button>' +
      '</div>' +

      '<section class="card">' +
        '<p class="muted small">Tùy biến ô Mễ, ô Điền, ô Hồi Cung kèm nét mờ tập tô. In trực tiếp ra giấy hoặc xuất file PDF khổ A4.</p>' +
        '<div class="ws-controls">' +
          '<div class="ws-control-grid">' +
            '<div class="ws-control-item">' +
              '<label>Nguồn từ vựng:</label>' +
              '<select id="ws-source-select">' +
                '<option value="recent"' + (wsSource === "recent" ? ' selected' : '') + '>10 từ vừa học</option>' +
                '<option value="hsk1_b1"' + (wsSource === "hsk1_b1" ? ' selected' : '') + '>HSK 1 · Bài 1 (10 từ)</option>' +
                '<option value="hsk1_all"' + (wsSource === "hsk1_all" ? ' selected' : '') + '>HSK 1 · Toàn bộ (300 từ)</option>' +
                '<option value="hsk2_all"' + (wsSource === "hsk2_all" ? ' selected' : '') + '>HSK 2 · Toàn bộ (200 từ)</option>' +
                '<option value="hsk3_all"' + (wsSource === "hsk3_all" ? ' selected' : '') + '>HSK 3 · Toàn bộ (300 từ)</option>' +
                '<option value="custom"' + (wsSource === "custom" ? ' selected' : '') + '>Tự nhập chữ Hán tùy ý...</option>' +
              '</select>' +
            '</div>' +
            '<div class="ws-control-item">' +
              '<label>Kiểu ô lưới:</label>' +
              '<select id="ws-grid-select">' +
                '<option value="mizi"' + (wsGridType === "mizi" ? ' selected' : '') + '>Ô Mễ (米字格) - Có đường chéo</option>' +
                '<option value="tianzi"' + (wsGridType === "tianzi" ? ' selected' : '') + '>Ô Điền (田字格) - Chữ thập</option>' +
                '<option value="huigong"' + (wsGridType === "huigong" ? ' selected' : '') + '>Ô Hồi Cung (回宫格) - Khung trung tâm</option>' +
              '</select>' +
            '</div>' +
            '<div class="ws-control-item">' +
              '<label>Chế độ nét mờ:</label>' +
              '<select id="ws-fade-select">' +
                '<option value="standard"' + (wsFadeMode === "standard" ? ' selected' : '') + '>Chuẩn (Đậm → Mờ dần → Trống)</option>' +
                '<option value="trace_all"' + (wsFadeMode === "trace_all" ? ' selected' : '') + '>Tô toàn bộ (Nét mờ 100%)</option>' +
                '<option value="blank"' + (wsFadeMode === "blank" ? ' selected' : '') + '>Thử thách (Chỉ mẫu ô đầu)</option>' +
              '</select>' +
            '</div>' +
            '<div class="ws-control-item">' +
              '<label>Màu sắc lưới:</label>' +
              '<select id="ws-color-select">' +
                '<option value="cinnabar"' + (wsColorTheme === "cinnabar" ? ' selected' : '') + '>Đỏ Chu Sa (朱砂)</option>' +
                '<option value="jade"' + (wsColorTheme === "jade" ? ' selected' : '') + '>Xanh Ngọc Hán Lộ</option>' +
                '<option value="charcoal"' + (wsColorTheme === "charcoal" ? ' selected' : '') + '>Mực Tàu Đen Xám</option>' +
              '</select>' +
            '</div>' +
          '</div>' +
          '<div id="ws-custom-wrap" class="' + (wsSource === "custom" ? '' : 'hidden') + '" style="margin-top:12px">' +
            '<label class="muted small" style="display:block;margin-bottom:4px">Nhập danh sách chữ Hán cần luyện viết:</label>' +
            '<input type="text" id="ws-custom-input" placeholder="Ví dụ: 你好世界 学中文 天天向上" value="你好世界 学汉语" style="width:100%;padding:8px 12px;border-radius:8px;border:1px solid var(--line);background:var(--card);color:var(--ink)">' +
          '</div>' +
          '<div style="margin-top:16px;display:flex;gap:10px;flex-wrap:wrap">' +
            '<button class="btn primary" id="btn-ws-print">🖨️ In Vở Ngay / Xuất PDF A4 (' + wsCurrentWords.length + ' từ)</button>' +
            '<button class="btn ghost" id="btn-ws-refresh">🔄 Cập nhật xem trước</button>' +
          '</div>' +
        '</div>' +
      '</section>' +

      '<section class="card">' +
        '<div class="row-between">' +
          '<h3>Xem Trước Bản In (Khổ A4)</h3>' +
          '<span class="muted small">Hiển thị mẫu 4 hàng</span>' +
        '</div>' +
        '<div class="ws-preview-box" id="ws-preview-box" style="margin-top:12px">' +
          previewRows +
        '</div>' +
      '</section>';

    bindWorksheetEvents();
  }

  function bindWorksheetEvents() {
    var srcSel = $("#ws-source-select");
    var gridSel = $("#ws-grid-select");
    var fadeSel = $("#ws-fade-select");
    var colorSel = $("#ws-color-select");
    var customWrap = $("#ws-custom-wrap");
    var printBtn = $("#btn-ws-print");
    var refreshBtn = $("#btn-ws-refresh");

    if (srcSel) {
      srcSel.addEventListener("change", function () {
        wsSource = srcSel.value;
        if (customWrap) customWrap.classList.toggle("hidden", wsSource !== "custom");
        updateWorksheetWords(wsSource);
        renderWorksheet();
      });
    }
    if (gridSel) {
      gridSel.addEventListener("change", function () {
        wsGridType = gridSel.value;
        renderWorksheet();
      });
    }
    if (fadeSel) {
      fadeSel.addEventListener("change", function () {
        wsFadeMode = fadeSel.value;
        renderWorksheet();
      });
    }
    if (colorSel) {
      colorSel.addEventListener("change", function () {
        wsColorTheme = colorSel.value;
        renderWorksheet();
      });
    }
    if (refreshBtn) {
      refreshBtn.addEventListener("click", function () {
        updateWorksheetWords(wsSource);
        renderWorksheet();
      });
    }
    if (printBtn) {
      printBtn.addEventListener("click", function () {
        updateWorksheetWords(wsSource);
        WorksheetGenerator.printWorksheet({
          title: "HÁN LỘ · VỞ TẬP VIẾT CHỮ HÁN",
          subtitle: "Chuẩn đề cương HSK 3.0 · " + (wsCurrentWords.length) + " mục từ",
          words: wsCurrentWords,
          gridType: wsGridType,
          fadeMode: wsFadeMode,
          colorTheme: wsColorTheme,
          cellsPerRow: 10
        });
      });
    }
  }

  /* ================= 2. LUYỆN GÕ PINYIN (CPM MASTER) ================= */
  var typingSession = null;
  var typingTimerInterval = null;
  var typingLevel = "1";
  var typingMode = "timed_60s";

  function startTypingSession() {
    if (typingTimerInterval) clearInterval(typingTimerInterval);
    var pool = WORDS.slice();
    if (typingLevel === "1") pool = ALL_WORDS.filter(function (w) { return w.level === 1; });
    else if (typingLevel === "2") pool = ALL_WORDS.filter(function (w) { return w.level === 2; });
    else if (typingLevel === "3") pool = ALL_WORDS.filter(function (w) { return w.level === 3; });
    else pool = ALL_WORDS.slice();

    typingSession = PinyinTyping.createSession(pool, {
      mode: typingMode,
      timeLimit: 60,
      wordLimit: 20
    });

    if (typingMode === "timed_60s") {
      var timeLeft = 60;
      typingTimerInterval = setInterval(function () {
        if (!typingSession || typingSession.isFinished) {
          clearInterval(typingTimerInterval);
          return;
        }
        if (typingSession.startTime) {
          timeLeft--;
          var timerEl = $("#typing-timer-val");
          if (timerEl) timerEl.textContent = timeLeft + "s";
          if (timeLeft <= 0) {
            clearInterval(typingTimerInterval);
            typingSession.isFinished = true;
            typingSession.endTime = Date.now();
            if (window.SoundFX) SoundFX.playLevelUp();
            renderTyping();
          }
        }
      }, 1000);
    }
  }

  function renderTyping() {
    var el = $("#view-typing");
    if (!el) return;
    if (!typingSession) startTypingSession();

    var currentWord = typingSession.words[typingSession.currentIndex] || { h: "好", p: "hǎo", hv: "HẢO", vi: "Tốt" };
    var stats = PinyinTyping.getStats(typingSession);

    if (typingSession.isFinished) {
      el.innerHTML =
        '<div class="row-between" style="margin-bottom:14px">' +
          '<div>' +
            '<p class="eyebrow">Thống Kê Tốc Độ Gõ</p>' +
            '<h2 style="margin:2px 0">Kết Quả Luyện Gõ Pinyin</h2>' +
          '</div>' +
          '<button class="btn ghost small" data-nav="home">← Trang chủ</button>' +
        '</div>' +

        '<section class="card typing-hero">' +
          '<div style="font-size:48px;margin-bottom:6px">🏆</div>' +
          '<h3>' + (stats.cpm >= 120 ? 'Bậc Thầy Gõ Phím Thần Tốc! ⚡' : (stats.cpm >= 60 ? 'Tốc Độ Rất Tốt! 🎯' : 'Khởi Đầu Vững Chắc! 🌿')) + '</h3>' +
          '<p class="muted small">Bạn đã hoàn thành phiên luyện gõ tiếng Trung chuẩn xác.</p>' +
          '<div class="typing-stats-row">' +
            '<div class="stat-pill"><div class="stat-pill-val">' + stats.cpm + '</div><div class="stat-pill-lbl">CPM (Ký tự/phút)</div></div>' +
            '<div class="stat-pill"><div class="stat-pill-val">' + stats.wpm + '</div><div class="stat-pill-lbl">WPM (Từ/phút)</div></div>' +
            '<div class="stat-pill"><div class="stat-pill-val">' + stats.accuracy + '%</div><div class="stat-pill-lbl">Độ chính xác</div></div>' +
            '<div class="stat-pill"><div class="stat-pill-val">' + stats.maxStreak + '</div><div class="stat-pill-lbl">Chuỗi cao nhất</div></div>' +
          '</div>' +
          '<div style="margin-top:20px;display:flex;gap:10px">' +
            '<button class="btn primary" id="btn-typing-restart">🔄 Thử lại vòng mới</button>' +
            '<button class="btn ghost" data-nav="home">Về trang chủ</button>' +
          '</div>' +
        '</section>';

      var restartBtn = $("#btn-typing-restart");
      if (restartBtn) restartBtn.addEventListener("click", function () {
        startTypingSession();
        renderTyping();
      });
      return;
    }

    el.innerHTML =
      '<div class="row-between" style="margin-bottom:14px">' +
        '<div>' +
          '<p class="eyebrow">IME Speed Trainer · Gõ Phím Phản Xạ</p>' +
          '<h2 style="margin:2px 0">Luyện Gõ Pinyin Thần Tốc</h2>' +
        '</div>' +
        '<button class="btn ghost small" data-nav="home">← Trang chủ</button>' +
      '</div>' +

      '<section class="card typing-hero">' +
        '<div class="typing-streak-badge">🔥 Streak: ' + stats.streak + '</div>' +
        '<div class="typing-target-char">' + esc(currentWord.h) + '</div>' +
        '<div class="typing-target-hint">Hán–Việt: <b>' + esc(currentWord.hv) + '</b> · Nghĩa: <b>' + esc(currentWord.vi) + '</b></div>' +

        '<div class="typing-input-wrap">' +
          '<input type="text" id="typing-input" class="typing-input" placeholder="Gõ pinyin (VD: ' + PinyinTyping.normalizePinyin(currentWord.p) + ') rồi Enter..." autofocus autocomplete="off" autocapitalize="off" spellcheck="false">' +
        '</div>' +

        '<div class="typing-stats-row">' +
          '<div class="stat-pill"><div class="stat-pill-val" id="typing-cpm-val">' + stats.cpm + '</div><div class="stat-pill-lbl">CPM</div></div>' +
          '<div class="stat-pill"><div class="stat-pill-val" id="typing-acc-val">' + stats.accuracy + '%</div><div class="stat-pill-lbl">Chính xác</div></div>' +
          '<div class="stat-pill"><div class="stat-pill-val" id="typing-correct-val">' + stats.correctWords + '</div><div class="stat-pill-lbl">Đúng</div></div>' +
          '<div class="stat-pill"><div class="stat-pill-val" id="typing-timer-val">' + (typingMode === "timed_60s" ? '60s' : stats.elapsedSeconds + 's') + '</div><div class="stat-pill-lbl">Thời gian</div></div>' +
        '</div>' +
      '</section>' +

      '<section class="card">' +
        '<div class="row-between">' +
          '<h3>Tùy Chọn Chế Độ</h3>' +
          '<button class="btn ghost small" id="btn-typing-reset">Làm mới</button>' +
        '</div>' +
        '<div style="display:flex;gap:8px;margin-top:10px;flex-wrap:wrap">' +
          '<button class="chip' + (typingLevel === "1" ? ' active' : '') + '" data-typing-lvl="1">HSK 1 (300 từ)</button>' +
          '<button class="chip' + (typingLevel === "2" ? ' active' : '') + '" data-typing-lvl="2">HSK 2 (200 từ)</button>' +
          '<button class="chip' + (typingLevel === "3" ? ' active' : '') + '" data-typing-lvl="3">HSK 3 (300 từ)</button>' +
          '<button class="chip' + (typingLevel === "all" ? ' active' : '') + '" data-typing-lvl="all">Tất cả (800 từ)</button>' +
        '</div>' +
      '</section>';

    bindTypingEvents();
  }

  function bindTypingEvents() {
    var inp = $("#typing-input");
    if (inp) {
      inp.focus();
      inp.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          var val = inp.value.trim();
          if (!val) return;
          var res = PinyinTyping.checkInput(typingSession, val);
          if (res.isCorrect) {
            if (window.SoundFX) SoundFX.playCorrect();
          } else {
            if (window.SoundFX) SoundFX.playWrong();
          }
          renderTyping();
        }
      });
    }

    document.querySelectorAll("[data-typing-lvl]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        typingLevel = btn.dataset.typingLvl;
        startTypingSession();
        renderTyping();
      });
    });

    var resetBtn = $("#btn-typing-reset");
    if (resetBtn) {
      resetBtn.addEventListener("click", function () {
        startTypingSession();
        renderTyping();
      });
    }
  }

  /* ================= 3. THÊM PINYIN CHO ĐOẠN VĂN (RUBY ANNOTATOR) ================= */
  var annotatorText = "大家好！我叫小龙，我是越南人。我现在在学习汉语，汉语很有意思，汉字也很漂亮。";
  var annotatorDisplayMode = "pinyin";

  function renderAnnotator() {
    var el = $("#view-annotator");
    if (!el) return;

    if (typeof PinyinAnnotator !== "undefined") {
      PinyinAnnotator.initDict(ALL_WORDS);
    }

    var tokens = PinyinAnnotator.tokenize(annotatorText);
    var rubyHtml = PinyinAnnotator.toRubyHtml(tokens, annotatorDisplayMode);

    el.innerHTML =
      '<div class="row-between" style="margin-bottom:14px">' +
        '<div>' +
          '<p class="eyebrow">Ruby Text Annotator · Phân Tích Văn Bản</p>' +
          '<h2 style="margin:2px 0">Thêm Pinyin Cho Đoạn Văn</h2>' +
        '</div>' +
        '<button class="btn ghost small" data-nav="home">← Trang chủ</button>' +
      '</div>' +

      '<section class="card">' +
        '<p class="muted small">Dán bất kỳ đoạn văn, tin tức hay bài báo chữ Hán vào đây để tự động thêm Pinyin và âm Hán-Việt trên đầu từng chữ.</p>' +
        '<div class="annotator-box">' +
          '<textarea id="annotator-textarea" class="annotator-textarea" placeholder="Dán văn bản tiếng Trung vào đây...">' + esc(annotatorText) + '</textarea>' +
          '<div style="display:flex;gap:8px;margin-top:10px;flex-wrap:wrap;align-items:center">' +
            '<span class="muted small" style="font-weight:600">Đoạn văn mẫu:</span>' +
            '<button class="chip" data-sample="1">Giới thiệu bản thân</button>' +
            '<button class="chip" data-sample="2">Thơ Tĩnh Dạ Tứ</button>' +
            '<button class="chip" data-sample="3">Đi mua sắm HSK</button>' +
          '</div>' +
          '<div style="display:flex;gap:10px;margin-top:14px;flex-wrap:wrap;align-items:center">' +
            '<button class="btn primary" id="btn-annotator-run">🔤 Thêm Pinyin &amp; Phân Tích</button>' +
            '<div class="chips" id="annotator-mode-chips">' +
              '<button class="chip' + (annotatorDisplayMode === "pinyin" ? ' active' : '') + '" data-mode="pinyin">Pinyin trên đầu</button>' +
              '<button class="chip' + (annotatorDisplayMode === "hv" ? ' active' : '') + '" data-mode="hv">Âm Hán–Việt</button>' +
              '<button class="chip' + (annotatorDisplayMode === "both" ? ' active' : '') + '" data-mode="both">Pinyin + Hán-Việt</button>' +
              '<button class="chip' + (annotatorDisplayMode === "hanzi" ? ' active' : '') + '" data-mode="hanzi">Chỉ chữ Hán</button>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</section>' +

      '<section class="card">' +
        '<div class="row-between">' +
          '<h3>Kết Quả Văn Bản Kèm Pinyin</h3>' +
          '<div style="display:flex;gap:6px">' +
            '<button class="btn ghost small" id="btn-copy-annotated">📋 Sao chép</button>' +
          '</div>' +
        '</div>' +
        '<p class="muted small">Nhấp vào bất kỳ từ nào để tra nghĩa, âm Hán-Việt và thứ tự nét tức thì.</p>' +
        '<div class="annotator-result" id="annotator-result">' +
          rubyHtml +
        '</div>' +
      '</section>';

    bindAnnotatorEvents();
  }

  function bindAnnotatorEvents() {
    var ta = $("#annotator-textarea");
    var runBtn = $("#btn-annotator-run");
    var copyBtn = $("#btn-copy-annotated");

    if (runBtn) {
      runBtn.addEventListener("click", function () {
        if (ta) annotatorText = ta.value;
        renderAnnotator();
      });
    }

    document.querySelectorAll("[data-sample]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var s = btn.dataset.sample;
        if (s === "1") annotatorText = "大家好！我叫小龙，我是越南人。我现在在学习汉语，汉语很有意思，汉字也很漂亮。";
        else if (s === "2") annotatorText = "床前明月光，疑是地上霜。举头望明月，低头思故乡。";
        else if (s === "3") annotatorText = "今天天气很好，我和朋友一起去商店买东西。我们吃了中国菜，喝了中国茶。";
        if (ta) ta.value = annotatorText;
        renderAnnotator();
      });
    });

    document.querySelectorAll("#annotator-mode-chips .chip").forEach(function (btn) {
      btn.addEventListener("click", function () {
        annotatorDisplayMode = btn.dataset.mode;
        renderAnnotator();
      });
    });

    if (copyBtn) {
      copyBtn.addEventListener("click", function () {
        var tokens = PinyinAnnotator.tokenize(annotatorText);
        var txt = PinyinAnnotator.toPlainText(tokens);
        if (navigator.clipboard) {
          navigator.clipboard.writeText(txt).then(function () {
            toast("Đã sao chép văn bản kèm Pinyin vào bộ nhớ tạm!");
          });
        } else {
          toast("Văn bản đã tạo xong.");
        }
      });
    }

    // Tra từ khi click vào chữ Hán
    var resultBox = $("#annotator-result");
    if (resultBox) {
      resultBox.addEventListener("click", function (e) {
        var tok = e.target.closest(".lookup-trigger");
        if (tok && tok.dataset.h) {
          openLookup(tok.dataset.h, tok.dataset.p, tok.dataset.hv, tok.dataset.vi);
        }
      });
    }
  }

  /* ================= 4. TRÒ CHƠI CHỮ HÁN & THÀNH NGỮ ================= */
  var gameTab = "idiom";
  var currentIdiomQ = null;
  var currentRadicalQ = null;
  var gameScore = 0;
  var gameStreak = 0;
  var gameAnswered = false;

  function renderGame() {
    var el = $("#view-game");
    if (!el) return;

    if (gameTab === "idiom" && !currentIdiomQ) {
      currentIdiomQ = HanziGames.createIdiomQuestion();
      gameAnswered = false;
    } else if (gameTab === "radical" && !currentRadicalQ) {
      currentRadicalQ = HanziGames.createRadicalQuestion();
      gameAnswered = false;
    }

    var contentHtml = "";

    if (gameTab === "idiom") {
      var q = currentIdiomQ;
      var slotsHtml = q.displayChars.map(function (ch, idx) {
        if (ch === null) {
          return '<div class="idiom-slot blank" id="idiom-blank-slot">?</div>';
        }
        return '<div class="idiom-slot">' + esc(ch) + '</div>';
      }).join("");

      var choicesHtml = q.choices.map(function (ch) {
        return '<button class="game-choice-btn" data-choice="' + esc(ch) + '">' + esc(ch) + '</button>';
      }).join("");

      var infoCardHtml = gameAnswered ?
        '<div class="idiom-info-card">' +
          '<div style="font-size:16px;font-weight:700;color:var(--jade)">' + esc(q.idiom.c) + ' · ' + esc(q.idiom.p) + '</div>' +
          '<div style="font-weight:600;margin:2px 0">' + esc(q.idiom.hv) + '</div>' +
          '<div style="color:var(--ink)"><b>Ý nghĩa:</b> ' + esc(q.idiom.m) + '</div>' +
          '<div class="muted small" style="margin-top:4px"><b>Điển tích:</b> ' + esc(q.idiom.s) + '</div>' +
          '<div style="margin-top:12px"><button class="btn primary small" id="btn-next-idiom">Thành ngữ tiếp theo →</button></div>' +
        '</div>' : '';

      contentHtml =
        '<div class="game-arena">' +
          '<div class="typing-streak-badge">⭐ Điểm: ' + gameScore + ' · 🔥 Streak: ' + gameStreak + '</div>' +
          '<p class="eyebrow" style="margin-top:4px">Chọn chữ Hán còn thiếu để hoàn thành thành ngữ 4 chữ:</p>' +
          '<div class="idiom-slots">' + slotsHtml + '</div>' +
          '<div class="game-options-grid" id="idiom-choices">' + choicesHtml + '</div>' +
          infoCardHtml +
        '</div>';
    } else {
      var rq = currentRadicalQ;
      var partsDisplay = rq.parts.join("  +  ");
      var rChoicesHtml = rq.choices.map(function (ch) {
        return '<button class="game-choice-btn" data-rchoice="' + esc(ch) + '">' + esc(ch) + '</button>';
      }).join("");

      var rInfoCardHtml = gameAnswered ?
        '<div class="idiom-info-card">' +
          '<div style="font-size:16px;font-weight:700;color:var(--jade)">' + esc(rq.item.result) + ' (' + esc(rq.item.p) + ') · ' + esc(rq.item.hv) + '</div>' +
          '<div style="color:var(--ink)"><b>Nghĩa:</b> ' + esc(rq.item.vi) + '</div>' +
          '<div style="margin-top:12px"><button class="btn primary small" id="btn-next-radical">Câu tiếp theo →</button></div>' +
        '</div>' : '';

      contentHtml =
        '<div class="game-arena">' +
          '<div class="typing-streak-badge">⭐ Điểm: ' + gameScore + ' · 🔥 Streak: ' + gameStreak + '</div>' +
          '<p class="eyebrow" style="margin-top:4px">Ghép các bộ thủ sau thành chữ Hán có nghĩa:</p>' +
          '<div style="font-family:var(--serif);font-size:42px;font-weight:700;color:var(--jade);margin:16px 0">' + esc(partsDisplay) + '  =  ?</div>' +
          '<div class="game-options-grid" id="radical-choices">' + rChoicesHtml + '</div>' +
          rInfoCardHtml +
        '</div>';
    }

    el.innerHTML =
      '<div class="row-between" style="margin-bottom:14px">' +
        '<div>' +
          '<p class="eyebrow">Gamification · Học Qua Trò Chơi</p>' +
          '<h2 style="margin:2px 0">Trò Chơi Chữ Hán &amp; Thành Ngữ</h2>' +
        '</div>' +
        '<button class="btn ghost small" data-nav="home">← Trang chủ</button>' +
      '</div>' +

      '<div style="display:flex;gap:8px;margin-bottom:14px">' +
        '<button class="chip' + (gameTab === "idiom" ? ' active' : '') + '" data-gametab="idiom">🏮 Ghép Thành Ngữ 4 Chữ (成语)</button>' +
        '<button class="chip' + (gameTab === "radical" ? ' active' : '') + '" data-gametab="radical">🧩 Ghép Bộ Thủ (Radical Fusion)</button>' +
      '</div>' +
      contentHtml;

    bindGameEvents();
  }

  function bindGameEvents() {
    document.querySelectorAll("[data-gametab]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        gameTab = btn.dataset.gametab;
        gameAnswered = false;
        renderGame();
      });
    });

    if (gameTab === "idiom" && !gameAnswered) {
      var box = $("#idiom-choices");
      if (box) {
        box.addEventListener("click", function (e) {
          var btn = e.target.closest("[data-choice]");
          if (!btn || gameAnswered) return;
          var ch = btn.dataset.choice;
          gameAnswered = true;
          if (ch === currentIdiomQ.correctChar) {
            btn.classList.add("correct");
            var blank = $("#idiom-blank-slot");
            if (blank) {
              blank.textContent = ch;
              blank.classList.remove("blank");
            }
            gameScore += 10;
            gameStreak++;
            if (window.SoundFX) SoundFX.playCorrect();
            renderGame();
          } else {
            btn.classList.add("wrong");
            gameStreak = 0;
            if (window.SoundFX) SoundFX.playWrong();
            renderGame();
          }
        });
      }
    }

    var nextIdiomBtn = $("#btn-next-idiom");
    if (nextIdiomBtn) {
      nextIdiomBtn.addEventListener("click", function () {
        currentIdiomQ = HanziGames.createIdiomQuestion();
        gameAnswered = false;
        renderGame();
      });
    }

    if (gameTab === "radical" && !gameAnswered) {
      var rBox = $("#radical-choices");
      if (rBox) {
        rBox.addEventListener("click", function (e) {
          var btn = e.target.closest("[data-rchoice]");
          if (!btn || gameAnswered) return;
          var ch = btn.dataset.rchoice;
          gameAnswered = true;
          if (ch === currentRadicalQ.correctResult) {
            btn.classList.add("correct");
            gameScore += 10;
            gameStreak++;
            if (window.SoundFX) SoundFX.playCorrect();
            renderGame();
          } else {
            btn.classList.add("wrong");
            gameStreak = 0;
            if (window.SoundFX) SoundFX.playWrong();
            renderGame();
          }
        });
      }
    }

    var nextRadicalBtn = $("#btn-next-radical");
    if (nextRadicalBtn) {
      nextRadicalBtn.addEventListener("click", function () {
        currentRadicalQ = HanziGames.createRadicalQuestion();
        gameAnswered = false;
        renderGame();
      });
    }
  }

  /* ================= sự kiện ================= */
  document.addEventListener("click", function (e) {
    var el = e.target.closest("[data-act],[data-nav],[data-filter],[data-wchar],[data-wfilter]");
    if (!el) return;
    var act = el.dataset.act;

    if (el.dataset.nav) { go(el.dataset.nav); return; }
    if (el.dataset.wfilter) {
      writeFilter = el.dataset.wfilter;
      document.querySelectorAll("#write-filters .chip").forEach(function (c) {
        c.classList.toggle("active", c === el);
      });
      renderWrite();
      return;
    }
    if (el.dataset.wchar) { openWriter(el.dataset.wchar); return; }
    if (el.dataset.filter) {
      dictFilter = el.dataset.filter;
      document.querySelectorAll("#dict-filters .chip").forEach(function (c) {
        c.classList.toggle("active", c === el);
      });
      renderDictList();
      return;
    }
    if (act === "set-roadmap-lvl") {
      setLevel(el.dataset.lvl);
      render();
      return;
    }
    if (act === "char-stroke") {
      openWriter(el.dataset.char);
      return;
    }
    if (act === "card-mic") {
      var wordText = el.dataset.word;
      var statusEl = $("#card-mic-status");
      if (!window.HanLoSpeech || !window.HanLoSpeech.isSupported) {
        toast("Trình duyệt không hỗ trợ Web Speech API (Hãy dùng Chrome hoặc Edge)");
        return;
      }
      if (statusEl) statusEl.innerHTML = '<span style="color:var(--jade)">🔴 Đang lắng nghe giọng bạn... Hãy đọc: <b>' + esc(wordText) + '</b></span>';
      window.HanLoSpeech.startListening(
        wordText,
        function (res) {
          if (statusEl) {
            var color = res.score >= 80 ? "var(--jade)" : res.score >= 50 ? "var(--amber)" : "var(--red)";
            statusEl.innerHTML = 'Bạn đã đọc: <b>' + (esc(res.text) || "(chưa rõ)") + '</b> · Điểm: <b style="color:' + color + '">' + res.score + '% (' + esc(res.grade) + ')</b>';
          }
          if (window.SoundFX) {
            if (res.score >= 80) SoundFX.bell();
            else if (res.score >= 50) SoundFX.tap();
            else SoundFX.wrong();
          }
        },
        function (err) {
          if (statusEl) statusEl.textContent = "Nhận diện âm: " + (err || "Hãy thử lại");
        }
      );
      return;
    }
    if (act === "say-sfx") {
      if (window.SoundFX) SoundFX.tap();
      speak(el.dataset.text);
      return;
    }
    if (act === "lookup-token") {
      openLookup(el.dataset);
      return;
    }
    if (act === "close-lookup") {
      closeLookup();
      return;
    }
    if (act === "select-article") {
      currentArticleIdx = Number(el.dataset.idx);
      renderReader();
      return;
    }
    if (act === "toggle-reader-pinyin") {
      readerPinyinVisible = !readerPinyinVisible;
      renderReader();
      return;
    }
    if (act === "export-backup") {
      exportBackup();
      return;
    }
    if (act === "import-backup-btn") {
      $("#import-file-input").click();
      return;
    }
    if (act === "learn") { startLearn(null, S.settings.goal - S.daily["new"] > 0 ? S.settings.goal - S.daily["new"] : 10); return; }
    if (act === "lesson") { startLearn(Number(el.dataset.lesson), LESSON_SIZE); return; }
    if (act === "review") { startReview(); return; }
    if (act === "say") { speak(el.dataset.text); return; }
    if (act === "continue") { nextStep(); return; }
    if (act === "answer") { answer(Number(el.dataset.i)); return; }
    if (act === "next") { nextStep(); return; }
    if (act === "quit") { closeSession(); return; }
    if (act === "home") { closeSession(); go("home"); return; }
    if (act === "close-settings") { $("#settings").classList.add("hidden"); return; }
    if (act === "show-welcome") { $("#settings").classList.add("hidden"); showWelcome(); return; }
    if (act === "start-app") {
      S.settings.onboarded = true;
      S.settings.goalType = welcomeType;
      S.settings.goal = welcomeCount;
      save();
      hideWelcome();
      render();
      toast("Bắt đầu thôi! Mục tiêu: " + welcomeCount + " từ/ngày.");
      return;
    }
    if (act === "close-write") { closeWriter(); return; }
    if (act === "write-animate") { if (writer) writer.animateCharacter(); return; }
    if (act === "write-quiz") { quizWriter(); return; }
    if (act === "start-exam-1" || act === "start-exam") { startExam(1); return; }
    if (act === "start-exam-2") { startExam(2); return; }
    if (act === "speech-mic") { toggleSpeechMic(); return; }
    if (act === "speech-prev") {
      if (speechWordIdx > 0) speechWordIdx--;
      speechResult = null;
      renderSpeech();
      return;
    }
    if (act === "speech-next") {
      speechWordIdx++;
      speechResult = null;
      renderSpeech();
      return;
    }
    if (act === "speech-tts") { speak(el.dataset.word); return; }
    if (act === "canvas-clear") {
      if (activeStrokeCanvas) activeStrokeCanvas.clear();
      return;
    }
    if (act === "canvas-undo") {
      if (activeStrokeCanvas) activeStrokeCanvas.undo();
      return;
    }
    if (act === "canvas-color") {
      if (activeStrokeCanvas) {
        activeStrokeCanvas.setInkColor(el.dataset.color);
        document.querySelectorAll("[data-act='canvas-color']").forEach(function (b) {
          b.classList.toggle("active", b.dataset.color === el.dataset.color);
        });
      }
      return;
    }
    if (act === "quit-exam") {
      closeExamSession();
      return;
    }
    if (act === "exam-jump") {
      if (examState) { examState.idx = Number(el.dataset.idx); renderExamSession(); }
      return;
    }
    if (act === "exam-prev") {
      if (examState && examState.idx > 0) { examState.idx--; renderExamSession(); }
      return;
    }
    if (act === "exam-next") {
      if (examState && examState.idx < examState.exam.questions.length - 1) { examState.idx++; renderExamSession(); }
      return;
    }
    if (act === "exam-answer-choice") {
      if (examState) {
        var qChoice = examState.exam.questions[examState.idx];
        examState.answers[qChoice.id] = Number(el.dataset.opt);
        renderExamSession();
      }
      return;
    }
    if (act === "exam-answer-judge") {
      if (examState) {
        var qJudge = examState.exam.questions[examState.idx];
        examState.answers[qJudge.id] = el.dataset.val === "true";
        renderExamSession();
      }
      return;
    }
    if (act === "submit-exam") {
      if (examState) finishExam();
      return;
    }
    if (act === "exam-say") { speak(el.dataset.text, 0.85); return; }
    if (act === "exam-close-result") { closeExamSession(); return; }
    if (act === "exam-retake") { startExam(); return; }
    if (act === "reset") {
      if (confirm("Xóa toàn bộ tiến độ học trên máy này?")) {
        localStorage.removeItem(KEY);
        S = defaults();
        ses = null;
        document.body.classList.remove("in-session");
        $("#session").classList.add("hidden");
        $("#settings").classList.add("hidden");
        render();
        toast("Đã xóa tiến độ.");
      }
      return;
    }
  });

  $("#btn-settings").addEventListener("click", function () {
    $("#set-pinyin").checked = S.settings.pinyin;
    $("#set-audio").checked = S.settings.audio;
    if ($("#set-sfx")) $("#set-sfx").checked = S.settings.sfx !== false;
    $("#set-goal").value = String(S.settings.goal);
    $("#settings").classList.remove("hidden");
  });
  $("#settings").addEventListener("click", function (e) {
    if (e.target === $("#settings")) $("#settings").classList.add("hidden");
  });
  $("#lookupSheet").addEventListener("click", function (e) {
    if (e.target === $("#lookupSheet")) closeLookup();
  });
  $("#writeSheet").addEventListener("click", function (e) {
    if (e.target === $("#writeSheet")) closeWriter();
  });
  $("#set-pinyin").addEventListener("change", function (e) {
    S.settings.pinyin = e.target.checked; save(); render();
  });
  $("#set-audio").addEventListener("change", function (e) {
    S.settings.audio = e.target.checked; save();
    if (!S.settings.audio && hasTTS()) window.speechSynthesis.cancel();
  });
  if ($("#set-sfx")) {
    $("#set-sfx").addEventListener("change", function (e) {
      S.settings.sfx = e.target.checked; save();
    });
  }
  $("#set-goal").addEventListener("change", function (e) {
    S.settings.goal = Number(e.target.value); save(); render();
  });
  var importFileInput = $("#import-file-input");
  if (importFileInput) {
    importFileInput.addEventListener("change", function (e) {
      if (e.target.files && e.target.files[0]) importBackup(e.target.files[0]);
    });
  }
  $("#search").addEventListener("input", function (e) {
    dictQuery = e.target.value;
    renderDictList();
  });
  var lvlSwitch = $("#level-switch");
  if (lvlSwitch) {
    lvlSwitch.addEventListener("click", function (e) {
      var btn = e.target.closest(".level-pill");
      if (btn && btn.dataset.lvl) {
        setLevel(btn.dataset.lvl);
        render();
      }
    });
  }
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      if (!$("#lookupSheet").classList.contains("hidden")) closeLookup();
      else if (!$("#writeSheet").classList.contains("hidden")) closeWriter();
      else if (!$("#settings").classList.contains("hidden")) $("#settings").classList.add("hidden");
      else if (examState) {
        if (confirm("Bạn có chắc muốn thoát phòng thi?")) closeExamSession();
      }
      else if (ses) closeSession();
    }
  });

  /* ================= khởi động ================= */
  initTTS();
  initWelcome();
  if ("serviceWorker" in navigator && /^https?:$/.test(location.protocol)) {
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("./sw.js").catch(function () { /* file:// hoặc trình duyệt cũ */ });
    });
  }
  var hash = (location.hash || "").replace("#", "");
  if (["dict", "progress", "write", "exam", "phonics", "grammar", "reader", "speech", "worksheet", "typing", "annotator", "game"].indexOf(hash) > -1) view = hash;
  render();
})();
