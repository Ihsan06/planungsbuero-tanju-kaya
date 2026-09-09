/* Sorgt dafür, dass die letzte Zeile eines Bildrasters nie halb leer bleibt.
   Statt Bilder wegzulassen werden die Felder der letzten Zeile so breit
   gezogen, dass sie die Zeile ausfüllen. Ihre Höhe bleibt die der übrigen
   Zeilen, damit das Raster ruhig bleibt.

   Nutzung:  TK_REIHEN.fuellen(container, '.feld')
             TK_REIHEN.beobachten(container, '.feld')   // zusätzlich bei Größenwechsel */
window.TK_REIHEN = (function () {
  'use strict';

  function zahl(wert) { var n = parseFloat(wert); return isNaN(n) ? 0 : n; }

  function fuellen(container, auswahl) {
    if (!container) return;
    var felder = Array.prototype.slice.call(container.querySelectorAll(auswahl));
    if (felder.length < 2) return;

    // Erst zurücksetzen, sonst misst man die Anpassung der letzten Runde mit.
    felder.forEach(function (el) {
      el.style.gridColumn = '';
      el.style.aspectRatio = '';
      el.style.height = '';
    });

    var cs = getComputedStyle(container);
    if (cs.display.indexOf('grid') === -1) return;
    var spaltenListe = cs.gridTemplateColumns.split(/\s+/).filter(Boolean);
    var spalten = spaltenListe.length;
    if (spalten < 2) return;

    var luecke = zahl(cs.columnGap || cs.gap);
    var spaltenBreite = zahl(spaltenListe[0]);
    if (!spaltenBreite) return;

    // Wie viele Spalten belegt ein Feld gerade?
    function weite(el) {
      var w = el.getBoundingClientRect().width;
      return Math.max(1, Math.round((w + luecke) / (spaltenBreite + luecke)));
    }

    var oben = felder.map(function (el) { return el.offsetTop; });
    var letzterRand = Math.max.apply(null, oben);
    if (letzterRand === Math.min.apply(null, oben)) return;   // alles in einer Zeile

    // Höhe einer normalen Zeile: erstes Feld, das nicht in der letzten Zeile beginnt
    var zeilenHoehe = 0;
    for (var i = 0; i < felder.length; i++) {
      if (oben[i] < letzterRand) { zeilenHoehe = felder[i].offsetHeight; break; }
    }

    // Felder der letzten Zeile, plus solche, die von oben hereinragen
    var eigene = [], fremd = 0;
    felder.forEach(function (el, n) {
      if (oben[n] === letzterRand) eigene.push(el);
      else if (oben[n] + el.offsetHeight > letzterRand + 2) fremd += weite(el);
    });
    if (!eigene.length) return;

    var frei = spalten - fremd;
    var belegt = eigene.reduce(function (s, el) { return s + weite(el); }, 0);
    if (belegt >= frei || frei < 2) return;                    // Zeile ist schon voll

    var basis = Math.floor(frei / eigene.length);
    var rest = frei % eigene.length;
    eigene.forEach(function (el, n) {
      var spanne = basis + (n < rest ? 1 : 0);
      if (spanne > 1) {
        el.style.gridColumn = 'span ' + spanne;
        el.style.aspectRatio = 'auto';
        if (zeilenHoehe) el.style.height = zeilenHoehe + 'px';
      }
    });
  }

  // Beim Ändern der Fensterbreite wechselt die Spaltenzahl – dann neu rechnen.
  function beobachten(container, auswahl) {
    var timer;
    function spaeter() {
      clearTimeout(timer);
      timer = setTimeout(function () { fuellen(container, auswahl); }, 120);
    }
    window.addEventListener('resize', spaeter, { passive: true });
    // Bilder ändern beim Laden die Zeilenhöhe nicht, aber Schriften können es
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(spaeter);
    return spaeter;
  }

  return { fuellen: fuellen, beobachten: beobachten };
})();
