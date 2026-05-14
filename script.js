// =============================================
// CARYO ADMIN PANEL TRIGGER
// =============================================
(function () {
  const SECRET = 'CARYO';
  let buffer = '';
  let resetTimer;

  document.addEventListener('keydown', (e) => {
    const tag = document.activeElement.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || document.activeElement.isContentEditable) return;

    buffer += e.key;
    if (buffer.length > SECRET.length) buffer = buffer.slice(-SECRET.length);

    clearTimeout(resetTimer);
    resetTimer = setTimeout(() => { buffer = ''; }, 1800);

    if (buffer === SECRET) {
      buffer = '';
      window.open('admin.html', '_blank');
    }
  });
})();

window.tailwind = window.tailwind || {};
window.tailwind.config = {
  theme: {
    extend: {
      colors: { "ms-navy": "#061B31" },
      fontFamily: { greater: ['"GreaterTheory"', "serif"] },
    },
  },
};


// =============================================
// PRELOADER
// =============================================
(function () {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;

  document.body.style.overflow = 'hidden';

  const startTime = Date.now();
  const MIN_DISPLAY = 4000;
  let dismissed = false;

  const dismiss = () => {
    if (dismissed) return;
    dismissed = true;
    preloader.classList.add('fade-out');
    document.body.style.overflow = '';
    preloader.addEventListener('transitionend', () => preloader.remove(), { once: true });
    setTimeout(() => preloader.remove(), 1500);
  };

  const tryDismiss = () => {
    const elapsed = Date.now() - startTime;
    setTimeout(dismiss, Math.max(0, MIN_DISPLAY - elapsed));
  };

  if (document.readyState === 'complete') tryDismiss();
  else window.addEventListener('load', tryDismiss, { once: true });

  setTimeout(dismiss, 10000);
})();


document.addEventListener("DOMContentLoaded", () => {

  const menuToggle = document.getElementById('menuToggle');
  const mainNav    = document.getElementById('mainNav');
  const header     = document.querySelector('header');
  const scroller   = document.body;

  // =============================================
  // UNIFIED MOMENTUM SCROLL ENGINE
  // Wheel events AND nav/anchor clicks both drive
  // the same target variable — no conflicts.
  // =============================================
  let scrollCurrent = scroller.scrollTop;
  let scrollTarget  = scroller.scrollTop;
  let rafId         = null;
  const EASE        = 0.09;

  const heroImg   = document.querySelector('.hero-image');
  const heroInner = document.querySelector('.hero-inner');

  const applyParallax = (y) => {
    if (heroImg) heroImg.style.transform = `translateY(${y * 0.45}px)`;
    if (heroInner) {
      const fade = Math.min(y / 380, 1);
      heroInner.style.transform = `translateY(${y * 0.2}px)`;
      heroInner.style.opacity   = String(Math.max(0, 1 - fade * 1.3));
    }
  };

  const clamp = (v) => Math.max(0, Math.min(v, scroller.scrollHeight - scroller.clientHeight));

  const tick = () => {
    scrollCurrent += (scrollTarget - scrollCurrent) * EASE;
    const diff = Math.abs(scrollTarget - scrollCurrent);
    const y    = Math.round(scrollCurrent);
    scroller.scrollTop = y;
    applyParallax(y);
    if (diff > 0.5) {
      rafId = requestAnimationFrame(tick);
    } else {
      scroller.scrollTop = scrollTarget;
      applyParallax(scrollTarget);
      rafId = null;
    }
  };

  // Smooth scroll to an absolute Y position (nav clicks, anchor links)
  const smoothScrollTo = (targetY) => {
    scrollCurrent = scroller.scrollTop; // re-sync so we start from real position
    scrollTarget  = clamp(targetY);
    if (!rafId) rafId = requestAnimationFrame(tick);
  };

  // Wheel — add delta to running target for momentum feel
  window.addEventListener('wheel', (e) => {
    e.preventDefault();
    if (!rafId) scrollCurrent = scroller.scrollTop; // re-sync if engine was idle
    scrollTarget = clamp(scrollTarget + e.deltaY);
    if (!rafId) rafId = requestAnimationFrame(tick);
  }, { passive: false });

  // Touch/mobile: native scroll handles itself, just keep parallax in sync
  scroller.addEventListener('scroll', () => {
    if (!rafId) applyParallax(scroller.scrollTop);
  }, { passive: true });

  applyParallax(0);


  // =============================================
  // 1. MENU TOGGLE
  // =============================================
  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = mainNav.classList.toggle('active');
      menuToggle.classList.toggle('active', isOpen);
    });
    document.addEventListener('click', (e) => {
      if (!mainNav.contains(e.target) && !menuToggle.contains(e.target)) {
        mainNav.classList.remove('active');
        menuToggle.classList.remove('active');
      }
    });
  }


  // =============================================
  // 2. COUNTER ANIMATION
  // =============================================
  const counts = document.querySelectorAll(".count");
  let countersAnimated = false;

  const animateCounters = () => {
    if (countersAnimated || !counts.length) return;
    countersAnimated = true;
    counts.forEach((counter) => {
      const target   = Number(counter.dataset.target || 0);
      const duration = 1200;
      const t0       = performance.now();
      const animate  = (now) => {
        const progress = Math.min((now - t0) / duration, 1);
        const eased    = 1 - Math.pow(1 - progress, 3);
        const suffix   = counter.dataset.suffix || "+";
        counter.innerText = `${Math.floor(target * eased)}${suffix}`;
        if (progress < 1) requestAnimationFrame(animate);
        else counter.innerText = `${target}${suffix}`;
      };
      requestAnimationFrame(animate);
    });
  };


  // =============================================
  // 3. REVEAL ON SCROLL
  // =============================================
  const aboutSection = document.querySelector("#about");

  if (aboutSection) {
    aboutSection.style.marginTop = '0px';
    window.addEventListener("resize", () => { aboutSection.style.marginTop = '0px'; });
  }

  const revealTargets = document.querySelectorAll(
    "#about .about-title, #about .about-text, #about .stats-row .stat-item, .showcase-title, .service-card, .desktop-carousel .team-slide .team-card, .mobile-snap-card, .team-dots, .site-footer .footer-brand, .site-footer .footer-contact, .footer-copy"
  );
  revealTargets.forEach((el) => el.classList.add("reveal-up"));

  const revealObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
  );
  revealTargets.forEach((el) => revealObserver.observe(el));

  if (aboutSection) {
    new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) { animateCounters(); obs.unobserve(entry.target); }
        });
      },
      { threshold: 0.35 }
    ).observe(aboutSection);

    const revealAbout = () => {
      if (aboutSection.getBoundingClientRect().top < window.innerHeight * 0.88) {
        aboutSection.classList.add('is-visible');
        scroller.removeEventListener('scroll', revealAbout);
      }
    };
    scroller.addEventListener('scroll', revealAbout, { passive: true });
    revealAbout();
  }


  // =============================================
  // 4. DESKTOP CAROUSEL
  // =============================================
  const teamCarousel = document.querySelector(".desktop-carousel");
  const slides       = document.querySelectorAll(".desktop-carousel .team-slide");
  const dots         = document.querySelectorAll(".desktop-dots .dot");

  if (teamCarousel && slides.length && dots.length) {
    let currentSlide = 0;

    const setActiveSlide = (index) => {
      currentSlide = Math.max(0, Math.min(index, slides.length - 1));
      teamCarousel.style.transform = `translateX(-${currentSlide * 100}%)`;
      dots.forEach((dot, i) => dot.classList.toggle("active", i === currentSlide));
    };

    dots.forEach((dot) =>
      dot.addEventListener("click", () => setActiveSlide(Number(dot.dataset.slide || 0)))
    );
    setActiveSlide(0);

    const carouselWrap = document.querySelector(".team-carousel-wrap");
    const prevBtn      = document.getElementById("carouselPrev");
    const nextBtn      = document.getElementById("carouselNext");

    if (carouselWrap && prevBtn && nextBtn) {
      carouselWrap.addEventListener("mousemove", (e) => {
        const rect     = carouselWrap.getBoundingClientRect();
        const x        = e.clientX - rect.left;
        const edgeZone = rect.width * 0.2;
        prevBtn.classList.toggle("edge-active", x < edgeZone);
        nextBtn.classList.toggle("edge-active", x > rect.width - edgeZone);
      });
      carouselWrap.addEventListener("mouseleave", () => {
        prevBtn.classList.remove("edge-active");
        nextBtn.classList.remove("edge-active");
      });
      prevBtn.addEventListener("click", () => setActiveSlide(currentSlide - 1));
      nextBtn.addEventListener("click", () => setActiveSlide(currentSlide + 1));
    }
  }


  // =============================================
  // 5. TEAM CARD CENTER EFFECT
  // =============================================
  const teamContainer = document.querySelector('.team-carousel');
  const mainTeamCards = document.querySelectorAll('.team-slide-main .team-card');

  if (teamContainer && mainTeamCards.length) {
    const handleTeamScroll = () => {
      const center = teamContainer.scrollLeft + teamContainer.offsetWidth / 2;
      mainTeamCards.forEach(card => {
        card.classList.toggle('is-center',
          Math.abs((card.offsetLeft + card.offsetWidth / 2) - center) < card.offsetWidth / 2
        );
      });
    };
    teamContainer.addEventListener('scroll', handleTeamScroll);
    handleTeamScroll();
  }


  // =============================================
  // 6. MOBILE SNAP-SCROLL CAROUSEL
  // =============================================
  const snapTrack = document.getElementById("mobileSnapTrack");
  const snapCards = snapTrack ? Array.from(snapTrack.querySelectorAll(".mobile-snap-card")) : [];
  const snapDots  = Array.from(document.querySelectorAll("#mobileSnapDots .dot"));

  if (snapTrack && snapCards.length) {
    const getCenterCard = () => {
      const cx = snapTrack.getBoundingClientRect().left + snapTrack.getBoundingClientRect().width / 2;
      let closest = null, closestDist = Infinity;
      snapCards.forEach((card) => {
        const r    = card.getBoundingClientRect();
        const dist = Math.abs((r.left + r.width / 2) - cx);
        if (dist < closestDist) { closestDist = dist; closest = card; }
      });
      return closest;
    };

    const updateActive = () => {
      const card = getCenterCard();
      if (!card) return;
      snapCards.forEach((c) => c.classList.remove("is-active"));
      card.classList.add("is-active");
      const idx = Number(card.dataset.index || 0);
      snapDots.forEach((d, i) => d.classList.toggle("active", i === idx));
    };

    const snapToCenter = () => {
      const card = getCenterCard();
      if (!card) return;
      const tr  = snapTrack.getBoundingClientRect();
      const cr  = card.getBoundingClientRect();
      snapTrack.scrollBy({ left: (cr.left + cr.width / 2) - (tr.left + tr.width / 2), behavior: "smooth" });
      updateActive();
    };

    let snapTimer;
    snapTrack.addEventListener("scroll", () => {
      updateActive();
      clearTimeout(snapTimer);
      snapTimer = setTimeout(snapToCenter, 80);
    }, { passive: true });

    setTimeout(snapToCenter, 120);

    snapDots.forEach((dot) => {
      dot.addEventListener("click", () => {
        const card = snapCards[Number(dot.dataset.card || 0)];
        if (!card) return;
        const tr = snapTrack.getBoundingClientRect();
        const cr = card.getBoundingClientRect();
        snapTrack.scrollBy({ left: (cr.left + cr.width / 2) - (tr.left + tr.width / 2), behavior: "smooth" });
      });
    });
  }


  // =============================================
  // 7. NAV / ANCHOR SMOOTH SCROLL
  // Drives through the unified engine above —
  // works perfectly alongside wheel momentum.
  // =============================================
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;

    const id     = link.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();

    if (mainNav)    mainNav.classList.remove('active');
    if (menuToggle) menuToggle.classList.remove('active');
    if (header) {
      header.style.transform = 'translateY(0)';
      header.style.opacity   = '1';
    }

    const headerHeight = header ? header.offsetHeight : 0;
    smoothScrollTo(target.getBoundingClientRect().top + scroller.scrollTop - headerHeight);
  });


  // =============================================
  // 8. HEADER HIDE / SHOW ON SCROLL
  // =============================================
  if (header) {
    let lastScrollY = scroller.scrollTop;
    let ticking     = false;

    scroller.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const currentScrollY = scroller.scrollTop;
          const diff           = currentScrollY - lastScrollY;
          if (diff > 0 && currentScrollY > 80) {
            header.style.transform = 'translateY(-100%)';
            header.style.opacity   = '0';
          } else if (diff < 0) {
            header.style.transform = 'translateY(0)';
            header.style.opacity   = '1';
          }
          lastScrollY = currentScrollY;
          ticking     = false;
        });
        ticking = true;
      }
    });
  }

});
