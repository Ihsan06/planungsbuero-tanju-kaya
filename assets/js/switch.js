/* Varianten-Umschalter. Variante 1 ist die Startseite, Variante 2 liegt daneben. */
(function () {
  var VARIANTEN = [
    { id: 'v1', nr: '1', href: '/',   titel: 'Variante 1 – dunkel, mit Diashow' },
    { id: 'v2', nr: '2', href: '/v2', titel: 'Variante 2 – editorial, hell' }
  ];
  var jetzt = document.documentElement.getAttribute('data-variant') || 'v1';
  var css = '.variant-switch{position:fixed;top:106px;right:16px;z-index:300;display:flex;align-items:stretch;' +
    'background:rgba(16,16,17,.9);border:1px solid rgba(255,255,255,.18);' +
    'backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);font-family:Inter,Work Sans,system-ui,sans-serif}' +
    '.variant-switch a{width:32px;height:30px;display:inline-flex;align-items:center;justify-content:center;' +
    'text-decoration:none;color:#8d8d8d;font-size:.76rem;font-weight:500;letter-spacing:.04em;' +
    'border-left:1px solid rgba(255,255,255,.12);transition:background .18s,color .18s}' +
    '.variant-switch a:first-of-type{border-left:0}' +
    '.variant-switch a:hover{color:#fff;background:rgba(255,255,255,.08)}' +
    '.variant-switch a.aktiv{background:#e9e3d9;color:#14140f}' +
    '.variant-switch span{display:flex;align-items:center;font-size:.6rem;letter-spacing:.18em;' +
    'text-transform:uppercase;color:#7a7a7a;padding:0 10px}' +
    '@media(max-width:700px){.variant-switch{top:auto;bottom:8px;right:12px}.variant-switch span{display:none}}';
  var style = document.createElement('style'); style.textContent = css; document.head.appendChild(style);
  var sw = document.createElement('nav');
  sw.className = 'variant-switch'; sw.setAttribute('aria-label', 'Design-Variante wählen');
  sw.innerHTML = '<span>Variante</span>' + VARIANTEN.map(function (v) {
    return '<a href="' + v.href + '" title="' + v.titel + '" class="' + (v.id === jetzt ? 'aktiv' : '') + '">' + v.nr + '</a>';
  }).join('');
  document.body.appendChild(sw);
})();
