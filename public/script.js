(() => {
  const root = document.documentElement;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const progress = document.querySelector(".reading-progress span");
  const heroImage = document.querySelector(".hero-art-frame img");
  const revealItems = document.querySelectorAll(".reveal");
  const menuToggle = document.querySelector(".menu-toggle");
  const mobileNav = document.querySelector(".mobile-nav");
  const mobileLinks = document.querySelectorAll(".mobile-nav a");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          //entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -6%" },
  );
  revealItems.forEach((item) => observer.observe(item));

  const updateScroll = () => {
    const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
    const percentage = documentHeight > 0 ? Math.min((window.scrollY / documentHeight) * 100, 100) : 0;
    if (progress) progress.style.width = `${percentage}%`;
  };

  updateScroll();
  window.addEventListener("scroll", updateScroll, { passive: true });

  const closeMenu = () => {
    if (!menuToggle || !mobileNav) return;
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Abrir menú");
    mobileNav.classList.remove("is-open");
    mobileNav.setAttribute("aria-hidden", "true");
    document.body.classList.remove("menu-open");
    mobileLinks.forEach((link) => link.setAttribute("tabindex", "-1"));
  };

  if (menuToggle && mobileNav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-expanded", String(!isOpen));
      mobileNav.classList.toggle("is-open", !isOpen);
      mobileNav.setAttribute("aria-hidden", String(isOpen));
      document.body.classList.toggle("menu-open", !isOpen);
      menuToggle.setAttribute("aria-label", isOpen ? "Abrir menú" : "Cerrar menú");
      mobileLinks.forEach((link) => link.setAttribute("tabindex", isOpen ? "-1" : "0"));
    });
    mobileLinks.forEach((link) => link.addEventListener("click", closeMenu));
    mobileNav.addEventListener("click", (event) => {
      if (event.target === mobileNav) closeMenu();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && mobileNav.classList.contains("is-open")) closeMenu();
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", () => {
      if (mobileNav?.classList.contains("is-open")) closeMenu();
    });
  });
})();
