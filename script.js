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
