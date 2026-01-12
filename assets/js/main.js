/* Skyliner Diner — lightweight interactions
   - Image fallbacks (no broken layouts)
   - Smooth scroll + active nav state
   - Scroll reveal animations (IntersectionObserver)
   - Counter-up metrics (IntersectionObserver)
   - Lead form UX (front-end only; localStorage + mailto)
   - Back-to-top button
*/

(function () {
  "use strict";

  const prefersReducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function qs(sel, root = document) {
    return root.querySelector(sel);
  }

  function qsa(sel, root = document) {
    return Array.from(root.querySelectorAll(sel));
  }

  function setYear() {
    const el = qs(".js-year");
    if (el) el.textContent = String(new Date().getFullYear());
  }

  function setupImageFallbacks() {
    const imgs = qsa("img.js-image");
    imgs.forEach((img) => {
      img.addEventListener("error", () => {
        // Hide the broken image, show the fallback card.
        img.classList.add("d-none");
        const frame = img.closest(".media-frame");
        const fallback = frame ? qs(".media-fallback", frame) : null;
        if (fallback) fallback.classList.remove("d-none");
      });
    });
  }

  function setupNavbarScrollState() {
    const nav = qs(".nav-glass");
    if (!nav) return;

    const onScroll = () => {
      const scrolled = window.scrollY > 8;
      nav.classList.toggle("is-scrolled", scrolled);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  function setupSmoothScroll() {
    const links = qsa("a.js-scroll");
    const collapseEl = qs("#navMain");

    links.forEach((a) => {
      a.addEventListener("click", (e) => {
        const href = a.getAttribute("href") || "";
        if (!href.startsWith("#")) return;

        const target = qs(href);
        if (!target) return;

        e.preventDefault();
        const y = target.getBoundingClientRect().top + window.scrollY;
        const navHeight = 76; // safe fixed offset for fixed nav
        const top = Math.max(0, y - navHeight);

        window.scrollTo({ top, behavior: prefersReducedMotion ? "auto" : "smooth" });

        // Collapse mobile nav after click (Bootstrap)
        if (collapseEl && collapseEl.classList.contains("show") && window.bootstrap) {
          const instance = window.bootstrap.Collapse.getOrCreateInstance(collapseEl, { toggle: false });
          instance.hide();
        }
      });
    });
  }

  function setupActiveNav() {
    const sectionIds = ["why", "concept", "model", "path", "gallery", "faq", "contact"];
    const sections = sectionIds.map((id) => qs(`#${id}`)).filter(Boolean);
    const navLinks = qsa(".nav-link.js-scroll");

    if (!("IntersectionObserver" in window) || sections.length === 0 || navLinks.length === 0) return;

    const linkByHash = new Map(navLinks.map((l) => [l.getAttribute("href"), l]));

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!visible) return;

        const id = visible.target.getAttribute("id");
        const href = `#${id}`;
        navLinks.forEach((l) => l.classList.remove("is-active"));
        const active = linkByHash.get(href);
        if (active) active.classList.add("is-active");
      },
      {
        root: null,
        rootMargin: "-35% 0px -55% 0px",
        threshold: [0.1, 0.2, 0.3, 0.45],
      }
    );

    sections.forEach((s) => observer.observe(s));
  }

  function setupReveal() {
    const els = qsa(".reveal");
    if (els.length === 0) return;

    if (!("IntersectionObserver" in window) || prefersReducedMotion) {
      els.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { root: null, rootMargin: "0px 0px -12% 0px", threshold: 0.12 }
    );

    els.forEach((el) => observer.observe(el));
  }

  function animateCount(el, to) {
    const duration = 850;
    const start = performance.now();
    const from = 0;

    function tick(now) {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const value = Math.round(from + (to - from) * eased);
      el.textContent = String(value);
      if (t < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }

  function setupCounters() {
    const els = qsa("[data-count]");
    if (els.length === 0) return;

    if (!("IntersectionObserver" in window) || prefersReducedMotion) {
      els.forEach((el) => {
        const to = Number(el.getAttribute("data-count") || "0");
        el.textContent = String(to);
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const to = Number(el.getAttribute("data-count") || "0");
          animateCount(el, to);
          observer.unobserve(el);
        });
      },
      { root: null, threshold: 0.5 }
    );

    els.forEach((el) => observer.observe(el));
  }

  function setupBackToTop() {
    const btn = qs(".js-back-to-top");
    if (!btn) return;

    const onScroll = () => {
      const visible = window.scrollY > 650;
      btn.classList.toggle("is-visible", visible);
    };

    btn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
    });

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  function safeJSONParse(value, fallback) {
    try {
      return JSON.parse(value);
    } catch {
      return fallback;
    }
  }

  function saveLead(payload) {
    const key = "skylinerLeads";
    const existing = safeJSONParse(localStorage.getItem(key), []);
    const next = Array.isArray(existing) ? existing : [];
    next.unshift(payload);
    localStorage.setItem(key, JSON.stringify(next.slice(0, 50)));
  }

  function buildMailto(values) {
    const to = "franchise@skyliner.example";
    const subject = "Skyliner Diner — Franchise Deck Request";

    const lines = [
      "Hello Skyliner Team,",
      "",
      "I’d like to request the franchise deck and schedule a discovery call.",
      "",
      `Name: ${values.name || ""}`,
      `Company: ${values.company || ""}`,
      `Email: ${values.email || ""}`,
      `Phone: ${values.phone || ""}`,
      `Market/City: ${values.market || ""}`,
      `Timeline: ${values.timeline || ""}`,
      "",
      "Notes:",
      values.note || "",
      "",
      "Thank you,",
      values.name || "",
    ];

    const body = lines.join("\n");
    return `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  function getFormValues(form) {
    const fd = new FormData(form);
    return {
      name: String(fd.get("name") || "").trim(),
      company: String(fd.get("company") || "").trim(),
      email: String(fd.get("email") || "").trim(),
      phone: String(fd.get("phone") || "").trim(),
      market: String(fd.get("market") || "").trim(),
      timeline: String(fd.get("timeline") || "").trim(),
      note: String(fd.get("note") || "").trim(),
    };
  }

  function setupLeadForms() {
    const forms = qsa("form.js-lead-form");
    if (forms.length === 0) return;

    // Mailto buttons live next to forms (inline + modal).
    qsa(".js-mailto").forEach((btn) => {
      btn.addEventListener("click", () => {
        const form = btn.closest("form");
        if (!form) return;
        const values = getFormValues(form);
        window.location.href = buildMailto(values);
      });
    });

    forms.forEach((form) => {
      form.addEventListener("submit", (e) => {
        e.preventDefault();

        // Let browser run built-in validation; Bootstrap styles read .was-validated
        if (!form.checkValidity()) {
          form.classList.add("was-validated");
          return;
        }

        form.classList.add("was-validated");

        const values = getFormValues(form);
        saveLead({
          ...values,
          submittedAt: new Date().toISOString(),
          path: window.location.pathname,
        });

        const success = qs(".js-form-success", form);
        if (success) success.classList.remove("d-none");
      });
    });
  }

  function setupHeroParallax() {
    if (prefersReducedMotion) return;
    const media = qs(".hero-bg-media");
    if (!media) return;

    let ticking = false;
    const max = 18;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        const y = Math.min(max, Math.max(0, window.scrollY * 0.02));
        // Keep styles in CSS; only update a CSS variable here.
        media.style.setProperty("--hero-parallax", `${y}px`);
        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  // Init
  document.addEventListener("DOMContentLoaded", () => {
    setYear();
    setupImageFallbacks();
    setupNavbarScrollState();
    setupSmoothScroll();
    setupActiveNav();
    setupReveal();
    setupCounters();
    setupBackToTop();
    setupLeadForms();
    setupHeroParallax();
  });
})();

