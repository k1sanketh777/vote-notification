window.tailwind = window.tailwind || {};
window.tailwind.config = {
  theme: {
    extend: {
      colors: {
        "ms-navy": "#061B31",
      },
      fontFamily: {
        greater: ['"GreaterTheory"', "serif"],
      },
    },
  },
};

document.addEventListener("DOMContentLoaded", () => {
  // 1. Menu Toggle Logic (Consolidated)
  const menuToggle = document.getElementById('menuToggle');
  const mainNav = document.getElementById('mainNav');
  const header = document.querySelector('header');

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

  // 2. Counter Logic with Easing
  const counts = document.querySelectorAll(".count");
  let countersAnimated = false;

  const animateCounters = () => {
    if (countersAnimated || !counts.length) {
      return;
    }

    countersAnimated = true;
    counts.forEach((counter) => {
      const target = Number(counter.dataset.target || 0);
      const duration = 1200;
      const startTime = performance.now();

      const animateCount = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = Math.floor(target * eased);
        const suffix = counter.dataset.suffix || "+";

        counter.innerText = `${value}${suffix}`;

        if (progress < 1) {
          requestAnimationFrame(animateCount);
        } else {
          counter.innerText = `${target}${suffix}`;
        }
      };

      requestAnimationFrame(animateCount);
    });
  };

  const heroSection = document.querySelector("#home");
  const socialBox = document.querySelector("#home .social-glass");
  const aboutSection = document.querySelector("#about");

  const updateAboutOverlap = () => {
    // Overlap removed — about section sits naturally below hero
    if (aboutSection) {
      aboutSection.style.marginTop = '0px';
    }
  };

  updateAboutOverlap();
  window.addEventListener("resize", updateAboutOverlap);

  // 3. Reveal Elements with Smooth Intersection Observer
  const revealTargets = document.querySelectorAll(
    "#about .about-title, #about .about-text, #about .stats-row .stat-item, .showcase-title, .service-card, .desktop-carousel .team-slide .team-card, .mobile-snap-card, .team-dots, .site-footer .footer-brand, .site-footer .footer-contact, .footer-copy",
  );
  revealTargets.forEach((element) => {
    element.classList.add("reveal-up");
  });

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.16, rootMargin: "0px 0px -8% 0px" },
  );

  revealTargets.forEach((element) => revealObserver.observe(element));

  if (aboutSection) {
    const aboutObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounters();
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.35 },
    );

    aboutObserver.observe(aboutSection);
  }

  // About section scroll reveal
  if (aboutSection) {
    const revealAbout = () => {
      const rect = aboutSection.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.88) {
        aboutSection.classList.add('is-visible');
        document.body.removeEventListener('scroll', revealAbout);
      }
    };
    document.body.addEventListener('scroll', revealAbout, { passive: true });
    revealAbout();
  }

  // 4. Desktop Carousel
  const teamCarousel = document.querySelector(".desktop-carousel");
  const slides = document.querySelectorAll(".desktop-carousel .team-slide");
  const dots = document.querySelectorAll(".desktop-dots .dot");

  if (teamCarousel && slides.length && dots.length) {
    const setActiveSlide = (index) => {
      const safeIndex = Math.max(0, Math.min(index, slides.length - 1));
      teamCarousel.style.transform = `translateX(-${safeIndex * 100}%)`;
      dots.forEach((dot, i) => dot.classList.toggle("active", i === safeIndex));
    };
    dots.forEach((dot) => {
      dot.addEventListener("click", () => setActiveSlide(Number(dot.dataset.slide || 0)));
    });
    setActiveSlide(0);
  }

  // 5. Team Carousel Pop-up / Scroll Effect
  const teamContainer = document.querySelector('.team-carousel');
  const mainTeamCards = document.querySelectorAll('.team-slide-main .team-card');

  if (teamContainer && mainTeamCards.length) {
      const handleTeamScroll = () => {
          const containerCenter = teamContainer.scrollLeft + (teamContainer.offsetWidth / 2);
          mainTeamCards.forEach(card => {
              const cardCenter = card.offsetLeft + (card.offsetWidth / 2);
              const distance = Math.abs(containerCenter - cardCenter);
              if (distance < card.offsetWidth / 2) {
                  card.classList.add('is-center');
              } else {
                  card.classList.remove('is-center');
              }
          });
      };
      teamContainer.addEventListener('scroll', handleTeamScroll);
      handleTeamScroll();
  }

  // 6. Mobile Snap-scroll Carousel
  const snapTrack = document.getElementById("mobileSnapTrack");
  const snapCards = snapTrack ? Array.from(snapTrack.querySelectorAll(".mobile-snap-card")) : [];
  const snapDots = Array.from(document.querySelectorAll("#mobileSnapDots .dot"));

  if (snapTrack && snapCards.length) {

    const getCenterCard = () => {
      const trackRect = snapTrack.getBoundingClientRect();
      const trackCenter = trackRect.left + trackRect.width / 2;
      let closestCard = null;
      let closestDist = Infinity;
      snapCards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const cardCenter = rect.left + rect.width / 2;
        const dist = Math.abs(trackCenter - cardCenter);
        if (dist < closestDist) { closestDist = dist; closestCard = card; }
      });
      return closestCard;
    };

    const updateActiveCard = () => {
      const closestCard = getCenterCard();
      if (closestCard) {
        snapCards.forEach((c) => c.classList.remove("is-active"));
        closestCard.classList.add("is-active");
        const idx = Number(closestCard.dataset.index || 0);
        snapDots.forEach((d, i) => d.classList.toggle("active", i === idx));
      }
    };

    const snapToCenter = () => {
      const closestCard = getCenterCard();
      if (!closestCard) return;
      const trackRect = snapTrack.getBoundingClientRect();
      const cardRect = closestCard.getBoundingClientRect();
      const offset = (cardRect.left + cardRect.width / 2) - (trackRect.left + trackRect.width / 2);
      snapTrack.scrollBy({ left: offset, behavior: "smooth" });
      snapCards.forEach((c) => c.classList.remove("is-active"));
      closestCard.classList.add("is-active");
      const idx = Number(closestCard.dataset.index || 0);
      snapDots.forEach((d, i) => d.classList.toggle("active", i === idx));
    };

    let snapTimer;
    snapTrack.addEventListener("scroll", () => {
      updateActiveCard();
      clearTimeout(snapTimer);
      snapTimer = setTimeout(snapToCenter, 80);
    }, { passive: true });

    setTimeout(snapToCenter, 120);

    snapDots.forEach((dot) => {
      dot.addEventListener("click", () => {
        const idx = Number(dot.dataset.card || 0);
        const target = snapCards[idx];
        if (!target) return;
        const trackRect = snapTrack.getBoundingClientRect();
        const cardRect = target.getBoundingClientRect();
        const offset = (cardRect.left + cardRect.width / 2) - (trackRect.left + trackRect.width / 2);
        snapTrack.scrollBy({ left: offset, behavior: "smooth" });
      });
    });
  }

  // 7. Smooth Scrolling Navigation (Eased Cubic-Bezier)
  const easeInOutCubic = (t) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  const smoothScrollTo = (targetY, duration = 900) => {
      const scroller = document.body;
      const startY = scroller.scrollTop;
      const distance = targetY - startY;
      const startTime = performance.now();

      const step = (now) => {
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased = easeInOutCubic(progress);
          scroller.scrollTop = startY + distance * eased;
          if (progress < 1) requestAnimationFrame(step);
      };

      requestAnimationFrame(step);
  };

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener('click', (e) => {
          const id = link.getAttribute('href').slice(1);
          const target = document.getElementById(id);
          if (!target) return;
          e.preventDefault();

          if (mainNav) {
              mainNav.classList.remove('active');
              if (menuToggle) menuToggle.classList.remove('active');
          }

          if (header) {
              header.style.transform = 'translateY(0)';
              header.style.opacity = '1';
          }

          const headerHeight = header ? header.offsetHeight : 0;
          const targetY = target.getBoundingClientRect().top + document.body.scrollTop - headerHeight;
          smoothScrollTo(targetY, 900);
      });
  });

  // 9. Smooth momentum wheel scrolling
  (() => {
    let current = 0;
    let target = 0;
    const ease = 0.09;
    let rafId = null;

    const scroller = document.body;

    // Parallax elements
    const heroImg    = document.querySelector('.hero-image');
    const heroInner  = document.querySelector('.hero-inner');

    const applyParallax = (scrollY) => {
      if (heroImg) {
        heroImg.style.transform = `translateY(${scrollY * 0.45}px)`;
      }

      if (heroInner) {
        const fadeProgress = Math.min(scrollY / 380, 1);
        heroInner.style.transform = `translateY(${scrollY * 0.2}px)`;
        heroInner.style.opacity   = String(Math.max(0, 1 - fadeProgress * 1.3));
      }
    };

    const update = () => {
      current += (target - current) * ease;
      const diff = Math.abs(target - current);
      scroller.scrollTop = Math.round(current);
      applyParallax(Math.round(current));
      if (diff > 0.5) {
        rafId = requestAnimationFrame(update);
      } else {
        scroller.scrollTop = target;
        applyParallax(target);
        rafId = null;
      }
    };

    window.addEventListener('wheel', (e) => {
      e.preventDefault();
      target = Math.max(0, Math.min(
        target + e.deltaY,
        scroller.scrollHeight - scroller.clientHeight
      ));
      if (!rafId) {
        current = scroller.scrollTop;
        rafId = requestAnimationFrame(update);
      }
    }, { passive: false });

    // Also run on touch/mobile scroll
    scroller.addEventListener('scroll', () => {
      applyParallax(scroller.scrollTop);
    }, { passive: true });

    // Init
    applyParallax(0);
  })();
  if (header) {
    let lastScrollY = document.body.scrollTop;
    let ticking = false;

    document.body.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const currentScrollY = document.body.scrollTop;
          const diff = currentScrollY - lastScrollY;

          if (diff > 0 && currentScrollY > 80) {
            header.style.transform = 'translateY(-100%)';
            header.style.opacity = '0';
          } else if (diff < 0) {
            header.style.transform = 'translateY(0)';
            header.style.opacity = '1';
          }

          lastScrollY = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    });
  }
});
