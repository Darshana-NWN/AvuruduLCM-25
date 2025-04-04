document.addEventListener("DOMContentLoaded", function () {
  // --- Mobile Menu Toggle ---
  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector("nav");
  const navLinks = document.querySelectorAll("nav a");

  if (menuToggle && nav) {
    menuToggle.addEventListener("click", function () {
      nav.classList.toggle("active");
      menuToggle.querySelector("i").classList.toggle("fa-bars");
      menuToggle.querySelector("i").classList.toggle("fa-times");
    });
    navLinks.forEach((link) => {
      link.addEventListener("click", function () {
        if (nav.classList.contains("active")) {
          nav.classList.remove("active");
          menuToggle.querySelector("i").classList.add("fa-bars");
          menuToggle.querySelector("i").classList.remove("fa-times");
        }
      });
    });
    document.addEventListener("click", function (event) {
      const isClickInsideNav = nav.contains(event.target);
      const isClickOnToggle = menuToggle.contains(event.target);
      if (
        !isClickInsideNav &&
        !isClickOnToggle &&
        nav.classList.contains("active")
      ) {
        nav.classList.remove("active");
        menuToggle.querySelector("i").classList.add("fa-bars");
        menuToggle.querySelector("i").classList.remove("fa-times");
      }
    });
  }

  // --- Smooth Scrolling for Anchor Links ---
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#" || !targetId.startsWith("#")) return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerHeight =
          document.querySelector("header")?.offsetHeight || 71; // Use header height
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition =
          elementPosition + window.pageYOffset - headerHeight - 10;

        window.scrollTo({ top: offsetPosition, behavior: "smooth" });
      }
    });
  });

  // --- Active Navigation Link Highlighting ---
  const sections = document.querySelectorAll("section[id]");
  const navListItems = document.querySelectorAll("nav ul li a");

  function navHighlighter() {
    let scrollY = window.pageYOffset;
    const headerHeight = document.querySelector("header")?.offsetHeight || 71;
    let currentSectionId = "";

    sections.forEach((current) => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - headerHeight - 50;
      let sectionId = current.getAttribute("id");
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentSectionId = sectionId;
      }
    });

    if (
      window.innerHeight + Math.ceil(window.pageYOffset) >=
      document.body.offsetHeight
    ) {
      currentSectionId = sections[sections.length - 1].getAttribute("id");
    }

    navListItems.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === "#" + currentSectionId) {
        link.classList.add("active");
      }
    });

    if (scrollY === 0 && currentSectionId === "") {
      document.querySelector("nav a[href='#home']")?.classList.add("active");
    }
  }
  window.addEventListener("scroll", navHighlighter);
  navHighlighter(); // Initial call

  // --- Tab Functionality ---
  const tabBtns = document.querySelectorAll(".tab-btn");
  const tabPanes = document.querySelectorAll(".tab-pane");
  if (tabBtns.length > 0 && tabPanes.length > 0) {
    tabBtns.forEach((btn) => {
      btn.addEventListener("click", function () {
        tabBtns.forEach((b) => b.classList.remove("active"));
        this.classList.add("active");
        tabPanes.forEach((pane) => pane.classList.remove("active"));
        const targetTab = this.getAttribute("data-tab");
        const targetPane = document.getElementById(targetTab);
        if (targetPane) targetPane.classList.add("active");
      });
      btn.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          btn.click();
        }
      });
    });
  }

  // --- Animation on Scroll ---
  function revealElements() {
    const elements = document.querySelectorAll(
      ".timeline-item, .nakath-card, .gallery-item, .info-card, .oc-card, .game-card"
    );
    const windowHeight = window.innerHeight;
    elements.forEach((element) => {
      const elementTop = element.getBoundingClientRect().top;
      if (elementTop < windowHeight - 100) element.classList.add("visible");
    });
  }
  const revealStyle = document.createElement("style");
  revealStyle.textContent = ` .timeline-item, .nakath-card, .gallery-item, .info-card, .oc-card, .game-card { opacity: 0; transform: translateY(30px); transition: opacity 0.6s ease-out, transform 0.6s ease-out; } .timeline-item.visible, .nakath-card.visible, .gallery-item.visible, .info-card.visible, .oc-card.visible, .game-card.visible { opacity: 1; transform: translateY(0); } .timeline-item:nth-child(odd).visible { transition-delay: 0.1s; } .timeline-item:nth-child(even).visible { transition-delay: 0.2s; } .game-card:nth-child(1).visible { transition-delay: 0.1s; } .game-card:nth-child(2).visible { transition-delay: 0.2s; } .game-card:nth-child(3).visible { transition-delay: 0.3s; } `;
  if (!document.getElementById("reveal-style")) {
    revealStyle.id = "reveal-style";
    document.head.appendChild(revealStyle);
  }
  revealElements();
  window.addEventListener("scroll", revealElements);

  // --- Google Form Iframe Styling ---
  function styleGoogleFormIframe() {
    const googleFormIframe = document.getElementById("google-form");
    if (googleFormIframe) {
      googleFormIframe.addEventListener("load", () => {
        setTimeout(() => {
          try {
            const iframeDoc = googleFormIframe.contentWindow.document;
            if (!iframeDoc) return;
            const customStyle = document.createElement("style");
            customStyle.textContent = ` body { background-color: transparent !important; font-family: 'Poppins', sans-serif !important; margin: 0 !important; padding: 0 !important; } .freebirdFormviewerViewFormCard { box-shadow: none !important; border: none !important; margin: 0 !important; } .freebirdFormviewerViewHeaderHeader { display: none !important; } .freebirdThemedFilledButtonM2, .freebirdSolidButtonM2 { background-color: #e4202f !important; border-radius: 30px !important; } .freebirdThemedFilledButtonM2:hover, .freebirdSolidButtonM2:hover { background-color: #8b0000 !important; } `;
            iframeDoc.head.appendChild(customStyle);
          } catch (e) {
            /* console.warn("Could not style Google Form iframe:", e); */
          }
        }, 500); // Increased delay slightly
      });
    }
  }
  styleGoogleFormIframe();

  // --- Countdown Timers ---
  function createCountdown(targetDate, containerId) {
    const countdownContainer = document.getElementById(containerId);
    if (!countdownContainer) return;
    countdownContainer.innerHTML = `<div class="countdown-item"><span id="${containerId}-days">--</span><span class="countdown-label">Days</span></div> <div class="countdown-item"><span id="${containerId}-hours">--</span><span class="countdown-label">Hours</span></div> <div class="countdown-item"><span id="${containerId}-minutes">--</span><span class="countdown-label">Minutes</span></div> <div class="countdown-item"><span id="${containerId}-seconds">--</span><span class="countdown-label">Seconds</span></div>`;
    const daysEl = document.getElementById(`${containerId}-days`),
      hoursEl = document.getElementById(`${containerId}-hours`),
      minutesEl = document.getElementById(`${containerId}-minutes`),
      secondsEl = document.getElementById(`${containerId}-seconds`);
    let countdownInterval;
    function updateCountdown() {
      const now = new Date().getTime(),
        distance = targetDate - now;
      if (distance < 0) {
        clearInterval(countdownInterval);
        if (daysEl) daysEl.textContent = "00";
        if (hoursEl) hoursEl.textContent = "00";
        if (minutesEl) minutesEl.textContent = "00";
        if (secondsEl) secondsEl.textContent = "00";
        return;
      }
      const days = Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours = Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        ),
        minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds = Math.floor((distance % (1000 * 60)) / 1000);
      if (daysEl) daysEl.textContent = days.toString().padStart(2, "0");
      if (hoursEl) hoursEl.textContent = hours.toString().padStart(2, "0");
      if (minutesEl)
        minutesEl.textContent = minutes.toString().padStart(2, "0");
      if (secondsEl)
        secondsEl.textContent = seconds.toString().padStart(2, "0");
    }
    updateCountdown();
    countdownInterval = setInterval(updateCountdown, 1000);
  }
  const eventDate = new Date("April 19, 2025 08:30:00").getTime();
  const avuruduDate = new Date("April 14, 2025 08:13:00").getTime(); // Example
  createCountdown(eventDate, "event-countdown");
  createCountdown(avuruduDate, "avurudu-countdown");

  // --- Lightbox Functionality ---
  const lightbox = document.getElementById("lightbox"),
    lightboxImg = document.getElementById("lightbox-img"),
    galleryItems = document.querySelectorAll(".gallery-grid .gallery-item"),
    closeBtn = document.querySelector(".lightbox-close"),
    prevBtn = document.querySelector(".lightbox-prev"),
    nextBtn = document.querySelector(".lightbox-next");
  let currentImageIndex,
    images = [];
  if (
    lightbox &&
    lightboxImg &&
    galleryItems.length > 0 &&
    closeBtn &&
    prevBtn &&
    nextBtn
  ) {
    images = Array.from(galleryItems).map((item) => item.href);
    galleryItems.forEach((item, index) => {
      item.addEventListener("click", (e) => {
        e.preventDefault();
        currentImageIndex = index;
        updateLightboxImage();
        lightbox.style.display = "block";
        document.body.style.overflow = "hidden";
      });
    });
    function closeLightbox() {
      lightbox.style.display = "none";
      document.body.style.overflow = "";
    }
    function showPrevImage() {
      currentImageIndex =
        (currentImageIndex - 1 + images.length) % images.length;
      updateLightboxImage();
    }
    function showNextImage() {
      currentImageIndex = (currentImageIndex + 1) % images.length;
      updateLightboxImage();
    }
    function updateLightboxImage() {
      if (images[currentImageIndex])
        lightboxImg.src = images[currentImageIndex];
    }
    closeBtn.addEventListener("click", closeLightbox);
    prevBtn.addEventListener("click", showPrevImage);
    nextBtn.addEventListener("click", showNextImage);
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener("keydown", (e) => {
      if (lightbox.style.display === "block") {
        if (e.key === "Escape") closeLightbox();
        else if (e.key === "ArrowLeft") showPrevImage();
        else if (e.key === "ArrowRight") showNextImage();
      }
    });
  }

  // --- AVURUDU GAMES LOGIC ---
  (function setupAvuruduGames() {
    // --- Game 1: Kana Mutti ---
    const potsContainer = document.getElementById("kana-mutti-pots");
    const kanaMuttiMessage = document.getElementById("kana-mutti-message");
    const kanaMuttiResetBtn = document.getElementById("kana-mutti-reset");
    let kanaMuttiGameOver = false;
    let winningPotId = -1;
    const KANA_MUTTI_POT_SRC = "images/games/pot.png";
    const KANA_MUTTI_BROKEN_SRC = "images/games/pot-broken.png";
    const KANA_MUTTI_PRIZE_SRC = "images/games/prize.png";

    function setupKanaMutti() {
      if (!potsContainer) return;
      kanaMuttiGameOver = false;
      if (kanaMuttiMessage) {
        kanaMuttiMessage.textContent = "";
        kanaMuttiMessage.className = "game-message";
      }
      const pots = potsContainer.querySelectorAll(".pot");
      if (pots.length === 0) return;
      pots.forEach((pot) => {
        pot.classList.remove("broken", "prize");
        const img = pot.querySelector("img");
        if (img) img.src = KANA_MUTTI_POT_SRC;
        pot.style.pointerEvents = "auto";
        pot.style.opacity = "1";
      });
      winningPotId = Math.floor(Math.random() * pots.length) + 1;
    }

    if (potsContainer && kanaMuttiMessage && kanaMuttiResetBtn) {
      potsContainer.addEventListener("click", function (e) {
        if (kanaMuttiGameOver) return;
        const clickedPot = e.target.closest(".pot");
        if (!clickedPot) return;

        kanaMuttiGameOver = true;
        const potId = parseInt(clickedPot.dataset.id, 10);
        const pots = potsContainer.querySelectorAll(".pot");

        pots.forEach((pot) => {
          pot.style.pointerEvents = "none";
          const currentPotId = parseInt(pot.dataset.id, 10);
          const img = pot.querySelector("img");
          if (img) {
            pot.style.transition = "opacity 0.5s ease 0.3s"; // Apply transition here
            if (currentPotId === winningPotId) {
              img.src = KANA_MUTTI_PRIZE_SRC;
              pot.classList.add("prize");
            } else {
              img.src = KANA_MUTTI_BROKEN_SRC;
              pot.classList.add("broken");
              pot.style.opacity = "0.6";
            }
          }
        });
        if (potId === winningPotId) {
          kanaMuttiMessage.textContent =
            "Congratulations! 🎉 You found the prize!";
          kanaMuttiMessage.className = "game-message success";
        } else {
          kanaMuttiMessage.textContent = "Aiyo! Empty pot. 😟 Try again!";
          kanaMuttiMessage.className = "game-message failure";
        }
      });
      kanaMuttiResetBtn.addEventListener("click", setupKanaMutti);
      setupKanaMutti();
    }

    // --- Game 2: Aliyata Eha Thabeema ---
    const elephantArea = document.getElementById("elephant-area");
    const elephantBG = document.querySelector("#elephant-area .elephant-bg");
    const elephantEye = document.getElementById("elephant-eye");
    const elephantMessage = document.getElementById("elephant-message");
    const elephantCheckBtn = document.getElementById("elephant-check");
    const elephantResetBtn = document.getElementById("elephant-reset");
    const correctSpotMarker = document.getElementById("correct-eye-spot");

    if (
      !elephantArea ||
      !elephantBG ||
      !elephantEye ||
      !elephantMessage ||
      !elephantCheckBtn ||
      !elephantResetBtn ||
      !correctSpotMarker
    ) {
      console.error(
        "Aliyata Eha game elements missing, cannot initialize game."
      );
    } else {
      const correctEyeXPercent = 77;
      const correctEyeYPercent = 36;
      const placementTolerance = 30;
      const viewDuration = 3000;

      let eyePlaced = false;
      let canPlaceEye = false;
      let currentRotation = 0;
      let placedCoords = { x: 0, y: 0 };
      let placeListenerAttached = false; // Track listener to avoid duplication

      function placeElephantEye(e) {
        if (eyePlaced || !canPlaceEye || !elephantArea || !elephantEye) return;

        const rect = elephantArea.getBoundingClientRect();
        placedCoords.x = e.clientX - rect.left;
        placedCoords.y = e.clientY - rect.top;

        // Boundary checks
        placedCoords.x = Math.max(
          0,
          Math.min(placedCoords.x, elephantArea.offsetWidth)
        );
        placedCoords.y = Math.max(
          0,
          Math.min(placedCoords.y, elephantArea.offsetHeight)
        );

        elephantEye.style.left = `${placedCoords.x}px`;
        elephantEye.style.top = `${placedCoords.y}px`;
        elephantEye.style.display = "block";
        eyePlaced = true;
        canPlaceEye = false; // Placement done
        elephantCheckBtn.style.display = "inline-block";
        elephantArea.style.cursor = "default";
        elephantArea.classList.remove("placing-active");
        elephantMessage.textContent = "Ready to check?";
        if (elephantEye.style.border) elephantEye.style.border = "none";
      }

      function setupElephantGame() {
        eyePlaced = false;
        canPlaceEye = false;
        currentRotation = 0;
        placedCoords = { x: 0, y: 0 };

        elephantEye.style.display = "none";
        correctSpotMarker.style.display = "none";
        elephantMessage.textContent = "Memorize the eye location!";
        elephantMessage.className = "game-message info";
        elephantCheckBtn.style.display = "none";
        elephantResetBtn.style.display = "none";

        elephantArea.style.cursor = "default";
        elephantArea.classList.remove("placing-active");
        elephantArea.style.transform = `rotate(0deg)`;
        elephantArea.style.transition = "none";
        elephantBG.classList.remove("hidden");

        // Attach the listener only if it's not already attached for this round
        if (!placeListenerAttached) {
          elephantArea.addEventListener("click", placeElephantEye);
          placeListenerAttached = true;
        }

        setTimeout(hideAndRotate, viewDuration);
      }

      function hideAndRotate() {
        if (elephantBG) elephantBG.classList.add("hidden");

        const angles = [0, 90, 180, 270];
        currentRotation = angles[Math.floor(Math.random() * angles.length)];

        elephantArea.style.transition = "none"; // Rotate instantly
        elephantArea.style.transform = `rotate(${currentRotation}deg)`;
        void elephantArea.offsetWidth; // Reflow trick
        elephantArea.style.transition = "transform 0.5s ease-in-out"; // Re-enable for reveal

        elephantArea.style.cursor = "crosshair";
        elephantArea.classList.add("placing-active");
        elephantMessage.textContent = "Place the eye now!";
        canPlaceEye = true;
      }

      function transformCoordinates(x, y, angleDegrees, width, height) {
        const cx = width / 2,
          cy = height / 2;
        let tx = x - cx,
          ty = y - cy;
        const angleRad = (-angleDegrees * Math.PI) / 180,
          cosA = Math.cos(angleRad),
          sinA = Math.sin(angleRad);
        let rotatedX = tx * cosA - ty * sinA,
          rotatedY = tx * sinA + ty * cosA;
        return { x: rotatedX + cx, y: rotatedY + cy };
      }

      elephantCheckBtn.addEventListener("click", function () {
        if (!eyePlaced) return;
        eyePlaced = false; // Reset for next round, check logic only runs once
        canPlaceEye = false;

        if (elephantArea) {
          elephantArea.style.transform = `rotate(0deg)`; // Rotate back
          elephantArea.style.cursor = "default";
          if (elephantBG) elephantBG.classList.remove("hidden"); // Show elephant BG during reveal
        }

        // Delay result check to match reveal animation
        setTimeout(() => {
          const areaWidth = elephantArea.offsetWidth,
            areaHeight = elephantArea.offsetHeight;
          // Transform clicked coordinates back to original orientation
          const originalPlacement = transformCoordinates(
            placedCoords.x,
            placedCoords.y,
            currentRotation,
            areaWidth,
            areaHeight
          );

          // Target coordinates in original orientation
          const targetX = areaWidth * (correctEyeXPercent / 100);
          const targetY = areaHeight * (correctEyeYPercent / 100);

          // Show correct spot
          correctSpotMarker.style.left = `${targetX}px`;
          correctSpotMarker.style.top = `${targetY}px`;
          correctSpotMarker.style.display = "block";

          // Reposition the eye visually to match where it *would* have been clicked on the unrotated image
          elephantEye.style.left = `${originalPlacement.x}px`;
          elephantEye.style.top = `${originalPlacement.y}px`;

          // Check distance
          const deltaX = originalPlacement.x - targetX,
            deltaY = originalPlacement.y - targetY;
          const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

          if (distance <= placementTolerance) {
            elephantMessage.textContent = "Hari Jayai! 🎉 Correct Placement!";
            elephantMessage.className = "game-message success";
            elephantEye.style.border = "3px solid limegreen"; // Highlight
          } else {
            elephantMessage.textContent = `Aiyo! Missed by ${distance.toFixed(
              0
            )} pixels.`;
            elephantMessage.className = "game-message failure";
          }
          elephantCheckBtn.style.display = "none";
          elephantResetBtn.style.display = "inline-block";
          placeListenerAttached = false; // Allow listener to be re-added on reset
        }, 500); // Delay should match or slightly exceed CSS transform duration
      });

      elephantResetBtn.addEventListener("click", () => {
        if (elephantArea && placeListenerAttached) {
          // Remove listener before setting up again
          elephantArea.removeEventListener("click", placeElephantEye);
          placeListenerAttached = false;
        }
        setupElephantGame();
      });

      // Initial setup on load
      setupElephantGame();
    }

    // --- Game 3: Guess the Kavum ---
    const kavumGuessInput = document.getElementById("kavum-guess"),
      kavumSubmitBtn = document.getElementById("kavum-submit"),
      kavumMessage = document.getElementById("kavum-message"),
      kavumResetBtn = document.getElementById("kavum-reset");
    let actualKavumCount,
      kavumGameOver = false;

    function setupKavumGame() {
      actualKavumCount = Math.floor(Math.random() * 20) + 1;
      kavumGameOver = false;
      if (kavumGuessInput) kavumGuessInput.value = "";
      if (kavumMessage) {
        kavumMessage.textContent = "";
        kavumMessage.className = "game-message";
      }
      if (kavumGuessInput) kavumGuessInput.disabled = false;
      if (kavumSubmitBtn) kavumSubmitBtn.disabled = false;
      if (kavumResetBtn) kavumResetBtn.style.display = "none";
    }
    if (kavumGuessInput && kavumSubmitBtn && kavumMessage && kavumResetBtn) {
      kavumSubmitBtn.addEventListener("click", function () {
        if (kavumGameOver) return;
        const guess = parseInt(kavumGuessInput.value, 10);
        if (isNaN(guess) || guess < 1 || guess > 20) {
          kavumMessage.textContent = "Enter number between 1 and 20.";
          kavumMessage.className = "game-message info";
          return;
        }
        if (guess === actualKavumCount) {
          kavumMessage.textContent = `Hari Jayai! 🎉 You guessed ${actualKavumCount} Kavum!`;
          kavumMessage.className = "game-message success";
          kavumGameOver = true;
          kavumGuessInput.disabled = true;
          kavumSubmitBtn.disabled = true;
          kavumResetBtn.style.display = "inline-block";
        } else if (guess < actualKavumCount) {
          kavumMessage.textContent = "Too low! Try higher.";
          kavumMessage.className = "game-message failure";
        } else {
          kavumMessage.textContent = "Too high! Try lower.";
          kavumMessage.className = "game-message failure";
        }
        if (!kavumGameOver && kavumGuessInput) {
          kavumGuessInput.focus();
          kavumGuessInput.select();
        }
      });
      kavumResetBtn.addEventListener("click", setupKavumGame);
      kavumGuessInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          kavumSubmitBtn.click();
        }
      });
      setupKavumGame();
    }
  })(); // End Games IIFE
}); // End DOMContentLoaded
