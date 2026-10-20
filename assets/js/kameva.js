/* ==============================================================
   KAMEVA PHOTOGRAPHY — SHARED PRODUCTION SCRIPT (assets/js/kameva.js)
    Powers Home (index.html), Portfolio (gallery.html),
   Services (services.html), About (about.html), and Booking (contact.html)
   ============================================================== */
(function () {
  "use strict";

  // --------------------------------------------------------------
  // 1. Mobile Navigation Drawer
  // --------------------------------------------------------------
  const menuToggle = document.getElementById("mobileMenuToggle");
  const menuDrawer = document.getElementById("mobileMenuDrawer");

  function setMobileMenu(open) {
    if (!menuToggle || !menuDrawer) return;
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
    menuDrawer.setAttribute("aria-hidden", String(!open));
    menuDrawer.classList.toggle("is-open", open);
  }

  if (menuToggle && menuDrawer) {
    menuToggle.addEventListener("click", function () {
      const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
      setMobileMenu(!isOpen);
    });

    menuDrawer.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        setMobileMenu(false);
      });
    });
  }

  // --------------------------------------------------------------
  // 2. Adaptive Sticky Header Surface Detection (Light <-> Charcoal)
  // --------------------------------------------------------------
  const siteHeader = document.getElementById("siteHeader");
  const darkSections = Array.from(
    document.querySelectorAll('[data-theme-surface="dark"], .site-footer')
  );

  function updateHeaderState() {
    if (!siteHeader) return;
    const headerMidpoint = 42;
    let onDark = false;
    for (let i = 0; i < darkSections.length; i++) {
      const rect = darkSections[i].getBoundingClientRect();
      if (rect.top <= headerMidpoint && rect.bottom >= headerMidpoint) {
        onDark = true;
        break;
      }
    }
    siteHeader.classList.toggle("is-dark-surface", onDark);
  }

  window.addEventListener("scroll", updateHeaderState, { passive: true });
  window.addEventListener("resize", updateHeaderState, { passive: true });
  updateHeaderState();

  // --------------------------------------------------------------
  // 3. Universal Study Switcher (Hero Primary/Secondary & Philosophy Break)
  // --------------------------------------------------------------
  const studyButtons = Array.from(document.querySelectorAll(".look-btn[data-target-img]"));

  studyButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      const targetImgId = btn.getAttribute("data-target-img");
      const targetCaptionId = btn.getAttribute("data-target-caption");
      const newSrc = btn.getAttribute("data-study-src");
      const newAlt = btn.getAttribute("data-study-alt");
      const newCaption = btn.getAttribute("data-study-caption");

      const imgEl = targetImgId ? document.getElementById(targetImgId) : null;
      const captionEl = targetCaptionId ? document.getElementById(targetCaptionId) : null;

      if (imgEl && newSrc && imgEl.getAttribute("src") !== newSrc) {
        imgEl.style.opacity = "0.4";
        setTimeout(function () {
          imgEl.src = newSrc;
          if (newAlt) imgEl.alt = newAlt;
          imgEl.style.opacity = "1";
        }, 120);
      }
      if (captionEl && newCaption) {
        captionEl.textContent = newCaption;
      }

      const group = btn.closest(".hero-figure__switcher, .philosophy-figure__switcher");
      if (group) {
        group.querySelectorAll(".look-btn").forEach(function (sibling) {
          const active = sibling === btn;
          sibling.classList.toggle("is-active", active);
          sibling.setAttribute("aria-pressed", String(active));
        });
      }
    });
  });

  // --------------------------------------------------------------
  // 4. Selected Stories Chapter Filter
  // --------------------------------------------------------------
  const chapterTabs = Array.from(document.querySelectorAll(".chapter-tab"));
  const storyEssays = Array.from(document.querySelectorAll(".story-essay"));

  function filterChapters(chapterKey) {
    storyEssays.forEach(function (essay) {
      const essayId = essay.getAttribute("data-story-id");
      const visible = chapterKey === "all" || essayId === chapterKey;
      essay.classList.toggle("is-hidden", !visible);
    });
  }

  chapterTabs.forEach(function (tab, idx) {
    tab.addEventListener("click", function () {
      const chapterKey = tab.getAttribute("data-chapter-filter") || "all";
      chapterTabs.forEach(function (t) {
        const selected = t === tab;
        t.classList.toggle("is-active", selected);
        t.setAttribute("aria-selected", String(selected));
      });
      filterChapters(chapterKey);
    });

    tab.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        e.preventDefault();
        const dir = e.key === "ArrowRight" ? 1 : -1;
        const nextIdx = (idx + dir + chapterTabs.length) % chapterTabs.length;
        chapterTabs[nextIdx].focus();
        chapterTabs[nextIdx].click();
      }
    });
  });

  // --------------------------------------------------------------
  // 5. Portfolio Category Filtering (Home 14 Plates & Gallery 31 Plates)
  // --------------------------------------------------------------
  const platesContainer = document.getElementById("editorialPlates");
  const plates = Array.from(document.querySelectorAll("#editorialPlates .plate"));
  const filterBtns = Array.from(document.querySelectorAll(".editorial-filter-btn"));
  const toggleExtendedBtn = document.getElementById("toggleExtendedPlates");
  const toggleExtendedText = document.getElementById("toggleExtendedText");

  let activeFilter = "all";
  let showExtended = false;

  function renderPlates() {
    if (!platesContainer) return;

    platesContainer.classList.toggle("is-filtered", activeFilter !== "all");

    plates.forEach(function (plate) {
      const cats = (plate.getAttribute("data-categories") || "").split(/\s+/);
      const matchesFilter = activeFilter === "all" || cats.includes(activeFilter);
      const isExtended = plate.classList.contains("plate--extended");

      plate.classList.toggle("is-hidden-by-filter", !matchesFilter);

      if (activeFilter === "all" && toggleExtendedBtn) {
        plate.classList.toggle("is-hidden-by-collapse", isExtended && !showExtended);
      } else {
        plate.classList.remove("is-hidden-by-collapse");
      }
    });

    if (toggleExtendedBtn) {
      toggleExtendedBtn.parentElement.style.display = activeFilter === "all" ? "flex" : "none";
      toggleExtendedBtn.setAttribute("aria-expanded", String(showExtended));
      if (toggleExtendedText) {
        toggleExtendedText.textContent = showExtended
          ? "Show Featured Selection (6 Works)"
          : "Expand All 14 Featured Plates";
      }
    }
  }

  filterBtns.forEach(function (btn, idx) {
    btn.addEventListener("click", function () {
      activeFilter = btn.getAttribute("data-filter") || "all";
      filterBtns.forEach(function (b) {
        const selected = b === btn;
        b.classList.toggle("is-active", selected);
        b.setAttribute("aria-selected", String(selected));
      });
      renderPlates();
    });

    btn.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        e.preventDefault();
        const dir = e.key === "ArrowRight" ? 1 : -1;
        const nextIdx = (idx + dir + filterBtns.length) % filterBtns.length;
        filterBtns[nextIdx].focus();
        filterBtns[nextIdx].click();
      }
    });
  });

  if (toggleExtendedBtn) {
    toggleExtendedBtn.addEventListener("click", function () {
      showExtended = !showExtended;
      renderPlates();
    });
  }

  // Support ?category= query param on gallery.html or #portfolio jump links
  document.querySelectorAll("[data-filter-jump]").forEach(function (link) {
    link.addEventListener("click", function () {
      const targetCat = link.getAttribute("data-filter-jump");
      const matchingBtn = filterBtns.find(function (b) {
        return b.getAttribute("data-filter") === targetCat;
      });
      if (matchingBtn) {
        matchingBtn.click();
      }
    });
  });

  try {
    const params = new URLSearchParams(window.location.search);
    const initialCat = (params.get("category") || "").toLowerCase();
    if (initialCat && filterBtns.length) {
      const matchBtn = filterBtns.find(function (b) {
        return b.getAttribute("data-filter") === initialCat;
      });
      if (matchBtn) {
        matchBtn.click();
      }
    } else {
      renderPlates();
    }
  } catch (_) {
    renderPlates();
  }

  // --------------------------------------------------------------
  // 6. Services Numbered Editorial Index + Session Preselection
  // --------------------------------------------------------------
  const serviceRows = Array.from(document.querySelectorAll(".service-row"));
  const previewImg = document.getElementById("servicePreviewImg");
  const previewCaption = document.getElementById("servicePreviewCaption");
  const previewCta = document.getElementById("servicePreviewCta");
  const serviceSelect = document.getElementById("ed-service");
  const sessionPills = Array.from(document.querySelectorAll(".session-pill"));

  const bookingForm = document.getElementById("editorialBookingForm");
  const submitBtn = document.getElementById("edSubmitBtn");
  const formStatus = document.getElementById("edFormStatus");
  const waQuickLink = document.getElementById("edWhatsappQuick");

  function updateWhatsappQuickLink() {
    if (!waQuickLink) return;
    let name = "";
    let phone = "";
    let subject = "Portrait";
    let prefDate = "";
    let location = "";
    let msg = "";

    if (bookingForm) {
      name = bookingForm.elements["name"]?.value.trim() || "";
      phone = bookingForm.elements["phone"]?.value.trim() || "";
      subject = bookingForm.elements["subject"]?.value || "Portrait";
      prefDate = bookingForm.elements["preferred_date"]?.value.trim() || "";
      location = bookingForm.elements["location"]?.value.trim() || "";
      msg = bookingForm.elements["message"]?.value.trim() || "";
    }

    const text =
      "Hello Roselyn (Kameva Photography), I would like to book a " +
      subject +
      " session." +
      (name ? " Name: " + name + "." : "") +
      (phone ? " Phone: " + phone + "." : "") +
      (prefDate ? " Preferred Date: " + prefDate + "." : "") +
      (location ? " Location: " + location + "." : "") +
      (msg ? " Details: " + msg : "");
    waQuickLink.href = "https://wa.me/2348161654981?text=" + encodeURIComponent(text);
  }

  function selectBookingSessionType(sessionKey) {
    if (!sessionKey) return;
    const normalized = sessionKey.trim();
    let matchedPill = null;

    sessionPills.forEach(function (pill) {
      const pVal = pill.getAttribute("data-session-pill");
      if (pVal && pVal.toLowerCase() === normalized.toLowerCase()) {
        matchedPill = pill;
      }
    });

    if (matchedPill) {
      const canonicalVal = matchedPill.getAttribute("data-session-pill");
      sessionPills.forEach(function (p) {
        const active = p === matchedPill;
        p.classList.toggle("is-selected", active);
        p.classList.toggle("is-active", active);
        p.setAttribute("aria-checked", String(active));
      });
      if (serviceSelect && canonicalVal) {
        serviceSelect.value = canonicalVal;
      }
    } else if (serviceSelect) {
      serviceSelect.value = normalized;
    }

    updateWhatsappQuickLink();
  }

  function activateServiceRow(row, toggleDrawerOnClick) {
    if (!row) return;
    const imgSrc = row.getAttribute("data-service-img");
    const caption = row.getAttribute("data-service-caption");
    const pillKey = row.getAttribute("data-service-pill");

    if (previewImg && imgSrc && previewImg.getAttribute("src") !== imgSrc) {
      previewImg.style.opacity = "0.35";
      setTimeout(function () {
        previewImg.src = imgSrc;
        previewImg.style.opacity = "1";
      }, 120);
    }
    if (previewCaption && caption) {
      previewCaption.textContent = caption;
    }
    if (previewCta && pillKey) {
      previewCta.setAttribute("data-book-pill", pillKey);
      if (previewCta.getAttribute("href")?.startsWith("contact.html")) {
        previewCta.setAttribute("href", "contact.html?session=" + encodeURIComponent(pillKey));
      }
    }

    serviceRows.forEach(function (r) {
      const isTarget = r === row;
      r.classList.toggle("is-active", isTarget);
      const headerBtn = r.querySelector(".service-row__header");
      const drawer = r.querySelector(".service-row__drawer");
      if (toggleDrawerOnClick && headerBtn && drawer) {
        headerBtn.setAttribute("aria-expanded", String(isTarget));
        drawer.hidden = !isTarget;
      }
    });
  }

  serviceRows.forEach(function (row) {
    const headerBtn = row.querySelector(".service-row__header");
    row.addEventListener("mouseenter", function () {
      activateServiceRow(row, false);
    });
    if (headerBtn) {
      headerBtn.addEventListener("focus", function () {
        activateServiceRow(row, false);
      });
      headerBtn.addEventListener("click", function () {
        activateServiceRow(row, true);
      });
    }
  });

  document.querySelectorAll("[data-book-pill]").forEach(function (link) {
    link.addEventListener("click", function () {
      const pillVal = link.getAttribute("data-book-pill");
      if (pillVal) {
        selectBookingSessionType(pillVal);
      }
    });
  });

  // --------------------------------------------------------------
  // 7. Booking Session Selector Pills, Validation & EmailJS Submission
  // --------------------------------------------------------------
  sessionPills.forEach(function (pill, idx) {
    pill.addEventListener("click", function () {
      const pillVal = pill.getAttribute("data-session-pill");
      selectBookingSessionType(pillVal);
    });

    pill.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        e.preventDefault();
        const dir = e.key === "ArrowRight" ? 1 : -1;
        const nextIdx = (idx + dir + sessionPills.length) % sessionPills.length;
        sessionPills[nextIdx].focus();
        sessionPills[nextIdx].click();
      }
    });
  });

  if (serviceSelect) {
    serviceSelect.addEventListener("change", function () {
      selectBookingSessionType(serviceSelect.value);
    });
  }

  // Pre-select session from URL query parameter (?session=Wedding, etc.)
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionParam = urlParams.get("session");
    if (sessionParam) {
      selectBookingSessionType(sessionParam);
    }
  } catch (_) {
    // ignore URLSearchParams errors
  }

  function validateBookingForm(form) {
    let valid = true;
    const requiredRules = [
      { id: "ed-name", errId: "err-name", msg: "Please enter your full name." },
      { id: "ed-email", errId: "err-email", msg: "Please enter a valid email address.", isEmail: true },
      { id: "ed-service", errId: "err-service", msg: "Please select a session type." },
      { id: "ed-message", errId: "err-message", msg: "Please share a few details about your session." }
    ];

    requiredRules.forEach(function (rule) {
      const field = document.getElementById(rule.id);
      const errEl = document.getElementById(rule.errId);
      if (!field) return;

      const val = (field.value || "").trim();
      let fieldValid = val.length > 0;
      if (fieldValid && rule.isEmail) {
        fieldValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
      }

      if (!fieldValid) {
        valid = false;
        field.setAttribute("aria-invalid", "true");
        if (errEl) {
          errEl.textContent = rule.msg;
          errEl.hidden = false;
        }
      } else {
        field.setAttribute("aria-invalid", "false");
        if (errEl) {
          errEl.textContent = "";
          errEl.hidden = true;
        }
      }
    });

    return valid;
  }

  let isSubmitting = false;

  if (bookingForm) {
    bookingForm.addEventListener("input", function (e) {
      updateWhatsappQuickLink();
      const target = e.target;
      if (target && target.getAttribute("aria-invalid") === "true") {
        validateBookingForm(bookingForm);
      }
    });
    updateWhatsappQuickLink();

    bookingForm.addEventListener("submit", function (e) {
      e.preventDefault();
      if (isSubmitting) return;

      if (!validateBookingForm(bookingForm)) {
        if (formStatus) {
          formStatus.style.color = "#c94a38";
          formStatus.textContent = "Please complete all required fields highlighted above.";
        }
        const firstInvalid = bookingForm.querySelector('[aria-invalid="true"]');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      isSubmitting = true;
      if (submitBtn) {
        submitBtn.textContent = "Sending Inquiry...";
        submitBtn.disabled = true;
      }
      if (formStatus) {
        formStatus.style.color = "#555555";
        formStatus.textContent = "Sending your session inquiry to Roselyn Abaa-Offor...";
      }

      if (typeof window.emailjs === "undefined" || typeof window.emailjs.sendForm !== "function") {
        isSubmitting = false;
        if (submitBtn) {
          submitBtn.textContent = "Book a Session →";
          submitBtn.disabled = false;
        }
        if (formStatus) {
          formStatus.style.color = "#c94a38";
          formStatus.textContent =
            "Email service could not be reached right now. Please click 'Continue on WhatsApp' below to send your pre-filled inquiry immediately.";
        }
        return;
      }

      try {
        window.emailjs.init("27Vuc1iqZ_itI7dn1");
      } catch (_) {
        // already initialized
      }

      window.emailjs.sendForm("service_749pp9b", "template_r1bfzaa", bookingForm).then(
        function () {
          isSubmitting = false;
          if (formStatus) {
            formStatus.style.color = "#27A776";
            formStatus.textContent =
              "Thank you! Your session inquiry has been sent. Roselyn will respond within 24 hours.";
          }
          if (submitBtn) {
            submitBtn.textContent = "Book a Session →";
            submitBtn.disabled = false;
          }
          bookingForm.reset();
          selectBookingSessionType("Portrait");
        },
        function () {
          isSubmitting = false;
          if (formStatus) {
            formStatus.style.color = "#c94a38";
            formStatus.textContent =
              "Could not send via email form right now — please click 'Continue on WhatsApp' below to message Roselyn directly.";
          }
          if (submitBtn) {
            submitBtn.textContent = "Book a Session →";
            submitBtn.disabled = false;
          }
        }
      );
    });
  }

  // --------------------------------------------------------------
  // 8. Accessible Full-Resolution Lightbox
  // --------------------------------------------------------------
  const lightbox = document.getElementById("editorialLightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxTitle = document.getElementById("lightboxTitle");
  const lightboxCat = document.getElementById("lightboxCat");
  let lastFocusedTrigger = null;

  function openLightbox(src, title, cat, triggerEl) {
    if (!lightbox || !lightboxImg) return;
    lastFocusedTrigger = triggerEl || document.activeElement;
    lightboxImg.src = src;
    lightboxImg.alt = title || "Kameva Photography Portfolio Photograph";
    if (lightboxTitle) lightboxTitle.textContent = title || "";
    if (lightboxCat) lightboxCat.textContent = cat || "";
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
    const closeBtn = lightbox.querySelector(".lightbox__close");
    if (closeBtn) closeBtn.focus();
  }

  function closeLightbox() {
    if (!lightbox || lightbox.hidden) return;
    lightbox.hidden = true;
    document.body.style.overflow = "";
    if (lightboxImg) lightboxImg.src = "";
    if (lastFocusedTrigger && typeof lastFocusedTrigger.focus === "function") {
      lastFocusedTrigger.focus();
    }
  }

  document.querySelectorAll("[data-lightbox-src]").forEach(function (trigger) {
    trigger.addEventListener("click", function () {
      openLightbox(
        trigger.getAttribute("data-lightbox-src"),
        trigger.getAttribute("data-lightbox-title"),
        trigger.getAttribute("data-lightbox-cat"),
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
      setMobileMenu(false);
    }
  });

  // --------------------------------------------------------------
  // 9. Subtle Scroll Reveal (respects prefers-reduced-motion)
  // --------------------------------------------------------------
  const revealEls = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window && revealEls.length) {
    const io = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -24px 0px" }
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
