/**
 * FreeToolkit Learning Progress - LocalStorage Utility
 * Shared by all Chinese and Japanese tools
 */

type Language = 'chinese' | 'japanese';

interface QuizScore {
  best: number;
  last: number;
  attempts: number;
}

interface LevelProgress {
  learned: number;
  total: number;
}

interface Bookmark {
  char: string;
  pinyin?: string;
  reading?: string;
  meaning?: string;
  addedAt: string;
}

interface ProgressData {
  streak: number;
  lastVisit: string;
  charsLearned: string[];
  quizScores: Record<string, QuizScore>;
  hskProgress?: Record<string, LevelProgress>;
  jlptProgress?: Record<string, LevelProgress>;
  bookmarks: Bookmark[];
  dailyCompleted: string[];
}

const KEYS: Record<Language, string> = {
  chinese: 'ftk-chinese',
  japanese: 'ftk-japanese',
};

function getToday(): string {
  return new Date().toISOString().split('T')[0];
}

function getYesterday(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
}

export function getProgress(lang: Language): ProgressData {
  try {
    const raw = localStorage.getItem(KEYS[lang]);
    if (raw) return JSON.parse(raw);
  } catch {}

  // Default
  const defaults: ProgressData = {
    streak: 0,
    lastVisit: '',
    charsLearned: [],
    quizScores: {},
    bookmarks: [],
    dailyCompleted: [],
  };

  if (lang === 'chinese') {
    defaults.hskProgress = {
      hsk1: { learned: 0, total: 150 },
      hsk2: { learned: 0, total: 300 },
      hsk3: { learned: 0, total: 600 },
      hsk4: { learned: 0, total: 1200 },
      hsk5: { learned: 0, total: 2500 },
      hsk6: { learned: 0, total: 5000 },
    };
  } else {
    defaults.jlptProgress = {
      n5: { learned: 0, total: 800 },
      n4: { learned: 0, total: 1500 },
      n3: { learned: 0, total: 3750 },
      n2: { learned: 0, total: 6000 },
      n1: { learned: 0, total: 10000 },
    };
  }

  return defaults;
}

function saveProgress(lang: Language, data: ProgressData): void {
  localStorage.setItem(KEYS[lang], JSON.stringify(data));
}

/**
 * Update streak - call when user completes any daily activity
 */
export function updateStreak(lang: Language): number {
  const data = getProgress(lang);
  const today = getToday();

  if (data.lastVisit === today) return data.streak; // Already counted today

  if (data.lastVisit === getYesterday()) {
    data.streak += 1; // Consecutive day
  } else if (data.lastVisit === '') {
    data.streak = 1; // First ever visit
  } else {
    data.streak = 1; // Streak broken, restart
  }

  data.lastVisit = today;
  saveProgress(lang, data);
  return data.streak;
}

/**
 * Record a quiz score
 */
export function recordQuizScore(lang: Language, quizName: string, score: number): void {
  const data = getProgress(lang);
  const existing = data.quizScores[quizName] || { best: 0, last: 0, attempts: 0 };

  data.quizScores[quizName] = {
    best: Math.max(existing.best, score),
    last: score,
    attempts: existing.attempts + 1,
  };

  saveProgress(lang, data);
  updateStreak(lang);
}

/**
 * Mark a character as learned
 */
export function markCharLearned(lang: Language, char: string): void {
  const data = getProgress(lang);
  if (!data.charsLearned.includes(char)) {
    data.charsLearned.push(char);
    saveProgress(lang, data);
  }
}

/**
 * Add a word to bookmarks
 */
export function addBookmark(lang: Language, bookmark: Omit<Bookmark, 'addedAt'>): void {
  const data = getProgress(lang);
  if (!data.bookmarks.find(b => b.char === bookmark.char)) {
    data.bookmarks.push({ ...bookmark, addedAt: getToday() });
    saveProgress(lang, data);
  }
}

/**
 * Remove a word from bookmarks
 */
export function removeBookmark(lang: Language, char: string): void {
  const data = getProgress(lang);
  data.bookmarks = data.bookmarks.filter(b => b.char !== char);
  saveProgress(lang, data);
}

/**
 * Mark daily activity as completed
 */
export function markDailyCompleted(lang: Language): void {
  const data = getProgress(lang);
  const today = getToday();
  if (!data.dailyCompleted.includes(today)) {
    data.dailyCompleted.push(today);
    saveProgress(lang, data);
    updateStreak(lang);
  }
}

/**
 * Update level progress (HSK or JLPT)
 */
export function updateLevelProgress(lang: Language, level: string, learned: number): void {
  const data = getProgress(lang);
  if (lang === 'chinese' && data.hskProgress?.[level]) {
    data.hskProgress[level].learned = learned;
  } else if (lang === 'japanese' && data.jlptProgress?.[level]) {
    data.jlptProgress[level].learned = learned;
  }
  saveProgress(lang, data);
}

/**
 * Reset all progress
 */
export function resetProgress(lang: Language): void {
  localStorage.removeItem(KEYS[lang]);
}

/**
 * Get streak message
 */
export function getStreakMessage(streak: number): string {
  if (streak >= 365) return '🏆 One year! Incredible dedication!';
  if (streak >= 100) return '🌟 100 days! You\'re a champion!';
  if (streak >= 30) return '🏆 30 days! You\'re amazing!';
  if (streak >= 7) return '🔥 One week! You\'re on fire!';
  if (streak >= 3) return '🎉 Great start! Keep going!';
  if (streak >= 1) return '👋 Welcome back!';
  return 'Start practicing to build your streak!';
}
