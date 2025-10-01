document.addEventListener("DOMContentLoaded", function () {
  initializeParticles();
  initializeCursor();

  // Hide loading after 2s
  setTimeout(
    () => document.getElementById("loading").classList.add("hidden"),
    2000
  );

  // Load home by default
  loadPage("home.html");
});

// Custom Cursor
function initializeCursor() {
  const cursor = document.getElementById("cursor");
  const links = document.querySelectorAll("a, button, .nav-link, .logo");

  document.addEventListener("mousemove", (e) => {
    cursor.style.left = e.clientX + "px";
    cursor.style.top = e.clientY + "px";
  });

  links.forEach((link) => {
    link.addEventListener("mouseenter", () => cursor.classList.add("hover"));
    link.addEventListener("mouseleave", () => cursor.classList.remove("hover"));
  });
}

// Particle System
function initializeParticles() {
  const particlesContainer = document.getElementById("particles");

  function createParticle() {
    const particle = document.createElement("div");
    particle.className = "particle";
    particle.style.left = Math.random() * 100 + "%";
    particle.style.animationDuration = Math.random() * 8 + 8 + "s";
    particle.style.animationDelay = Math.random() * 2 + "s";
    particlesContainer.appendChild(particle);

    setTimeout(() => {
      particle.remove();
    }, 12000);
  }

  setInterval(createParticle, 500);
}

// Page Navigation System
let currentPage = "home.html";
function loadPage(page) {
  fetch(page)
    .then((res) => res.text())
    .then((data) => {
      document.getElementById("content").innerHTML = data;
      currentPage = page;
      // Update nav links
      document
        .querySelectorAll(".nav-link")
        .forEach((link) => link.classList.remove("active"));
      document
        .querySelector(`[onclick="loadPage('${page}')"]`)
        ?.classList.add("active");

      // Add glitch effect
      document.body.classList.add("glitch");
      setTimeout(() => document.body.classList.remove("glitch"), 300);

      window.scrollTo(0, 0);

      animateOnScroll();
    })
    .catch((err) => console.error("Page load error:", err));
}

// Events Filtering
function filterEvents(category) {
  const eventCards = document.querySelectorAll(".event-card");
  const tabButtons = document.querySelectorAll(".tab-button");

  // Update active tab
  tabButtons.forEach((btn) => btn.classList.remove("active"));
  event.target.classList.add("active");

  // Filter events
  eventCards.forEach((card) => {
    if (category === "all" || card.dataset.category === category) {
      card.style.display = "block";
      card.classList.add("animate-in");
    } else {
      card.style.display = "none";
    }
  });
}

// Event Registration
function registerEvent(eventName) {
  const userData = {
    event: eventName,
    timestamp: new Date().toISOString(),
    status: "registered",
  };

  // Simulate registration process
  showNotification(`🎯 Successfully registered for ${eventName}!`, "success");

  // Store registration data
  let registrations = JSON.parse(
    sessionStorage.getItem("registrations") || "[]"
  );
  registrations.push(userData);
  sessionStorage.setItem("registrations", JSON.stringify(registrations));
}

// Authentication System
function switchTab(tab) {
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");
  const tabs = document.querySelectorAll(".auth-tab");

  tabs.forEach((t) => t.classList.remove("active"));
  event.target.classList.add("active");

  if (tab === "login") {
    loginForm.style.display = "block";
    registerForm.style.display = "none";
  } else {
    loginForm.style.display = "none";
    registerForm.style.display = "block";
  }
}

// Form Handlers
document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  // Simulate login
  if (email && password) {
    const userData = {
      email: email,
      loginTime: new Date().toISOString(),
      isLoggedIn: true,
    };

    sessionStorage.setItem("user", JSON.stringify(userData));
    showNotification("🚀 Welcome back, warrior! Login successful!", "success");

    // Redirect to home page
    setTimeout(() => loadPage("home.html"), 1500);
  }
});

document
  .getElementById("registerForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    const formData = {
      name: document.getElementById("registerName").value,
      email: document.getElementById("registerEmail").value,
      phone: document.getElementById("registerPhone").value,
      college: document.getElementById("registerCollege").value,
      password: document.getElementById("registerPassword").value,
      registrationTime: new Date().toISOString(),
      isRegistered: true,
    };

    // Store user data
    sessionStorage.setItem("user", JSON.stringify(formData));
    showNotification(
      "🎉 Registration successful! Welcome to the Rush!",
      "success"
    );

    // Clear form
    this.reset();

    // Switch to login tab
    setTimeout(() => {
      switchTab("login");
      loadPage("home.html");
    }, 1500);
  });

// Notification System
function showNotification(message, type = "info") {
  // Remove existing notifications
  const existingNotifications = document.querySelectorAll(".notification");
  existingNotifications.forEach((notif) => notif.remove());

  const notification = document.createElement("div");
  notification.className = `notification ${type}`;
  notification.style.cssText = `
                position: fixed;
                top: 100px;
                right: 20px;
                background: linear-gradient(45deg, #ff0080, #00ffff);
                color: white;
                padding: 20px 25px;
                border-radius: 15px;
                font-weight: bold;
                font-size: 1.1rem;
                z-index: 10000;
                box-shadow: 0 10px 30px rgba(255, 0, 128, 0.4);
                transform: translateX(400px);
                transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                border: 2px solid rgba(255, 255, 255, 0.2);
                backdrop-filter: blur(20px);
                max-width: 350px;
            `;

  notification.textContent = message;
  document.body.appendChild(notification);

  // Animate in
  setTimeout(() => {
    notification.style.transform = "translateX(0)";
  }, 100);

  // Auto remove after 4 seconds
  setTimeout(() => {
    notification.style.transform = "translateX(400px)";
    setTimeout(() => notification.remove(), 400);
  }, 4000);
}

// Enhanced Interactions
document.addEventListener("click", function (e) {
  // Add ripple effect to buttons
  if (e.target.tagName === "BUTTON" || e.target.classList.contains("btn")) {
    createRipple(e.target, e);
  }
});

function createRipple(element, event) {
  const ripple = document.createElement("span");
  const rect = element.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = event.clientX - rect.left - size / 2;
  const y = event.clientY - rect.top - size / 2;

  ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.4);
                border-radius: 50%;
                pointer-events: none;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
            `;

  element.style.position = "relative";
  element.style.overflow = "hidden";
  element.appendChild(ripple);

  setTimeout(() => ripple.remove(), 600);
}

// Add ripple animation
const rippleStyle = document.createElement("style");
rippleStyle.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(2);
                    opacity: 0;
                }
            }
        `;
document.head.appendChild(rippleStyle);

// Scroll Animations
function animateOnScroll() {
  const elements = document.querySelectorAll(
    ".feature-card, .event-card, .team-card, .contact-card"
  );

  elements.forEach((element) => {
    const rect = element.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

    if (isVisible && !element.classList.contains("animated")) {
      element.classList.add("animated");
      element.style.animation = "fadeInUp 0.8s ease forwards";
    }
  });
}

window.addEventListener("scroll", animateOnScroll);

// Dynamic Background Effects
let mouseX = 0,
  mouseY = 0;
document.addEventListener("mousemove", function (e) {
  mouseX = e.clientX / window.innerWidth;
  mouseY = e.clientY / window.innerHeight;

  // Update hero background based on mouse position
  const heroSection = document.querySelector(".hero-section");
  if (heroSection) {
    heroSection.style.background = `
                    linear-gradient(${mouseX * 360}deg, 
                    rgba(0,0,0,0.7), 
                    rgba(255,0,128,${0.3 + mouseY * 0.2}), 
                    rgba(0,255,255,${0.2 + mouseX * 0.2})),
                    url('https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1920&h=1080&fit=crop') center/cover
                `;
  }
});

// Performance Optimizations
let ticking = false;
function updateAnimations() {
  animateOnScroll();
  ticking = false;
}

function requestTick() {
  if (!ticking) {
    requestAnimationFrame(updateAnimations);
    ticking = true;
  }
}

window.addEventListener("scroll", requestTick);

// Keyboard Navigation
document.addEventListener("keydown", function (e) {
  const pages = ["home.html", "events.html", "team.html", "login.html"];
  const currentPageIndex = pages.indexOf(currentPage);

  switch (e.key) {
    case "ArrowLeft":
      if (currentPageIndex > 0) loadPage(pages[currentPageIndex - 1]);
      break;
    case "ArrowRight":
      if (currentPageIndex < pages.length - 1)
        loadPage(pages[currentPageIndex + 1]);
      break;
    case "Home":
    case "Escape":
      loadPage("home.html");
      break;
  }
});

// Easter Eggs
let konamiCode = [];
const konamiSequence = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
]; // Up Up Down Down Left Right Left Right B A

document.addEventListener("keydown", function (e) {
  konamiCode.push(e.key);
  if (konamiCode.length > konamiSequence.length) {
    konamiCode.shift();
  }

  if (JSON.stringify(konamiCode) === JSON.stringify(konamiSequence)) {
    activateEasterEgg();
    konamiCode = [];
  }
});

function activateEasterEgg() {
  showNotification(
    "🎮 KONAMI CODE ACTIVATED! Super Adrenaline Mode ON!",
    "success"
  );

  // Add crazy effects
  document.body.style.animation = "rainbow 2s ease-in-out infinite";

  // Add rainbow animation
  const rainbowStyle = document.createElement("style");
  rainbowStyle.textContent = `
                @keyframes rainbow {
                    0% { filter: hue-rotate(0deg); }
                    100% { filter: hue-rotate(360deg); }
                }
            `;
  document.head.appendChild(rainbowStyle);

  // Remove effect after 10 seconds
  setTimeout(() => {
    document.body.style.animation = "";
    rainbowStyle.remove();
    showNotification("🌈 Super Adrenaline Mode deactivated!", "info");
  }, 10000);
}

// Analytics and Tracking (Simulated)
function trackUserAction(action, data = {}) {
  const activePage = document.querySelector(".page.active");
  const analyticsData = {
    action: action,
    timestamp: new Date().toISOString(),
    page: activePage ? activePage.id : "unknown",
    userAgent: navigator.userAgent,
    ...data,
  };

  let analytics = JSON.parse(sessionStorage.getItem("analytics") || "[]");
  analytics.push(analyticsData);
  sessionStorage.setItem("analytics", JSON.stringify(analytics));

  console.log("Analytics tracked:", analyticsData);
}

// Track page views
const observer = new MutationObserver(function (mutations) {
  mutations.forEach(function (mutation) {
    if (
      mutation.target.classList.contains("page") &&
      mutation.target.classList.contains("active")
    ) {
      trackUserAction("page_view", { page: mutation.target.id });
    }
  });
});

// Start observing
document.querySelectorAll(".page").forEach((page) => {
  observer.observe(page, {
    attributes: true,
    attributeFilter: ["class"],
  });
});

// Error Handling
window.addEventListener("error", function (e) {
  console.error("Application error:", e.error);
  showNotification("⚠️ Something went wrong, but we're on it!", "error");
});

// Service Worker Registration (for PWA capabilities)
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/sw.js").catch((err) => {
    console.log("Service Worker registration failed:", err);
  });
}

// Initial page load tracking
trackUserAction("app_loaded");
