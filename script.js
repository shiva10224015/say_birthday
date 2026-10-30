
"use strict";

document.addEventListener("DOMContentLoaded", () => {

  /* =====================================
     1. NAVIGASI TUJUH BAB
  ===================================== */

  const chapters = [
    ...document.querySelectorAll(".chapter")
  ];

  const nextButton = document.getElementById("nextButton");
  const backButton = document.getElementById("backButton");
  const currentChapter = document.getElementById("currentChapter");
  const homeButton = document.getElementById("homeButton");
  const replayButton = document.getElementById("replayButton");

  const nextLabels = [
    "Mulai Kejutan Ini ✨",
    "Masih Ada yang Ingin Aku Ceritakan ♡",
    "Lihat Kenangan Kita ♡",
    "Ada Surat Kecil Untukmu 💌",
    "Lanjut ke Doa-Doa Baik ♡",
    "Siap untuk Kejutan Terakhir? ✨"
  ];

  let currentPage = 0;

  function showChapter(index) {
    if (index < 0 || index >= chapters.length) {
      return;
    }

    currentPage = index;

    chapters.forEach((chapter, i) => {
      const active = i === index;

      chapter.classList.toggle("active", active);
      chapter.setAttribute("aria-hidden", String(!active));

      if (active) {
        chapter.scrollTop = 0;
      }
    });

    backButton.disabled = index === 0;
    nextButton.hidden = index === chapters.length - 1;

    if (!nextButton.hidden) {
      nextButton.textContent =
        nextLabels[index] || "Lanjutkan ♡";
    }

    currentChapter.textContent =
      String(index + 1).padStart(2, "0");

    document.title = index === 6
      ? "Happy Birthday, Sayang ♡"
      : "Untuk Gilang, dengan Cinta ♡";

    if (index === 1) {
      drawChart();
    }

    if (index === 6) {
      launchConfetti(100);
    }
  }

  nextButton.addEventListener("click", () => {
    showChapter(currentPage + 1);
  });

  backButton.addEventListener("click", () => {
    showChapter(currentPage - 1);
  });

  homeButton.addEventListener("click", () => {
    showChapter(0);
  });

  replayButton.addEventListener("click", () => {
    showChapter(0);
  });

  showChapter(0);


  /* =====================================
     2. GRAFIK CANDLESTICK ILUSTRATIF
  ===================================== */

  const chartCanvas = document.getElementById("marketChart");
  const chartCtx = chartCanvas.getContext("2d");

  let candles = [];

  function generateCandles() {
    let price = 50;

    candles = Array.from({ length: 25 }, () => {
      const open = price;
      const close = open + (Math.random() - 0.43) * 12;
      const high = Math.max(open, close) + Math.random() * 7;
      const low = Math.min(open, close) - Math.random() * 7;

      price = close;

      return { open, close, high, low };
    });
  }

  function drawChart() {
    const rect = chartCanvas.getBoundingClientRect();

    if (!rect.width || !rect.height) return;

    const dpr = window.devicePixelRatio || 1;

    chartCanvas.width = Math.round(rect.width * dpr);
    chartCanvas.height = Math.round(rect.height * dpr);

    chartCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    chartCtx.clearRect(0, 0, rect.width, rect.height);

    if (!candles.length) {
      generateCandles();
    }

    const values = candles.flatMap(c => [c.high, c.low]);
    const minimum = Math.min(...values) - 5;
    const maximum = Math.max(...values) + 5;

    const toY = value =>
      rect.height - 12 -
      ((value - minimum) / (maximum - minimum)) *
      (rect.height - 24);

    chartCtx.strokeStyle = "rgba(217,186,128,.13)";
    chartCtx.lineWidth = 1;

    for (let i = 1; i < 5; i++) {
      const y = rect.height * i / 5;

      chartCtx.beginPath();
      chartCtx.moveTo(0, y);
      chartCtx.lineTo(rect.width, y);
      chartCtx.stroke();
    }

    const slot = rect.width / candles.length;
    const bodyWidth = Math.max(3, Math.min(11, slot * 0.5));

    candles.forEach(candle => {
      const i = candles.indexOf(candle);
      const x = slot * i + slot / 2;

      const color = candle.close >= candle.open
        ? "#d9ba80"
        : "#698da8";

      chartCtx.strokeStyle = color;
      chartCtx.fillStyle = color;
      chartCtx.lineWidth = 1.5;

      chartCtx.beginPath();
      chartCtx.moveTo(x, toY(candle.high));
      chartCtx.lineTo(x, toY(candle.low));
      chartCtx.stroke();

      const top = Math.min(
        toY(candle.open),
        toY(candle.close)
      );

      const height = Math.max(
        2,
        Math.abs(toY(candle.open) - toY(candle.close))
      );

      chartCtx.fillRect(
        x - bodyWidth / 2,
        top,
        bodyWidth,
        height
      );
    });
  }

  window.addEventListener("resize", () => {
    if (currentPage === 1) {
      drawChart();
    }
  });


  /* =====================================
     3. SURAT CINTA
  ===================================== */

  const openLetter = document.getElementById("openLetter");
  const letterContent = document.getElementById("letterContent");
  const letterHint = document.getElementById("letterHint");

  openLetter.addEventListener("click", () => {
    const opening = letterContent.hidden;

    letterContent.hidden = !opening;
    openLetter.classList.toggle("opened", opening);

    openLetter.setAttribute(
      "aria-expanded",
      String(opening)
    );

    letterHint.textContent = opening
      ? "Surat ini hanya untuk kamu, Sayang ♡"
      : "Klik amplopnya, ya, Sayang. 💌";

    if (opening) {
      setTimeout(() => {
        letterContent.scrollIntoView({
          behavior: "smooth",
          block: "nearest"
        });
      }, 120);
    }
  });


  /* =====================================
     4. MUSIK HAPPY BIRTHDAY INSTRUMENTAL
  ===================================== */

  const musicButton = document.getElementById("musicButton");

  const AudioContextClass =
    window.AudioContext || window.webkitAudioContext;

  let audioCtx = null;
  let masterGain = null;
  let musicOn = false;
  let musicTimer = null;
  let notePosition = 0;
  let nextNoteTime = 0;

  const melody = [
    [392.00, 0.5], [392.00, 0.5],
    [440.00, 1],   [392.00, 1],
    [523.25, 1],   [493.88, 2],

    [392.00, 0.5], [392.00, 0.5],
    [440.00, 1],   [392.00, 1],
    [587.33, 1],   [523.25, 2],

    [392.00, 0.5], [392.00, 0.5],
    [783.99, 1],   [659.25, 1],
    [523.25, 1],   [493.88, 1],
    [440.00, 2],

    [698.46, 0.5], [698.46, 0.5],
    [659.25, 1],   [523.25, 1],
    [587.33, 1],   [523.25, 2]
  ];

  const beat = 0.43;

  function playNote(frequency, start, duration) {
    const oscillator = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(frequency, start);

    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(
      0.12,
      start + 0.025
    );
    gain.gain.exponentialRampToValueAtTime(
      0.0001,
      start + duration
    );

    oscillator.connect(gain);
    gain.connect(masterGain);

    oscillator.start(start);
    oscillator.stop(start + duration + 0.02);
  }

  function scheduleNotes() {
    if (!musicOn || !audioCtx) return;

    while (nextNoteTime < audioCtx.currentTime + 0.25) {
      const [frequency, beats] = melody[notePosition];
      const duration = beats * beat;

      playNote(
        frequency,
        nextNoteTime,
        Math.max(0.08, duration * 0.9)
      );

      nextNoteTime += duration;

      notePosition = (notePosition + 1) % melody.length;

      if (notePosition === 0) {
        nextNoteTime += 0.8;
      }
    }
  }

  async function startMusic() {
    if (!AudioContextClass || musicOn) return;

    try {
      if (!audioCtx) {
        audioCtx = new AudioContextClass();
        masterGain = audioCtx.createGain();
        masterGain.gain.value = 1;
        masterGain.connect(audioCtx.destination);
      }

      await audioCtx.resume();

      if (musicOn) return;

      masterGain.gain.cancelScheduledValues(audioCtx.currentTime);
      masterGain.gain.setValueAtTime(1, audioCtx.currentTime);

      musicOn = true;
      notePosition = 0;
      nextNoteTime = audioCtx.currentTime + 0.08;

      scheduleNotes();
      musicTimer = setInterval(scheduleNotes, 100);

      musicButton.textContent = "♫ Musik: Nyala";
      musicButton.setAttribute("aria-pressed", "true");

    } catch (error) {
      console.warn("Musik gagal dimulai:", error);
      musicButton.textContent = "Coba Nyalakan Musik Lagi";
    }
  }

  function stopMusic() {
    musicOn = false;

    clearInterval(musicTimer);
    musicTimer = null;

    if (masterGain && audioCtx) {
      masterGain.gain.cancelScheduledValues(audioCtx.currentTime);
      masterGain.gain.setValueAtTime(0, audioCtx.currentTime);
    }

    musicButton.textContent = "♪ Musik: Mati";
    musicButton.setAttribute("aria-pressed", "false");
  }

    // Coba nyalakan musik saat website dibuka.
  // Browser mungkin tetap meminta interaksi pengguna.
  musicButton.addEventListener("click", () => {
    if (musicOn) {
      stopMusic();
    } else {
      startMusic();
    }
  });

  // Percobaan otomatis saat halaman dibuka.
  window.addEventListener("load", () => {
    startMusic();
  });

  // Jika autoplay diblokir, coba lagi saat pengunjung
  // pertama kali berinteraksi dengan halaman.
  function tryAutoplay() {
    if (!musicOn) {
      startMusic();
    }

    document.removeEventListener("click", tryAutoplay);
    document.removeEventListener("keydown", tryAutoplay);
    document.removeEventListener("touchstart", tryAutoplay);
  }

  document.addEventListener("click", tryAutoplay);
  document.addEventListener("keydown", tryAutoplay);
  document.addEventListener("touchstart", tryAutoplay);


  /* =====================================
     5. CONFETTI EMAS
  ===================================== */

  const confettiCanvas = document.getElementById("confettiCanvas");
  const confettiCtx = confettiCanvas.getContext("2d");

  const colors = [
    "#d9ba80",
    "#f4dfb9",
    "#ffffff",
    "#b78d57",
    "#a7c3dc"
  ];

  let confetti = [];
  let confettiRunning = false;

  function resizeConfetti() {
    const dpr = window.devicePixelRatio || 1;

    confettiCanvas.width = Math.round(innerWidth * dpr);
    confettiCanvas.height = Math.round(innerHeight * dpr);

    confettiCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  window.addEventListener("resize", resizeConfetti);
  resizeConfetti();

  function launchConfetti(amount = 120) {
    resizeConfetti();

    for (let i = 0; i < amount; i++) {
      confetti.push({
        x: Math.random() * innerWidth,
        y: -20 - Math.random() * 250,
        vx: (Math.random() - 0.5) * 3,
        vy: 1.5 + Math.random() * 3,
        w: 4 + Math.random() * 6,
        h: 5 + Math.random() * 8,
        rotation: Math.random() * 6,
        spin: (Math.random() - 0.5) * 0.15,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 0
      });
    }

    if (!confettiRunning) {
      confettiRunning = true;
      animateConfetti();
    }
  }

  function animateConfetti() {
    confettiCtx.clearRect(0, 0, innerWidth, innerHeight);

    confetti = confetti.filter(
      p => p.y < innerHeight + 30 && p.life < 450
    );

    confetti.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.spin;
      p.life++;

      confettiCtx.save();
      confettiCtx.translate(p.x, p.y);
      confettiCtx.rotate(p.rotation);
      confettiCtx.fillStyle = p.color;

      confettiCtx.fillRect(
        -p.w / 2,
        -p.h / 2,
        p.w,
        p.h
      );

      confettiCtx.restore();
    });

    if (confetti.length) {
      requestAnimationFrame(animateConfetti);
    } else {
      confettiRunning = false;
    }
  }


  /* =====================================
     6. BUAT PERMOHONAN ULANG TAHUN
  ===================================== */

  const makeWish = document.getElementById("makeWish");
  const cakeScene = document.getElementById("cakeScene");
  const wishResult = document.getElementById("wishResult");

  makeWish.addEventListener("click", () => {
    cakeScene.classList.add("wished");

    wishResult.textContent =
      "Aamiin. Semoga semua doa baikmu terkabul, Sayang. ♡";

    makeWish.textContent = "✨ Rayakan Sekali Lagi";

    launchConfetti(230);
  });

});
