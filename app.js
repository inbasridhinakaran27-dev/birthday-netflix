/**
 * LoveFlix Core Logic - True Netflix Edition
 * SPA Controller, dynamic renderer, custom video engine, live calendar countdown, and Tudum spinner.
 */

document.addEventListener("DOMContentLoaded", () => {
  // Ensure config loaded
  if (typeof NetflixConfig === "undefined") {
    console.error("Configuration file config.js not loaded.");
    return;
  }

  // --- DOM Elements ---
  const profileScreen = document.getElementById("profile-screen");
  const mainDashboard = document.getElementById("main-dashboard");
  const profileGrid = document.getElementById("profile-grid");
  const netflixLoader = document.getElementById("netflix-loader");
  
  // Navbar Elements
  const navbar = document.getElementById("navbar");
  const navAvatarImg = document.getElementById("nav-avatar-img");
  const navProfileText = document.getElementById("nav-profile-text");
  const navProfileActive = document.getElementById("nav-profile-active");
  const navLinks = document.querySelectorAll(".nav-links .nav-item");

  // Hero/Billboard Elements
  const heroSubtitle = document.getElementById("hero-subtitle");
  const heroTitle = document.getElementById("hero-title");
  const heroMatch = document.getElementById("hero-match");
  const heroYear = document.getElementById("hero-year");
  const heroRating = document.getElementById("hero-rating");
  const heroSeasons = document.getElementById("hero-seasons");
  const heroDesc = document.getElementById("hero-desc");
  const heroPlayBtn = document.getElementById("hero-play-btn");
  const heroInfoBtn = document.getElementById("hero-info-btn");
  const heroBanner = document.getElementById("hero-banner");
  const billboardMaturity = document.getElementById("billboard-maturity");

  // Rows and Footer Elements
  const rowsContainer = document.getElementById("rows-container");
  const footerSig = document.getElementById("footer-sig");
  const starringNames = document.getElementById("starring-names");

  // Custom Video Player Elements
  const videoPlayerWrapper = document.getElementById("video-player-wrapper");
  const videoPosterOverlay = document.getElementById("video-poster-overlay");
  const bigPlayBtn = document.getElementById("big-play-btn");
  const mainLoveVideo = document.getElementById("main-love-video");
  const centerPlayPauseBtn = document.getElementById("center-play-pause-btn");
  const playPauseBtn = document.getElementById("play-pause-btn");
  const skipBackBtn = document.getElementById("skip-back-btn");
  const skipForwardBtn = document.getElementById("skip-forward-btn");
  const volumeBtn = document.getElementById("volume-btn");
  const volumeSlider = document.getElementById("volume-slider");
  const playerProgressContainer = document.getElementById("player-progress-container");
  const playerProgressBar = document.getElementById("player-progress-bar");
  const videoTimeDisplay = document.getElementById("video-time-display");
  const fullscreenBtn = document.getElementById("fullscreen-btn");

  // Advanced Player Controls
  const brightnessSlider = document.getElementById("brightness-slider");
  const brightnessBtn = document.getElementById("brightness-btn");
  const contrastSlider = document.getElementById("contrast-slider");
  const contrastBtn = document.getElementById("contrast-btn");
  const thumbsUpBtn = document.getElementById("thumbs-up-btn");
  const thumbsDownBtn = document.getElementById("thumbs-down-btn");
  const speedBtn = document.getElementById("speed-btn");
  const lockBtn = document.getElementById("lock-btn");
  const audioSubtitlesBtn = document.getElementById("audio-subtitles-btn");

  // State Management
  let activeProfile = null;
  let currentSpeed = 1;
  let isControlsLocked = false;
  let videoFilter = { brightness: 1, contrast: 1 };

  const getActiveFullscreenElement = () => document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement;

  // --- Safe Lucide Helper ---
  function safeCreateIcons() {
    if (typeof window.lucide !== 'undefined' && window.lucide && window.lucide.createIcons) {
      window.lucide.createIcons();
    }
  }

  // --- ASSET PROTECTION - Prevent Direct Downloads ---
  function initAssetProtection() {
    // 1. Block direct access to assets - if URL contains /assets/ directly accessed, redirect
    if (window.location.pathname.startsWith('/assets/')) {
      window.location.href = '/';
      return;
    }

    // 2. Prevent hotlinking - check referrer
    if (document.referrer && !document.referrer.includes(window.location.hostname)) {
      // Allow same-domain requests only
      const url = new URL(document.referrer);
      if (url.hostname !== window.location.hostname && url.hostname !== 'localhost') {
        // Block external hotlinks
        document.body.innerHTML = '<h1>Access Denied</h1>';
        return;
      }
    }

    // 3. Intercept image loads and add referrer-policy
    document.querySelectorAll('img').forEach(img => {
      img.referrerPolicy = 'strict-origin-when-cross-origin';
      img.crossOrigin = 'anonymous';
    });

    // 4. Block direct downloads via network interception (if service worker available)
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('data:text/javascript,self.oninstall=()=>self.skipWaiting();self.onactivate=()=>clients.claim();self.onfetch=e=>{if(e.request.url.includes("/assets/")&&!e.request.referrer.includes(location.hostname)){e.respondWith(new Response("Access Denied",{status:403}))}}', { scope: '/' }).catch(() => {});
    }

    // 5. Disable right-click context menu on all images and videos
    document.addEventListener("contextmenu", (e) => {
      if (e.target.tagName === "IMG" || e.target.tagName === "VIDEO" || e.target.closest(".profile-avatar") || e.target.closest(".custom-video")) {
        e.preventDefault();
        return false;
      }
    });

    // 6. Disable drag and drop on media elements
    document.addEventListener("dragstart", (e) => {
      if (e.target.tagName === "IMG" || e.target.tagName === "VIDEO") {
        e.preventDefault();
        return false;
      }
    });

    // 7. Disable save shortcuts (Ctrl+S, Cmd+S)
    document.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        return false;
      }
    });

    // 8. Prevent opening developer tools with common shortcuts
    document.addEventListener("keydown", (e) => {
      // F12 - Developer Tools
      if (e.key === "F12") {
        e.preventDefault();
        return false;
      }
      // Ctrl+Shift+I - Inspect Element
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "I") {
        e.preventDefault();
        return false;
      }
      // Ctrl+Shift+C - Element Inspector
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "C") {
        e.preventDefault();
        return false;
      }
      // Ctrl+Shift+J - Console (Chrome)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "J") {
        e.preventDefault();
        return false;
      }
    });

    // 9. Add draggable="false" to all images and videos dynamically
    const addNoDragAttribute = () => {
      document.querySelectorAll("img, video").forEach(el => {
        el.setAttribute("draggable", "false");
        el.style.userSelect = "none";
        el.style.webkitUserSelect = "none";
        el.style.MozUserSelect = "none";
        el.style.msUserSelect = "none";
      });
    };

    // Apply on load and whenever DOM changes
    addNoDragAttribute();
    const observer = new MutationObserver(addNoDragAttribute);
    observer.observe(document.body, { childList: true, subtree: true });

    // 10. Remove downloadable attributes from video sources
    document.querySelectorAll("video source").forEach(source => {
      source.removeAttribute("download");
    });

    // 11. Disable text selection on media containers for extra protection
    document.querySelectorAll(".profile-card, .video-player-wrapper, .profile-avatar-wrapper").forEach(el => {
      el.style.userSelect = "none";
      el.style.webkitUserSelect = "none";
    });

    // 12. Prevent printing (Ctrl+P, Cmd+P) to avoid saving as PDF
    document.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "p") {
        e.preventDefault();
        return false;
      }
    });

    // 13. Disable right-click entirely on video player and images (more aggressive)
    const protectedElements = document.querySelectorAll("video, .video-player-wrapper, .profile-avatar, .profile-card");
    protectedElements.forEach(el => {
      el.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        return false;
      });
    });

    // 14. Block browser's native download for all media
    window.addEventListener('beforeunload', () => false);
  }

  // --- Initial Hydration ---
  // Ensure lucide is available before initializing
  function startApp() {
    initApp();
    initAssetProtection();
  }
  
  if (typeof window.lucide !== 'undefined' && window.lucide) {
    startApp();
  } else {
    setTimeout(startApp, 1000); // Fallback after 1 second
  }

  function initApp() {
    // Set Header/Signature text
    footerSig.textContent = `Designed with love for ${NetflixConfig.coupleNames.partner1} & ${NetflixConfig.coupleNames.partner2}`;
    starringNames.textContent = `${NetflixConfig.coupleNames.partner1} & ${NetflixConfig.coupleNames.partner2}`;

    // Load Profiles
    renderProfiles();

    // Load Hero/Billboard details
    loadHeroSection();

    // Render Content Rows
    renderContentRows();

    // Start live countdown timer
    updateCountdown();
    setInterval(updateCountdown, 1000);

    // Initialize Lucide Icons initially for profile screen
    safeCreateIcons();

    // Bind custom player controls
    initVideoPlayer();

    // Bind scroll listener for navbar transparency toggles
    window.addEventListener("scroll", handleNavbarScroll);

    // Bind navigation link clicks
    bindNavigationScrolls();
    
    // Bind click to navbar active profile to return to select page
    navProfileActive.addEventListener("click", () => {
      switchToProfileSelection();
    });
  }

  // --- Dynamic Audio Synthesizer (Iconic Netflix "Tudum" Sound) ---
  function playTudumSound() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      
      const ctx = new AudioCtx();
      
      // Drum Thud 1 (The "Tu")
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(80, ctx.currentTime);
      osc1.frequency.exponentialRampToValueAtTime(32, ctx.currentTime + 0.3);
      gain1.gain.setValueAtTime(1.2, ctx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start();
      osc1.stop(ctx.currentTime + 0.3);
      
      // Drum Thud 2 + Resonant Overtone (The "Dum")
      setTimeout(() => {
        const osc2 = ctx.createOscillator();
        const osc3 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        
        // Low pitch
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(90, ctx.currentTime);
        osc2.frequency.exponentialRampToValueAtTime(36, ctx.currentTime + 0.75);
        
        // Mid-frequency overtone layer for warm resonance
        osc3.type = 'sine';
        osc3.frequency.setValueAtTime(180, ctx.currentTime);
        osc3.frequency.exponentialRampToValueAtTime(72, ctx.currentTime + 0.75);
        
        gain2.gain.setValueAtTime(0.9, ctx.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.75);
        
        osc2.connect(gain2);
        osc3.connect(gain2);
        gain2.connect(ctx.destination);
        
        osc2.start();
        osc3.start();
        osc2.stop(ctx.currentTime + 0.75);
        osc3.stop(ctx.currentTime + 0.75);
      }, 130);
    } catch(e) {
      console.warn("Web Audio API not allowed or supported by browser policy:", e);
    }
  }

  // --- Netflix Notifications Sound ---
  function playNotificationSound() {
    try {
      // Try with relative path first
      let audioPath = './assets/netflix.mp3';
      
      // Create audio with better error handling
      const audio = new Audio(audioPath);
      audio.volume = 0.7;
      audio.preload = 'auto';
      
      // Add event listeners for debugging
      audio.addEventListener('error', () => {
        console.warn("Audio file not found at:", audioPath);
        // Try alternative path
        const altAudio = new Audio('assets/netflix.mp3');
        altAudio.volume = 0.7;
        altAudio.play().catch(err => {
          console.warn("Could not play notification sound:", err);
        });
      });
      
      audio.play().catch(error => {
        console.warn("Could not play notification sound:", error.message);
      });
    } catch(e) {
      console.warn("Error playing notification sound:", e.message);
    }
  }

  // --- Profile Selection Logic ---
  function renderProfiles() {
    profileGrid.innerHTML = "";
    
    NetflixConfig.profiles.forEach(profile => {
      const card = document.createElement("div");
      card.className = "profile-card";
      card.setAttribute("data-id", profile.id);
      
      card.innerHTML = `
        <div class="profile-avatar-wrapper">
          <img src="${profile.image}" alt="${profile.name}" class="profile-avatar" onerror="this.src='https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=150&auto=format&fit=crop'">
        </div>
        <span class="profile-name">${profile.name}</span>
      `;
      
      card.addEventListener("click", () => {
        // Play notification sound immediately
        playNotificationSound();
        
        // Start Netflix transition
        triggerNetflixLoader(profile);
      });
      
      profileGrid.appendChild(card);
    });
  }

  function triggerNetflixLoader(profile) {
    // Show loading overlay
    netflixLoader.classList.add("active");
    
    // Scale down profiles
    profileScreen.style.transform = "scale(0.95)";
    profileScreen.style.opacity = "0";

    // Set navbar details and billboard taglines
    activeProfile = profile;
    navAvatarImg.src = profile.image;
    navAvatarImg.onerror = function() {
      this.src = "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=150&auto=format&fit=crop";
    };
    navProfileText.textContent = profile.name;
    heroSubtitle.textContent = profile.tagline;

    // Simulate Netflix loading circle spin for 1.3 seconds
    setTimeout(() => {
      // Hide selection screen completely
      profileScreen.style.display = "none";
      
      // Reveal home feed page
      mainDashboard.style.display = "flex";
      mainDashboard.style.opacity = "0";
      mainDashboard.style.transform = "translateY(15px)";
      
      // Force layout recalculation
      mainDashboard.offsetHeight;
      
      // Transition details
      mainDashboard.style.transition = "opacity 0.5s ease-out, transform 0.5s ease-out";
      mainDashboard.style.opacity = "1";
      mainDashboard.style.transform = "translateY(0)";
      
      // Hide the spinner smoothly
      netflixLoader.classList.remove("active");
      
      // Refresh icons for dynamic components
      safeCreateIcons();
      window.scrollTo(0, 0);
    }, 1300);
  }

  // --- Profile Selection Logic ---
  function switchToProfileSelection() {
    // Stop video if playing
    pauseVideo();

    // Show spinner again briefly
    netflixLoader.classList.add("active");
    
    setTimeout(() => {
      // Hide feed dashboard
      mainDashboard.style.display = "none";
      mainDashboard.style.opacity = "0";
      
      // Reveal profiles selection screen
      profileScreen.style.display = "flex";
      profileScreen.offsetHeight; // Force layout
      
      profileScreen.style.opacity = "1";
      profileScreen.style.transform = "scale(1)";
      
      // Fade out loading spinner
      netflixLoader.classList.remove("active");
      safeCreateIcons();
    }, 600);
  }

  // --- Hero Section Hydration ---
  function loadHeroSection() {
    const hero = NetflixConfig.hero;
    
    heroTitle.textContent = hero.title;
    heroSubtitle.textContent = hero.subtitle;
    heroMatch.textContent = hero.matchPercentage;
    heroYear.textContent = hero.releaseYear;
    heroRating.textContent = hero.maturityRating;
    heroSeasons.textContent = hero.seasons;
    heroDesc.textContent = hero.description;
    
    // Set hero banner background image
    heroBanner.style.backgroundImage = `url('${hero.backgroundImage}')`;
    
    // Add play action to hero play button
    heroPlayBtn.addEventListener("click", () => {
      scrollToAndPlayVideo();
    });

    // Info button scrolls to counter section
    heroInfoBtn.addEventListener("click", () => {
      const counterSect = document.getElementById("counter-section");
      const navHeight = navbar.offsetHeight;
      const targetPos = counterSect.getBoundingClientRect().top + window.scrollY - navHeight;
      
      window.scrollTo({
        top: targetPos,
        behavior: "smooth"
      });
      
      // Pulse animation effect on counter cards
      const cards = document.querySelectorAll(".counter-card");
      cards.forEach(card => {
        card.style.transform = "scale(1.08)";
        card.style.backgroundColor = "#3f3f3f";
        card.style.boxShadow = "0 8px 20px rgba(0,0,0,0.6)";
      });
      setTimeout(() => {
        cards.forEach(card => {
          card.style.transform = "";
          card.style.backgroundColor = "";
          card.style.boxShadow = "";
        });
      }, 1500);
    });
  }

  // --- Render Content Rows Dynamically ---
  function renderContentRows() {
    rowsContainer.innerHTML = "";
    
    NetflixConfig.rows.forEach(row => {
      const rowEl = document.createElement("section");
      rowEl.className = "content-row";
      rowEl.id = `${row.id}-row`;
      
      // Build Row Header
      const headerEl = document.createElement("h2");
      headerEl.className = "row-title";
      headerEl.textContent = row.title;
      rowEl.appendChild(headerEl);
      
      // Build Slider Wrapper
      const sliderWrapper = document.createElement("div");
      sliderWrapper.className = "cards-slider-wrapper";
      
      // Left Slide Arrow
      const leftArrow = document.createElement("button");
      leftArrow.className = "slider-arrow slider-arrow-left";
      leftArrow.innerHTML = `<i data-lucide="chevron-left"></i>`;
      
      // Right Slide Arrow
      const rightArrow = document.createElement("button");
      rightArrow.className = "slider-arrow slider-arrow-right";
      rightArrow.innerHTML = `<i data-lucide="chevron-right"></i>`;
      
      // Slider Card Body
      const slider = document.createElement("div");
      slider.className = "cards-slider";
      
      row.cards.forEach(card => {
        const cardEl = document.createElement("div");
        cardEl.className = "movie-card";
        
        cardEl.innerHTML = `
          <img src="${card.image}" alt="${card.title}" class="movie-poster" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=300&auto=format&fit=crop'">
          <div class="movie-card-overlay">
            <h4 class="movie-card-title">${card.title}</h4>
            <div class="movie-card-meta">
              <span class="movie-card-match">100% Match</span>
              <span class="movie-card-badge">${card.rating || '13+'}</span>
              <span class="movie-card-duration">${card.duration || '2h'}</span>
              <span class="movie-card-quality">HD</span>
            </div>
            <p class="movie-card-desc">${card.description || ''}</p>
          </div>
        `;
        
        // Add card click action to scroll to video and play it
        cardEl.addEventListener("click", () => {
          scrollToAndPlayVideo(card.title, card.description);
        });
        
        slider.appendChild(cardEl);
      });
      
      sliderWrapper.appendChild(leftArrow);
      sliderWrapper.appendChild(slider);
      sliderWrapper.appendChild(rightArrow);
      rowEl.appendChild(sliderWrapper);
      rowsContainer.appendChild(rowEl);

      // Bind slide arrow buttons scroll actions
      leftArrow.addEventListener("click", () => {
        slider.scrollBy({ left: -slider.offsetWidth * 0.75, behavior: "smooth" });
      });
      rightArrow.addEventListener("click", () => {
        slider.scrollBy({ left: slider.offsetWidth * 0.75, behavior: "smooth" });
      });
    });
  }

  // --- Scroll Actions & Navbar Scroll Styling ---
  function handleNavbarScroll() {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  }

  function bindNavigationScrolls() {
    navLinks.forEach(link => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        
        // Remove active from all nav items
        navLinks.forEach(item => item.classList.remove("active"));
        link.classList.add("active");
        
        const targetId = link.getAttribute("data-target");
        const targetEl = document.getElementById(targetId);
        
        if (targetEl) {
          const navHeight = navbar.offsetHeight;
          const targetPos = targetEl.getBoundingClientRect().top + window.scrollY - navHeight;
          window.scrollTo({
            top: targetPos,
            behavior: "smooth"
          });
        }
      });
    });
  }

  function scrollToAndPlayVideo(customTitle = null, customDesc = null) {
    const videoSect = document.getElementById("video-section");
    const navHeight = navbar.offsetHeight;
    const targetPos = videoSect.getBoundingClientRect().top + window.scrollY - navHeight;
    
    // Smooth scroll first
    window.scrollTo({
      top: targetPos,
      behavior: "smooth"
    });

    // Update video detail labels if requested
    if (customTitle) {
      document.querySelector(".video-tagline").textContent = "Now Previewing Chapter";
      document.querySelector(".video-title").textContent = customTitle;
      if (customDesc) {
        document.getElementById("video-desc-text").textContent = customDesc;
      }
    } else {
      // Revert to original
      document.querySelector(".video-tagline").textContent = "Netflix Original";
      document.querySelector(".video-title").textContent = "The Director's Cut";
      document.getElementById("video-desc-text").textContent = "A collection of our favorite memories, laughter, adventures, and unforgettable moments. Watch the highlights of our journey compiled into an emotional masterpiece.";
    }

    // Play video after small scroll buffer delay
    setTimeout(() => {
      playVideo();
    }, 600);
  }

  // --- Custom HTML5 Video Player Controller ---
  function initVideoPlayer() {
    // Set video src and overlay background from configuration
    const sourceElement = mainLoveVideo.querySelector("source");
    if (sourceElement) {
      sourceElement.src = NetflixConfig.videoSource;
      sourceElement.type = "video/mp4";
    }
    mainLoveVideo.load();
    videoPosterOverlay.style.backgroundImage = `url('${NetflixConfig.videoThumbnail}')`;

    // Add error handlers for video loading
    mainLoveVideo.addEventListener("error", (e) => {
      console.error("Video load error:", e.target.error);
      console.log("Video source:", NetflixConfig.videoSource);
    });

    mainLoveVideo.addEventListener("canplay", () => {
      console.log("Video can play");
    });

    mainLoveVideo.addEventListener("loadedmetadata", () => {
      console.log("Video duration loaded:", mainLoveVideo.duration);
      updateTimeDisplay(0, mainLoveVideo.duration);
    });

    // Big play button overlay click
    bigPlayBtn.addEventListener("click", playVideo);
    videoPosterOverlay.addEventListener("click", playVideo);

    // Play/Pause button toggle
    playPauseBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleVideoPlayback();
    });
    centerPlayPauseBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleVideoPlayback();
    });
    mainLoveVideo.addEventListener("click", toggleVideoPlayback);
    mainLoveVideo.addEventListener("play", syncPlayPauseControl);
    mainLoveVideo.addEventListener("pause", syncPlayPauseControl);
    mainLoveVideo.addEventListener("ended", syncPlayPauseControl);

    // Skip Buttons
    skipBackBtn.addEventListener("click", rewindVideo10s);
    skipForwardBtn.addEventListener("click", forwardVideo10s);

    // Update progress bar & time counter
    mainLoveVideo.addEventListener("timeupdate", updatePlayerProgress);

    // Volume controllers
    volumeSlider.addEventListener("input", handleVolumeSlider);
    volumeBtn.addEventListener("click", toggleMute);

    // Progress bar timeline click to scrub
    playerProgressContainer.addEventListener("click", scrubVideoTime);

    // Fullscreen toggle
    fullscreenBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      togglePlayerFullscreen();
    });

    // Keyboard controls for video player (Netflix-style)
    document.addEventListener("keydown", handleVideoPlayerKeyboard);

    // Advanced Controls Binding
    brightnessSlider.addEventListener("input", handleBrightnessChange);
    contrastSlider.addEventListener("input", handleContrastChange);
    thumbsUpBtn.addEventListener("click", handleThumbsUp);
    thumbsDownBtn.addEventListener("click", handleThumbsDown);
    speedBtn.addEventListener("click", handleSpeedControl);
    lockBtn.addEventListener("click", handleLockControls);
    audioSubtitlesBtn.addEventListener("click", handleAudioSubtitles);

    // Allow unlock by clicking on video when locked
    mainLoveVideo.addEventListener("click", (e) => {
      if (isControlsLocked) {
        e.preventDefault();
        e.stopPropagation();
        unlockPlayerControls();
      }
    });
  }

  // Netflix-style keyboard controls
  function handleVideoPlayerKeyboard(e) {
    // Only handle controls if video player is in viewport or has focus
    if (!mainLoveVideo || mainLoveVideo.parentElement.style.display === "none") return;
    
    // Prevent default behavior for media controls
    switch(e.key) {
      case " ": // Spacebar for play/pause
        e.preventDefault();
        toggleVideoPlayback();
        break;
      case "ArrowRight": // Arrow right for forward 10s
        e.preventDefault();
        forwardVideo10s();
        break;
      case "ArrowLeft": // Arrow left for rewind 10s
        e.preventDefault();
        rewindVideo10s();
        break;
      case "f": // 'f' for fullscreen
      case "F":
        e.preventDefault();
        togglePlayerFullscreen();
        break;
      case "m": // 'm' for mute/unmute
      case "M":
        e.preventDefault();
        toggleMute();
        break;
      case "ArrowUp": // Arrow up for volume increase
        e.preventDefault();
        handleVolumeSlider({ target: { value: Math.min(1, parseFloat(volumeSlider.value) + 0.1) } });
        break;
      case "ArrowDown": // Arrow down for volume decrease
        e.preventDefault();
        handleVolumeSlider({ target: { value: Math.max(0, parseFloat(volumeSlider.value) - 0.1) } });
        break;
    }
  }

  function toggleVideoPlayback() {
    if (mainLoveVideo.paused) {
      playVideo();
    } else {
      pauseVideo();
    }
  }

  function playVideo() {
    mainLoveVideo.play().then(() => {
      videoPlayerWrapper.classList.remove("paused");
      videoPosterOverlay.style.opacity = "0";
      videoPosterOverlay.style.pointerEvents = "none";
      syncPlayPauseControl();
    }).catch(err => {
      console.warn("Autoplay / playback blocked: ", err);
    });
  }

  function pauseVideo() {
    mainLoveVideo.pause();
    videoPlayerWrapper.classList.add("paused");
    
    // Keep overlay slightly translucent so they see paused thumbnail
    videoPosterOverlay.style.opacity = "0.2";
    videoPosterOverlay.style.pointerEvents = "auto";
    
    syncPlayPauseControl();
  }

  function syncPlayPauseControl() {
    const isPaused = mainLoveVideo.paused || mainLoveVideo.ended;
    playPauseBtn.innerHTML = `<i data-lucide="${isPaused ? "play" : "pause"}"></i>`;
    playPauseBtn.setAttribute("aria-label", isPaused ? "Play video" : "Pause video");
    playPauseBtn.title = isPaused ? "Play (Space)" : "Pause (Space)";
    playPauseBtn.classList.toggle("active", !isPaused);
    playPauseBtn.style.color = isPaused ? "#e5e5e5" : "#fff";
    playPauseBtn.style.textShadow = isPaused ? "" : "0 0 8px rgba(229, 9, 20, 0.5)";

    centerPlayPauseBtn.innerHTML = `<i data-lucide="${isPaused ? "play" : "pause"}"></i>`;
    centerPlayPauseBtn.setAttribute("aria-label", isPaused ? "Play video" : "Pause video");
    centerPlayPauseBtn.title = isPaused ? "Play (Space)" : "Pause (Space)";
    centerPlayPauseBtn.classList.toggle("playing", !isPaused);
    safeCreateIcons();
  }

  function rewindVideo10s() {
    if (isNaN(mainLoveVideo.duration)) return;
    mainLoveVideo.currentTime = Math.max(0, mainLoveVideo.currentTime - 10);
    triggerButtonAnimation(skipBackBtn);
  }

  function forwardVideo10s() {
    if (isNaN(mainLoveVideo.duration)) return;
    mainLoveVideo.currentTime = Math.min(mainLoveVideo.duration, mainLoveVideo.currentTime + 10);
    triggerButtonAnimation(skipForwardBtn);
  }

  function triggerButtonAnimation(btn) {
    btn.style.transform = "scale(0.8)";
    btn.style.color = "#fff";
    btn.style.textShadow = "0 0 8px rgba(229, 9, 20, 0.5)";
    setTimeout(() => {
      btn.style.transform = "";
      btn.style.color = "#e5e5e5";
      btn.style.textShadow = "";
    }, 150);
  }

  function updatePlayerProgress() {
    if (isNaN(mainLoveVideo.duration)) return;
    
    const percentage = (mainLoveVideo.currentTime / mainLoveVideo.duration) * 100;
    playerProgressBar.style.width = `${percentage}%`;

    updateTimeDisplay(mainLoveVideo.currentTime, mainLoveVideo.duration);
  }

  function updateTimeDisplay(current, duration) {
    const formatTime = (time) => {
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60);
      return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    const curFormatted = formatTime(current);
    const durFormatted = isNaN(duration) ? "00:00" : formatTime(duration);
    videoTimeDisplay.textContent = `${curFormatted} / ${durFormatted}`;
  }

  function scrubVideoTime(e) {
    if (isNaN(mainLoveVideo.duration)) return;
    
    const clickX = e.offsetX;
    const containerWidth = playerProgressContainer.offsetWidth;
    const targetPercentage = clickX / containerWidth;
    
    mainLoveVideo.currentTime = targetPercentage * mainLoveVideo.duration;
  }

  function handleVolumeSlider(e) {
    const val = e.target.value;
    volumeSlider.value = val;
    mainLoveVideo.volume = val;
    mainLoveVideo.muted = (val === "0" || val <= 0);
    updateVolumeIcon(val, mainLoveVideo.muted);
  }

  function toggleMute() {
    mainLoveVideo.muted = !mainLoveVideo.muted;
    if (mainLoveVideo.muted) {
      volumeSlider.value = 0;
      updateVolumeIcon(0, true);
      volumeBtn.style.color = "#ff6666";
    } else {
      const prevVolume = mainLoveVideo.volume || 1;
      volumeSlider.value = prevVolume;
      updateVolumeIcon(prevVolume, false);
      volumeBtn.style.color = "#e5e5e5";
    }
    
    // Add animation feedback
    volumeBtn.style.transform = "scale(0.9)";
    setTimeout(() => {
      volumeBtn.style.transform = "";
    }, 150);
  }

  function updateVolumeIcon(volume, isMuted) {
    let iconName = "volume-2";
    if (isMuted || volume == 0) {
      iconName = "volume-x";
      volumeBtn.style.color = "#ff6666";
    } else if (volume < 0.5) {
      iconName = "volume-1";
      volumeBtn.style.color = "#e5e5e5";
    } else {
      volumeBtn.style.color = "#e5e5e5";
    }
    
    volumeBtn.innerHTML = `<i data-lucide="${iconName}"></i>`;
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
      lucide.createIcons();
    }
  }

  function togglePlayerFullscreen() {
    if (!getActiveFullscreenElement()) {
      if (videoPlayerWrapper.requestFullscreen) {
        videoPlayerWrapper.requestFullscreen().then(() => {
          syncFullscreenControl();
        }).catch(err => {
          console.error("Fullscreen request failed:", err);
          syncFullscreenControl();
        });
      } else if (videoPlayerWrapper.webkitRequestFullscreen) {
        videoPlayerWrapper.webkitRequestFullscreen();
        syncFullscreenControl(true);
      } else if (videoPlayerWrapper.msRequestFullscreen) {
        videoPlayerWrapper.msRequestFullscreen();
        syncFullscreenControl(true);
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => {
          syncFullscreenControl();
        }).catch(err => {
          console.error("Fullscreen exit failed:", err);
          syncFullscreenControl();
        });
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
        syncFullscreenControl(false);
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
        syncFullscreenControl(false);
      }
    }
    setTimeout(() => safeCreateIcons(), 100);
  }

  function syncFullscreenControl(forceFullscreen = null) {
    const isFullscreen = forceFullscreen !== null ? forceFullscreen : !!getActiveFullscreenElement();
    fullscreenBtn.innerHTML = `<i data-lucide="${isFullscreen ? "minimize" : "maximize"}"></i>`;
    fullscreenBtn.setAttribute("aria-label", isFullscreen ? "Minimize video" : "Maximize video");
    fullscreenBtn.title = isFullscreen ? "Minimize (F)" : "Maximize (F)";
    fullscreenBtn.classList.toggle("active", isFullscreen);
    fullscreenBtn.style.color = isFullscreen ? "#fff" : "#e5e5e5";
    fullscreenBtn.style.textShadow = isFullscreen ? "0 0 8px rgba(229, 9, 20, 0.5)" : "";
    safeCreateIcons();
  }

  document.addEventListener("fullscreenchange", () => syncFullscreenControl());
  document.addEventListener("webkitfullscreenchange", () => syncFullscreenControl());
  document.addEventListener("MSFullscreenChange", () => syncFullscreenControl());

  // --- Advanced Player Controls ---
  function handleBrightnessChange(e) {
    const brightness = e.target.value;
    videoFilter.brightness = brightness;
    updateVideoFilters();
  }

  function handleContrastChange(e) {
    const contrast = e.target.value;
    videoFilter.contrast = contrast;
    updateVideoFilters();
  }

  function updateVideoFilters() {
    const brightness = videoFilter.brightness || 1;
    const contrast = videoFilter.contrast || 1;
    mainLoveVideo.style.filter = `brightness(${brightness}) contrast(${contrast})`;
  }

  function handleThumbsUp() {
    if (isControlsLocked) return;
    
    thumbsUpBtn.classList.toggle("active");
    thumbsDownBtn.classList.remove("active");
    
    // Trigger animation
    thumbsUpBtn.style.transform = "scale(0.8)";
    setTimeout(() => {
      thumbsUpBtn.style.transform = "";
    }, 150);
  }

  function handleThumbsDown() {
    if (isControlsLocked) return;
    
    thumbsDownBtn.classList.toggle("active");
    thumbsUpBtn.classList.remove("active");
    
    // Trigger animation
    thumbsDownBtn.style.transform = "scale(0.8)";
    setTimeout(() => {
      thumbsDownBtn.style.transform = "";
    }, 150);
  }

  function handleSpeedControl() {
    if (isControlsLocked) return;
    
    const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];
    const currentIndex = speeds.indexOf(currentSpeed);
    currentSpeed = speeds[(currentIndex + 1) % speeds.length];
    
    mainLoveVideo.playbackRate = currentSpeed;
    speedBtn.textContent = `Speed (${currentSpeed}x)`;
    
    // Visual feedback
    speedBtn.style.color = "#fff";
    speedBtn.style.textShadow = "0 0 8px rgba(229, 9, 20, 0.5)";
    setTimeout(() => {
      speedBtn.style.color = "#e5e5e5";
      speedBtn.style.textShadow = "";
    }, 300);
  }

  function handleLockControls() {
    if (isControlsLocked) return;
    
    isControlsLocked = true;
    lockBtn.classList.add("locked");
    lockBtn.innerHTML = `<i data-lucide="lock"></i>`;
    
    // Hide controls temporarily
    setTimeout(() => {
      const overlay = document.querySelector(".video-controls-overlay");
      overlay.style.opacity = "0";
      overlay.style.pointerEvents = "none";
    }, 1000);
    
    // Allow unlock by pressing 'L' or clicking lock button again
    setTimeout(() => {
      const unlockHandler = (e) => {
        if (e.key === 'l' || e.key === 'L') {
          unlockPlayerControls();
          document.removeEventListener("keydown", unlockHandler);
        }
      };
      document.addEventListener("keydown", unlockHandler);
    }, 500);
  }

  function unlockPlayerControls() {
    isControlsLocked = false;
    lockBtn.classList.remove("locked");
    lockBtn.innerHTML = `<i data-lucide="unlock"></i>`;
    
    const overlay = document.querySelector(".video-controls-overlay");
    overlay.style.opacity = "1";
    overlay.style.pointerEvents = "auto";
    
    setTimeout(() => {
      lockBtn.innerHTML = `<i data-lucide="lock"></i>`;
      safeCreateIcons();
    }, 1500);
  }

  function handleAudioSubtitles() {
    if (isControlsLocked) return;
    
    // Show toast notification
    const toast = document.createElement("div");
    toast.style.cssText = `
      position: fixed;
      bottom: 100px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(30, 30, 30, 0.9);
      color: #fff;
      padding: 10px 20px;
      border-radius: 4px;
      font-size: 0.9rem;
      z-index: 11;
      border: 1px solid rgba(255, 255, 255, 0.2);
    `;
    toast.textContent = "Audio & Subtitles settings would open here";
    document.body.appendChild(toast);
    
    setTimeout(() => toast.remove(), 3000);
  }

  // --- Calendar-Aware Live Anniversary Countdown Timer ---
  function updateCountdown() {
    const start = new Date(NetflixConfig.engagementDate);
    const now = new Date();
    
    if (now < start) {
      document.getElementById('count-years').innerText = 0;
      document.getElementById('count-months').innerText = 0;
      document.getElementById('count-days').innerText = 0;
      document.getElementById('count-hours').innerText = "00";
      document.getElementById('count-minutes').innerText = "00";
      document.getElementById('count-seconds').innerText = "00";
      return;
    }

    // Step 1: Base calendar calculations (Years & Months)
    let years = now.getFullYear() - start.getFullYear();
    let months = now.getMonth() - start.getMonth();
    let days = now.getDate() - start.getDate();
    
    if (days < 0) {
      const prevMonthDate = new Date(now.getFullYear(), now.getMonth(), 0);
      days += prevMonthDate.getDate();
      months--;
    }
    
    if (months < 0) {
      months += 12;
      years--;
    }

    // Step 2: Time calculation (Hours, Minutes, Seconds)
    let hours = now.getHours() - start.getHours();
    let minutes = now.getMinutes() - start.getMinutes();
    let seconds = now.getSeconds() - start.getSeconds();

    if (seconds < 0) {
      seconds += 60;
      minutes--;
    }
    if (minutes < 0) {
      minutes += 60;
      hours--;
    }
    if (hours < 0) {
      hours += 24;
      days--;
      if (days < 0) {
        const prevMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 0);
        days += prevMonthDate.getDate();
        months--;
        if (months < 0) {
          months += 12;
          years--;
        }
      }
    }

    // Render values in DOM
    animateCounterElement("count-years", years);
    animateCounterElement("count-months", months);
    animateCounterElement("count-days", days);
    animateCounterElement("count-hours", String(hours).padStart(2, '0'));
    animateCounterElement("count-minutes", String(minutes).padStart(2, '0'));
    animateCounterElement("count-seconds", String(seconds).padStart(2, '0'));
  }

  function animateCounterElement(id, newVal) {
    const el = document.getElementById(id);
    if (!el) return;
    
    if (el.textContent !== String(newVal)) {
      el.textContent = newVal;
      el.style.transform = "scale(1.05)";
      setTimeout(() => {
        el.style.transform = "";
      }, 150);
    }
  }
});
