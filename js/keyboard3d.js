/**
 * keyboard3d.js — Teclado 3D con logos de tecnologías
 * Vanilla Three.js (r128) — sin frameworks ni build step
 *
 * Características:
 * - 18 teclas con logos SVG de cada tecnología
 * - Keycaps redondeados con ExtrudeGeometry
 * - Colores vibrantes y mate
 * - Cámara diagonal lateral
 * - Animaciones de hover/click
 */

(function () {
  'use strict';

  // ─── Stack tecnológico ───────────────────────────────────────────
  var SKILLS = [
    // Frontend
    { id: 'html', short: 'HTML5',  name: 'HTML5',          color: 0xe44d26, desc: 'Estructura semántica y accesible de páginas web modernas.',            tag: 'Frontend' },
    { id: 'css',  short: 'CSS3',   name: 'CSS3',           color: 0x1572b6, desc: 'Estilos avanzados: Flexbox, Grid, animaciones y diseño responsivo.',    tag: 'Frontend' },
    { id: 'js',   short: 'JS',     name: 'JavaScript',     color: 0xf0d000, desc: 'Lógica del cliente, DOM, fetch API y programación asíncrona.',          tag: 'Frontend' },
    { id: 'tw',   short: 'TW',     name: 'Tailwind CSS',   color: 0x06b6d4, desc: 'Utility-first CSS framework para interfaces rápidas y consistentes.',  tag: 'Frontend' },
    // Data & Backend
    { id: 'py',   short: 'Python', name: 'Python',         color: 0x4b8bbe, desc: 'Scripts de automatización, análisis de datos y backend con Flask.',    tag: 'Data & Backend' },
    { id: 'sql',  short: 'SQL',    name: 'SQL',            color: 0x00adb5, desc: 'Consultas complejas, JOINs, subconsultas y optimización de índices.',   tag: 'Data & Backend' },
    { id: 'pg',   short: 'PG',     name: 'PostgreSQL',     color: 0x336791, desc: 'Base de datos relacional robusta con soporte para JSON y full-text.',   tag: 'Data & Backend' },
    { id: 'pbi',  short: 'PBI',    name: 'Power BI',       color: 0xf2c811, desc: 'Dashboards interactivos y reportes ejecutivos con conexión a datos.',   tag: 'Data & Backend' },
    { id: 'dax',  short: 'DAX',    name: 'DAX',            color: 0xf7931e, desc: 'Lenguaje de fórmulas para cálculos y KPIs en modelos tabulares.',       tag: 'Data & Backend' },
    // DevOps & Cloud
    { id: 'git',  short: 'Git',    name: 'Git',            color: 0xf05032, desc: 'Control de versiones, flujos de trabajo y resolución de conflictos.',   tag: 'DevOps & Cloud' },
    { id: 'gh',   short: 'GitHub', name: 'GitHub',         color: 0x8b72be, desc: 'Repositorios, GitHub Actions, Pages y colaboración open source.',       tag: 'DevOps & Cloud' },
    { id: 'dk',   short: 'Docker', name: 'Docker',         color: 0x2496ed, desc: 'Contenedores reproducibles para desarrollo y despliegue consistente.',  tag: 'DevOps & Cloud' },
    { id: 'az',   short: 'Azure',  name: 'Azure',          color: 0x0078d4, desc: 'Servicios en la nube: VMs, Storage, Functions y Azure DevOps.',         tag: 'DevOps & Cloud' },
    // Ciberseguridad
    { id: 'ow',   short: 'OWASP',  name: 'OWASP',          color: 0xff4444, desc: 'Top 10 vulnerabilidades web y prácticas de secure development.',        tag: 'Ciberseguridad' },
    // AI & Microsoft
    { id: 'cp',   short: 'Copilot',name: 'Copilot',        color: 0x7b68ee, desc: 'Asistente IA de Microsoft integrado en VS Code y Microsoft 365.',       tag: 'AI & Microsoft' },
    { id: 'pp',   short: 'PP',     name: 'Power Platform', color: 0x742774, desc: 'Power Apps, Power Automate y conectores para automatización low-code.',  tag: 'AI & Microsoft' },
    { id: 'cl',   short: 'Claude', name: 'Claude AI',      color: 0xd97757, desc: 'LLM de Anthropic para razonamiento avanzado y asistencia técnica.',     tag: 'AI & Microsoft' },
    { id: 'ag',   short: 'AG',     name: 'Antigravity',    color: 0x00d4f5, desc: 'Plataforma de automatización inteligente para flujos empresariales.',   tag: 'AI & Microsoft' },
  ];

  // ─── Layout de teclas (4 filas) ─────────────────────────────────
  var ROW_LAYOUT  = [[0,1,2,3], [4,5,6,7,8], [9,10,11,12], [13,14,15,16,17]];
  var ROW_X_SHIFT = [0, 0.22, 0.44, 0.66];
  var STEP   = 1.20;
  var ROW_Z  = 1.22;

  // Dimensiones del keycap
  var CAP_SHP_W = 0.82;   // ancho del shape (antes del bevel)
  var CAP_SHP_D = 0.82;   // profundidad del shape
  var CAP_H     = 0.34;   // altura extruída
  var CAP_R     = 0.13;   // radio de esquinas
  var CAP_BEV   = 0.055;  // bevel size (expansión exterior)
  var STEM_H    = 0.14;   // altura del tallo
  var CAP_TOP   = STEM_H + CAP_H; // y del tope del keycap

  // ─── Precargar imágenes SVG ──────────────────────────────────────
  var IMG_BASE = 'images/icons/';
  var IMG_SRCS = {
    html: IMG_BASE + 'html.svg',
    css:  IMG_BASE + 'css.svg',
    js:   IMG_BASE + 'js.svg',
    tw:   IMG_BASE + 'tw.svg',
    py:   IMG_BASE + 'py.svg',
    sql:  IMG_BASE + 'sql.svg',
    pg:   IMG_BASE + 'pg.svg',
    pbi:  IMG_BASE + 'pbi.svg',
    dax:  IMG_BASE + 'dax.svg',
    git:  IMG_BASE + 'git.svg',
    gh:   IMG_BASE + 'gh.svg',
    dk:   IMG_BASE + 'dk.svg',
    az:   IMG_BASE + 'az.svg',
    ow:   IMG_BASE + 'ow.svg',
    cp:   IMG_BASE + 'cp.svg',
    pp:   IMG_BASE + 'pp.svg',
    cl:   IMG_BASE + 'cl.svg',
    ag:   IMG_BASE + 'ag.svg',
  };

  function preloadImages(srcMap, callback) {
    var keys   = Object.keys(srcMap);
    var total  = keys.length;
    var loaded = 0;
    var result = {};

    keys.forEach(function (key) {
      var img = new Image();
      img.onload = function () {
        result[key] = img;
        if (++loaded === total) callback(result);
      };
      img.onerror = function () {
        if (++loaded === total) callback(result);
      };
      img.src = srcMap[key];
    });
  }

  // ─── Geometría keycap redondeado ─────────────────────────────────
  function makeRoundedCapGeo() {
    var hw = CAP_SHP_W / 2, hd = CAP_SHP_D / 2, r = CAP_R;
    var shape = new THREE.Shape();

    shape.moveTo(-hw + r, -hd);
    shape.lineTo( hw - r, -hd);
    shape.quadraticCurveTo( hw, -hd,  hw, -hd + r);
    shape.lineTo( hw,  hd - r);
    shape.quadraticCurveTo( hw,  hd,  hw - r,  hd);
    shape.lineTo(-hw + r,  hd);
    shape.quadraticCurveTo(-hw,  hd, -hw,  hd - r);
    shape.lineTo(-hw, -hd + r);
    shape.quadraticCurveTo(-hw, -hd, -hw + r, -hd);

    var geo = new THREE.ExtrudeGeometry(shape, {
      steps:          1,
      depth:          CAP_H,
      bevelEnabled:   true,
      bevelThickness: 0.055,
      bevelSize:      CAP_BEV,
      bevelOffset:    0,
      bevelSegments:  5,
    });

    geo.rotateX(-Math.PI / 2);
    return geo;
  }

  // ─── Canvas helper: ruta de rect redondeado ──────────────────────
  function roundRectPath(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y,     x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h,     x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y,         x + r, y);
    ctx.closePath();
  }

  // ─── Textura canvas con logo + etiqueta ──────────────────────────
  function makeCapTexture(label, hex, logoImg) {
    var S   = 256;
    var cv  = document.createElement('canvas');
    cv.width = cv.height = S;
    var ctx = cv.getContext('2d');

    var r = (hex >> 16) & 0xff;
    var g = (hex >> 8)  & 0xff;
    var b =  hex        & 0xff;

    // Fondo oscuro con ligero tinte del color
    ctx.fillStyle = 'rgb('
      + Math.round(r * 0.09 + 7) + ','
      + Math.round(g * 0.09 + 7) + ','
      + Math.round(b * 0.11 + 10) + ')';
    ctx.fillRect(0, 0, S, S);

    // Glow radial suave
    var grd = ctx.createRadialGradient(S / 2, S / 2, 5, S / 2, S / 2, S * 0.58);
    grd.addColorStop(0,   'rgba(' + r + ',' + g + ',' + b + ',0.28)');
    grd.addColorStop(0.5, 'rgba(' + r + ',' + g + ',' + b + ',0.10)');
    grd.addColorStop(1,   'rgba(0,0,0,0)');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, S, S);

    // Badge redondeado
    var pad = 16, br = 24;
    var bw = S - pad * 2, bh = S - pad * 2;
    roundRectPath(ctx, pad, pad, bw, bh, br);
    ctx.fillStyle = 'rgba(' + r + ',' + g + ',' + b + ',0.18)';
    ctx.fill();
    ctx.strokeStyle = 'rgba('
      + Math.min(r + 80, 255) + ','
      + Math.min(g + 80, 255) + ','
      + Math.min(b + 80, 255) + ',0.45)';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Brillo superior del badge
    roundRectPath(ctx, pad, pad, bw, bh * 0.42, [br, br, 0, 0]);
    var shine = ctx.createLinearGradient(0, pad, 0, S * 0.5);
    shine.addColorStop(0, 'rgba(255,255,255,0.17)');
    shine.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = shine;
    ctx.fill();

    if (logoImg) {
      // ── Con logo SVG ──
      var iconS = 128;
      var iconX = (S - iconS) / 2;
      var iconY = S * 0.08;

      // Sombra del icono (glow de color)
      ctx.shadowColor = 'rgba(' + r + ',' + g + ',' + b + ',0.90)';
      ctx.shadowBlur  = 22;
      ctx.globalAlpha = 0.95;
      ctx.drawImage(logoImg, iconX, iconY, iconS, iconS);
      ctx.globalAlpha = 1.0;
      ctx.shadowBlur  = 0;

      // Etiqueta pequeña debajo del logo
      var fs2 = label.length > 6 ? 22 : label.length > 4 ? 26 : 30;
      ctx.font         = 'bold ' + fs2 + 'px "Segoe UI", Arial, sans-serif';
      ctx.textAlign    = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle    = 'rgba(220,240,255,0.88)';
      ctx.fillText(label, S / 2, S * 0.855);

    } else {
      // ── Fallback: solo texto ──
      var fs = label.length > 5 ? 34 : label.length > 4 ? 42 :
               label.length > 3 ? 54 : label.length > 2 ? 65 : 80;
      ctx.font = 'bold ' + fs + 'px "Segoe UI", Arial, sans-serif';
      ctx.textAlign    = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor  = 'rgba(' + r + ',' + g + ',' + b + ',0.95)';
      ctx.shadowBlur   = 20;
      ctx.fillStyle    = 'rgba(238,250,255,0.97)';
      ctx.fillText(label, S / 2, S / 2 + 5);
      ctx.shadowBlur = 0;
    }

    return new THREE.CanvasTexture(cv);
  }

  // ─── Construir definiciones de teclas ────────────────────────────
  function buildKeyDefs() {
    var defs = [];
    var rows = ROW_LAYOUT.length;
    ROW_LAYOUT.forEach(function (row, ri) {
      var startX = -(row.length - 1) * STEP / 2 + ROW_X_SHIFT[ri];
      var z = (ri - (rows - 1) / 2) * ROW_Z;
      row.forEach(function (si, ci) {
        var s = SKILLS[si];
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

  // ─── Escena principal ────────────────────────────────────────────
  function buildScene(imgs) {
    var canvas = document.getElementById('keyboardCanvas3d');
    if (!canvas || typeof THREE === 'undefined') return;

    var W = canvas.clientWidth  || 880;
    var H = canvas.clientHeight || 500;

    // Renderer
    var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H, false);
    renderer.shadowMap.enabled   = true;
    renderer.shadowMap.type      = THREE.PCFSoftShadowMap;
    renderer.toneMapping         = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.90;
    renderer.setClearColor(0x05050f, 1);

    // Escena
    var scene = new THREE.Scene();
    scene.background = new THREE.Color(0x05050f);
    scene.fog = new THREE.FogExp2(0x05050f, 0.028);

    // Cámara — picado cercano con perspectiva 3D
    var camera = new THREE.PerspectiveCamera(52, W / H, 0.1, 100);
    camera.position.set(0.5, 8.5, 7.5);
    camera.lookAt(0.5, 0, 0.8);

    // ── Iluminación ────────────────────────────────────────────────
    // Menos luz ambiente para que los logos resalten
    scene.add(new THREE.AmbientLight(0x4455aa, 0.40));

    // Luz principal cálida — más suave para no quemar los logos
    var keyLight = new THREE.DirectionalLight(0xfff4e0, 1.6);
    keyLight.position.set(-2, 14, 10);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width  = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.camera.left   = -11;
    keyLight.shadow.camera.right  =  11;
    keyLight.shadow.camera.top    =   8;
    keyLight.shadow.camera.bottom =  -8;
    keyLight.shadow.bias = -0.0008;
    scene.add(keyLight);

    // Luz de relleno (lado izquierdo, azul)
    var fillLight = new THREE.DirectionalLight(0x1a3bcc, 0.7);
    fillLight.position.set(-10, 4, 2);
    scene.add(fillLight);

    // Luz de contorno (detrás, cian)
    var rimLight = new THREE.DirectionalLight(0x00d4f5, 0.55);
    rimLight.position.set(2, 3, -12);
    scene.add(rimLight);

    // Luz LED inferior trasera (glow ambiental)
    var ledBack = new THREE.PointLight(0x00c8ff, 4.0, 10, 2);
    ledBack.position.set(0, -0.2, -4.5);
    scene.add(ledBack);

    var ledRight = new THREE.PointLight(0x8844ff, 2.5, 8, 2);
    ledRight.position.set(6.5, 0.5, 0);
    scene.add(ledRight);

    // ── Bandeja / cuerpo del teclado ───────────────────────────────
    var TW = 10.6, TH = 0.60, TD = 7.4;

    // Base principal (marrón oscuro cálido)
    var tray = new THREE.Mesh(
      new THREE.BoxGeometry(TW, TH, TD),
      new THREE.MeshStandardMaterial({
        color:     0x1c0e08,
        roughness: 0.80,
        metalness: 0.04,
      })
    );
    tray.position.set(0.22, -TH / 2, 0);
    tray.receiveShadow = true;
    tray.castShadow    = true;
    scene.add(tray);

    // Borde superior de la bandeja (más claro, marrón rojizo)
    var trayEdge = new THREE.Mesh(
      new THREE.BoxGeometry(TW, 0.025, TD),
      new THREE.MeshStandardMaterial({
        color:     0x3d1a0c,
        roughness: 0.65,
        metalness: 0.08,
      })
    );
    trayEdge.position.set(0.22, 0.013, 0);
    scene.add(trayEdge);

    // Franja LED inferior trasera (emisiva, decorativa)
    var ledStrip = new THREE.Mesh(
      new THREE.BoxGeometry(TW - 0.4, 0.06, 0.12),
      new THREE.MeshStandardMaterial({
        color:             0x000000,
        emissive:          new THREE.Color(0x00c8ff),
        emissiveIntensity: 1.8,
        roughness:         1.0,
      })
    );
    ledStrip.position.set(0.22, -TH / 2 + 0.03, -TD / 2 + 0.06);
    scene.add(ledStrip);

    // ── Construcción de teclas ─────────────────────────────────────
    var keyDefs   = buildKeyDefs();
    var keyObjs   = [];
    var capMeshes = [];
    var sharedCapGeo = makeRoundedCapGeo();
    var raycaster    = new THREE.Raycaster();
    var mouse2D      = new THREE.Vector2();

    keyDefs.forEach(function (kd) {
      var s      = kd.skill;
      var accent = new THREE.Color(s.color);
      var group  = new THREE.Group();
      group.position.copy(kd.position);

      // Tallo (stem)
      var stemCol = new THREE.Color(s.color).multiplyScalar(0.08);
      stemCol.lerp(new THREE.Color(0x04040a), 0.72);
      var stem = new THREE.Mesh(
        new THREE.BoxGeometry(0.68, STEM_H, 0.68),
        new THREE.MeshStandardMaterial({ color: stemCol, roughness: 0.88, metalness: 0.05 })
      );
      stem.position.y = STEM_H / 2;
      stem.castShadow = true;
      group.add(stem);

      // Keycap — colores vibrantes mate (más saturados, menos mezcla con oscuro)
      var capColor = new THREE.Color(s.color).multiplyScalar(0.82);
      capColor.lerp(new THREE.Color(0x080810), 0.12);
      var capMat = new THREE.MeshStandardMaterial({
        color:             capColor,
        roughness:         0.88,
        metalness:         0.02,
        emissive:          accent.clone(),
        emissiveIntensity: 0.25,
      });
      var capMesh = new THREE.Mesh(sharedCapGeo, capMat);
      capMesh.position.y = STEM_H;
      capMesh.castShadow    = true;
      capMesh.receiveShadow = true;
      group.add(capMesh);
      capMeshes.push(capMesh);

      // Plano de etiqueta/logo (encima del keycap)
      // MeshBasicMaterial: ignora luces, muestra la textura SIEMPRE visible
      var logoImg  = imgs[s.id] || null;
      var labelTex = makeCapTexture(s.short, s.color, logoImg);
      var labelMat = new THREE.MeshBasicMaterial({
        map:        labelTex,
        transparent: false,
        depthWrite:  true,
      });
      var labelMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.90, 0.90), labelMat);
      labelMesh.position.y = CAP_TOP + 0.018;  // bien por encima del cap para evitar z-fighting
      labelMesh.rotation.x = -Math.PI / 2;
      group.add(labelMesh);

      // Luz puntual por tecla
      var pl = new THREE.PointLight(accent.clone(), 1.2, 2.8, 2);
      pl.position.y = 0.9;
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

    // ── Eventos de ratón ──────────────────────────────────────────
    var mouseNorm = { x: 0, y: 0 };
    var sect      = canvas.closest ? canvas.closest('#tech') : document.getElementById('tech');
    var evTarget  = sect || canvas;

    evTarget.addEventListener('mousemove', function (e) {
      var rect = canvas.getBoundingClientRect();
      var cx = e.clientX - rect.left;
      var cy = e.clientY - rect.top;
      mouseNorm.x = cx / rect.width  - 0.5;
      mouseNorm.y = cy / rect.height - 0.5;
      mouse2D.x =  (cx / rect.width)  * 2 - 1;
      mouse2D.y = -(cy / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse2D, camera);
      var hits    = raycaster.intersectObjects(capMeshes, false);
      var hitMesh = hits.length > 0 ? hits[0].object : null;
      var anyHit  = false;
      keyObjs.forEach(function (ko) {
        ko.hovered = ko.capMesh === hitMesh;
        if (ko.hovered) anyHit = true;
      });
      canvas.style.cursor = anyHit ? 'pointer' : '';
    });

    evTarget.addEventListener('mouseleave', function () {
      mouseNorm.x = 0; mouseNorm.y = 0;
      keyObjs.forEach(function (ko) { ko.hovered = false; });
      canvas.style.cursor = '';
    });

    canvas.addEventListener('mousedown', function (e) {
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
          setTimeout(function () { ko.pressed = false; }, 160);
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

    // ── Resize ─────────────────────────────────────────────────────
    var resizeObs = new ResizeObserver(function () {
      var w = canvas.clientWidth, h = canvas.clientHeight;
      if (w === 0 || h === 0) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    });
    resizeObs.observe(canvas);

    // ── Loop de animación ─────────────────────────────────────────
    var camCurX = 0, camCurY = 0;
    var clock   = new THREE.Clock();
    var BASE_CAM = { x: 0.5, y: 8.5, z: 7.5 };

    function animate() {
      requestAnimationFrame(animate);
      var t = clock.getElapsedTime();

      // Deriva suave de cámara con el ratón
      camCurX += (mouseNorm.x * 0.45 - camCurX) * 0.04;
      camCurY += (mouseNorm.y * 0.20 - camCurY) * 0.04;
      camera.position.set(
        BASE_CAM.x + camCurX,
        BASE_CAM.y - camCurY * 0.4,
        BASE_CAM.z
      );
      camera.lookAt(0.5 + camCurX * 0.08, 0 + camCurY * 0.04, 0.8);

      // Animación por tecla
      keyObjs.forEach(function (ko) {
        var fSpeed = ko.hovered ? 2.6  : 1.0;
        var fAmp   = ko.hovered ? 0.13 : 0.055;
        var floatY = Math.sin(t * fSpeed + ko.kd.floatOffset) * fAmp;

        var pressTarget = ko.pressed ? -0.15 : 0;
        ko.yPress += (pressTarget - ko.yPress) * 0.25;

        ko.group.position.y = ko.kd.position.y + floatY + ko.yPress;

        // Escala al hover
        var sTarget = ko.hovered ? 1.07 : 1.0;
        ko.group.scale.setScalar(
          ko.group.scale.x + (sTarget - ko.group.scale.x) * 0.13
        );

        // Intensidad del glow en el keycap
        var gTarget = ko.pressed ? 0.95 : ko.hovered ? 0.82 : 0.25;
        ko.capMat.emissiveIntensity += (gTarget - ko.capMat.emissiveIntensity) * 0.12;

        // Opacidad/color del label (MeshBasicMaterial) — más brillante al hover
        var labelBright = ko.pressed ? 1.3 : ko.hovered ? 1.15 : 1.0;
        ko.labelMat.color.setScalar(
          ko.labelMat.color.r + (labelBright - ko.labelMat.color.r) * 0.12
        );

        var plTarget = ko.pressed ? 6.0 : ko.hovered ? 4.5 : 1.2;
        ko.pl.intensity += (plTarget - ko.pl.intensity) * 0.12;
      });

      renderer.render(scene, camera);
    }

    animate();

    // Pausar cuando no es visible (ahorra batería)
    if (typeof IntersectionObserver !== 'undefined') {
      var io = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) clock.start();
        else clock.stop();
      }, { threshold: 0.1 });
      io.observe(canvas);
    }
  }

  // ─── Inicio: precargar logos y luego construir escena ───────────
  function init() {
    if (!document.getElementById('keyboardCanvas3d')) return;
    if (typeof THREE === 'undefined') return;
    preloadImages(IMG_SRCS, buildScene);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
