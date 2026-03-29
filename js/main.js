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
 *   7. Teclado 3D interactivo — Three.js
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
// 7. TECLADO 3D — Three.js
//    Keycaps con geometría real, hover, press, cámara dinámica
// ═══════════════════════════════════════════════════════════
function initTechKeyboard() {
  const canvas  = document.getElementById('keyboardCanvas');
  const infoBox = document.getElementById('keyInfo');
  const kiName  = document.getElementById('kiName');
  const kiDesc  = document.getElementById('kiDesc');
  const kiTag   = document.getElementById('kiTag');

  if (!canvas || typeof THREE === 'undefined') return;
  if (kiTag) kiTag.style.display = 'none';

  // ── Datos del stack tecnológico ──────────────────────────
  // [fila, col, etiqueta, nombre, colorHex, colorOscuroHex, descripción, categoría]
  const KEY_DATA = [
    [0,0,'HTML','HTML5',        0xc0391b,0x7a2210,'Lenguaje de marcado base de la web. Estructura semántica y accesible para todos los proyectos frontend.','Frontend'],
    [0,1,'CSS', 'CSS3',         0x1f4cc7,0x0f2870,'Diseño visual y responsive. Animaciones, variables CSS, flexbox y grid para interfaces modernas.','Frontend'],
    [0,2,'JS',  'JavaScript',   0xc9a800,0x7a6700,'Lenguaje principal del frontend. Lógica de interacción, DOM, eventos y programación asíncrona.','Frontend'],
    [0,3,'PY',  'Python',       0x2b6fa8,0x163a5c,'Lenguaje versátil para scripting, análisis de datos y automatización de tareas.','Backend'],
    [0,4,'SQL', 'SQL',          0x2d5f8a,0x163047,'Lenguaje de consulta para bases de datos relacionales. Queries, joins y modelado de datos.','Bases de datos'],
    [1,0,'PBI', 'Power BI',     0xb89700,0x6e5b00,'Plataforma de Business Intelligence de Microsoft. Dashboards interactivos con DAX.','Data & Analytics'],
    [1,1,'DAX', 'DAX',          0x6b3fa0,0x3b2060,'Data Analysis Expressions. Medidas calculadas y KPIs para modelos de datos en Power BI.','Data & Analytics'],
    [1,2,'GIT', 'Git',          0xc0390b,0x7a2006,'Control de versiones distribuido. Branching, merging y gestión de historial de cambios.','DevOps'],
    [1,3,'HUB', 'GitHub',       0x22272e,0x0d0f12,'Alojamiento de repositorios. Colaboración, pull requests y despliegue con GitHub Pages.','DevOps'],
    [2,0,'OWASP','OWASP',       0x005a6e,0x002e38,'Open Worldwide Application Security Project. Top 10 de vulnerabilidades web.','Ciberseguridad'],
    [2,1,'CPL', 'Copilot Studio',0x4a4ac8,0x26267a,'Plataforma Microsoft para crear bots con IA. Temas, triggers y automatización sin código.','Microsoft AI'],
    [2,2,'PPL', 'Power Platform',0x5c1f5c,0x2e0f2e,'Ecosistema low-code: Power BI, Power Apps, Power Automate y Copilot Studio integrados.','Microsoft AI'],
  ];

  // ── Geometría ────────────────────────────────────────────
  const CAP_W = 1.0, CAP_H = 0.24, CAP_D = 1.0;
  const STM_H = 0.18;
  const STEP  = 1.15;  // separación entre centros de teclas

  // Número de teclas por fila y escalonado horizontal (stagger)
  const ROW_INFO = [
    { count: 5, xShift: 0.00 },
    { count: 4, xShift: 0.28 },
    { count: 3, xShift: 0.56 },
  ];

  function keyX(row, col) {
    const { count, xShift } = ROW_INFO[row];
    return -(count - 1) * STEP / 2 + xShift + col * STEP;
  }
  function keyZ(row) { return (row - 1) * STEP; }

  // ── Escena ───────────────────────────────────────────────
  const scene = new THREE.Scene();

  // ── Cámara ───────────────────────────────────────────────
  const w0 = canvas.clientWidth  || 600;
  const h0 = canvas.clientHeight || 440;
  const camera = new THREE.PerspectiveCamera(42, w0 / h0, 0.1, 100);
  camera.position.set(0, 7.2, 10.8);
  camera.lookAt(0.27, 0, 0);

  // ── Renderer ─────────────────────────────────────────────
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(w0, h0, false);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type    = THREE.PCFSoftShadowMap;

  // ── Iluminación ──────────────────────────────────────────
  scene.add(new THREE.AmbientLight(0x0d1a2a, 4.5));

  const sun = new THREE.DirectionalLight(0xffffff, 2.8);
  sun.position.set(3, 12, 7);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  sun.shadow.camera.left = sun.shadow.camera.bottom = -6;
  sun.shadow.camera.right = sun.shadow.camera.top   =  6;
  scene.add(sun);

  const rimLight = new THREE.DirectionalLight(0x00D4F5, 0.55);
  rimLight.position.set(-5, 2, -5);
  scene.add(rimLight);

  const cyanPoint = new THREE.PointLight(0x00D4F5, 0.45, 20);
  cyanPoint.position.set(0.27, 3.5, 1.5);
  scene.add(cyanPoint);

  // ── Base del teclado ─────────────────────────────────────
  const trayMesh = new THREE.Mesh(
    new THREE.BoxGeometry(7.8, 0.25, 5.0),
    new THREE.MeshStandardMaterial({ color: 0x070710, roughness: 0.25, metalness: 0.75 })
  );
  trayMesh.position.set(0.28, -0.135, 0);
  trayMesh.receiveShadow = true;
  scene.add(trayMesh);

  // Línea de borde cyan muy sutil en la base
  const edgeMesh = new THREE.Mesh(
    new THREE.BoxGeometry(7.82, 0.01, 5.02),
    new THREE.MeshBasicMaterial({ color: 0x00D4F5, transparent: true, opacity: 0.06 })
  );
  edgeMesh.position.set(0.28, -0.015, 0);
  scene.add(edgeMesh);

  // ── Textura canvas para la cara superior de cada tecla ───
  function makeCapTexture(label, hexColor) {
    const size = 256;
    const cv   = document.createElement('canvas');
    cv.width = cv.height = size;
    const ctx  = cv.getContext('2d');

    const r = (hexColor >> 16) & 0xff;
    const g = (hexColor >>  8) & 0xff;
    const b =  hexColor        & 0xff;

    // Fondo
    ctx.fillStyle = `rgb(${r},${g},${b})`;
    ctx.fillRect(0, 0, size, size);

    // Brillo superior (luz reflejada)
    const shine = ctx.createLinearGradient(0, 0, 0, size * 0.48);
    shine.addColorStop(0, 'rgba(255,255,255,0.20)');
    shine.addColorStop(1, 'rgba(255,255,255,0.00)');
    ctx.fillStyle = shine;
    ctx.fillRect(0, 0, size, size * 0.48);

    // Borde interno
    ctx.strokeStyle = 'rgba(255,255,255,0.09)';
    ctx.lineWidth   = 10;
    ctx.strokeRect(10, 10, size - 20, size - 20);

    // Sombra inferior
    const shadow = ctx.createLinearGradient(0, size * 0.58, 0, size);
    shadow.addColorStop(0, 'rgba(0,0,0,0.00)');
    shadow.addColorStop(1, 'rgba(0,0,0,0.30)');
    ctx.fillStyle = shadow;
    ctx.fillRect(0, size * 0.58, size, size * 0.42);

    // Etiqueta de texto
    const lum      = 0.299 * r + 0.587 * g + 0.114 * b;
    ctx.fillStyle  = lum > 145 ? 'rgba(5,5,20,0.88)' : 'rgba(255,255,255,0.93)';
    const fontSize = label.length > 4 ? 40 : label.length > 3 ? 48 : label.length > 2 ? 60 : 74;
    ctx.font            = `bold ${fontSize}px monospace`;
    ctx.textAlign       = 'center';
    ctx.textBaseline    = 'middle';
    ctx.fillText(label, size / 2, size / 2 + 10);

    return new THREE.CanvasTexture(cv);
  }

  // ── Crear teclas ─────────────────────────────────────────
  const capGeo  = new THREE.BoxGeometry(CAP_W, CAP_H, CAP_D);
  const stemGeo = new THREE.BoxGeometry(0.87, STM_H, 0.87);

  const keyObjs   = [];   // estado de animación
  const capMeshes = [];   // objetivos del raycaster

  KEY_DATA.forEach(([row, col, label, name, color, dark, desc, tag]) => {
    const x = keyX(row, col);
    const z = keyZ(row);

    // ── Tallo (stem) ──
    const stemMat  = new THREE.MeshStandardMaterial({ color: dark, roughness: 0.78, metalness: 0.22 });
    const stemMesh = new THREE.Mesh(stemGeo, stemMat);
    stemMesh.position.set(x, STM_H / 2, z);
    stemMesh.castShadow    = true;
    stemMesh.receiveShadow = true;
    scene.add(stemMesh);

    // ── Keycap ──
    const tex = makeCapTexture(label, color);
    // BoxGeometry: caras 0=+X 1=-X 2=+Y(top) 3=-Y 4=+Z 5=-Z
    const capMats = [
      new THREE.MeshStandardMaterial({ color, roughness: 0.55, metalness: 0.2 }),  // +X
      new THREE.MeshStandardMaterial({ color, roughness: 0.55, metalness: 0.2 }),  // -X
      new THREE.MeshStandardMaterial({ map: tex, roughness: 0.4, metalness: 0.12 }), // +Y ← label
      new THREE.MeshStandardMaterial({ color: dark, roughness: 0.6, metalness: 0.2 }), // -Y
      new THREE.MeshStandardMaterial({ color, roughness: 0.55, metalness: 0.2 }),  // +Z
      new THREE.MeshStandardMaterial({ color, roughness: 0.55, metalness: 0.2 }),  // -Z
    ];
    const capMesh = new THREE.Mesh(capGeo, capMats);
    const restY   = STM_H + CAP_H / 2;
    capMesh.position.set(x, restY, z);
    capMesh.castShadow    = true;
    capMesh.receiveShadow = true;
    capMesh.userData      = { name, desc, tag };
    scene.add(capMesh);
    capMeshes.push(capMesh);

    keyObjs.push({
      capMesh, stemMesh,
      restY,
      targetY:  restY,
      currentY: restY,
      pressed:  false,
    });
  });

  // ── Raycasting ───────────────────────────────────────────
  const raycaster = new THREE.Raycaster();
  const mouse     = new THREE.Vector2(-999, -999);

  function updateMouseNDC(e) {
    const rect = canvas.getBoundingClientRect();
    const src  = e.touches ? e.touches[0] : e;
    mouse.x =  ((src.clientX - rect.left) / rect.width)  * 2 - 1;
    mouse.y = -((src.clientY - rect.top)  / rect.height) * 2 + 1;
  }

  function castRay() {
    raycaster.setFromCamera(mouse, camera);
    const hits = raycaster.intersectObjects(capMeshes);
    if (!hits.length) return null;
    return keyObjs.find(k => k.capMesh === hits[0].object) || null;
  }

  // ── Hover ────────────────────────────────────────────────
  let hoveredKO  = null;
  let camTargetX = 0;
  let camTargetY = 0;

  canvas.addEventListener('mousemove', e => {
    updateMouseNDC(e);
    const hit = castRay();

    if (hit !== hoveredKO) {
      if (hoveredKO && !hoveredKO.pressed) hoveredKO.targetY = hoveredKO.restY;
      hoveredKO = hit;
      if (hoveredKO && !hoveredKO.pressed) hoveredKO.targetY = hoveredKO.restY + 0.15;
      canvas.style.cursor = hoveredKO ? 'pointer' : '';
    }

    // Deriva suave de la cámara con el ratón
    const rect = canvas.getBoundingClientRect();
    camTargetX = ((e.clientX - rect.left) / rect.width  - 0.5) * 1.5;
    camTargetY = ((e.clientY - rect.top)  / rect.height - 0.5) * 0.7;
  });

  canvas.addEventListener('mouseleave', () => {
    if (hoveredKO && !hoveredKO.pressed) hoveredKO.targetY = hoveredKO.restY;
    hoveredKO  = null;
    camTargetX = 0;
    camTargetY = 0;
    mouse.set(-999, -999);
    canvas.style.cursor = '';
  });

  // ── Press ────────────────────────────────────────────────
  function pressKey(ko) {
    if (!ko || ko.pressed) return;
    ko.pressed = true;
    ko.targetY = ko.restY - 0.11;

    if (infoBox) {
      kiName.textContent  = ko.capMesh.userData.name;
      kiDesc.textContent  = ko.capMesh.userData.desc;
      kiTag.textContent   = ko.capMesh.userData.tag;
      kiTag.style.display = ko.capMesh.userData.tag ? 'inline-block' : 'none';
      infoBox.classList.add('visible');
    }

    setTimeout(() => {
      ko.pressed = false;
      ko.targetY = hoveredKO === ko ? ko.restY + 0.15 : ko.restY;
    }, 145);
  }

  canvas.addEventListener('mousedown', () => pressKey(castRay()));
  canvas.addEventListener('touchstart', e => {
    e.preventDefault();
    updateMouseNDC(e);
    pressKey(castRay());
  }, { passive: false });

  // Teclado físico — atajos 1-5, q-r, a-d
  const shortcuts = ['1','2','3','4','5','q','w','e','r','a','s','d'];
  document.addEventListener('keydown', e => {
    const idx = shortcuts.indexOf(e.key.toLowerCase());
    if (idx !== -1 && keyObjs[idx]) pressKey(keyObjs[idx]);
  });

  // ── Interpolación lineal ─────────────────────────────────
  function lerp(a, b, t) { return a + (b - a) * t; }

  // ── Estado de cámara ─────────────────────────────────────
  let camCurX = 0;
  let camCurY = 0;

  // ── Loop de animación ────────────────────────────────────
  function animate() {
    requestAnimationFrame(animate);

    // Animar teclas
    for (const ko of keyObjs) {
      ko.currentY           = lerp(ko.currentY, ko.targetY, 0.22);
      ko.capMesh.position.y = ko.currentY;
    }

    // Deriva suave de la cámara
    camCurX = lerp(camCurX, camTargetX, 0.045);
    camCurY = lerp(camCurY, camTargetY, 0.045);
    camera.position.x = camCurX * 0.55;
    camera.position.y = 7.2 - camCurY * 0.35;
    camera.position.z = 10.8 + Math.abs(camCurX) * 0.15;
    camera.lookAt(0.27 + camCurX * 0.18, camCurY * 0.12, 0);

    // Pulso del punto de luz cyan
    const t = Date.now() * 0.001;
    cyanPoint.intensity = 0.40 + Math.sin(t * 0.9) * 0.08;

    renderer.render(scene, camera);
  }

  animate();

  // ── Resize ───────────────────────────────────────────────
  window.addEventListener('resize', () => {
    const nw = canvas.clientWidth;
    const nh = canvas.clientHeight;
    if (!nw || !nh) return;
    camera.aspect = nw / nh;
    camera.updateProjectionMatrix();
    renderer.setSize(nw, nh, false);
  });
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
  initTechKeyboard();
});
