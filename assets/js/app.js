/* ==========================================================================
   Edith Nduta Kuria — site interactions
   Vanilla JS, progressive enhancement, no dependencies.
   ========================================================================== */
(() => {
  "use strict";

  const root = document.documentElement;
  const body = document.body;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

  /* ------------------------------------------------------------------
     Scroll lock shared by dialogs
     ------------------------------------------------------------------ */
  function syncScrollLock() {
    body.classList.toggle("is-locked", Boolean($("dialog[open]")));
  }

  /* ------------------------------------------------------------------
     Theme
     ------------------------------------------------------------------ */
  const themeToggle = $("[data-theme-toggle]");

  function getTheme() {
    return root.getAttribute("data-theme") === "dark" ? "dark" : "light";
  }

  function updateThemeColor(theme) {
    const value = theme === "dark" ? "#12110F" : "#F3EEE4";
    const metas = $$('meta[name="theme-color"]');
    if (!metas.length) {
      const meta = document.createElement("meta");
      meta.name = "theme-color";
      meta.content = value;
      document.head.appendChild(meta);
      return;
    }
    metas.forEach((meta) => {
      meta.removeAttribute("media");
      meta.content = value;
    });
  }

  function applyTheme(theme, persist = true) {
    root.setAttribute("data-theme", theme);
    if (persist) {
      try {
        localStorage.setItem("enk-theme", theme);
      } catch (error) { /* ignore */ }
    }
    if (themeToggle) {
      const dark = theme === "dark";
      themeToggle.setAttribute("aria-pressed", String(dark));
      themeToggle.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
    }
    updateThemeColor(theme);
  }

  if (themeToggle) {
    applyTheme(getTheme(), false);
    themeToggle.addEventListener("click", () => {
      applyTheme(getTheme() === "dark" ? "light" : "dark");
    });
  }

  // Follow the system only if the visitor has not made an explicit choice.
  const themeQuery = window.matchMedia("(prefers-color-scheme: dark)");
  themeQuery.addEventListener("change", (event) => {
    let saved = null;
    try {
      saved = localStorage.getItem("enk-theme");
    } catch (error) { /* ignore */ }
    if (!saved) applyTheme(event.matches ? "dark" : "light", false);
  });

  /* ------------------------------------------------------------------
     Header state + scroll progress
     ------------------------------------------------------------------ */
  const header = $("[data-header]");
  const progress = $("[data-progress]");
  let scrollTicking = false;

  function onScrollFrame() {
    scrollTicking = false;
    const y = window.scrollY || root.scrollTop;
    if (header) header.classList.toggle("is-scrolled", y > 8);
    if (progress) {
      const max = root.scrollHeight - window.innerHeight;
      const ratio = max > 0 ? Math.min(1, Math.max(0, y / max)) : 0;
      progress.style.transform = `scaleX(${ratio})`;
    }
  }

  function requestScrollFrame() {
    if (scrollTicking) return;
    scrollTicking = true;
    window.requestAnimationFrame(onScrollFrame);
  }

  window.addEventListener("scroll", requestScrollFrame, { passive: true });
  window.addEventListener("resize", requestScrollFrame, { passive: true });
  requestScrollFrame();

  /* ------------------------------------------------------------------
     Mobile menu
     ------------------------------------------------------------------ */
  const menuDialog = $("#menu-dialog");
  const menuOpen = $("[data-menu-open]");
  const menuClose = $("[data-menu-close]");

  function openMenu() {
    if (!menuDialog || !menuOpen) return;
    if (typeof menuDialog.showModal === "function") {
      menuDialog.showModal();
    } else {
      menuDialog.setAttribute("open", "");
    }
    menuOpen.setAttribute("aria-expanded", "true");
    syncScrollLock();
  }

  function closeMenu() {
    if (!menuDialog) return;
    if (menuDialog.open && typeof menuDialog.close === "function") {
      menuDialog.close();
    } else {
      menuDialog.removeAttribute("open");
      menuOpen?.setAttribute("aria-expanded", "false");
      syncScrollLock();
    }
  }

  menuOpen?.addEventListener("click", openMenu);
  menuClose?.addEventListener("click", closeMenu);

  menuDialog?.addEventListener("close", () => {
    menuOpen?.setAttribute("aria-expanded", "false");
    syncScrollLock();
  });

  $$("a", menuDialog || document.createElement("div")).forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  // Collapse the overlay if the viewport grows past the mobile breakpoint.
  const desktopQuery = window.matchMedia("(min-width: 961px)");
  desktopQuery.addEventListener("change", (event) => {
    if (event.matches && menuDialog?.open) closeMenu();
  });

  /* ------------------------------------------------------------------
     Reveal on scroll
     ------------------------------------------------------------------ */
  const revealItems = $$("[data-reveal]");

  if (reduceMotion.matches || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -8% 0px" }
    );
    revealItems.forEach((item) => revealObserver.observe(item));
  }

  /* ------------------------------------------------------------------
     Active navigation
     ------------------------------------------------------------------ */
  const navLinks = $$(".nav a");
  const sections = navLinks
    .map((link) => $(link.getAttribute("href")))
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = `#${entry.target.id}`;
          navLinks.forEach((link) => {
            const active = link.getAttribute("href") === id;
            link.classList.toggle("is-active", active);
            if (active) link.setAttribute("aria-current", "true");
            else link.removeAttribute("aria-current");
          });
        });
      },
      { rootMargin: "-42% 0px -52% 0px", threshold: 0 }
    );
    sections.forEach((section) => sectionObserver.observe(section));
  }

  /* ------------------------------------------------------------------
     Work filters
     ------------------------------------------------------------------ */
  const filterButtons = $$("[data-filter]");
  const workItems = $$(".work-item");
  const workCount = $("[data-work-count]");
  const hoverPreview = $("[data-hover-preview]");

  function visibleWorkItems() {
    return workItems.filter((item) => !item.classList.contains("is-filtered-out"));
  }

  function setFilter(filter) {
    filterButtons.forEach((button) => {
      const active = button.dataset.filter === filter;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });

    workItems.forEach((item) => {
      const show = filter === "all" || item.dataset.category === filter;
      item.classList.toggle("is-filtered-out", !show);
      if (show) {
        item.classList.add("is-visible");
        item.querySelectorAll("[data-reveal]").forEach((el) => el.classList.add("is-visible"));
      }
    });

    if (workCount) {
      const count = visibleWorkItems().length;
      workCount.textContent = `Showing ${count} of ${workItems.length} projects`;
    }

    hidePreview();
  }

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => setFilter(button.dataset.filter || "all"));
  });

  /* ------------------------------------------------------------------
     Hover preview
     ------------------------------------------------------------------ */
  let previewX = 0;
  let previewY = 0;
  let previewFrame = 0;
  let previewActive = false;

  function positionPreview() {
    previewFrame = 0;
    if (!hoverPreview || !previewActive) return;

    const pad = 20;
    const width = hoverPreview.offsetWidth;
    const height = hoverPreview.offsetHeight;
    let left = previewX + width / 2 + 22;
    let top = previewY;

    if (left + width / 2 > window.innerWidth - pad) {
      left = previewX - width / 2 - 22;
    }
    left = Math.max(width / 2 + pad, Math.min(window.innerWidth - width / 2 - pad, left));
    top = Math.max(height / 2 + pad, Math.min(window.innerHeight - height / 2 - pad, top));

    hoverPreview.style.left = `${left}px`;
    hoverPreview.style.top = `${top}px`;
  }

  function showPreview(event, button) {
    if (!hoverPreview || !finePointer.matches || reduceMotion.matches) return;
    const image = $("img", button);
    const previewImage = $("img", hoverPreview);
    if (!image || !previewImage) return;

    const source = image.currentSrc || image.getAttribute("src");
    if (source && previewImage.getAttribute("src") !== source) {
      previewImage.setAttribute("src", source);
    }

    previewX = event.clientX;
    previewY = event.clientY;
    previewActive = true;
    hoverPreview.classList.add("is-visible");
    if (!previewFrame) previewFrame = window.requestAnimationFrame(positionPreview);
  }

  function hidePreview() {
    previewActive = false;
    hoverPreview?.classList.remove("is-visible");
  }

  $$(".work-item__button").forEach((button) => {
    button.addEventListener("pointerenter", (event) => {
      if (event.pointerType === "touch") return;
      showPreview(event, button);
    });
    button.addEventListener("pointermove", (event) => {
      if (!previewActive) return;
      previewX = event.clientX;
      previewY = event.clientY;
      if (!previewFrame) previewFrame = window.requestAnimationFrame(positionPreview);
    });
    button.addEventListener("pointerleave", hidePreview);
    button.addEventListener("focus", hidePreview);
  });

  window.addEventListener("scroll", hidePreview, { passive: true });
  finePointer.addEventListener("change", () => {
    if (!finePointer.matches) hidePreview();
  });

  /* ------------------------------------------------------------------
     Project dialog
     ------------------------------------------------------------------ */
  const projectDialog = $("#project-dialog");
  const projectBody = $("[data-dialog-body]", projectDialog || document);
  const projectClose = $("[data-dialog-close]", projectDialog || document);
  const projectNext = $("[data-dialog-next]", projectDialog || document);
  const projectNextTitle = $("[data-dialog-next-title]", projectDialog || document);

  let activeTriggers = [];
  let activeIndex = 0;
  let lastTrigger = null;

  function projectTitleFor(trigger) {
    const item = trigger.closest(".work-item");
    return $(".work-item__title", item)?.textContent.trim() || "Project";
  }

  function populateDialog(trigger) {
    if (!projectDialog || !projectBody) return;
    const id = trigger.dataset.project;
    const template = document.getElementById(`project-${id}`);
    if (!template) return;

    const fragment = template.content.cloneNode(true);
    projectBody.replaceChildren(fragment);

    const caseTitle = $(".case__title", projectBody);
    if (caseTitle) caseTitle.id = "project-dialog-title";

    projectBody.scrollTop = 0;
    projectDialog.setAttribute("aria-label", projectTitleFor(trigger));

    activeTriggers = visibleWorkItems()
      .map((item) => $(".work-item__button", item))
      .filter(Boolean);
    activeIndex = activeTriggers.indexOf(trigger);

    const nextTrigger = activeTriggers[(activeIndex + 1) % activeTriggers.length];
    if (projectNext && projectNextTitle && activeTriggers.length > 1) {
      projectNext.hidden = false;
      projectNextTitle.textContent = nextTrigger ? projectTitleFor(nextTrigger) : "";
    } else if (projectNext) {
      projectNext.hidden = true;
    }
  }

  function openProject(trigger) {
    if (!projectDialog || !projectBody) return;
    lastTrigger = trigger;
    populateDialog(trigger);

    if (typeof projectDialog.showModal === "function") {
      projectDialog.showModal();
    } else {
      projectDialog.setAttribute("open", "");
    }
    syncScrollLock();
  }

  function closeProject() {
    if (!projectDialog) return;
    if (projectDialog.open && typeof projectDialog.close === "function") {
      projectDialog.close();
    } else {
      projectDialog.removeAttribute("open");
      syncScrollLock();
    }
  }

  function showNextProject() {
    if (!activeTriggers.length || !projectDialog?.open) return;
    activeIndex = (activeIndex + 1) % activeTriggers.length;
    const trigger = activeTriggers[activeIndex];
    lastTrigger = trigger;
    populateDialog(trigger);
  }

  $$(".work-item__button").forEach((trigger) => {
    trigger.addEventListener("click", () => openProject(trigger));
  });

  projectClose?.addEventListener("click", closeProject);
  projectNext?.addEventListener("click", showNextProject);

  let backdropPress = false;
  projectDialog?.addEventListener("pointerdown", (event) => {
    backdropPress = event.target === projectDialog;
  });
  projectDialog?.addEventListener("click", (event) => {
    if (event.target === projectDialog && backdropPress) closeProject();
    backdropPress = false;
  });

  projectDialog?.addEventListener("close", () => {
    syncScrollLock();
    if (lastTrigger) lastTrigger.focus({ preventScroll: true });
  });

  projectDialog?.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight" && projectDialog.open) {
      event.preventDefault();
      showNextProject();
    }
  });

  /* ------------------------------------------------------------------
     Copy email
     ------------------------------------------------------------------ */
  const toast = $("[data-toast]");
  let toastTimer = 0;

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("is-visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 3200);
  }

  function legacyCopy(text) {
    const field = document.createElement("textarea");
    field.value = text;
    field.setAttribute("readonly", "");
    field.style.position = "fixed";
    field.style.opacity = "0";
    field.style.pointerEvents = "none";
    document.body.appendChild(field);
    field.select();
    let copied = false;
    try {
      copied = document.execCommand("copy");
    } catch (error) {
      copied = false;
    }
    field.remove();
    return copied;
  }

  $$("[data-copy-email]").forEach((button) => {
    const original = button.textContent;
    button.addEventListener("click", async () => {
      const email = button.dataset.copyEmail || "";
      if (!email) return;
      let copied = false;
      try {
        await navigator.clipboard.writeText(email);
        copied = true;
      } catch (error) {
        copied = legacyCopy(email);
      }
      showToast(copied ? `Email copied — ${email}` : `Email: ${email}`);
      if (copied) {
        button.textContent = "Copied";
        window.setTimeout(() => {
          button.textContent = original;
        }, 2200);
      }
    });
  });

  /* ------------------------------------------------------------------
     Nairobi local time + year
     ------------------------------------------------------------------ */
  const timeFormatter = (() => {
    try {
      return new Intl.DateTimeFormat("en-GB", {
        timeZone: "Africa/Nairobi",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    } catch (error) {
      return null;
    }
  })();

  function updateTime() {
    if (!timeFormatter) return;
    const now = new Date();
    const value = `${timeFormatter.format(now)} EAT`;
    $$("[data-local-time]").forEach((element) => {
      element.textContent = value;
      element.setAttribute("datetime", now.toISOString());
    });
  }

  updateTime();
  window.setInterval(updateTime, 30000);

  $$("[data-year]").forEach((element) => {
    element.textContent = String(new Date().getFullYear());
  });
})();
