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

  var LESSON_SIZE = 10;
  var currentLvl = "1";
  var WORDS = [];
  var LESSONS = 0;
  var CHARS = [];

  function setLevel(lvl) {
    currentLvl = String(lvl || "1");
    if (currentLvl === "1") {
      WORDS = ALL_WORDS.filter(function (w) { return w.level === 1; });
    } else if (currentLvl === "2") {
      WORDS = ALL_WORDS.filter(function (w) { return w.level === 2; });
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
      if (currentLvl === "1") subEl.textContent = "HSK 1 · 300 từ";
      else if (currentLvl === "2") subEl.textContent = "HSK 2 · 200 từ";
      else subEl.textContent = "HSK 1+2 · 500 từ";
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
  setLevel(S.settings.level || "1");

  function save() {
    try {
      localStorage.setItem(KEY, JSON.stringify(S));
      if (window.SoundFX) SoundFX.enabled = S.settings.sfx !== false;
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
          '<div class="bento-card" data-nav="reader">' +
            '<span class="bento-icon">📖</span>' +
            '<h4>Đọc Tương Tác</h4>' +
            '<p>Bài đọc HSK ngắn, ẩn/hiện Pinyin, tra từ 1-chạm.</p>' +
          '</div>' +
          '<div class="bento-card" data-nav="grammar">' +
            '<span class="bento-icon">⚖️</span>' +
            '<h4>Sắc Thái &amp; Ngữ Pháp</h4>' +
            '<p>So sánh 二/两, 会/能/可以, 的/得/地...</p>' +
          '</div>' +
          '<div class="bento-card" data-nav="exam">' +
            '<span class="bento-icon">📝</span>' +
            '<h4>Thi Thử HSK 1</h4>' +
            '<p>Đề chuẩn 40 câu / 35 phút, đếm giờ, chấm điểm.</p>' +
          '</div>' +
        '</div>' +
      "</section>" +

      '<section class="card">' +
        '<div class="row-between"><h3>Tiến độ ' + (currentLvl === "1" ? "HSK 1" : currentLvl === "2" ? "HSK 2" : "HSK 1+2") + '</h3><span class="muted">' + learned + "/" + WORDS.length + " từ</span></div>" +
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
        '<h2>Thi Thử HSK 1 Chuẩn Quốc Tế</h2>' +
        '<p class="muted">Bộ đề chuẩn 40 câu trắc nghiệm mô phỏng đúng 100% cấu trúc phòng thi thật: đồng hồ đếm ngược, audio phát âm zh-CN, tự động chấm điểm và phân tích kỹ năng.</p>' +
        '<div class="exam-badge-row">' +
          '<span class="exam-tag">⏱️ 35 phút</span>' +
          '<span class="exam-tag">📝 40 câu hỏi</span>' +
          '<span class="exam-tag">🎯 Đạt: ≥ 120 / 200 điểm</span>' +
          '<span class="exam-tag">🔊 Giọng đọc zh-CN</span>' +
        '</div>' +
        '<ul class="exam-rule-list muted">' +
          '<li><b>Phần 1 — Nghe hiểu (听力):</b> 20 câu (Câu 1–20), bấm nút loa để nghe giọng chuẩn zh-CN và chọn đáp án.</li>' +
          '<li><b>Phần 2 — Đọc hiểu (阅读):</b> 20 câu (Câu 21–40), kiểm tra từ vựng, ngữ pháp và đối thoại.</li>' +
          '<li>Hệ thống tự động nộp bài khi hết 35 phút hoặc bạn có thể nộp sớm bất kỳ lúc nào.</li>' +
        '</ul>' +
        '<button class="btn primary wide" data-act="start-exam" style="padding:15px; font-size:16px; font-weight:600">Bắt đầu làm bài thi</button>' +
        histHtml +
      '</section>';
  }

  function startExam() {
    var exam = window.HSK1_EXAM_PRACTICE;
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

    var rulesHtml = pData.rules.map(function (r) {
      return '<div class="rule-card">' +
        '<h4 style="margin:0 0 4px;color:var(--amber)">' + r.title + '</h4>' +
        '<p class="small" style="margin:0 0 6px">' + r.rule + '</p>' +
        '<div class="small muted"><b>Ví dụ:</b> ' + r.example + '</div>' +
      '</div>';
    }).join("");

    $("#view-phonics").innerHTML =
      '<div class="row-between" style="margin-bottom:14px">' +
        '<div>' +
          '<p class="eyebrow">Chuẩn Âm Bắc Kinh</p>' +
          '<h2 style="margin:2px 0">Ngữ Âm Pinyin &amp; Thanh Điệu</h2>' +
        '</div>' +
        '<button class="btn ghost small" data-nav="home">← Trang chủ</button>' +
      '</div>' +
      '<section class="card phonics-section">' +
        '<h3>4 Thanh Điệu Chính Thức</h3>' +
        '<p class="muted small">Biểu đồ cao độ 5 mức chuẩn quốc tế giúp khắc phục triệt để lỗi phát âm thanh 1 và thanh 4 của người Việt.</p>' +
        '<div class="tone-grid">' + tonesHtml + '</div>' +
      '</section>' +
      '<section class="card phonics-section">' +
        '<h3>23 Thanh Mẫu (Phụ âm đầu)</h3>' +
        '<p class="muted small">Chạm vào từng phụ âm để nghe âm mẫu chuẩn.</p>' +
        '<div class="pinyin-chips">' + initialsHtml + '</div>' +
      '</section>' +
      '<section class="card phonics-section">' +
        '<h3>36 Vận Mẫu (Nguyên âm)</h3>' +
        '<p class="muted small">Chạm vào từng vần để nghe âm mẫu chuẩn.</p>' +
        '<div class="pinyin-chips">' + finalsHtml + '</div>' +
      '</section>' +
      '<section class="card phonics-section">' +
        '<h3>Quy Tắc Biến Điệu Quan Trọng</h3>' +
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
    $("#lookup-body").innerHTML =
      '<div class="lookup-hz">' + esc(tok.hz) + '</div>' +
      '<div class="lookup-py">' + pinyinHTML(tok.py) + '</div>' +
      '<div class="lookup-hv">Âm Hán–Việt: <b>' + esc(tok.hv) + '</b></div>' +
      '<div class="lookup-vi">' + esc(tok.vi) + '</div>' +
      '<button class="btn primary wide" data-act="say-sfx" data-text="' + esc(tok.hz) + '">🔊 Phát âm chuẩn</button>';
    $("#lookupSheet").classList.remove("hidden");
  }
  function closeLookup() {
    $("#lookupSheet").classList.add("hidden");
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

    $("#view-progress").innerHTML =
      '<section class="stat-grid">' +
        '<div class="card stat"><b>' + st.learned + "</b><span>Đã học</span></div>" +
        '<div class="card stat"><b>' + st.mastered + "</b><span>Đã thuộc</span></div>" +
        '<div class="card stat"><b>' + due + "</b><span>Đến hạn</span></div>" +
        '<div class="card stat"><b>' + S.streak.count + "</b><span>Chuỗi ngày</span></div>" +
      "</section>" +

      '<section class="card">' +
        "<h3>Phân bố 300 từ</h3>" +
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
        "<h3>14 ngày gần đây</h3>" +
        '<div class="chart">' + bars + "</div>" +
        '<p class="muted small">Số lượt trả lời mỗi ngày.</p>' +
      "</section>" +

      '<section class="card">' +
        '<div class="row-between"><h3>Độ chính xác 7 ngày</h3><b class="big-num">' + acc + "%</b></div>" +
        '<div class="bar"><i style="width:' + acc + '%"></i></div>' +
      "</section>" +

      '<p class="muted small center">Dữ liệu HSK 1 (HSK 3.0) · pinyin + Hán–Việt + nghĩa tiếng Việt · lưu trên máy.</p>';
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
      el.innerHTML = head +
        '<div class="card study">' +
          '<p class="eyebrow">Bài ' + w.lesson + " · từ mới</p>" +
          '<div class="hanzi">' + esc(w.h) + "</div>" +
          (S.settings.pinyin ? '<div class="pinyin-line">' + pinyinHTML(w.p) + "</div>" : "") +
          '<p class="hv-line">Hán–Việt: <b>' + esc(w.hv) + "</b></p>" +
          '<p class="meaning">' + esc(w.vi) + "</p>" +
          '<button class="btn ghost say-btn" data-act="say" data-text="' + esc(w.h) + '">' +
            '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9v6h4l5 4V5L8 9z"/><path d="M17 8a5 5 0 0 1 0 8"/></svg> Nghe phát âm' +
          "</button>" +
          '<button class="btn primary wide" data-act="continue">Đã hiểu → Kiểm tra</button>' +
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
      return;
    }
    $("#char-grid").innerHTML = list.map(function (ch) {
      return '<button class="char-btn' + (charKnown(ch) ? " learned" : "") + '" data-wchar="' + ch + '" aria-label="Tập viết ' + ch + '">' + ch + "</button>";
    }).join("");
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
    if (act === "start-exam") { startExam(); return; }
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
  if (["dict", "progress", "write", "exam", "phonics", "grammar", "reader"].indexOf(hash) > -1) view = hash;
  render();
})();
