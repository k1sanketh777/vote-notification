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

        counter.innerText = `${value}+`;

        if (progress < 1) {
          requestAnimationFrame(animateCount);
        } else {
          counter.innerText = `${target}+`;
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
    "#about .about-title, #about .about-text, #about .stats-row .stat-item, .showcase-title, .service-card, .team-slide .team-card, .team-dots, .site-footer .footer-brand, .site-footer .footer-contact, .footer-copy",
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

  const teamCarousel = document.querySelector(".team-carousel");
  const slides = document.querySelectorAll(".team-slide");
  const dots = document.querySelectorAll(".team-dots .dot");

  if (teamCarousel && slides.length && dots.length) {
    const setActiveSlide = (index) => {
      const safeIndex = Math.max(0, Math.min(index, slides.length - 1));
      teamCarousel.style.transform = `translateX(-${safeIndex * 100}%)`;

      dots.forEach((dot, dotIndex) => {
        dot.classList.toggle("active", dotIndex === safeIndex);
      });
    };

    dots.forEach((dot) => {
      dot.addEventListener("click", () => {
        const slideIndex = Number(dot.dataset.slide || 0);
        setActiveSlide(slideIndex);
      });
    });

    setActiveSlide(0);
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
});