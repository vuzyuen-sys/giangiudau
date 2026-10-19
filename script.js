
"use strict";

(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  const scenes = $$(".scene");
  const dots = $$(".nav-dot");
  const pageCounter = $("#pageCounter");
  const prevButton = $("#prevButton");
  const nextButton = $("#nextButton");
  const toast = $("#toast");

  let currentScene = 0;
  let isTransitioning = false;
  let toastTimer;
  let heartFrame = 0;
  let heartPulse = 0;
  let heartSurpriseUntil = 0;
  let flowerCount = 0;
  let luckCount = 0;
  let letterOpened = false;
  let giftOpened = false;
  let musicPlaying = false;
  let activeHeartCanvas = false;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // -------------------------------------------------------
  // THÔNG BÁO NHỎ
  // -------------------------------------------------------
  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2300);
  }

  // -------------------------------------------------------
  // CHUYỂN 8 MÀN HÌNH
  // -------------------------------------------------------
  function updateNavigation() {
    pageCounter.textContent =
      `${String(currentScene + 1).padStart(2, "0")} / ${String(scenes.length).padStart(2, "0")}`;

    dots.forEach((dot, index) => {
      dot.classList.toggle("current", index === currentScene);
      if (index === currentScene) dot.setAttribute("aria-current", "step");
      else dot.removeAttribute("aria-current");
    });

    prevButton.disabled = currentScene === 0;
    nextButton.disabled = currentScene === scenes.length - 1;
    $("#musicToggle").classList.toggle("playing", musicPlaying);
  }

  function goToScene(index) {
    if (isTransitioning || index < 0 || index >= scenes.length || index === currentScene) return;

    isTransitioning = true;
    const oldIndex = currentScene;
    const oldScene = scenes[oldIndex];
    const newScene = scenes[index];

    oldScene.classList.toggle("leaving-back", index < oldIndex);
    oldScene.classList.remove("active");
    newScene.classList.remove("leaving-back");
    newScene.classList.add("active");

    currentScene = index;
    updateNavigation();

    if (index === 1) {
      resizeHeartCanvas();
      activeHeartCanvas = true;
    } else {
      activeHeartCanvas = false;
    }

    if (index === 2 && luckCount === 0) {
      typeWish();
      createMoneyRain(24);
    }

    if (index === 5 && !$("#starField").childElementCount) createBackgroundStars();
    if (index === 7 && !$("#finalPetals").childElementCount) createFinalPetals();

    window.setTimeout(() => {
      oldScene.classList.remove("leaving-back");
      isTransitioning = false;
    }, reducedMotion ? 30 : 850);
  }

  prevButton.addEventListener("click", () => goToScene(currentScene - 1));
  nextButton.addEventListener("click", () => goToScene(currentScene + 1));
  dots.forEach(dot => dot.addEventListener("click", () => goToScene(Number(dot.dataset.go))));

  $$("[data-next]").forEach(button => {
    button.addEventListener("click", () => goToScene(currentScene + 1));
  });

  $("#homeLink").addEventListener("click", event => {
    event.preventDefault();
    goToScene(0);
  });

  $("#restartButton").addEventListener("click", () => {
    goToScene(0);
    showToast("Bắt đầu lại hành trình dành cho Giang ♡");
  });

  document.addEventListener("keydown", event => {
    if (event.key === "ArrowRight") goToScene(currentScene + 1);
    if (event.key === "ArrowLeft") goToScene(currentScene - 1);
    if (event.key === "Escape") $("#toast").classList.remove("show");
  });

  // -------------------------------------------------------
  // HOA VÀ HẠT SÁNG TRANG TRÍ
  // -------------------------------------------------------
  function createFloatingPetals() {
    if (reducedMotion) return;
    const layer = $("#petals");
    const symbols = ["✿", "❀", "✧", "·"];
    const colors = ["#e9a2bd", "#d5a6d7", "#f3c7d5", "#e9c49c"];
    const count = window.innerWidth < 600 ? 10 : 18;

    for (let i = 0; i < count; i++) {
      const petal = document.createElement("span");
      petal.className = "falling-petal";
      petal.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      petal.style.setProperty("--left", `${Math.random() * 100}%`);
      petal.style.setProperty("--size", `${8 + Math.random() * 15}px`);
      petal.style.setProperty("--duration", `${13 + Math.random() * 16}s`);
      petal.style.setProperty("--delay", `${-Math.random() * 25}s`);
      petal.style.setProperty("--drift", `${Math.random() * 100 - 50}px`);
      petal.style.setProperty("--rotation", `${Math.random() * 600 - 300}deg`);
      petal.style.setProperty("--opacity", `${0.22 + Math.random() * 0.35}`);
      petal.style.setProperty("--petal-color", colors[Math.floor(Math.random() * colors.length)]);
      layer.appendChild(petal);
    }
  }

  function createParticles(x, y, amount = 14) {
    const layer = $("#particles");
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < amount; i++) {
      const particle = document.createElement("span");
      particle.className = "float-particle";
      particle.style.setProperty("--left", `${x + Math.random() * 8 - 4}%`);
      particle.style.setProperty("--top", `${y + Math.random() * 8 - 4}%`);
      particle.style.setProperty("--size", `${2 + Math.random() * 4}px`);
      particle.style.setProperty("--duration", `${0.8 + Math.random() * 1.1}s`);
      fragment.appendChild(particle);
      particle.addEventListener("animationend", () => particle.remove(), { once: true });
    }

    layer.appendChild(fragment);
  }

  createFloatingPetals();

  // -------------------------------------------------------
  // TRANG 1: MỞ PHONG BÌ
  // -------------------------------------------------------
  const envelope = $("#envelope");

  function openIntroEnvelope() {
    envelope.classList.add("open");
    createParticles(50, 40, 18);
  }

  envelope.addEventListener("click", openIntroEnvelope);
  envelope.addEventListener("keydown", event => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openIntroEnvelope();
    }
  });

  // -------------------------------------------------------
  // TRANG 2: TRÁI TIM TỪ NHIỀU TRÁI TIM NHỎ
  // -------------------------------------------------------
  const heartCanvas = $("#heartCanvas");
  const heartCtx = heartCanvas.getContext("2d");
  let heartPoints = [];
  let heartDpr = 1;

  function heartEquation(t) {
    return {
      x: 16 * Math.pow(Math.sin(t), 3),
      y: 13 * Math.cos(t) - 5 * Math.cos(2 * t)
        - 2 * Math.cos(3 * t) - Math.cos(4 * t)
    };
  }

  function makeHeartPoints() {
    const points = [];
    const total = window.innerWidth < 600 ? 210 : 340;

    // Các lớp viền giúp trái tim đầy đặn và có chiều sâu.
    for (let i = 0; i < total; i++) {
      const t = (Math.PI * 2 * i) / total;
      const edge = heartEquation(t);

      points.push({
        x: edge.x,
        y: edge.y,
        size: 1.5 + Math.random() * 1.5,
        phase: Math.random() * Math.PI * 2,
        speed: 0.6 + Math.random() * 1.1,
        color: Math.random() > 0.5 ? "#ffb6d3" : "#ff83bb",
        edge: true
      });
    }

    for (let i = 0; i < total * 1.6; i++) {
      const t = Math.random() * Math.PI * 2;
      const r = Math.sqrt(Math.random());
      const p = heartEquation(t);

      points.push({
        x: p.x * r,
        y: p.y * r,
        size: 1.2 + Math.random() * 1.8,
        phase: Math.random() * Math.PI * 2,
        speed: 0.6 + Math.random() * 1.2,
        color: ["#ffc7df", "#fa9fc8", "#ffdce9", "#f58bbb"][Math.floor(Math.random() * 4)],
        edge: false
      });
    }
    return points;
  }

  function resizeHeartCanvas() {
    const rect = heartCanvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    heartDpr = Math.min(window.devicePixelRatio || 1, 2);
    heartCanvas.width = Math.round(rect.width * heartDpr);
    heartCanvas.height = Math.round(rect.height * heartDpr);
    heartCtx.setTransform(heartDpr, 0, 0, heartDpr, 0, 0);
    heartPoints = makeHeartPoints();
  }

  function drawTinyHeart(ctx, x, y, size, color, alpha) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(size / 16, size / 16);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(0, 5);
    ctx.bezierCurveTo(-12, -3, -8, -10, 0, -5);
    ctx.bezierCurveTo(8, -10, 12, -3, 0, 5);
    ctx.fill();
    ctx.restore();
  }

  function drawHeartFrame(timestamp) {
    if (!activeHeartCanvas || currentScene !== 1) {
      heartFrame = 0;
      return;
    }

    const rect = heartCanvas.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    if (!w || !h) {
      heartFrame = requestAnimationFrame(drawHeartFrame);
      return;
    }

    heartCtx.clearRect(0, 0, w, h);

    const pulse = 1 + Math.sin(timestamp * 0.0018) * 0.035
      + (timestamp < heartSurpriseUntil ? 0.1 : 0);

    const scale = Math.min(w / 39, h / 35) * 0.9 * pulse;
    const centerX = w / 2;
    const centerY = h / 2 + 5;

    heartPoints.forEach((point, index) => {
      const flutter = Math.sin(timestamp * 0.001 * point.speed + point.phase);
      const driftX = Math.cos(timestamp * 0.00045 + index) * 1.3;
      const driftY = Math.sin(timestamp * 0.00065 + point.phase) * 1.4;
      const x = centerX + point.x * scale + driftX;
      const y = centerY - point.y * scale + driftY;
      const alpha = 0.63 + (flutter + 1) * 0.16;
      const size = point.size * (0.85 + (flutter + 1) * 0.13);
      drawTinyHeart(heartCtx, x, y, size, point.color, alpha);
    });

    // Ánh sáng dịu ở tâm trái tim.
    const glow = heartCtx.createRadialGradient(centerX, centerY, 2, centerX, centerY, scale * 17);
    glow.addColorStop(0, "rgba(255,135,192,0.08)");
    glow.addColorStop(1, "rgba(255,135,192,0)");
    heartCtx.fillStyle = glow;
    heartCtx.fillRect(0, 0, w, h);

    heartFrame = requestAnimationFrame(drawHeartFrame);
  }

  function startHeartAnimation() {
    if (!activeHeartCanvas || heartFrame) return;
    heartFrame = requestAnimationFrame(drawHeartFrame);
  }

  function stopHeartAnimation() {
    if (heartFrame) cancelAnimationFrame(heartFrame);
    heartFrame = 0;
  }

  $("#heartSurprise").addEventListener("click", () => {
    heartSurpriseUntil = performance.now() + 1000;
    createParticles(50, 45, 30);
    $("#heartCaption").textContent =
      "Mong rằng những điều nhỏ bé mỗi ngày sẽ góp lại thành thật nhiều niềm vui dành cho Giang.";
    showToast("Gửi cậu thật nhiều trái tim nhỏ ♡");
  });

  // -------------------------------------------------------
  // TRANG 3: LỜI CHÚC GÕ TỪNG CHỮ VÀ TIỀN RƠI
  // -------------------------------------------------------
  const wishCopy =
    "Chúc Giang có một ngày 20/10 thật nhiều niềm vui, luôn gặp được những điều tử tế, " +
    "làm điều mình yêu thích và không bao giờ quên rằng bản thân xứng đáng được trân trọng. " +
    "Mong may mắn ghé thăm cậu mỗi ngày, ước mơ dần thành hiện thực, ví luôn rủng rỉnh " +
    "và nụ cười thì lúc nào cũng ở lại thật lâu.";

  let wishTyped = false;

  function typeWish() {
    if (wishTyped) return;
    wishTyped = true;
    const target = $("#wishText");
    target.textContent = "";
    let i = 0;

    function step() {
      if (currentScene !== 2) return;
      target.textContent = wishCopy.slice(0, i);
      i += 3;
      if (i <= wishCopy.length) {
        setTimeout(step, reducedMotion ? 0 : 24);
      } else {
        target.textContent = wishCopy;
      }
    }
    step();
  }

  function createMoneyRain(amount = 22) {
    const layer = $("#moneyRain");
    const symbols = ["💸", "💵", "🪙", "✨", "₫"];
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < amount; i++) {
      const item = document.createElement("span");
      item.className = "money-item";
      item.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      item.style.setProperty("--left", `${Math.random() * 100}%`);
      item.style.setProperty("--size", `${13 + Math.random() * 13}px`);
      item.style.setProperty("--duration", `${4.5 + Math.random() * 4}s`);
      item.style.setProperty("--delay", `${Math.random() * 2}s`);
      item.style.setProperty("--drift", `${Math.random() * 180 - 90}px`);
      item.style.setProperty("--rotation", `${Math.random() * 600 - 300}deg`);
      fragment.appendChild(item);
      item.addEventListener("animationend", () => item.remove(), { once: true });
    }

    layer.appendChild(fragment);
  }

  $("#moreLuck").addEventListener("click", () => {
    luckCount++;
    createMoneyRain(20);
    createParticles(50, 45, 20);

    if (luckCount >= 3) {
      showToast("Mong may mắn sẽ luôn đồng hành cùng Giang ✨");
    } else {
      showToast(["Một chút tài lộc!", "Thêm một chút may mắn nữa!"][luckCount - 1]);
    }
  });

  // -------------------------------------------------------
  // TRANG 4: TRỒNG HOA
  // -------------------------------------------------------
  const garden = $("#garden");
  const grownFlowers = $("#grownFlowers");
  const flowerCountLabel = $("#flowerCount");
  const gardenMessage = $("#gardenMessage");
  const flowerTypes = ["🌷", "🌸", "🌼", "🌺", "🌻", "💐", "🌷", "🌸", "🌼", "🌹"];

  function plantFlower() {
    if (flowerCount >= 10) {
      showToast("Khu vườn đã nở rộ rồi! 🌷");
      return;
    }

    const flower = document.createElement("span");
    flower.className = "grown-flower";
    flower.textContent = flowerTypes[flowerCount];
    const left = 10 + (flowerCount * 17.3) % 80;
    const bottom = 16 + (flowerCount % 3) * 5;

    flower.style.setProperty("--left", `${left}%`);
    flower.style.setProperty("--bottom", `${bottom}%`);
    flower.style.setProperty("--size", `${24 + (flowerCount % 3) * 5}px`);
    flower.style.animationDelay = `${flowerCount * 0.035}s`;
    grownFlowers.appendChild(flower);

    flowerCount++;
    flowerCountLabel.textContent = `${flowerCount} / 10 bông hoa đã nở`;

    if (flowerCount === 10) {
      gardenMessage.textContent = "Mong những ngày của Giang cũng rực rỡ như khu vườn này.";
      showToast("Khu vườn dành cho Giang đã nở rộ! ♡");
      createParticles(50, 50, 24);
    } else {
      gardenMessage.textContent = [
        "Một lời chúc bình an.",
        "Một lời chúc thật nhiều niềm vui.",
        "Một lời chúc luôn tự tin.",
        "Một lời chúc gặp nhiều may mắn.",
        "Một lời chúc những ước mơ thành hiện thực."
      ][(flowerCount - 1) % 5];
    }
  }

  garden.addEventListener("click", plantFlower);
  garden.addEventListener("keydown", event => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      plantFlower();
    }
  });

  $("#resetGarden").addEventListener("click", () => {
    flowerCount = 0;
    grownFlowers.replaceChildren();
    flowerCountLabel.textContent = "0 / 10 bông hoa đã nở";
    gardenMessage.textContent = "Mỗi bông hoa là một lời chúc tốt lành.";
  });

  // -------------------------------------------------------
  // TRANG 5: MỞ BỨC THƯ
  // -------------------------------------------------------
  const letterEnvelope = $("#letterEnvelope");

  function openPersonalLetter() {
    if (letterOpened) return;
    letterOpened = true;
    letterEnvelope.classList.add("open");
    $("#letterHint").textContent = "Một bức thư nhỏ gửi cậu ♡";
    $("#personalLetter").hidden = false;
    $("#letterContinue").textContent = "Còn một điều nữa... →";
    createParticles(50, 45, 18);
  }

  letterEnvelope.addEventListener("click", openPersonalLetter);
  letterEnvelope.addEventListener("keydown", event => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openPersonalLetter();
    }
  });

  // -------------------------------------------------------
  // TRANG 6: BẦU TRỜI VÀ LỜI CHÚC TỪ CÁC VÌ SAO
  // -------------------------------------------------------
  function createBackgroundStars() {
    const field = $("#starField");
    const fragment = document.createDocumentFragment();
    const amount = window.innerWidth < 600 ? 45 : 85;

    for (let i = 0; i < amount; i++) {
      const star = document.createElement("span");
      star.className = "bg-star";
      star.textContent = Math.random() > 0.6 ? "✦" : "·";
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      star.style.fontSize = `${5 + Math.random() * 10}px`;
      star.style.setProperty("--duration", `${1.4 + Math.random() * 3}s`);
      star.style.animationDelay = `${-Math.random() * 4}s`;
      fragment.appendChild(star);
    }

    field.appendChild(fragment);
  }

  const starWishes = {
    "Bình an": "Mong cậu luôn bình yên, ngay cả trong những ngày nhiều mây.",
    "Tự tin": "Mong cậu luôn tin vào giá trị và vẻ đẹp riêng của mình.",
    "May mắn": "Mong những điều tốt lành tìm đến cậu theo cách bất ngờ nhất.",
    "Thành công": "Mong mọi cố gắng của cậu dần nở thành những trái ngọt.",
    "Hạnh phúc": "Mong cậu tìm được niềm vui trong cả những điều nhỏ bé.",
    "Yêu thương": "Mong cậu luôn được đối xử bằng sự chân thành và tử tế."
  };

  $$(".star-point").forEach(star => {
    star.addEventListener("click", () => {
      const wish = star.dataset.wish;
      $("#starMessage").textContent = starWishes[wish];
      $$(".star-point").forEach(item => item.style.color = "");
      star.style.color = "#ffffff";
      createParticles(50, 50, 12);
    });
  });

  // -------------------------------------------------------
  // TRANG 7: MỞ HỘP QUÀ
  // -------------------------------------------------------
  $("#giftBox").addEventListener("click", () => {
    if (giftOpened) return;
    giftOpened = true;
    $("#giftBox").classList.add("open");
    $("#giftReveal").hidden = false;
    $("#giftHint").textContent = "Món quà nhỏ dành riêng cho cậu ♡";
    createParticles(50, 45, 30);
    showToast("Hy vọng món quà nhỏ này làm cậu vui!");
  });

  // -------------------------------------------------------
  // TRANG 8: CÁNH HOA BAY
  // -------------------------------------------------------
  function createFinalPetals() {
    const layer = $("#finalPetals");
    const fragment = document.createDocumentFragment();
    const amount = window.innerWidth < 600 ? 14 : 24;

    for (let i = 0; i < amount; i++) {
      const petal = document.createElement("span");
      petal.className = "final-petal";
      petal.textContent = ["✿", "❀", "✧"][Math.floor(Math.random() * 3)];
      petal.style.setProperty("--left", `${Math.random() * 100}%`);
      petal.style.setProperty("--size", `${10 + Math.random() * 18}px`);
      petal.style.setProperty("--duration", `${10 + Math.random() * 13}s`);
      petal.style.setProperty("--delay", `${-Math.random() * 20}s`);
      petal.style.setProperty("--drift", `${Math.random() * 120 - 60}px`);
      petal.style.setProperty("--rotation", `${Math.random() * 500 - 250}deg`);
      fragment.appendChild(petal);
    }

    layer.appendChild(fragment);
  }

  // -------------------------------------------------------
  
  // -------------------------------------------------------
  // NHẠC NỀN: PHÁT FILE MP3 TỰ TẢI LÊN GITHUB
  // -------------------------------------------------------
  const backgroundMusic = $("#backgroundMusic");
  const musicToggle = $("#musicToggle");
  const musicIcon = $("#musicIcon");
  const musicLabel = $("#musicLabel");
  const musicStatus = $("#musicStatus");

  // Âm lượng mặc định: 45%, có thể chỉnh từ 0 đến 1.
  backgroundMusic.volume = 0.45;

  function updateMusicButton(isPlaying) {
    musicPlaying = isPlaying;

    musicIcon.textContent = isPlaying ? "♫" : "♫";
    musicLabel.textContent = isPlaying ? "Tắt nhạc" : "Bật nhạc";

    musicToggle.setAttribute(
      "aria-label",
      isPlaying ? "Tắt nhạc" : "Bật nhạc"
    );

    musicToggle.classList.toggle("playing", isPlaying);

    musicStatus.textContent = isPlaying
      ? "Nhạc nền đang bật"
      : "Nhạc nền đã tắt";
  }

  async function startMusic() {
    try {
      // Đợi trình duyệt bắt đầu phát file của bạn.
      await backgroundMusic.play();

      updateMusicButton(true);
    } catch (error) {
      console.error("Không thể phát file nhạc:", error);

      updateMusicButton(false);

      if (backgroundMusic.error) {
        showToast(
          "Không tìm thấy file nhạc. Hãy kiểm tra đường dẫn và tên file."
        );
      } else {
        showToast(
          "Chưa phát được nhạc. Hãy bấm lại hoặc kiểm tra file MP3 nhé."
        );
      }
    }
  }

  function stopMusic() {
    backgroundMusic.pause();

    // Khi bật lại, nhạc tiếp tục từ vị trí đã dừng.
    updateMusicButton(false);
  }

  musicToggle.addEventListener("click", () => {
    if (musicPlaying) {
      stopMusic();
    } else {
      startMusic();
    }
  });

  // Nếu file nhạc phát sinh lỗi trong lúc đang chạy.
  backgroundMusic.addEventListener("error", () => {
    updateMusicButton(false);
    console.error(
      "Lỗi file âm thanh. Kiểm tra assets/nhac-nen.mp3 trên GitHub."
    );
  });

  // Đồng bộ nút nếu âm thanh bị dừng từ trình duyệt.
  backgroundMusic.addEventListener("pause", () => {
    if (musicPlaying && !backgroundMusic.ended) {
      updateMusicButton(false);
    }
  });

  backgroundMusic.addEventListener("play", () => {
    updateMusicButton(true);
  });

  // TỐI ƯU CANVAS KHI ĐỔI KÍCH THƯỚC CỬA SỔ
  // -------------------------------------------------------
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (currentScene === 1) {
        resizeHeartCanvas();
      }
    }, 120);
  });

  // -------------------------------------------------------
  // KHỞI TẠO
  // -------------------------------------------------------
  function init() {
    updateNavigation();
    resizeHeartCanvas();
    createBackgroundStars();
    createFinalPetals();

    // Không chạy hoạt ảnh canvas liên tục khi đang ở trang khác.
    const observer = new IntersectionObserver(entries => {
      const visible = entries.some(entry => entry.isIntersecting);
      if (visible && currentScene === 1) {
        activeHeartCanvas = true;
        startHeartAnimation();
      } else {
        activeHeartCanvas = false;
        stopHeartAnimation();
      }
    }, { threshold: 0.05 });

    observer.observe(heartCanvas);
  }

  init();
})();
