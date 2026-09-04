'use strict';

/* ════════════════════════════════════════
   HANSLER TUSEVO – PORTFOLIO v2 SCRIPT
   ════════════════════════════════════════ */

// ---- LOADER ----
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  const pct = document.getElementById('loaderPercent');
  const bar = document.getElementById('loaderBar');
  let p = 0;
  const iv = setInterval(() => {
    p = Math.min(p + Math.random() * 5, 100);
    const val = Math.floor(p);
    if (pct) pct.textContent = val + '%';
    if (bar) bar.style.width = val + '%';
    if (p >= 100) clearInterval(iv);
  }, 120);

  setTimeout(() => {
    if (loader) loader.classList.add('done');
    document.body.style.overflow = '';
    initAOS();
    typeLoop();
  }, 3200);
  document.body.style.overflow = 'hidden';
});

// ---- CUSTOM CURSOR ----
const cursor = document.getElementById('cursor');
const cBlur = document.getElementById('cursor-blur');
let mx = 0, my = 0, bx = 0, by = 0;

document.addEventListener('mousemove', (e) => {
  mx = e.clientX; my = e.clientY;
  if (cursor) { cursor.style.left = mx + 'px'; cursor.style.top = my + 'px'; }
});

(function animBlur() {
  bx += (mx - bx) * 0.1;
  by += (my - by) * 0.1;
  if (cBlur) { cBlur.style.left = bx + 'px'; cBlur.style.top = by + 'px'; }
  requestAnimationFrame(animBlur);
})();

document.querySelectorAll('a,button,.project-card,.svc-card,.skill-card,.contact-card').forEach(el => {
  el.addEventListener('mouseenter', () => cursor && cursor.classList.add('big'));
  el.addEventListener('mouseleave', () => cursor && cursor.classList.remove('big'));
});

// ---- NAVBAR SCROLL ----
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 50);
  updateActiveNav();
});

function updateActiveNav() {
  const secs = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.nav-link');
  let current = '';
  secs.forEach(s => { if (window.scrollY >= s.offsetTop - 220) current = s.id; });
  links.forEach(l => {
    l.classList.remove('active');
    if (l.getAttribute('href') === '#' + current) l.classList.add('active');
  });
}

// ---- HAMBURGER ----
const burger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

if (burger) {
  burger.addEventListener('click', () => {
    navLinks.classList.toggle('mobile-open');
    burger.classList.toggle('open');
    const ss = burger.querySelectorAll('span');
    if (burger.classList.contains('open')) {
      ss[0].style.transform = 'rotate(45deg) translate(5px,5px)';
      ss[1].style.opacity = '0';
      ss[2].style.transform = 'rotate(-45deg) translate(5px,-5px)';
    } else {
      ss.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });
}
if (navLinks) {
  navLinks.querySelectorAll('.nav-link').forEach(l => {
    l.addEventListener('click', () => {
      navLinks.classList.remove('mobile-open');
      burger && burger.classList.remove('open');
      burger && burger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    });
  });
}

// ---- HERO CANVAS PARTICLES ----
const canvas = document.getElementById('heroCanvas');
const ctx = canvas ? canvas.getContext('2d') : null;
let pts = [];
let animId;

function sizeCanvas() {
  if (!canvas) return;
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}

class P {
  constructor() { this.reset(true); }
  reset(rand = false) {
    if (!canvas) return;
    this.x = rand ? Math.random() * canvas.width : (Math.random() < .5 ? 0 : canvas.width);
    this.y = rand ? Math.random() * canvas.height : Math.random() * canvas.height;
    this.vx = (Math.random() - .5) * .45;
    this.vy = (Math.random() - .5) * .45;
    this.r = Math.random() * 1.4 + .3;
    this.life = rand ? Math.random() : 0;
    this.maxL = Math.random() * .5 + .35;
    this.isGold = Math.random() > .55;
  }
  update() {
    if (!canvas) return;
    this.x += this.vx; this.y += this.vy; this.life += .0028;
    const fade = this.life < this.maxL * .3 ? this.life / (this.maxL * .3)
      : this.life > this.maxL * .7 ? 1 - (this.life - this.maxL * .7) / (this.maxL * .3) : 1;
    this.alpha = Math.max(0, Math.min(1, fade));
    if (this.life > this.maxL || this.x < -2 || this.x > canvas.width + 2 || this.y < -2 || this.y > canvas.height + 2)
      this.reset();
  }
  draw() {
    if (!ctx) return;
    ctx.save();
    ctx.globalAlpha = this.alpha * .55;
    const col = this.isGold ? '#D4AF37' : '#6c4bcf';
    ctx.fillStyle = col;
    ctx.shadowColor = col; ctx.shadowBlur = 5;
    ctx.beginPath(); ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }
}

function buildPts() {
  if (!canvas) return;
  const n = Math.min(Math.floor(canvas.width * canvas.height / 7500), 130);
  pts = Array.from({ length: n }, () => new P());
}

function drawLines() {
  if (!ctx || !canvas) return;
  const M = 110;
  for (let i = 0; i < pts.length; i++) {
    for (let j = i + 1; j < pts.length; j++) {
      const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < M) {
        ctx.save();
        ctx.globalAlpha = (1 - d / M) * .1;
        ctx.strokeStyle = '#D4AF37'; ctx.lineWidth = .5;
        ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y); ctx.stroke();
        ctx.restore();
      }
    }
  }
}

function animPts() {
  if (!ctx || !canvas) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawLines();
  pts.forEach(p => { p.update(); p.draw(); });
  animId = requestAnimationFrame(animPts);
}

if (canvas) {
  sizeCanvas(); buildPts(); animPts();
  window.addEventListener('resize', () => { sizeCanvas(); buildPts(); });
}

// ---- MOUSE PARALLAX ORBS ----
const orbs = document.querySelectorAll('.orb');
let easing = { x: 0, y: 0 };
document.addEventListener('mousemove', (e) => {
  easing.tx = (e.clientX / window.innerWidth - .5) * 26;
  easing.ty = (e.clientY / window.innerHeight - .5) * 26;
});
(function orbLoop() {
  easing.x = (easing.x || 0) + (((easing.tx || 0) - (easing.x || 0)) * .06);
  easing.y = (easing.y || 0) + (((easing.ty || 0) - (easing.y || 0)) * .06);
  orbs.forEach((o, i) => {
    const f = (i + 1) * .38;
    o.style.transform = `translate(${easing.x * f}px, ${easing.y * f}px)`;
  });
  requestAnimationFrame(orbLoop);
})();

// ---- TYPED TEXT ----
const typedEl = document.getElementById('typedText');
const phrases = [
  'Développeur Web',
  'Workflow & Solutions IA',
  'UI/UX Designer',
  'Community Manager',
  'Expert Web & Mobile',
];
let wIdx = 0, cIdx = 0, del = false;

function typeLoop() {
  if (!typedEl) return;
  const w = phrases[wIdx];
  typedEl.textContent = del ? w.slice(0, --cIdx) : w.slice(0, ++cIdx);
  let speed = del ? 52 : 88;
  if (!del && cIdx === w.length) { speed = 1900; del = true; }
  if (del && cIdx === 0) { speed = 400; del = false; wIdx = (wIdx + 1) % phrases.length; }
  setTimeout(typeLoop, speed);
}

// ---- COUNTER ANIMATION ----
function animCounter(el, target, dur = 1800) {
  const inc = target / (dur / 16);
  let v = 0, t;
  (function tick() {
    v += inc; if (v >= target) { el.textContent = target; return; }
    el.textContent = Math.floor(v); t = requestAnimationFrame(tick);
  })();
}

let countersRan = false;
function runCounters() {
  if (countersRan) return; countersRan = true;
  document.querySelectorAll('.stat-num').forEach(el => {
    animCounter(el, parseInt(el.dataset.count));
  });
}

// ---- AOS SCROLL ANIMATIONS ----
function initAOS() {
  const els = document.querySelectorAll('[data-aos]');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const delay = parseInt(el.getAttribute('data-aos-delay') || '0');
      setTimeout(() => el.classList.add('aos-animate'), delay);
      io.unobserve(el);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

  // Counter observer on hero stats
  const statsIO = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) { runCounters(); statsIO.disconnect(); }
  }, { threshold: 0.5 });
  const statsEl = document.querySelector('.hero-stats');
  if (statsEl) statsIO.observe(statsEl);

  els.forEach(el => {
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight) {
      const delay = parseInt(el.getAttribute('data-aos-delay') || '0');
      setTimeout(() => el.classList.add('aos-animate'), delay);
    } else {
      io.observe(el);
    }
  });
  setTimeout(runCounters, 600);
}

// ---- MODALS ----
window.openModal = function (id) {
  const m = document.getElementById(id);
  if (m) { m.classList.add('active'); document.body.classList.add('modal-open'); }
};
window.closeModal = function (id) {
  const m = document.getElementById(id);
  if (m) { m.classList.remove('active'); document.body.classList.remove('modal-open'); }
};
document.querySelectorAll('.modal').forEach(m => {
  m.addEventListener('click', e => {
    if (e.target === m) { m.classList.remove('active'); document.body.classList.remove('modal-open'); }
  });
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal.active').forEach(m => {
      m.classList.remove('active'); document.body.classList.remove('modal-open');
    });
  }
});

// ---- CONTACT FORM ----
window.handleSubmit = function (e) {
  e.preventDefault();
  const btn = document.getElementById('submitBtn');
  const ok = document.getElementById('formSuccess');
  const form = document.getElementById('contactForm');
  
  const fname = document.getElementById('fname').value;
  const femail = document.getElementById('femail').value;
  const fsubject = document.getElementById('fsubject').value;
  const fmessage = document.getElementById('fmessage').value;
  
  btn.innerHTML = '<span>Envoi en cours…</span> <i class="fa-solid fa-spinner fa-spin"></i>';
  btn.disabled = true;
  
  setTimeout(() => {
    form.querySelectorAll('input,textarea').forEach(f => f.value = '');
    btn.innerHTML = '<span>Envoyer le message</span> <i class="fa-solid fa-paper-plane"></i>';
    btn.disabled = false;
    if (ok) { ok.classList.remove('hidden'); setTimeout(() => ok.classList.add('hidden'), 5500); }
  }, 1800);
};

// ---- SMOOTH SCROLL ----
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function (e) {
    const t = document.querySelector(this.getAttribute('href'));
    if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});

// ---- HERO PHOTO TILT ----
const photoFrame = document.querySelector('.photo-frame');
if (photoFrame) {
  photoFrame.addEventListener('mousemove', (e) => {
    const r = photoFrame.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const rx = ((e.clientY - cy) / (r.height / 2)) * 8;
    const ry = ((e.clientX - cx) / (r.width / 2)) * -8;
    photoFrame.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.02)`;
  });
  photoFrame.addEventListener('mouseleave', () => {
    photoFrame.style.transform = '';
  });
}

// ---- ACTIVE NAV ----
document.head.insertAdjacentHTML('beforeend',
  '<style>.nav-link.active{color:var(--text)!important}.nav-link.active::after{left:16px!important;right:16px!important;background:var(--gold)}</style>'
);

/* ════════════════════════════════════════
   i18n – LANGUAGE SWITCHER (FR / EN)
   ════════════════════════════════════════ */
const translations = {
  fr: {
    // Navbar
    'nav.about': 'À propos',
    'nav.skills': 'Compétences',
    'nav.projects': 'Projets',
    'nav.services': 'Services',
    'nav.contact': 'Contact',
    'nav.cta': 'Collaborer',

    // Hero
    'hero.badge': 'Disponible · Kinshasa & International',
    'hero.desc': 'Je conçois des applications, des designs et des expériences digitales modernes pour aider les entreprises à se développer et se démarquer en ligne.',
    'hero.signature': 'Je transforme les idées en expériences digitales intelligentes.',
    'hero.cta1': 'Voir mes projets',
    'hero.cta2': 'Me contacter',
    'hero.projects': 'Projets',
    'hero.clients': 'Clients',
    'hero.years': 'Années',

    // Footer
    'footer.copy': '© 2024 Hansler Tusevo. Tous droits réservés.',
    'footer.nav': 'Navigation',
    'footer.services': 'Services',
  },
  en: {
    // Navbar
    'nav.about': 'About',
    'nav.skills': 'Skills',
    'nav.projects': 'Projects',
    'nav.services': 'Services',
    'nav.contact': 'Contact',
    'nav.cta': 'Collaborate',

    // Hero
    'hero.badge': 'Available · Kinshasa & International',
    'hero.desc': 'I design modern applications, designs and digital experiences to help businesses grow and stand out online.',
    'hero.signature': 'I turn ideas into intelligent digital experiences.',
    'hero.cta1': 'View my projects',
    'hero.cta2': 'Contact me',
    'hero.projects': 'Projects',
    'hero.clients': 'Clients',
    'hero.years': 'Years',

    // Footer
    'footer.copy': '© 2024 Hansler Tusevo. All rights reserved.',
    'footer.nav': 'Navigation',
    'footer.services': 'Services',
  }
};

// Dynamic content translated via DOM targeting
const dynamicTranslations = {
  fr: {
    // Impact bar
    '.impact-item:nth-child(1) strong': '+3 projets innovants',
    '.impact-item:nth-child(1) span': 'Réalisés avec succès',
    '.impact-item:nth-child(3) strong': 'Solutions basées sur l\'IA',
    '.impact-item:nth-child(3) span': 'Automatisation & intelligence',
    '.impact-item:nth-child(5) strong': 'Approche moderne',
    '.impact-item:nth-child(5) span': 'Design & technologie de pointe',
    // About
    '.section-header .section-tag': 'À propos',
    '#about .section-title': 'Qui suis-je ?',
    '#about .about-desc:first-of-type': 'Je suis <strong>Hansler Tusevo</strong>, passionné par le développement, le design et l\'intelligence artificielle. Je crée des solutions digitales innovantes qui aident les entreprises à améliorer leur présence en ligne et à augmenter leur impact.',
    // Skills section
    '#skills .section-tag': 'Expertise',
    '#skills .section-title': 'Mes Compétences',
    '#skills .skill-card:nth-child(1) h3': 'Développeur Web',
    '#skills .skill-card:nth-child(2) h3': 'Intelligence Artificielle',
    '#skills .skill-card:nth-child(3) h3': 'Design',
    '#skills .skill-card:nth-child(4) h3': 'Community Manager',
    '#skills .cv-download-wrapper span': 'Télécharger mon CV',
    // Projects
    '#projects .section-tag': 'Portfolio',
    '#projects .section-title': 'Projets Récents',
    '#projects .section-sub': 'Des solutions innovantes conçues pour transformer votre présence digitale',
    // Services
    '#services .section-tag': 'Offres',
    '#services .section-title': 'Mes Services',
    '#services .section-sub': 'Des solutions complètes pour propulser votre présence digitale',
    '#services .svc-card:nth-child(1) h3': 'Création de sites web',
    '#services .svc-card:nth-child(2) h3': 'Workflow IA',
    '#services .svc-card:nth-child(3) h3': 'UI/UX Design',
    '#services .svc-card:nth-child(4) h3': 'Stratégie Digitale',
    // Conversion
    '.conversion h2': 'Vous avez un projet ?<br>Transformons-le en solution digitale.',
    '.conversion p': 'Je suis disponible pour de nouveaux projets, du freelance et des collaborations internationales.',
    '.conv-actions .btn-primary span': 'Obtenir un site comme celui-ci',
    '.conv-actions .btn-glass span': 'Voir mes réalisations',
    // Contact
    '#contact .section-tag': 'Contact',
    '#contact .section-title': 'Travaillons Ensemble',
    '#contact .section-sub': 'Vous avez un projet ? Je suis disponible pour en discuter.',
    '#fname[placeholder]': null,
    '#femail[placeholder]': null,
    '#fsubject[placeholder]': null,
    '#fmessage[placeholder]': null,
    '.contact-avail': 'Disponible pour du freelance & projets internationaux',
    '#submitBtn span': 'Envoyer le message',
    // Footer
    '.footer-brand p:first-of-type': 'Développeur & Créateur de solutions digitales avec l\'IA — Kinshasa, RDC',
    '.footer-sig': '"Je transforme les idées en expériences digitales intelligentes."',
    '.fn-col:first-child strong': 'Navigation',
    '.fn-col:first-child a:nth-child(2)': 'À propos',
    '.fn-col:first-child a:nth-child(3)': 'Compétences',
    '.fn-col:first-child a:nth-child(4)': 'Projets',
    '.fn-col:last-child strong': 'Services',
    '.fn-col:last-child a:nth-child(2)': 'Portfolio web',
    '.fn-col:last-child a:nth-child(3)': 'Apps IA',
    '.fn-col:last-child a:nth-child(4)': 'Design',
  },
  en: {
    // Impact bar
    '.impact-item:nth-child(1) strong': '+3 innovative projects',
    '.impact-item:nth-child(1) span': 'Successfully completed',
    '.impact-item:nth-child(3) strong': 'AI-powered solutions',
    '.impact-item:nth-child(3) span': 'Automation & intelligence',
    '.impact-item:nth-child(5) strong': 'Modern approach',
    '.impact-item:nth-child(5) span': 'Cutting-edge design & technology',
    // About
    '#about .section-title': 'Who am I?',
    '#about .about-desc:first-of-type': 'I am <strong>Hansler Tusevo</strong>, passionate about development, design and artificial intelligence. I create innovative digital solutions that help businesses improve their online presence and increase their impact.',
    // Skills
    '#skills .section-tag': 'Expertise',
    '#skills .section-title': 'My Skills',
    '#skills .skill-card:nth-child(1) h3': 'Web Developer',
    '#skills .skill-card:nth-child(2) h3': 'Artificial Intelligence',
    '#skills .skill-card:nth-child(3) h3': 'Design',
    '#skills .skill-card:nth-child(4) h3': 'Community Manager',
    '#skills .cv-download-wrapper span': 'Download my CV',
    // Projects
    '#projects .section-tag': 'Portfolio',
    '#projects .section-title': 'Recent Projects',
    '#projects .section-sub': 'Innovative solutions designed to transform your digital presence',
    // Services
    '#services .section-tag': 'Services',
    '#services .section-title': 'My Services',
    '#services .section-sub': 'Complete solutions to boost your digital presence',
    '#services .svc-card:nth-child(1) h3': 'Website Creation',
    '#services .svc-card:nth-child(2) h3': 'AI Workflow',
    '#services .svc-card:nth-child(3) h3': 'UI/UX Design',
    '#services .svc-card:nth-child(4) h3': 'Digital Strategy',
    // Conversion
    '.conversion h2': 'Got a project?<br>Let\'s turn it into a digital solution.',
    '.conversion p': 'I am available for new projects, freelance work and international collaborations.',
    '.conv-actions .btn-primary span': 'Get a site like this one',
    '.conv-actions .btn-glass span': 'View my work',
    // Contact
    '#contact .section-tag': 'Contact',
    '#contact .section-title': 'Let\'s Work Together',
    '#contact .section-sub': 'Have a project? I\'m available to discuss it.',
    '.contact-avail': 'Available for freelance & international projects',
    '#submitBtn span': 'Send message',
    // Footer
    '.footer-brand p:first-of-type': 'Developer & Creator of digital solutions with AI — Kinshasa, DRC',
    '.footer-sig': '"I turn ideas into intelligent digital experiences."',
    '.fn-col:first-child strong': 'Navigation',
    '.fn-col:first-child a:nth-child(2)': 'About',
    '.fn-col:first-child a:nth-child(3)': 'Skills',
    '.fn-col:first-child a:nth-child(4)': 'Projects',
    '.fn-col:last-child strong': 'Services',
    '.fn-col:last-child a:nth-child(2)': 'Web portfolio',
    '.fn-col:last-child a:nth-child(3)': 'AI Apps',
    '.fn-col:last-child a:nth-child(4)': 'Design',
  }
};

// Placeholder translations
const placeholders = {
  fr: { fname: 'Votre nom', femail: 'Email', fsubject: 'Sujet du projet', fmessage: 'Décrivez votre projet...' },
  en: { fname: 'Your name', femail: 'Email', fsubject: 'Project subject', fmessage: 'Describe your project...' }
};

// Typed phrases translations
const typedPhrases = {
  fr: ['Développeur Web', 'Workflow & Solutions IA', 'UI/UX Designer', 'Community Manager', 'Expert Web & Mobile'],
  en: ['Web Developer', 'AI Workflow & Solutions', 'UI/UX Designer', 'Community Manager', 'Web & Mobile Expert']
};

let currentLang = localStorage.getItem('ht-lang') || 'fr';

window.setLang = function (lang) {
  currentLang = lang;
  localStorage.setItem('ht-lang', lang);

  // 1) Translate [data-i18n] elements
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[lang] && translations[lang][key]) {
      el.textContent = translations[lang][key];
    }
  });

  // 2) Translate dynamic selectors
  const map = dynamicTranslations[lang];
  for (const selector in map) {
    const val = map[selector];
    if (!val) continue;
    try {
      document.querySelectorAll(selector).forEach(el => {
        el.innerHTML = val;
      });
    } catch (e) { /* invalid selector, skip */ }
  }

  // 3) Translate placeholders
  const ph = placeholders[lang];
  Object.keys(ph).forEach(id => {
    const el = document.getElementById(id);
    if (el) el.placeholder = ph[id];
  });

  // 4) Update typed phrases
  if (typedPhrases[lang]) {
    phrases.length = 0;
    typedPhrases[lang].forEach(p => phrases.push(p));
  }

  // 5) Update <html lang=""> attribute
  document.documentElement.lang = lang;

  // 6) Update all switcher buttons
  ['btnFR', 'footerBtnFR'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.toggle('active', lang === 'fr');
  });
  ['btnEN', 'footerBtnEN'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.toggle('active', lang === 'en');
  });

  // 7) Smooth page-level fade
  document.body.style.transition = 'opacity .25s ease';
  document.body.style.opacity = '0.85';
  setTimeout(() => { document.body.style.opacity = '1'; }, 250);
};

// Apply saved language on load (after loader finishes)
const _origLoader = window.addEventListener;
setTimeout(() => {
  if (currentLang !== 'fr') setLang(currentLang);
  else setLang('fr'); // init button states
}, 3400);
