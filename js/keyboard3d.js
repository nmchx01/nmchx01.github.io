/**
 * keyboard3d.js — Teclado 3D estilo Stripe
 * Vanilla Three.js (r128) — sin frameworks ni build step
 *
 * Features:
 * - 18 teclas con el stack tecnológico de Nicolás
 * - Color único por tecla (emissive glow)
 * - Flotación sinusoidal independiente por tecla
 * - Hover: glow intenso + escala up
 * - Click: press animation + panel de info
 * - Cámara con deriva suave al mover el ratón
 */

(function () {
  'use strict';

  // ─── Stack tecnológico ────────────────────────────────────────
  const SKILLS = [
    // Frontend
    { id: 'html',    short: 'HTML',  name: 'HTML5',          color: 0xe34c26, desc: 'Estructura semántica y accesible de páginas web modernas.',            tag: 'Frontend' },
    { id: 'css',     short: 'CSS',   name: 'CSS3',           color: 0x1572b6, desc: 'Estilos avanzados: Flexbox, Grid, animaciones y diseño responsivo.',    tag: 'Frontend' },
    { id: 'js',      short: 'JS',    name: 'JavaScript',     color: 0xf7df1e, desc: 'Lógica del cliente, DOM, fetch API y programación asíncrona.',          tag: 'Frontend' },
    { id: 'tw',      short: 'TW',    name: 'Tailwind CSS',   color: 0x38bdf8, desc: 'Utility-first CSS framework para interfaces rápidas y consistentes.',  tag: 'Frontend' },
    // Data & Backend
    { id: 'py',      short: 'PY',    name: 'Python',         color: 0x3572a5, desc: 'Scripts de automatización, análisis de datos y backend con Flask.',    tag: 'Data & Backend' },
    { id: 'sql',     short: 'SQL',   name: 'SQL',            color: 0x00758f, desc: 'Consultas complejas, JOINs, subconsultas y optimización de índices.',   tag: 'Data & Backend' },
    { id: 'pg',      short: 'PG',    name: 'PostgreSQL',     color: 0x336791, desc: 'Base de datos relacional robusta con soporte para JSON y full-text.',   tag: 'Data & Backend' },
    { id: 'pbi',     short: 'PBI',   name: 'Power BI',       color: 0xf2c811, desc: 'Dashboards interactivos y reportes ejecutivos con conexión a datos.',   tag: 'Data & Backend' },
    { id: 'dax',     short: 'DAX',   name: 'DAX',            color: 0xf7931e, desc: 'Lenguaje de fórmulas para cálculos y KPIs en modelos tabulares.',       tag: 'Data & Backend' },
    // DevOps & Cloud
    { id: 'git',     short: 'GIT',   name: 'Git',            color: 0xf05032, desc: 'Control de versiones, flujos de trabajo y resolución de conflictos.',   tag: 'DevOps & Cloud' },
    { id: 'gh',      short: 'GH',    name: 'GitHub',         color: 0x6e5494, desc: 'Repositorios, GitHub Actions, Pages y colaboración open source.',       tag: 'DevOps & Cloud' },
    { id: 'dk',      short: 'DK',    name: 'Docker',         color: 0x2496ed, desc: 'Contenedores reproducibles para desarrollo y despliegue consistente.',  tag: 'DevOps & Cloud' },
    { id: 'az',      short: 'AZ',    name: 'Azure',          color: 0x0089d6, desc: 'Servicios en la nube: VMs, Storage, Functions y Azure DevOps.',         tag: 'DevOps & Cloud' },
    // Ciberseguridad
    { id: 'ow',      short: 'OW',    name: 'OWASP',          color: 0xff4444, desc: 'Top 10 vulnerabilidades web y prácticas de secure development.',        tag: 'Ciberseguridad' },
    // AI & Microsoft
    { id: 'cp',      short: 'COP',   name: 'Copilot',        color: 0x7c7fff, desc: 'Asistente IA de Microsoft integrado en VS Code y Microsoft 365.',       tag: 'AI & Microsoft' },
    { id: 'pp',      short: 'PP',    name: 'Power Platform', color: 0x742774, desc: 'Power Apps, Power Automate y conectores para automatización low-code.',  tag: 'AI & Microsoft' },
    { id: 'cl',      short: 'CL',    name: 'Claude AI',      color: 0xd97757, desc: 'LLM de Anthropic para razonamiento avanzado y asistencia técnica.',     tag: 'AI & Microsoft' },
    { id: 'ag',      short: 'AG',    name: 'Antigravity',    color: 0x00d4f5, desc: 'Plataforma de automatización inteligente para flujos empresariales.',   tag: 'AI & Microsoft' },
  ];

  // ─── Layout de teclas (4 filas) ──────────────────────────────
  const ROW_LAYOUT  = [[0,1,2,3], [4,5,6,7,8], [9,10,11,12], [13,14,15,16,17]];
  const ROW_X_SHIFT = [0, 0.22, 0.44, 0.66];
  const STEP  = 1.18;
  const ROW_Z = 1.18;

  function buildKeyDefs() {
    const defs = [];
    const rows = ROW_LAYOUT.length;
    ROW_LAYOUT.forEach(function(row, ri) {
      const startX = -(row.length - 1) * STEP / 2 + ROW_X_SHIFT[ri];
      const z = (ri - (rows - 1) / 2) * ROW_Z;
      row.forEach(function(si, ci) {
        const s = SKILLS[si];
        if (!s) return;
        defs.push({
          skill:       s,
          position:    new THREE.Vector3(startX + ci * STEP, 0, z),
          floatOffset: Math.random() * Math.PI * 2,
        });
      });
    });
    return defs;
  }

  // ─── Textura canvas para la cara del keycap ──────────────────
  function makeCapTexture(label, hex) {
    var S   = 256;
    var cv  = document.createElement('canvas');
    cv.width = cv.height = S;
    var ctx = cv.getContext('2d');
    var r = (hex >> 16) & 0xff, g = (hex >> 8) & 0xff, b = hex & 0xff;

    // Fondo oscuro
    ctx.fillStyle = 'rgb(' + Math.round(r*.18+8) + ',' + Math.round(g*.18+8) + ',' + Math.round(b*.18+14) + ')';
    ctx.fillRect(0, 0, S, S);

    // Glow radial del color de acento
    var bg = ctx.createRadialGradient(S*.5, S*.35, 0, S*.5, S*.5, S*.65);
    bg.addColorStop(0, 'rgba('+r+','+g+','+b+',0.35)');
    bg.addColorStop(1, 'rgba('+r+','+g+','+b+',0)');
    ctx.fillStyle = bg; ctx.fillRect(0, 0, S, S);

    // Brillo superior
    var shine = ctx.createLinearGradient(0, 0, 0, S*.46);
    shine.addColorStop(0, 'rgba(255,255,255,0.25)');
    shine.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = shine; ctx.fillRect(0, 0, S, S*.46);

    // Borde interior
    ctx.strokeStyle = 'rgba('+Math.min(r+80,255)+','+Math.min(g+80,255)+','+Math.min(b+80,255)+',0.22)';
    ctx.lineWidth = 6; ctx.strokeRect(8, 8, S-16, S-16);

    // Sombra inferior
    var shadow = ctx.createLinearGradient(0, S*.58, 0, S);
    shadow.addColorStop(0, 'rgba(0,0,0,0)');
    shadow.addColorStop(1, 'rgba(0,0,0,0.50)');
    ctx.fillStyle = shadow; ctx.fillRect(0, S*.58, S, S*.42);

    // Texto
    ctx.fillStyle = 'rgba(235,245,255,0.96)';
    var fs = label.length > 5 ? 34 : label.length > 4 ? 40 :
             label.length > 3 ? 50 : label.length > 2 ? 62 : 78;
    ctx.font = 'bold ' + fs + 'px monospace';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.shadowColor = 'rgba('+r+','+g+','+b+',0.9)'; ctx.shadowBlur = 14;
    ctx.fillText(label, S/2, S/2 + 8);
    ctx.shadowBlur = 0;

    return new THREE.CanvasTexture(cv);
  }

  // ─── Inicialización principal ─────────────────────────────────
  function init() {
    var canvas = document.getElementById('keyboardCanvas3d');
    if (!canvas || typeof THREE === 'undefined') return;

    var W = canvas.clientWidth  || 880;
    var H = canvas.clientHeight || 500;

    // Renderer
    var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H, false);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type    = THREE.PCFSoftShadowMap;
    renderer.toneMapping       = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    renderer.setClearColor(0x06061a, 1);

    // Scene
    var scene = new THREE.Scene();
    scene.background = new THREE.Color(0x06061a);

    // Camera
    var camera = new THREE.PerspectiveCamera(40, W / H, 0.1, 100);
    camera.position.set(0, 7.6, 11.2);
    camera.lookAt(0.3, 0, 0);

    // ── Luces ──────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0x8899cc, 0.6));

    var keyLight = new THREE.DirectionalLight(0xffffff, 3.0);
    keyLight.position.set(3, 14, 10);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width  = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.camera.left   = -9;
    keyLight.shadow.camera.right  =  9;
    keyLight.shadow.camera.top    =  7;
    keyLight.shadow.camera.bottom = -7;
    keyLight.shadow.bias = -0.001;
    scene.add(keyLight);

    var fillLight = new THREE.DirectionalLight(0x2244aa, 0.8);
    fillLight.position.set(-9, 6, 3);
    scene.add(fillLight);

    var rimLight = new THREE.DirectionalLight(0x00d4f5, 0.9);
    rimLight.position.set(0, 5, -10);
    scene.add(rimLight);

    // ── Bandeja base ───────────────────────────────────────────
    var trayMat = new THREE.MeshStandardMaterial({ color: 0x06060f, roughness: 0.12, metalness: 0.88 });
    var tray = new THREE.Mesh(new THREE.BoxGeometry(9.6, 0.22, 6.4), trayMat);
    tray.position.set(0.18, -0.13, 0);
    tray.receiveShadow = true;
    scene.add(tray);

    var edgeMat = new THREE.MeshBasicMaterial({ color: 0x00D4F5, transparent: true, opacity: 0.10 });
    var edge = new THREE.Mesh(new THREE.BoxGeometry(9.68, 0.007, 6.48), edgeMat);
    edge.position.set(0.18, -0.01, 0);
    scene.add(edge);

    // ── Teclas ─────────────────────────────────────────────────
    var keyDefs  = buildKeyDefs();
    var keyObjs  = [];
    var capMeshes = [];
    var raycaster = new THREE.Raycaster();
    var mouse2D   = new THREE.Vector2();

    keyDefs.forEach(function(kd) {
      var s      = kd.skill;
      var accent = new THREE.Color(s.color);

      var group = new THREE.Group();
      group.position.copy(kd.position);

      // Stem
      var stemCol = new THREE.Color(s.color);
      stemCol.multiplyScalar(0.12);
      stemCol.lerp(new THREE.Color(0x08080f), 0.65);
      var stem = new THREE.Mesh(
        new THREE.BoxGeometry(0.82, 0.14, 0.82),
        new THREE.MeshStandardMaterial({ color: stemCol, roughness: 0.80, metalness: 0.15 })
      );
      stem.position.y = 0.07;
      stem.castShadow = true;
      group.add(stem);

      // Cap
      var capBaseCol = new THREE.Color(s.color);
      capBaseCol.multiplyScalar(0.30);
      capBaseCol.lerp(new THREE.Color(0x1a1a2e), 0.55);
      var capMat = new THREE.MeshStandardMaterial({
        color: capBaseCol,
        roughness: 0.55,
        metalness: 0.10,
        emissive: accent.clone(),
        emissiveIntensity: 0.35,
      });
      var capMesh = new THREE.Mesh(new THREE.BoxGeometry(0.96, 0.28, 0.96), capMat);
      capMesh.position.y = 0.30;
      capMesh.castShadow    = true;
      capMesh.receiveShadow = true;
      group.add(capMesh);
      capMeshes.push(capMesh);

      // Label plane
      var labelTex = makeCapTexture(s.short, s.color);
      var labelMat = new THREE.MeshStandardMaterial({
        map: labelTex,
        roughness: 0.40, metalness: 0.08,
        transparent: true, opacity: 1.0,
        emissive: accent.clone(),
        emissiveIntensity: 0.20,
      });
      var labelMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.82, 0.82), labelMat);
      labelMesh.position.y = 0.448;
      labelMesh.rotation.x = -Math.PI / 2;
      group.add(labelMesh);

      // Point light por tecla
      var pl = new THREE.PointLight(accent.clone(), 1.5, 2.8, 2);
      pl.position.y = 1.2;
      group.add(pl);

      scene.add(group);

      var ko = {
        kd:        kd,
        group:     group,
        capMesh:   capMesh,
        capMat:    capMat,
        labelMat:  labelMat,
        pl:        pl,
        hovered:   false,
        pressed:   false,
        yPress:    0,
      };
      capMesh.userData.ko = ko;
      keyObjs.push(ko);
    });

    // ── Mouse ──────────────────────────────────────────────────
    var mouseNorm = { x: 0, y: 0 };

    var sect = canvas.closest ? canvas.closest('#tech') : document.getElementById('tech');
    var evTarget = sect || canvas;

    evTarget.addEventListener('mousemove', function(e) {
      var rect = canvas.getBoundingClientRect();
      var cx = e.clientX - rect.left;
      var cy = e.clientY - rect.top;
      mouseNorm.x = cx / rect.width  - 0.5;
      mouseNorm.y = cy / rect.height - 0.5;

      mouse2D.x =  (cx / rect.width)  * 2 - 1;
      mouse2D.y = -(cy / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse2D, camera);
      var hits = raycaster.intersectObjects(capMeshes, false);
      var hitMesh = hits.length > 0 ? hits[0].object : null;
      var anyHit = false;
      keyObjs.forEach(function(ko) {
        ko.hovered = ko.capMesh === hitMesh;
        if (ko.hovered) anyHit = true;
      });
      canvas.style.cursor = anyHit ? 'pointer' : '';
    });

    evTarget.addEventListener('mouseleave', function() {
      mouseNorm.x = 0; mouseNorm.y = 0;
      keyObjs.forEach(function(ko) { ko.hovered = false; });
      canvas.style.cursor = '';
    });

    canvas.addEventListener('mousedown', function(e) {
      var rect = canvas.getBoundingClientRect();
      mouse2D.x =  ((e.clientX - rect.left) / rect.width)  * 2 - 1;
      mouse2D.y = -(((e.clientY - rect.top)  / rect.height) * 2 - 1);
      raycaster.setFromCamera(mouse2D, camera);
      var hits = raycaster.intersectObjects(capMeshes, false);
      if (hits.length > 0) {
        var ko = hits[0].object.userData.ko;
        if (ko) {
          ko.pressed = true;
          showKeyInfo(ko.kd.skill);
          setTimeout(function() { ko.pressed = false; }, 140);
        }
      }
    });

    function showKeyInfo(s) {
      var box  = document.getElementById('keyInfo');
      var name = document.getElementById('kiName');
      var desc = document.getElementById('kiDesc');
      var tag  = document.getElementById('kiTag');
      if (!box || !name || !desc || !tag) return;
      name.textContent  = s.name;
      desc.textContent  = s.desc;
      tag.textContent   = s.tag;
      tag.style.display = 'inline-block';
      box.classList.add('visible');
    }

    // ── Resize ─────────────────────────────────────────────────
    var resizeObs = new ResizeObserver(function() {
      var w = canvas.clientWidth;
      var h = canvas.clientHeight;
      if (w === 0 || h === 0) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    });
    resizeObs.observe(canvas);

    // ── Animation loop ─────────────────────────────────────────
    var camCurX = 0, camCurY = 0;
    var clock   = new THREE.Clock();
    var rafId;

    function animate() {
      rafId = requestAnimationFrame(animate);
      var t = clock.getElapsedTime();

      // Camera drift suave
      camCurX += (mouseNorm.x * 0.65 - camCurX) * 0.04;
      camCurY += (mouseNorm.y * 0.28 - camCurY) * 0.04;
      camera.position.set(camCurX, 7.6 - camCurY, 11.2);
      camera.lookAt(0.30 + camCurX * 0.15, camCurY * 0.08, 0);

      // Animar teclas
      keyObjs.forEach(function(ko) {
        var floatSpeed = ko.hovered ? 2.2  : 1.1;
        var floatAmp   = ko.hovered ? 0.15 : 0.065;
        var floatY = Math.sin(t * floatSpeed + ko.kd.floatOffset) * floatAmp;

        var pressTarget = ko.pressed ? -0.18 : 0;
        ko.yPress += (pressTarget - ko.yPress) * 0.22;

        ko.group.position.y = ko.kd.position.y + floatY + ko.yPress;

        // Scale
        var sTarget = ko.hovered ? 1.06 : 1.0;
        var sCur    = ko.group.scale.x;
        ko.group.scale.setScalar(sCur + (sTarget - sCur) * 0.14);

        // Glow
        var gTarget = ko.pressed ? 0.85 : ko.hovered ? 0.68 : 0.35;
        ko.capMat.emissiveIntensity  += (gTarget         - ko.capMat.emissiveIntensity)  * 0.14;
        ko.labelMat.emissiveIntensity += ((gTarget * 0.6) - ko.labelMat.emissiveIntensity) * 0.14;
        ko.pl.intensity += ((ko.hovered ? 4.0 : ko.pressed ? 5.5 : 1.5) - ko.pl.intensity) * 0.14;
      });

      renderer.render(scene, camera);
    }

    animate();

    // Pausa cuando la sección no es visible (ahorra batería)
    if (typeof IntersectionObserver !== 'undefined') {
      var io = new IntersectionObserver(function(entries) {
        if (entries[0].isIntersecting) {
          clock.start();
        } else {
          clock.stop();
        }
      }, { threshold: 0.1 });
      io.observe(canvas);
    }
  }

  // Esperar a que el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
