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
    if (!heroSection || !socialBox || !aboutSection) {
      return;
    }

    const heroRect = heroSection.getBoundingClientRect();
    const socialRect = socialBox.getBoundingClientRect();
    const desiredGap = 370;
    const overlapAmount = Math.max(
      0,
      Math.round(heroRect.bottom - (socialRect.bottom + desiredGap)),
    );

    aboutSection.style.marginTop = `-${overlapAmount}px`;
  };

  updateAboutOverlap();
  window.addEventListener("resize", updateAboutOverlap);

  const revealTargets = document.querySelectorAll(
    "#about .about-title, #about .about-text, #about .stats-row .stat-item, .showcase-title, .service-card, .desktop-carousel .team-slide .team-card, .mobile-snap-card, .team-dots, .site-footer .footer-brand, .site-footer .footer-contact, .footer-copy",
  );
  revealTargets.forEach((element) => element.classList.add("reveal-up"));

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

  // Desktop carousel
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

  // Mobile snap-scroll carousel
  const snapTrack = document.getElementById("mobileSnapTrack");
  const snapCards = snapTrack ? snapTrack.querySelectorAll(".mobile-snap-card") : [];
  const snapDots = document.querySelectorAll("#mobileSnapDots .dot");

  if (snapTrack && snapCards.length) {
    // Mark first card active on load
    snapCards[0].classList.add("is-active");

    // IntersectionObserver: card is "active" when it's ≥60% visible in the track
    const snapObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.intersectionRatio >= 0.6) {
            // Remove active from all
            snapCards.forEach((c) => c.classList.remove("is-active"));
            entry.target.classList.add("is-active");

            // Sync dots
            const idx = Number(entry.target.dataset.index || 0);
            snapDots.forEach((d, i) => d.classList.toggle("active", i === idx));
          }
        });
      },
      { root: snapTrack, threshold: 0.6 }
    );

    snapCards.forEach((card) => snapObserver.observe(card));

    // Dot click: scroll to card
    snapDots.forEach((dot) => {
      dot.addEventListener("click", () => {
        const idx = Number(dot.dataset.card || 0);
        const target = snapTrack.querySelector(`.mobile-snap-card[data-index="${idx}"]`);
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
        }
      });
    });
  }
});

document.addEventListener("DOMContentLoaded", () => {
    // 1. Menu Toggle Logic
    const menuToggle = document.getElementById('menuToggle');
    const mainNav = document.getElementById('mainNav');

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');
        });
    }

    // 2. Team Carousel Pop-up Logic
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
});

document.addEventListener("DOMContentLoaded", () => {
    const toggle = document.getElementById('menuToggle');
    const nav = document.getElementById('mainNav');

    if (toggle && nav) {
        toggle.addEventListener('click', (e) => {
            e.stopPropagation();
            nav.classList.toggle('active');
        });

        document.addEventListener('click', (e) => {
            if (!nav.contains(e.target) && !toggle.contains(e.target)) {
                nav.classList.remove('active');
            }
        });
    }

    // Smooth scroll with custom easing for all anchor links
    const easeInOutCubic = (t) =>
        t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const smoothScrollTo = (targetY, duration = 900) => {
        // scroll on body (since html is overflow:hidden, body scrolls)
        const scroller = document.scrollingElement || document.body;
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

            // Close mobile nav if open
            if (nav) nav.classList.remove('active');

            // Offset for fixed header height
            const headerHeight = document.querySelector('header')?.offsetHeight || 0;
            const scroller = document.scrollingElement || document.body;
            const targetY = target.getBoundingClientRect().top + scroller.scrollTop - headerHeight;

            smoothScrollTo(targetY, 900);
        });
    });
});
