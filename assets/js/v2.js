/* Variante 2 – editorial. Baut die Bildreihen und die Werkschau aus dem Katalog. */
(function () {
  'use strict';
  var lb = TK.lightbox();
  var sprache = 'de';

  /* Jedes Bild wird nur einmal verwendet. Wer zuerst fragt, bekommt das beste. */
  var vergeben = Object.create(null);
  function hol(anzahl, opt) {
    opt = opt || {};
    var quelle = TK.sortiert(TK.BILDER.filter(function (b) {
      if (vergeben[b.f]) return false;
      if (opt.kat && b.kat !== opt.kat) return false;
      if (opt.format && TK.format(b) !== opt.format) return false;
      if (opt.minStern && (b.stern || 0) < opt.minStern) return false;
      return true;
    }));
    // Wenn die Wunschform nicht reicht, ohne Formatwunsch auffüllen
    if (quelle.length < anzahl && opt.format) {
      var rest = TK.sortiert(TK.BILDER.filter(function (b) {
        return !vergeben[b.f] && (!opt.kat || b.kat === opt.kat) && quelle.indexOf(b) === -1;
      }));
      quelle = quelle.concat(rest);
    }
    var gewaehlt = quelle.slice(0, anzahl);
    gewaehlt.forEach(function (b) { vergeben[b.f] = true; });
    return gewaehlt;
  }

  /* Eine anklickbare Kachel. gruppe = Liste für die Lightbox. */
  function kachel(b, klasse, gruppe, index, groesse) {
    var f = document.createElement('figure');
    f.className = 'kachel' + (klasse ? ' ' + klasse : '');
    f.tabIndex = 0;
    f.setAttribute('role', 'button');
    f.setAttribute('aria-label', b.t);
    f.innerHTML =
      '<img src="' + TK.pfad(b, groesse || 'k') + '" alt="' + b.t + '" width="' + b.w + '" height="' + b.h +
      '" loading="lazy" decoding="async" data-blende>' +
      '<figcaption><b></b><span></span></figcaption>';
    f.querySelector('b').textContent = b.t;
    f.querySelector('span').textContent = [TK.katName(b.kat, sprache), TK.zusatz(b)].filter(Boolean).join(' · ');
    f.dataset.kat = b.kat;
    function auf() { lb.oeffnen(gruppe, index, sprache); }
    f.addEventListener('click', auf);
    f.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); auf(); }
    });
    return f;
  }

  /* ---------- Auftaktbild und Vollbild-Unterbrechung ---------- */
  function vollbild(ziel, bild) {
    if (!ziel || !bild) return;
    ziel.innerHTML =
      '<img src="' + TK.pfad(bild, 'gross') + '" alt="' + bild.t + '" width="' + bild.w + '" height="' + bild.h +
      '" fetchpriority="high" decoding="async">' +
      '<figcaption></figcaption>';
    ziel.querySelector('figcaption').textContent = bild.t;
  }
  var auftakt = hol(1, { minStern: 3, format: 'quer' })[0];
  vollbild(document.getElementById('auftaktBild'), auftakt);

  /* ---------- Bildreihen ---------- */
  function reihe(id, anzahl) {
    var ziel = document.getElementById(id);
    if (!ziel) return [];
    var gruppe = hol(anzahl, { minStern: 2 });
    gruppe.forEach(function (b, i) { ziel.appendChild(kachel(b, '', gruppe, i)); });
    return gruppe;
  }
  reihe('reiheA', 3);

  /* ---------- Werkschau: je Kategorie ein Block ---------- */
  var werkschau = document.getElementById('werkschau');
  var bloecke = [];
  TK.kategorien.forEach(function (kat, n) {
    var gruppe = hol(5, { kat: kat });
    if (gruppe.length < 2) {                      // zu wenig Material für einen eigenen Block
      gruppe.forEach(function (b) { vergeben[b.f] = false; });
      return;
    }
    var block = document.createElement('div');
    block.className = 'bahn block rv' + (n % 2 ? ' gedreht' : '');
    var kopf = document.createElement('div');
    kopf.className = 'block-kopf';
    kopf.innerHTML = '<h3></h3><span></span>';
    block.appendChild(kopf);

    var raster = document.createElement('div');
    raster.className = 'block-bilder';
    gruppe.forEach(function (b, i) {
      // erstes Bild groß, danach zwei schmale, danach halbe Breite
      var klasse = i === 0 ? 'leit' : (i < 3 ? 'neben' : 'breit');
      raster.appendChild(kachel(b, klasse, gruppe, i));
    });
    block.appendChild(raster);
    werkschau.appendChild(block);
    bloecke.push({ el: block, kat: kat, anzahl: gruppe.length, kopf: kopf });
  });

  function bloeckeBeschriften() {
    bloecke.forEach(function (b) {
      b.kopf.querySelector('h3').textContent = TK.katName(b.kat, sprache);
      b.kopf.querySelector('span').textContent = b.anzahl + (sprache === 'tr' ? ' fotoğraf' : ' Aufnahmen');
    });
  }

  /* ---------- Vollbild-Unterbrechung und zweite Reihe ---------- */
  vollbild(document.getElementById('bruchBild'), hol(1, { minStern: 2, format: 'quer' })[0]);
  reihe('reiheB', 3);

  /* ---------- Beschriftungen bei Sprachwechsel nachziehen ---------- */
  function kachelnBeschriften() {
    document.querySelectorAll('.kachel').forEach(function (f) {
      var b = TK.BILDER.filter(function (x) { return x.t === f.querySelector('b').textContent; })[0];
      if (!b) return;
      f.querySelector('figcaption span').textContent =
        [TK.katName(b.kat, sprache), TK.zusatz(b)].filter(Boolean).join(' · ');
    });
  }

  TK.sprachschalter(window.TK_TR || {}, function (spr) {
    sprache = spr;
    lb.sprache(spr);
    bloeckeBeschriften();
    kachelnBeschriften();
  });

  TK.kopf(document.getElementById('kopf'), document.getElementById('burger'), document.getElementById('nav'));
  TK.formular(document.getElementById('formular'));
  TK.bilderAufblenden();
  TK.einblenden('.rv');
})();
