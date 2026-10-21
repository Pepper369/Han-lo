import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Word, Card, AppState, ReaderToken, Exam, ExamHistoryItem } from './types';
import { ALL_WORDS } from './data/words';
import { HSK_EXAMS } from './data/exams';
import {
  loadState,
  saveState,
  todayFresh,
  recordAnswerInState,
  exportBackup,
  importBackupFromFile,
  getDefaultState
} from './utils/storage';
import { initTTS } from './utils/tts';
import { isDue } from './utils/core';
import { TopBar } from './components/TopBar';
import { TabBar, NavTab } from './components/TabBar';
import { HomeView } from './components/views/HomeView';
import { ExamView } from './components/views/ExamView';
import { DictView } from './components/views/DictView';
import { WriteView } from './components/views/WriteView';
import { ProgressView } from './components/views/ProgressView';
import { PhonicsView } from './components/views/PhonicsView';
import { GrammarView } from './components/views/GrammarView';
import { ReaderView } from './components/views/ReaderView';
import { SpeechView } from './components/views/SpeechView';
import { DictationView } from './components/views/DictationView';
import { RadicalsView } from './components/views/RadicalsView';
import { StudySessionModal } from './components/modals/StudySessionModal';
import { ExamModal } from './components/modals/ExamModal';
import { LookupModal } from './components/modals/LookupModal';
import { WriteModal } from './components/modals/WriteModal';
import { SettingsModal } from './components/modals/SettingsModal';
import { WelcomeModal } from './components/modals/WelcomeModal';
import { IntroModal } from './components/modals/IntroModal';
import { Toast } from './components/Toast';

const LESSON_SIZE = 10;

export const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(() => todayFresh(loadState()));
  const [currentTab, setCurrentTab] = useState<NavTab>(() => {
    const hash = (window.location.hash || '').replace('#', '') as NavTab;
    const validTabs: NavTab[] = ['home', 'exam', 'dict', 'write', 'progress', 'phonics', 'grammar', 'reader', 'speech', 'dictation', 'radicals'];
    return validTabs.includes(hash) ? hash : 'home';
  });

  const [activeSession, setActiveSession] = useState<{ mode: 'learn' | 'review'; words: Word[] } | null>(null);
  const [activeExam, setActiveExam] = useState<Exam | null>(null);
  const [lookupData, setLookupData] = useState<Word | ReaderToken | null>(null);
  const [writeChar, setWriteChar] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [showWelcome, setShowWelcome] = useState<boolean>(() => !loadState().settings.onboarded);
  const [showIntro, setShowIntro] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Initialize TTS voices
  useEffect(() => {
    initTTS();
  }, []);

  // Save on state change
  useEffect(() => {
    saveState(appState);
  }, [appState]);

  // Sync hash with currentTab
  const navigateTab = useCallback((tab: NavTab) => {
    setCurrentTab(tab);
    window.location.hash = `#${tab}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2400);
  }, []);

  // Filter words by level
  const currentLvl = appState.settings.level || '1';

  const currentLevelWords = useMemo(() => {
    let list: Word[] = [];
    if (currentLvl === '0' || currentLvl === '1') {
      list = ALL_WORDS.filter((w) => w.level === 1);
    } else if (currentLvl === '2') {
      list = ALL_WORDS.filter((w) => w.level === 2);
    } else if (currentLvl === '3') {
      list = ALL_WORDS.filter((w) => w.level === 3);
    } else {
      list = ALL_WORDS.slice();
    }

    return list.map((w, idx) => ({
      ...w,
      lesson: Math.floor(idx / LESSON_SIZE) + 1
    }));
  }, [currentLvl]);

  const handleSelectLevel = (lvl: string) => {
    setAppState((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        level: lvl
      }
    }));
  };

  // Start Learn Session
  const handleStartLearn = (lessonNum?: number, count: number = 10) => {
    let candidates: Word[] = [];
    if (lessonNum !== undefined) {
      candidates = currentLevelWords.filter((w) => w.lesson === lessonNum);
    } else {
      candidates = currentLevelWords.filter((w) => !appState.cards[w.id]);
    }

    if (!candidates.length) {
      candidates = currentLevelWords.slice(0, count);
    }

    const sessionWords = candidates.slice(0, count);
    if (!sessionWords.length) {
      showToast('Bạn đã học hết từ vựng ở cấp độ này!');
      return;
    }

    setActiveSession({ mode: 'learn', words: sessionWords });
  };

  // Start Review Session
  const handleStartReview = () => {
    const now = Date.now();
    const dueWords = currentLevelWords.filter((w) => isDue(appState.cards[w.id], now));
    if (!dueWords.length) {
      showToast('Chưa có từ nào đến hạn ôn tập!');
      return;
    }
    setActiveSession({ mode: 'review', words: dueWords });
  };

  // Start Exam
  const handleStartExam = (level: 1 | 2) => {
    const exam = HSK_EXAMS[level];
    if (exam) {
      setActiveExam(exam);
    } else {
      showToast('Đang cập nhật đề thi...');
    }
  };

  // Update card after study session
  const handleUpdateCard = (wordId: number, newCardData: Card, correct: boolean) => {
    setAppState((prev) => {
      const updatedCards = { ...prev.cards, [wordId]: newCardData };
      const updatedDaily = {
        ...prev.daily,
        new: activeSession?.mode === 'learn' ? prev.daily.new + 1 : prev.daily.new
      };
      const next = recordAnswerInState(
        {
          ...prev,
          cards: updatedCards,
          daily: updatedDaily
        },
        correct
      );
      return next;
    });
  };

  // Save exam result
  const handleSaveExamResult = (res: ExamHistoryItem) => {
    setAppState((prev) => {
      const nextHistory = [res, ...prev.examHistory].slice(0, 20);
      return {
        ...prev,
        examHistory: nextHistory
      };
    });
  };

  // Reset progress
  const handleResetProgress = () => {
    if (confirm('Xóa toàn bộ tiến độ học trên máy này?')) {
      const reset = getDefaultState();
      saveState(reset);
      setAppState(reset);
      setShowSettings(false);
      showToast('Đã xóa toàn bộ tiến độ.');
    }
  };

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (lookupData) setLookupData(null);
        else if (writeChar) setWriteChar(null);
        else if (showSettings) setShowSettings(false);
        else if (showIntro) setShowIntro(false);
        else if (activeExam) {
          if (confirm('Bạn có chắc muốn thoát phòng thi?')) setActiveExam(null);
        } else if (activeSession) {
          setActiveSession(null);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lookupData, writeChar, showSettings, showIntro, activeExam, activeSession]);

  return (
    <div className="app">
      <TopBar
        currentLvl={currentLvl}
        onSelectLevel={handleSelectLevel}
        streakCount={appState.streak.count}
        onOpenSettings={() => setShowSettings(true)}
      />

      {/* Main Views */}
      {currentTab === 'home' && (
        <HomeView
          currentLvl={currentLvl}
          words={currentLevelWords}
          allWords={ALL_WORDS}
          cards={appState.cards}
          dailyNew={appState.daily.new}
          goal={appState.settings.goal}
          onStartLearn={handleStartLearn}
          onStartReview={handleStartReview}
          onNavigate={navigateTab}
          onSelectLevel={handleSelectLevel}
        />
      )}

      {currentTab === 'exam' && (
        <ExamView
          examHistory={appState.examHistory}
          onStartExam={handleStartExam}
        />
      )}

      {currentTab === 'dict' && (
        <DictView
          words={currentLevelWords}
          cards={appState.cards}
          showPinyin={appState.settings.pinyin}
          audioEnabled={appState.settings.audio}
          onOpenLookup={(w) => setLookupData(w)}
        />
      )}

      {currentTab === 'write' && (
        <WriteView
          words={currentLevelWords}
          cards={appState.cards}
          onOpenWriter={(ch) => setWriteChar(ch)}
        />
      )}

      {currentTab === 'progress' && (
        <ProgressView
          words={currentLevelWords}
          cards={appState.cards}
          history={appState.history}
          examHistory={appState.examHistory}
          streakCount={appState.streak.count}
          onExportBackup={() => {
            exportBackup(appState);
            showToast('Đã xuất file sao lưu tiến độ!');
          }}
          onImportBackup={() => setShowSettings(true)}
        />
      )}

      {currentTab === 'phonics' && (
        <PhonicsView
          audioEnabled={appState.settings.audio}
          onOpenWriter={(ch) => setWriteChar(ch)}
        />
      )}

      {currentTab === 'grammar' && (
        <GrammarView audioEnabled={appState.settings.audio} />
      )}

      {currentTab === 'reader' && (
        <ReaderView
          audioEnabled={appState.settings.audio}
          onOpenLookupToken={(tok) => setLookupData(tok)}
        />
      )}

      {currentTab === 'speech' && (
        <SpeechView
          words={currentLevelWords}
          allWords={ALL_WORDS}
          audioEnabled={appState.settings.audio}
        />
      )}

      {currentTab === 'dictation' && (
        <DictationView
          audioEnabled={appState.settings.audio}
        />
      )}

      {currentTab === 'radicals' && (
        <RadicalsView
          audioEnabled={appState.settings.audio}
          onOpenWriter={(ch) => setWriteChar(ch)}
        />
      )}

      {/* Bottom Navigation */}
      <TabBar currentTab={currentTab} onSelectTab={navigateTab} />

      {/* Active Study Session Modal */}
      {activeSession && (
        <StudySessionModal
          mode={activeSession.mode}
          words={activeSession.words}
          allWords={ALL_WORDS}
          cards={appState.cards}
          showPinyin={appState.settings.pinyin}
          audioEnabled={appState.settings.audio}
          onUpdateCard={handleUpdateCard}
          onClose={() => setActiveSession(null)}
          onOpenWriter={(ch) => setWriteChar(ch)}
        />
      )}

      {/* Active Exam Modal */}
      {activeExam && (
        <ExamModal
          exam={activeExam}
          audioEnabled={appState.settings.audio}
          onSaveResult={handleSaveExamResult}
          onClose={() => setActiveExam(null)}
        />
      )}

      {/* Instant Word Lookup Popup */}
      {lookupData && (
        <LookupModal
          data={lookupData}
          audioEnabled={appState.settings.audio}
          onClose={() => setLookupData(null)}
          onOpenWriter={(ch) => setWriteChar(ch)}
        />
      )}

      {/* HanziWriter Animated Practice Popup */}
      {writeChar && (
        <WriteModal char={writeChar} onClose={() => setWriteChar(null)} />
      )}

      {/* Settings Modal */}
      {showSettings && (
        <SettingsModal
          settings={appState.settings}
          onUpdateSettings={(newSettings) => {
            setAppState((prev) => ({
              ...prev,
              settings: { ...prev.settings, ...newSettings }
            }));
          }}
          onExportBackup={() => {
            exportBackup(appState);
            showToast('Đã xuất file sao lưu tiến độ!');
          }}
          onImportBackupFile={(file) => {
            importBackupFromFile(
              file,
              (imported) => {
                setAppState(imported);
                setShowSettings(false);
                showToast('Khôi phục tiến độ thành công!');
              },
              (err) => showToast(err)
            );
          }}
          onResetProgress={handleResetProgress}
          onOpenIntro={() => setShowIntro(true)}
          onOpenWelcome={() => setShowWelcome(true)}
          onClose={() => setShowSettings(false)}
        />
      )}

      {/* Onboarding Welcome Screen */}
      {showWelcome && (
        <WelcomeModal
          initialGoalType={appState.settings.goalType}
          initialGoalCount={appState.settings.goal}
          onComplete={(goalType, goalCount) => {
            setAppState((prev) => ({
              ...prev,
              settings: {
                ...prev.settings,
                onboarded: true,
                goalType,
                goal: goalCount
              }
            }));
            setShowWelcome(false);
            showToast(`Bắt đầu thôi! Mục tiêu: ${goalCount} từ/ngày.`);
          }}
          onOpenIntro={() => setShowIntro(true)}
        />
      )}

      {/* HSK 3.0 Intro & Comparison Guide */}
      {showIntro && <IntroModal onClose={() => setShowIntro(false)} />}

      {/* Global Toast */}
      <Toast message={toastMessage} />
    </div>
  );
};
