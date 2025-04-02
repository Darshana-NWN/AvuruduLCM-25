document.addEventListener("DOMContentLoaded", function () {
  // Mobile Menu Toggle
  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector("nav");

  if (menuToggle) {
    menuToggle.addEventListener("click", function () {
      nav.classList.toggle("active");
    });
  }

  // Close menu when clicking a link
  const navLinks = document.querySelectorAll("nav a");

  navLinks.forEach((link) => {
    link.addEventListener("click", function () {
      nav.classList.remove("active");
    });
  });

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: "smooth",
        });
      }
    });
  });

  // Tab functionality for gallery section
  const tabBtns = document.querySelectorAll(".tab-btn");
  const tabPanes = document.querySelectorAll(".tab-pane");

  tabBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      // Remove active class from all buttons
      tabBtns.forEach((btn) => btn.classList.remove("active"));

      // Add active class to clicked button
      this.classList.add("active");

      // Hide all panes
      tabPanes.forEach((pane) => pane.classList.remove("active"));

      // Show the selected pane
      const targetTab = this.getAttribute("data-tab");
      document.getElementById(targetTab).classList.add("active");
    });
  });

  // Header scroll effect
  const header = document.querySelector("header");

  window.addEventListener("scroll", function () {
    if (window.scrollY > 50) {
      header.style.background = "rgba(255, 255, 255, 0.95)";
      header.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.1)";
    } else {
      header.style.background = "rgba(255, 255, 255, 0.95)";
      header.style.boxShadow = "none";
    }
  });

  // Animation on scroll
  function revealElements() {
    const elements = document.querySelectorAll(
      ".timeline-item, .nakath-card, .gallery-item, .info-card"
    );

    elements.forEach((element) => {
      const elementTop = element.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;

      if (elementTop < windowHeight - 100) {
        element.classList.add("visible");
      }
    });
  }

  // Add CSS class for animation
  const style = document.createElement("style");
  style.textContent = `
        .timeline-item, .nakath-card, .gallery-item, .info-card {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.5s ease, transform 0.5s ease;
        }
        
        .timeline-item.visible, .nakath-card.visible, .gallery-item.visible, .info-card.visible {
            opacity: 1;
            transform: translateY(0);
        }
        
        .timeline-item:nth-child(odd) {
            transform: translateX(-20px);
        }
        
        .timeline-item:nth-child(even) {
            transform: translateX(20px);
        }
        
        .timeline-item.visible:nth-child(odd), .timeline-item.visible:nth-child(even) {
            transform: translateX(0);
        }
    `;
  document.head.appendChild(style);

  // Call on page load
  revealElements();

  // Call on scroll
  window.addEventListener("scroll", revealElements);

  // Update Google Form URL and add custom styling
  function updateGoogleFormURL(newURL) {
    const googleFormIframe = document.getElementById("google-form");
    if (googleFormIframe) {
      googleFormIframe.src = newURL;

      // Add load event listener to style the iframe content
      googleFormIframe.addEventListener("load", function () {
        try {
          const iframeDoc = googleFormIframe.contentWindow.document;

          // Create custom styles for the form
          const customStyle = document.createElement("style");
          customStyle.textContent = `
            body {
              background: transparent !important;
              font-family: "Poppins", sans-serif !important;
            }
            
            form {
              background: transparent !important;
              animation: fadeIn 0.5s ease-out;
            }
            
            @keyframes fadeIn {
              from {
                opacity: 0;
                transform: translateY(20px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
            
            .freebirdFormviewerViewNavigationPasswordWarning,
            .freebirdFormviewerViewFooterEmbeddedBackground {
              display: none !important;
            }
            
            .freebirdFormviewerViewFormCard {
              background: transparent !important;
              box-shadow: none !important;
            }
            
            .freebirdFormviewerViewItemsItemItem {
              transition: transform 0.3s ease;
            }
            
            .freebirdFormviewerViewItemsItemItem:hover {
              transform: translateX(10px);
            }
            
            .freebirdThemedFilledButtonM2 {
              background-color: #e4202f !important;
              transition: all 0.3s ease !important;
            }
            
            .freebirdThemedFilledButtonM2:hover {
              background-color: #8b0000 !important;
              box-shadow: 0 8px 16px rgba(0,0,0,0.2) !important;
              transform: translateY(-2px);
            }
          `;

          iframeDoc.head.appendChild(customStyle);
        } catch (e) {
          console.log("Note: Cannot style iframe due to same-origin policy");
        }
      });
    }
  }

  // Example usage:
  // updateGoogleFormURL('https://docs.google.com/forms/d/e/YOUR_NEW_FORM_ID/viewform?embedded=true');

  // You can call the function anywhere to update the form URL
  // For demonstration, let's assume there might be a URL in the localStorage that we should use
  const savedFormURL = localStorage.getItem("avuruduFormURL");
  if (savedFormURL) {
    updateGoogleFormURL(savedFormURL);
  }

  // Function to create a countdown timer
  function createCountdown(targetDate, containerId) {
    const countdownContainer = document.getElementById(containerId);
    if (!countdownContainer) return;

    // Clear any existing content
    countdownContainer.innerHTML = `
      <div class="countdown-item">
        <span id="${containerId}-days">00</span>
        <span class="countdown-label">Days</span>
      </div>
      <div class="countdown-item">
        <span id="${containerId}-hours">00</span>
        <span class="countdown-label">Hours</span>
      </div>
      <div class="countdown-item">
        <span id="${containerId}-minutes">00</span>
        <span class="countdown-label">Minutes</span>
      </div>
      <div class="countdown-item">
        <span id="${containerId}-seconds">00</span>
        <span class="countdown-label">Seconds</span>
      </div>
    `;

    // Update countdown timer
    function updateCountdown() {
      const now = new Date().getTime();
      const distance = targetDate - now;

      // Calculate days, hours, minutes, seconds
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      // Display the result
      document.getElementById(`${containerId}-days`).textContent = days
        .toString()
        .padStart(2, "0");
      document.getElementById(`${containerId}-hours`).textContent = hours
        .toString()
        .padStart(2, "0");
      document.getElementById(`${containerId}-minutes`).textContent = minutes
        .toString()
        .padStart(2, "0");
      document.getElementById(`${containerId}-seconds`).textContent = seconds
        .toString()
        .padStart(2, "0");

      // If the countdown is over
      if (distance < 0) {
        clearInterval(countdownInterval);
        document.getElementById(`${containerId}-days`).textContent = "00";
        document.getElementById(`${containerId}-hours`).textContent = "00";
        document.getElementById(`${containerId}-minutes`).textContent = "00";
        document.getElementById(`${containerId}-seconds`).textContent = "00";
      }
    }

    // Run function immediately and then every second
    updateCountdown();
    const countdownInterval = setInterval(updateCountdown, 1000);
  }

  // Initialize event and Avurudu countdowns
  const eventDate = new Date("April 19, 2025 08:30:00").getTime();
  const avuruduDate = new Date("April 14, 2025 08:13:00").getTime();

  createCountdown(eventDate, "event-countdown");
  createCountdown(avuruduDate, "avurudu-countdown");

  // Photo gallery slideshow with random change
  function initializeGallerySlideshow() {
    const galleryItems = document.querySelectorAll(".gallery-item");
    if (galleryItems.length === 0) return;

    // Get all image sources from gallery
    const galleryImages = Array.from(galleryItems).map((item) => {
      return {
        imgSrc: item.querySelector("img").src,
        title: item.querySelector(".overlay h3").textContent,
        description: item.querySelector(".overlay p").textContent,
      };
    });

    // Create slideshow container if it doesn't exist
    if (!document.querySelector(".slideshow-container")) {
      const galleryGrid = document.querySelector(".gallery-grid");
      const slideshowContainer = document.createElement("div");
      slideshowContainer.className = "slideshow-container";

      // Create slideshow controls
      slideshowContainer.innerHTML = `
        <div class="slideshow-frame">
          <div class="slideshow-image active"></div>
          <div class="slideshow-image"></div>
          <div class="slideshow-overlay">
            <h3></h3>
            <p></p>
          </div>
        </div>
        <div class="slideshow-controls">
          <button class="slideshow-control pause-btn">
            <i class="fas fa-pause"></i>
          </button>
          <button class="slideshow-control grid-btn">
            <i class="fas fa-th"></i>
          </button>
        </div>
      `;

      // Insert the slideshow container before the gallery grid
      galleryGrid.parentNode.insertBefore(slideshowContainer, galleryGrid);

      // Add styles for slideshow
      const slideshowStyle = document.createElement("style");
      slideshowStyle.textContent = `
        .slideshow-container {
          position: relative;
          width: 100%;
          max-width: 100%;
          margin-bottom: 30px;
          border-radius: var(--border-radius);
          box-shadow: var(--box-shadow);
          overflow: hidden;
          display: block;
        }
        
        .gallery-grid {
          display: none;
        }
        
        .gallery-grid.active {
          display: grid;
        }
        
        .slideshow-frame {
          position: relative;
          width: 100%;
          height: 500px;
          background: #000;
          overflow: hidden;
        }
        
        .slideshow-image {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-size: cover;
          background-position: center;
          opacity: 0;
          transition: opacity 1.2s ease-in-out, transform 2s ease;
          transform: scale(1.1) rotate(0.5deg);
        }
        
        .slideshow-image.active {
          opacity: 1;
          transform: scale(1) rotate(0deg);
          z-index: 1;
        }
        
        .slideshow-image.fade-out {
          opacity: 0;
          transform: scale(1.02) rotate(-0.5deg);
        }
        
        .slideshow-overlay {
          position: absolute;
          bottom: -100%;
          left: 0;
          width: 100%;
          padding: 25px;
          background: linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0.4), transparent);
          color: var(--light-color);
          z-index: 2;
          transition: bottom 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .slideshow-image.active + .slideshow-overlay,
        .slideshow-frame:hover .slideshow-overlay {
          bottom: 0;
        }
        
        .slideshow-overlay h3 {
          font-size: 1.5rem;
          color: var(--secondary-color);
          margin-bottom: 10px;
          transform: translateY(20px);
          opacity: 0;
          transition: transform 0.6s ease 0.2s, opacity 0.6s ease 0.2s;
        }
        
        .slideshow-overlay p {
          transform: translateY(20px);
          opacity: 0;
          transition: transform 0.6s ease 0.3s, opacity 0.6s ease 0.3s;
        }
        
        .slideshow-image.active + .slideshow-overlay h3,
        .slideshow-image.active + .slideshow-overlay p,
        .slideshow-frame:hover .slideshow-overlay h3,
        .slideshow-frame:hover .slideshow-overlay p {
          transform: translateY(0);
          opacity: 1;
        }
        
        @media (max-width: 768px) {
          .slideshow-frame {
            height: 350px;
          }
        }
        
        @media (max-width: 576px) {
          .slideshow-frame {
            height: 250px;
          }
        }
      `;
      document.head.appendChild(slideshowStyle);

      // Set up slideshow functionality
      const slideshowImages = document.querySelectorAll(".slideshow-image");
      const slideshowTitle = document.querySelector(".slideshow-overlay h3");
      const slideshowDesc = document.querySelector(".slideshow-overlay p");
      const pauseBtn = document.querySelector(".pause-btn");
      const gridBtn = document.querySelector(".grid-btn");

      let isPaused = false;
      let currentIndex = 0;
      let nextIndex = 1;
      let slideshowInterval;

      // Function to update slideshow image
      function updateSlideshow() {
        if (isPaused) return;

        // Pick a random image that's not the current one
        let randomIndex;
        do {
          randomIndex = Math.floor(Math.random() * galleryImages.length);
        } while (randomIndex === currentIndex);

        // Update next image before showing it
        slideshowImages[
          nextIndex
        ].style.backgroundImage = `url('${galleryImages[randomIndex].imgSrc}')`;

        // First fade out current image
        slideshowImages[currentIndex].classList.add("fade-out");

        // Short delay before showing next image for smoother transition
        setTimeout(() => {
          // Remove active class from current image
          slideshowImages[currentIndex].classList.remove("active");
          // Add active class to next image
          slideshowImages[nextIndex].classList.add("active");
          slideshowImages[nextIndex].classList.remove("fade-out");

          // Update title and description
          slideshowTitle.textContent = galleryImages[randomIndex].title;
          slideshowDesc.textContent = galleryImages[randomIndex].description;

          // Swap indices
          currentIndex = nextIndex;
          nextIndex = nextIndex === 0 ? 1 : 0;
        }, 300);
      }

      // Initialize slideshow with first image
      slideshowImages[0].style.backgroundImage = `url('${galleryImages[0].imgSrc}')`;
      slideshowTitle.textContent = galleryImages[0].title;
      slideshowDesc.textContent = galleryImages[0].description;

      // Start slideshow timer
      function startSlideshow() {
        // Random interval between 2-3 seconds
        const randomInterval = Math.floor(Math.random() * 1000) + 2000; // 2000-3000ms
        slideshowInterval = setInterval(updateSlideshow, randomInterval);
      }

      startSlideshow();

      // Pause/resume slideshow
      pauseBtn.addEventListener("click", function () {
        isPaused = !isPaused;
        this.innerHTML = isPaused
          ? '<i class="fas fa-play"></i>'
          : '<i class="fas fa-pause"></i>';

        if (isPaused) {
          clearInterval(slideshowInterval);
        } else {
          startSlideshow();
        }
      });

      // Toggle between slideshow and grid view
      gridBtn.addEventListener("click", function () {
        const slideshowContainer = document.querySelector(
          ".slideshow-container"
        );
        const galleryGrid = document.querySelector(".gallery-grid");

        if (slideshowContainer.style.display !== "none") {
          slideshowContainer.style.display = "none";
          galleryGrid.classList.add("active");
          clearInterval(slideshowInterval);
        } else {
          slideshowContainer.style.display = "block";
          galleryGrid.classList.remove("active");
          if (!isPaused) {
            startSlideshow();
          }
        }
      });

      // Add lightbox functionality for clicked images
      const lightboxStyle = document.createElement("style");
      lightboxStyle.textContent = `
        .lightbox {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.9);
          z-index: 1000;
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        
        .lightbox.active {
          opacity: 1;
          visibility: visible;
        }
        
        .lightbox-image {
          max-width: 90%;
          max-height: 90vh;
          transform: scale(0.9);
          transition: transform 0.3s ease;
          border-radius: 10px;
          box-shadow: 0 5px 30px rgba(0, 0, 0, 0.3);
        }
        
        .lightbox.active .lightbox-image {
          transform: scale(1);
        }
        
        .lightbox-close {
          position: absolute;
          top: 20px;
          right: 20px;
          color: #fff;
          font-size: 2rem;
          cursor: pointer;
          transition: transform 0.3s ease;
        }
        
        .lightbox-close:hover {
          transform: rotate(90deg);
        }
        
        .lightbox-nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          color: #fff;
          font-size: 2rem;
          cursor: pointer;
          transition: all 0.3s ease;
          opacity: 0.7;
          background: rgba(0, 0, 0, 0.5);
          width: 50px;
          height: 50px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .lightbox-nav:hover {
          opacity: 1;
          background: rgba(228, 32, 47, 0.8);
        }
        
        .lightbox-prev {
          left: 20px;
        }
        
        .lightbox-next {
          right: 20px;
        }
      `;
      document.head.appendChild(lightboxStyle);

      // Create lightbox elements
      const lightbox = document.createElement("div");
      lightbox.className = "lightbox";
      lightbox.innerHTML = `
        <i class="fas fa-times lightbox-close"></i>
        <i class="fas fa-chevron-left lightbox-nav lightbox-prev"></i>
        <i class="fas fa-chevron-right lightbox-nav lightbox-next"></i>
        <img class="lightbox-image" src="" alt="Enlarged view">
      `;
      document.body.appendChild(lightbox);

      // Lightbox functionality
      const lightboxImage = lightbox.querySelector(".lightbox-image");
      const lightboxClose = lightbox.querySelector(".lightbox-close");
      const lightboxPrev = lightbox.querySelector(".lightbox-prev");
      const lightboxNext = lightbox.querySelector(".lightbox-next");
      let currentLightboxIndex = 0;

      slideshowImages.forEach((image, index) => {
        image.addEventListener("click", () => {
          currentLightboxIndex = index;
          lightboxImage.src = galleryImages[currentLightboxIndex].imgSrc;
          lightbox.classList.add("active");
          isPaused = true;
          pauseBtn.innerHTML = '<i class="fas fa-play"></i>';
          clearInterval(slideshowInterval);
        });
      });

      // Close lightbox
      lightboxClose.addEventListener("click", () => {
        lightbox.classList.remove("active");
      });

      // Navigate through images in lightbox
      lightboxPrev.addEventListener("click", () => {
        currentLightboxIndex =
          (currentLightboxIndex - 1 + galleryImages.length) %
          galleryImages.length;
        lightboxImage.src = galleryImages[currentLightboxIndex].imgSrc;
      });

      lightboxNext.addEventListener("click", () => {
        currentLightboxIndex =
          (currentLightboxIndex + 1) % galleryImages.length;
        lightboxImage.src = galleryImages[currentLightboxIndex].imgSrc;
      });

      // Keyboard navigation
      document.addEventListener("keydown", (e) => {
        if (lightbox.classList.contains("active")) {
          if (e.key === "Escape") {
            lightbox.classList.remove("active");
          } else if (e.key === "ArrowLeft") {
            lightboxPrev.click();
          } else if (e.key === "ArrowRight") {
            lightboxNext.click();
          }
        }
      });

      // Close lightbox when clicking outside the image
      lightbox.addEventListener("click", (e) => {
        if (e.target === lightbox) {
          lightbox.classList.remove("active");
        }
      });
    }
  }

  // Initialize gallery slideshow
  initializeGallerySlideshow();

  // Update Google form URL
  updateGoogleFormURL(
    "https://docs.google.com/forms/d/e/1FAIpQLScF0I0NY01GDO5hsmPtgJSDbTLphX4P5FCtCC-wzrpvf5M4Yg/viewform?embedded=true"
  );

  // Image loading handling
  function handleImageLoading() {
    const images = document.querySelectorAll("img");
    images.forEach((img) => {
      img.classList.add("loading");
      img.onload = () => img.classList.remove("loading");
      img.onerror = () => {
        img.classList.remove("loading");
        img.src = "Logos/AIESEC/Black-Logo.png"; // Fallback image
      };
    });
  }

  // Handle iframe loading
  function handleIframeLoading() {
    const iframes = document.querySelectorAll("iframe");
    iframes.forEach((iframe) => {
      iframe.classList.add("loading");
      iframe.onload = () => iframe.classList.remove("loading");
    });
  }

  // Handle tab switching with keyboard
  function handleTabKeyboardNavigation() {
    const tabBtns = document.querySelectorAll(".tab-btn");
    tabBtns.forEach((btn) => {
      btn.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          btn.click();
        }
      });
    });
  }

  // Initialize all event handlers
  handleImageLoading();
  handleIframeLoading();
  handleTabKeyboardNavigation();

  // Prevent zoom on double tap on mobile
  let lastTouchEnd = 0;
  document.addEventListener(
    "touchend",
    (e) => {
      const now = Date.now();
      if (now - lastTouchEnd <= 300) {
        e.preventDefault();
      }
      lastTouchEnd = now;
    },
    false
  );
});
