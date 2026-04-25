/* ================================================================
   בלה Boutique Cafe — Shared Script
   ================================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- Navbar scroll state ---- */
  const navbar = document.getElementById('navbar');
  if (navbar) {
    const heroEl = document.querySelector('.hero, .page-hero');
    const updateNav = () => {
      if (window.scrollY > 60) {
        navbar.classList.add('scrolled');
        navbar.classList.remove('transparent');
      } else {
        navbar.classList.remove('scrolled');
        if (heroEl) navbar.classList.add('transparent');
      }
    };
    window.addEventListener('scroll', updateNav, { passive: true });
    updateNav();
  }

  /* ---- Mobile menu toggle ---- */
  const toggle   = document.getElementById('navToggle');
  const mobileNav = document.getElementById('navMobile');
  if (toggle && mobileNav) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('open');
      mobileNav.classList.toggle('open');
    });
    mobileNav.querySelectorAll('.nav-link').forEach(l =>
      l.addEventListener('click', () => {
        toggle.classList.remove('open');
        mobileNav.classList.remove('open');
      })
    );
  }

  /* ---- Lenis Smooth Scroll ---- */
  let lenis;
  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }

  /* ---- GSAP Registrations ---- */
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // Sync GSAP and Lenis
    if (lenis) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => { lenis.raf(time * 1000); });
      gsap.ticker.lagSmoothing(0, 0);
    }

    /* ---- Hero Animation ---- */
    const heroBg = document.querySelector('.hero-bg');
    if (heroBg) {
      heroBg.classList.add('loaded');
      
      // Hero Parallax
      gsap.to(heroBg, {
        yPercent: 20,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: true
        }
      });
      
      // Hero Content Entrance
      gsap.from(".hero-content > *", {
        y: 40,
        opacity: 0,
        duration: 1.2,
        stagger: 0.15,
        ease: "power3.out",
        delay: 0.2
      });
    }

    /* ---- Scroll Reveal (GSAP) ---- */
    const revealEls = document.querySelectorAll('.reveal');
    revealEls.forEach((el) => {
      const delay = el.dataset.delay ? parseInt(el.dataset.delay) / 1000 : 0;
      gsap.fromTo(el, 
        { y: 50, autoAlpha: 0 },
        { 
          y: 0, 
          autoAlpha: 1, 
          duration: 1, 
          ease: "power3.out", 
          delay: delay,
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none none"
          }
        }
      );
    });

    const revealLeftEls = document.querySelectorAll('.reveal-left');
    revealLeftEls.forEach((el) => {
      gsap.fromTo(el, 
        { x: -50, autoAlpha: 0 },
        { 
          x: 0, 
          autoAlpha: 1, 
          duration: 1, 
          ease: "power3.out", 
          scrollTrigger: { trigger: el, start: "top 85%" }
        }
      );
    });

    const revealRightEls = document.querySelectorAll('.reveal-right');
    revealRightEls.forEach((el) => {
      gsap.fromTo(el, 
        { x: 50, autoAlpha: 0 },
        { 
          x: 0, 
          autoAlpha: 1, 
          duration: 1, 
          ease: "power3.out", 
          scrollTrigger: { trigger: el, start: "top 85%" }
        }
      );
    });
  }

  /* ---- Contact form ---- */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      contactForm.style.display = 'none';
      document.getElementById('contactSuccess').style.display = 'block';
    });
  }

  /* ---- Reservation form ---- */
  const reserveForm = document.getElementById('reserveForm');
  if (reserveForm) {
    reserveForm.addEventListener('submit', e => {
      e.preventDefault();
      reserveForm.style.display = 'none';
      document.getElementById('reserveSuccess').style.display = 'block';
    });
  }

  /* ---- Newsletter form ---- */
  document.querySelectorAll('.newsletter-form').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const input = form.querySelector('input');
      const btn   = form.querySelector('button');
      btn.textContent = 'נרשמת! ✓';
      btn.style.background = '#4CAF50';
      btn.style.color = 'white';
      input.value = '';
      input.disabled = true;
    });
  });

  /* ---- Lightbox ---- */
  const lightbox   = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  if (lightbox && lightboxImg) {
    document.querySelectorAll('.gallery-item[data-src]').forEach(item => {
      item.addEventListener('click', () => {
        lightboxImg.src = item.dataset.src;
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
    });
    const closeLightbox = () => {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
    };
    document.getElementById('lightboxClose')?.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });
  }

  /* ---- Active nav link ---- */
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ---- Stagger reveal on cards ---- */
  document.querySelectorAll('.cards-grid .card, .values-grid .value-card, .testimonials-grid .testimonial-card').forEach((el, i) => {
    el.dataset.delay = i * 100;
    el.classList.add('reveal');
  });

  /* ---- Date input: min = today ---- */
  const dateInputs = document.querySelectorAll('input[type="date"]');
  if (dateInputs.length) {
    const today = new Date().toISOString().split('T')[0];
    dateInputs.forEach(inp => inp.setAttribute('min', today));
  }

  /* ---- Custom Cursor ---- */
  const cursorDot = document.querySelector('.cursor-dot');
  const cursorRing = document.querySelector('.cursor-ring');
  
  if (cursorDot && cursorRing && window.matchMedia("(pointer: fine)").matches) {
    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      // Dot follows immediately
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    });

    // Ring follows with a slight delay using requestAnimationFrame
    const speed = 0.15;
    function animateCursor() {
      ringX += (mouseX - ringX) * speed;
      ringY += (mouseY - ringY) * speed;
      cursorRing.style.left = `${ringX}px`;
      cursorRing.style.top = `${ringY}px`;
      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover effects on links and buttons
    const interactables = document.querySelectorAll('a, button, input, select, textarea, .card, .menu-item, .gallery-item');
    interactables.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursorDot.classList.add('hovered');
        cursorRing.classList.add('hovered');
      });
      el.addEventListener('mouseleave', () => {
        cursorDot.classList.remove('hovered');
        cursorRing.classList.remove('hovered');
      });
    });
  }

});
