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
  const lang = currentLang;

  const sendingText = lang === 'en' ? 'Sending…' : 'Envoi en cours…';
  const sendText = lang === 'en' ? 'Send message' : 'Envoyer le message';

  btn.innerHTML = `<span>${sendingText}</span> <i class="fa-solid fa-spinner fa-spin"></i>`;
  btn.disabled = true;

  setTimeout(() => {
    form.querySelectorAll('input,textarea').forEach(f => f.value = '');
    btn.innerHTML = `<span>${sendText}</span> <i class="fa-solid fa-paper-plane"></i>`;
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
   i18n – COMPLETE BILINGUAL SYSTEM (FR / EN)
   ════════════════════════════════════════ */

const translations = {
  fr: {
    // Meta / SEO
    'meta.title': 'Hansler Tusevo | Développeur & Créateur IA',
    'meta.description': 'Hansler Tusevo – Développeur & Créateur de solutions digitales avec l\'IA. Portfolio professionnel basé à Kinshasa.',
    'meta.og.title': 'Hansler Tusevo | Développeur & Créateur IA',
    'meta.og.description': 'Je transforme les idées en expériences digitales intelligentes.',

    // Loader
    'loader.tagline': 'Développeur & Créateur IA',

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
    // Meta / SEO
    'meta.title': 'Hansler Tusevo | Developer & AI Creator',
    'meta.description': 'Hansler Tusevo – Developer & Creator of AI-powered digital solutions. Professional portfolio based in Kinshasa.',
    'meta.og.title': 'Hansler Tusevo | Developer & AI Creator',
    'meta.og.description': 'I turn ideas into intelligent digital experiences.',

    // Loader
    'loader.tagline': 'Developer & AI Creator',

    // Navbar
    'nav.about': 'About',
    'nav.skills': 'Skills',
    'nav.projects': 'Projects',
    'nav.services': 'Services',
    'nav.contact': 'Contact',
    'nav.cta': 'Collaborate',

    // Hero
    'hero.badge': 'Available · Kinshasa & International',
    'hero.desc': 'I design modern applications, interfaces and digital experiences to help businesses grow and stand out online.',
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

// ---- Full DOM-targeted translations ----
const domTranslations = {
  fr: {
    // ── LOADER ──
    '#loader .loader-tagline': { text: 'Développeur & Créateur IA' },

    // ── HERO PHOTO ALT ──
    '#heroPhoto': { attr: { alt: 'Hansler Tusevo – Développeur & Créateur IA' } },

    // ── IMPACT BAR ──
    '#impact-strong-1': { text: '+3 projets innovants' },
    '#impact-span-1': { text: 'Réalisés avec succès' },
    '#impact-strong-2': { text: 'Solutions basées sur l\'IA' },
    '#impact-span-2': { text: 'Automatisation & intelligence' },
    '#impact-strong-3': { text: 'Approche moderne' },
    '#impact-span-3': { text: 'Design & technologie de pointe' },

    // ── ABOUT ──
    '#about-tag': { text: 'À propos' },
    '#about-title': { text: 'Qui suis-je ?' },
    '#about-desc-1': { html: 'Je suis <strong>Hansler Tusevo</strong>, passionné par le développement, le design et l\'intelligence artificielle. Je crée des solutions digitales innovantes qui aident les entreprises à améliorer leur présence en ligne et à augmenter leur impact.' },
    '#about-desc-2': { html: 'Mon objectif est de combiner <span class="text-gold">technologie</span> et <span class="text-gold">créativité</span> pour proposer des produits modernes, efficaces et adaptés aux besoins actuels.' },
    '#about-vision-title': { text: 'Ma Vision' },
    '#about-vision-text': { text: '"Créer des solutions digitales intelligentes qui transforment les idées en produits concrets et performants."' },
    '#about-hl-1-title': { text: 'Développement Full-Stack' },
    '#about-hl-1-sub': { text: 'Applications web & mobiles modernes' },
    '#about-hl-2-title': { text: 'Intelligence Artificielle' },
    '#about-hl-2-sub': { text: 'Automatisation & solutions intelligentes' },
    '#about-hl-3-title': { text: 'Design & Branding' },
    '#about-hl-3-sub': { text: 'Identité visuelle haut de gamme' },
    '#about-cta': { text: 'Travaillons ensemble' },

    // ── SKILLS ──
    '#skills-tag': { text: 'Expertise' },
    '#skills-title': { text: 'Mes Compétences' },
    '#skill-1-title': { text: 'Développeur Web' },
    '#skill-1-li-1': { text: 'Applications web et mobiles' },
    '#skill-1-li-2': { text: 'Solutions digitales sur mesure' },
    '#skill-1-li-3': { text: 'Intégration IA' },
    '#skill-2-title': { text: 'Intelligence Artificielle' },
    '#skill-2-li-1': { text: 'Automatisation' },
    '#skill-2-li-2': { text: 'Génération de contenu' },
    '#skill-2-li-3': { text: 'Applications intelligentes' },
    '#skill-3-title': { text: 'Design' },
    '#skill-3-li-1': { text: 'Portfolio professionnel' },
    '#skill-3-li-2': { text: 'Branding & identité visuelle' },
    '#skill-3-li-3': { text: 'Conception Graphique' },
    '#skill-4-title': { text: 'Community Manager' },
    '#skill-4-li-1': { text: 'Gestion de communauté' },
    '#skill-4-li-2': { text: 'Création de contenus' },
    '#skill-4-li-3': { text: 'Comptes monétisables (FB, IG, TT, Pin)' },
    '#cv-download-text': { text: 'Télécharger mon CV' },

    // ── PROJECTS ──
    '#projects-tag': { text: 'Portfolio' },
    '#projects-title': { text: 'Projets Récents' },
    '#projects-sub': { text: 'Des solutions innovantes conçues pour transformer votre présence digitale' },
    // Project cards
    '#proj1-desc': { text: 'Portfolio e-commerce luxe pour une boutique de vêtements, perruques et accessoires avec un design haut de gamme.' },
    '#proj1-details': { html: '<i class="fa-solid fa-expand"></i> Détails' },
    '#proj2-title': { text: 'Application Beauté IA' },
    '#proj2-desc': { text: 'Application intelligente qui analyse le visage et propose des produits de beauté adaptés et des recommandations naturelles.' },
    '#proj2-details': { html: '<i class="fa-solid fa-expand"></i> Détails' },
    '#proj3-badge': { text: 'Éducation' },
    '#proj3-desc': { text: 'Plateforme digitale de gestion académique (rattrapages) incluant suivi des étudiants, résultats et interfaces d\'administration.' },
    '#proj3-details': { html: '<i class="fa-solid fa-expand"></i> Détails' },
    // Modal 1 – DND Store
    '#modal1-tag': { text: 'E-Commerce · Design · Développement Web' },
    '#modal1-desc': { text: 'Création d\'un portfolio e-commerce moderne et luxueux pour une boutique spécialisée dans les vêtements, perruques et accessoires. Interface haut de gamme, expérience utilisateur soignée et catalogue produit dynamique.' },
    '#modal1-feat-1': { html: '<i class="fa-solid fa-check"></i> Design premium et luxueux' },
    '#modal1-feat-2': { html: '<i class="fa-solid fa-check"></i> Catalogue produits dynamique' },
    '#modal1-feat-3': { html: '<i class="fa-solid fa-check"></i> Interface responsive mobile & desktop' },
    '#modal1-feat-4': { html: '<i class="fa-solid fa-check"></i> Optimisation SEO & vitesse' },
    '#modal1-visit': { html: '<i class="fa-solid fa-rocket"></i> Visiter le site' },
    '#modal1-source': { html: '<i class="fa-brands fa-github"></i> Code Source' },
    // Modal 2 – Beauty AI
    '#modal2-tag': { text: 'Intelligence Artificielle · Mobile · Beauté' },
    '#modal2-title': { text: 'Application Beauté IA' },
    '#modal2-desc': { text: 'Application intelligente utilisant la vision par ordinateur pour analyser le type de peau et les traits du visage, puis proposer des produits de beauté personnalisés et des routines naturelles adaptées.' },
    '#modal2-feat-1': { html: '<i class="fa-solid fa-check"></i> Analyse faciale par IA' },
    '#modal2-feat-2': { html: '<i class="fa-solid fa-check"></i> Recommandations personnalisées' },
    '#modal2-feat-3': { html: '<i class="fa-solid fa-check"></i> Base de données produits beauté' },
    '#modal2-feat-4': { html: '<i class="fa-solid fa-check"></i> Conseils naturels & bio' },
    // Modal 3 – Camille Retake Hub
    '#modal3-tag': { text: 'Éducation · Gestion · FinTech' },
    '#modal3-desc': { text: 'Plateforme dédiée à la gestion des rattrapages scolaires. Elle permet aux étudiants de suivre leurs résultats et aux administrateurs de gérer les sessions de reprise de manière fluide et transparente.' },
    '#modal3-feat-1': { html: '<i class="fa-solid fa-check"></i> Gestion des rattrapages & sessions' },
    '#modal3-feat-2': { html: '<i class="fa-solid fa-check"></i> Consultation des résultats en temps réel' },
    '#modal3-feat-3': { html: '<i class="fa-solid fa-check"></i> Interface administrateur intuitive' },
    '#modal3-feat-4': { html: '<i class="fa-solid fa-check"></i> Système de notification automatique' },
    '#modal3-github': { html: '<i class="fa-brands fa-github"></i> Voir sur GitHub' },

    // ── SERVICES ──
    '#services-tag': { text: 'Offres' },
    '#services-title': { text: 'Mes Services' },
    '#services-sub': { text: 'Des solutions complètes pour propulser votre présence digitale' },
    '#svc1-title': { text: 'Création de sites web' },
    '#svc1-desc': { text: 'Développement de solutions digitales sur mesure : Portfolios premium, Applications Web complexes et Applications Mobiles performantes.' },
    '#svc1-link': { html: 'Demander <i class="fa-solid fa-arrow-right"></i>' },
    '#svc2-title': { text: 'Workflow IA' },
    '#svc2-desc': { text: 'Optimisation de processus métiers via l\'IA, automatisation intelligente et intégration de modèles de langage de pointe.' },
    '#svc2-link': { html: 'Demander <i class="fa-solid fa-arrow-right"></i>' },
    '#svc3-title': { text: 'UI/UX Design' },
    '#svc3-desc': { text: 'Conception d\'interfaces centrées utilisateur, prototypage interactif et création d\'identités visuelles percutantes.' },
    '#svc3-link': { html: 'Demander <i class="fa-solid fa-arrow-right"></i>' },
    '#svc4-title': { text: 'Stratégie Digitale' },
    '#svc4-desc': { text: 'Conseil stratégique, audit et solutions de croissance pour maximiser votre impact et votre visibilité en ligne.' },
    '#svc4-link': { html: 'Demander <i class="fa-solid fa-arrow-right"></i>' },

    // ── CONVERSION ──
    '#conv-tag': { text: 'Collaboration' },
    '#conv-title': { html: 'Vous avez un projet ?<br>Transformons-le en solution digitale.' },
    '#conv-desc': { text: 'Je suis disponible pour de nouveaux projets, du freelance et des collaborations internationales.' },
    '#conv-cta-primary': { text: 'Obtenir un site comme celui-ci' },
    '#conv-cta-glass': { text: 'Voir mes réalisations' },

    // ── CONTACT ──
    '#contact-tag': { text: 'Contact' },
    '#contact-title': { text: 'Travaillons Ensemble' },
    '#contact-sub': { text: 'Vous avez un projet ? Je suis disponible pour en discuter.' },
    '#loc-label': { text: 'Localisation' },
    '#email-label': { text: 'Envoyer un email' },
    '#contact-avail': { text: 'Disponible pour du freelance & projets internationaux' },
    '#fname': { attr: { placeholder: 'Votre nom' } },
    '#femail': { attr: { placeholder: 'Email' } },
    '#fsubject': { attr: { placeholder: 'Sujet du projet' } },
    '#fmessage': { attr: { placeholder: 'Décrivez votre projet...' } },
    '#fname-label': { text: 'Nom' },
    '#femail-label': { text: 'Email' },
    '#fsubject-label': { text: 'Sujet' },
    '#fmessage-label': { text: 'Message' },
    '#submitBtn span': { text: 'Envoyer le message' },
    '#formSuccess': { html: '<i class="fa-solid fa-circle-check"></i> Merci ! Je vous répondrai très prochainement.' },

    // ── FOOTER ──
    '#footer-brand-desc': { html: 'Développeur & Créateur de solutions digitales avec l\'IA — Kinshasa, RDC' },
    '#footer-sig': { text: '"Je transforme les idées en expériences digitales intelligentes."' },
    '#footer-nav-title': { text: 'Navigation' },
    '#footer-nav-about': { text: 'À propos' },
    '#footer-nav-skills': { text: 'Compétences' },
    '#footer-nav-projects': { text: 'Projets' },
    '#footer-svc-title': { text: 'Services' },
    '#footer-svc-web': { text: 'Portfolio web' },
    '#footer-svc-ai': { text: 'Apps IA' },
    '#footer-svc-design': { text: 'Design' },
  },

  en: {
    // ── LOADER ──
    '#loader .loader-tagline': { text: 'Developer & AI Creator' },

    // ── HERO PHOTO ALT ──
    '#heroPhoto': { attr: { alt: 'Hansler Tusevo – Developer & AI Creator' } },

    // ── IMPACT BAR ──
    '#impact-strong-1': { text: '+3 innovative projects' },
    '#impact-span-1': { text: 'Successfully delivered' },
    '#impact-strong-2': { text: 'AI-powered solutions' },
    '#impact-span-2': { text: 'Automation & intelligence' },
    '#impact-strong-3': { text: 'Modern approach' },
    '#impact-span-3': { text: 'Cutting-edge design & technology' },

    // ── ABOUT ──
    '#about-tag': { text: 'About' },
    '#about-title': { text: 'Who am I?' },
    '#about-desc-1': { html: 'I am <strong>Hansler Tusevo</strong>, passionate about development, design and artificial intelligence. I build innovative digital solutions that help businesses strengthen their online presence and amplify their impact.' },
    '#about-desc-2': { html: 'My goal is to blend <span class="text-gold">technology</span> and <span class="text-gold">creativity</span> to deliver modern, efficient products tailored to today\'s needs.' },
    '#about-vision-title': { text: 'My Vision' },
    '#about-vision-text': { text: '"Building intelligent digital solutions that turn ideas into concrete, high-performing products."' },
    '#about-hl-1-title': { text: 'Full-Stack Development' },
    '#about-hl-1-sub': { text: 'Modern web & mobile applications' },
    '#about-hl-2-title': { text: 'Artificial Intelligence' },
    '#about-hl-2-sub': { text: 'Automation & intelligent solutions' },
    '#about-hl-3-title': { text: 'Design & Branding' },
    '#about-hl-3-sub': { text: 'Premium visual identity' },
    '#about-cta': { text: "Let's work together" },

    // ── SKILLS ──
    '#skills-tag': { text: 'Expertise' },
    '#skills-title': { text: 'My Skills' },
    '#skill-1-title': { text: 'Web Developer' },
    '#skill-1-li-1': { text: 'Web & mobile applications' },
    '#skill-1-li-2': { text: 'Custom digital solutions' },
    '#skill-1-li-3': { text: 'AI integration' },
    '#skill-2-title': { text: 'Artificial Intelligence' },
    '#skill-2-li-1': { text: 'Automation' },
    '#skill-2-li-2': { text: 'Content generation' },
    '#skill-2-li-3': { text: 'Smart applications' },
    '#skill-3-title': { text: 'Design' },
    '#skill-3-li-1': { text: 'Professional portfolio' },
    '#skill-3-li-2': { text: 'Branding & visual identity' },
    '#skill-3-li-3': { text: 'Graphic design' },
    '#skill-4-title': { text: 'Community Manager' },
    '#skill-4-li-1': { text: 'Community management' },
    '#skill-4-li-2': { text: 'Content creation' },
    '#skill-4-li-3': { text: 'Monetizable accounts (FB, IG, TT, Pin)' },
    '#cv-download-text': { text: 'Download my CV' },

    // ── PROJECTS ──
    '#projects-tag': { text: 'Portfolio' },
    '#projects-title': { text: 'Recent Projects' },
    '#projects-sub': { text: 'Innovative solutions designed to transform your digital presence' },
    // Project cards
    '#proj1-desc': { text: 'Luxury e-commerce portfolio for a clothing, wigs and accessories boutique — premium design and seamless user experience.' },
    '#proj1-details': { html: '<i class="fa-solid fa-expand"></i> Details' },
    '#proj2-title': { text: 'Beauty AI App' },
    '#proj2-desc': { text: 'Smart application that analyses facial features and recommends personalised beauty products and natural care routines.' },
    '#proj2-details': { html: '<i class="fa-solid fa-expand"></i> Details' },
    '#proj3-badge': { text: 'Education' },
    '#proj3-desc': { text: 'Digital academic management platform (retake exams) including student tracking, results and administration interfaces.' },
    '#proj3-details': { html: '<i class="fa-solid fa-expand"></i> Details' },
    // Modal 1 – DND Store
    '#modal1-tag': { text: 'E-Commerce · Design · Web Development' },
    '#modal1-desc': { text: 'A modern, luxury e-commerce portfolio for a boutique specialising in clothing, wigs and accessories. Premium interface, refined user experience and dynamic product catalogue.' },
    '#modal1-feat-1': { html: '<i class="fa-solid fa-check"></i> Premium luxury design' },
    '#modal1-feat-2': { html: '<i class="fa-solid fa-check"></i> Dynamic product catalogue' },
    '#modal1-feat-3': { html: '<i class="fa-solid fa-check"></i> Responsive mobile & desktop interface' },
    '#modal1-feat-4': { html: '<i class="fa-solid fa-check"></i> SEO & performance optimisation' },
    '#modal1-visit': { html: '<i class="fa-solid fa-rocket"></i> Visit the site' },
    '#modal1-source': { html: '<i class="fa-brands fa-github"></i> Source Code' },
    // Modal 2 – Beauty AI
    '#modal2-tag': { text: 'Artificial Intelligence · Mobile · Beauty' },
    '#modal2-title': { text: 'Beauty AI App' },
    '#modal2-desc': { text: 'Smart application using computer vision to analyse skin type and facial features, then recommend personalised beauty products and tailored natural routines.' },
    '#modal2-feat-1': { html: '<i class="fa-solid fa-check"></i> AI-powered facial analysis' },
    '#modal2-feat-2': { html: '<i class="fa-solid fa-check"></i> Personalised recommendations' },
    '#modal2-feat-3': { html: '<i class="fa-solid fa-check"></i> Beauty product database' },
    '#modal2-feat-4': { html: '<i class="fa-solid fa-check"></i> Natural & organic advice' },
    // Modal 3 – Camille Retake Hub
    '#modal3-tag': { text: 'Education · Management · FinTech' },
    '#modal3-desc': { text: 'Platform dedicated to managing academic retake sessions. It allows students to track their results and administrators to manage retake schedules smoothly and transparently.' },
    '#modal3-feat-1': { html: '<i class="fa-solid fa-check"></i> Retake session management' },
    '#modal3-feat-2': { html: '<i class="fa-solid fa-check"></i> Real-time results tracking' },
    '#modal3-feat-3': { html: '<i class="fa-solid fa-check"></i> Intuitive admin interface' },
    '#modal3-feat-4': { html: '<i class="fa-solid fa-check"></i> Automatic notification system' },
    '#modal3-github': { html: '<i class="fa-brands fa-github"></i> View on GitHub' },

    // ── SERVICES ──
    '#services-tag': { text: 'Services' },
    '#services-title': { text: 'My Services' },
    '#services-sub': { text: 'Complete solutions to boost your digital presence' },
    '#svc1-title': { text: 'Website Creation' },
    '#svc1-desc': { text: 'Custom digital development: premium portfolios, complex web applications and high-performance mobile apps.' },
    '#svc1-link': { html: 'Request <i class="fa-solid fa-arrow-right"></i>' },
    '#svc2-title': { text: 'AI Workflow' },
    '#svc2-desc': { text: 'Business process optimisation through AI, intelligent automation and integration of cutting-edge language models.' },
    '#svc2-link': { html: 'Request <i class="fa-solid fa-arrow-right"></i>' },
    '#svc3-title': { text: 'UI/UX Design' },
    '#svc3-desc': { text: 'User-centred interface design, interactive prototyping and creation of impactful visual identities.' },
    '#svc3-link': { html: 'Request <i class="fa-solid fa-arrow-right"></i>' },
    '#svc4-title': { text: 'Digital Strategy' },
    '#svc4-desc': { text: 'Strategic consulting, auditing and growth solutions to maximise your online impact and visibility.' },
    '#svc4-link': { html: 'Request <i class="fa-solid fa-arrow-right"></i>' },

    // ── CONVERSION ──
    '#conv-tag': { text: 'Collaboration' },
    '#conv-title': { html: 'Got a project?<br>Let\'s turn it into a digital solution.' },
    '#conv-desc': { text: 'I\'m available for new projects, freelance work and international collaborations.' },
    '#conv-cta-primary': { text: 'Get a site like this one' },
    '#conv-cta-glass': { text: 'View my work' },

    // ── CONTACT ──
    '#contact-tag': { text: 'Contact' },
    '#contact-title': { text: "Let's Work Together" },
    '#contact-sub': { text: "Got a project? I'm available to discuss it." },
    '#loc-label': { text: 'Location' },
    '#email-label': { text: 'Send an email' },
    '#contact-avail': { text: 'Available for freelance & international projects' },
    '#fname': { attr: { placeholder: 'Your name' } },
    '#femail': { attr: { placeholder: 'Email' } },
    '#fsubject': { attr: { placeholder: 'Project subject' } },
    '#fmessage': { attr: { placeholder: 'Describe your project...' } },
    '#fname-label': { text: 'Name' },
    '#femail-label': { text: 'Email' },
    '#fsubject-label': { text: 'Subject' },
    '#fmessage-label': { text: 'Message' },
    '#submitBtn span': { text: 'Send message' },
    '#formSuccess': { html: '<i class="fa-solid fa-circle-check"></i> Thank you! I\'ll get back to you very soon.' },

    // ── FOOTER ──
    '#footer-brand-desc': { html: 'Developer & Creator of AI-powered digital solutions — Kinshasa, DRC' },
    '#footer-sig': { text: '"I turn ideas into intelligent digital experiences."' },
    '#footer-nav-title': { text: 'Navigation' },
    '#footer-nav-about': { text: 'About' },
    '#footer-nav-skills': { text: 'Skills' },
    '#footer-nav-projects': { text: 'Projects' },
    '#footer-svc-title': { text: 'Services' },
    '#footer-svc-web': { text: 'Web portfolio' },
    '#footer-svc-ai': { text: 'AI Apps' },
    '#footer-svc-design': { text: 'Design' },
  }
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

  // 2) Apply DOM-targeted translations
  const map = domTranslations[lang];
  for (const selector in map) {
    const rule = map[selector];
    try {
      const els = document.querySelectorAll(selector);
      els.forEach(el => {
        if (rule.text !== undefined) el.textContent = rule.text;
        if (rule.html !== undefined) el.innerHTML = rule.html;
        if (rule.attr) {
          for (const attr in rule.attr) {
            el.setAttribute(attr, rule.attr[attr]);
          }
        }
      });
    } catch (e) { /* invalid selector */ }
  }

  // 3) Update typed phrases
  if (typedPhrases[lang]) {
    phrases.length = 0;
    typedPhrases[lang].forEach(p => phrases.push(p));
  }

  // 4) Update <html lang=""> attribute
  document.documentElement.lang = lang;

  // 5) Update SEO meta tags
  updateSEO(lang);

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

function updateSEO(lang) {
  const t = translations[lang];

  // <title>
  document.title = t['meta.title'];

  // <meta name="description">
  let desc = document.querySelector('meta[name="description"]');
  if (!desc) { desc = document.createElement('meta'); desc.name = 'description'; document.head.appendChild(desc); }
  desc.content = t['meta.description'];

  // Open Graph
  let ogTitle = document.querySelector('meta[property="og:title"]');
  if (!ogTitle) { ogTitle = document.createElement('meta'); ogTitle.setAttribute('property', 'og:title'); document.head.appendChild(ogTitle); }
  ogTitle.content = t['meta.og.title'];

  let ogDesc = document.querySelector('meta[property="og:description"]');
  if (!ogDesc) { ogDesc = document.createElement('meta'); ogDesc.setAttribute('property', 'og:description'); document.head.appendChild(ogDesc); }
  ogDesc.content = t['meta.og.description'];

  // hreflang alternate links
  ['fr', 'en'].forEach(l => {
    let existing = document.querySelector(`link[hreflang="${l}"]`);
    if (!existing) {
      existing = document.createElement('link');
      existing.rel = 'alternate';
      existing.setAttribute('hreflang', l);
      existing.href = window.location.href;
      document.head.appendChild(existing);
    }
  });
}

// Apply saved language on load (after loader finishes)
setTimeout(() => {
  setLang(currentLang);
}, 3400);
