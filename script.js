document.addEventListener("DOMContentLoaded", function () {
  // --- Mobile Menu Toggle ---
  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector("nav");
  const navLinks = document.querySelectorAll("nav a"); // Get nav links for closing menu

  if (menuToggle && nav) {
    menuToggle.addEventListener("click", function () {
      nav.classList.toggle("active");
      menuToggle.querySelector("i").classList.toggle("fa-bars");
      menuToggle.querySelector("i").classList.toggle("fa-times"); // Optional: Change icon
    });

    // Close menu when clicking a link
    navLinks.forEach((link) => {
      link.addEventListener("click", function () {
        if (nav.classList.contains("active")) {
          // Only close if active
          nav.classList.remove("active");
          menuToggle.querySelector("i").classList.add("fa-bars");
          menuToggle.querySelector("i").classList.remove("fa-times");
        }
      });
    });

    // Close menu if clicking outside of it (optional)
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
      if (targetId === "#" || !targetId.startsWith("#")) return; // Ignore # or external links

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault(); // Prevent default only if target exists
        const headerOffset =
          document.querySelector("header")?.offsetHeight || 80; // Dynamic header height
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition =
          elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    });
  });

  // --- Active Navigation Link Highlighting ---
  const sections = document.querySelectorAll("section[id]"); // Select sections with IDs
  const navListItems = document.querySelectorAll("nav ul li a"); // Select nav links

  function navHighlighter() {
    let scrollY = window.pageYOffset;
    const headerHeight = document.querySelector("header")?.offsetHeight || 80;
    let currentSectionId = "";

    sections.forEach((current) => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - headerHeight - 50; // Adjust offset
      let sectionId = current.getAttribute("id");

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentSectionId = sectionId;
      }
    });

    // If near the bottom, highlight the last section
    if (
      window.innerHeight + window.pageYOffset >=
      document.body.offsetHeight - 50
    ) {
      // Check if near bottom
      currentSectionId = sections[sections.length - 1].getAttribute("id");
    }

    // Add/remove active class
    navListItems.forEach((link) => {
      link.classList.remove("active");
      // Check if the link's href matches the current section ID
      // Handles cases like href="#home" matching id="home"
      if (link.getAttribute("href") === "#" + currentSectionId) {
        link.classList.add("active");
      }
    });

    // Special case for top of page (highlight Home)
    if (
      currentSectionId === "" &&
      scrollY < sections[0].offsetTop - headerHeight - 50
    ) {
      document.querySelector("nav a[href='#home']")?.classList.add("active");
    }
  }

  window.addEventListener("scroll", navHighlighter);
  navHighlighter(); // Initial call to set state on load

  // --- Tab Functionality for Gallery Section ---
  const tabBtns = document.querySelectorAll(".tab-btn");
  const tabPanes = document.querySelectorAll(".tab-pane");

  tabBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      tabBtns.forEach((b) => b.classList.remove("active")); // Remove active from all buttons
      this.classList.add("active"); // Add active to clicked button

      tabPanes.forEach((pane) => pane.classList.remove("active")); // Hide all panes

      const targetTab = this.getAttribute("data-tab");
      const targetPane = document.getElementById(targetTab);
      if (targetPane) {
        targetPane.classList.add("active"); // Show selected pane
      }
    });
    // Keyboard accessibility for tabs
    btn.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        btn.click();
      }
    });
  });

  // --- Animation on Scroll (Reveal Elements) ---
  function revealElements() {
    const elements = document.querySelectorAll(
      ".timeline-item, .nakath-card, .gallery-item, .info-card, .oc-card" // Added .oc-card
    );
    const windowHeight = window.innerHeight;

    elements.forEach((element) => {
      const elementTop = element.getBoundingClientRect().top;

      // Reveal element when it's about 100px from the bottom of the viewport
      if (elementTop < windowHeight - 100) {
        element.classList.add("visible");
      } else {
        // Optional: remove class if it scrolls back up
        // element.classList.remove("visible");
      }
    });
  }

  // Add CSS directly for reveal animation (already includes stagger)
  const revealStyle = document.createElement("style");
  revealStyle.textContent = `
        .timeline-item, .nakath-card, .gallery-item, .info-card, .oc-card {
            opacity: 0;
            transform: translateY(30px); /* Start slightly lower */
            transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        }
        .timeline-item.visible, .nakath-card.visible, .gallery-item.visible, .info-card.visible, .oc-card.visible {
            opacity: 1;
            transform: translateY(0);
        }

        /* Stagger timeline animation (optional) */
        .timeline-item:nth-child(odd).visible { transition-delay: 0.1s; }
        .timeline-item:nth-child(even).visible { transition-delay: 0.2s; }
    `;
  if (!document.getElementById("reveal-style")) {
    // Prevent adding style multiple times
    revealStyle.id = "reveal-style";
    document.head.appendChild(revealStyle);
  }

  // Initial call and listener
  revealElements();
  window.addEventListener("scroll", revealElements);

  // --- Google Form Iframe Styling ---
  function styleGoogleFormIframe() {
    const googleFormIframe = document.getElementById("google-form"); // Check if iframe exists
    if (googleFormIframe) {
      googleFormIframe.addEventListener("load", () => {
        // Use load event listener
        setTimeout(() => {
          // Add a small delay just in case
          try {
            const iframeDoc = googleFormIframe.contentWindow.document;
            if (!iframeDoc) return; // Exit if document is not accessible

            // Create custom styles
            const customStyle = document.createElement("style");
            customStyle.textContent = `
                body {
                    background-color: transparent !important;
                    font-family: 'Poppins', sans-serif !important;
                    margin: 0 !important; /* Remove default margin */
                    padding: 0 !important; /* Remove default padding */
                }
                .freebirdFormviewerViewFormCard {
                    box-shadow: none !important;
                    border: none !important;
                    margin: 0 !important; /* Remove margin around form */
                }
                /* Optional: Adjust specific elements */
                 .freebirdFormviewerViewHeaderHeader { display: none !important; } /* Hide Google Header */
                 .freebirdThemedFilledButtonM2, .freebirdSolidButtonM2 {
                    background-color: #e4202f !important; /* Match primary color */
                    border-radius: 30px !important;
                 }
                 .freebirdThemedFilledButtonM2:hover, .freebirdSolidButtonM2:hover {
                    background-color: #8b0000 !important; /* Match accent color */
                 }
            `;
            iframeDoc.head.appendChild(customStyle);
          } catch (e) {
            // Cross-origin styling likely blocked, ignore error silently in production
            // console.warn("Could not style Google Form iframe:", e);
          }
        }, 500); // Delay slightly after load
      });
    }
  }

  // Call the styling function if the iframe exists
  styleGoogleFormIframe();

  // --- Countdown Timers ---
  function createCountdown(targetDate, containerId) {
    const countdownContainer = document.getElementById(containerId);
    if (!countdownContainer) return;

    // Initial HTML structure
    countdownContainer.innerHTML = `
      <div class="countdown-item"><span id="${containerId}-days">--</span><span class="countdown-label">Days</span></div>
      <div class="countdown-item"><span id="${containerId}-hours">--</span><span class="countdown-label">Hours</span></div>
      <div class="countdown-item"><span id="${containerId}-minutes">--</span><span class="countdown-label">Minutes</span></div>
      <div class="countdown-item"><span id="${containerId}-seconds">--</span><span class="countdown-label">Seconds</span></div>
    `;

    const daysEl = document.getElementById(`${containerId}-days`);
    const hoursEl = document.getElementById(`${containerId}-hours`);
    const minutesEl = document.getElementById(`${containerId}-minutes`);
    const secondsEl = document.getElementById(`${containerId}-seconds`);
    let countdownInterval; // Declare interval variable

    function updateCountdown() {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(countdownInterval); // Clear interval when countdown finishes
        if (daysEl) daysEl.textContent = "00";
        if (hoursEl) hoursEl.textContent = "00";
        if (minutesEl) minutesEl.textContent = "00";
        if (secondsEl) secondsEl.textContent = "00";
        // Optionally display a message like "Event Started!"
        // Example: countdownContainer.innerHTML = '<p class="event-started-message">Event has started!</p>';
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      // Update only if elements exist
      if (daysEl) daysEl.textContent = days.toString().padStart(2, "0");
      if (hoursEl) hoursEl.textContent = hours.toString().padStart(2, "0");
      if (minutesEl)
        minutesEl.textContent = minutes.toString().padStart(2, "0");
      if (secondsEl)
        secondsEl.textContent = seconds.toString().padStart(2, "0");
    }

    // Run immediately and set interval
    updateCountdown();
    countdownInterval = setInterval(updateCountdown, 1000); // Assign interval ID
  }

  // Initialize countdowns (Use correct target dates)
  const eventDate = new Date("April 19, 2025 08:30:00").getTime();
  // Nakath times are usually specific, get the official dawn time for 2025
  const avuruduDate = new Date("April 14, 2025 08:13:00").getTime(); // Example Dawn Time for 2025

  createCountdown(eventDate, "event-countdown");
  createCountdown(avuruduDate, "avurudu-countdown");

  // --- Lightbox Functionality ---
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const galleryItems = document.querySelectorAll(".gallery-grid .gallery-item"); // Target the links
  const closeBtn = document.querySelector(".lightbox-close");
  const prevBtn = document.querySelector(".lightbox-prev");
  const nextBtn = document.querySelector(".lightbox-next");
  let currentImageIndex;

  if (
    lightbox &&
    lightboxImg &&
    galleryItems.length > 0 &&
    closeBtn &&
    prevBtn &&
    nextBtn
  ) {
    // Store image sources from the HREF attribute of the links
    const images = Array.from(galleryItems).map((item) => item.href);

    galleryItems.forEach((item, index) => {
      item.addEventListener("click", (e) => {
        e.preventDefault(); // Prevent link navigation
        currentImageIndex = index;
        updateLightboxImage();
        lightbox.style.display = "block";
        document.body.style.overflow = "hidden"; // Prevent background scrolling
      });
    });

    function closeLightbox() {
      lightbox.style.display = "none";
      document.body.style.overflow = ""; // Restore scrolling
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
      if (images[currentImageIndex]) {
        // Check if image source exists
        lightboxImg.src = images[currentImageIndex];
      } else {
        console.error(
          "Lightbox image source not found for index:",
          currentImageIndex
        );
        // Optionally close lightbox or show placeholder
        // closeLightbox();
      }
    }

    closeBtn.addEventListener("click", closeLightbox);
    prevBtn.addEventListener("click", showPrevImage);
    nextBtn.addEventListener("click", showNextImage);

    // Close lightbox if clicking outside the image
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) {
        // Only close if backdrop is clicked, not image/controls
        closeLightbox();
      }
    });

    // Keyboard navigation
    document.addEventListener("keydown", (e) => {
      if (lightbox.style.display === "block") {
        if (e.key === "Escape") {
          closeLightbox();
        } else if (e.key === "ArrowLeft") {
          showPrevImage();
        } else if (e.key === "ArrowRight") {
          showNextImage();
        }
      }
    });
  } else {
    console.log(
      "Lightbox elements not fully initialized or no gallery items found."
    );
  }
  // ===== AVURUDU GAMES LOGIC =====
  (function setupAvuruduGames() {
    // --- Game 1: Kana Mutti ---
    const potsContainer = document.getElementById("kana-mutti-pots");
    const kanaMuttiMessage = document.getElementById("kana-mutti-message");
    const kanaMuttiResetBtn = document.getElementById("kana-mutti-reset");
    let kanaMuttiGameOver = false;
    let winningPotId = -1;
    const KANA_MUTTI_POT_SRC = "images/games/pot.png"; // Source for intact pot
    const KANA_MUTTI_BROKEN_SRC = "images/games/pot-broken.png"; // Source for broken pot
    const KANA_MUTTI_PRIZE_SRC = "images/games/prize.png"; // Source for prize image

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
        pot.classList.remove("broken", "prize"); // Reset visual classes
        const img = pot.querySelector("img");
        if (img) img.src = KANA_MUTTI_POT_SRC; // Reset image
        pot.style.pointerEvents = "auto"; // Enable clicking
        pot.style.opacity = "1"; // Ensure pots are visible
      });
      winningPotId = Math.floor(Math.random() * pots.length) + 1; // Get ID based on actual pots (1-based index)
      console.log("Kana Mutti Winning Pot ID:", winningPotId); // For testing
    }

    if (potsContainer && kanaMuttiMessage && kanaMuttiResetBtn) {
      potsContainer.addEventListener("click", function (e) {
        if (kanaMuttiGameOver) return;
        const clickedPot = e.target.closest(".pot");
        if (!clickedPot) return;

        kanaMuttiGameOver = true; // End game after one click
        const potId = parseInt(clickedPot.dataset.id, 10);
        const pots = potsContainer.querySelectorAll(".pot");

        pots.forEach((pot) => {
          pot.style.pointerEvents = "none"; // Disable clicking others
          pot.style.transition = "opacity 0.5s ease 0.3s"; // Add slight delay to fade
          const currentPotId = parseInt(pot.dataset.id, 10);
          const img = pot.querySelector("img");

          if (currentPotId === winningPotId) {
            if (img) img.src = KANA_MUTTI_PRIZE_SRC; // Change image to prize
            pot.classList.add("prize");
          } else {
            if (img) img.src = KANA_MUTTI_BROKEN_SRC; // Change image to broken
            pot.classList.add("broken");
            pot.style.opacity = "0.6"; // Make broken pots slightly transparent
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
      setupKanaMutti(); // Initial setup
    } else {
      console.error("Kana Mutti elements not found!");
    }
    // --- Game 2: Aliyata Eha Thabeema (Modified for Rotation) ---
    const elephantArea = document.getElementById("elephant-area");
    const elephantBG = document.querySelector("#elephant-area .elephant-bg"); // Select the image specifically
    const elephantEye = document.getElementById("elephant-eye");
    const elephantMessage = document.getElementById("elephant-message");
    const elephantCheckBtn = document.getElementById("elephant-check");
    const elephantResetBtn = document.getElementById("elephant-reset");
    const correctSpotMarker = document.getElementById("correct-eye-spot");

    const correctEyeXPercent = 77; // Target X percentage
    const correctEyeYPercent = 36; // Target Y percentage
    const placementTolerance = 30; // Pixel tolerance radius
    const viewDuration = 3000; // 3 seconds to memorize

    let eyePlaced = false;
    let canPlaceEye = false;
    let currentRotation = 0; // Store the rotation angle applied
    let placedCoords = { x: 0, y: 0 }; // Store coordinates where user *clicked*

    function setupElephantGame() {
      console.log("Setup Elephant Game");
      eyePlaced = false;
      canPlaceEye = false;
      currentRotation = 0; // Reset rotation

      if (elephantEye) elephantEye.style.display = "none";
      if (correctSpotMarker) correctSpotMarker.style.display = "none";
      if (elephantMessage) {
        elephantMessage.textContent = "Memorize the eye location!";
        elephantMessage.className = "game-message info";
      }
      if (elephantCheckBtn) elephantCheckBtn.style.display = "none";
      if (elephantResetBtn) elephantResetBtn.style.display = "none";
      if (elephantArea) {
        elephantArea.style.cursor = "default";
        elephantArea.classList.remove("placing-active"); // Remove placing indicator
        elephantArea.style.transform = `rotate(0deg)`; // Reset rotation instantly
      }
      if (elephantBG) elephantBG.classList.remove("hidden"); // Show elephant

      // Re-attach the click listener correctly
      const currentElephantArea = document.getElementById("elephant-area");
      if (currentElephantArea) {
        // Clear previous *specific* listener if necessary or use cloning trick again
        // Using cloneNode is simpler to ensure old listeners are gone:
        const newElephantArea = currentElephantArea.cloneNode(true);
        currentElephantArea.parentNode.replaceChild(
          newElephantArea,
          currentElephantArea
        );
        document
          .getElementById("elephant-area")
          ?.addEventListener("click", placeElephantEye);
      } else {
        // Attach if it didn't exist before
        elephantArea?.addEventListener("click", placeElephantEye);
      }

      // Timer to hide elephant and allow placement
      setTimeout(hideAndRotate, viewDuration);
    }

    function hideAndRotate() {
      console.log("Hiding and Rotating");
      if (elephantBG) elephantBG.classList.add("hidden"); // Hide the elephant background visually

      const angles = [0, 90, 180, 270];
      currentRotation = angles[Math.floor(Math.random() * angles.length)];
      console.log("Applying rotation:", currentRotation);

      if (elephantArea) {
        // Apply rotation INSTANTLY while hidden
        elephantArea.style.transition = "none"; // No transition during hidden rotation
        elephantArea.style.transform = `rotate(${currentRotation}deg)`;
        // Force redraw/reflow if needed (sometimes helps instant application)
        void elephantArea.offsetWidth;
        // Re-enable smooth transition for the reveal later
        elephantArea.style.transition = "transform 0.5s ease-in-out";

        elephantArea.style.cursor = "crosshair";
        elephantArea.classList.add("placing-active"); // Add visual cue for placing phase
      }
      if (elephantMessage) elephantMessage.textContent = "Place the eye now!";
      canPlaceEye = true;
    }

    function placeElephantEye(e) {
      if (eyePlaced || !canPlaceEye || !elephantArea || !elephantEye) return;

      const rect = elephantArea.getBoundingClientRect();
      // Original click coordinates relative to the *current* (possibly rotated) element
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      // Store the coordinates where the click visually happened
      placedCoords = { x: clickX, y: clickY };

      // Position the eye image visually where the user clicked
      elephantEye.style.left = `${clickX}px`;
      elephantEye.style.top = `${clickY}px`;
      elephantEye.style.display = "block";

      eyePlaced = true;
      canPlaceEye = false; // Prevent multiple placements
      elephantCheckBtn.style.display = "inline-block";
      elephantArea.style.cursor = "default";
      elephantArea.classList.remove("placing-active");
      if (elephantMessage) elephantMessage.textContent = "Ready to check?";
      if (elephantEye.style.border) elephantEye.style.border = "none"; // Reset visual cues
    }

    function transformCoordinates(x, y, angleDegrees, width, height) {
      // Translate to origin (center)
      const cx = width / 2;
      const cy = height / 2;
      let tx = x - cx;
      let ty = y - cy;

      // Convert angle to radians and get the *inverse* rotation
      const angleRad = (-angleDegrees * Math.PI) / 180;
      const cosA = Math.cos(angleRad);
      const sinA = Math.sin(angleRad);

      // Apply inverse rotation
      let rotatedX = tx * cosA - ty * sinA;
      let rotatedY = tx * sinA + ty * cosA;

      // Translate back from origin
      return {
        x: rotatedX + cx,
        y: rotatedY + cy,
      };
    }

    if (
      elephantArea &&
      elephantBG &&
      elephantEye &&
      elephantMessage &&
      elephantCheckBtn &&
      elephantResetBtn &&
      correctSpotMarker
    ) {
      elephantCheckBtn.addEventListener("click", function () {
        if (!eyePlaced) return;
        eyePlaced = false; // Prevent checking again until reset
        canPlaceEye = false;

        // === Reveal the elephant and reset rotation ===
        if (elephantBG) elephantBG.classList.remove("hidden");
        if (elephantArea) {
          elephantArea.style.transform = `rotate(0deg)`; // Rotate back smoothly
          elephantArea.style.cursor = "default";
        }

        // Short delay to allow visual rotation before showing results
        setTimeout(() => {
          const areaWidth = elephantArea.offsetWidth;
          const areaHeight = elephantArea.offsetHeight;

          // === Transform the CLICK coordinates back to the original orientation ===
          const originalPlacement = transformCoordinates(
            placedCoords.x,
            placedCoords.y,
            currentRotation,
            areaWidth,
            areaHeight
          );
          console.log("Clicked Coords:", placedCoords);
          console.log("Transformed Coords:", originalPlacement);
          console.log("Rotation applied was:", currentRotation);

          // === Calculate target based on original orientation percentages ===
          const targetX = areaWidth * (correctEyeXPercent / 100);
          const targetY = areaHeight * (correctEyeYPercent / 100);
          console.log("Target Coords:", { x: targetX, y: targetY });

          if (correctSpotMarker) {
            correctSpotMarker.style.left = `${targetX}px`;
            correctSpotMarker.style.top = `${targetY}px`;
            correctSpotMarker.style.display = "block";
          }

          // === Compare TRANSFORMED coordinates to the target ===
          const deltaX = originalPlacement.x - targetX;
          const deltaY = originalPlacement.y - targetY;
          const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
          console.log("Calculated distance:", distance);

          if (distance <= placementTolerance) {
            elephantMessage.textContent = "Hari Jayai! 🎉 Correct Placement!";
            elephantMessage.className = "game-message success";
            // Optionally add a border *after* reveal
            // if (elephantEye) elephantEye.style.border = '3px solid limegreen';
          } else {
            elephantMessage.textContent = `Aiyo! Missed. The target was ${distance.toFixed(
              0
            )} pixels away.`;
            elephantMessage.className = "game-message failure";
          }
          elephantCheckBtn.style.display = "none";
          elephantResetBtn.style.display = "inline-block";

          // Ensure eye remains visually where placed during rotation reset animation
          elephantEye.style.left = `${originalPlacement.x}px`;
          elephantEye.style.top = `${originalPlacement.y}px`;
        }, 500); // Delay slightly longer than CSS transition for rotation (0.5s)
      });

      elephantResetBtn.addEventListener("click", setupElephantGame);
      setupElephantGame(); // Initial setup
    } else {
      console.error(
        "Aliyata Eha game elements could not be fully initialized!"
      );
    }

    // --- Game 3: Guess the Kavum ---
    const kavumGuessInput = document.getElementById("kavum-guess");
    const kavumSubmitBtn = document.getElementById("kavum-submit");
    const kavumMessage = document.getElementById("kavum-message");
    const kavumResetBtn = document.getElementById("kavum-reset");
    let actualKavumCount;
    let kavumGameOver = false;

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
      console.log("Kavum Count:", actualKavumCount); // For testing
    }

    if (kavumGuessInput && kavumSubmitBtn && kavumMessage && kavumResetBtn) {
      kavumSubmitBtn.addEventListener("click", function () {
        if (kavumGameOver) return;
        const guess = parseInt(kavumGuessInput.value, 10);

        if (isNaN(guess) || guess < 1 || guess > 20) {
          kavumMessage.textContent = "Please enter a number between 1 and 20.";
          kavumMessage.className = "game-message info";
          return;
        }

        if (guess === actualKavumCount) {
          kavumMessage.textContent = `Hari Jayai! 🎉 You guessed it! There were ${actualKavumCount} Kavum.`;
          kavumMessage.className = "game-message success";
          kavumGameOver = true;
          kavumGuessInput.disabled = true;
          kavumSubmitBtn.disabled = true;
          kavumResetBtn.style.display = "inline-block"; // Show reset
        } else if (guess < actualKavumCount) {
          kavumMessage.textContent = "Too low! Try a higher number.";
          kavumMessage.className = "game-message failure"; // Changed to failure for wrong guess
        } else {
          kavumMessage.textContent = "Too high! Try a lower number.";
          kavumMessage.className = "game-message failure"; // Changed to failure for wrong guess
        }
        if (!kavumGameOver && kavumGuessInput) {
          // Focus only if game not over
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
    } else {
      console.error("Kavum game elements not found!");
    }
  })(); // End of IIFE for game setup
}); // End DOMContentLoaded
