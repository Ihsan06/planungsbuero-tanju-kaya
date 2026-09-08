/* Design-Varianten-Umschalter (oben rechts) – gleiche Mechanik wie bei den anderen Demos.
   Variante 1 = index.html (minimal), Variante 2 = v2.html (ausführlich). */
(function () {
  var VARIANTS = [
    { id: 'v1', href: 'index.html', label: 'Variante 1 – minimal' },
    { id: 'v2', href: 'v2.html',    label: 'Variante 2 – ausführlich' }
  ];
  var current = document.documentElement.getAttribute('data-variant') || 'v1';
  var css = '.variant-switch{position:fixed;top:92px;right:16px;z-index:300;display:flex;align-items:stretch;' +
    'background:rgba(16,16,17,.9);border:1px solid rgba(255,255,255,.18);' +
    'backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);font-family:Inter,Lato,system-ui,sans-serif}' +
    '.variant-switch a{width:32px;height:30px;display:inline-flex;align-items:center;justify-content:center;' +
    'text-decoration:none;color:#8d8d8d;font-size:.76rem;font-weight:500;letter-spacing:.04em;' +
    'border-left:1px solid rgba(255,255,255,.12);transition:background .18s,color .18s}' +
    '.variant-switch a:first-of-type{border-left:0}' +
    '.variant-switch a:hover{color:#fff;background:rgba(255,255,255,.08)}' +
    '.variant-switch a.active{background:#e9e3d9;color:#14140f}' +
    '.variant-switch span{display:flex;align-items:center;font-size:.6rem;letter-spacing:.18em;' +
    'text-transform:uppercase;color:#7a7a7a;padding:0 10px}' +
    '@media(max-width:700px){.variant-switch{top:auto;bottom:14px;right:12px}.variant-switch span{display:none}}';
  var style = document.createElement('style'); style.textContent = css; document.head.appendChild(style);
  var sw = document.createElement('nav');
  sw.className = 'variant-switch'; sw.setAttribute('aria-label', 'Design-Variante wählen');
  sw.innerHTML = '<span>Variante</span>' + VARIANTS.map(function (v, i) {
    return '<a href="' + v.href + '" title="' + v.label + '" class="' + (v.id === current ? 'active' : '') + '">' + (i + 1) + '</a>';
  }).join('');
  document.body.appendChild(sw);
})();
