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
      settings: { pinyin: true, audio: true, goal: 10, onboarded: false, goalType: "thi", level: "1" },
      streak: { count: 0, last: "" },
      history: {},
      daily: { date: "", new: 0 }
    };
  }
  function load() {
    var d = defaults();
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return d;
      var s = JSON.parse(raw);
      return Object.assign({}, d, s, {
        settings: Object.assign({}, d.settings, s.settings || {}),
        streak: Object.assign({}, d.streak, s.streak || {}),
        daily: Object.assign({}, d.daily, s.daily || {})
      });
    } catch (e) { return d; }
  }
  var S = load();
  setLevel(S.settings.level || "1");

  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* chế độ riêng tư: bỏ qua */ }
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

    $("#view-home").innerHTML =
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
      "</section>" +
      '<p class="home-note muted small">Chuẩn HSK 3.0: HSK 1 (300 từ) · HSK 2 (200 từ). <a href="gioi-thieu.html">Tìm hiểu thêm</a></p>';
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
    if (correct) ses.correct++;
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
    $("#set-goal").value = String(S.settings.goal);
    $("#settings").classList.remove("hidden");
  });
  $("#settings").addEventListener("click", function (e) {
    if (e.target === $("#settings")) $("#settings").classList.add("hidden");
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
  $("#set-goal").addEventListener("change", function (e) {
    S.settings.goal = Number(e.target.value); save(); render();
  });
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
      if (!$("#writeSheet").classList.contains("hidden")) closeWriter();
      else if (!$("#settings").classList.contains("hidden")) $("#settings").classList.add("hidden");
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
  if (hash === "dict" || hash === "progress" || hash === "write") view = hash;
  render();
})();
