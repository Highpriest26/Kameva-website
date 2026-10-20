/* ==============================================================
   KAMEVA PHOTOGRAPHY — FINAL DESIGN DIRECTION (/concept-final/script.js)
   Base: Concept A (Editorial Luxury)
   Visual Influence: Concept B (Cinematic Storyteller) & Concept C (Session Selector)
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
  // 2. Adaptive Header Surface & Scrollspy Active Nav
  // --------------------------------------------------------------
  const siteHeader = document.getElementById("siteHeader");
  const darkSections = Array.from(
    document.querySelectorAll('[data-theme-surface="dark"], .site-footer')
  );
  const trackedSections = Array.from(
    document.querySelectorAll("#stories, #portfolio, #about, #services, #booking")
  );
  const navLinks = Array.from(document.querySelectorAll(".header-nav .nav-link"));

  function updateHeaderState() {
    if (!siteHeader) return;
    const headerBottom = 42; // vertical midpoint of sticky header

    // Check if header overlaps a dark charcoal section
    let onDark = false;
    for (let i = 0; i < darkSections.length; i++) {
      const rect = darkSections[i].getBoundingClientRect();
      if (rect.top <= headerBottom && rect.bottom >= headerBottom) {
        onDark = true;
        break;
      }
    }
    siteHeader.classList.toggle("is-dark-surface", onDark);

    // Update active navigation link
    let currentSectionId = "top";
    const triggerLine = 180;
    for (let j = 0; j < trackedSections.length; j++) {
      const secRect = trackedSections[j].getBoundingClientRect();
      if (secRect.top <= triggerLine && secRect.bottom > triggerLine) {
        currentSectionId = trackedSections[j].id;
        break;
      }
    }

    navLinks.forEach(function (link) {
      const href = link.getAttribute("href") || "";
      const isMatch = currentSectionId && href === "#" + currentSectionId;
      link.classList.toggle("is-active", Boolean(isMatch));
    });
  }

  window.addEventListener("scroll", updateHeaderState, { passive: true });
  window.addEventListener("resize", updateHeaderState, { passive: true });
  updateHeaderState();

  // --------------------------------------------------------------
  // 3. Universal Study Switcher (Hero Primary, Hero Secondary, Philosophy Break)
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
  // 4. Selected Stories Chapter Filter (03 Selected Stories)
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
  // 5. Editorial Portfolio Plates: Initial 6-Plate Issue + Expandable Archive + Category Filtering
  // --------------------------------------------------------------
  const platesContainer = document.getElementById("editorialPlates");
  const plates = Array.from(document.querySelectorAll(".editorial-plates .plate"));
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

      if (activeFilter === "all") {
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
          ? "Show Curated 6 Plates Only"
          : "Expand Full Issue (Plates 07–14)";
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

    // Keyboard arrow support for filter bar
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

  // Hero discipline strip jump links
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

  renderPlates();

  // --------------------------------------------------------------
  // 6. About Section: "Read My Story →" Toggle
  // --------------------------------------------------------------
  const readMoreBtn = document.getElementById("aboutReadMoreBtn");
  const bioMore = document.getElementById("aboutBioMore");
  if (readMoreBtn && bioMore) {
    readMoreBtn.addEventListener("click", function () {
      const expanded = readMoreBtn.getAttribute("aria-expanded") === "true";
      readMoreBtn.setAttribute("aria-expanded", String(!expanded));
      bioMore.hidden = expanded;
      readMoreBtn.textContent = expanded ? "Read My Story →" : "Show Less −";
    });
  }

  // --------------------------------------------------------------
  // 7. Services Numbered Editorial Index + Booking Pill Sync
  // --------------------------------------------------------------
  const serviceRows = Array.from(document.querySelectorAll(".service-row"));
  const previewImg = document.getElementById("servicePreviewImg");
  const previewCaption = document.getElementById("servicePreviewCaption");
  const previewCta = document.getElementById("servicePreviewCta");
  const serviceSelect = document.getElementById("ed-service");
  const sessionPills = Array.from(document.querySelectorAll(".session-pill"));

  function selectBookingSessionType(pillValue, serviceName) {
    const targetVal = pillValue || serviceName;
    if (!targetVal) return;

    let matchedPill = null;
    sessionPills.forEach(function (pill) {
      const pVal = pill.getAttribute("data-session-pill") || pill.getAttribute("data-pill-value");
      if (pVal === targetVal) {
        matchedPill = pill;
      }
    });

    if (matchedPill) {
      const chosen =
        matchedPill.getAttribute("data-session-pill") ||
        matchedPill.getAttribute("data-pill-value");
      sessionPills.forEach(function (p) {
        const active = p === matchedPill;
        p.classList.toggle("is-selected", active);
        p.classList.toggle("is-active", active);
        p.setAttribute("aria-checked", String(active));
      });
      if (serviceSelect && chosen) {
        serviceSelect.value = chosen;
      }
    } else if (serviceSelect) {
      serviceSelect.value = targetVal;
    }

    updateWhatsappQuickLink();
  }

  function activateServiceRow(row, toggleDrawerOnClick) {
    if (!row) return;
    const imgSrc = row.getAttribute("data-service-img");
    const caption = row.getAttribute("data-service-caption");
    const serviceName = row.getAttribute("data-service-name");
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
    if (previewCta) {
      if (serviceName) previewCta.setAttribute("data-book-service", serviceName);
      if (pillKey) previewCta.setAttribute("data-book-pill", pillKey);
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

  // Pre-fill Booking Session Type when clicking "Book ... Session"
  document.querySelectorAll("[data-book-service], [data-book-pill]").forEach(function (link) {
    link.addEventListener("click", function () {
      const pillVal = link.getAttribute("data-book-pill");
      const serviceName = link.getAttribute("data-book-service");
      selectBookingSessionType(pillVal, serviceName);
    });
  });

  // --------------------------------------------------------------
  // 8. Booking Session-Type Selector Pills & Form (EmailJS + WhatsApp)
  // --------------------------------------------------------------
  const bookingForm = document.getElementById("editorialBookingForm");
  const submitBtn = document.getElementById("edSubmitBtn");
  const formStatus = document.getElementById("edFormStatus");
  const waQuickLink = document.getElementById("edWhatsappQuick");

  function updateWhatsappQuickLink() {
    if (!waQuickLink || !bookingForm) return;
    const name = bookingForm.elements["name"]?.value || "";
    const phone = bookingForm.elements["phone"]?.value || "";
    const subject = bookingForm.elements["subject"]?.value || "Portrait Session";
    const prefDate = bookingForm.elements["preferred_date"]?.value || "";
    const location = bookingForm.elements["location"]?.value || "";
    const msg = bookingForm.elements["message"]?.value || "";

    const text =
      "Hello Roselyn (Kameva Photography), I would like to book a " +
      subject +
      (name ? ". Name: " + name : "") +
      (phone ? ". Phone: " + phone : "") +
      (prefDate ? ". Preferred Date: " + prefDate : "") +
      (location ? ". Location: " + location : "") +
      (msg ? ". Details: " + msg : "");
    waQuickLink.href = "https://wa.me/2348161654981?text=" + encodeURIComponent(text);
  }

  sessionPills.forEach(function (pill, idx) {
    pill.addEventListener("click", function () {
      const pillVal =
        pill.getAttribute("data-session-pill") || pill.getAttribute("data-pill-value");
      selectBookingSessionType(pillVal, pillVal);
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
      selectBookingSessionType(null, serviceSelect.value);
    });
  }

  if (bookingForm) {
    bookingForm.addEventListener("input", updateWhatsappQuickLink);
    updateWhatsappQuickLink();

    bookingForm.addEventListener("submit", function (e) {
      e.preventDefault();
      if (typeof window.emailjs === "undefined") {
        if (formStatus) {
          formStatus.style.color = "#27A776";
          formStatus.textContent = "Redirecting your session inquiry to WhatsApp...";
        }
        updateWhatsappQuickLink();
        window.open(waQuickLink.href, "_blank", "noopener");
        return;
      }

      try {
        window.emailjs.init("27Vuc1iqZ_itI7dn1");
      } catch (_) {
        // already initialized
      }

      if (submitBtn) {
        submitBtn.textContent = "Sending Inquiry...";
        submitBtn.disabled = true;
      }

      window.emailjs.sendForm("service_749pp9b", "template_r1bfzaa", bookingForm).then(
        function () {
          if (formStatus) {
            formStatus.style.color = "#27A776";
            formStatus.textContent =
              "Your session inquiry has been received. Roselyn will respond within 24 hours.";
          }
          if (submitBtn) {
            submitBtn.textContent = "Book a Session →";
            submitBtn.disabled = false;
          }
          bookingForm.reset();
        },
        function () {
          if (formStatus) {
            formStatus.style.color = "#e07b54";
            formStatus.textContent =
              "Could not send via form right now — please click 'Continue on WhatsApp' to message Roselyn directly.";
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
  // 9. Accessible Full-Resolution Lightbox (Stories + Portfolio)
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
    lightboxImg.alt = title || "Kameva Photography Portfolio Plate";
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
  // 10. Subtle Scroll Reveal (respects prefers-reduced-motion)
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
      { threshold: 0.1, rootMargin: "0px 0px -36px 0px" }
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
