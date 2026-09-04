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

if (canvas) {
  function resizeCanvasFull() {
    const bg = canvas.closest('.page-bg');
    if (!bg) return;
    canvas.width = bg.offsetWidth;
    canvas.height = bg.offsetHeight;
  }

  // Replace the old resizeCanvas function behavior by redefining initParticles:
  function initParticlesFull() {
    resizeCanvasFull();
    createParticles();
    cancelAnimationFrame(animationFrameId);
    drawParticles();
  }

  // Call once now to re-init with new container
  initParticlesFull();

  // Re-init on resize
  window.addEventListener('resize', initParticlesFull);
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
const tabPages = document.querySelectorAll('.tab-page');
const navTabs = document.querySelectorAll('.nav-tab');

function activateFullPageTab(tabName) {
  // Hide all tab-pages first
  tabPages.forEach(page => {
    page.classList.remove('active-page');
    page.classList.remove('visible-at-start');
  });

  // Special rule: if clicking Home or About, only that page shows
  // (you can change this later if you want Home+About together again)
  const target = document.getElementById(tabName);
  if (target) {
    target.classList.add('active-page');
  }

  // Update nav tab active state
  navTabs.forEach(tab => {
    tab.classList.toggle('active', tab.dataset.tab === tabName);
  });

  // Scroll to top smoothly
  window.scrollTo({ top: 0, behavior: 'smooth' });
  history.replaceState(null, '', '#' + tabName);
}

// Attach click handlers to nav tabs
navTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    activateFullPageTab(tab.dataset.tab);
    const navLinks = document.getElementById('navLinks');
    if (navLinks) navLinks.classList.remove('open');
  });
});

// Also wire up any hero CTA buttons that use data-goto-tab
document.querySelectorAll('[data-goto-tab]').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    activateFullPageTab(btn.dataset.gotoTab);
  });
});

// Restore from URL hash on load (optional: default to 'home' if nothing specified)
const initialTab = window.location.hash.replace('#', '') || 'home';
if (['home', 'about', 'projects', 'contact'].includes(initialTab)) {
  // On first load, keep visible-at-start as-is, then optionally switch if hash is not home/about
  if (initialTab === 'projects' || initialTab === 'contact') {
    activateFullPageTab(initialTab);
  }
}

// =========================================================
// 10. Project detail data — EDIT THIS OBJECT to add/update projects.
// Each key must match the data-project attribute on its card in index.html.
// images: put real file paths in assets/images/projects/ — if a file is
// missing the broken image just won't render (no crash).
// =========================================================
const PROJECT_DATA = {
  'robodog': {
    title: 'Autonomous Robo-Dog Navigation System',
    period: 'Oct 2025 - Jan 2026 · Deggendorf Institute of Technology',
    images: [
      'assets/images/projects/robodog-1.jpg',
      'assets/images/projects/robodog-2.jpg',
      'assets/images/projects/robodog-3.jpg'
    ],
    summary: 'Built an embedded autonomous navigation system for a quadruped robot (robo-dog) using Arduino/ESP32 and multiple sensors for localization and motion control.',
    specs: [
      ['Platform', 'Quadruped robot chassis'],
      ['Microcontroller', 'ESP32 / Arduino'],
      ['Sensors', 'IMU, ultrasonic, encoders'],
      ['Role', 'Navigation & motion control'],
      ['Outcome', 'Autonomous obstacle-aware locomotion']
    ],
    highlights: [
      'Designed the sensor fusion pipeline for localization on a resource-constrained MCU.',
      'Implemented closed-loop motion control for stable quadruped gait tracking.',
      'Tuned obstacle-avoidance thresholds using live sensor calibration.'
    ],
    links: { github: '#', demo: '' }
  },
  'vr-pedestrian': {
    title: 'VR Project: "Pedestrian Perspective"',
    period: 'Jul 2025 · Deggendorf Institute of Technology',
    images: [
      'assets/images/projects/vr-pedestrian-1.jpg',
      'assets/images/projects/vr-pedestrian-2.jpg'
    ],
    summary: "Designed and implemented a realistic VR simulation that enhances road safety by immersing users in a pedestrian's perspective, highlighting blind spots and reaction-time challenges.",
    specs: [
      ['Engine', 'Unity'],
      ['Language', 'C#'],
      ['Hardware', 'VR headset (room-scale)'],
      ['Focus area', 'Road safety / human factors'],
      ['3D Assets', 'Blender']
    ],
    highlights: [
      'Modeled realistic traffic scenarios and pedestrian-vehicle interaction zones.',
      'Built interactive VR triggers to simulate hazard timing and reaction windows.',
      'Presented findings on perception gaps from a pedestrian viewpoint.'
    ],
    links: { github: '#', demo: '' }
  },
  'aerial-manipulator': {
    title: 'Aerial Manipulator Project',
    period: 'Jun 2023 - Mar 2024 · Handzylectro Labs, Hyderabad',
    images: [
      'assets/images/projects/aerial-manipulator-1.jpg',
      'assets/images/projects/aerial-manipulator-2.jpg'
    ],
    summary: 'As a Robotics Intern, prototyped, designed, and developed an aerial manipulator system capable of manipulating objects mid-flight.',
    specs: [
      ['Role', 'Robotics Intern'],
      ['Focus', 'Mechanical prototyping & design'],
      ['Domain', 'Aerial robotics'],
      ['Duration', '10 months']
    ],
    highlights: [
      'Iterated on mechanical arm design for weight and stability trade-offs.',
      'Prototyped manipulator linkages for mid-air grasp tasks.',
      'Collaborated with a small robotics team on system integration.'
    ],
    links: { github: '#', demo: '' }
  },
  'exosuit': {
    title: 'Robotic Exosuit for Lower Arm',
    period: "2019 - 2023 · Bachelor's Thesis, Mahindra University",
    images: [
      'assets/images/projects/exosuit-1.jpg',
      'assets/images/projects/exosuit-2.jpg',
      'assets/images/projects/exosuit-3.jpg'
    ],
    summary: 'Conceptualized and developed a soft exosuit tailored to empower individuals with disabled arms, facilitating their daily activities with ease.',
    specs: [
      ['Type', 'Soft robotic exosuit'],
      ['Target area', 'Lower arm'],
      ['CAD tool', 'SOLIDWORKS'],
      ['Thesis type', 'Bachelor of Technology, Mechanical Engineering']
    ],
    highlights: [
      'Designed a lightweight, wearable soft-actuation structure.',
      'Validated range-of-motion assistance for daily activity tasks.',
      'Presented as final thesis project for B.Tech. Mechanical Engineering.'
    ],
    links: { github: '#', demo: '' }
  },
  'gear-design': {
    title: 'Parametric Gear Design Toolkit',
    period: 'Ongoing · Personal Project',
    images: [
      'assets/images/projects/gear-design-1.jpg',
      'assets/images/projects/gear-design-2.jpg'
    ],
    summary: 'Parametric beveloid and conical gear design using MATLAB and Lua, generating manufacturable gear geometries from custom input parameters.',
    specs: [
      ['Tools', 'MATLAB, Lua'],
      ['Gear types', 'Beveloid, conical'],
      ['Output', 'Manufacturable CAD geometry'],
      ['Status', 'Actively maintained']
    ],
    highlights: [
      'Automated gear-tooth profile generation from parametric inputs.',
      'Built a Lua scripting layer for CAD-software integration.',
      'Validated geometry against manufacturability constraints.'
    ],
    links: { github: '#', demo: '' }
  },
  'ros2-rover': {
    title: 'ROS 2 Rover & Sensor Integration',
    period: 'Ongoing · Personal Project',
    images: [
      'assets/images/projects/ros2-rover-1.jpg',
      'assets/images/projects/ros2-rover-2.jpg'
    ],
    summary: 'Personal ROS 2 rover project integrating sensors and micro-ROS over ESP32, used to learn ROS 2 nodes, topics, and navigation stack fundamentals.',
    specs: [
      ['Framework', 'ROS 2'],
      ['Simulation', 'Gazebo'],
      ['Microcontroller bridge', 'micro-ROS on ESP32'],
      ['Focus', 'Navigation stack, sensor topics']
    ],
    highlights: [
      'Set up micro-ROS communication between ESP32 and ROS 2 nodes.',
      'Integrated sensor topics for basic SLAM experimentation in Gazebo.',
      'Used as a hands-on foundation for ROS 2 architecture concepts.'
    ],
    links: { github: '#', demo: '' }
  }
};

// =========================================================
// 11. Project detail overlay open/close logic
// =========================================================
const projectOverlay = document.getElementById('projectDetailOverlay');
const projectDetailBody = document.getElementById('projectDetailBody');
const projectDetailClose = document.getElementById('projectDetailClose');

function renderProjectDetail(key) {
  const data = PROJECT_DATA[key];
  if (!data) return;

  const specsRows = data.specs.map(([label, value]) =>
    `<tr><th>${label}</th><td>${value}</td></tr>`
  ).join('');

  const highlightItems = data.highlights.map(h => `<li>${h}</li>`).join('');

  const imagesHtml = data.images.map(src =>
    `<img src="${src}" alt="${data.title}" loading="lazy" onerror="this.style.display='none'">`
  ).join('');

  projectDetailBody.innerHTML = `
    <p class="project-detail-period">${data.period}</p>
    <h3 class="project-detail-title">${data.title}</h3>
    <div class="project-gallery">${imagesHtml}</div>
    <p class="project-detail-summary">${data.summary}</p>
    <div class="project-detail-columns">
      <div>
        <h4>Key specs</h4>
        <table class="project-specs-table">${specsRows}</table>
      </div>
      <div>
        <h4>Highlights</h4>
        <ul class="project-highlights-list">${highlightItems}</ul>
      </div>
    </div>
    <div class="project-detail-links">
      ${data.links.github ? `<a href="${data.links.github}" target="_blank" rel="noopener" class="btn btn-secondary">View on GitHub</a>` : ''}
      ${data.links.demo ? `<a href="${data.links.demo}" target="_blank" rel="noopener" class="btn btn-primary">Live demo</a>` : ''}
    </div>
  `;

  projectOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeProjectDetail() {
  projectOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

document.querySelectorAll('.project-open-btn, .project-card').forEach(el => {
  el.addEventListener('click', (e) => {
    const key = el.dataset.project;
    if (key) renderProjectDetail(key);
  });
});

projectDetailClose.addEventListener('click', closeProjectDetail);
projectOverlay.addEventListener('click', (e) => {
  if (e.target === projectOverlay) closeProjectDetail();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeProjectDetail();
});