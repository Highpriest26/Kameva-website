/* ==============================================================
   CONCEPT A: EDITORIAL LUXURY (/concept-a/script.js)
   ============================================================== */
(function () {
  "use strict";

  // 1. Mobile Navigation Drawer
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

  // 2. Secondary Hero Study Switcher (k-14.jpg / k-32.jpg)
  const secondaryImg = document.getElementById("heroSecondaryImg");
  const lookBtns = document.querySelectorAll(".look-btn");
  if (secondaryImg && lookBtns.length) {
    lookBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        const src = btn.getAttribute("data-secondary-src");
        const alt = btn.getAttribute("data-secondary-alt");
        const captionText = btn.getAttribute("data-secondary-caption");
        if (src) {
          secondaryImg.src = src;
        }
        if (alt) {
          secondaryImg.alt = alt;
        }
        const captionSpan = btn.closest(".hero-figure__caption")?.querySelector("span");
        if (captionSpan && captionText) {
          captionSpan.textContent = captionText;
        }
        lookBtns.forEach(function (b) {
          b.classList.toggle("is-active", b === btn);
        });
      });
    });
  }

  // 3. Editorial Portfolio Plates: Initial 6-Plate Issue + Expandable Archive + Category Filtering
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

  filterBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      activeFilter = btn.getAttribute("data-filter") || "all";
      filterBtns.forEach(function (b) {
        const selected = b === btn;
        b.classList.toggle("is-active", selected);
        b.setAttribute("aria-selected", String(selected));
      });
      renderPlates();
    });
  });

  if (toggleExtendedBtn) {
    toggleExtendedBtn.addEventListener("click", function () {
      showExtended = !showExtended;
      renderPlates();
    });
  }

  // Hero category jump links
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

  // 4. About Section: Read More Biography Toggle
  const readMoreBtn = document.getElementById("aboutReadMoreBtn");
  const bioMore = document.getElementById("aboutBioMore");
  if (readMoreBtn && bioMore) {
    readMoreBtn.addEventListener("click", function () {
      const expanded = readMoreBtn.getAttribute("aria-expanded") === "true";
      readMoreBtn.setAttribute("aria-expanded", String(!expanded));
      bioMore.hidden = expanded;
      readMoreBtn.textContent = expanded ? "Read More +" : "Read Less −";
    });
  }

  // 5. Services Numbered Editorial Index (Desktop Hover/Focus + Mobile Tap Accordion)
  const serviceRows = Array.from(document.querySelectorAll(".service-row"));
  const previewImg = document.getElementById("servicePreviewImg");
  const previewCaption = document.getElementById("servicePreviewCaption");
  const previewCta = document.getElementById("servicePreviewCta");
  const serviceSelect = document.getElementById("ed-service");

  function activateServiceRow(row, toggleDrawerOnClick) {
    if (!row) return;
    const imgSrc = row.getAttribute("data-service-img");
    const caption = row.getAttribute("data-service-caption");
    const serviceName = row.getAttribute("data-service-name");

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
    if (previewCta && serviceName) {
      previewCta.setAttribute("data-book-service", serviceName);
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

  // Pre-fill Booking Service when clicking "Book ... Session"
  document.querySelectorAll("[data-book-service]").forEach(function (link) {
    link.addEventListener("click", function () {
      const serviceName = link.getAttribute("data-book-service");
      if (serviceSelect && serviceName) {
        serviceSelect.value = serviceName;
      }
    });
  });

  // 6. Accessible Full-Resolution Lightbox
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

  // 7. Booking Form (EmailJS + Dynamic WhatsApp Link)
  const bookingForm = document.getElementById("editorialBookingForm");
  const submitBtn = document.getElementById("edSubmitBtn");
  const formStatus = document.getElementById("edFormStatus");
  const waQuickLink = document.getElementById("edWhatsappQuick");

  function updateWhatsappQuickLink() {
    if (!waQuickLink || !bookingForm) return;
    const name = bookingForm.elements["name"]?.value || "";
    const subject = bookingForm.elements["subject"]?.value || "Photography Session";
    const dateLoc = bookingForm.elements["date_location"]?.value || "";
    const msg = bookingForm.elements["message"]?.value || "";
    const text =
      "Hello Roselyn (Kameva Photography), I would like to book a " +
      subject +
      (name ? ". Name: " + name : "") +
      (dateLoc ? ". Date/Location: " + dateLoc : "") +
      (msg ? ". Notes: " + msg : "");
    waQuickLink.href = "https://wa.me/2348161654981?text=" + encodeURIComponent(text);
  }

  if (bookingForm) {
    bookingForm.addEventListener("input", updateWhatsappQuickLink);

    bookingForm.addEventListener("submit", function (e) {
      e.preventDefault();
      if (typeof window.emailjs === "undefined") {
        if (formStatus) {
          formStatus.style.color = "#27A776";
          formStatus.textContent = "Redirecting your commission inquiry to WhatsApp...";
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
            formStatus.textContent = "Your session inquiry has been received. Roselyn will respond within 24 hours.";
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
            formStatus.textContent = "Could not send via form right now — please click 'Continue on WhatsApp' to message Roselyn directly.";
          }
          if (submitBtn) {
            submitBtn.textContent = "Book a Session →";
            submitBtn.disabled = false;
          }
        }
      );
    });
  }

  // 8. Subtle Scroll Reveal (respects prefers-reduced-motion)
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
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
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
