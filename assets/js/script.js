// =========================================================
// 1. Footer year
// =========================================================
document.getElementById('year').textContent = new Date().getFullYear();

// =========================================================
// 2. Navbar scroll state + mobile menu toggle
// =========================================================
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
});

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// =========================================================
// 3. Dark / light theme toggle (persisted in localStorage)
// =========================================================
const themeToggle = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('theme');

if (savedTheme === 'light') {
  document.documentElement.setAttribute('data-theme', 'light');
  themeToggle.textContent = '☀️';
}

themeToggle.addEventListener('click', () => {
  const isLight = document.documentElement.getAttribute('data-theme') === 'light';
  if (isLight) {
    document.documentElement.removeAttribute('data-theme');
    localStorage.setItem('theme', 'dark');
    themeToggle.textContent = '🌙';
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
    localStorage.setItem('theme', 'light');
    themeToggle.textContent = '☀️';
  }
});

// =========================================================
// 4. Typing effect in the hero title
// =========================================================
const typedEl = document.getElementById('typedText');
const roles = [
  'robots.',
  'ROS2 simulations.',
  'mechatronic systems.',
  'gears & mechanical designs.',
  'embedded system projects.',
  'and many more cool things!'
];

let roleIndex = 0;
let charIndex = 0;
let deleting = false;

function typeLoop() {
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

  setTimeout(typeLoop, deleting ? 40 : 70);
}

typeLoop();

// =========================================================
// 5. Cursor glow that follows the mouse (desktop only)
// =========================================================
const glow = document.getElementById('cursorGlow');
let glowActive = window.matchMedia('(min-width: 761px)').matches;

window.addEventListener('mousemove', (e) => {
  if (!glowActive) return;
  glow.style.left = e.clientX + 'px';
  glow.style.top = e.clientY + 'px';
});

window.matchMedia('(min-width: 761px)').addEventListener('change', (e) => {
  glowActive = e.matches;
  glow.style.opacity = e.matches ? '1' : '0';
});

// =========================================================
// 6. Scroll-reveal animation using IntersectionObserver
// =========================================================
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealEls.forEach(el => revealObserver.observe(el));

// =========================================================
// 7. Lightweight particle network background (hero canvas)
// =========================================================
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
let animationFrameId;

function resizeCanvas() {
  const hero = canvas.closest('.hero');
  canvas.width = hero.offsetWidth;
  canvas.height = hero.offsetHeight;
}

function createParticles() {
  const count = Math.min(70, Math.floor((canvas.width * canvas.height) / 18000));
  particles = Array.from({ length: count }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
    r: Math.random() * 1.6 + 0.6
  }));
}

function getAccentColor() {
  const isLight = document.documentElement.getAttribute('data-theme') === 'light';
  return isLight ? 'rgba(13,148,136,' : 'rgba(94,234,212,';
}

function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const colorBase = getAccentColor();

  particles.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;

    if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = colorBase + '0.6)';
    ctx.fill();
  });

  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const a = particles[i], b = particles[j];
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      if (dist < 120) {
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = colorBase + (0.15 * (1 - dist / 120)) + ')';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
  }

  animationFrameId = requestAnimationFrame(drawParticles);
}

function initParticles() {
  resizeCanvas();
  createParticles();
  cancelAnimationFrame(animationFrameId);
  drawParticles();
}

window.addEventListener('resize', initParticles);
initParticles();

// =========================================================
// 8. Contact form submission (Formspree-ready, no backend needed)
// =========================================================
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');
const formSubmitBtn = document.getElementById('formSubmitBtn');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const action = contactForm.getAttribute('action') || '';
    if (action.includes('YOUR_FORM_ID')) {
      formStatus.textContent = 'Set up your Formspree endpoint in index.html to activate this form.';
      formStatus.className = 'form-status error';
      return;
    }

    formSubmitBtn.disabled = true;
    formSubmitBtn.textContent = 'Sending...';
    formStatus.textContent = '';
    formStatus.className = 'form-status';

    try {
      const response = await fetch(action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        formStatus.textContent = 'Thanks! Your message has been sent.';
        formStatus.className = 'form-status success';
        contactForm.reset();
      } else {
        formStatus.textContent = 'Something went wrong. Please try again or email me directly.';
        formStatus.className = 'form-status error';
      }
    } catch (err) {
      formStatus.textContent = 'Network error. Please try again or email me directly.';
      formStatus.className = 'form-status error';
    } finally {
      formSubmitBtn.disabled = false;
      formSubmitBtn.textContent = 'Send message';
    }
  });
}
