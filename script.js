document.addEventListener("DOMContentLoaded", function () {
  // --- Mobile Menu Toggle ---
  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector("nav");
  const navLinks = document.querySelectorAll("nav a");

  if (menuToggle && nav) {
    menuToggle.addEventListener("click", function () {
      const isActive = nav.classList.toggle("active");
      menuToggle.setAttribute("aria-expanded", isActive); // ARIA attribute
      const icon = menuToggle.querySelector("i");
      if (icon) {
        icon.classList.toggle("fa-bars", !isActive);
        icon.classList.toggle("fa-times", isActive);
      }
    });

    // Close menu when clicking a link
    navLinks.forEach((link) => {
      link.addEventListener("click", function () {
        if (nav.classList.contains("active")) {
          nav.classList.remove("active");
          menuToggle.setAttribute("aria-expanded", "false");
          const icon = menuToggle.querySelector("i");
          if (icon) {
            icon.classList.add("fa-bars");
            icon.classList.remove("fa-times");
          }
        }
      });
    });

    // Close menu if clicking outside of it
    document.addEventListener("click", function (event) {
      const isClickInsideNav = nav.contains(event.target);
      const isClickOnToggle = menuToggle.contains(event.target);

      if (
        !isClickInsideNav &&
        !isClickOnToggle &&
        nav.classList.contains("active")
      ) {
        nav.classList.remove("active");
        menuToggle.setAttribute("aria-expanded", "false");
        const icon = menuToggle.querySelector("i");
        if (icon) {
          icon.classList.add("fa-bars");
          icon.classList.remove("fa-times");
        }
      }
    });
  }

  // --- Smooth Scrolling for Anchor Links ---
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      // Allow default behavior for '#' link or external links
      if (
        targetId === "#" ||
        !targetId.startsWith("#") ||
        targetId.length === 1
      )
        return;

      try {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          const header = document.querySelector("header");
          const headerOffset = header ? header.offsetHeight : 70; // Dynamic header height
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition =
            elementPosition + window.pageYOffset - headerOffset - 15; // Add buffer

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });

          // Optionally close mobile nav if open after scrolling
          if (nav && nav.classList.contains("active")) {
            nav.classList.remove("active");
            menuToggle.setAttribute("aria-expanded", "false");
            const icon = menuToggle.querySelector("i");
            if (icon) {
              icon.classList.add("fa-bars");
              icon.classList.remove("fa-times");
            }
          }
        } else {
          console.warn(
            `Smooth scroll target element not found for selector: ${targetId}`
          );
        }
      } catch (error) {
        console.error(`Error during smooth scroll for ${targetId}:`, error);
      }
    });
  });

  // --- Active Navigation Link Highlighting ---
  const sections = document.querySelectorAll("section[id]");
  const navListItems = document.querySelectorAll("nav ul li a");

  function navHighlighter() {
    let scrollY = window.pageYOffset;
    const headerHeight = document.querySelector("header")?.offsetHeight || 70;
    let currentSectionId = "";

    // Find the current section
    sections.forEach((current) => {
      const sectionHeight = current.offsetHeight;
      // Adjust offset calculation - section should be active when its top is near the top of the viewport
      const sectionTop = current.offsetTop - headerHeight - sectionHeight * 0.3; // Active when 30% of section is visible from top

      if (scrollY >= sectionTop) {
        // Check if we've scrolled past the adjusted top
        currentSectionId = current.getAttribute("id");
      }
    });

    // If scrolled to the very bottom, highlight the last section
    if (
      window.innerHeight + Math.ceil(window.pageYOffset) >=
      document.body.offsetHeight - 50
    ) {
      if (sections.length > 0) {
        currentSectionId = sections[sections.length - 1].getAttribute("id");
      }
    }

    // If no section is actively identified near top, highlight 'home' if scrolled near the top
    if (
      scrollY < sections[0].offsetTop - headerHeight - 100 &&
      sections.length > 0 &&
      sections[0].id === "home"
    ) {
      currentSectionId = "home";
    }

    // Remove active class from all, then add to the current one
    let homeLinkActivated = false;
    navListItems.forEach((link) => {
      link.classList.remove("active");
      const linkHref = link.getAttribute("href");
      if (linkHref === "#" + currentSectionId) {
        link.classList.add("active");
        if (linkHref === "#home") {
          homeLinkActivated = true;
        }
      }
    });

    // Special case: Ensure 'Home' is active when scrolled to the very top (scrollY = 0)
    if (scrollY < 50 && !homeLinkActivated) {
      navListItems.forEach((link) => link.classList.remove("active")); // Clear others
      const homeLink = document.querySelector("nav a[href='#home']");
      if (homeLink) homeLink.classList.add("active");
    }
  }
  window.addEventListener("scroll", navHighlighter, { passive: true }); // Use passive listener
  navHighlighter(); // Initial call

  // --- Tab Functionality for Gallery Section ---
  const tabBtns = document.querySelectorAll(".tab-btn");
  const tabPanes = document.querySelectorAll(".tab-pane");

  if (tabBtns.length > 0 && tabPanes.length > 0) {
    tabBtns.forEach((btn) => {
      btn.addEventListener("click", function () {
        // Update button states
        tabBtns.forEach((b) => b.classList.remove("active"));
        this.classList.add("active");

        // Update pane visibility
        const targetTabId = this.getAttribute("data-tab");
        tabPanes.forEach((pane) => {
          if (pane.id === targetTabId) {
            pane.classList.add("active");
          } else {
            pane.classList.remove("active");
          }
        });

        // Re-parse Facebook embeds if the photos tab becomes active and FB SDK is loaded
        if (targetTabId === "photos" && typeof FB !== "undefined" && FB.XFBML) {
          // Check if FB object and XFBML method exist
          try {
            FB.XFBML.parse(); // Call parse method
          } catch (e) {
            console.warn("Could not re-parse Facebook XFBML:", e);
          }
        }
      });

      // Accessibility: Allow activation with Enter/Space
      btn.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          btn.click();
        }
      });
    });
  }

  // --- Animation on Scroll (Reveal Elements) ---
  const scrollRevealElements = document.querySelectorAll(
    ".timeline-item, .nakath-card, .facebook-embed-container, .video-container, .info-card, .oc-card, .game-card, .footer-contact-card" // Added more elements
  );

  // Check if Intersection Observer is supported
  if ("IntersectionObserver" in window) {
    const elementObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target); // Stop observing once visible
          }
        });
      },
      {
        rootMargin: "0px 0px -10% 0px", // Trigger when 10% of element is visible from bottom
      }
    );

    scrollRevealElements.forEach((el) => {
      elementObserver.observe(el);
    });
  } else {
    // Fallback for older browsers (less performant)
    console.log(
      "Intersection Observer not supported, using scroll event fallback for animations."
    );
    function revealElementsFallback() {
      const windowHeight = window.innerHeight;
      scrollRevealElements.forEach((element) => {
        const elementTop = element.getBoundingClientRect().top;
        if (elementTop < windowHeight - 80) {
          // Adjust threshold
          element.classList.add("visible");
        }
      });
    }
    window.addEventListener("scroll", revealElementsFallback, {
      passive: true,
    });
    revealElementsFallback(); // Initial check
  }

  // CSS for the reveal effect is now in styles.css (where it belongs)
  // Example: .timeline-item { opacity: 0; transform: translateY(30px); transition: ... }
  //          .timeline-item.visible { opacity: 1; transform: translateY(0); }

  // --- Google Form Iframe Styling Attempt ---
  // Note: This is inherently fragile due to cross-origin restrictions.
  // It might work if the form is hosted on the same top-level domain,
  // but often won't work with standard docs.google.com forms.
  function styleGoogleFormIframe() {
    const googleFormIframe = document.getElementById("google-form");
    if (googleFormIframe) {
      googleFormIframe.addEventListener("load", () => {
        // Wait a moment for the form to potentially finish rendering inside
        setTimeout(() => {
          try {
            const iframeDoc = googleFormIframe.contentWindow?.document; // Optional chaining
            if (!iframeDoc) {
              console.warn(
                "Cannot access Google Form iframe content (cross-origin restriction)."
              );
              return;
            }
            const customStyle = iframeDoc.createElement("style");
            customStyle.textContent = `
              body {
                background-color: transparent !important;
                font-family: 'Poppins', sans-serif !important;
                margin: 0 !important; padding: 10px 5px !important; /* Add some internal padding */
              }
              /* Attempt to hide Google header/footer - often fails */
              .freebirdFormviewerViewHeaderHeader,
              .freebirdFormviewerViewFooterDisclaimer {
                 display: none !important;
              }
              /* Try to style the submit button */
              .freebirdFormviewerViewNavigationSubmitButton {
                background-color: var(--primary-color, #e4202f) !important;
                border-radius: 30px !important;
                padding: 10px 20px !important;
              }
               .freebirdFormviewerViewNavigationSubmitButton:hover {
                 background-color: var(--accent-color, #8b0000) !important;
               }
              /* Remove box shadow from the form card */
              .freebirdFormviewerViewFormCard {
                box-shadow: none !important;
                border: none !important;
                margin: 0 !important;
                padding: 0 !important;
              }
            `;
            iframeDoc.head.appendChild(customStyle);
            console.log(
              "Attempted to apply custom styles to Google Form iframe."
            );
          } catch (e) {
            console.warn(
              "Error accessing or styling Google Form iframe content:",
              e.message
            );
            // This error is expected in most cross-origin scenarios.
          }
        }, 200); // Increased timeout slightly
      });
      // Add error handling for the iframe itself
      googleFormIframe.addEventListener("error", (e) => {
        console.error("Error loading Google Form iframe:", e);
        // Optionally display a message to the user in the container
        const container = googleFormIframe.closest(
          ".registration-iframe-container"
        );
        if (container) {
          container.innerHTML +=
            '<p style="color: red; text-align: center; padding: 20px;">Could not load the registration form. Please try the direct link above.</p>';
        }
      });
    }
  }
  styleGoogleFormIframe();

  // --- Countdown Timers ---
  function createCountdown(targetDate, containerId) {
    const countdownContainer = document.getElementById(containerId);
    if (!countdownContainer) {
      console.warn(`Countdown container #${containerId} not found.`);
      return;
    }
    // Clear previous content and set up structure
    countdownContainer.innerHTML = `
      <div class="countdown-item"><span id="${containerId}-days">--</span><span class="countdown-label">Days</span></div>
      <div class="countdown-item"><span id="${containerId}-hours">--</span><span class="countdown-label">Hours</span></div>
      <div class="countdown-item"><span id="${containerId}-minutes">--</span><span class="countdown-label">Minutes</span></div>
      <div class="countdown-item"><span id="${containerId}-seconds">--</span><span class="countdown-label">Seconds</span></div>`;

    const daysEl = document.getElementById(`${containerId}-days`);
    const hoursEl = document.getElementById(`${containerId}-hours`);
    const minutesEl = document.getElementById(`${containerId}-minutes`);
    const secondsEl = document.getElementById(`${containerId}-seconds`);

    // Check if all elements were found
    if (!daysEl || !hoursEl || !minutesEl || !secondsEl) {
      console.error(`Countdown elements not found within #${containerId}`);
      return;
    }

    let countdownInterval;

    function updateCountdown() {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(countdownInterval);
        daysEl.textContent = "00";
        hoursEl.textContent = "00";
        minutesEl.textContent = "00";
        secondsEl.textContent = "00";
        // Optionally hide or change the countdown header
        const header = countdownContainer.previousElementSibling; // Assuming header is direct sibling
        if (header && header.classList.contains("countdown-header")) {
          // header.innerHTML = '<h3>Event Started!</h3>';
        }
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      // Update text content, ensuring padStart for two digits
      daysEl.textContent = days.toString().padStart(2, "0");
      hoursEl.textContent = hours.toString().padStart(2, "0");
      minutesEl.textContent = minutes.toString().padStart(2, "0");
      secondsEl.textContent = seconds.toString().padStart(2, "0");
    }

    updateCountdown(); // Initial call
    countdownInterval = setInterval(updateCountdown, 1000); // Update every second
  }

  // === IMPORTANT: Set Correct Target Dates ===
  const eventTargetDate = new Date(
    "April 19, 2025 08:30:00 GMT+0530"
  ).getTime(); // Sri Lanka Time (IST/SLST)
  const avuruduTargetDate = new Date(
    "April 14, 2025 08:13:00 GMT+0530"
  ).getTime(); // Example Avurudu time, update with official 2025 time
  // ========================================

  createCountdown(eventTargetDate, "event-countdown");
  createCountdown(avuruduTargetDate, "avurudu-countdown");

  // --- AVURUDU GAMES LOGIC ---
  (function setupAvuruduGames() {
    // --- Game 1: Kana Mutti ---
    const potsContainer = document.getElementById("kana-mutti-pots");
    const kanaMuttiMessage = document.getElementById("kana-mutti-message");
    const kanaMuttiResetBtn = document.getElementById("kana-mutti-reset");
    const kanaMuttiPots = potsContainer
      ? potsContainer.querySelectorAll(".pot")
      : [];
    let kanaMuttiGameOver = false;
    let winningPotId = -1;
    // Define image sources directly here or ensure they are correct in HTML/CSS
    // const KANA_MUTTI_POT_SRC = "images/games/pot.png";
    // const KANA_MUTTI_BROKEN_SRC = "images/games/pot-broken.png";
    // const KANA_MUTTI_PRIZE_SRC = "images/games/prize.png";

    function setupKanaMutti() {
      if (
        !potsContainer ||
        !kanaMuttiMessage ||
        !kanaMuttiResetBtn ||
        kanaMuttiPots.length === 0
      ) {
        console.warn("Kana Mutti elements not fully initialized.");
        return;
      }
      kanaMuttiGameOver = false;
      kanaMuttiMessage.textContent = "";
      kanaMuttiMessage.className = "game-message"; // Reset message style
      kanaMuttiResetBtn.style.display = "none"; // Hide reset button

      // Calculate winning pot (make sure it's within the range of available pots)
      winningPotId = Math.floor(Math.random() * kanaMuttiPots.length) + 1;

      kanaMuttiPots.forEach((pot) => {
        pot.classList.remove("broken", "prize");
        pot.disabled = false; // Enable button
        pot.style.opacity = "1";
        pot.style.pointerEvents = "auto"; // Make clickable
        // Reset image using CSS or explicitly if needed (CSS method preferred)
        // const img = pot.querySelector("img");
        // if (img) img.src = KANA_MUTTI_POT_SRC;
      });
      console.log("Kana Mutti Setup: Winning Pot ID =", winningPotId);
    }

    if (potsContainer) {
      potsContainer.addEventListener("click", function (e) {
        if (kanaMuttiGameOver) return;
        const clickedPot = e.target.closest(".pot");
        if (!clickedPot) return;

        kanaMuttiGameOver = true; // Game is over once a pot is clicked
        const clickedPotId = parseInt(clickedPot.dataset.id, 10);

        // Disable all pots and reveal outcome
        kanaMuttiPots.forEach((pot) => {
          pot.disabled = true;
          pot.style.pointerEvents = "none";
          const currentPotId = parseInt(pot.dataset.id, 10);

          // Add classes for visual state changes (handled by CSS)
          if (currentPotId === winningPotId) {
            pot.classList.add("prize");
          } else {
            pot.classList.add("broken");
          }
        });

        // Display message
        if (clickedPotId === winningPotId) {
          kanaMuttiMessage.textContent =
            "Suba Pathum! 🎉 You found the Avurudu treasure!";
          kanaMuttiMessage.className = "game-message success";
        } else {
          kanaMuttiMessage.textContent =
            "Aiyo! Just an empty pot. 😟 Better luck next time!";
          kanaMuttiMessage.className = "game-message failure";
        }

        // Show reset button
        if (kanaMuttiResetBtn) kanaMuttiResetBtn.style.display = "inline-block";
      });
    }

    if (kanaMuttiResetBtn) {
      kanaMuttiResetBtn.addEventListener("click", setupKanaMutti);
    }

    // Initial setup call
    setupKanaMutti();

    // --- Game 2: Aliyata Eha Thabeema ---
    const elephantArea = document.getElementById("elephant-area");
    const elephantBG = document.querySelector("#elephant-area .elephant-bg");
    const elephantEye = document.getElementById("elephant-eye");
    const elephantMessage = document.getElementById("elephant-message");
    const elephantCheckBtn = document.getElementById("elephant-check");
    const elephantResetBtn = document.getElementById("elephant-reset");
    const correctSpotMarker = document.getElementById("correct-eye-spot");

    // Configuration
    const CORRECT_EYE_X_PERCENT = 77; // Adjust based on your elephant outline image
    const CORRECT_EYE_Y_PERCENT = 36; // Adjust based on your elephant outline image
    const PLACEMENT_TOLERANCE_PX = 25; // Click accuracy tolerance in pixels
    const VIEW_DURATION_MS = 2500; // How long the eye is shown initially
    const ROTATION_ANGLES = [0, 90, 180, 270]; // Possible rotation angles

    // State variables
    let eyeIsPlaced = false;
    let canPlaceEyeNow = false;
    let currentRotationAngle = 0;
    let placedCoordinates = { x: 0, y: 0 };
    let elephantClickListener = null; // Store listener reference

    function setupElephantGame() {
      if (
        !elephantArea ||
        !elephantBG ||
        !elephantEye ||
        !elephantMessage ||
        !elephantCheckBtn ||
        !elephantResetBtn ||
        !correctSpotMarker
      ) {
        console.warn("Aliyata Eha elements not fully initialized.");
        return;
      }

      eyeIsPlaced = false;
      canPlaceEyeNow = false;
      currentRotationAngle = 0;
      placedCoordinates = { x: 0, y: 0 };

      // Reset visual elements
      elephantEye.style.display = "block"; // Show the eye initially
      elephantEye.style.border = "none"; // Remove any previous border
      const areaWidth = elephantArea.offsetWidth;
      const areaHeight = elephantArea.offsetHeight;
      // Position eye correctly at the start
      if (areaWidth > 0 && areaHeight > 0) {
        // Ensure dimensions are available
        elephantEye.style.left = `${
          areaWidth * (CORRECT_EYE_X_PERCENT / 100)
        }px`;
        elephantEye.style.top = `${
          areaHeight * (CORRECT_EYE_Y_PERCENT / 100)
        }px`;
      } else {
        // Fallback or wait for layout
        elephantEye.style.left = `${CORRECT_EYE_X_PERCENT}%`;
        elephantEye.style.top = `${CORRECT_EYE_Y_PERCENT}%`;
      }

      correctSpotMarker.style.display = "none";
      elephantMessage.textContent = "Memorize the eye location!";
      elephantMessage.className = "game-message info";
      elephantCheckBtn.style.display = "none";
      elephantResetBtn.style.display = "none";

      // Reset elephant area state
      elephantArea.style.cursor = "default";
      elephantArea.classList.remove("placing-active");
      elephantArea.style.transform = "rotate(0deg)";
      elephantArea.style.transition = "none"; // Reset transition for setup
      elephantBG.classList.remove("hidden");

      // Remove previous listener before adding a new one
      if (elephantClickListener) {
        elephantArea.removeEventListener("click", elephantClickListener);
      }

      // Start the sequence after a brief pause
      setTimeout(hideAndRotateElephant, VIEW_DURATION_MS);
      console.log("Aliyata Eha Setup: Initial view phase.");
    }

    function hideAndRotateElephant() {
      if (!elephantEye || !elephantArea || !elephantBG || !elephantMessage)
        return;

      elephantEye.style.display = "none"; // Hide the original eye
      elephantBG.classList.add("hidden"); // Make background faint

      // Choose a random rotation
      currentRotationAngle =
        ROTATION_ANGLES[Math.floor(Math.random() * ROTATION_ANGLES.length)];

      // Apply rotation smoothly
      elephantArea.style.transition = "transform 0.7s ease-in-out";
      elephantArea.style.transform = `rotate(${currentRotationAngle}deg)`;

      // Update state and UI
      elephantArea.style.cursor = "crosshair";
      elephantArea.classList.add("placing-active");
      elephantMessage.textContent = "Now, click where the eye should be!";
      canPlaceEyeNow = true;

      // Add the click listener *only* when ready to place
      elephantClickListener = handleElephantClick; // Assign function reference
      elephantArea.addEventListener("click", elephantClickListener);
      console.log(
        `Aliyata Eha: Rotated by ${currentRotationAngle}deg. Ready for placement.`
      );
    }

    function handleElephantClick(e) {
      if (
        eyeIsPlaced ||
        !canPlaceEyeNow ||
        !elephantArea ||
        !elephantEye ||
        !elephantCheckBtn
      )
        return;

      // Prevent multiple clicks
      canPlaceEyeNow = false;
      elephantArea.removeEventListener("click", elephantClickListener); // Remove listener immediately
      elephantClickListener = null; // Clear reference

      const rect = elephantArea.getBoundingClientRect();
      // Calculate click position relative to the elephant area
      placedCoordinates.x = e.clientX - rect.left;
      placedCoordinates.y = e.clientY - rect.top;

      // Clamp coordinates within bounds (optional, but good practice)
      placedCoordinates.x = Math.max(
        0,
        Math.min(placedCoordinates.x, rect.width)
      );
      placedCoordinates.y = Math.max(
        0,
        Math.min(placedCoordinates.y, rect.height)
      );

      // Place the eye visually at the clicked spot
      elephantEye.style.left = `${placedCoordinates.x}px`;
      elephantEye.style.top = `${placedCoordinates.y}px`;
      elephantEye.style.display = "block"; // Show the placed eye
      eyeIsPlaced = true;

      // Update UI
      elephantCheckBtn.style.display = "inline-block"; // Show check button
      elephantArea.style.cursor = "default";
      elephantArea.classList.remove("placing-active");
      if (elephantMessage)
        elephantMessage.textContent = "Eye placed! Ready to check?";
      console.log(
        `Aliyata Eha: Eye placed at (${placedCoordinates.x.toFixed(
          1
        )}, ${placedCoordinates.y.toFixed(1)})`
      );
    }

    // Function to transform coordinates back to original orientation
    function transformCoordinates(x, y, angleDegrees, width, height) {
      const cx = width / 2;
      const cy = height / 2;
      const tx = x - cx;
      const ty = y - cy;
      // Convert angle to radians (negative for reverse rotation)
      const angleRad = (-angleDegrees * Math.PI) / 180;
      const cosA = Math.cos(angleRad);
      const sinA = Math.sin(angleRad);
      const rotatedX = tx * cosA - ty * sinA;
      const rotatedY = tx * sinA + ty * cosA;
      // Translate back from center
      return { x: rotatedX + cx, y: rotatedY + cy };
    }

    if (elephantCheckBtn) {
      elephantCheckBtn.addEventListener("click", function () {
        if (
          !eyeIsPlaced ||
          !elephantArea ||
          !elephantEye ||
          !elephantBG ||
          !correctSpotMarker ||
          !elephantMessage ||
          !elephantResetBtn
        )
          return;

        // Disable check button immediately
        elephantCheckBtn.style.display = "none";

        // Rotate back to original position
        elephantArea.style.transition = "transform 0.7s ease-in-out";
        elephantArea.style.transform = "rotate(0deg)";
        elephantArea.style.cursor = "default";
        elephantBG.classList.remove("hidden"); // Show background clearly

        // Wait for rotation animation to finish before calculating/showing results
        setTimeout(() => {
          const areaWidth = elephantArea.offsetWidth;
          const areaHeight = elephantArea.offsetHeight;

          if (areaWidth === 0 || areaHeight === 0) {
            console.error(
              "Cannot check placement: Elephant area has zero dimensions."
            );
            elephantMessage.textContent =
              "Error checking placement. Please try again.";
            elephantMessage.className = "game-message failure";
            if (elephantResetBtn)
              elephantResetBtn.style.display = "inline-block";
            return;
          }

          // Calculate where the placed eye *would* be in the original orientation
          const originalPlacement = transformCoordinates(
            placedCoordinates.x,
            placedCoordinates.y,
            currentRotationAngle, // The angle it *was* rotated by
            areaWidth,
            areaHeight
          );

          // Calculate the target position in the original orientation
          const targetX = areaWidth * (CORRECT_EYE_X_PERCENT / 100);
          const targetY = areaHeight * (CORRECT_EYE_Y_PERCENT / 100);

          // Show the correct spot marker
          correctSpotMarker.style.left = `${targetX}px`;
          correctSpotMarker.style.top = `${targetY}px`;
          correctSpotMarker.style.display = "block";

          // Update the visual position of the placed eye to its original orientation equivalent
          elephantEye.style.left = `${originalPlacement.x}px`;
          elephantEye.style.top = `${originalPlacement.y}px`;

          // Calculate the distance
          const deltaX = originalPlacement.x - targetX;
          const deltaY = originalPlacement.y - targetY;
          const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

          // Provide feedback
          if (distance <= PLACEMENT_TOLERANCE_PX) {
            elephantMessage.textContent = "Hari Jayai! 🎉 Perfect placement!";
            elephantMessage.className = "game-message success";
            elephantEye.style.border = "3px solid limegreen"; // Highlight correct placement
          } else {
            elephantMessage.textContent = `Aiyo! So close! Missed by ${distance.toFixed(
              0
            )} pixels.`;
            elephantMessage.className = "game-message failure";
            elephantEye.style.border = "3px solid red"; // Highlight incorrect placement
          }

          // Show reset button
          if (elephantResetBtn) elephantResetBtn.style.display = "inline-block";
          console.log(
            `Aliyata Eha: Check complete. Distance: ${distance.toFixed(1)}px`
          );
        }, 750); // Wait slightly longer than animation duration
      });
    }

    if (elephantResetBtn) {
      elephantResetBtn.addEventListener("click", setupElephantGame);
    }

    // Initial setup
    // Use setTimeout to ensure layout is calculated before positioning eye
    setTimeout(setupElephantGame, 100);

    // --- Game 3: Guess the Kavum ---
    const kavumGuessInput = document.getElementById("kavum-guess");
    const kavumSubmitBtn = document.getElementById("kavum-submit");
    const kavumMessage = document.getElementById("kavum-message");
    const kavumResetBtn = document.getElementById("kavum-reset");
    let actualKavumCount = 0;
    let kavumGameOver = false;
    const MAX_KAVUM = 20;
    const MIN_KAVUM = 1;

    function setupKavumGame() {
      if (
        !kavumGuessInput ||
        !kavumSubmitBtn ||
        !kavumMessage ||
        !kavumResetBtn
      ) {
        console.warn("Guess Kavum elements not fully initialized.");
        return;
      }
      // Generate random number between MIN_KAVUM and MAX_KAVUM
      actualKavumCount = Math.floor(Math.random() * MAX_KAVUM) + MIN_KAVUM;
      kavumGameOver = false;

      // Reset UI elements
      kavumGuessInput.value = "";
      kavumGuessInput.disabled = false;
      kavumMessage.textContent = "";
      kavumMessage.className = "game-message"; // Reset style
      kavumSubmitBtn.disabled = false;
      kavumResetBtn.style.display = "none"; // Hide reset button
      kavumGuessInput.setAttribute("max", MAX_KAVUM); // Ensure max attribute is set
      kavumGuessInput.setAttribute("min", MIN_KAVUM);
      console.log("Kavum Game Setup: Actual count =", actualKavumCount);
    }

    function handleKavumGuess() {
      if (
        kavumGameOver ||
        !kavumGuessInput ||
        !kavumMessage ||
        !kavumSubmitBtn ||
        !kavumResetBtn
      )
        return;

      const guess = parseInt(kavumGuessInput.value, 10);

      // Validate input
      if (isNaN(guess) || guess < MIN_KAVUM || guess > MAX_KAVUM) {
        kavumMessage.textContent = `Please enter a number between ${MIN_KAVUM} and ${MAX_KAVUM}.`;
        kavumMessage.className = "game-message info";
        return;
      }

      // Check the guess
      if (guess === actualKavumCount) {
        kavumMessage.textContent = `Hari Jayai! 🎉 You guessed it! There were ${actualKavumCount} Kavum!`;
        kavumMessage.className = "game-message success";
        kavumGameOver = true;
        kavumGuessInput.disabled = true;
        kavumSubmitBtn.disabled = true;
        kavumResetBtn.style.display = "inline-block"; // Show reset button
      } else if (guess < actualKavumCount) {
        kavumMessage.textContent = "Too low! Try guessing a bit higher. 🤔";
        kavumMessage.className = "game-message failure";
      } else {
        // guess > actualKavumCount
        kavumMessage.textContent = "Too high! Try guessing a little lower. 👇";
        kavumMessage.className = "game-message failure";
      }

      // Keep focus on input if game not over
      if (!kavumGameOver) {
        kavumGuessInput.focus();
        kavumGuessInput.select(); // Select text for easy replacement
      }
    }

    if (kavumSubmitBtn) {
      kavumSubmitBtn.addEventListener("click", handleKavumGuess);
    }
    if (kavumResetBtn) {
      kavumResetBtn.addEventListener("click", setupKavumGame);
    }
    if (kavumGuessInput) {
      // Allow pressing Enter to submit guess
      kavumGuessInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault(); // Prevent form submission if it were in a form
          handleKavumGuess();
        }
      });
    }

    // Initial setup
    setupKavumGame();
  })(); // End Games IIFE

  // --- Footer Current Year ---
  const yearSpan = document.getElementById("current-year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
}); // End DOMContentLoaded
