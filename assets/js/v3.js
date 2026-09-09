/* Variante 3 – Raster. Ein Fototeppich mit allen Projekten, Filter, Lightbox. */
(function () {
  'use strict';
  var ANFANG = 20;                 // zuerst so viele, der Rest auf Knopfdruck
  var lb = TK.lightbox();
  var sprache = 'de';
  var kat = 'alle';
  var alleZeigen = false;

  var filter = document.getElementById('filter');
  var teppich = document.getElementById('teppich');
  var zaehler = document.getElementById('zaehler');
  var mehr = document.getElementById('mehr');
  var sichtbar = [];

  /* Filterknöpfe */
  filter.innerHTML = '<button class="an" data-k="alle"></button>' +
    TK.kategorien.map(function (k) { return '<button data-k="' + k + '"></button>'; }).join('');

  function beschriften() {
    filter.querySelectorAll('button').forEach(function (b) {
      b.textContent = b.dataset.k === 'alle'
        ? (sprache === 'tr' ? 'Tümü' : 'Alle')
        : TK.katName(b.dataset.k, sprache);
    });
  }

  /* Welche Bilder dürfen die doppelte Fläche einnehmen: die besten Querformate,
     verteilt über den Teppich, damit der Rhythmus nicht am Anfang verpufft. */
  function grosseFelder(liste) {
    var gross = Object.create(null);
    // Etwa alle neun Felder eines groß, aber nur echte Querformate – sonst
    // wird das Bild in der doppelt so breiten Fläche stark beschnitten.
    for (var pos = 2; pos < liste.length; pos += 9) {
      for (var k = 0; k < 3; k++) {
        var b = liste[pos + k];
        if (b && TK.format(b) === 'quer') { gross[b.f] = true; break; }
      }
    }
    return gross;
  }

  function zeichnen() {
    var liste = TK.ausKat(kat);
    var grenze = (kat === 'alle' && !alleZeigen) ? ANFANG : liste.length;
    sichtbar = liste.slice(0, grenze);
    var gross = grosseFelder(sichtbar);

    teppich.innerHTML = sichtbar.map(function (b, i) {
      return '<figure class="feld' + (gross[b.f] ? ' gross' : '') + '" data-i="' + i +
        '" tabindex="0" role="button" aria-label="' + b.t + '">' +
        '<img src="' + TK.pfad(b, gross[b.f] ? 'k' : 's') + '" alt="' + b.t +
        '" width="' + b.w + '" height="' + b.h + '" loading="' + (i < 8 ? 'eager' : 'lazy') +
        '" decoding="async" data-blende>' +
        '<figcaption><b>' + b.t + '</b><span></span></figcaption></figure>';
    }).join('');

    teppich.querySelectorAll('.feld').forEach(function (f, i) {
      var b = sichtbar[i];
      f.querySelector('figcaption span').textContent =
        [TK.katName(b.kat, sprache), TK.zusatz(b)].filter(Boolean).join(' · ');
    });

    TK.bilderAufblenden(teppich);
    // Letzte Zeile auffuellen, sonst endet der Teppich halb leer
    if (window.TK_REIHEN) TK_REIHEN.fuellen(teppich, '.feld');
    mehr.hidden = !(kat === 'alle' && !alleZeigen && liste.length > ANFANG);
    zaehler.textContent = sichtbar.length + ' / ' + liste.length +
      (sprache === 'tr' ? ' fotoğraf' : ' Aufnahmen');
  }

  filter.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    filter.querySelectorAll('button').forEach(function (x) { x.classList.toggle('an', x === b); });
    kat = b.dataset.k;
    zeichnen();
  });
  mehr.querySelector('button').addEventListener('click', function () { alleZeigen = true; zeichnen(); });

  teppich.addEventListener('click', function (e) {
    var f = e.target.closest('.feld'); if (f) lb.oeffnen(sichtbar, +f.dataset.i, sprache);
  });
  teppich.addEventListener('keydown', function (e) {
    var f = e.target.closest('.feld');
    if (f && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); lb.oeffnen(sichtbar, +f.dataset.i, sprache); }
  });

  TK.sprachschalter(window.TK_TR || {}, function (spr) {
    sprache = spr;
    lb.sprache(spr);
    beschriften();
    zeichnen();
  });

  if (window.TK_REIHEN) TK_REIHEN.beobachten(teppich, '.feld');
  TK.kopf(document.getElementById('kopf'), document.getElementById('burger'), document.getElementById('nav'));
  TK.formular(document.getElementById('formular'));
  TK.bilderAufblenden();
})();
