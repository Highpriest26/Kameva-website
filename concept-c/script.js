/* ==============================================================
   CONCEPT C: MODERN CREATIVE STUDIO (/concept-c/script.js)
   ============================================================== */
(function () {
  "use strict";

  // 1. Mobile Navigation Drawer
  const burger = document.getElementById("studioBurger");
  const mobileNav = document.getElementById("studioMobileNav");

  function setMobileNav(open) {
    if (!burger || !mobileNav) return;
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Close studio navigation" : "Open studio navigation");
    mobileNav.setAttribute("aria-hidden", String(!open));
    mobileNav.classList.toggle("is-open", open);
  }

  if (burger && mobileNav) {
    burger.addEventListener("click", function () {
      const open = burger.getAttribute("aria-expanded") === "true";
      setMobileNav(!open);
    });

    mobileNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        setMobileNav(false);
      });
    });
  }

  // 2. Hero Discipline Interactive Preview & Fashion Look Toggle
  const catCards = Array.from(document.querySelectorAll(".studio-cat-card"));
  const heroPreview = document.getElementById("studioHeroPreview");
  const heroCaption = document.getElementById("studioHeroCaption");
  const fashionToggle = document.getElementById("fashionLookToggle");
  const miniLookBtns = Array.from(document.querySelectorAll(".mini-look-btn"));
  const bentoTabs = Array.from(document.querySelectorAll(".studio-tab"));
  const bentoGrid = document.getElementById("studioBentoGrid");
  const bentoCells = Array.from(document.querySelectorAll(".bento-cell"));

  function activateCatPreview(card) {
    if (!card) return;
    const src = card.getAttribute("data-preview-src");
    const label = card.getAttribute("data-preview-label");
    const cat = card.getAttribute("data-preview-cat");

    catCards.forEach(function (c) {
      c.classList.toggle("is-active", c === card);
    });

    if (heroPreview && src && heroPreview.getAttribute("src") !== src) {
      heroPreview.style.opacity = "0.4";
      setTimeout(function () {
        heroPreview.src = src;
        heroPreview.style.opacity = "1";
      }, 90);
    }

    if (heroCaption && label) {
      heroCaption.textContent = label;
    }

    if (fashionToggle) {
      fashionToggle.hidden = cat !== "fashion";
    }
  }

  function filterBento(cat) {
    if (!bentoGrid) return;
    bentoGrid.classList.toggle("is-filtered", cat !== "all");

    bentoTabs.forEach(function (tab) {
      const active = (tab.getAttribute("data-bento-filter") || "all") === cat;
      tab.classList.toggle("is-active", active);
      tab.setAttribute("aria-selected", String(active));
    });

    bentoCells.forEach(function (cell) {
      const cats = (cell.getAttribute("data-bento-cats") || "").split(/\s+/);
      const visible = cat === "all" || cats.includes(cat);
      cell.classList.toggle("is-hidden", !visible);
    });
  }

  catCards.forEach(function (card) {
    card.addEventListener("mouseenter", function () {
      activateCatPreview(card);
    });
    card.addEventListener("focus", function () {
      activateCatPreview(card);
    });
    card.addEventListener("click", function () {
      activateCatPreview(card);
      const targetCat = card.getAttribute("data-preview-cat") || "all";
      filterBento(targetCat);
      const portfolioSection = document.getElementById("portfolio");
      if (portfolioSection) {
        portfolioSection.scrollIntoView({ behavior: "smooth" });
      }
    });
    card.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        card.click();
      }
    });
  });

  // Fashion Look A (k-27.jpeg) / Look B (k-28.jpg) Switcher
  miniLookBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      const lookSrc = btn.getAttribute("data-look-src");
      if (heroPreview && lookSrc) {
        heroPreview.src = lookSrc;
      }
      miniLookBtns.forEach(function (b) {
        b.classList.toggle("is-active", b === btn);
      });
    });
  });

  // 3. Bento Portfolio Filter Tabs
  bentoTabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      const cat = tab.getAttribute("data-bento-filter") || "all";
      filterBento(cat);
    });
  });

  // 4. Booking Visual Pill Selector & Capability Matrix Links
  const sessionPills = Array.from(document.querySelectorAll(".session-pill"));
  const subjectInput = document.getElementById("studioSubjectInput");
  const bookingForm = document.getElementById("studioBookingForm");
  const waBriefLink = document.getElementById("studioWaBrief");

  function selectSessionPill(value) {
    sessionPills.forEach(function (pill) {
      const selected = pill.getAttribute("data-pill-value") === value;
      pill.classList.toggle("is-selected", selected);
      pill.setAttribute("aria-checked", String(selected));
    });
    if (subjectInput) {
      subjectInput.value = value + " Session";
    }
    syncWhatsappBrief();
  }

  sessionPills.forEach(function (pill) {
    pill.addEventListener("click", function () {
      const val = pill.getAttribute("data-pill-value") || "Portrait";
      selectSessionPill(val);
    });
  });

  document.querySelectorAll("[data-studio-pill]").forEach(function (cta) {
    cta.addEventListener("click", function () {
      const val = cta.getAttribute("data-studio-pill");
      if (val) selectSessionPill(val);
    });
  });

  // 5. Accessible Lightbox Modal
  const lightbox = document.getElementById("studioLightbox");
  const lightboxImg = document.getElementById("studioLightboxImg");
  const lightboxTitle = document.getElementById("studioLightboxTitle");
  let lastTrigger = null;

  function openLightbox(src, title, triggerEl) {
    if (!lightbox || !lightboxImg) return;
    lastTrigger = triggerEl || document.activeElement;
    lightboxImg.src = src;
    lightboxImg.alt = title || "Kameva Photography Portfolio Image";
    if (lightboxTitle) lightboxTitle.textContent = title || "";
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
    const closeBtn = lightbox.querySelector(".studio-lightbox__close");
    if (closeBtn) closeBtn.focus();
  }

  function closeLightbox() {
    if (!lightbox || lightbox.hidden) return;
    lightbox.hidden = true;
    document.body.style.overflow = "";
    if (lightboxImg) lightboxImg.src = "";
    if (lastTrigger && typeof lastTrigger.focus === "function") {
      lastTrigger.focus();
    }
  }

  document.querySelectorAll("[data-lightbox-src]").forEach(function (trigger) {
    trigger.addEventListener("click", function () {
      openLightbox(
        trigger.getAttribute("data-lightbox-src"),
        trigger.getAttribute("data-lightbox-title"),
        trigger
      );
    });
  });

  document.querySelectorAll("[data-lightbox-close]").forEach(function (el) {
    el.addEventListener("click", closeLightbox);
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      closeLightbox();
      setMobileNav(false);
    }
  });

  // 6. Booking Form (EmailJS + Dynamic WhatsApp Link)
  const submitBtn = document.getElementById("studioSubmitBtn");
  const statusEl = document.getElementById("studioFormStatus");

  function syncWhatsappBrief() {
    if (!bookingForm || !waBriefLink) return;
    const discipline = subjectInput?.value || "Photography Session";
    const name = bookingForm.elements["name"]?.value || "";
    const dateLoc = bookingForm.elements["date_location"]?.value || "";
    const msg = bookingForm.elements["message"]?.value || "";
    const text =
      "Hello Kameva Photography Studio, I would like to start a project (" +
      discipline +
      ")" +
      (name ? ". Client: " + name : "") +
      (dateLoc ? ". Date/Location: " + dateLoc : "") +
      (msg ? ". Brief: " + msg : "");
    waBriefLink.href = "https://wa.me/2348161654981?text=" + encodeURIComponent(text);
  }

  if (bookingForm) {
    bookingForm.addEventListener("input", syncWhatsappBrief);
    syncWhatsappBrief();

    bookingForm.addEventListener("submit", function (e) {
      e.preventDefault();
      if (typeof window.emailjs === "undefined") {
        syncWhatsappBrief();
        window.open(waBriefLink.href, "_blank", "noopener");
        return;
      }

      try {
        window.emailjs.init("27Vuc1iqZ_itI7dn1");
      } catch (_) {}

      if (submitBtn) {
        submitBtn.textContent = "Submitting Brief...";
        submitBtn.disabled = true;
      }

      window.emailjs.sendForm("service_749pp9b", "template_r1bfzaa", bookingForm).then(
        function () {
          if (statusEl) {
            statusEl.style.color = "#27A776";
            statusEl.textContent = "Project brief received. Roselyn will respond within 24 hours.";
          }
          if (submitBtn) {
            submitBtn.textContent = "Book a Session →";
            submitBtn.disabled = false;
          }
          bookingForm.reset();
          selectSessionPill("Portrait");
        },
        function () {
          if (statusEl) {
            statusEl.style.color = "#c0392b";
            statusEl.textContent = "Could not send via form right now — please click 'Send Brief via WhatsApp' to message the studio directly.";
          }
          if (submitBtn) {
            submitBtn.textContent = "Book a Session →";
            submitBtn.disabled = false;
          }
        }
      );
    });
  }

  // 7. Scroll Reveal
  const revealEls = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window && revealEls.length) {
    const io = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -30px 0px" }
    );
    revealEls.forEach(function (el) {
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }
})();
