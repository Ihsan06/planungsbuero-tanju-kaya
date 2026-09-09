/* Diashow im Kopfbereich von Variante 2.
   Zwei Ebenen blenden ineinander über, das sichtbare Bild wandert dabei
   langsam weiter (Ken Burns). Der Titel des Projekts steht unten links,
   daneben die Schaltflächen zum Umschalten. */
(function () {
  'use strict';
  var STAND = 6000;       // wie lange ein Bild allein steht
  var BLENDE = 1200;      // Dauer der Überblendung
  // Sichtbare Lebensdauer einer Ebene: einblenden, stehen, ausblenden. Die
  // Fahrt bekommt exakt diese Länge, damit sie im Moment des Verschwindens
  // ankommt und nie mittendrin einfriert oder zurückspringt.
  var FAHRTDAUER = STAND + BLENDE * 2;

  var buehne = document.getElementById('dia');
  var titelEl = document.getElementById('diaTitel');
  var punkteEl = document.getElementById('diaPunkte');
  if (!buehne || !window.TK_BILDER) return;

  // Feste Auswahl statt Filter: gezeigt werden Motive mit Tiefe und Inhalt,
  // keine leeren Räume und keine flachen Fassaden. Reihenfolge = Ablauf.
  // Zum Ändern einfach die Dateinamen tauschen; sie stehen in
  // assets/img/k/katalog.json im Feld "f".
  var GEWUENSCHT = [
    'empfang-gaudlitz-entwurf',   // gleicher Auftakt wie im Kopfbereich von Variante 2
    'optikerfachgeschaft',
    'lager-und-kommissionierung',
    'gewerbehof',
    'montage-mit-autokran',
    'leichtbauhalle-innenraum',
    'produktion-spritzguss'
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

  // Echte Schaltflaechen statt <i>: der sichtbare Strich bleibt duenn, die
  // anklickbare Flaeche darum herum ist aber gross genug fuer Finger und Maus.
  punkteEl.innerHTML = auswahl.map(function (b, i) {
    return '<button type="button" class="dia-punkt' + (i === 0 ? ' an' : '') +
      '" aria-label="Bild ' + (i + 1) + ' von ' + auswahl.length + ': ' + b.t + '"></button>';
  }).join('');
  var punkte = Array.prototype.slice.call(punkteEl.children);

  /* --- Die Fahrten ------------------------------------------------------
     Jede Fahrt ist ein Paar aus Anfangs- und Endzustand. s ist der Zoom,
     x und y sind keine festen Prozentwerte, sondern Anteile des Spielraums,
     den dieser Zoom überhaupt hergibt (-1 bis 1). Dadurch kann keine Fahrt
     über den Bildrand hinauslaufen, egal wie stark gezoomt wird, und die
     Bewegung fällt bei viel Zoom von selbst großzügiger aus. */
  var FAHRTEN = [
    { von: { s: 1.05, x:  0.78, y: -0.10 }, bis: { s: 1.16, x: -0.28, y:  0.08 } }, // heran, von links
    { von: { s: 1.17, x: -0.62, y:  0.12 }, bis: { s: 1.06, x:  0.30, y: -0.05 } }, // zurück, nach rechts
    { von: { s: 1.08, x: -0.12, y:  0.82 }, bis: { s: 1.17, x:  0.10, y: -0.30 } }, // heben
    { von: { s: 1.16, x:  0.14, y: -0.70 }, bis: { s: 1.06, x: -0.10, y:  0.34 } }, // senken
    { von: { s: 1.13, x: -0.84, y:  0.00 }, bis: { s: 1.13, x:  0.84, y:  0.00 } }, // reiner Schwenk
    { von: { s: 1.04, x: -0.35, y: -0.30 }, bis: { s: 1.15, x:  0.25, y:  0.22 } }  // langsam heran, schräg
  ];

  // Feste Zuordnung Bild -> Fahrt. Reihum, aber so nachgebessert, dass zwei
  // aufeinanderfolgende Bilder nie dieselbe Fahrt bekommen - auch nicht am
  // Übergang vom letzten zurück zum ersten.
  var zuordnung = auswahl.map(function (b, i) { return i % FAHRTEN.length; });
  (function entzerren() {
    var n = zuordnung.length;
    for (var i = 0; i < n; i++) {
      var vorher = zuordnung[(i - 1 + n) % n], nachher = zuordnung[(i + 1) % n];
      if (zuordnung[i] !== vorher && zuordnung[i] !== nachher) continue;
      for (var k = 0; k < FAHRTEN.length; k++) {
        if (k !== vorher && k !== nachher) { zuordnung[i] = k; break; }
      }
    }
  })();

  // Der Spielraum bei Zoom s: das Bild ragt auf jeder Seite um (s-1)/2 über
  // den Rahmen hinaus. 0.85 davon wird höchstens genutzt, der Rest ist Puffer.
  function pose(z) {
    var raum = (z.s - 1) / 2 * 100;
    return 'translate3d(' + (z.x * raum).toFixed(3) + '%,' +
           (z.y * raum).toFixed(3) + '%,0) scale(' + z.s + ')';
  }

  var jetzt = 0, aktiv = 0, uhr = null;

  function pfad(b) { return 'assets/img/k/' + b.f + '.jpg'; }

  function fahren(img, index) {
    // Laufende Fahrt der wiederverwendeten Ebene beenden. Die Ebene ist in
    // diesem Moment unsichtbar, deshalb sieht man den Wechsel nicht.
    if (img.getAnimations) {
      img.getAnimations().forEach(function (a) { a.cancel(); });
    }
    var f = FAHRTEN[zuordnung[index]];
    var von = pose(f.von), bis = pose(f.bis);

    if (ruhig) { img.style.transform = pose({ s: 1.02, x: 0, y: 0 }); return; }

    if (img.animate) {
      // Gleichmäßig, ohne Beschleunigen oder Abbremsen: eine Fahrt, die
      // erkennbar bremst, wirkt wie ein Fehler und nicht wie Absicht.
      img.animate([{ transform: von }, { transform: bis }],
                  { duration: FAHRTDAUER, easing: 'linear', fill: 'both' });
    } else {
      // Rückfall für sehr alte Browser
      img.style.transition = 'none';
      img.style.transform = von;
      void img.offsetWidth;
      img.style.transition = 'transform ' + FAHRTDAUER + 'ms linear';
      img.style.transform = bis;
    }
  }

  function zeigen(index, sofort) {
    var b = auswahl[index];
    var neu = ebenen[1 - aktiv];
    var img = neu.querySelector('img');

    img.src = pfad(b);
    img.alt = b.t;
    fahren(img, index);

    // Reflow erzwingen statt requestAnimationFrame: der Wechsel muss auch dann
    // stattfinden, wenn der Browser die Bildaufbau-Schleife gerade pausiert.
    void neu.offsetWidth;
    ebenen[aktiv].classList.remove('an');
    neu.classList.add('an');
    aktiv = 1 - aktiv;

    titelEl.textContent = [b.t, b.jahr].filter(Boolean).join(' · ');
    titelEl.classList.remove('an');
    setTimeout(function () { titelEl.classList.add('an'); }, sofort ? 60 : BLENDE * 0.55);
    punkte.forEach(function (p, i) {
      p.classList.toggle('an', i === index);
      p.setAttribute('aria-current', i === index ? 'true' : 'false');
    });
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
    var offen = false;
    var setzen = function () {
      offen = false;
      var h = hero.offsetHeight;
      if (window.scrollY > h + 200) return;
      var weg = Math.min(window.scrollY * 0.3, h * 0.14);
      buehne.style.transform = 'translate3d(0,' + weg.toFixed(1) + 'px,0)';
    };
    // Pro Bildaufbau einmal schreiben statt bei jedem Scroll-Ereignis
    var schieben = function () {
      if (offen) return;
      offen = true;
      if (window.requestAnimationFrame) requestAnimationFrame(setzen); else setzen();
    };
    setzen();
    window.addEventListener('scroll', schieben, { passive: true });
    window.addEventListener('resize', schieben, { passive: true });
  }

  zeigen(0, true);
  vorladen(0);
  starten();
  // Beim Wechsel jeweils das übernächste vorladen
  setInterval(function () { vorladen(jetzt); }, STAND + BLENDE);
})();
