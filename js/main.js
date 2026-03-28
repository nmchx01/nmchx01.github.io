/**
 * main.js — Portafolio Nicolás Monroy Chaparro
 * ─────────────────────────────────────────────
 * Módulos:
 *   1. Navegación móvil
 *   2. Scroll reveal
 *   3. Navbar (fondo + enlace activo)
 *   4. Parallax hero
 *   5. Partículas
 *   6. Efecto vidrio roto (hero image)
 */

'use strict';

// ═══════════════════════════════════════════════════════════
// 1. NAVEGACIÓN MÓVIL
// ═══════════════════════════════════════════════════════════
function initMobileNav() {
  const hamburger = document.getElementById('navHamburger');
  const navLinks  = document.getElementById('navLinks');
  const navCta    = document.getElementById('navCta');

  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
    navCta.classList.toggle('open');
  });

  navLinks.querySelectorAll('a').forEach(link =>
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
      navCta.classList.remove('open');
    })
  );
}

// ═══════════════════════════════════════════════════════════
// 2. SCROLL REVEAL
// ═══════════════════════════════════════════════════════════
function initScrollReveal() {
  const observer = new IntersectionObserver(
    entries => entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add('visible');
    }),
    { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
  );

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// ═══════════════════════════════════════════════════════════
// 3. NAVBAR — FONDO Y ENLACE ACTIVO
// ═══════════════════════════════════════════════════════════
function initNavbar() {
  const navbar     = document.getElementById('navbar');
  const sections   = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a');

  if (!navbar) return;

  // Fondo al hacer scroll
  window.addEventListener('scroll', () => {
    navbar.style.background = window.scrollY > 60
      ? 'rgba(5,5,8,.88)'
      : 'rgba(5,5,8,.6)';
  }, { passive: true });

  // Resaltar enlace de la sección visible
  const activeObserver = new IntersectionObserver(
    entries => entries.forEach(e => {
      if (!e.isIntersecting) return;
      navAnchors.forEach(a => {
        a.style.color = a.getAttribute('href') === '#' + e.target.id
          ? 'var(--cyan)'
          : '';
      });
    }),
    { threshold: 0.25 }
  );

  sections.forEach(s => activeObserver.observe(s));
}

// ═══════════════════════════════════════════════════════════
// 4. PARALLAX HERO
// ═══════════════════════════════════════════════════════════
function initParallax() {
  const heroContent = document.querySelector('.hero-content');
  if (!heroContent) return;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY < window.innerHeight) {
      heroContent.style.transform = `translateY(${scrollY * 0.15}px)`;
      heroContent.style.opacity   = 1 - scrollY / (window.innerHeight * 0.9);
    }
  }, { passive: true });
}

// ═══════════════════════════════════════════════════════════
// 5. PARTÍCULAS
// ═══════════════════════════════════════════════════════════
function initParticles() {
  const canvas = document.getElementById('particles');
  if (!canvas) return;

  const ctx              = canvas.getContext('2d');
  const PARTICLE_COUNT   = 70;
  const CONNECTION_DIST  = 120;
  let width, height, particles;

  function resize() {
    const hero = document.getElementById('hero');
    width  = canvas.width  = hero.offsetWidth;
    height = canvas.height = hero.offsetHeight;
  }

  function createParticles() {
    particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x:       Math.random() * width,
      y:       Math.random() * height,
      r:       Math.random() * 1.6 + 0.3,
      dx:      (Math.random() - 0.5) * 0.35,
      dy:      (Math.random() - 0.5) * 0.35,
      opacity: Math.random() * 0.4 + 0.1,
    }));
  }

  function drawParticles() {
    ctx.clearRect(0, 0, width, height);

    // Dibujar partículas
    for (const p of particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,212,245,${p.opacity})`;
      ctx.fill();

      p.x += p.dx;
      p.y += p.dy;
      if (p.x < 0) p.x = width;
      if (p.x > width)  p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;
    }

    // Dibujar conexiones entre partículas cercanas
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx   = particles[i].x - particles[j].x;
        const dy   = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < CONNECTION_DIST) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0,212,245,${0.05 * (1 - dist / CONNECTION_DIST)})`;
          ctx.lineWidth   = 0.5;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(drawParticles);
  }

  resize();
  createParticles();
  drawParticles();
  window.addEventListener('resize', () => { resize(); createParticles(); });
}

// ═══════════════════════════════════════════════════════════
// 6. EFECTO VIDRIO ROTO (HERO IMAGE)
//    Scroll hacia abajo → imagen se rompe en fragmentos
//    Scroll hacia arriba → se reconstruye sola
// ═══════════════════════════════════════════════════════════
function initShatterEffect() {
  const heroSection = document.getElementById('hero');
  const heroImg     = document.querySelector('.hero-bg-img img');
  if (!heroImg || !heroSection) return;

  // ── Crear canvas para el efecto ──────────────────────────
  const canvas = document.createElement('canvas');
  canvas.style.cssText = [
    'position:absolute', 'inset:0', 'width:100%', 'height:100%',
    'z-index:1', 'pointer-events:none',
  ].join(';');
  heroSection.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  // ── Estado ────────────────────────────────────────────────
  let shards          = [];
  let width           = 0;
  let height          = 0;
  let currentProgress = 0;  // valor real animado
  let targetProgress  = 0;  // valor objetivo según scroll

  // ── Imagen fuente ─────────────────────────────────────────
  const img  = new Image();
  img.src    = heroImg.src;

  // ── Generación de fragmentos triangulares ─────────────────
  /**
   * Divide el canvas en una grilla irregular de triángulos.
   * Cada shard guarda sus vértices, centroide y parámetros de vuelo.
   */
  function generateShards(w, h) {
    const COLS = 9;
    const ROWS = 7;
    const pts  = [];

    // Crear puntos de grilla con desplazamiento aleatorio (jitter)
    for (let r = 0; r <= ROWS; r++) {
      for (let c = 0; c <= COLS; c++) {
        const isEdge = r === 0 || r === ROWS || c === 0 || c === COLS;
        const jx = isEdge ? 0 : (Math.random() - 0.5) * (w / COLS) * 0.55;
        const jy = isEdge ? 0 : (Math.random() - 0.5) * (h / ROWS) * 0.55;
        pts.push([
          (c / COLS) * w + jx,
          (r / ROWS) * h + jy,
        ]);
      }
    }

    const result = [];
    const cx = w / 2;
    const cy = h / 2;
    const maxDist = Math.sqrt(cx * cx + cy * cy);

    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const tl = pts[r       * (COLS + 1) + c];
        const tr = pts[r       * (COLS + 1) + c + 1];
        const bl = pts[(r + 1) * (COLS + 1) + c];
        const br = pts[(r + 1) * (COLS + 1) + c + 1];

        // Cada celda → 2 triángulos
        [[tl, tr, bl], [tr, br, bl]].forEach(tri => {
          // Centroide del triángulo
          const centX = (tri[0][0] + tri[1][0] + tri[2][0]) / 3;
          const centY = (tri[0][1] + tri[1][1] + tri[2][1]) / 3;

          // Vector de dispersión desde el centro de la imagen
          const dirX = centX - cx;
          const dirY = centY - cy;
          const len  = Math.sqrt(dirX * dirX + dirY * dirY) || 1;

          // Los fragmentos del borde vuelan más lejos
          const spread = 0.5 + (len / maxDist) * 1.0;

          result.push({
            verts:    tri,
            centX,
            centY,
            velX:     (dirX / len) * spread * (w * 0.28 + Math.random() * w * 0.18),
            velY:     (dirY / len) * spread * (h * 0.28 + Math.random() * h * 0.18),
            rotSpeed: (Math.random() - 0.5) * Math.PI * 2.2,
          });
        });
      }
    }

    return result;
  }

  // ── Setup / resize ────────────────────────────────────────
  function setup() {
    width  = canvas.width  = heroSection.offsetWidth;
    height = canvas.height = heroSection.offsetHeight;
    shards = generateShards(width, height);
  }

  // ── Interpolación lineal ──────────────────────────────────
  function lerp(a, b, t) { return a + (b - a) * t; }

  // ── Dibujo de un frame ────────────────────────────────────
  function drawShards(progress) {
    ctx.clearRect(0, 0, width, height);
    if (!img.complete || !img.naturalWidth) return;

    for (const shard of shards) {
      const tx      = shard.velX * progress;
      const ty      = shard.velY * progress;
      const rot     = shard.rotSpeed * progress;
      const opacity = Math.max(0, 1 - progress * 0.9);

      ctx.save();
      ctx.globalAlpha = opacity * 0.20; // mantener la misma opacidad base del hero

      // Transformar: trasladar al centroide → rotar → volver
      ctx.translate(shard.centX + tx, shard.centY + ty);
      ctx.rotate(rot);
      ctx.translate(-shard.centX, -shard.centY);

      // Recortar al triángulo del shard
      ctx.beginPath();
      ctx.moveTo(shard.verts[0][0], shard.verts[0][1]);
      ctx.lineTo(shard.verts[1][0], shard.verts[1][1]);
      ctx.lineTo(shard.verts[2][0], shard.verts[2][1]);
      ctx.closePath();
      ctx.clip();

      // Dibujar la porción de imagen que corresponde
      ctx.drawImage(img, 0, 0, width, height);

      // Borde brillante entre fragmentos (efecto vidrio)
      if (progress > 0.04) {
        ctx.globalAlpha = progress * 0.6;
        ctx.strokeStyle = `rgba(0,212,245,1)`;
        ctx.lineWidth   = 0.7;
        ctx.stroke();
      }

      ctx.restore();
    }
  }

  // ── Loop de animación ─────────────────────────────────────
  function animate() {
    // Suavizado: interpola hacia el target con easing
    currentProgress = lerp(currentProgress, targetProgress, 0.07);
    drawShards(currentProgress);

    // Mostrar u ocultar la img CSS original según el estado
    heroImg.style.opacity = currentProgress < 0.02 ? '0.20' : '0';

    requestAnimationFrame(animate);
  }

  // ── Vincular al scroll ────────────────────────────────────
  function onScroll() {
    const heroHeight = heroSection.offsetHeight;
    // Progreso: 0 en el top → 1 cuando se ha scrolleado 75% del hero
    targetProgress = Math.min(1, Math.max(0, window.scrollY / (heroHeight * 0.75)));
  }

  // ── Iniciar cuando la imagen esté lista ──────────────────
  function start() {
    setup();
    animate();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', setup);
  }

  if (img.complete && img.naturalWidth) {
    start();
  } else {
    img.addEventListener('load', start);
  }
}

// ═══════════════════════════════════════════════════════════
// PUNTO DE ENTRADA — ejecutar cuando el DOM esté listo
// ═══════════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initScrollReveal();
  initNavbar();
  initParallax();
  initParticles();
  initShatterEffect();
});
