
'use strict';

/* =========================================
   GSR PRIVATE BIRTHDAY — LUXURY EDITION
   FOR GILANG SYAHRIR RAMADHAN
   12 NOVEMBER
========================================= */

const $ = selector => document.querySelector(selector);

const reduced = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

/* =========================================
   1. SCROLL REVEAL ANIMATION
========================================= */

const revealElements = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window && !reduced) {
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -30px 0px'
    }
  );

  revealElements.forEach(element => {
    observer.observe(element);
  });
} else {
  revealElements.forEach(element => {
    element.classList.add('visible');
  });
}

/* =========================================
   2. SCROLL PROGRESS BAR
========================================= */

let scrollScheduled = false;

function updateScrollProgress() {
  const scrollLine = $('#scrollLine');

  if (!scrollLine) return;

  const maxScroll =
    document.documentElement.scrollHeight -
    window.innerHeight;

  const progress = maxScroll > 0
    ? (window.scrollY / maxScroll) * 100
    : 0;

  scrollLine.style.width = progress + '%';
}

window.addEventListener(
  'scroll',
  () => {
    if (scrollScheduled) return;

    scrollScheduled = true;

    requestAnimationFrame(() => {
      updateScrollProgress();
      scrollScheduled = false;
    });
  },
  { passive: true }
);

updateScrollProgress();

/* =========================================
   3. ANIMATED TRADING CANDLESTICK
   Decorative chart, not real market data
========================================= */

const chart = $('#heroChart');

if (chart) {
  const ctx = chart.getContext('2d');

  let chartTick = 0;

  const candleData = Array.from(
    { length: 74 },
    (_, i) => {
      const base =
        65 +
        i * 0.55 +
        Math.sin(i * 0.45) * 11;

      const close =
        base +
        Math.sin(i * 1.9) * 11 +
        Math.cos(i * 0.8) * 4;

      return {
        o: base,
        c: close,
        h: Math.max(base, close) + 5 + Math.random() * 7,
        l: Math.min(base, close) - 5 - Math.random() * 7
      };
    }
  );

  function drawChart() {
    const rect = chart.getBoundingClientRect();

    const dpr = Math.min(
      window.devicePixelRatio || 1,
      2
    );

    if (!rect.width || !rect.height) return;

    const targetWidth = Math.round(rect.width * dpr);
    const targetHeight = Math.round(rect.height * dpr);

    if (
      chart.width !== targetWidth ||
      chart.height !== targetHeight
    ) {
      chart.width = targetWidth;
      chart.height = targetHeight;
    }

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const w = rect.width;
    const h = rect.height;

    ctx.clearRect(0, 0, w, h);

    ctx.strokeStyle = '#5b739044';
    ctx.lineWidth = 1;

    for (let y = 0; y <= h; y += 50) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    const gap = w / candleData.length;
    const scale = (h - 20) / 145;

    const count = reduced
      ? candleData.length
      : Math.min(
          candleData.length,
          Math.floor(chartTick)
        );

    for (let i = 0; i < count; i++) {
      const candle = candleData[i];

      const x = i * gap + gap / 2;

      const py = value =>
        h - 10 - value * scale;

      const rising = candle.c >= candle.o;

      const color = rising
        ? '#59d6a3'
        : '#df7780';

      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = 1.3;

      ctx.beginPath();
      ctx.moveTo(x, py(candle.h));
      ctx.lineTo(x, py(candle.l));
      ctx.stroke();

      ctx.fillRect(
        x - gap * 0.29,
        Math.min(py(candle.o), py(candle.c)),
        Math.max(2, gap * 0.58),
        Math.max(
          2,
          Math.abs(
            py(candle.o) - py(candle.c)
          )
        )
      );
    }
  }

  function chartFrame() {
    chartTick = Math.min(
      candleData.length + 1,
      chartTick + 0.34
    );

    drawChart();

    if (chartTick < candleData.length + 1) {
      requestAnimationFrame(chartFrame);
    }
  }

  if (reduced) {
    drawChart();
  } else {
    chartFrame();
  }

  let resizeTimeout;

  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);

    resizeTimeout = setTimeout(
      drawChart,
      100
    );
  });
}

/* =========================================
   4. ROMANTIC LETTER INTERACTION
========================================= */

const letterContent = $('#letterContent');
const letterButton = $('#letterButton');

if (letterContent && letterButton) {
  letterButton.addEventListener('click', () => {
    const opening = letterContent.hidden;

    letterContent.hidden = !opening;

    letterButton.setAttribute(
      'aria-expanded',
      String(opening)
    );

    letterButton.innerHTML = opening
      ? 'CLOSE MY LETTER <span>♡</span>'
      : 'OPEN MY LETTER <span>✉</span>';

    if (opening) {
      setTimeout(() => {
        letterContent.scrollIntoView({
          behavior: reduced ? 'auto' : 'smooth',
          block: 'nearest'
        });
      }, 100);
    }
  });
}

/* =========================================
   5. HAPPY BIRTHDAY INSTRUMENTAL MUSIC

   - Attempts autoplay on page load
   - Falls back to first user interaction
   - Can be stopped or restarted manually
   - Repeats the birthday melody
========================================= */

let audioContext = null;
let playing = false;
let startingMusic = false;

let notesTimeout = null;
let currentNodes = [];

let musicGeneration = 0;
let manualMusicOff = false;

const musicButton = $('#musicButton');

/* Happy Birthday to You melody */

const melody = [
  ['G4', 0.75],
  ['G4', 0.25],
  ['A4', 1],
  ['G4', 1],
  ['C5', 1],
  ['B4', 2],

  ['G4', 0.75],
  ['G4', 0.25],
  ['A4', 1],
  ['G4', 1],
  ['D5', 1],
  ['C5', 2],

  ['G4', 0.75],
  ['G4', 0.25],
  ['G5', 1],
  ['E5', 1],
  ['C5', 1],
  ['B4', 1],
  ['A4', 2],

  ['F5', 0.75],
  ['F5', 0.25],
  ['E5', 1],
  ['C5', 1],
  ['D5', 1],
  ['C5', 2]
];

const frequencies = {
  G4: 392.00,
  A4: 440.00,
  B4: 493.88,
  C5: 523.25,
  D5: 587.33,
  E5: 659.25,
  F5: 698.46,
  G5: 783.99
};

/* Update music button */

function updateMusicButton() {
  if (!musicButton) return;

  musicButton.textContent = playing
    ? '♫ STOP MUSIC'
    : '♫ PLAY BIRTHDAY SONG';

  musicButton.setAttribute(
    'aria-pressed',
    String(playing)
  );
}

/* Stop active and scheduled notes */

function stopActiveNotes() {
  clearTimeout(notesTimeout);
  notesTimeout = null;

  if (audioContext) {
    const now = audioContext.currentTime;

    currentNodes.forEach(({ gain, osc }) => {
      try {
        gain.gain.cancelScheduledValues(now);

        gain.gain.setTargetAtTime(
          0.0001,
          now,
          0.03
        );

        osc.stop(now + 0.15);
      } catch (error) {
        // The oscillator may already have stopped.
      }
    });
  }

  currentNodes = [];
}

/* Stop birthday music */

function stopMusic(userStopped = false) {
  musicGeneration++;

  playing = false;
  startingMusic = false;

  if (userStopped) {
    manualMusicOff = true;
  }

  stopActiveNotes();
  updateMusicButton();
}

/* Schedule one melody cycle */

function scheduleMelody(generation) {
  if (
    !playing ||
    !audioContext ||
    generation !== musicGeneration
  ) {
    return;
  }

  const beat = 0.43;
  const start = audioContext.currentTime + 0.08;

  let offset = 0;

  // Previous notes have already finished.
  currentNodes = [];

  melody.forEach(([note, duration]) => {
    const time = start + offset;
    const length = duration * beat;

    const oscillator =
      audioContext.createOscillator();

    const gain =
      audioContext.createGain();

    oscillator.type = 'sine';

    oscillator.frequency.setValueAtTime(
      frequencies[note],
      time
    );

    gain.gain.setValueAtTime(
      0.0001,
      time
    );

    gain.gain.exponentialRampToValueAtTime(
      0.075,
      time + 0.04
    );

    gain.gain.exponentialRampToValueAtTime(
      0.0001,
      time + length * 0.92
    );

    oscillator.connect(gain);
    gain.connect(audioContext.destination);

    oscillator.start(time);
    oscillator.stop(time + length);

    currentNodes.push({
      osc: oscillator,
      gain: gain
    });

    offset += length;
  });

  // Repeat the song after a short pause.
  notesTimeout = setTimeout(() => {
    if (
      playing &&
      generation === musicGeneration
    ) {
      scheduleMelody(generation);
    }
  }, (offset + 0.15) * 1000);
}

/* Start music */

async function playMusic() {
  if (
    playing ||
    startingMusic ||
    manualMusicOff
  ) {
    return;
  }

  const AudioContextClass =
    window.AudioContext ||
    window.webkitAudioContext;

  if (!AudioContextClass) {
    console.warn(
      'Browser tidak mendukung Web Audio.'
    );
    return;
  }

  startingMusic = true;

  const generation = ++musicGeneration;

  try {
    audioContext =
      audioContext || new AudioContextClass();

    // Some browsers allow this only after a gesture.
    await audioContext.resume();

    if (generation !== musicGeneration) {
      return;
    }

    if (audioContext.state !== 'running') {
      startingMusic = false;
      return;
    }

    playing = true;
    startingMusic = false;

    updateMusicButton();
    removeAutoPlayListeners();
    scheduleMelody(generation);

  } catch (error) {
    if (generation === musicGeneration) {
      startingMusic = false;
    }

    console.log(
      'Autoplay belum diizinkan. ' +
      'Musik menunggu interaksi pertama.'
    );
  }
}

/* First click/touch/keyboard fallback */

function firstInteraction(event) {
  if (playing || manualMusicOff) return;

  // Let the music button handle its own click.
  if (
    musicButton &&
    event.target instanceof Element &&
    event.target.closest('#musicButton')
  ) {
    return;
  }

  playMusic();
}

function removeAutoPlayListeners() {
  document.removeEventListener(
    'pointerdown',
    firstInteraction
  );

  document.removeEventListener(
    'keydown',
    firstInteraction
  );
}

/* Music button */

if (musicButton) {
  musicButton.addEventListener(
    'click',
    async () => {
      if (playing) {
        stopMusic(true);
      } else {
        manualMusicOff = false;
        await playMusic();
      }
    }
  );
}

/* Attempt to start as soon as page loads */

function attemptAutoPlay() {
  if (!manualMusicOff) {
    playMusic();
  }
}

if (document.readyState === 'complete') {
  attemptAutoPlay();
} else {
  window.addEventListener(
    'load',
    attemptAutoPlay,
    { once: true }
  );
}

/* Browser autoplay fallback */

document.addEventListener(
  'pointerdown',
  firstInteraction
);

document.addEventListener(
  'keydown',
  firstInteraction
);

/* Stop music when leaving the tab */

document.addEventListener(
  'visibilitychange',
  () => {
    if (document.hidden && playing) {
      stopMusic(false);

      // Allow starting again when the page is used.
      manualMusicOff = false;

      document.addEventListener(
        'pointerdown',
        firstInteraction
      );

      document.addEventListener(
        'keydown',
        firstInteraction
      );
    }
  }
);

/* =========================================
   6. BIRTHDAY CONFETTI ANIMATION
========================================= */

const confetti = $('#confetti');

let pieces = [];
let confettiActive = false;
let confettiFrame = 0;

function celebrate() {
  const wishButton = $('#wishButton');

  if (reduced) {
    if (wishButton) {
      wishButton.innerHTML =
        'YOUR WISH IS MY WISH <span>♡</span>';
    }

    return;
  }

  if (!confetti) return;

  const dpr = Math.min(
    window.devicePixelRatio || 1,
    2
  );

  confetti.width = Math.round(
    window.innerWidth * dpr
  );

  confetti.height = Math.round(
    window.innerHeight * dpr
  );

  const ctx = confetti.getContext('2d');

  ctx.setTransform(
    dpr, 0, 0, dpr, 0, 0
  );

  pieces = Array.from(
    { length: 180 },
    () => ({
      x: Math.random() * window.innerWidth,

      y: -Math.random() *
        window.innerHeight * 0.7,

      vx: (Math.random() - 0.5) * 2.8,

      vy: 1.7 + Math.random() * 3.3,

      angle: Math.random() * 6,

      size: 3 + Math.random() * 6,

      color: [
        '#d5b77c',
        '#f0ddba',
        '#59d6a3',
        '#ffffff'
      ][Math.floor(Math.random() * 4)]
    })
  );

  if (confettiActive) return;

  confettiActive = true;
  confettiFrame = 0;

  function animateConfetti() {
    ctx.clearRect(
      0,
      0,
      window.innerWidth,
      window.innerHeight
    );

    pieces.forEach(piece => {
      piece.x += piece.vx;
      piece.y += piece.vy;
      piece.angle += 0.045;

      ctx.save();

      ctx.translate(
        piece.x,
        piece.y
      );

      ctx.rotate(piece.angle);

      ctx.fillStyle = piece.color;

      ctx.fillRect(
        -piece.size / 2,
        -piece.size / 2,
        piece.size,
        piece.size * 0.55
      );

      ctx.restore();
    });

    confettiFrame++;

    if (confettiFrame < 310) {
      requestAnimationFrame(
        animateConfetti
      );
    } else {
      ctx.clearRect(
        0,
        0,
        window.innerWidth,
        window.innerHeight
      );

      confettiActive = false;
    }
  }

  animateConfetti();
}

/* =========================================
   7. FINAL BIRTHDAY SURPRISE
========================================= */

const wishButton = $('#wishButton');

if (wishButton) {
  wishButton.addEventListener(
    'click',
    () => {
      celebrate();

      wishButton.innerHTML =
        'YOUR WISH IS MY WISH <span>♡</span>';
    }
  );
}

/* =========================================
   END OF GSR BIRTHDAY JAVASCRIPT
========================================= */
