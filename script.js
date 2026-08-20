/* ==========================================================================
Portfolio Script
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------------------------------------------------------------------
     Preloader
  --------------------------------------------------------------------- */
 

window.addEventListener("load", function () {

  const preloader = document.getElementById("preloader");

  if (!preloader) return;

  // Give the animation a little time to display
  setTimeout(() => {

    preloader.classList.add("is-hidden");

    // Remove it completely after the fade-out
    setTimeout(() => {
      preloader.remove();
    }, 800);

  }, 1200);

});
  /* ---------------------------------------------------------------------
     Sticky header + back-to-top visibility
  --------------------------------------------------------------------- */
  const header = document.getElementById('siteHeader');
  const backToTop = document.getElementById('backToTop');

  const sections = ['home', 'about', 'services', 'projects', 'testimonials', 'contact']
    .map(id => document.getElementById(id))
    .filter(Boolean);
  const navLinks = Array.from(document.querySelectorAll('.nav-link'));

  function updateActiveNavLink() {
    const scrollPos = window.scrollY + 140;
    let current = sections[0];
    sections.forEach(sec => {
      if (sec.offsetTop <= scrollPos) current = sec;
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current.id}`);
    });
  }

  const onScroll = () => {
    const scrolled = window.scrollY > 40;
    header.classList.toggle('scrolled', scrolled);
    backToTop.classList.toggle('visible', window.scrollY > 480);
    updateActiveNavLink();
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------------------------------------------------------------------
     Mobile hamburger menu
  --------------------------------------------------------------------- */
  const hamburger = document.getElementById('hamburger');
  const mainNav = document.getElementById('mainNav');

  hamburger.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------------------------------------------------------------------
     Scroll reveal animations (IntersectionObserver)
  --------------------------------------------------------------------- */
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .stats-bar');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  revealEls.forEach(el => {
    // Only hide the element once JS is confirmed running — this is what
    // makes the animation fail-safe if the script doesn't load.
    el.classList.add('pre');
    revealObserver.observe(el);
  });

  /* ---------------------------------------------------------------------
     Typed role rotation in hero
  --------------------------------------------------------------------- */
  const roles = ['EdTech Tutor', 'Frontend Web Developer'];
  const typedEl = document.getElementById('typedRole');
  let roleIndex = 0, charIndex = 0, deleting = false;

  function typeLoop() {
    if (!typedEl) return;
    const current = roles[roleIndex];

    if (!deleting) {
      charIndex++;
      typedEl.textContent = current.slice(0, charIndex);
      if (charIndex === current.length) {
        deleting = true;
        setTimeout(typeLoop, 1400);
        return;
      }
    } else {
      charIndex--;
      typedEl.textContent = current.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
      }
    }
    setTimeout(typeLoop, deleting ? 40 : 80);
  }
  typeLoop();

  /* ---------------------------------------------------------------------
     Animated number counters
  --------------------------------------------------------------------- */
  const counters = document.querySelectorAll('[data-count]');

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-count'), 10) || 0;
    const duration = 1400;
    const start = performance.now();

    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target;
    }
    requestAnimationFrame(step);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });

  counters.forEach(el => counterObserver.observe(el));

  /* ---------------------------------------------------------------------
     Project filters
  --------------------------------------------------------------------- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const match = filter === 'all' || card.getAttribute('data-category') === filter;
        card.classList.toggle('is-hidden', !match);
      });
    });
  });

  /* ---------------------------------------------------------------------
     Testimonial slider
  --------------------------------------------------------------------- */
  const track = document.getElementById('testimonialTrack');
  const cards = track ? Array.from(track.children) : [];
  const dotsWrap = document.getElementById('tDots');
  const prevBtn = document.getElementById('tPrev');
  const nextBtn = document.getElementById('tNext');
  let tIndex = 0;
  let autoSlide;

  cards.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 't-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
    dot.addEventListener('click', () => goToSlide(i));
    dotsWrap.appendChild(dot);
  });
  const dots = Array.from(dotsWrap.children);

  function goToSlide(i) {
    tIndex = (i + cards.length) % cards.length;
    track.style.transform = `translateX(-${tIndex * 100}%)`;
    dots.forEach((d, di) => d.classList.toggle('active', di === tIndex));
    restartAutoSlide();
  }

  function restartAutoSlide() {
    clearInterval(autoSlide);
    autoSlide = setInterval(() => goToSlide(tIndex + 1), 6000);
  }

  if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => goToSlide(tIndex - 1));
    nextBtn.addEventListener('click', () => goToSlide(tIndex + 1));
    restartAutoSlide();
  }

  /* ---------------------------------------------------------------------
     Contact form validation + fake submit
  --------------------------------------------------------------------- */
  const form = document.getElementById('contactForm');
  const successMsg = document.getElementById('formSuccess');

  function setError(group, message) {
    group.classList.toggle('has-error', Boolean(message));
    const errEl = group.querySelector('.error-msg');
    if (errEl) errEl.textContent = message || '';
  }

  function validateField(field) {
    const group = field.closest('.form-group');
    if (!group) return true;

    if (field.hasAttribute('required') && !field.value.trim()) {
      setError(group, 'This field is required.');
      return false;
    }
    if (field.type === 'email' && field.value.trim()) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(field.value.trim())) {
        setError(group, 'Please enter a valid email address.');
        return false;
      }
    }
    setError(group, '');
    return true;
  }

  if (form) {
    form.querySelectorAll('input, textarea').forEach(field => {
      field.addEventListener('blur', () => validateField(field));
      field.addEventListener('input', () => {
        if (field.closest('.form-group').classList.contains('has-error')) {
          validateField(field);
        }
      });
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const fields = Array.from(form.querySelectorAll('input, textarea'));
      const allValid = fields.map(validateField).every(Boolean);
      if (!allValid) return;

      const submitBtn = form.querySelector('.form-submit');
      submitBtn.classList.add('loading');
      submitBtn.disabled = true;

      // Simulated submission (replace with real endpoint / API call)
      setTimeout(() => {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        successMsg.classList.add('show');
        form.reset();
        setTimeout(() => successMsg.classList.remove('show'), 5000);
      }, 1200);
    });
  }

  /* ---------------------------------------------------------------------
     Newsletter form (footer)
  --------------------------------------------------------------------- */
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = newsletterForm.querySelector('input');
      const btn = newsletterForm.querySelector('button');
      if (!input.value.trim()) return;
      const original = btn.textContent;
      btn.textContent = '✓';
      input.value = '';
      setTimeout(() => (btn.textContent = original), 2000);
    });
  }

  /* ---------------------------------------------------------------------
     Footer year
  --------------------------------------------------------------------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

});

/* ---------------------------------------------------------------------
   DARK MODE TOGGLE
--------------------------------------------------------------------- */

const themeToggle = document.getElementById('themeToggle');
const themeToggleText = themeToggle?.querySelector('.theme-toggle-text');

// Check if user already selected a theme
const savedTheme = localStorage.getItem('portfolio-theme');

if (savedTheme === 'dark') {
  document.documentElement.setAttribute('data-theme', 'dark');

  if (themeToggle) {
    themeToggle.setAttribute('aria-pressed', 'true');
    themeToggle.setAttribute('aria-label', 'Switch to light mode');
  }

  if (themeToggleText) {
    themeToggleText.textContent = 'Dark';
  }
}

// Toggle theme when clicked
if (themeToggle) {
  themeToggle.addEventListener('click', () => {

    const isDark =
      document.documentElement.getAttribute('data-theme') === 'dark';

    if (isDark) {

      // Switch to light mode
      document.documentElement.removeAttribute('data-theme');

      localStorage.setItem('portfolio-theme', 'light');

      themeToggle.setAttribute('aria-pressed', 'false');
      themeToggle.setAttribute(
        'aria-label',
        'Switch to dark mode'
      );

      if (themeToggleText) {
        themeToggleText.textContent = 'Light';
      }

    } else {

      // Switch to dark mode
      document.documentElement.setAttribute(
        'data-theme',
        'dark'
      );

      localStorage.setItem('portfolio-theme', 'dark');

      themeToggle.setAttribute('aria-pressed', 'true');
      themeToggle.setAttribute(
        'aria-label',
        'Switch to light mode'
      );

      if (themeToggleText) {
        themeToggleText.textContent = 'Dark';
      }
    }
  });
}