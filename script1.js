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

// ------------------- Custom Cursor -------------------
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

// ------------------- Particle System -------------------
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

// ------------------- Page Navigation -------------------
const pages = ["home.html", "events.html", "team.html", "login.html"];
let currentPageIndex = 0; // default to home

function loadPage(page) {
  const pageIndex = pages.indexOf(page);
  if (pageIndex === -1) return;
  currentPageIndex = pageIndex;

  fetch(page)
    .then((res) => res.text())
    .then((data) => {
      document.getElementById("content").innerHTML = data;

      // Update nav links
      document
        .querySelectorAll(".nav-link")
        .forEach((link) => link.classList.remove("active"));
      document
        .querySelector(`[onclick="loadPage('${page}')"]`)
        ?.classList.add("active");

      // Glitch effect
      document.body.classList.add("glitch");
      setTimeout(() => document.body.classList.remove("glitch"), 300);

      window.scrollTo(0, 0);
      animateOnScroll();

      // Initialize auth forms if on login page
      if (page === "login.html") {
        initializeAuthForms();
      }
    })
    .catch((err) => console.error("Page load error:", err));
}

// Handle nav link clicks
document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const page = link.getAttribute("onclick")?.match(/loadPage\('(.+)'\)/)?.[1];
    if (page) loadPage(page);
  });
});

// ------------------- Konami Code (Easter Egg) -------------------
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
];

// Arrow key navigation with Konami code priority
document.addEventListener("keydown", function (e) {
  const activeEl = document.activeElement;
  const isTyping =
    activeEl.tagName === "INPUT" ||
    activeEl.tagName === "TEXTAREA" ||
    activeEl.isContentEditable;

  // Always track Konami code (except when typing)
  if (!isTyping) {
    konamiCode.push(e.key);
    if (konamiCode.length > konamiSequence.length) konamiCode.shift();
    if (JSON.stringify(konamiCode) === JSON.stringify(konamiSequence)) {
      activateEasterEgg();
      konamiCode = [];
      return; // Prevent navigation when Konami is activated
    }
  }

  // Only do page navigation if not typing and not part of potential Konami sequence
  if (isTyping) return;

  // Allow arrow keys for navigation only if not in a potential Konami sequence
  const isPotentialKonami =
    konamiCode.length > 0 &&
    konamiSequence
      .slice(0, konamiCode.length)
      .every((key, i) => key === konamiCode[i]);

  if (isPotentialKonami) {
    // Wait a moment to see if user continues Konami code
    setTimeout(() => {
      const stillValid = konamiSequence
        .slice(0, konamiCode.length)
        .every((key, i) => key === konamiCode[i]);
      if (!stillValid) {
        konamiCode = []; // Reset if sequence broken
      }
    }, 800);
    return;
  }

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

function activateEasterEgg() {
  showNotification(
    "🎮 KONAMI CODE ACTIVATED! Super Adrenaline Mode ON!",
    "success"
  );
  document.body.style.animation = "rainbow 2s ease-in-out infinite";
  const rainbowStyle = document.createElement("style");
  rainbowStyle.textContent = `
    @keyframes rainbow { 0% { filter: hue-rotate(0deg);} 100% { filter: hue-rotate(360deg);} }
  `;
  document.head.appendChild(rainbowStyle);

  setTimeout(() => {
    document.body.style.animation = "";
    rainbowStyle.remove();
    showNotification("🌈 Super Adrenaline Mode deactivated!", "info");
  }, 10000);
}

// ------------------- Event Filtering -------------------
function filterEvents(category) {
  const eventCards = document.querySelectorAll(".event-card");
  const tabButtons = document.querySelectorAll(".tab-button");

  tabButtons.forEach((btn) => btn.classList.remove("active"));
  event.target.classList.add("active");

  eventCards.forEach((card) => {
    if (category === "all" || card.dataset.category === category) {
      card.style.display = "block";
      card.classList.add("animate-in");
    } else {
      card.style.display = "none";
    }
  });
}

// ------------------- Event Registration -------------------
function registerEvent(eventName) {
  const userData = {
    event: eventName,
    timestamp: new Date().toISOString(),
    status: "registered",
  };
  showNotification(`🎯 Successfully registered for ${eventName}!`, "success");

  let registrations = JSON.parse(
    sessionStorage.getItem("registrations") || "[]"
  );
  registrations.push(userData);
  sessionStorage.setItem("registrations", JSON.stringify(registrations));
}

// ------------------- Authentication System -------------------
function initializeAuthForms() {
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");

  if (loginForm) {
    // Remove any existing listeners
    const newLoginForm = loginForm.cloneNode(true);
    loginForm.parentNode.replaceChild(newLoginForm, loginForm);

    newLoginForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const email = document.getElementById("loginEmail").value;
      const password = document.getElementById("loginPassword").value;

      if (email && password) {
        const userData = {
          email: email,
          loginTime: new Date().toISOString(),
          isLoggedIn: true,
        };
        sessionStorage.setItem("user", JSON.stringify(userData));
        showNotification(
          "🚀 Welcome back, warrior! Login successful!",
          "success"
        );

        setTimeout(() => loadPage("home.html"), 1500);
      }
    });
  }

  if (registerForm) {
    // Remove any existing listeners
    const newRegisterForm = registerForm.cloneNode(true);
    registerForm.parentNode.replaceChild(newRegisterForm, registerForm);

    newRegisterForm.addEventListener("submit", function (e) {
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
      sessionStorage.setItem("user", JSON.stringify(formData));
      showNotification(
        "🎉 Registration successful! Welcome to the Rush!",
        "success"
      );

      this.reset();
      setTimeout(() => {
        switchTab("login");
      }, 1500);
    });
  }
}

function switchTab(tab) {
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");
  const loginTab = document.querySelector('.auth-tab[onclick*="login"]');
  const registerTab = document.querySelector('.auth-tab[onclick*="register"]');

  if (tab === "login") {
    loginForm.style.display = "block";
    registerForm.style.display = "none";
    loginTab?.classList.add("active");
    registerTab?.classList.remove("active");
  } else {
    loginForm.style.display = "none";
    registerForm.style.display = "block";
    registerTab?.classList.add("active");
    loginTab?.classList.remove("active");
  }
}

// ------------------- Notifications -------------------
function showNotification(message, type = "info") {
  document.querySelectorAll(".notification").forEach((n) => n.remove());

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

  setTimeout(() => (notification.style.transform = "translateX(0)"), 100);
  setTimeout(() => {
    notification.style.transform = "translateX(400px)";
    setTimeout(() => notification.remove(), 400);
  }, 4000);
}

// ------------------- Enhanced Interactions -------------------
document.addEventListener("click", function (e) {
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

const rippleStyle = document.createElement("style");
rippleStyle.textContent = `
  @keyframes ripple {
    to { transform: scale(2); opacity: 0; }
  }
`;
document.head.appendChild(rippleStyle);

// ------------------- Scroll Animations -------------------
function animateOnScroll() {
  const elements = document.querySelectorAll(
    ".feature-card, .event-card, .team-card, .contact-card"
  );
  elements.forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (
      rect.top < window.innerHeight &&
      rect.bottom > 0 &&
      !el.classList.contains("animated")
    ) {
      el.classList.add("animated");
      el.style.animation = "fadeInUp 0.8s ease forwards";
    }
  });
}
window.addEventListener("scroll", animateOnScroll);

// ------------------- Dynamic Background -------------------
document.addEventListener("mousemove", function (e) {
  const mouseX = e.clientX / window.innerWidth;
  const mouseY = e.clientY / window.innerHeight;
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
