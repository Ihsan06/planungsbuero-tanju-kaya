/* Design-Varianten-Umschalter (oben rechts) – gleiche Mechanik wie bei den anderen Demos.
   Variante 1 = index.html (minimal), Variante 2 = v2.html (ausführlich). */
(function () {
  var VARIANTS = [
    { id: 'v1', href: 'index.html', label: 'Variante 1 – minimal' },
    { id: 'v2', href: 'v2.html',    label: 'Variante 2 – ausführlich' }
  ];
  var current = document.documentElement.getAttribute('data-variant') || 'v1';
  var css = '.variant-switch{position:fixed;top:92px;right:16px;z-index:300;display:flex;gap:4px;align-items:center;' +
    'padding:4px 6px;border-radius:100px;background:rgba(20,20,20,.86);border:1px solid rgba(255,255,255,.16);' +
    'backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);font-family:Inter,Lato,system-ui,sans-serif}' +
    '.variant-switch a{width:28px;height:28px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;' +
    'text-decoration:none;color:#9a9a9a;font-size:.8rem;font-weight:700;transition:background .15s,color .15s}' +
    '.variant-switch a:hover{color:#fff}.variant-switch a.active{background:#fff;color:#000}' +
    '.variant-switch span{font-size:.62rem;letter-spacing:.14em;text-transform:uppercase;color:#777;padding:0 6px 0 8px}' +
    '@media(max-width:700px){.variant-switch{top:auto;bottom:14px;right:12px}.variant-switch span{display:none}}';
  var style = document.createElement('style'); style.textContent = css; document.head.appendChild(style);
  var sw = document.createElement('nav');
  sw.className = 'variant-switch'; sw.setAttribute('aria-label', 'Design-Variante wählen');
  sw.innerHTML = '<span>Variante</span>' + VARIANTS.map(function (v, i) {
    return '<a href="' + v.href + '" title="' + v.label + '" class="' + (v.id === current ? 'active' : '') + '">' + (i + 1) + '</a>';
  }).join('');
  document.body.appendChild(sw);
})();
