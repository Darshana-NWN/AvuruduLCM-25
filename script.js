```javascript
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
        if (nav.classList.contains("active")) { // Only close if active
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

      sections.forEach(current => {
          const sectionHeight = current.offsetHeight;
          const sectionTop = current.offsetTop - headerHeight - 50; // Adjust offset
          let sectionId = current.getAttribute("id");

          if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
              currentSectionId = sectionId;
          }
      });

       // If near the bottom, highlight the last section
        if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight - 50) { // Check if near bottom
            currentSectionId = sections[sections.length - 1].getAttribute('id');
        }

      // Add/remove active class
      navListItems.forEach(link => {
          link.classList.remove("active");
          // Check if the link's href matches the current section ID
          if (link.getAttribute("href") === "#" + currentSectionId) {
              link.classList.add("active");
          }
      });

      // Special case for top of page (highlight Home)
      if (currentSectionId === "" && sections.length > 0 && scrollY < sections[0].offsetTop - headerHeight - 50) {
          document.querySelector("nav a[href='#home']")?.classList.add("active");
      } else if (scrollY < 50 && sections.length > 0 && sections[0].id === 'home') { // Ensure home is active if very close to top
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
    // Added '.game-card' to the list of elements to reveal
    const elements = document.querySelectorAll(
      ".timeline-item, .nakath-card, .gallery-item, .info-card, .oc-card, .game-card"
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
        .timeline-item, .nakath-card, .gallery-item, .info-card, .oc-card, .game-card { /* Added .game-card */
            opacity: 0;
            transform: translateY(30px); /* Start slightly lower */
            transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        }
        .timeline-item.visible, .nakath-card.visible, .gallery-item.visible, .info-card.visible, .oc-card.visible, .game-card.visible { /* Added .game-card.visible */
            opacity: 1;
            transform: translateY(0);
        }

        /* Stagger timeline animation (optional) */
        .timeline-item:nth-child(odd).visible { transition-delay: 0.1s; }
        .timeline-item:nth-child(even).visible { transition-delay: 0.2s; }
    `;
  if (!document.getElementById('reveal-style')) { // Prevent adding style multiple times
    revealStyle.id = 'reveal-style';
    document.head.appendChild(revealStyle);
  }


  // Initial call and listener
  revealElements();
  window.addEventListener("scroll", revealElements);

  // --- Google Form Iframe Styling ---
  function styleGoogleFormIframe() {
    const googleFormIframe = document.getElementById("google-form"); // Check if iframe exists
    if (googleFormIframe) {
      googleFormIframe.addEventListener('load', () => { // Use load event listener
        setTimeout(() => { // Add a small delay just in case
          try {
            const iframeDoc = googleFormIframe.contentWindow.document;
            if (!iframeDoc) return; // Exit if document is not accessible

            // Create custom styles
            const customStyle = document.createElement("style");
            customStyle.textContent = `
                body {
                    background-color: transparent !important; /* Ensure transparency */
                    font-family: 'Poppins', sans-serif !important; /* Match site font */
                    padding: 5px; /* Add small padding */
                }
                .freebirdFormviewerViewFormCard {
                    box-shadow: none !important; /* Remove Google's card shadow */
                    border: none !important;
                    background-color: transparent !important;
                }
                .freebirdFormviewerViewHeaderHeader {
                     /* Optional: Hide Google Form Header if needed */
                     /* display: none !important; */
                }

                /* Button styling */
                .freebirdThemedFilledButtonM2, .freebirdSolidButtonM2 {
                    background-color: var(--primary-color, #e4202f) !important;
                    color: var(--light-color, #fff) !important;
                    border-radius: 30px !important; /* Match site buttons */
                    padding: 10px 24px !important;
                    font-weight: 600 !important;
                    transition: all 0.3s ease !important;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                .freebirdThemedFilledButtonM2:hover, .freebirdSolidButtonM2:hover {
                    background-color: var(--accent-color, #8b0000) !important;
                    box-shadow: 0 4px 10px rgba(0,0,0,0.2) !important;
                    transform: translateY(-2px);
                }

                /* Input field styling (example) */
                .quantumWizTextinputPaperinputInput {
                     font-family: 'Poppins', sans-serif !important;
                }
                .quantumWizTextinputPapertextareaInput {
                     font-family: 'Poppins', sans-serif !important;
                }
                /* Hide unnecessary footer/background elements */
                 .freebirdFormviewerViewFooterEmbeddedBackground {
                      display: none !important;
                 }
            `;
            iframeDoc.head.appendChild(customStyle);
          } catch (e) {
            // console.warn("Could not style Google Form iframe due to cross-origin restrictions.", e);
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
        if(daysEl) daysEl.textContent = "00";
        if(hoursEl) hoursEl.textContent = "00";
        if(minutesEl) minutesEl.textContent = "00";
        if(secondsEl) secondsEl.textContent = "00";
        // Optionally display a message like "Event Started!"
        // Example: countdownContainer.innerHTML = '<p class="event-started-message">Event has started!</p>';
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      // Update only if elements exist
      if(daysEl) daysEl.textContent = days.toString().padStart(2, "0");
      if(hoursEl) hoursEl.textContent = hours.toString().padStart(2, "0");
      if(minutesEl) minutesEl.textContent = minutes.toString().padStart(2, "0");
      if(secondsEl) secondsEl.textContent = seconds.toString().padStart(2, "0");
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
      currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
      updateLightboxImage();
    }

    function showNextImage() {
      currentImageIndex = (currentImageIndex + 1) % images.length;
      updateLightboxImage();
    }

    function updateLightboxImage() {
         if (images[currentImageIndex]) { // Check if image source exists
            lightboxImg.src = images[currentImageIndex];
        } else {
            console.error("Lightbox image source not found for index:", currentImageIndex);
            // Optionally close lightbox or show placeholder
             // closeLightbox();
        }
    }

    closeBtn.addEventListener("click", closeLightbox);
    prevBtn.addEventListener("click", showPrevImage);
    nextBtn.addEventListener("click", showNextImage);

    // Close lightbox if clicking outside the image
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) { // Only close if backdrop is clicked, not image/controls
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
     console.log("Lightbox elements not fully initialized or no gallery items found.");
  }


   // ==========================================
  // --- AVURUDU GAMES LOGIC ---
  // ==========================================

  // --- Game 1: Kana Mutti ---
  const potsContainer = document.getElementById('pots-container');
  const kanaMuttiResult = document.getElementById('kana-mutti-result');
  const kanaMuttiResetBtn = document.getElementById('kana-mutti-reset');
  const numPots = 6; // How many pots to show
  let winningPotIndex;
  let kanaMuttiActive = true;

  function setupKanaMutti() {
      kanaMuttiActive = true;
      potsContainer.innerHTML = ''; // Clear previous pots
      potsContainer.classList.remove('disabled');
      kanaMuttiResult.textContent = '';
      kanaMuttiResult.className = 'game-result'; // Reset result style

      // Create pots
      for (let i = 0; i < numPots; i++) {
          const pot = document.createElement('img');
          pot.src = 'images/games/pot.png'; // Default pot image
          pot.alt = 'Clay Pot';
          pot.classList.add('pot');
          pot.dataset.index = i; // Store index
          // Add error handling for image loading (optional but good practice)
          pot.onerror = () => { pot.style.display = 'none'; /* Hide if image fails */ }
          pot.addEventListener('click', handlePotClick);
          potsContainer.appendChild(pot);
      }
      // Choose a winner
      winningPotIndex = Math.floor(Math.random() * numPots);
  }

  function handlePotClick(event) {
      if (!kanaMuttiActive) return; // Don't do anything if game is over

      const clickedPot = event.target;
      const clickedIndex = parseInt(clickedPot.dataset.index);
      kanaMuttiActive = false; // Stop further clicks immediately
      potsContainer.classList.add('disabled'); // Visually disable other pots

      // Remove winner highlight from all first
       const allPots = potsContainer.querySelectorAll('.pot');
       allPots.forEach(p => p.classList.remove('winner'));


      if (clickedIndex === winningPotIndex) {
          clickedPot.classList.add('broken'); // Mark as broken
          // Set src for broken pot (ensure image exists)
          clickedPot.src = 'images/games/pot-broken.png';
          kanaMuttiResult.textContent = '🎉 Congratulations! You found the prize!';
          kanaMuttiResult.className = 'game-result success';
      } else {
          clickedPot.classList.add('incorrect');
          kanaMuttiResult.textContent = '😥 Oops! Wrong pot. Try again next time!';
          kanaMuttiResult.className = 'game-result failure';

          // Highlight the correct pot after a short delay
          const winnerPot = potsContainer.querySelector(`.pot[data-index="${winningPotIndex}"]`);
          if (winnerPot) {
              setTimeout(() => {
                winnerPot.classList.add('winner'); // Apply winner style
                 winnerPot.src = 'images/games/pot-prize.png'; // Optional: show prize pot image
              }, 600);
          }
      }
  }

  // Initial setup and reset listener
  if (potsContainer && kanaMuttiResetBtn) {
      setupKanaMutti(); // Initial setup
      kanaMuttiResetBtn.addEventListener('click', setupKanaMutti); // Setup on reset click
  } else {
      // console.log("Kana Mutti game elements not found.");
  }

  // --- Game 2: Pin the Eye ---
  const elephantContainer = document.getElementById('elephant-container');
  const pinEyeResult = document.getElementById('pin-eye-result');
  const pinEyeResetBtn = document.getElementById('pin-eye-reset');
  const placedEye = document.getElementById('placed-eye');
  const elephantImage = document.getElementById('elephant-image'); // Get the image element

  // === IMPORTANT: Set Target Coordinates based on your elephant.png ===
  // Values are % of the image dimensions (0-100)
  const targetEyeXPercent = 67; // Adjust X % (left to right)
  const targetEyeYPercent = 38; // Adjust Y % (top to bottom)
  // ====================================================================

  let pinEyeActive = true;

  function setupPinEye() {
      pinEyeActive = true;
      placedEye.style.display = 'none'; // Hide previously placed eye
      pinEyeResult.textContent = '';
      pinEyeResult.className = 'game-result'; // Reset result style
      elephantContainer.classList.remove('disabled');
  }

  function handlePinEyeClick(event) {
      if (!pinEyeActive) return;

      // Use the image element as the reference for dimensions if possible
      const imageElem = elephantImage || elephantContainer;
      const rect = imageElem.getBoundingClientRect();

      // Ensure click coordinates are relative to the IMAGE, not the container div border
      // Correcting for padding/border of the container might be needed if different from image
      // For simplicity, assuming container border/padding is minimal or click is on image
      let clickX = event.clientX - rect.left;
      let clickY = event.clientY - rect.top;

       // Ensure clicks are within the image bounds if rect refers to container
        if(clickX < 0) clickX = 0;
        if(clickY < 0) clickY = 0;
        if(clickX > rect.width) clickX = rect.width;
        if(clickY > rect.height) clickY = rect.height;


      pinEyeActive = false; // Game over for this round
      elephantContainer.classList.add('disabled');

      // Convert click coordinates to percentages OF THE IMAGE DIMENSIONS
      const clickXPercent = (clickX / rect.width) * 100;
      const clickYPercent = (clickY / rect.height) * 100;

      // Place the visual "eye" dot
      placedEye.style.left = `${clickXPercent}%`;
      placedEye.style.top = `${clickYPercent}%`;
      placedEye.style.display = 'block';

      // Calculate distance (using percentage difference for robustness)
      const diffX = clickXPercent - targetEyeXPercent;
      const diffY = clickYPercent - targetEyeYPercent;
      const distance = Math.sqrt(diffX * diffX + diffY * diffY);

      // Determine result message
      let message = '';
      let resultClass = 'failure';
      if (distance < 3) { // Adjust threshold for "perfect"
          message = '🎯 Perfect Pin! Unbelievable!';
          resultClass = 'success';
      } else if (distance < 7) { // Adjust threshold for "close"
          message = '👍 So Close! Excellent try!';
          resultClass = 'success'; // Still count as success-ish
      } else if (distance < 15) {
           message = '🙂 Getting warmer! Not bad.';
           resultClass = 'failure';
      } else {
          message = '🤷‍♂️ Way off! Better luck next time.';
           resultClass = 'failure';
      }

      pinEyeResult.textContent = message;
      pinEyeResult.className = `game-result ${resultClass}`;
  }

  // Initial setup and listeners
  if (elephantContainer && pinEyeResetBtn && placedEye && elephantImage) {
      setupPinEye(); // Initial setup
      elephantContainer.addEventListener('click', handlePinEyeClick);
      pinEyeResetBtn.addEventListener('click', setupPinEye); // Setup on reset click
  } else {
    // console.log("Pin the Eye game elements not fully found.");
  }

}); // End DOMContentLoaded