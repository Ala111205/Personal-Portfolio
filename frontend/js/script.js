/* Main script: nav toggle, smooth scroll, scroll-spy, IntersectionObservers, chat toggle, form + stagger animations */

let menuBtn, navList, navLinks, sections;

document.addEventListener("DOMContentLoaded", () => {
  // Select nodes
  menuBtn = document.getElementById("menuBtn");
  navList = document.querySelector(".nav-list");
  navLinks = document.querySelectorAll(".navLink");
  sections = document.querySelectorAll("section");

  // ===== NAV: toggle =====
  menuBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const expanded = menuBtn.getAttribute("aria-expanded") === "true";
    menuBtn.setAttribute("aria-expanded", String(!expanded));
    navList.classList.toggle("show");
    menuBtn.innerHTML = navList.classList.contains("show")
      ? `<i class="fa-solid fa-xmark" aria-hidden="true"></i>`
      : `<i class="fa-solid fa-bars" aria-hidden="true"></i>`;
  });

  // Close mobile menu when clicking a link
  navLinks.forEach(link => link.addEventListener("click", (e) => {
    e.stopPropagation();
    if (navList.classList.contains("show")) {
      navList.classList.remove("show");
      menuBtn.setAttribute("aria-expanded", "false");
      menuBtn.innerHTML = `<i class="fa-solid fa-bars" aria-hidden="true"></i>`;
    }
  }));

  // Close mobile menu when clicking outside
  document.addEventListener("click", (e) => {
    if (!navList.classList.contains("show")) return;
    if (!navList.contains(e.target) && !menuBtn.contains(e.target)) {
      navList.classList.remove("show");
      menuBtn.setAttribute("aria-expanded", "false");
      menuBtn.innerHTML = `<i class="fa-solid fa-bars" aria-hidden="true"></i>`;
    }
  });

  // ===== Smooth scroll for nav links =====
  navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute("href"));
      if (!target) return;
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  // ===== Scroll-spy =====
  function scrollSpy() {
    const scrollY = window.scrollY + Math.round(window.innerHeight * 0.35);
    let current = "";
    sections.forEach(section => {
      if (scrollY >= section.offsetTop && scrollY < section.offsetTop + section.offsetHeight) {
        current = section.id;
      }
    });
    navLinks.forEach(link => link.classList.toggle("active", link.getAttribute("href") === `#${current}`));
  }
  window.addEventListener("scroll", scrollSpy, { passive: true });
  scrollSpy();

  // ===== Reveal / staggered animations =====
  const revealItems = document.querySelectorAll(".reveal");

  // Apply automatic stagger delays for .stagger containers
  const staggerContainers = document.querySelectorAll(".stagger");
  staggerContainers.forEach(container => {
    const children = container.querySelectorAll(".reveal");
    children.forEach((el, i) => {
      el.style.setProperty("--stagger-index", i);
    });
  });

  // Default observer for all .reveal elements
  const defaultObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      entry.isIntersecting
        ? entry.target.classList.add("active")
        : entry.target.classList.remove("active"); // scroll-back
    });
  }, { threshold: 0.25 });

  revealItems.forEach(el => defaultObserver.observe(el));

  // Per-section observer settings (optional finer control)
  const observerSettings = [
    { selector: "#home", threshold: 0.15 },
    { selector: "#about", threshold: 0.22 },
    { selector: "#skills", threshold: 0.30 },
    { selector: "#education", threshold: 0.20 },
    { selector: "#project", threshold: 0.25 },
    { selector: "#contact", threshold: 0.20 }
  ];

  observerSettings.forEach(cfg => {
    const els = document.querySelectorAll(cfg.selector + " .reveal, " + cfg.selector + " .stagger .reveal");
    if (!els.length) return;
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        entry.isIntersecting
          ? entry.target.classList.add("active")
          : entry.target.classList.remove("active");
      });
    }, { threshold: cfg.threshold });
    els.forEach(el => obs.observe(el));
  });
});