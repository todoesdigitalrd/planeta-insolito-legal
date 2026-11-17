// Planeta Insólito · microinteracciones (sin dependencias)
document.documentElement.classList.add('js');
document.addEventListener('DOMContentLoaded', function () {
  var quieto = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Barra que se compacta al desplazarse
  var barra = document.getElementById('barra');
  var alDesplazar = function () { barra.classList.toggle('compacta', window.scrollY > 24); };
  window.addEventListener('scroll', alDesplazar, { passive: true });
  alDesplazar();

  // Aparición escalonada al entrar en pantalla
  var els = document.querySelectorAll('.aparece');
  els.forEach(function (e, i) { e.style.transitionDelay = (i % 4) * 80 + 'ms'; });
  if (!('IntersectionObserver' in window) || quieto) {
    els.forEach(function (e) { e.classList.add('visible'); });
  } else {
    var io = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add('visible'); io.unobserve(x.target); } });
    }, { threshold: 0.12 });
    els.forEach(function (e) { io.observe(e); });
  }

  // Contadores de las cifras
  document.querySelectorAll('[data-cifra]').forEach(function (el) {
    if (quieto) return;
    var fin = +el.dataset.cifra, pre = el.dataset.pre || '', suf = el.dataset.suf || '', t0 = null;
    var paso = function (t) {
      if (!t0) t0 = t;
      var p = Math.min((t - t0) / 1600, 1);
      el.textContent = pre + Math.round(fin * (1 - Math.pow(1 - p, 3))).toLocaleString('es-DO') + suf;
      if (p < 1) requestAnimationFrame(paso);
    };
    el.textContent = pre + '0' + suf;
    requestAnimationFrame(paso);
  });

  // La nutria sigue un poco al ratón (solo en pantallas con ratón)
  var arte = document.querySelector('.portada-arte');
  if (arte && !quieto && window.matchMedia('(hover: hover)').matches) {
    var nutria = arte.querySelector('.nutria-hero');
    document.querySelector('.portada').addEventListener('mousemove', function (ev) {
      var r = arte.getBoundingClientRect();
      var dx = (ev.clientX - (r.left + r.width / 2)) / r.width;
      var dy = (ev.clientY - (r.top + r.height / 2)) / r.height;
      nutria.style.setProperty('--mx', (dx * 14).toFixed(1) + 'px');
      nutria.style.setProperty('--my', (dy * 10).toFixed(1) + 'px');
      arte.querySelectorAll('.vidrio').forEach(function (v, i) {
        var f = i % 2 ? -1 : 1;
        v.style.translate = (dx * 10 * f).toFixed(1) + 'px ' + (dy * 8 * f).toFixed(1) + 'px';
      });
    });
  }
});
