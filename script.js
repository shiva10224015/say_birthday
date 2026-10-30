
"use strict";

/* ==========================================
   GSR BIRTHDAY — FINAL JAVASCRIPT
   6 bab, musik, surat, grafik, confetti
========================================== */

document.addEventListener("DOMContentLoaded", () => {

  // ========================================
  // 1. NAVIGASI ANTARBAB
  // ========================================

  const chapters = [
    ...document.querySelectorAll(".chapter")
  ];

  const backButton =
    document.getElementById("backButton");

  const nextButton =
    document.getElementById("nextButton");

  const currentChapter =
    document.getElementById("currentChapter");

  const homeLink =
    document.getElementById("homeLink");

  const nextLabels = [
    "Mulai Kejutan Ini ✨",
    "Masih Ada yang Ingin Aku Ceritakan ♡",
    "Ada Sesuatu Buat Kamu 💌",
    "Lanjut ke Kejutan Berikutnya →",
    "Siap untuk Kejutan Terakhir? ✨"
  ];

  let currentIndex = 0;

  function showChapter(index) {
    if (index < 0 || index >= chapters.length) {
      return;
    }

    currentIndex = index;

    chapters.forEach((chapter, i) => {
      const isActive = i === index;

      chapter.classList.toggle("active", isActive);
      chapter.setAttribute(
        "aria-hidden",
        String(!isActive)
      );

      if (isActive) {
        chapter.scrollTop = 0;
      }
    });

    backButton.disabled = index === 0;

    nextButton.hidden =
      index === chapters.length - 1;

    if (!nextButton.hidden) {
      nextButton.textContent =
        nextLabels[index] || "Lanjutkan →";
    }

    currentChapter.textContent =
      String(index + 1).padStart(2, "0");

    document.title =
      index === chapters.length - 1
        ? "Happy Birthday, Sayang ♡"
        : "Untuk Gilang, dengan Cinta ♡";

    if (index === 1) {
      drawMarketChart();
    }

    if (index === chapters.length - 1) {
      launchConfetti(90);
    }
  }

  nextButton.addEventListener("click", () => {
    showChapter(currentIndex + 1);
    startMusicOnInteraction();
  });

  backButton.addEventListener("click", () => {
    showChapter(currentIndex - 1);
  });

  homeLink.addEventListener("click", event => {
    event.preventDefault();
    showChapter(0);
  });

  showChapter(0);


  // ========================================
  // 2. SURAT CINTA INTERAKTIF
  // ========================================

  const openLetter =
    document.getElementById("openLetter");

  const letterContent =
    document.getElementById("letterContent");

  const letterHint =
    document.getElementById("letterHint");

  openLetter.addEventListener("click", () => {
    const isClosed = letterContent.hidden;

    letterContent.hidden = !isClosed;

    openLetter.classList.toggle(
      "opened",
      isClosed
    );

    openLetter.setAttribute(
      "aria-expanded",
      String(isClosed)
    );

    letterHint.textContent = isClosed
      ? "Surat ini khusus untuk kamu, Sayang ♡"
      : "Ketuk amplop untuk membuka surat ♡";

    if (isClosed) {
      setTimeout(() => {
        letterContent.scrollIntoView({
          behavior: "smooth",
          block: "nearest"
        });
      }, 100);
    }
  });


  // ========================================
  // 3. GRAFIK CANDLESTICK DEKORATIF
  // ========================================

  const marketCanvas =
    document.getElementById("marketChart");

  const marketContext =
    marketCanvas.getContext("2d");

  let chartData = [];

  function createChartData() {
    let price = 55;

    chartData = Array.from({ length: 24 }, () => {
      const open = price;
      const close =
        open + (Math.random() - .42) * 14;

      const high =
        Math.max(open, close) +
        Math.random() * 7;

      const low =
        Math.min(open, close) -
        Math.random() * 7;

      price = close;

      return { open, close, high, low };
    });
  }

  function drawMarketChart() {
    if (!marketCanvas || !marketContext) {
      return;
    }

    const bounds =
      marketCanvas.getBoundingClientRect();

    if (bounds.width < 1 || bounds.height < 1) {
      return;
    }

    const dpr = window.devicePixelRatio || 1;
    const width = bounds.width;
    const height = bounds.height;

    marketCanvas.width =
      Math.round(width * dpr);

    marketCanvas.height =
      Math.round(height * dpr);

    marketContext.setTransform(
      dpr, 0, 0, dpr, 0, 0
    );

    marketContext.clearRect(
      0, 0, width, height
    );

    // Garis horizontal dekoratif
    marketContext.strokeStyle =
      "rgba(217,186,128,.11)";

    marketContext.lineWidth = 1;

    for (let i = 1; i < 5; i++) {
      const y = height * i / 5;

      marketContext.beginPath();
      marketContext.moveTo(0, y);
      marketContext.lineTo(width, y);
      marketContext.stroke();
    }

    if (!chartData.length) {
      createChartData();
    }

    const allValues = chartData.flatMap(
      item => [item.high, item.low]
    );

    const min = Math.min(...allValues) - 5;
    const max = Math.max(...allValues) + 5;

    function toY(value) {
      return (
        height - 12 -
        ((value - min) / (max - min)) *
        (height - 24)
      );
    }

    const slotWidth = width / chartData.length;
    const candleWidth = Math.max(
      3,
      Math.min(12, slotWidth * .52)
    );

    chartData.forEach((item, index) => {
      const x =
        slotWidth * index + slotWidth / 2;

      const rising =
        item.close >= item.open;

      const color = rising
        ? "#d9ba80"
        : "#6588a5";

      marketContext.strokeStyle = color;
      marketContext.fillStyle = color;
      marketContext.lineWidth = 1.5;

      // Sumbu atas-bawah candle
      marketContext.beginPath();
      marketContext.moveTo(x, toY(item.high));
      marketContext.lineTo(x, toY(item.low));
      marketContext.stroke();

      // Badan candle
      const top = Math.min(
        toY(item.open),
        toY(item.close)
      );

      const bodyHeight = Math.max(
        2,
        Math.abs(
          toY(item.open) - toY(item.close)
        )
      );

      marketContext.fillRect(
        x - candleWidth / 2,
        top,
        candleWidth,
        bodyHeight
      );
    });
  }

  window.addEventListener("resize", () => {
    if (currentIndex === 1) {
      drawMarketChart();
    }
  });


  // ========================================
  // 4. MUSIK HAPPY BIRTHDAY INSTRUMENTAL
  // ========================================

  const musicButton =
    document.getElementById("musicButton");

  const AudioContextClass =
    window.AudioContext ||
    window.webkitAudioContext;

  let audioContext = null;
  let musicEnabled = false;
  let musicTimer = null;
  let nextNoteTime = 0;
  let noteIndex = 0;

  // Melodi tradisional Happy Birthday
  // Nada dalam format frekuensi dan durasi ketukan.
  const melody = [
    [392.00, .5], [392.00, .5],
    [440.00, 1], [392.00, 1],
    [523.25, 1], [493.88, 2],

    [392.00, .5], [392.00, .5],
    [440.00, 1], [392.00, 1],
    [587.33, 1], [523.25, 2],

    [392.00, .5], [392.00, .5],
    [783.99, 1], [659.25, 1],
    [523.25, 1], [493.88, 1],
    [440.00, 2],

    [698.46, .5], [698.46, .5],
    [659.25, 1], [523.25, 1],
    [587.33, 1], [523.25, 2]
  ];

  const beatSeconds = .43;

  function playTone(frequency, start, duration) {
    const oscillator =
      audioContext.createOscillator();

    const gain =
      audioContext.createGain();

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(
      frequency,
      start
    );

    gain.gain.setValueAtTime(
      .0001,
      start
    );

    gain.gain.exponentialRampToValueAtTime(
      .075,
      start + .025
    );

    gain.gain.exponentialRampToValueAtTime(
      .0001,
      start + duration
    );

    oscillator.connect(gain);
    gain.connect(audioContext.destination);

    oscillator.start(start);
    oscillator.stop(start + duration + .02);
  }

  function scheduleMusic() {
    if (!musicEnabled || !audioContext) {
      return;
    }

    const lookAhead = .25;

    while (
      nextNoteTime <
      audioContext.currentTime + lookAhead
    ) {
      const [frequency, beats] =
        melody[noteIndex];

      const duration =
        beats * beatSeconds;

      playTone(
        frequency,
        nextNoteTime,
        Math.max(.08, duration * .9)
      );

      nextNoteTime += duration;
      noteIndex =
        (noteIndex + 1) % melody.length;

      if (noteIndex === 0) {
        nextNoteTime += .7;
      }
    }
  }

  async function startMusic() {
    if (!AudioContextClass) {
      musicButton.textContent =
        "♪ Musik tidak didukung";
      return;
    }

    try {
      if (!audioContext) {
        audioContext = new AudioContextClass();
      }

      await audioContext.resume();

      if (musicEnabled) {
        return;
      }

      musicEnabled = true;
      noteIndex = 0;

      nextNoteTime =
        audioContext.currentTime + .08;

      scheduleMusic();

      musicTimer = setInterval(
        scheduleMusic,
        100
      );

      musicButton.textContent =
        "♫ Musik: Nyala";

      musicButton.setAttribute(
        "aria-pressed",
        "true"
      );

      musicButton.setAttribute(
        "aria-label",
        "Matikan musik"
      );

    } catch (error) {
      console.warn(
        "Musik belum bisa diputar:",
        error
      );
    }
  }

  function stopMusic() {
    musicEnabled = false;

    clearInterval(musicTimer);
    musicTimer = null;

    // Menghentikan suara yang sedang berjalan.
    if (audioContext) {
      audioContext.suspend().catch(() => {});
    }

    musicButton.textContent =
      "♪ Musik: Mati";

    musicButton.setAttribute(
      "aria-pressed",
      "false"
    );

    musicButton.setAttribute(
      "aria-label",
      "Nyalakan musik"
    );
  }

  function startMusicOnInteraction() {
    if (!musicEnabled) {
      startMusic();
    }
  }

  musicButton.addEventListener(
    "click",
    () => {
      if (musicEnabled) {
        stopMusic();
      } else {
        startMusic();
      }
    }
  );


  // ========================================
  // 5. CONFETTI EMAS
  // ========================================

  const confettiCanvas =
    document.getElementById("confettiCanvas");

  const confettiContext =
    confettiCanvas.getContext("2d");

  let particles = [];
  let confettiAnimation = null;

  const confettiColors = [
    "#d9ba80",
    "#f1dfb9",
    "#ffffff",
    "#9fbcda",
    "#b88953"
  ];

  function resizeConfetti() {
    const dpr = window.devicePixelRatio || 1;

    confettiCanvas.width =
      Math.round(window.innerWidth * dpr);

    confettiCanvas.height =
      Math.round(window.innerHeight * dpr);

    confettiContext.setTransform(
      dpr, 0, 0, dpr, 0, 0
    );
  }

  window.addEventListener(
    "resize",
    resizeConfetti
  );

  resizeConfetti();

  function launchConfetti(amount = 120) {
    resizeConfetti();

    for (let i = 0; i < amount; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: -20 - Math.random() * 300,
        vx: (Math.random() - .5) * 3,
        vy: 1.7 + Math.random() * 3,
        width: 4 + Math.random() * 6,
        height: 5 + Math.random() * 8,
        rotation: Math.random() * 6,
        spin: (Math.random() - .5) * .15,
        color: confettiColors[
          Math.floor(
            Math.random() * confettiColors.length
          )
        ],
        life: 0
      });
    }

    if (confettiAnimation === null) {
      animateConfetti();
    }
  }

  function animateConfetti() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    confettiContext.clearRect(
      0, 0, width, height
    );

    particles = particles.filter(
      particle =>
        particle.y < height + 30 &&
        particle.life < 450
    );

    particles.forEach(particle => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.rotation += particle.spin;
      particle.life++;

      confettiContext.save();

      confettiContext.translate(
        particle.x,
        particle.y
      );

      confettiContext.rotate(
        particle.rotation
      );

      confettiContext.fillStyle =
        particle.color;

      confettiContext.fillRect(
        -particle.width / 2,
        -particle.height / 2,
        particle.width,
        particle.height
      );

      confettiContext.restore();
    });

    if (particles.length > 0) {
      confettiAnimation =
        requestAnimationFrame(
          animateConfetti
        );
    } else {
      confettiAnimation = null;

      confettiContext.clearRect(
        0, 0, width, height
      );
    }
  }


  // ========================================
  // 6. KEJUTAN TERAKHIR
  // ========================================

  const makeWish =
    document.getElementById("makeWish");

  const wishResult =
    document.getElementById("wishResult");

  const cakeScene =
    document.querySelector(".cake-scene");

  makeWish.addEventListener("click", () => {
    cakeScene.classList.add("wished");

    wishResult.textContent =
      "Aamiin. Semoga semua doa baikmu terkabul, Sayang. ♡";

    makeWish.textContent =
      "✨ Rayakan Sekali Lagi";

    launchConfetti(220);

    startMusicOnInteraction();
  });

});
