/* ============================================================
   DESENROLA — BACKUP 6 + Som ambiente + Compartilhar + Desafio Diário
   ------------------------------------------------------------
   Novidade desta versão:
   - Botão "🎯 Desafio do dia" no menu (linha própria).
   - Fase determinística por data (mesma para todos).
   - 3 tentativas por dia, melhor pontuação conta.
   - Streak de dias consecutivos.
   - Histórico dos últimos 7 desafios (painel "🎯 Desafios").
   - 3 conquistas novas (primeiro/três/semana).
   - Compartilhamento específico do desafio.
   ============================================================ */

(function () {
  'use strict';

  const CONFIG = {
    SHARE_URL: 'https://seu-usuario.github.io/desenrola/',

    SHELF_LEVELS: [
      { shelves: 2, pairs: 2, starChance: 0,    giftChance: 0    },
      { shelves: 2, pairs: 3, starChance: 0,    giftChance: 0    },
      { shelves: 3, pairs: 2, starChance: 0.15, giftChance: 0    },
      { shelves: 3, pairs: 3, starChance: 0.15, giftChance: 0.05 },
      { shelves: 3, pairs: 4, starChance: 0.18, giftChance: 0.06 },
      { shelves: 4, pairs: 3, starChance: 0.20, giftChance: 0.08 },
      { shelves: 4, pairs: 4, starChance: 0.22, giftChance: 0.10 },
      { shelves: 5, pairs: 3, starChance: 0.25, giftChance: 0.12 },
      { shelves: 5, pairs: 4, starChance: 0.28, giftChance: 0.15 },
      { shelves: 5, pairs: 4, starChance: 0.30, giftChance: 0.18 },
    ],
    ZEN_SHELF: { shelves: 2, pairs: 3, starChance: 0.15, giftChance: 0.08 },
    ZEN_THREADS: { threads: 4, nodes: 4 },

    /* Nível fixo do desafio diário — usa a entrada índice 4 (nível 5) */
    DAILY_SHELF_LEVEL_IDX: 4,
    DAILY_THREADS_LEVEL_IDX: 4,

    /* Tentativas por dia */
    DAILY_MAX_ATTEMPTS: 3,

    THREAD_LEVELS: [
      { threads: 3, nodes: 3 },
      { threads: 3, nodes: 4 },
      { threads: 4, nodes: 3 },
      { threads: 4, nodes: 4 },
      { threads: 4, nodes: 5 },
      { threads: 5, nodes: 4 },
      { threads: 5, nodes: 5 },
      { threads: 5, nodes: 6 },
      { threads: 6, nodes: 4 },
      { threads: 6, nodes: 5 },
    ],

    BACKGROUND: '#FFF5E6',
    SHELF: '#D2691E',
    SNAP: '#3E7CB1',
    CELEBRATION: '#FFB74D',
    SLOT_BORDER: 'rgba(210, 105, 30, 0.22)',
    SLOT_HIGHLIGHT: '#5B9BD5',
    PAIR_MARK: '#3E7CB1',
    SHADOW: 'rgba(139, 69, 19, 0.25)',

    OBJECT_TYPES: [
      { id: 'frasco',   palette: { color: '#F4C28A', accent: '#E0A566' } },
      { id: 'vaso',     palette: { color: '#E8A87C', accent: '#D18F5F' } },
      { id: 'livro',    palette: { color: '#D98880', accent: '#C46B63' } },
      { id: 'quadro',   palette: { color: '#F0B860', accent: '#D9A040' } },
      { id: 'xicara',   palette: { color: '#E89B6E', accent: '#D17E4F' } },
      { id: 'prato',    palette: { color: '#C79BC4', accent: '#AD7EAA' } },
      { id: 'garrafa',  palette: { color: '#E8A050', accent: '#D18838' } },
      { id: 'lata',     palette: { color: '#9BB0D4', accent: '#7E94BA' } },
      { id: 'caixa',    palette: { color: '#E07856', accent: '#C46040' } },
      { id: 'rolo',     palette: { color: '#E8D070', accent: '#D1B840' } },
      { id: 'cesta',    palette: { color: '#E8B860', accent: '#D1A040' } },
      { id: 'pote',     palette: { color: '#E8A8A0', accent: '#D18880' } },
      { id: 'cilindro', palette: { color: '#E8A0B8', accent: '#D17EA0' } },
      { id: 'cristal',  palette: { color: '#A8C8E8', accent: '#8AA8D1' } },
      { id: 'ampulheta',palette: { color: '#E8C060', accent: '#D1A840' } },
    ],

    OBJECT_FAMILY: {
      vaso: 'big', garrafa: 'big', pote: 'big', cilindro: 'big', cristal: 'big', ampulheta: 'big',
      frasco: 'mid', quadro: 'mid', caixa: 'mid', rolo: 'mid', cesta: 'mid',
      livro: 'small', xicara: 'small', lata: 'small', prato: 'small',
      estrela: 'mid', presente: 'mid',
    },

    STAR_PALETTE: { color: '#FFD54F', accent: '#FFB300' },
    GIFT_PALETTE: { color: '#F06292', accent: '#E91E63' },

    POINTS_NORMAL: 10,
    POINTS_STAR: 50,
    POINTS_GIFT: 100,
    POINTS_PHASE_BONUS: 50,
    POINTS_PER_SECOND_LEFT: 2,

    THREAD_POINTS_CLEAN: 20,
    THREAD_POINTS_ELECTRIC: 100,
    THREAD_POINTS_PHASE_BONUS: 100,
    THREAD_ELECTRIC_CHANCE: 0.30,

    THREAD_COLORS: [
      '#F4C28A', '#9BB0D4', '#D98880', '#F0B860', '#C79BC4', '#E8A87C',
    ],
    ELECTRIC_COLOR: '#FFD54F',
    ELECTRIC_ACCENT: '#FFB300',

    THREAD_THICKNESS: 5,
    THREAD_ENDPOINT_RADIUS: 9,
    THREAD_NODE_RADIUS: 10,
    THREAD_GRAB_RADIUS: 36,
    THREAD_MARGIN: 40,
    THREAD_SAMPLE_STEP: 6,

    FLASH_DURATION: 200,
    CELEBRATION_DURATION: 1000,
    RETURN_DURATION: 300,

    AMBIENT: {
      SRC: 'ambient.mp3',
      VOLUME: 0.35,
      FADE_IN_MS: 2500,
      FADE_OUT_MS: 800,
    },

    ACHIEVEMENTS: [
      { id: 'first_shelf',   icon: '▤', name: 'Primeira prateleira',  desc: 'Complete 1 prateleira' },
      { id: 'first_thread',  icon: '〜', name: 'Primeiro fio',         desc: 'Complete 1 fase de fios' },
      { id: 'shelf_5',       icon: '📚', name: 'Colecionadora',       desc: 'Complete 5 prateleiras' },
      { id: 'thread_5',      icon: '🪢', name: 'Desembaraçadora',      desc: 'Complete 5 fases de fios' },
      { id: 'electric',      icon: '⚡', name: 'Fio elétrico',         desc: 'Desembarace um fio elétrico' },
      { id: 'star',          icon: '⭐', name: 'Estrela-guia',         desc: 'Pareie uma estrela' },
      { id: 'gift',          icon: '🎁', name: 'Presente perfeito',    desc: 'Pareie um presente' },
      { id: 'score_1000',    icon: '🏆', name: 'Mil pontos',           desc: 'Acumule 1000 pontos' },
      { id: 'daily_first',   icon: '🎯', name: 'Primeiro desafio',     desc: 'Complete 1 desafio diário' },
      { id: 'daily_3',       icon: '🔥', name: 'Três seguidos',        desc: '3 dias de desafio seguidos' },
      { id: 'daily_7',       icon: '🌟', name: 'Semana perfeita',      desc: '7 dias de desafio seguidos' },
    ],

    STORAGE_KEY: 'desenrola.progress.v1',
  };

  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  const statusEl = document.getElementById('status');
  const btnNew = document.getElementById('btn-new');
  const btnMenu = document.getElementById('btn-menu');
  const menuEl = document.getElementById('menu');
  const gameAreaEl = document.getElementById('game-area');
  const btnShelf = document.getElementById('btn-shelf');
  const btnThreads = document.getElementById('btn-threads');
  const btnZen = document.getElementById('btn-zen');
  const btnDaily = document.getElementById('btn-daily');
  const btnMute = document.getElementById('btn-mute');
  const btnAmbient = document.getElementById('btn-ambient');
  const btnHelp = document.getElementById('btn-help');
  const btnHelpGame = document.getElementById('btn-help-game');
  const helpPanel = document.getElementById('help-panel');
  const helpShelfPanel = document.getElementById('help-shelf-panel');
  const helpThreadsPanel = document.getElementById('help-threads-panel');
  const btnCloseHelp = document.getElementById('btn-close-help');
  const btnCloseHelpShelf = document.getElementById('btn-close-help-shelf');
  const btnCloseHelpThreads = document.getElementById('btn-close-help-threads');
  const countShelf = document.getElementById('count-shelf');
  const countThreads = document.getElementById('count-threads');
  const countDaily = document.getElementById('count-daily');
  const btnReset = document.getElementById('btn-reset');
  const btnAchievements = document.getElementById('btn-achievements');
  const btnDailyPanel = document.getElementById('btn-daily-panel');
  const achPanel = document.getElementById('achievements-panel');
  const achList = document.getElementById('ach-list');
  const btnCloseAch = document.getElementById('btn-close-ach');
  const dailyPanel = document.getElementById('daily-panel');
  const dailyList = document.getElementById('daily-list');
  const dailyStreakCount = document.getElementById('daily-streak-count');
  const btnCloseDaily = document.getElementById('btn-close-daily');
  const toast = document.getElementById('toast');
  const toastIcon = document.getElementById('toast-icon');
  const toastText = document.getElementById('toast-text');
  const hudLevel = document.getElementById('hud-level');
  const hudPairs = document.getElementById('hud-pairs');
  const hudTimer = document.getElementById('hud-timer');
  const hudScore = document.getElementById('hud-score');
  const winOverlay = document.getElementById('win-overlay');
  const winTitle = document.getElementById('win-title');
  const winPoints = document.getElementById('win-points');
  const winBreakdown = document.getElementById('win-breakdown');
  const winTotal = document.getElementById('win-total');
  const btnNextLevel = document.getElementById('btn-next-level');
  const btnShare = document.getElementById('btn-share');
  const dailyWinOverlay = document.getElementById('daily-win-overlay');
  const dailyWinTitle = document.getElementById('daily-win-title');
  const dailyWinPoints = document.getElementById('daily-win-points');
  const dailyWinAttempts = document.getElementById('daily-win-attempts');
  const dailyWinBest = document.getElementById('daily-win-best');
  const btnDailyShare = document.getElementById('btn-daily-share');
  const btnDailyRetry = document.getElementById('btn-daily-retry');
  const btnDailyClose = document.getElementById('btn-daily-close');

  /* ============================================================
     PRNG — gerador pseudo-aleatório determinístico (mulberry32)
     ============================================================ */
  function mulberry32(seed) {
    let a = seed >>> 0;
    return function () {
      a |= 0;
      a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /** Hash simples de string → inteiro de 32 bits. */
  function hashString(str) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  /** Retorna a data atual em YYYY-MM-DD no fuso local. */
  function todayKey() {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  /**
   * Decide o mecanismo do desafio do dia baseado na data.
   * Segunda/Quarta/Sexta/Sábado: Prateleira
   * Terça/Quinta: Fios
   * Domingo: aleatório (determinístico pela seed)
   */
  function dailyMechanicForDate(dateKey) {
    const d = new Date(dateKey + 'T12:00:00');
    const dow = d.getDay(); // 0=dom, 1=seg, ...
    if (dow === 0) {
      // Domingo: aleatório determinístico
      const seed = hashString(dateKey + '-sunday');
      return (seed % 2 === 0) ? 'shelf' : 'threads';
    }
    if (dow === 2 || dow === 4) return 'threads'; // ter, qui
    return 'shelf'; // seg, qua, sex, sáb
  }

  const Progress = {
    data: {
      shelf: 0, threads: 0, score: 0, achievements: [], muted: false, ambient: true,
      daily: {
        streak: 0,
        lastCompletedDate: null,
        history: [],
        today: { date: null, attemptsUsed: 0, bestScore: 0, completed: false },
      },
    },
    load() {
      try {
        const raw = localStorage.getItem(CONFIG.STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && typeof parsed === 'object') {
            this.data.shelf = Number(parsed.shelf) || 0;
            this.data.threads = Number(parsed.threads) || 0;
            this.data.score = Number(parsed.score) || 0;
            this.data.achievements = Array.isArray(parsed.achievements) ? parsed.achievements : [];
            this.data.muted = !!parsed.muted;
            this.data.ambient = parsed.ambient === undefined ? true : !!parsed.ambient;
            if (parsed.daily && typeof parsed.daily === 'object') {
              this.data.daily = {
                streak: Number(parsed.daily.streak) || 0,
                lastCompletedDate: parsed.daily.lastCompletedDate || null,
                history: Array.isArray(parsed.daily.history) ? parsed.daily.history : [],
                today: parsed.daily.today && typeof parsed.daily.today === 'object'
                  ? {
                      date: parsed.daily.today.date || null,
                      attemptsUsed: Number(parsed.daily.today.attemptsUsed) || 0,
                      bestScore: Number(parsed.daily.today.bestScore) || 0,
                      completed: !!parsed.daily.today.completed,
                    }
                  : { date: null, attemptsUsed: 0, bestScore: 0, completed: false },
              };
            }
          }
        }
      } catch (e) {
        // mantém defaults
      }
      // Reset diário: se a data mudou, zera o "today"
      this.ensureTodayReset();
    },
    save() {
      try { localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(this.data)); } catch (e) {}
    },
    increment(which) {
      if (which === 'shelf' || which === 'threads') { this.data[which]++; this.save(); }
    },
    addScore(points) { this.data.score += points; this.save(); },
    reset() {
      const keepMute = this.data.muted;
      const keepAmbient = this.data.ambient;
      this.data = {
        shelf: 0, threads: 0, score: 0, achievements: [], muted: keepMute, ambient: keepAmbient,
        daily: {
          streak: 0,
          lastCompletedDate: null,
          history: [],
          today: { date: null, attemptsUsed: 0, bestScore: 0, completed: false },
        },
      };
      try { localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(this.data)); } catch (e) {}
    },
    hasAchievement(id) { return this.data.achievements.indexOf(id) >= 0; },
    unlockAchievement(id) {
      if (this.hasAchievement(id)) return false;
      this.data.achievements.push(id);
      this.save();
      return true;
    },
    toggleMute() {
      this.data.muted = !this.data.muted;
      this.save();
      return this.data.muted;
    },
    toggleAmbient() {
      this.data.ambient = !this.data.ambient;
      this.save();
      return this.data.ambient;
    },

    /** Garante que `today` reflete o dia atual. */
    ensureTodayReset() {
      const tk = todayKey();
      if (this.data.daily.today.date !== tk) {
        this.data.daily.today = {
          date: tk,
          attemptsUsed: 0,
          bestScore: 0,
          completed: false,
        };
        this.save();
      }
    },

    /** Calcula se o streak continua (conta ontem) ou quebrou. */
    updateStreakIfNeeded() {
      const tk = todayKey();
      const last = this.data.daily.lastCompletedDate;
      if (!last) return;
      // Diferença em dias entre hoje e a última conclusão
      const d1 = new Date(tk + 'T12:00:00');
      const d2 = new Date(last + 'T12:00:00');
      const diffDays = Math.round((d1 - d2) / 86400000);
      if (diffDays > 1) {
        // Quebrou o streak (ficou > 1 dia sem completar)
        this.data.daily.streak = 0;
        this.save();
      }
    },
  };

  let toastTimeout = null;
  function showToast(icon, text) {
    toastIcon.textContent = icon;
    toastText.textContent = text;
    toast.classList.remove('hidden');
    toast.style.display = 'flex';
    void toast.offsetWidth;
    toast.classList.add('visible');
    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('visible');
      setTimeout(() => {
        toast.classList.add('hidden');
        toast.style.display = 'none';
      }, 400);
    }, 2600);
  }
  function tryUnlock(id) {
    if (Progress.unlockAchievement(id)) {
      const ach = CONFIG.ACHIEVEMENTS.find(a => a.id === id);
      if (ach) {
        showToast(ach.icon, ach.name);
        playBonus();
      }
    }
  }
  function checkAchievementsAfterShelf() {
    if (Progress.data.shelf >= 1) tryUnlock('first_shelf');
    if (Progress.data.shelf >= 5) tryUnlock('shelf_5');
    if (Progress.data.score >= 1000) tryUnlock('score_1000');
  }
  function checkAchievementsAfterThreads() {
    if (Progress.data.threads >= 1) tryUnlock('first_thread');
    if (Progress.data.threads >= 5) tryUnlock('thread_5');
    if (Progress.data.score >= 1000) tryUnlock('score_1000');
  }
  function checkAchievementsAfterDaily() {
    tryUnlock('daily_first');
    const s = Progress.data.daily.streak;
    if (s >= 3) tryUnlock('daily_3');
    if (s >= 7) tryUnlock('daily_7');
  }
  function renderAchievements() {
    achList.innerHTML = '';
    for (const a of CONFIG.ACHIEVEMENTS) {
      const unlocked = Progress.hasAchievement(a.id);
      const li = document.createElement('li');
      if (!unlocked) li.classList.add('locked');
      li.innerHTML = `<span class="ach-badge">${unlocked ? a.icon : '🔒'}</span>
                      <span class="ach-label">${a.name}<br><small style="opacity:0.7">${a.desc}</small></span>`;
      achList.appendChild(li);
    }
  }
  function renderDailyPanel() {
    dailyStreakCount.textContent = String(Progress.data.daily.streak);
    dailyList.innerHTML = '';
    const history = Progress.data.daily.history.slice(-7).reverse();
    if (history.length === 0) {
      const li = document.createElement('li');
      li.className = 'daily-item-empty';
      li.textContent = 'Nenhum desafio registrado ainda.';
      dailyList.appendChild(li);
      return;
    }
    for (const entry of history) {
      const li = document.createElement('li');
      const icon = entry.mechanic === 'threads' ? '〜' : '▤';
      const [y, m, d] = entry.date.split('-');
      const dateLabel = `${d}/${m}`;
      const scoreLabel = entry.completed ? `${entry.bestScore} pts` : '—';
      li.innerHTML = `<span class="daily-item-date">${dateLabel}</span>
                      <span class="daily-item-mechanic">${icon}</span>
                      <span class="daily-item-score">${scoreLabel}</span>`;
      dailyList.appendChild(li);
    }
  }
  function openHelpGeneral() {
    helpPanel.classList.remove('hidden');
    helpPanel.style.display = 'flex';
  }
  function closeHelpGeneral() {
    helpPanel.classList.add('hidden');
    helpPanel.style.display = 'none';
  }
  function openHelpShelf() {
    helpShelfPanel.classList.remove('hidden');
    helpShelfPanel.style.display = 'flex';
  }
  function closeHelpShelf() {
    helpShelfPanel.classList.add('hidden');
    helpShelfPanel.style.display = 'none';
  }
  function openHelpThreads() {
    helpThreadsPanel.classList.remove('hidden');
    helpThreadsPanel.style.display = 'flex';
  }
  function closeHelpThreads() {
    helpThreadsPanel.classList.add('hidden');
    helpThreadsPanel.style.display = 'none';
  }
  function openAchievements() {
    renderAchievements();
    achPanel.classList.remove('hidden');
    achPanel.style.display = 'flex';
  }
  function closeAchievements() {
    achPanel.classList.add('hidden');
    achPanel.style.display = 'none';
  }
  function openDailyPanel() {
    renderDailyPanel();
    dailyPanel.classList.remove('hidden');
    dailyPanel.style.display = 'flex';
  }
  function closeDailyPanel() {
    dailyPanel.classList.add('hidden');
    dailyPanel.style.display = 'none';
  }
  function openContextHelp() {
    if (currentScene === 'shelf') openHelpShelf();
    else if (currentScene === 'threads') openHelpThreads();
    else openHelpGeneral();
  }
  function closeAllHelps() {
    closeHelpGeneral();
    closeHelpShelf();
    closeHelpThreads();
  }

  /* ============================================================
     ÁUDIO
     ============================================================ */
  let audioCtx = null;
  function ensureAudio() {
    if (Progress.data.muted) return null;
    if (!audioCtx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      audioCtx = new AC();
    }
    if (audioCtx.state === 'suspended') audioCtx.resume();
    return audioCtx;
  }

  function _tone(freq, duration, volume, type, startTime) {
    const c = ensureAudio(); if (!c) return;
    const t = startTime !== undefined ? startTime : c.currentTime;
    const d = duration || 0.12;
    const v = volume || 0.20;
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = type || 'sine';
    osc.frequency.setValueAtTime(freq, t);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(v, t + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, t + d);
    osc.connect(g); g.connect(c.destination);
    osc.start(t); osc.stop(t + d + 0.02);
  }
  function playSound(freq, duration) { _tone(freq, duration || 0.12, 0.25, 'sine'); }
  function playSnapByFamily(family) {
    if (family === 'big') _tone(600, 0.14, 0.28, 'sine');
    else if (family === 'small') _tone(1000, 0.10, 0.22, 'sine');
    else _tone(800, 0.12, 0.25, 'sine');
  }
  function playSlide() {
    const c = ensureAudio(); if (!c) return;
    const t = c.currentTime;
    const osc = c.createOscillator(); const g = c.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(300, t);
    osc.frequency.exponentialRampToValueAtTime(900, t + 0.25);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.15, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.3);
    osc.connect(g); g.connect(c.destination);
    osc.start(t); osc.stop(t + 0.32);
  }
  function playComplete() {
    const c = ensureAudio(); if (!c) return;
    const notes = [523.25, 659.25, 783.99];
    notes.forEach((f, i) => _tone(f, 0.18, 0.18, 'sine', c.currentTime + i * 0.1));
  }
  function playBonus() {
    const c = ensureAudio(); if (!c) return;
    const notes = [880, 1108.73, 1318.51];
    notes.forEach((f, i) => _tone(f, 0.15, 0.20, 'sine', c.currentTime + i * 0.06));
  }
  function playThreadClean() {
    const c = ensureAudio(); if (!c) return;
    const notes = [659.25, 987.77];
    notes.forEach((f, i) => _tone(f, 0.14, 0.22, 'sine', c.currentTime + i * 0.07));
  }
  function playGiftSound() {
    const c = ensureAudio(); if (!c) return;
    const now = c.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((f, i) => _tone(f, 0.16, 0.20, 'sine', now + i * 0.07));
  }
  function playElectricSound() {
    const c = ensureAudio(); if (!c) return;
    const now = c.currentTime;
    const osc = c.createOscillator(); const g = c.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(200, now);
    osc.frequency.exponentialRampToValueAtTime(1400, now + 0.08);
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.18);
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(0.14, now + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.20);
    osc.connect(g); g.connect(c.destination);
    osc.start(now); osc.stop(now + 0.22);
    _tone(1760, 0.10, 0.10, 'sine', now + 0.02);
  }

  /* AmbientPlayer */
  class AmbientPlayer {
    constructor() {
      this.audio = null;
      this.playing = false;
      this.pending = false;
      this._fadeRaf = null;
    }
    _ensureAudioEl() {
      if (this.audio) return;
      try {
        this.audio = new Audio(CONFIG.AMBIENT.SRC);
        this.audio.loop = true;
        this.audio.preload = 'auto';
        this.audio.volume = 0;
      } catch (e) { this.audio = null; }
    }
    start() {
      if (this.playing) return;
      this._ensureAudioEl();
      if (!this.audio) return;
      this.pending = true;
      const p = this.audio.play();
      if (p && typeof p.then === 'function') {
        p.then(() => {
          this.playing = true;
          this.pending = false;
          this._fadeTo(CONFIG.AMBIENT.VOLUME, CONFIG.AMBIENT.FADE_IN_MS);
        }).catch((err) => {
          this.playing = false;
          console.log('[Ambient] play bloqueado:', err && err.name);
        });
      } else {
        this.playing = true;
        this.pending = false;
        this._fadeTo(CONFIG.AMBIENT.VOLUME, CONFIG.AMBIENT.FADE_IN_MS);
      }
    }
    stop() {
      if (!this.audio || !this.playing) { this.pending = false; return; }
      this._fadeTo(0, CONFIG.AMBIENT.FADE_OUT_MS, () => {
        try { this.audio.pause(); } catch (e) {}
        this.playing = false;
      });
    }
    _fadeTo(target, durationMs, onDone) {
      if (!this.audio) return;
      if (this._fadeRaf) cancelAnimationFrame(this._fadeRaf);
      const startVol = this.audio.volume;
      const startTime = performance.now();
      const step = (now) => {
        const t = Math.min(1, (now - startTime) / durationMs);
        const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        const v = startVol + (target - startVol) * eased;
        try { this.audio.volume = Math.max(0, Math.min(1, v)); } catch (e) {}
        if (t < 1) this._fadeRaf = requestAnimationFrame(step);
        else { this._fadeRaf = null; if (onDone) onDone(); }
      };
      this._fadeRaf = requestAnimationFrame(step);
    }
    refresh(inGame) {
      const shouldPlay = inGame && Progress.data.ambient && !Progress.data.muted;
      if (shouldPlay) this.start();
      else this.stop();
    }
    retryIfPending() {
      if (this.pending && !this.playing && this.audio) {
        this.audio.play().then(() => {
          this.playing = true;
          this.pending = false;
          this._fadeTo(CONFIG.AMBIENT.VOLUME, CONFIG.AMBIENT.FADE_IN_MS);
        }).catch(() => {});
      }
    }
  }
  const ambient = new AmbientPlayer();

  function dist(x1, y1, x2, y2) { return Math.hypot(x2 - x1, y2 - y1); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function cubicBezier(p0, p1, p2, p3, t) {
    const mt = 1 - t, mt2 = mt * mt, mt3 = mt2 * mt;
    const t2 = t * t, t3 = t2 * t;
    return {
      x: mt3 * p0.x + 3 * mt2 * t * p1.x + 3 * mt * t2 * p2.x + t3 * p3.x,
      y: mt3 * p0.y + 3 * mt2 * t * p1.y + 3 * mt * t2 * p2.y + t3 * p3.y,
    };
  }
  function segmentsIntersect(ax, ay, bx, by, cx, cy, dx, dy) {
    const d1 = cross(cx, cy, dx, dy, ax, ay);
    const d2 = cross(cx, cy, dx, dy, bx, by);
    const d3 = cross(ax, ay, bx, by, cx, cy);
    const d4 = cross(ax, ay, bx, by, dx, dy);
    if (((d1 > 0 && d2 < 0) || (d1 < 0 && d2 > 0)) && ((d3 > 0 && d4 < 0) || (d3 < 0 && d4 > 0))) return true;
    if (d1 === 0 && onSegment(cx, cy, dx, dy, ax, ay)) return true;
    if (d2 === 0 && onSegment(cx, cy, dx, dy, bx, by)) return true;
    if (d3 === 0 && onSegment(ax, ay, bx, by, cx, cy)) return true;
    if (d4 === 0 && onSegment(ax, ay, bx, by, dx, dy)) return true;
    return false;
  }
  function cross(ax, ay, bx, by, cx, cy) { return (bx - ax) * (cy - ay) - (by - ay) * (cx - ax); }
  function onSegment(ax, ay, bx, by, px, py) {
    return (Math.min(ax, bx) <= px && px <= Math.max(ax, bx) && Math.min(ay, by) <= py && py <= Math.max(ay, by));
  }
  function roundRect(x, y, w, h, r) {
    const rad = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + rad, y);
    ctx.lineTo(x + w - rad, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + rad);
    ctx.lineTo(x + w, y + h - rad);
    ctx.quadraticCurveTo(x + w, y + h, x + w - rad, y + h);
    ctx.lineTo(x + rad, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - rad);
    ctx.lineTo(x, y + rad);
    ctx.quadraticCurveTo(x, y, x + rad, y);
    ctx.closePath();
  }
  function hexToRgb(hex) {
    const n = parseInt(hex.slice(1), 16);
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
  }
  function hexToRgba(hex, alpha) {
    const { r, g, b } = hexToRgb(hex);
    return `rgba(${r},${g},${b},${alpha})`;
  }
  function drawCelebrationWave(progress) {
    if (progress <= 0 || progress >= 1) return;
    const waveWidth = W * 0.4;
    const centerX = -waveWidth + (W + 2 * waveWidth) * progress;
    const grad = ctx.createLinearGradient(centerX - waveWidth, 0, centerX + waveWidth, 0);
    const alpha = Math.sin(progress * Math.PI);
    grad.addColorStop(0, 'rgba(255, 183, 77, 0)');
    grad.addColorStop(0.5, `rgba(255, 183, 77, ${0.45 * alpha})`);
    grad.addColorStop(1, 'rgba(255, 183, 77, 0)');
    ctx.save();
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);
    ctx.restore();
  }

  let statusTimeout = null;
  function setStatus(text, isWin) {
    if (statusTimeout) clearTimeout(statusTimeout);
    statusEl.classList.add('changing');
    statusTimeout = setTimeout(() => {
      statusEl.textContent = text;
      statusEl.classList.toggle('win', !!isWin);
      statusEl.classList.remove('changing');
    }, 200);
  }

  /* ============================================================
     COMPARTILHAR — card 600×315
     ============================================================ */
  function generateShareCard(mechanicOverride) {
    const W_CARD = 600;
    const H_CARD = 315;
    const c = document.createElement('canvas');
    c.width = W_CARD;
    c.height = H_CARD;
    const g = c.getContext('2d');

    g.fillStyle = '#FFF5E6';
    g.fillRect(0, 0, W_CARD, H_CARD);

    g.strokeStyle = 'rgba(210, 105, 30, 0.35)';
    g.lineWidth = 3;
    g.strokeRect(12, 12, W_CARD - 24, H_CARD - 24);

    g.fillStyle = '#5C2E0E';
    g.font = '300 42px system-ui, -apple-system, "Segoe UI", sans-serif';
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.fillText('Desenrola', W_CARD / 2, 70);

    g.strokeStyle = 'rgba(62, 124, 177, 0.4)';
    g.lineWidth = 2;
    g.beginPath();
    g.moveTo(W_CARD / 2 - 60, 100);
    g.lineTo(W_CARD / 2 + 60, 100);
    g.stroke();

    // Determina o conteúdo
    let mainLabel = '';
    let mainValue = '';
    let subLabel = '';
    let mechanicIcon = '🌿';
    let mechanicName = 'Zen';

    if (mechanicOverride === 'daily') {
      const streak = Progress.data.daily.streak;
      mainLabel = 'DESAFIO DO DIA';
      mainValue = `${Progress.data.daily.today.bestScore}`;
      subLabel = 'pontos' + (streak > 0 ? ` · 🔥 ${streak} dias` : '');
      const mech = dailyMechanicForDate(todayKey());
      mechanicIcon = mech === 'threads' ? '〜' : '▤';
      mechanicName = mech === 'threads' ? 'Fios' : 'Prateleira';
    } else {
      const level = Progress.data.shelf + 1;
      mainLabel = 'NÍVEL';
      mainValue = String(level);
      subLabel = `${Progress.data.score} pontos`;
      if (currentScene === 'shelf') { mechanicIcon = '▤'; mechanicName = 'Prateleira'; }
      else if (currentScene === 'threads') { mechanicIcon = '〜'; mechanicName = 'Fios'; }
    }

    g.fillStyle = '#A0522D';
    g.font = '400 20px system-ui, -apple-system, "Segoe UI", sans-serif';
    g.fillText(mainLabel, W_CARD / 2, 140);

    g.fillStyle = '#3E7CB1';
    g.font = '300 72px system-ui, -apple-system, "Segoe UI", sans-serif';
    g.fillText(mainValue, W_CARD / 2, 190);

    g.fillStyle = '#5C2E0E';
    g.font = '400 26px system-ui, -apple-system, "Segoe UI", sans-serif';
    g.fillText(subLabel, W_CARD / 2, 240);

    g.fillStyle = '#3E7CB1';
    g.font = '500 20px system-ui, -apple-system, "Segoe UI", sans-serif';
    g.fillText(`${mechanicIcon}  ${mechanicName}`, W_CARD / 2, 280);

    return c;
  }

  function canvasToBlob(c) {
    return new Promise((resolve) => {
      if (c.toBlob) c.toBlob((blob) => resolve(blob), 'image/png');
      else resolve(null);
    });
  }

  async function shareScore() {
    const card = generateShareCard('normal');
    const text = `Completei o nível ${Progress.data.shelf + 1} do Desenrola com ${Progress.data.score} pontos! 🌿\nJogue em: ${CONFIG.SHARE_URL}`;

    if (navigator.share && navigator.canShare) {
      try {
        const blob = await canvasToBlob(card);
        if (blob) {
          const file = new File([blob], 'desenrola.png', { type: 'image/png' });
          if (navigator.canShare({ files: [file] })) {
            await navigator.share({ title: 'Desenrola', text, files: [file] });
            return;
          }
        }
        await navigator.share({ title: 'Desenrola', text });
        return;
      } catch (e) {
        if (e && e.name === 'AbortError') return;
      }
    }

    try {
      const url = card.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = url;
      a.download = `desenrola-nivel-${Progress.data.shelf + 1}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setStatus('Imagem salva para compartilhar 📤', false);
    } catch (e) {
      setStatus('Não foi possível gerar a imagem', false);
    }
  }

  async function shareDailyScore() {
    const card = generateShareCard('daily');
    const streak = Progress.data.daily.streak;
    const score = Progress.data.daily.today.bestScore;
    const streakText = streak > 0 ? ` · 🔥 ${streak} dias seguidos` : '';
    const text = `Fiz ${score} pontos no Desafio do Dia do Desenrola!${streakText} 🌿\nJogue em: ${CONFIG.SHARE_URL}`;

    if (navigator.share && navigator.canShare) {
      try {
        const blob = await canvasToBlob(card);
        if (blob) {
          const file = new File([blob], 'desenrola-desafio.png', { type: 'image/png' });
          if (navigator.canShare({ files: [file] })) {
            await navigator.share({ title: 'Desafio do Desenrola', text, files: [file] });
            return;
          }
        }
        await navigator.share({ title: 'Desafio do Desenrola', text });
        return;
      } catch (e) {
        if (e && e.name === 'AbortError') return;
      }
    }

    try {
      const url = card.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = url;
      a.download = `desenrola-desafio-${todayKey()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setStatus('Imagem salva para compartilhar 📤', false);
    } catch (e) {
      setStatus('Não foi possível gerar a imagem', false);
    }
  }

  /* Desenhos dos objetos */
  function drawFrasco(w, h, fill, accent) {
    ctx.fillStyle = fill;
    ctx.beginPath();
    ctx.moveTo(-w * 0.4, -h * 0.1); ctx.lineTo(-w * 0.4, h * 0.5);
    ctx.lineTo(w * 0.4, h * 0.5); ctx.lineTo(w * 0.4, -h * 0.1);
    ctx.lineTo(w * 0.15, -h * 0.1); ctx.lineTo(w * 0.15, -h * 0.5);
    ctx.lineTo(-w * 0.15, -h * 0.5); ctx.lineTo(-w * 0.15, -h * 0.1);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = 'rgba(92, 46, 14, 0.45)'; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.fillStyle = accent; ctx.fillRect(-w * 0.3, h * 0.05, w * 0.6, h * 0.15);
  }
  function drawVaso(w, h, fill, accent) {
    ctx.fillStyle = fill;
    ctx.beginPath();
    ctx.moveTo(-w * 0.15, -h * 0.5); ctx.lineTo(w * 0.15, -h * 0.5);
    ctx.quadraticCurveTo(w * 0.15, -h * 0.2, w * 0.4, 0);
    ctx.quadraticCurveTo(w * 0.45, h * 0.3, w * 0.3, h * 0.5);
    ctx.lineTo(-w * 0.3, h * 0.5);
    ctx.quadraticCurveTo(-w * 0.45, h * 0.3, -w * 0.4, 0);
    ctx.quadraticCurveTo(-w * 0.15, -h * 0.2, -w * 0.15, -h * 0.5);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = 'rgba(92, 46, 14, 0.45)'; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.fillStyle = accent;
    ctx.beginPath(); ctx.ellipse(0, -h * 0.5, w * 0.15, h * 0.05, 0, 0, Math.PI * 2); ctx.fill();
  }
  function drawLivro(w, h, fill, accent) {
    ctx.fillStyle = fill; roundRect(-w * 0.4, -h * 0.45, w * 0.8, h * 0.9, 3); ctx.fill();
    ctx.strokeStyle = 'rgba(92, 46, 14, 0.45)'; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.fillStyle = accent; ctx.fillRect(-w * 0.4, -h * 0.45, w * 0.12, h * 0.9);
    ctx.strokeStyle = 'rgba(255,255,255,0.45)'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(-w * 0.15, -h * 0.3); ctx.lineTo(-w * 0.15, h * 0.3); ctx.stroke();
  }
  function drawQuadro(w, h, fill, accent) {
    ctx.fillStyle = fill; roundRect(-w * 0.4, -h * 0.4, w * 0.8, h * 0.8, 4); ctx.fill();
    ctx.strokeStyle = 'rgba(92, 46, 14, 0.45)'; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.strokeStyle = accent; ctx.lineWidth = 3;
    roundRect(-w * 0.28, -h * 0.28, w * 0.56, h * 0.56, 2); ctx.stroke();
    ctx.fillStyle = accent; ctx.beginPath(); ctx.arc(0, 0, w * 0.12, 0, Math.PI * 2); ctx.fill();
  }
  function drawXicara(w, h, fill, accent) {
    ctx.fillStyle = fill; roundRect(-w * 0.35, -h * 0.25, w * 0.7, h * 0.6, 6); ctx.fill();
    ctx.strokeStyle = 'rgba(92, 46, 14, 0.45)'; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.strokeStyle = fill; ctx.lineWidth = Math.max(3, w * 0.08);
    ctx.beginPath(); ctx.arc(w * 0.38, h * 0.05, w * 0.15, -Math.PI / 2, Math.PI / 2); ctx.stroke();
    ctx.strokeStyle = 'rgba(92, 46, 14, 0.45)'; ctx.stroke();
    ctx.fillStyle = accent;
    ctx.beginPath(); ctx.ellipse(0, -h * 0.25, w * 0.35, h * 0.06, 0, 0, Math.PI * 2); ctx.fill();
  }
  function drawPrato(w, h, fill, accent) {
    ctx.fillStyle = fill;
    ctx.beginPath(); ctx.ellipse(0, 0, w * 0.42, h * 0.25, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = 'rgba(92, 46, 14, 0.45)'; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.strokeStyle = accent; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.ellipse(0, 0, w * 0.3, h * 0.16, 0, 0, Math.PI * 2); ctx.stroke();
  }
  function drawGarrafa(w, h, fill, accent) {
    ctx.fillStyle = fill;
    ctx.beginPath();
    ctx.moveTo(-w * 0.35, h * 0.5); ctx.lineTo(-w * 0.35, -h * 0.05);
    ctx.quadraticCurveTo(-w * 0.35, -h * 0.35, -w * 0.12, -h * 0.4);
    ctx.lineTo(-w * 0.12, -h * 0.5); ctx.lineTo(w * 0.12, -h * 0.5);
    ctx.lineTo(w * 0.12, -h * 0.4);
    ctx.quadraticCurveTo(w * 0.35, -h * 0.35, w * 0.35, -h * 0.05);
    ctx.lineTo(w * 0.35, h * 0.5); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = 'rgba(92, 46, 14, 0.45)'; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.fillStyle = accent; ctx.fillRect(-w * 0.3, h * 0.1, w * 0.6, h * 0.2);
    ctx.fillRect(-w * 0.1, -h * 0.55, w * 0.2, h * 0.08);
  }
  function drawLata(w, h, fill, accent) {
    ctx.fillStyle = fill; roundRect(-w * 0.35, -h * 0.35, w * 0.7, h * 0.75, 6); ctx.fill();
    ctx.strokeStyle = 'rgba(92, 46, 14, 0.45)'; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.fillStyle = accent;
    ctx.beginPath(); ctx.ellipse(0, -h * 0.35, w * 0.35, h * 0.08, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillRect(-w * 0.35, 0, w * 0.7, h * 0.08);
    ctx.strokeStyle = accent; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.ellipse(0, -h * 0.42, w * 0.1, h * 0.03, 0, 0, Math.PI * 2); ctx.stroke();
  }
  function drawCaixa(w, h, fill, accent) {
    ctx.fillStyle = fill; roundRect(-w * 0.4, -h * 0.2, w * 0.8, h * 0.65, 4); ctx.fill();
    ctx.strokeStyle = 'rgba(92, 46, 14, 0.45)'; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.fillStyle = accent; roundRect(-w * 0.45, -h * 0.38, w * 0.9, h * 0.22, 3); ctx.fill();
    ctx.strokeStyle = accent; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(0, -h * 0.16); ctx.lineTo(0, h * 0.45); ctx.stroke();
  }
  function drawRolo(w, h, fill, accent) {
    ctx.fillStyle = fill; roundRect(-w * 0.5, -h * 0.2, w * 1.0, h * 0.4, h * 0.2); ctx.fill();
    ctx.strokeStyle = 'rgba(92, 46, 14, 0.45)'; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.fillStyle = accent;
    ctx.beginPath(); ctx.ellipse(-w * 0.5, 0, w * 0.08, h * 0.2, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(w * 0.5, 0, w * 0.08, h * 0.2, 0, 0, Math.PI * 2); ctx.fill();
  }
  function drawCesta(w, h, fill, accent) {
    ctx.fillStyle = fill;
    ctx.beginPath();
    ctx.moveTo(-w * 0.4, 0);
    ctx.quadraticCurveTo(-w * 0.4, h * 0.5, 0, h * 0.5);
    ctx.quadraticCurveTo(w * 0.4, h * 0.5, w * 0.4, 0);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = 'rgba(92, 46, 14, 0.45)'; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.strokeStyle = accent; ctx.lineWidth = Math.max(3, w * 0.06);
    ctx.beginPath(); ctx.arc(0, 0, w * 0.28, Math.PI, 0); ctx.stroke();
    ctx.lineWidth = 1.5;
    for (let i = -2; i <= 2; i++) {
      ctx.beginPath(); ctx.moveTo(i * w * 0.1, h * 0.05); ctx.lineTo(i * w * 0.12, h * 0.45); ctx.stroke();
    }
  }
  function drawPote(w, h, fill, accent) {
    ctx.fillStyle = fill;
    ctx.beginPath(); ctx.ellipse(0, h * 0.05, w * 0.38, h * 0.4, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = 'rgba(92, 46, 14, 0.45)'; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.fillStyle = accent; roundRect(-w * 0.32, -h * 0.45, w * 0.64, h * 0.15, 4); ctx.fill();
    ctx.beginPath(); ctx.ellipse(0, -h * 0.45, w * 0.1, h * 0.04, 0, 0, Math.PI * 2); ctx.fill();
  }
  function drawCilindro(w, h, fill, accent) {
    ctx.fillStyle = fill; roundRect(-w * 0.3, -h * 0.4, w * 0.6, h * 0.85, 2); ctx.fill();
    ctx.strokeStyle = 'rgba(92, 46, 14, 0.45)'; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.fillStyle = accent;
    ctx.beginPath(); ctx.ellipse(0, -h * 0.4, w * 0.3, h * 0.08, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(0, h * 0.45, w * 0.3, h * 0.08, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = accent; ctx.lineWidth = 2;
    for (let i = -1; i <= 1; i++) {
      const y = i * h * 0.15;
      ctx.beginPath(); ctx.moveTo(-w * 0.3, y); ctx.lineTo(w * 0.3, y); ctx.stroke();
    }
  }
  function drawCristal(w, h, fill, accent) {
    ctx.fillStyle = fill;
    ctx.beginPath();
    ctx.moveTo(0, -h * 0.5); ctx.lineTo(w * 0.35, -h * 0.1);
    ctx.lineTo(w * 0.25, h * 0.5); ctx.lineTo(-w * 0.25, h * 0.5);
    ctx.lineTo(-w * 0.35, -h * 0.1); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = 'rgba(92, 46, 14, 0.45)'; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.45)';
    ctx.beginPath(); ctx.moveTo(0, -h * 0.5); ctx.lineTo(w * 0.35, -h * 0.1); ctx.lineTo(0, 0); ctx.closePath(); ctx.fill();
  }
  function drawAmpulheta(w, h, fill, accent) {
    ctx.fillStyle = fill;
    ctx.beginPath(); ctx.moveTo(-w * 0.4, -h * 0.5); ctx.lineTo(w * 0.4, -h * 0.5); ctx.lineTo(0, 0); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(-w * 0.4, h * 0.5); ctx.lineTo(w * 0.4, h * 0.5); ctx.lineTo(0, 0); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = 'rgba(92, 46, 14, 0.45)'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(-w * 0.4, -h * 0.5); ctx.lineTo(w * 0.4, -h * 0.5); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-w * 0.4, h * 0.5); ctx.lineTo(w * 0.4, h * 0.5); ctx.stroke();
    ctx.fillStyle = accent;
    ctx.beginPath(); ctx.moveTo(-w * 0.25, h * 0.4); ctx.lineTo(w * 0.25, h * 0.4); ctx.lineTo(0, h * 0.1); ctx.closePath(); ctx.fill();
  }
  function drawEstrela(w, h, fill, accent) {
    const outerR = Math.min(w, h) * 0.45;
    const innerR = outerR * 0.45;
    ctx.fillStyle = fill;
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const r = i % 2 === 0 ? outerR : innerR;
      const a = -Math.PI / 2 + (i * Math.PI) / 5;
      const x = Math.cos(a) * r, y = Math.sin(a) * r;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = 'rgba(92, 46, 14, 0.55)'; ctx.lineWidth = 1.5; ctx.stroke();
  }
  function drawPresente(w, h, fill, accent) {
    ctx.fillStyle = fill; roundRect(-w * 0.4, -h * 0.3, w * 0.8, h * 0.65, 4); ctx.fill();
    ctx.strokeStyle = 'rgba(92, 46, 14, 0.45)'; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.fillStyle = accent; roundRect(-w * 0.45, -h * 0.4, w * 0.9, h * 0.18, 3); ctx.fill();
    ctx.fillStyle = accent; ctx.fillRect(-w * 0.05, -h * 0.4, w * 0.1, h * 0.75);
    ctx.strokeStyle = accent; ctx.lineWidth = Math.max(3, w * 0.06);
    ctx.beginPath(); ctx.arc(-w * 0.15, -h * 0.45, w * 0.12, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(w * 0.15, -h * 0.45, w * 0.12, 0, Math.PI * 2); ctx.stroke();
  }

  function drawObjectShape(type, w, h, palette) {
    const fill = palette.color;
    const accent = palette.accent;
    switch (type) {
      case 'frasco':   return drawFrasco(w, h, fill, accent);
      case 'vaso':     return drawVaso(w, h, fill, accent);
      case 'livro':    return drawLivro(w, h, fill, accent);
      case 'quadro':   return drawQuadro(w, h, fill, accent);
      case 'xicara':   return drawXicara(w, h, fill, accent);
      case 'prato':    return drawPrato(w, h, fill, accent);
      case 'garrafa':  return drawGarrafa(w, h, fill, accent);
      case 'lata':     return drawLata(w, h, fill, accent);
      case 'caixa':    return drawCaixa(w, h, fill, accent);
      case 'rolo':     return drawRolo(w, h, fill, accent);
      case 'cesta':    return drawCesta(w, h, fill, accent);
      case 'pote':     return drawPote(w, h, fill, accent);
      case 'cilindro': return drawCilindro(w, h, fill, accent);
      case 'cristal':  return drawCristal(w, h, fill, accent);
      case 'ampulheta':return drawAmpulheta(w, h, fill, accent);
      case 'estrela':  return drawEstrela(w, h, fill, accent);
      case 'presente': return drawPresente(w, h, fill, accent);
    }
  }

  /* ============================================================
     VARIÁVEIS GLOBAIS DE ESTADO
     ============================================================ */
  let zenMode = false;
  let dailyMode = false;
  let dailyMechanic = null;   // 'shelf' | 'threads' quando em modo daily
  let dailySeedRng = null;    // PRNG determinístico ativo (ou null)
  let dailyAttemptScore = 0;  // pontos ganhos na tentativa atual

  function getShelfParams() {
    if (dailyMode) {
      // Nível fixo 5 para todos, mas com seed determinístico
      const base = CONFIG.SHELF_LEVELS[CONFIG.DAILY_SHELF_LEVEL_IDX];
      const slotsPerShelf = base.pairs * 2 + 1;
      const totalPairs = base.pairs * base.shelves;
      const timeLimit = 30 + totalPairs * 8;
      return { level: 5, zen: false, daily: true, shelves: base.shelves, pairs: base.pairs, slotsPerShelf, starChance: base.starChance, giftChance: base.giftChance, timeLimit };
    }
    if (zenMode) {
      const base = CONFIG.ZEN_SHELF;
      const slotsPerShelf = base.pairs * 2 + 1;
      return { level: 0, zen: true, shelves: base.shelves, pairs: base.pairs, slotsPerShelf, starChance: base.starChance, giftChance: base.giftChance, timeLimit: 9999 };
    }
    const idx = Math.min(Progress.data.shelf, CONFIG.SHELF_LEVELS.length - 1);
    const base = CONFIG.SHELF_LEVELS[idx];
    const slotsPerShelf = base.pairs * 2 + 1;
    const totalPairs = base.pairs * base.shelves;
    const timeLimit = 30 + totalPairs * 8;
    return { level: idx + 1, zen: false, shelves: base.shelves, pairs: base.pairs, slotsPerShelf, starChance: base.starChance, giftChance: base.giftChance, timeLimit };
  }
  function getThreadsParams() {
    if (dailyMode) {
      const base = CONFIG.THREAD_LEVELS[CONFIG.DAILY_THREADS_LEVEL_IDX];
      const timeLimit = 40 + base.threads * 15;
      return { level: 5, zen: false, daily: true, threadCount: base.threads, nodesPerThread: base.nodes, timeLimit };
    }
    if (zenMode) {
      const base = CONFIG.ZEN_THREADS;
      return { level: 0, zen: true, threadCount: base.threads, nodesPerThread: base.nodes, timeLimit: 9999 };
    }
    const idx = Math.min(Progress.data.threads, CONFIG.THREAD_LEVELS.length - 1);
    const base = CONFIG.THREAD_LEVELS[idx];
    const timeLimit = 40 + base.threads * 15;
    return { level: idx + 1, zen: false, threadCount: base.threads, nodesPerThread: base.nodes, timeLimit };
  }

  let W = 0, H = 0;
  let currentScene = null;
  let lastTime = 0;

  /** Helpers para usar o PRNG determinístico quando em modo daily. */
  function rng() {
    return dailySeedRng ? dailySeedRng() : Math.random();
  }

  /* CENA: PRATELEIRA */
  const ShelfScene = {
    shelves: [], items: [], dragging: null, returning: [],
    complete: false, celebrationTimer: 0,
    params: null, _nextId: 1,
    timeLeft: 0, scoreThisPhase: 0, pairsFormed: 0, totalPairs: 0,
    _prevPairs: new Set(), _scoredPairs: new Set(),
    _statNormal: 0, _statStar: 0, _statGift: 0, _timeBonus: 0,
    _pulseTime: 0, _zen: false, _daily: false,

    reset() {
      this.params = getShelfParams();
      this._zen = !!this.params.zen;
      this._daily = !!this.params.daily;
      this.shelves = [];
      this.items = [];
      this.dragging = null;
      this.returning = [];
      this.complete = false;
      this.celebrationTimer = 0;
      this._nextId = 1;
      this._pulseTime = 0;
      this.timeLeft = this.params.timeLimit;
      this.scoreThisPhase = 0;
      this.pairsFormed = 0;
      this.totalPairs = this.params.shelves * this.params.pairs;
      this._prevPairs = new Set();
      this._scoredPairs = new Set();
      this._statNormal = 0; this._statStar = 0; this._statGift = 0;
      this._timeBonus = 0;

      const numShelves = this.params.shelves;
      const pairsPerShelf = this.params.pairs;
      const slotsPerShelf = this.params.slotsPerShelf;
      const topMargin = H * 0.26;
      const bottomMargin = H * 0.16;
      const usableH = H - topMargin - bottomMargin;
      const shelfWidth = W * 0.88;
      const shelfLeft = (W - shelfWidth) / 2;
      const shelfHeight = Math.max(8, H * 0.020);
      const spacing = numShelves > 1 ? usableH / (numShelves - 1) : 0;

      for (let s = 0; s < numShelves; s++) {
        this.shelves.push({
          left: shelfLeft, width: shelfWidth,
          y: topMargin + spacing * s, height: shelfHeight,
          slots: new Array(slotsPerShelf).fill(null),
        });
      }

      const totalPairs = numShelves * pairsPerShelf;
      const pool = CONFIG.OBJECT_TYPES.slice();
      for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
      }
      const pairList = [];
      for (let p = 0; p < totalPairs; p++) {
        pairList.push({ pairId: p, type: pool[p % pool.length].id, palette: pool[p % pool.length].palette, kind: 'normal' });
      }

      const wantStar = rng() < this.params.starChance;
      const wantGift = rng() < this.params.giftChance;
      if (wantStar || wantGift) {
        const idxs = pairList.map((_, i) => i);
        for (let i = idxs.length - 1; i > 0; i--) {
          const j = Math.floor(rng() * (i + 1));
          [idxs[i], idxs[j]] = [idxs[j], idxs[i]];
        }
        let cursor = 0;
        if (wantGift && cursor < idxs.length) {
          const idx = idxs[cursor++];
          pairList[idx].kind = 'presente';
          pairList[idx].type = 'presente';
          pairList[idx].palette = CONFIG.GIFT_PALETTE;
        }
        if (wantStar && cursor < idxs.length) {
          const idx = idxs[cursor++];
          pairList[idx].kind = 'estrela';
          pairList[idx].type = 'estrela';
          pairList[idx].palette = CONFIG.STAR_PALETTE;
        }
      }

      const allItems = [];
      for (const p of pairList) {
        for (let k = 0; k < 2; k++) {
          allItems.push({ id: this._nextId++, type: p.type, palette: p.palette, pairId: p.pairId, kind: p.kind });
        }
      }
      for (let i = allItems.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        [allItems[i], allItems[j]] = [allItems[j], allItems[i]];
      }

      const emptyPerShelf = new Set();
      for (let s = 0; s < numShelves; s++) {
        const slotToEmpty = Math.floor(rng() * slotsPerShelf);
        emptyPerShelf.add(`${s}:${slotToEmpty}`);
      }
      const fillable = [];
      for (let s = 0; s < numShelves; s++) {
        for (let k = 0; k < slotsPerShelf; k++) {
          if (!emptyPerShelf.has(`${s}:${k}`)) fillable.push({ shelf: s, slot: k });
        }
      }
      for (let i = fillable.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        [fillable[i], fillable[j]] = [fillable[j], fillable[i]];
      }
      const numToPlace = Math.min(allItems.length, fillable.length);
      for (let i = 0; i < numToPlace; i++) {
        const item = allItems[i];
        const { shelf, slot } = fillable[i];
        item.scale = 1; item.flash = 0;
        this._placeInSlot(item, shelf, slot);
        this.items.push(item);
      }
      if (this._isComplete()) {
        const a = this.items[Math.floor(rng() * this.items.length)];
        let b = this.items[Math.floor(rng() * this.items.length)];
        let tries = 0;
        while ((b === a || b.shelfIndex === a.shelfIndex) && tries < 30) {
          b = this.items[Math.floor(rng() * this.items.length)];
          tries++;
        }
        this._swapItems(a, b);
      }
      this._prevPairs = this._currentPairKeys();
      this._scoredPairs = new Set();
    },
    _swapItems(a, b) {
      const aShelf = a.shelfIndex, aSlot = a.slotIndex;
      const bShelf = b.shelfIndex, bSlot = b.slotIndex;
      this.shelves[aShelf].slots[aSlot] = null;
      this.shelves[bShelf].slots[bSlot] = null;
      this._placeInSlot(a, bShelf, bSlot);
      this._placeInSlot(b, aShelf, aSlot);
    },
    _slotRect(shelfIndex, slotIndex) {
      const shelf = this.shelves[shelfIndex];
      const N = this.params.slotsPerShelf;
      const slotW = shelf.width / N;
      const cx = shelf.left + slotW * (slotIndex + 0.5);
      const shelfCount = this.params.shelves;
      const objectH = Math.min(H * 0.18, (H / shelfCount) * 0.55);
      const objectW = slotW * 0.62;
      const cy = shelf.y - objectH * 0.5 - 4;
      return { cx, cy, w: objectW, h: objectH };
    },
    _shelfIndexAt(px, py) {
      for (let s = 0; s < this.shelves.length; s++) {
        const shelf = this.shelves[s];
        if (px < shelf.left || px > shelf.left + shelf.width) continue;
        const objectH = H * 0.22;
        const yTop = shelf.y - objectH;
        const yBottom = shelf.y + shelf.height + 8;
        if (py >= yTop && py <= yBottom) return s;
      }
      return -1;
    },
    _nearestSlotIndex(shelfIndex, x) {
      const shelf = this.shelves[shelfIndex];
      const N = this.params.slotsPerShelf;
      const slotW = shelf.width / N;
      const rel = (x - shelf.left) / slotW;
      return Math.min(N - 1, Math.max(0, Math.floor(rel)));
    },
    _nearestFreeSlot(shelfIndex, targetX) {
      const shelf = this.shelves[shelfIndex];
      const N = this.params.slotsPerShelf;
      const start = this._nearestSlotIndex(shelfIndex, targetX);
      if (shelf.slots[start] === null) return start;
      for (let d = 1; d < N; d++) {
        const left = start - d;
        const right = start + d;
        if (left >= 0 && shelf.slots[left] === null) return left;
        if (right < N && shelf.slots[right] === null) return right;
      }
      return -1;
    },
    hitItem(px, py) {
      for (let i = this.items.length - 1; i >= 0; i--) {
        const it = this.items[i];
        if (this.dragging && this.dragging.item === it) continue;
        const factor = { w: 0.9, h: 0.9 };
        const hw = (it.w * factor.w) / 2;
        const hh = (it.h * factor.h) / 2;
        if (Math.abs(px - it.x) <= hw && Math.abs(py - it.y) <= hh) return it;
      }
      return null;
    },
    _removeFromSlot(item) {
      for (let s = 0; s < this.shelves.length; s++) {
        const slots = this.shelves[s].slots;
        for (let i = 0; i < slots.length; i++) if (slots[i] === item) slots[i] = null;
      }
    },
    _placeInSlot(item, shelfIndex, slotIndex) {
      this._removeFromSlot(item);
      this.shelves[shelfIndex].slots[slotIndex] = item;
      item.shelfIndex = shelfIndex;
      item.slotIndex = slotIndex;
      const r = this._slotRect(shelfIndex, slotIndex);
      item.x = r.cx; item.y = r.cy; item.w = r.w; item.h = r.h;
    },
    onDown(pos) {
      if (this.complete || this.dragging) return;
      const item = this.hitItem(pos.x, pos.y);
      if (!item) return;
      const fromShelfIndex = item.shelfIndex;
      const fromSlotIndex = item.slotIndex;
      this._removeFromSlot(item);
      this.dragging = { item, offsetX: item.x - pos.x, offsetY: item.y - pos.y, fromShelfIndex, fromSlotIndex };
      const idx = this.items.indexOf(item);
      if (idx >= 0) { this.items.splice(idx, 1); this.items.push(item); }
      playSlide();
      if (navigator.vibrate) { try { navigator.vibrate(10); } catch (e) {} }
    },
    onMove(pos) {
      if (!this.dragging) return;
      const it = this.dragging.item;
      it.x = pos.x + this.dragging.offsetX;
      it.y = pos.y + this.dragging.offsetY;
    },
    onUp(pos) {
      if (!this.dragging) return;
      const it = this.dragging.item;
      const fromShelf = this.dragging.fromShelfIndex;
      const fromSlot = this.dragging.fromSlotIndex;
      this.dragging = null;
      const targetShelf = this._shelfIndexAt(it.x, it.y);
      if (targetShelf >= 0) {
        const freeSlot = this._nearestFreeSlot(targetShelf, it.x);
        if (freeSlot >= 0) {
          this._placeInSlot(it, targetShelf, freeSlot);
          playSound(700, 0.10);
          if (navigator.vibrate) { try { navigator.vibrate(15); } catch (e) {} }
          this._detectNewPairs();
          this._checkCompletion();
          return;
        }
      }
      const home = this._slotRect(fromShelf, fromSlot);
      this.returning.push({ item: it, fromX: it.x, fromY: it.y, toX: home.cx, toY: home.cy, t: 0, homeShelfIndex: fromShelf, homeSlotIndex: fromSlot });
      playSound(300, 0.15);
    },
    _currentPairKeys() {
      const keys = new Set();
      for (let s = 0; s < this.shelves.length; s++) {
        const shelf = this.shelves[s];
        const N = shelf.slots.length;
        let i = 0;
        while (i < N - 1) {
          const a = shelf.slots[i], b = shelf.slots[i + 1];
          if (a && b && a.pairId === b.pairId) { keys.add(`${s}:${a.pairId}`); i += 2; }
          else i++;
        }
      }
      return keys;
    },
    _detectNewPairs() {
      const current = this._currentPairKeys();
      const prev = this._prevPairs;
      for (const key of current) {
        if (!prev.has(key) && !this._scoredPairs.has(key)) {
          const pairId = Number(key.split(':')[1]);
          const kind = this._findPairKind(pairId);
          const family = this._findPairFamily(pairId);
          if (this._zen) {
            if (kind === 'presente') playGiftSound();
            else if (kind === 'estrela') playBonus();
            else playSnapByFamily(family);
          } else {
            if (kind === 'estrela') { this.scoreThisPhase += CONFIG.POINTS_STAR; this._statStar++; playBonus(); if (!this._daily) tryUnlock('star'); }
            else if (kind === 'presente') { this.scoreThisPhase += CONFIG.POINTS_GIFT; this._statGift++; playGiftSound(); if (!this._daily) tryUnlock('gift'); }
            else { this.scoreThisPhase += CONFIG.POINTS_NORMAL; this._statNormal++; playSnapByFamily(family); }
          }
          this.pairsFormed++;
          this._scoredPairs.add(key);
        }
      }
      this._prevPairs = current;
    },
    _findPairKind(pairId) {
      for (const it of this.items) if (it.pairId === pairId) return it.kind;
      return 'normal';
    },
    _findPairFamily(pairId) {
      for (const it of this.items) if (it.pairId === pairId) return CONFIG.OBJECT_FAMILY[it.type] || 'mid';
      return 'mid';
    },
    _isComplete() {
      const pairCount = new Map();
      for (const it of this.items) pairCount.set(it.pairId, (pairCount.get(it.pairId) || 0) + 1);
      for (const [, c] of pairCount) if (c !== 2) return false;
      const seen = new Set();
      for (const shelf of this.shelves) for (const slot of shelf.slots) {
        if (!slot) continue;
        if (seen.has(slot)) return false;
        seen.add(slot);
      }
      if (seen.size !== this.items.length) return false;
      for (let s = 0; s < this.shelves.length; s++) {
        const shelf = this.shelves[s];
        const paired = new Set();
        const N = shelf.slots.length;
        let i = 0;
        while (i < N - 1) {
          const a = shelf.slots[i], b = shelf.slots[i + 1];
          if (a && b && a.pairId === b.pairId) { paired.add(i); paired.add(i + 1); i += 2; }
          else i++;
        }
        for (let k = 0; k < N; k++) if (shelf.slots[k] && !paired.has(k)) return false;
      }
      return true;
    },
    _checkCompletion() {
      if (this.complete || !this._isComplete()) return;
      this.complete = true;
      this.celebrationTimer = CONFIG.CELEBRATION_DURATION;
      playComplete();
      if (navigator.vibrate) { try { navigator.vibrate(50); } catch (e) {} }
      if (this._zen) { setStatus('Zen concluído 🌿', true); return; }
      if (this._daily) { finishDailyAttempt(this.scoreThisPhase); return; }
      setStatus('Prateleira pareada ✓', true);
      this.scoreThisPhase += CONFIG.POINTS_PHASE_BONUS;
      const timeBonus = Math.floor(this.timeLeft) * CONFIG.POINTS_PER_SECOND_LEFT;
      this.scoreThisPhase += timeBonus;
      this._timeBonus = timeBonus;
      Progress.increment('shelf');
      Progress.addScore(this.scoreThisPhase);
      checkAchievementsAfterShelf();
      this._showWinOverlay(timeBonus);
    },
    _showWinOverlay(timeBonus) {
      winTitle.textContent = 'Prateleira pareada ✓';
      winOverlay.querySelector('.win-card').classList.remove('zen');
      winPoints.textContent = `+${this.scoreThisPhase} pontos`;
      const lines = [];
      if (this._statNormal > 0) lines.push(`${this._statNormal} par(es) normal(is) → +${this._statNormal * CONFIG.POINTS_NORMAL}`);
      if (this._statStar > 0) lines.push(`${this._statStar} estrela(s) → +${this._statStar * CONFIG.POINTS_STAR}`);
      if (this._statGift > 0) lines.push(`${this._statGift} presente(s) → +${this._statGift * CONFIG.POINTS_GIFT}`);
      lines.push(`Bônus de fase → +${CONFIG.POINTS_PHASE_BONUS}`);
      if (timeBonus > 0) lines.push(`Bônus de tempo → +${timeBonus}`);
      winBreakdown.innerHTML = lines.join('<br>');
      winTotal.textContent = `Total: ${Progress.data.score} pontos`;
      winOverlay.classList.remove('hidden');
      winOverlay.style.display = 'flex';
      void winOverlay.offsetWidth;
      winOverlay.classList.add('visible');
    },
    update(dt) {
      this._pulseTime += dt;
      if (!this._zen && !this.complete && this.timeLeft > 0) this.timeLeft = Math.max(0, this.timeLeft - dt / 1000);
      for (let i = this.returning.length - 1; i >= 0; i--) {
        const r = this.returning[i];
        r.t += dt / CONFIG.RETURN_DURATION;
        if (r.t >= 1) {
          r.t = 1;
          this._placeInSlot(r.item, r.homeShelfIndex, r.homeSlotIndex);
          this.returning.splice(i, 1);
          continue;
        }
        const e = 1 - Math.pow(1 - r.t, 3);
        r.item.x = lerp(r.fromX, r.toX, e);
        r.item.y = lerp(r.fromY, r.toY, e);
      }
      for (const it of this.items) if (it.flash > 0) it.flash = Math.max(0, it.flash - dt);
      if (this.celebrationTimer > 0) this.celebrationTimer = Math.max(0, this.celebrationTimer - dt);
    },
    _slotPulseAlpha(shelfIndex, slotIndex) {
      if (!this.dragging) return 0;
      const it = this.dragging.item;
      const r = this._slotRect(shelfIndex, slotIndex);
      const d = dist(it.x, it.y, r.cx, r.cy);
      const N = this.params.slotsPerShelf;
      const slotW = this.shelves[shelfIndex].width / N;
      const maxD = slotW * 1.8;
      if (d > maxD) return 0;
      const base = 1 - d / maxD;
      const pulse = 0.5 + 0.5 * Math.sin(this._pulseTime / 200);
      return base * pulse;
    },
    draw() {
      ctx.fillStyle = CONFIG.BACKGROUND;
      ctx.fillRect(0, 0, W, H);
      const N = this.params.slotsPerShelf;
      for (let s = 0; s < this.shelves.length; s++) {
        const shelf = this.shelves[s];
        ctx.fillStyle = 'rgba(139, 69, 19, 0.28)';
        ctx.fillRect(shelf.left + 3, shelf.y + 4, shelf.width, shelf.height);
        ctx.fillStyle = CONFIG.SHELF;
        ctx.fillRect(shelf.left, shelf.y, shelf.width, shelf.height);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)'; ctx.lineWidth = 1;
        for (let i = 0; i < 2; i++) {
          const y = shelf.y + (shelf.height / 3) * (i + 1);
          ctx.beginPath(); ctx.moveTo(shelf.left, y); ctx.lineTo(shelf.left + shelf.width, y); ctx.stroke();
        }
        ctx.strokeStyle = 'rgba(139, 69, 19, 0.35)'; ctx.lineWidth = 1;
        const slotW = shelf.width / N;
        for (let i = 1; i < N; i++) {
          const x = shelf.left + slotW * i;
          ctx.beginPath(); ctx.moveTo(x, shelf.y + 3); ctx.lineTo(x, shelf.y + shelf.height - 3); ctx.stroke();
        }
        for (let i = 0; i < N; i++) {
          if (shelf.slots[i] === null) {
            const r = this._slotRect(s, i);
            const pulse = this._slotPulseAlpha(s, i);
            const destacado = !!this.dragging;
            ctx.save();
            ctx.setLineDash([5, 4]);
            ctx.strokeStyle = destacado ? CONFIG.SLOT_HIGHLIGHT : 'rgba(91, 155, 213, 0.55)';
            ctx.lineWidth = (destacado ? 2.5 : 1.5) + pulse * 1.5;
            if (pulse > 0.01) ctx.strokeStyle = hexToRgba(CONFIG.SLOT_HIGHLIGHT, 0.4 + pulse * 0.6);
            roundRect(r.cx - r.w / 2, r.cy - r.h / 2, r.w, r.h, 6);
            ctx.stroke();
            ctx.restore();
          }
        }
      }
      for (const it of this.items) {
        if (this.dragging && this.dragging.item === it) continue;
        this._drawItem(it);
      }
      if (this.dragging) {
        ctx.save();
        ctx.globalAlpha = 0.92;
        ctx.shadowColor = CONFIG.SHADOW;
        ctx.shadowBlur = 14; ctx.shadowOffsetY = 6;
        this._drawItem(this.dragging.item);
        ctx.restore();
      }
      for (let s = 0; s < this.shelves.length; s++) {
        const shelf = this.shelves[s];
        const N2 = shelf.slots.length;
        let i = 0;
        while (i < N2 - 1) {
          const a = shelf.slots[i], b = shelf.slots[i + 1];
          if (a && b && a.pairId === b.pairId) {
            const key = `${s}:${a.pairId}`;
            const scored = this._scoredPairs.has(key);
            const r1 = this._slotRect(s, i);
            const r2 = this._slotRect(s, i + 1);
            const x1 = r1.cx - r1.w / 2 + 4;
            const x2 = r2.cx + r2.w / 2 - 4;
            const y = r1.cy + r1.h / 2 + 6;
            ctx.save();
            ctx.strokeStyle = scored ? CONFIG.PAIR_MARK : 'rgba(62, 124, 177, 0.5)';
            ctx.lineWidth = 2.5; ctx.lineCap = 'round';
            ctx.beginPath(); ctx.moveTo(x1, y); ctx.lineTo(x2, y); ctx.stroke();
            ctx.restore();
            i += 2;
          } else i++;
        }
      }
      if (this.celebrationTimer > 0) {
        const p = 1 - this.celebrationTimer / CONFIG.CELEBRATION_DURATION;
        drawCelebrationWave(p);
      }
    },
    _drawItem(item) {
      ctx.save();
      ctx.translate(item.x, item.y);
      ctx.scale(item.scale, item.scale);
      ctx.shadowColor = CONFIG.SHADOW;
      ctx.shadowBlur = 6; ctx.shadowOffsetY = 3;
      if (item.type === 'estrela' || item.type === 'presente') {
        ctx.save();
        const haloR = Math.min(item.w, item.h) * 0.8;
        const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, haloR);
        const baseColor = item.type === 'estrela' ? '#FFD54F' : '#F06292';
        grad.addColorStop(0, hexToRgba(baseColor, 0.55));
        grad.addColorStop(1, hexToRgba(baseColor, 0));
        ctx.fillStyle = grad;
        ctx.beginPath(); ctx.arc(0, 0, haloR, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      }
      drawObjectShape(item.type, item.w, item.h, item.palette);
      ctx.restore();
    },
  };

  /* CENA: FIOS */
  function createThread(index, color, threadCount, nodesPerThread, isElectric) {
    const margin = CONFIG.THREAD_MARGIN;
    const usableW = W - 2 * margin;
    const usableH = H - 2 * margin;
    const leftY = margin + (usableH * (index + 1)) / (threadCount + 1);
    const rightY = margin + (usableH * (threadCount - index)) / (threadCount + 1);
    const endpoints = [{ x: margin, y: leftY }, { x: W - margin, y: rightY }];
    const nodes = [];
    for (let j = 0; j < nodesPerThread; j++) {
      const t = (j + 1) / (nodesPerThread + 1);
      const x = margin + usableW * t;
      const y = margin + rng() * usableH;
      nodes.push({ x, y });
    }
    const thread = { endpoints, nodes, color, samples: [], hoverScale: 1, isElectric: !!isElectric, isClean: false, cleanPulse: 0 };
    resampleThread(thread);
    return thread;
  }
  function resampleThread(thread) {
    const pts = [thread.endpoints[0], ...thread.nodes, thread.endpoints[1]];
    const step = CONFIG.THREAD_SAMPLE_STEP;
    const samples = [];
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i - 1] || pts[i];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2] || pts[i + 1];
      const b1 = { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 };
      const b2 = { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 };
      const segLen = dist(p1.x, p1.y, p2.x, p2.y);
      const n = Math.max(4, Math.ceil(segLen / step));
      for (let s = 0; s < n; s++) samples.push(cubicBezier(p1, b1, b2, p2, s / n));
    }
    samples.push(pts[pts.length - 1]);
    thread.samples = samples;
  }

  const ThreadsScene = {
    threads: [], dragging: null, complete: false, celebrationTimer: 0,
    params: { level: 1, threadCount: 3, nodesPerThread: 3, timeLimit: 60 },
    timeLeft: 0, scoreThisPhase: 0,
    _scoredThreads: new Set(),
    _statNormal: 0, _statElectric: 0, _timeBonus: 0,
    _prevClean: new Set(), _zen: false, _daily: false,

    reset() {
      this.params = getThreadsParams();
      this._zen = !!this.params.zen;
      this._daily = !!this.params.daily;
      this.threads = [];
      this.dragging = null;
      this.complete = false;
      this.celebrationTimer = 0;
      this.timeLeft = this.params.timeLimit;
      this.scoreThisPhase = 0;
      this._scoredThreads = new Set();
      this._statNormal = 0;
      this._statElectric = 0;
      this._timeBonus = 0;
      this._prevClean = new Set();

      const { threadCount, nodesPerThread } = this.params;
      const canHaveElectric = !this._zen && (this._daily || Progress.data.threads >= 4);
      const wantElectric = canHaveElectric && rng() < CONFIG.THREAD_ELECTRIC_CHANCE;
      const electricIndex = wantElectric ? Math.floor(rng() * threadCount) : -1;

      for (let i = 0; i < threadCount; i++) {
        const isElectric = (i === electricIndex);
        const color = isElectric ? CONFIG.ELECTRIC_COLOR : CONFIG.THREAD_COLORS[i % CONFIG.THREAD_COLORS.length];
        this.threads.push(createThread(i, color, threadCount, nodesPerThread, isElectric));
      }
      this._updateCleanStates();
      this._prevClean = new Set(this.threads.map((t, i) => t.isClean ? i : -1).filter(i => i >= 0));
    },
    _updateCleanStates() {
      const N = this.threads.length;
      for (let i = 0; i < N; i++) {
        let crosses = false;
        for (let j = 0; j < N; j++) {
          if (i === j) continue;
          if (this._threadsCross(this.threads[i], this.threads[j])) { crosses = true; break; }
        }
        this.threads[i].isClean = !crosses;
      }
    },
    _cleanIndices() {
      const list = [];
      for (let i = 0; i < this.threads.length; i++) if (this.threads[i].isClean) list.push(i);
      return list;
    },
    _detectNewClean() {
      this._updateCleanStates();
      const currentClean = new Set(this._cleanIndices());
      for (const idx of currentClean) {
        if (!this._prevClean.has(idx) && !this._scoredThreads.has(idx)) {
          const th = this.threads[idx];
          if (this._zen) {
            if (th.isElectric) playElectricSound(); else playThreadClean();
          } else {
            if (th.isElectric) { this.scoreThisPhase += CONFIG.THREAD_POINTS_ELECTRIC; this._statElectric++; playElectricSound(); if (!this._daily) tryUnlock('electric'); }
            else { this.scoreThisPhase += CONFIG.THREAD_POINTS_CLEAN; this._statNormal++; playThreadClean(); }
          }
          th.cleanPulse = 600;
          this._scoredThreads.add(idx);
          if (navigator.vibrate) { try { navigator.vibrate(15); } catch (e) {} }
        }
      }
      this._prevClean = currentClean;
    },
    update(dt) {
      if (!this._zen && !this.complete && this.timeLeft > 0) this.timeLeft = Math.max(0, this.timeLeft - dt / 1000);
      if (this.celebrationTimer > 0) this.celebrationTimer = Math.max(0, this.celebrationTimer - dt);
      for (let i = 0; i < this.threads.length; i++) {
        const thread = this.threads[i];
        if (!thread.hoverScale) thread.hoverScale = 1;
        const target = (this.dragging && this.dragging.threadIndex === i) ? 1.2 : 1;
        thread.hoverScale = lerp(thread.hoverScale, target, Math.min(1, dt / 100));
        if (thread.cleanPulse > 0) thread.cleanPulse = Math.max(0, thread.cleanPulse - dt);
      }
    },
    draw() {
      ctx.fillStyle = CONFIG.BACKGROUND;
      ctx.fillRect(0, 0, W, H);
      for (const thread of this.threads) this._drawThread(thread);
      if (this.celebrationTimer > 0) {
        const p = 1 - this.celebrationTimer / CONFIG.CELEBRATION_DURATION;
        drawCelebrationWave(p);
      }
    },
    _drawThread(thread) {
      const pts = [thread.endpoints[0], ...thread.nodes, thread.endpoints[1]];
      const pulse = thread.cleanPulse > 0 ? (thread.cleanPulse / 600) : 0;
      const glowing = thread.isClean || pulse > 0;
      const T = CONFIG.THREAD_THICKNESS;
      ctx.save();
      ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      if (glowing) {
        ctx.save();
        ctx.strokeStyle = hexToRgba(thread.color, 0.35 + pulse * 0.4);
        ctx.lineWidth = T + 10;
        ctx.beginPath();
        ctx.moveTo(pts[0].x, pts[0].y);
        for (let i = 0; i < pts.length - 1; i++) {
          const p0 = pts[i - 1] || pts[i];
          const p1 = pts[i];
          const p2 = pts[i + 1];
          const p3 = pts[i + 2] || pts[i + 1];
          const b1x = p1.x + (p2.x - p0.x) / 6;
          const b1y = p1.y + (p2.y - p0.y) / 6;
          const b2x = p2.x - (p3.x - p1.x) / 6;
          const b2y = p2.y - (p3.y - p1.y) / 6;
          ctx.bezierCurveTo(b1x, b1y, b2x, b2y, p2.x, p2.y);
        }
        ctx.stroke();
        ctx.restore();
      }
      ctx.strokeStyle = 'rgba(61, 50, 41, 0.55)';
      ctx.lineWidth = T + 2;
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 0; i < pts.length - 1; i++) {
        const p0 = pts[i - 1] || pts[i];
        const p1 = pts[i];
        const p2 = pts[i + 1];
        const p3 = pts[i + 2] || pts[i + 1];
        const b1x = p1.x + (p2.x - p0.x) / 6;
        const b1y = p1.y + (p2.y - p0.y) / 6;
        const b2x = p2.x - (p3.x - p1.x) / 6;
        const b2y = p2.y - (p3.y - p1.y) / 6;
        ctx.bezierCurveTo(b1x, b1y, b2x, b2y, p2.x, p2.y);
      }
      ctx.stroke();
      ctx.strokeStyle = thread.color;
      ctx.lineWidth = T;
      ctx.shadowColor = CONFIG.SHADOW;
      ctx.shadowBlur = 3; ctx.shadowOffsetY = 2;
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 0; i < pts.length - 1; i++) {
        const p0 = pts[i - 1] || pts[i];
        const p1 = pts[i];
        const p2 = pts[i + 1];
        const p3 = pts[i + 2] || pts[i + 1];
        const b1x = p1.x + (p2.x - p0.x) / 6;
        const b1y = p1.y + (p2.y - p0.y) / 6;
        const b2x = p2.x - (p3.x - p1.x) / 6;
        const b2y = p2.y - (p3.y - p1.y) / 6;
        ctx.bezierCurveTo(b1x, b1y, b2x, b2y, p2.x, p2.y);
      }
      ctx.stroke();
      ctx.shadowColor = 'transparent';
      if (thread.isClean) {
        ctx.strokeStyle = 'rgba(91, 155, 213, 0.75)';
        ctx.lineWidth = Math.max(1.5, T * 0.45);
        ctx.beginPath();
        ctx.moveTo(pts[0].x, pts[0].y);
        for (let i = 0; i < pts.length - 1; i++) {
          const p0 = pts[i - 1] || pts[i];
          const p1 = pts[i];
          const p2 = pts[i + 1];
          const p3 = pts[i + 2] || pts[i + 1];
          const b1x = p1.x + (p2.x - p0.x) / 6;
          const b1y = p1.y + (p2.y - p0.y) / 6;
          const b2x = p2.x - (p3.x - p1.x) / 6;
          const b2y = p2.y - (p3.y - p1.y) / 6;
          ctx.bezierCurveTo(b1x, b1y, b2x, b2y, p2.x, p2.y);
        }
        ctx.stroke();
      }
      for (const ep of thread.endpoints) {
        const haloR = CONFIG.THREAD_ENDPOINT_RADIUS * 2.4;
        const grad = ctx.createRadialGradient(ep.x, ep.y, 0, ep.x, ep.y, haloR);
        grad.addColorStop(0, hexToRgba(thread.color, thread.isClean ? 0.7 : 0.45));
        grad.addColorStop(1, hexToRgba(thread.color, 0));
        ctx.beginPath(); ctx.arc(ep.x, ep.y, haloR, 0, Math.PI * 2); ctx.fillStyle = grad; ctx.fill();
        ctx.beginPath(); ctx.arc(ep.x, ep.y, CONFIG.THREAD_ENDPOINT_RADIUS, 0, Math.PI * 2);
        ctx.fillStyle = thread.color; ctx.fill();
        ctx.strokeStyle = 'rgba(61, 50, 41, 0.6)'; ctx.lineWidth = 2; ctx.stroke();
        if (thread.isElectric) {
          ctx.fillStyle = '#5C2E0E';
          ctx.font = `bold ${Math.floor(CONFIG.THREAD_ENDPOINT_RADIUS * 1.5)}px system-ui`;
          ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText('⚡', ep.x, ep.y + 1);
        }
      }
      for (const n of thread.nodes) {
        const r = CONFIG.THREAD_NODE_RADIUS * (thread.hoverScale || 1);
        ctx.beginPath(); ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 245, 230, 0.98)'; ctx.fill();
        ctx.strokeStyle = 'rgba(61, 50, 41, 0.55)'; ctx.lineWidth = 2; ctx.stroke();
        ctx.strokeStyle = thread.color; ctx.lineWidth = 1.5; ctx.stroke();
      }
      ctx.restore();
    },
    onDown(pos) {
      if (this.complete) return;
      let best = null, bestDist = Infinity;
      const grabR = CONFIG.THREAD_GRAB_RADIUS;
      for (let ti = 0; ti < this.threads.length; ti++) {
        const thread = this.threads[ti];
        for (let ni = 0; ni < thread.nodes.length; ni++) {
          const n = thread.nodes[ni];
          const d = dist(pos.x, pos.y, n.x, n.y);
          if (d <= grabR && d < bestDist) { bestDist = d; best = { threadIndex: ti, nodeIndex: ni }; }
        }
      }
      if (best) {
        this.dragging = best;
        playSlide();
        if (navigator.vibrate) { try { navigator.vibrate(10); } catch (e) {} }
      }
    },
    onMove(pos) {
      if (!this.dragging) return;
      const { threadIndex, nodeIndex } = this.dragging;
      const thread = this.threads[threadIndex];
      thread.nodes[nodeIndex].x = pos.x;
      thread.nodes[nodeIndex].y = pos.y;
      resampleThread(thread);
      this._detectNewClean();
      this._checkCompletion();
    },
    onUp() { this.dragging = null; },
    _checkCompletion() {
      if (this.complete) return;
      for (const t of this.threads) if (!t.isClean) return;
      this.complete = true;
      this.celebrationTimer = CONFIG.CELEBRATION_DURATION;
      playComplete();
      if (navigator.vibrate) { try { navigator.vibrate(50); } catch (e) {} }
      if (this._zen) { setStatus('Zen concluído 🌿', true); return; }
      if (this._daily) { finishDailyAttempt(this.scoreThisPhase); return; }
      setStatus('Fios desembaraçados ✓', true);
      this.scoreThisPhase += CONFIG.THREAD_POINTS_PHASE_BONUS;
      const timeBonus = Math.floor(this.timeLeft) * CONFIG.POINTS_PER_SECOND_LEFT;
      this.scoreThisPhase += timeBonus;
      this._timeBonus = timeBonus;
      Progress.increment('threads');
      Progress.addScore(this.scoreThisPhase);
      checkAchievementsAfterThreads();
      this._showWinOverlay(timeBonus);
    },
    _showWinOverlay(timeBonus) {
      winTitle.textContent = 'Fios desembaraçados ✓';
      winOverlay.querySelector('.win-card').classList.remove('zen');
      winPoints.textContent = `+${this.scoreThisPhase} pontos`;
      const lines = [];
      if (this._statNormal > 0) lines.push(`${this._statNormal} fio(s) limpo(s) → +${this._statNormal * CONFIG.THREAD_POINTS_CLEAN}`);
      if (this._statElectric > 0) lines.push(`${this._statElectric} fio(s) elétrico(s) → +${this._statElectric * CONFIG.THREAD_POINTS_ELECTRIC}`);
      lines.push(`Bônus de fase → +${CONFIG.THREAD_POINTS_PHASE_BONUS}`);
      if (timeBonus > 0) lines.push(`Bônus de tempo → +${timeBonus}`);
      winBreakdown.innerHTML = lines.join('<br>');
      winTotal.textContent = `Total: ${Progress.data.score} pontos`;
      winOverlay.classList.remove('hidden');
      winOverlay.style.display = 'flex';
      void winOverlay.offsetWidth;
      winOverlay.classList.add('visible');
    },
    _threadsCross(a, b) {
      const sa = a.samples, sb = b.samples;
      for (let i = 0; i < sa.length - 1; i++) {
        const ax = sa[i].x, ay = sa[i].y;
        const bx = sa[i + 1].x, by = sa[i + 1].y;
        for (let j = 0; j < sb.length - 1; j++) {
          const cx = sb[j].x, cy = sb[j].y;
          const dx = sb[j + 1].x, dy = sb[j + 1].y;
          if (segmentsIntersect(ax, ay, bx, by, cx, cy, dx, dy)) return true;
        }
      }
      return false;
    },
  };

  function updateCurrentScene(dt) {
    if (currentScene === 'shelf') ShelfScene.update(dt);
    else if (currentScene === 'threads') ThreadsScene.update(dt);
  }
  function drawCurrentScene() {
    if (currentScene === 'shelf') ShelfScene.draw();
    else if (currentScene === 'threads') ThreadsScene.draw();
    else { ctx.fillStyle = CONFIG.BACKGROUND; ctx.fillRect(0, 0, W, H); }
  }
  function loop(timestamp) {
    if (!lastTime) lastTime = timestamp;
    const dt = Math.min(50, timestamp - lastTime);
    lastTime = timestamp;
    updateCurrentScene(dt);
    drawCurrentScene();
    updateHUD();
    requestAnimationFrame(loop);
  }
  function updateHUD() {
    if (currentScene === 'shelf') {
      const p = ShelfScene.params;
      if (p.zen) {
        hudLevel.textContent = '🌿 Zen';
        hudLevel.classList.remove('hidden');
        hudPairs.classList.add('hidden');
        hudTimer.classList.add('hidden');
        hudScore.classList.add('hidden');
        return;
      }
      if (p.daily) {
        hudLevel.textContent = '🎯 Desafio';
        hudLevel.classList.remove('hidden');
        const done = ShelfScene._scoredPairs.size;
        const total = ShelfScene.totalPairs;
        hudPairs.textContent = `Pares: ${done}/${total}`;
        hudPairs.classList.remove('hidden');
        const t = Math.max(0, Math.ceil(ShelfScene.timeLeft));
        hudTimer.textContent = `⏱ ${t}s`;
        hudTimer.classList.remove('hidden');
        hudTimer.classList.toggle('danger', t <= 15);
        hudScore.textContent = `⭐ ${ShelfScene.scoreThisPhase}`;
        hudScore.classList.remove('hidden');
        return;
      }
      hudLevel.textContent = `Nível ${p.level}`;
      hudLevel.classList.remove('hidden');
      const done = ShelfScene._scoredPairs.size;
      const total = ShelfScene.totalPairs;
      hudPairs.textContent = `Pares: ${done}/${total}`;
      hudPairs.classList.remove('hidden');
      const t = Math.max(0, Math.ceil(ShelfScene.timeLeft));
      hudTimer.textContent = `⏱ ${t}s`;
      hudTimer.classList.remove('hidden');
      hudTimer.classList.toggle('danger', t <= 15);
      hudScore.textContent = `⭐ ${Progress.data.score + ShelfScene.scoreThisPhase}`;
      hudScore.classList.remove('hidden');
    } else if (currentScene === 'threads') {
      const p = ThreadsScene.params;
      if (p.zen) {
        hudLevel.textContent = '🌿 Zen';
        hudLevel.classList.remove('hidden');
        hudPairs.classList.add('hidden');
        hudTimer.classList.add('hidden');
        hudScore.classList.add('hidden');
        return;
      }
      if (p.daily) {
        hudLevel.textContent = '🎯 Desafio';
        hudLevel.classList.remove('hidden');
        const done = ThreadsScene._scoredThreads.size;
        const total = ThreadsScene.threads.length;
        hudPairs.textContent = `Fios: ${done}/${total}`;
        hudPairs.classList.remove('hidden');
        const t = Math.max(0, Math.ceil(ThreadsScene.timeLeft));
        hudTimer.textContent = `⏱ ${t}s`;
        hudTimer.classList.remove('hidden');
        hudTimer.classList.toggle('danger', t <= 15);
        hudScore.textContent = `⭐ ${ThreadsScene.scoreThisPhase}`;
        hudScore.classList.remove('hidden');
        return;
      }
      hudLevel.textContent = `Nível ${p.level}`;
      hudLevel.classList.remove('hidden');
      const done = ThreadsScene._scoredThreads.size;
      const total = ThreadsScene.threads.length;
      hudPairs.textContent = `Fios: ${done}/${total}`;
      hudPairs.classList.remove('hidden');
      const t = Math.max(0, Math.ceil(ThreadsScene.timeLeft));
      hudTimer.textContent = `⏱ ${t}s`;
      hudTimer.classList.remove('hidden');
      hudTimer.classList.toggle('danger', t <= 15);
      hudScore.textContent = `⭐ ${Progress.data.score + ThreadsScene.scoreThisPhase}`;
      hudScore.classList.remove('hidden');
    } else {
      hudLevel.classList.add('hidden');
      hudPairs.classList.add('hidden');
      hudTimer.classList.add('hidden');
      hudScore.classList.add('hidden');
    }
  }

  function getPos(e) {
    const rect = canvas.getBoundingClientRect();
    let cx, cy;
    if (e.touches && e.touches[0]) { cx = e.touches[0].clientX; cy = e.touches[0].clientY; }
    else { cx = e.clientX; cy = e.clientY; }
    return { x: cx - rect.left, y: cy - rect.top };
  }
  function onDown(e) {
    if (e.cancelable) e.preventDefault();
    const pos = getPos(e);
    if (currentScene === 'shelf') ShelfScene.onDown(pos);
    else if (currentScene === 'threads') ThreadsScene.onDown(pos);
  }
  function onMove(e) {
    if (e.cancelable) e.preventDefault();
    const pos = getPos(e);
    if (currentScene === 'shelf') ShelfScene.onMove(pos);
    else if (currentScene === 'threads') ThreadsScene.onMove(pos);
  }
  function onUp(e) {
    const pos = e ? getPos(e) : null;
    if (currentScene === 'shelf') ShelfScene.onUp(pos);
    else if (currentScene === 'threads') ThreadsScene.onUp();
  }

  function updateMenuCounters() {
    const s = Progress.data.shelf;
    const t = Progress.data.threads;
    countShelf.textContent = s === 0 ? 'novo' : `Nível ${Math.min(s + 1, CONFIG.SHELF_LEVELS.length)}`;
    countShelf.classList.toggle('empty', s === 0);
    countThreads.textContent = t === 0 ? 'novo' : `Nível ${Math.min(t + 1, CONFIG.THREAD_LEVELS.length)}`;
    countThreads.classList.toggle('empty', t === 0);
    // Botão do desafio: mostrar streak ou "novo"
    const streak = Progress.data.daily.streak;
    const today = Progress.data.daily.today;
    btnDaily.classList.remove('done', 'streak');
    if (today.completed) {
      countDaily.textContent = `${today.bestScore} pts · ✓`;
      btnDaily.classList.add('done');
    } else if (streak > 0) {
      countDaily.textContent = `🔥 ${streak} dia${streak > 1 ? 's' : ''}`;
      btnDaily.classList.add('streak');
    } else {
      countDaily.textContent = 'novo';
    }
  }
  function updateMuteButton() {
    btnMute.textContent = Progress.data.muted ? '🔇' : '🔊';
  }
  function updateAmbientButton() {
    btnAmbient.classList.toggle('on', Progress.data.ambient);
    btnAmbient.classList.toggle('off', !Progress.data.ambient);
    btnAmbient.title = Progress.data.ambient
      ? 'Som ambiente ligado — clique para desligar'
      : 'Som ambiente desligado — clique para ligar';
  }
  function fadeCanvas(callback) {
    canvas.classList.add('fading');
    setTimeout(() => { callback(); canvas.classList.remove('fading'); }, 200);
  }
  function hideWinOverlay() {
    winOverlay.classList.remove('visible');
    winOverlay.classList.add('hidden');
    winOverlay.style.display = 'none';
  }
  function hideDailyWinOverlay() {
    dailyWinOverlay.classList.remove('visible');
    dailyWinOverlay.classList.add('hidden');
    dailyWinOverlay.style.display = 'none';
  }

  function showMenu() {
    hideWinOverlay();
    hideDailyWinOverlay();
    closeAllHelps();
    closeAchievements();
    closeDailyPanel();
    zenMode = false;
    dailyMode = false;
    dailySeedRng = null;
    dailyMechanic = null;
    fadeCanvas(() => {
      currentScene = null;
      menuEl.classList.remove('hidden');
      gameAreaEl.classList.add('hidden');
      btnReset.classList.remove('hidden');
      btnAchievements.classList.remove('hidden');
      btnDailyPanel.classList.remove('hidden');
      btnHelp.classList.remove('hidden');
      setStatus('Escolha uma mecânica', false);
      updateMenuCounters();
      updateMuteButton();
      updateAmbientButton();
    });
    ambient.refresh(false);
  }

  function showGame(which, isZen) {
    hideWinOverlay();
    hideDailyWinOverlay();
    closeAllHelps();
    zenMode = !!isZen;
    dailyMode = false;
    dailySeedRng = null;
    dailyMechanic = null;
    menuEl.classList.add('hidden');
    gameAreaEl.classList.remove('hidden');
    btnReset.classList.add('hidden');
    btnAchievements.classList.add('hidden');
    btnDailyPanel.classList.add('hidden');
    btnHelp.classList.add('hidden');
    const size = setupCanvas();
    W = size.width; H = size.height;
    currentScene = which;
    if (which === 'shelf') {
      ShelfScene.reset();
      btnNew.textContent = zenMode ? 'Nova fase Zen' : 'Nova prateleira';
      setStatus(zenMode ? 'Zen 🌿' : 'Junte os pares lado a lado', false);
    } else if (which === 'threads') {
      ThreadsScene.reset();
      btnNew.textContent = zenMode ? 'Nova fase Zen' : 'Novos fios';
      setStatus(zenMode ? 'Zen 🌿' : 'Arraste os nós até nenhum fio se cruzar', false);
    }
    updateMuteButton();
    updateAmbientButton();
    ambient.refresh(true);
    canvas.classList.add('fading');
    requestAnimationFrame(() => { requestAnimationFrame(() => canvas.classList.remove('fading')); });
  }

  function showZen() {
    const which = Math.random() < 0.5 ? 'shelf' : 'threads';
    showGame(which, true);
  }

  /** Inicia o Desafio do Dia. */
  function showDaily() {
    Progress.ensureTodayReset();
    if (Progress.data.daily.today.attemptsUsed >= CONFIG.DAILY_MAX_ATTEMPTS) {
      setStatus('Você já usou as 3 tentativas de hoje 🎯', false);
      return;
    }

    const tk = todayKey();
    const mech = dailyMechanicForDate(tk);
    dailyMechanic = mech;
    dailyMode = true;
    zenMode = false;

    // Seed determinística pela data (mais o número da tentativa não — a fase é a mesma)
    const seed = hashString('daily-' + tk);
    dailySeedRng = mulberry32(seed);

    hideWinOverlay();
    hideDailyWinOverlay();
    closeAllHelps();
    menuEl.classList.add('hidden');
    gameAreaEl.classList.remove('hidden');
    btnReset.classList.add('hidden');
    btnAchievements.classList.add('hidden');
    btnDailyPanel.classList.add('hidden');
    btnHelp.classList.add('hidden');
    const size = setupCanvas();
    W = size.width; H = size.height;
    currentScene = mech;
    dailyAttemptScore = 0;

    if (mech === 'shelf') {
      ShelfScene.reset();
      btnNew.textContent = '🎯 Reiniciar';
      setStatus('🎯 Desafio do dia — Prateleira', false);
    } else {
      ThreadsScene.reset();
      btnNew.textContent = '🎯 Reiniciar';
      setStatus('🎯 Desafio do dia — Fios', false);
    }
    updateMuteButton();
    updateAmbientButton();
    ambient.refresh(true);
    canvas.classList.add('fading');
    requestAnimationFrame(() => { requestAnimationFrame(() => canvas.classList.remove('fading')); });
  }

  /** Chamado quando o jogador completa uma tentativa do desafio. */
  function finishDailyAttempt(score) {
    const tk = todayKey();
    Progress.ensureTodayReset();

    Progress.data.daily.today.attemptsUsed = Math.min(
      CONFIG.DAILY_MAX_ATTEMPTS,
      Progress.data.daily.today.attemptsUsed + 1
    );
    if (score > Progress.data.daily.today.bestScore) {
      Progress.data.daily.today.bestScore = score;
    }

    // Só marca como completed e atualiza streak se for a primeira vez que completa hoje
    const firstTimeToday = !Progress.data.daily.today.completed;
    if (firstTimeToday) {
      Progress.data.daily.today.completed = true;
      // Atualiza streak
      const last = Progress.data.daily.lastCompletedDate;
      if (last === tk) {
        // já contava hoje (improvável, mas seguro)
      } else {
        // Calcula se é continuação
        if (last) {
          const d1 = new Date(tk + 'T12:00:00');
          const d2 = new Date(last + 'T12:00:00');
          const diffDays = Math.round((d1 - d2) / 86400000);
          if (diffDays === 1) {
            Progress.data.daily.streak += 1;
          } else {
            Progress.data.daily.streak = 1;
          }
        } else {
          Progress.data.daily.streak = 1;
        }
        Progress.data.daily.lastCompletedDate = tk;
      }

      // Adiciona/atualiza no histórico (mantém só 7)
      Progress.data.daily.history.push({
        date: tk,
        mechanic: dailyMechanic,
        bestScore: Progress.data.daily.today.bestScore,
        attemptsUsed: Progress.data.daily.today.attemptsUsed,
        completed: true,
      });
      if (Progress.data.daily.history.length > 7) {
        Progress.data.daily.history = Progress.data.daily.history.slice(-7);
      }

      // Conquistas
      checkAchievementsAfterDaily();
    } else {
      // Já tinha completado hoje — atualiza o histórico com o novo best
      const h = Progress.data.daily.history.find(e => e.date === tk);
      if (h) {
        h.bestScore = Progress.data.daily.today.bestScore;
        h.attemptsUsed = Progress.data.daily.today.attemptsUsed;
      }
    }

    Progress.save();
    showDailyWinOverlay();
  }

  function showDailyWinOverlay() {
    const today = Progress.data.daily.today;
    const remaining = CONFIG.DAILY_MAX_ATTEMPTS - today.attemptsUsed;

    dailyWinTitle.textContent = today.completed ? 'Desafio do dia ✓' : 'Fim do desafio';
    dailyWinPoints.textContent = `+${dailyAttemptScore} pontos`;
    dailyWinAttempts.textContent = `Tentativas usadas: ${today.attemptsUsed}/${CONFIG.DAILY_MAX_ATTEMPTS}`;
    dailyWinBest.textContent = `Melhor do dia: ${today.bestScore} pontos`;

    if (remaining <= 0) {
      btnDailyRetry.disabled = true;
      btnDailyRetry.textContent = '🔄 Sem tentativas';
    } else {
      btnDailyRetry.disabled = false;
      btnDailyRetry.textContent = `🔄 Tentar novamente (${remaining})`;
    }

    dailyWinOverlay.classList.remove('hidden');
    dailyWinOverlay.style.display = 'flex';
    void dailyWinOverlay.offsetWidth;
    dailyWinOverlay.classList.add('visible');
  }

  function setupCanvas() {
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { width: rect.width, height: rect.height };
  }

  btnShelf.addEventListener('click', () => showGame('shelf', false));
  btnThreads.addEventListener('click', () => showGame('threads', false));
  btnZen.addEventListener('click', () => showZen());
  btnDaily.addEventListener('click', () => showDaily());
  btnMenu.addEventListener('click', () => showMenu());

  btnMute.addEventListener('click', () => {
    Progress.toggleMute();
    updateMuteButton();
    if (!Progress.data.muted) _tone(700, 0.08, 0.15, 'sine');
    ambient.refresh(currentScene !== null);
  });

  btnAmbient.addEventListener('click', () => {
    Progress.toggleAmbient();
    updateAmbientButton();
    ambient.refresh(currentScene !== null);
    if (!Progress.data.muted) _tone(Progress.data.ambient ? 880 : 520, 0.08, 0.12, 'sine');
  });

  btnNew.addEventListener('click', () => {
    if (dailyMode) {
      // Reiniciar a fase do desafio (mesma seed) — mas NÃO gasta tentativa extra
      // porque a tentativa só é contada ao COMPLETAR.
      dailySeedRng = mulberry32(hashString('daily-' + todayKey()));
      if (currentScene === 'shelf') {
        ShelfScene.reset();
        setStatus('🎯 Desafio do dia — Prateleira', false);
      } else {
        ThreadsScene.reset();
        setStatus('🎯 Desafio do dia — Fios', false);
      }
      return;
    }
    if (currentScene === 'shelf') {
      ShelfScene.reset();
      setStatus(zenMode ? 'Zen 🌿' : 'Junte os pares lado a lado', false);
    } else if (currentScene === 'threads') {
      ThreadsScene.reset();
      setStatus(zenMode ? 'Zen 🌿' : 'Arraste os nós até nenhum fio se cruzar', false);
    }
  });

  btnNextLevel.addEventListener('click', () => {
    hideWinOverlay();
    if (currentScene === 'shelf') {
      ShelfScene.reset();
      setStatus('Junte os pares lado a lado', false);
    } else if (currentScene === 'threads') {
      ThreadsScene.reset();
      setStatus('Arraste os nós até nenhum fio se cruzar', false);
    }
  });

  btnShare.addEventListener('click', shareScore);
  btnDailyShare.addEventListener('click', shareDailyScore);

  btnDailyRetry.addEventListener('click', () => {
    hideDailyWinOverlay();
    if (Progress.data.daily.today.attemptsUsed >= CONFIG.DAILY_MAX_ATTEMPTS) return;
    // Regenera a mesma fase (mesma seed) e deixa o jogador tentar de novo
    dailySeedRng = mulberry32(hashString('daily-' + todayKey()));
    dailyAttemptScore = 0;
    if (currentScene === 'shelf') {
      ShelfScene.reset();
      setStatus('🎯 Desafio do dia — Prateleira', false);
    } else if (currentScene === 'threads') {
      ThreadsScene.reset();
      setStatus('🎯 Desafio do dia — Fios', false);
    }
  });

  btnDailyClose.addEventListener('click', () => {
    hideDailyWinOverlay();
    showMenu();
  });

  btnReset.addEventListener('click', () => {
    const ok = confirm('Zerar todo o progresso salvo? Isso volta ao nível 1, à pontuação 0, às conquistas e ao histórico de desafios.');
    if (!ok) return;
    Progress.reset();
    updateMenuCounters();
    updateMuteButton();
    updateAmbientButton();
    setStatus('Progresso zerado', false);
  });

  btnHelp.addEventListener('click', openHelpGeneral);
  btnCloseHelp.addEventListener('click', closeHelpGeneral);

  btnHelpGame.addEventListener('click', openContextHelp);
  btnCloseHelpShelf.addEventListener('click', closeHelpShelf);
  btnCloseHelpThreads.addEventListener('click', closeHelpThreads);

  btnAchievements.addEventListener('click', openAchievements);
  btnCloseAch.addEventListener('click', closeAchievements);

  btnDailyPanel.addEventListener('click', openDailyPanel);
  btnCloseDaily.addEventListener('click', closeDailyPanel);

  function init() {
    Progress.load();
    Progress.updateStreakIfNeeded();
    Progress.ensureTodayReset();
    updateMuteButton();
    updateAmbientButton();

    const allPanels = [helpPanel, helpShelfPanel, helpThreadsPanel, achPanel, dailyPanel, winOverlay, dailyWinOverlay, toast];
    for (const p of allPanels) {
      p.classList.add('hidden');
      p.style.display = 'none';
    }
    winOverlay.classList.remove('visible');
    dailyWinOverlay.classList.remove('visible');
    toast.classList.remove('visible');

    const size = setupCanvas();
    W = size.width; H = size.height;
    canvas.addEventListener('mousedown', onDown);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    canvas.addEventListener('touchstart', onDown, { passive: false });
    canvas.addEventListener('touchmove', onMove, { passive: false });
    canvas.addEventListener('touchend', onUp);
    canvas.addEventListener('touchcancel', onUp);
    window.addEventListener('resize', () => {
      const s = setupCanvas();
      W = s.width; H = s.height;
      if (currentScene === 'shelf' && ShelfScene.params) {
        const p = ShelfScene.params;
        const numShelves = p.shelves;
        const topMargin = H * 0.26;
        const bottomMargin = H * 0.16;
        const usableH = H - topMargin - bottomMargin;
        const shelfWidth = W * 0.88;
        const shelfLeft = (W - shelfWidth) / 2;
        const shelfHeight = Math.max(8, H * 0.020);
        const spacing = numShelves > 1 ? usableH / (numShelves - 1) : 0;
        for (let s2 = 0; s2 < numShelves; s2++) {
          ShelfScene.shelves[s2].left = shelfLeft;
          ShelfScene.shelves[s2].width = shelfWidth;
          ShelfScene.shelves[s2].y = topMargin + spacing * s2;
          ShelfScene.shelves[s2].height = shelfHeight;
        }
        for (let s2 = 0; s2 < numShelves; s2++) {
          for (let k = 0; k < p.slotsPerShelf; k++) {
            const it = ShelfScene.shelves[s2].slots[k];
            if (it) {
              const r = ShelfScene._slotRect(s2, k);
              it.x = r.cx; it.y = r.cy; it.w = r.w; it.h = r.h;
            }
          }
        }
      }
    });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        ambient.stop();
      } else {
        ambient.refresh(currentScene !== null);
      }
    });

    let audioUnlocked = false;
    function unlockAudioOnce() {
      if (audioUnlocked) return;
      audioUnlocked = true;
      try {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (AC) {
          if (!audioCtx) audioCtx = new AC();
          if (audioCtx.state === 'suspended') audioCtx.resume();
        }
      } catch (e) {}
      try {
        const silent = new Audio();
        silent.src = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=';
        silent.volume = 0;
        const p = silent.play();
        if (p && p.catch) p.catch(() => {});
      } catch (e) {}
      ambient.retryIfPending();
    }
    document.addEventListener('touchstart', unlockAudioOnce, { passive: true });
    document.addEventListener('pointerdown', unlockAudioOnce, { passive: true });
    document.addEventListener('mousedown', unlockAudioOnce, { passive: true });
    document.addEventListener('keydown', unlockAudioOnce);
    document.addEventListener('click', unlockAudioOnce);

    showMenu();
    requestAnimationFrame(loop);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();