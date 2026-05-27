/**
 * FACINPRO - Site Institucional
 * JavaScript principal: navegação, animações, contadores e sliders
 */

(function () {
  'use strict';

  /* ========== DOM Ready ========== */
  document.addEventListener('DOMContentLoaded', init);

  /* Fallback global para imagens */
  document.addEventListener(
    'error',
    (e) => {
      const img = e.target;
      if (img.tagName === 'IMG' && !img.dataset.fallbackApplied) {
        img.dataset.fallbackApplied = '1';
        const fallback = img.dataset.fallback || 'assets/img/course-1.jpg';
        if (img.src.indexOf(fallback) === -1) img.src = fallback;
      }
    },
    true
  );

  function init() {
    initPreloader();
    initHeader();
    initMobileMenu();
    initSmoothScroll();
    initCounters();
    initCourseTabs();
    initSwipers();
    initNewsletter();
    initContactForm();
    initAOS();
    initBackToTop();
    initProgressBars();
  }

  /* ========== Progress Bars ========== */
  function initProgressBars() {
    const bars = document.querySelectorAll('.progress-item__fill');
    if (!bars.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const progress = entry.target.style.getPropertyValue('--progress') || '0%';
            entry.target.style.width = progress;
          }
        });
      },
      { threshold: 0.3 }
    );

    bars.forEach((bar) => observer.observe(bar));
  }

  /* ========== Preloader ========== */
  function initPreloader() {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;

    window.addEventListener('load', () => {
      preloader.classList.add('preloader--hidden');
      setTimeout(() => preloader.remove(), 600);
    });
  }

  /* ========== Header Sticky & Scroll ========== */
  function initHeader() {
    const header = document.querySelector('.site-header');
    const topbar = document.querySelector('.topbar');
    if (!header) return;

    const scrollThreshold = 80;

    const onScroll = () => {
      const scrolled = window.scrollY > scrollThreshold;
      header.classList.toggle('site-header--sticky', scrolled);
      if (topbar) {
        topbar.classList.toggle('topbar--hidden', scrolled);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ========== Mobile Menu ========== */
  function initMobileMenu() {
    const toggle = document.querySelector('.nav-toggle');
    const nav = document.querySelector('.main-nav');
    const overlay = document.querySelector('.nav-overlay');
    const links = document.querySelectorAll('.main-nav__link');

    if (!toggle || !nav) return;

    const closeMenu = () => {
      toggle.classList.remove('nav-toggle--active');
      nav.classList.remove('main-nav--open');
      document.body.classList.remove('menu-open');
      toggle.setAttribute('aria-expanded', 'false');
    };

    const openMenu = () => {
      toggle.classList.add('nav-toggle--active');
      nav.classList.add('main-nav--open');
      document.body.classList.add('menu-open');
      toggle.setAttribute('aria-expanded', 'true');
    };

    toggle.addEventListener('click', () => {
      if (nav.classList.contains('main-nav--open')) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    overlay?.addEventListener('click', closeMenu);
    links.forEach((link) => link.addEventListener('click', closeMenu));

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMenu();
    });
  }

  /* ========== Smooth Scroll ========== */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (!targetId || targetId === '#') return;

        const target = document.querySelector(targetId);
        if (!target) return;

        e.preventDefault();
        const headerOffset = document.querySelector('.site-header')?.offsetHeight || 0;
        const topbarHeight = document.querySelector('.topbar:not(.topbar--hidden)')?.offsetHeight || 0;
        const offset = headerOffset + (window.scrollY > 80 ? 0 : topbarHeight);

        window.scrollTo({
          top: target.getBoundingClientRect().top + window.scrollY - offset - 10,
          behavior: 'smooth',
        });
      });
    });
  }

  /* ========== Animated Counters ========== */
  function initCounters() {
    const counters = document.querySelectorAll('[data-counter]');
    if (!counters.length) return;

    const animateCounter = (el) => {
      const target = parseInt(el.getAttribute('data-counter'), 10);
      const suffix = el.getAttribute('data-suffix') || '';
      const prefix = el.getAttribute('data-prefix') || '';
      const duration = 2000;
      const start = performance.now();

      const update = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = Math.floor(eased * target);
        el.textContent = prefix + value.toLocaleString('pt-BR') + suffix;
        if (progress < 1) requestAnimationFrame(update);
        else el.textContent = prefix + target.toLocaleString('pt-BR') + suffix;
      };

      requestAnimationFrame(update);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !entry.target.dataset.counted) {
            entry.target.dataset.counted = 'true';
            animateCounter(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    counters.forEach((c) => observer.observe(c));
  }

  /* ========== Course Tabs ========== */
  function initCourseTabs() {
    const tabs = document.querySelectorAll('[data-course-tab]');
    const panels = document.querySelectorAll('[data-course-panel]');

    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const target = tab.getAttribute('data-course-tab');

        tabs.forEach((t) => t.classList.remove('course-tabs__btn--active'));
        tab.classList.add('course-tabs__btn--active');

        panels.forEach((panel) => {
          const isActive = panel.getAttribute('data-course-panel') === target;
          panel.classList.toggle('course-panel--active', isActive);
          panel.hidden = !isActive;
        });
      });
    });
  }

  /* ========== Swiper Sliders ========== */
  function initSwipers() {
    if (typeof Swiper === 'undefined') return;

    /* Depoimentos */
    const testimonialEl = document.querySelector('.testimonial-swiper');
    if (testimonialEl) {
      new Swiper('.testimonial-swiper', {
        slidesPerView: 1,
        spaceBetween: 0,
        loop: true,
        autoHeight: true,
        autoplay: {
          delay: 6000,
          disableOnInteraction: false,
        },
        speed: 600,
        pagination: {
          el: '.testimonials__pagination',
          clickable: true,
        },
        navigation: {
          nextEl: '.testimonial-nav__next',
          prevEl: '.testimonial-nav__prev',
        },
        observer: true,
        observeParents: true,
      });
    }

    /* Formas de ingresso */
    const ingressoEl = document.querySelector('.ingresso-swiper');
    if (ingressoEl) {
      new Swiper('.ingresso-swiper', {
        slidesPerView: 1,
        spaceBetween: 24,
        loop: true,
        autoplay: { delay: 5000 },
        pagination: {
          el: '.ingresso-swiper-pagination',
          clickable: true,
        },
        breakpoints: {
          576: { slidesPerView: 2 },
          992: { slidesPerView: 3 },
        },
      });
    }
  }

  /* ========== AOS ========== */
  function initAOS() {
    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 800,
        easing: 'ease-out-cubic',
        once: true,
        offset: 80,
        disable: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      });
    }
  }

  /* ========== Newsletter ========== */
  function initNewsletter() {
    const form = document.getElementById('newsletter-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = form.querySelector('input[type="email"]');
      if (email?.value) {
        showToast('Obrigado! Você foi inscrito na nossa newsletter.');
        form.reset();
      }
    });
  }

  /* ========== Contact Form ========== */
  function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('Mensagem enviada! Entraremos em contato em até 24 horas.');
      form.reset();
    });
  }

  /* ========== Toast Notification ========== */
  function showToast(message) {
    let toast = document.querySelector('.toast-notification');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast-notification';
      toast.setAttribute('role', 'alert');
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('toast-notification--visible');
    setTimeout(() => toast.classList.remove('toast-notification--visible'), 4000);
  }

  /* ========== Back to Top ========== */
  function initBackToTop() {
    const btn = document.querySelector('.back-to-top');
    if (!btn) return;

    window.addEventListener(
      'scroll',
      () => {
        btn.classList.toggle('back-to-top--visible', window.scrollY > 500);
      },
      { passive: true }
    );

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ========== Parallax Hero (leve) ========== */
  const heroShapes = document.querySelectorAll('.hero__shape');
  if (heroShapes.length && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.addEventListener(
      'scroll',
      () => {
        const scroll = window.scrollY;
        heroShapes.forEach((shape, i) => {
          const speed = 0.05 + i * 0.02;
          shape.style.transform = `translateY(${scroll * speed}px)`;
        });
      },
      { passive: true }
    );
  }
})();
