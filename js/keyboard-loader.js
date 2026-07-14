(function () {
  'use strict';

  var hasStarted = false;

  function showFallback() {
    var canvas = document.getElementById('keyboardCanvas3d');
    var box = document.getElementById('keyInfo');
    var name = document.getElementById('kiName');
    var desc = document.getElementById('kiDesc');
    var tag = document.getElementById('kiTag');

    if (canvas) {
      canvas.hidden = true;
      canvas.setAttribute('aria-busy', 'false');
      canvas.removeAttribute('tabindex');
    }
    if (!box || !name || !desc || !tag) return;

    name.textContent = 'Visualización 3D no disponible';
    desc.textContent = 'No se pudo cargar el recurso 3D. El resto del portafolio sigue disponible.';
    tag.textContent = 'Modo alternativo';
    tag.style.display = 'inline-block';
    box.classList.add('visible', 'error');
  }

  function loadKeyboard() {
    if (hasStarted) return;
    hasStarted = true;

    var threeScript = document.createElement('script');
    threeScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
    threeScript.integrity = 'sha384-CI3ELBVUz9XQO+97x6nwMDPosPR5XvsxW2ua7N1Xeygeh1IxtgqtCkGfQY9WWdHu';
    threeScript.crossOrigin = 'anonymous';
    threeScript.referrerPolicy = 'no-referrer';
    threeScript.onerror = showFallback;
    threeScript.onload = function () {
      var keyboardScript = document.createElement('script');
      keyboardScript.src = 'js/keyboard3d.js?v=7';
      keyboardScript.onerror = showFallback;
      document.head.appendChild(keyboardScript);
    };
    document.head.appendChild(threeScript);
  }

  function init() {
    var section = document.getElementById('tech');
    if (!section) return;

    if (typeof IntersectionObserver === 'undefined') {
      loadKeyboard();
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting) return;
      observer.disconnect();
      loadKeyboard();
    }, { rootMargin: '400px 0px' });

    observer.observe(section);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
