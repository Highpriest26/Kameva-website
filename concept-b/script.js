/* ==============================================================
   CONCEPT B: CINEMATIC STORYTELLER (/concept-b/script.js)
   ============================================================== */
(function () {
  "use strict";

  // 1. Floating Header Scrolled State
  const header = document.getElementById("cinemaHeader");
  function handleScroll() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 36);
  }
  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();

  // 2. Mobile Navigation Drawer
  const menuBtn = document.getElementById("cinemaMenuBtn");
  const mobileMenu = document.getElementById("cinemaMobileMenu");

  function setMobileMenu(open) {
    if (!menuBtn || !mobileMenu) return;
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
    mobileMenu.setAttribute("aria-hidden", String(!open));
    mobileMenu.classList.toggle("is-open", open);
    if (open && header) {
      header.classList.add("is-scrolled");
    } else {
      handleScroll();
    }
  }

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener("click", function () {
      const isOpen = menuBtn.getAttribute("aria-expanded") === "true";
      setMobileMenu(!isOpen);
    });

    mobileMenu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        setMobileMenu(false);
      });
    });
  }

  // 3. Hero Scene Crossfade Switcher (k-10.jpeg, k-31.jpeg, k-13.jpeg)
  const sceneBtns = Array.from(document.querySelectorAll(".cinema-scene-btn"));
  const slides = Array.from(document.querySelectorAll(".cinema-slide"));

  function activateScene(index) {
    sceneBtns.forEach(function (btn, idx) {
      const active = idx === index;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-selected", String(active));
    });
    slides.forEach(function (slide, idx) {
      slide.classList.toggle("is-active", idx === index);
    });
  }

  sceneBtns.forEach(function (btn, idx) {
    btn.addEventListener("click", function () {
      activateScene(idx);
    });
  });

  // 4. Story Chapter & Frame Category Filtering
  const filterPills = Array.from(document.querySelectorAll(".story-filter-pill"));
  const chapters = Array.from(document.querySelectorAll(".story-chapter"));

  filterPills.forEach(function (pill) {
    pill.addEventListener("click", function () {
      const cat = pill.getAttribute("data-story-filter") || "all";

      filterPills.forEach(function (p) {
        const active = p === pill;
        p.classList.toggle("is-active", active);
        p.setAttribute("aria-selected", String(active));
      });

      chapters.forEach(function (chapter) {
        let visibleFrameCount = 0;
        chapter.querySelectorAll(".story-frame").forEach(function (frame) {
          const itemCats = (frame.getAttribute("data-item-cats") || "").split(/\s+/);
          const itemMatches = cat === "all" || itemCats.includes(cat);
          frame.classList.toggle("is-item-hidden", !itemMatches);
          if (itemMatches) {
            visibleFrameCount++;
          }
        });
        chapter.classList.toggle("is-chapter-hidden", visibleFrameCount === 0);
      });
    });
  });

  // 5. Service Cards -> Pre-select Session Type in Booking Form
  const sessionSelect = document.getElementById("cb-session");
  document.querySelectorAll("[data-select-session]").forEach(function (link) {
    link.addEventListener("click", function () {
      const sessionVal = link.getAttribute("data-select-session");
      if (sessionSelect && sessionVal) {
        sessionSelect.value = sessionVal;
      }
    });
  });

  // 6. Accessible Lightbox Modal
  const lightbox = document.getElementById("cinemaLightbox");
  const lightboxImg = document.getElementById("cinemaLightboxImg");
  const lightboxCaption = document.getElementById("cinemaLightboxCaption");
  let lastTrigger = null;

  function openLightbox(src, caption, triggerEl) {
    if (!lightbox || !lightboxImg) return;
    lastTrigger = triggerEl || document.activeElement;
    lightboxImg.src = src;
    lightboxImg.alt = caption || "Kameva Photography Story Frame";
    if (lightboxCaption) lightboxCaption.textContent = caption || "";
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
    const closeBtn = lightbox.querySelector(".cinema-lightbox__close");
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

  document.querySelectorAll("[data-lightbox-src]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      openLightbox(
        btn.getAttribute("data-lightbox-src"),
        btn.getAttribute("data-lightbox-caption"),
        btn
      );
    });
  });

  document.querySelectorAll("[data-lightbox-close]").forEach(function (el) {
    el.addEventListener("click", closeLightbox);
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      closeLightbox();
      setMobileMenu(false);
    }
  });

  // 7. Booking Form (EmailJS + Dynamic WhatsApp Link)
  const form = document.getElementById("cinemaBookingForm");
  const submitBtn = document.getElementById("cbSubmitBtn");
  const statusEl = document.getElementById("cbFormStatus");
  const waLink = document.getElementById("cbWhatsappLink");

  function syncWhatsappLink() {
    if (!form || !waLink) return;
    const name = form.elements["name"]?.value || "";
    const session = form.elements["subject"]?.value || "Photography Session";
    const date = form.elements["preferred_date"]?.value || "";
    const msg = form.elements["message"]?.value || "";
    const text =
      "Hello Roselyn (Kameva Photography), I'd love to book a " +
      session +
      (name ? ". Name: " + name : "") +
      (date ? ". Preferred Date: " + date : "") +
      (msg ? ". Story: " + msg : "");
    waLink.href = "https://wa.me/2348161654981?text=" + encodeURIComponent(text);
  }

  if (form) {
    form.addEventListener("input", syncWhatsappLink);

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (typeof window.emailjs === "undefined") {
        syncWhatsappLink();
        window.open(waLink.href, "_blank", "noopener");
        return;
      }

      try {
        window.emailjs.init("27Vuc1iqZ_itI7dn1");
      } catch (_) {}

      if (submitBtn) {
        submitBtn.textContent = "Sending Story...";
        submitBtn.disabled = true;
      }

      window.emailjs.sendForm("service_749pp9b", "template_r1bfzaa", form).then(
        function () {
          if (statusEl) {
            statusEl.style.color = "#27A776";
            statusEl.textContent = "Thank you — your message has been sent. Roselyn will reply within 24 hours.";
          }
          if (submitBtn) {
            submitBtn.textContent = "Book a Session →";
            submitBtn.disabled = false;
          }
          form.reset();
        },
        function () {
          if (statusEl) {
            statusEl.style.color = "#c0392b";
            statusEl.textContent = "Could not send via form right now — please click 'Continue on WhatsApp' to reach Roselyn directly.";
          }
          if (submitBtn) {
            submitBtn.textContent = "Book a Session →";
            submitBtn.disabled = false;
          }
        }
      );
    });
  }

  // 8. Scroll Reveal
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
