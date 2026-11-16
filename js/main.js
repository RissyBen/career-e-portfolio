(() => {
  'use strict';

  const body = document.body;

  // ---------------------------------------------------------------------------
  // 1. Mobile Navigation Drawer
  // ---------------------------------------------------------------------------
  const navToggle = document.getElementById('nav-toggle');
  const primaryNav = document.getElementById('primary-nav');

  function setNavOpen(isOpen) {
    if (!navToggle || !primaryNav) return;
    primaryNav.classList.toggle('is-open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  }

  if (navToggle && primaryNav) {
    navToggle.addEventListener('click', () => {
      const currentlyOpen = navToggle.getAttribute('aria-expanded') === 'true';
      setNavOpen(!currentlyOpen);
    });

    primaryNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => setNavOpen(false));
    });
  }

  // ---------------------------------------------------------------------------
  // 2. Active Section Scroll-Spy
  // ---------------------------------------------------------------------------
  const navLinks = Array.from(document.querySelectorAll('.nav-link'));
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  function updateActiveNav() {
    if (!sections.length) return;
    if (window.scrollY < 160) {
      navLinks.forEach((link) => link.classList.remove('is-active'));
      return;
    }
    const offset = window.scrollY + 140;
    let currentId = sections[0].id;
    sections.forEach((sec) => {
      if (sec.offsetTop <= offset) {
        currentId = sec.id;
      }
    });
    navLinks.forEach((link) => {
      link.classList.toggle('is-active', link.getAttribute('href') === `#${currentId}`);
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();

  // ---------------------------------------------------------------------------
  // 3. Work & Academic Samples Filter
  // ---------------------------------------------------------------------------
  const filterBtns = Array.from(document.querySelectorAll('.filter-btn'));
  const workCards = Array.from(document.querySelectorAll('.work-card'));

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.filter;
      filterBtns.forEach((b) => {
        const active = b === btn;
        b.classList.toggle('is-active', active);
        b.setAttribute('aria-selected', String(active));
      });

      workCards.forEach((card) => {
        const show = target === 'all' || card.dataset.category === target;
        card.classList.toggle('is-hidden', !show);
        if (show) card.classList.add('is-visible');
      });
    });
  });

  // ---------------------------------------------------------------------------
  // 4. Organization Progression Switcher
  // ---------------------------------------------------------------------------
  const orgTabs = Array.from(document.querySelectorAll('.org-tab'));
  const orgPanels = Array.from(document.querySelectorAll('.org-panel'));

  orgTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const targetOrg = tab.dataset.org;
      orgTabs.forEach((t) => {
        const active = t === tab;
        t.classList.toggle('is-active', active);
        t.setAttribute('aria-selected', String(active));
      });

      orgPanels.forEach((panel) => {
        const isMatch = panel.id === `panel-${targetOrg}`;
        panel.classList.toggle('is-active', isMatch);
        panel.hidden = !isMatch;
      });
    });
  });

  // ---------------------------------------------------------------------------
  // 5. SAS3000 Rubric Accordion
  // ---------------------------------------------------------------------------
  const accordionTriggers = Array.from(document.querySelectorAll('.accordion-trigger'));

  accordionTriggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const item = trigger.closest('.accordion-item');
      if (!item) return;
      const isOpen = item.classList.contains('is-open');

      item.classList.toggle('is-open', !isOpen);
      trigger.setAttribute('aria-expanded', String(!isOpen));
    });
  });

  // ---------------------------------------------------------------------------
  // 6. Photo Lightbox Modal
  // ---------------------------------------------------------------------------
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');
  let lastTrigger = null;

  function openLightbox(src, alt, caption, triggerEl) {
    if (!lightbox || !lightboxImg || !lightboxCaption) return;
    lastTrigger = triggerEl || null;
    lightboxImg.src = src;
    lightboxImg.alt = alt || caption || 'Expanded photo';
    lightboxCaption.textContent = caption || '';
    lightbox.hidden = false;
    body.style.overflow = 'hidden';
    if (lightboxClose) lightboxClose.focus();
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.hidden = true;
    body.style.overflow = '';
    if (lightboxImg) lightboxImg.src = '';
    if (lastTrigger) {
      lastTrigger.focus();
      lastTrigger = null;
    }
  }

  document.querySelectorAll('.lightbox-trigger').forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const img = trigger.querySelector('img');
      openLightbox(
        trigger.dataset.img || (img ? img.src : ''),
        img ? img.alt : '',
        trigger.dataset.caption || '',
        trigger
      );
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  document.querySelectorAll('[data-close-lightbox]').forEach((el) => {
    el.addEventListener('click', closeLightbox);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (lightbox && !lightbox.hidden) closeLightbox();
      if (navToggle && navToggle.getAttribute('aria-expanded') === 'true') setNavOpen(false);
    }
  });

  // ---------------------------------------------------------------------------
  // 7. Copy to Clipboard & Toast
  // ---------------------------------------------------------------------------
  const toast = document.getElementById('toast');
  let toastTimer = null;

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.hidden = true;
    }, 2400);
  }

  async function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return;
    }
    const helper = document.createElement('textarea');
    helper.value = text;
    helper.setAttribute('readonly', '');
    helper.style.position = 'fixed';
    helper.style.opacity = '0';
    document.body.appendChild(helper);
    helper.select();
    document.execCommand('copy');
    document.body.removeChild(helper);
  }

  document.querySelectorAll('[data-copy]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const value = btn.dataset.copy;
      if (!value) return;
      try {
        await copyText(value);
        showToast(`Copied: ${value}`);
      } catch {
        showToast(`Contact: ${value}`);
      }
    });
  });

  // ---------------------------------------------------------------------------
  // 8. Print / Save Summary
  // ---------------------------------------------------------------------------
  const printBtn = document.getElementById('print-portfolio');
  if (printBtn) {
    printBtn.addEventListener('click', () => window.print());
  }

  // ---------------------------------------------------------------------------
  // 9. Reveal on Scroll
  // ---------------------------------------------------------------------------
  const revealNodes = Array.from(document.querySelectorAll('.reveal'));

  if ('IntersectionObserver' in window && revealNodes.length) {
    document.documentElement.classList.add('js-ready');

    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.01, rootMargin: '60px 0px' }
    );

    revealNodes.forEach((node) => {
      const rect = node.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.95) {
        node.classList.add('is-visible');
      } else {
        revealObserver.observe(node);
      }
    });
  }
})();
