/* Diashow im Kopfbereich von Variante 1.
   Zwei Ebenen blenden ineinander über, das sichtbare Bild wandert langsam
   (Ken Burns). Der Titel des Projekts steht unten links, daneben Punkte, die
   den Fortschritt zeigen. Die Ebene liegt fest im Bild, während der Inhalt
   darüber scrollt – dafür sorgt clip-path am Kopfbereich im Stylesheet. */
(function () {
  'use strict';
  var STAND = 6200;       // wie lange ein Bild steht
  var BLENDE = 1500;      // Dauer der Überblendung

  var buehne = document.getElementById('dia');
  var titelEl = document.getElementById('diaTitel');
  var punkteEl = document.getElementById('diaPunkte');
  if (!buehne || !window.TK_BILDER) return;

  // Feste Auswahl statt Filter: gezeigt werden Motive mit Tiefe und Inhalt,
  // keine leeren Räume und keine flachen Fassaden. Reihenfolge = Ablauf.
  // Zum Ändern einfach die Dateinamen tauschen; sie stehen in
  // assets/img/k/katalog.json im Feld "f".
  var GEWUENSCHT = [
    'produktion-spritzguss',
    'optikerfachgeschaft',
    'lager-und-kommissionierung',
    'empfang-gaudlitz-entwurf',
    'gewerbehof',
    'montage-mit-autokran',
    'leichtbauhalle-innenraum'
  ];
  var nachName = {};
  TK_BILDER.forEach(function (b) { nachName[b.f] = b; });
  var auswahl = GEWUENSCHT.map(function (n) { return nachName[n]; }).filter(Boolean);
  // Falls ein Name nicht mehr passt: mit den besten Querformaten auffüllen
  if (auswahl.length < 3) {
    auswahl = TK_BILDER.filter(function (b) { return (b.stern || 0) >= 3 && b.w / b.h >= 1.5; }).slice(0, 7);
  }
  if (!auswahl.length) return;

  var ruhig = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Zwei Ebenen reichen: eine sichtbar, eine wird vorbereitet
  var ebenen = [0, 1].map(function (n) {
    var d = document.createElement('div');
    d.className = 'dia-ebene';
    d.innerHTML = '<img alt="" decoding="async">';
    buehne.appendChild(d);
    return d;
  });

  punkteEl.innerHTML = auswahl.map(function (b, i) {
    return '<i' + (i === 0 ? ' class="an"' : '') + '></i>';
  }).join('');
  var punkte = Array.prototype.slice.call(punkteEl.children);

  var jetzt = 0, aktiv = 0, uhr = null;

  function pfad(b) { return 'assets/img/k/' + b.f + '.jpg'; }

  function zeigen(index, sofort) {
    var b = auswahl[index];
    var neu = ebenen[1 - aktiv];
    var img = neu.querySelector('img');

    img.src = pfad(b);
    img.alt = b.t;
    // Richtung der Fahrt wechseln, damit es nicht monoton wirkt
    neu.classList.toggle('links', index % 2 === 0);
    neu.classList.toggle('rechts', index % 2 === 1);

    // Reflow erzwingen statt requestAnimationFrame: der Wechsel muss auch dann
    // stattfinden, wenn der Browser die Bildaufbau-Schleife gerade pausiert.
    void neu.offsetWidth;
    ebenen[aktiv].classList.remove('an');
    neu.classList.add('an');
    aktiv = 1 - aktiv;

    titelEl.textContent = [b.t, b.jahr].filter(Boolean).join(' · ');
    titelEl.classList.remove('an');
    setTimeout(function () { titelEl.classList.add('an'); }, sofort ? 60 : BLENDE * 0.45);
    punkte.forEach(function (p, i) { p.classList.toggle('an', i === index); });
    jetzt = index;
  }

  function weiter() { zeigen((jetzt + 1) % auswahl.length); }

  function starten() {
    if (ruhig || auswahl.length < 2) return;
    stoppen();
    uhr = setInterval(weiter, STAND + BLENDE);
  }
  function stoppen() { if (uhr) { clearInterval(uhr); uhr = null; } }

  // Nächstes Bild vorladen, damit die Blende nicht ruckelt
  function vorladen(index) {
    var v = new Image();
    v.src = pfad(auswahl[(index + 1) % auswahl.length]);
  }

  punkte.forEach(function (p, i) {
    p.addEventListener('click', function () { zeigen(i); vorladen(i); starten(); });
  });
  punkteEl.setAttribute('role', 'group');
  punkteEl.setAttribute('aria-label', 'Bild wählen');

  // Im Hintergrundtab nicht weiterlaufen lassen
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) stoppen(); else starten();
  });

  // Leichte Parallaxe: die Buehne laeuft langsamer als der Inhalt, dadurch
  // wirkt das Bild, als bliebe es stehen. transform ist eine reine
  // Compositor-Eigenschaft, das ist auch ohne Bildaufbau-Schleife guenstig.
  var hero = buehne.parentElement;
  if (!ruhig) {
    var schieben = function () {
      var h = hero.offsetHeight;
      if (window.scrollY > h + 200) return;
      var weg = Math.min(window.scrollY * 0.3, h * 0.14);
      buehne.style.transform = 'translate3d(0,' + weg.toFixed(1) + 'px,0)';
    };
    schieben();
    window.addEventListener('scroll', schieben, { passive: true });
    window.addEventListener('resize', schieben, { passive: true });
  }

  zeigen(0, true);
  vorladen(0);
  starten();
  // Beim Wechsel jeweils das übernächste vorladen
  setInterval(function () { vorladen(jetzt); }, STAND + BLENDE);
})();
