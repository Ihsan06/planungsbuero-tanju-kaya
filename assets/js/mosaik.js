/* Themenmosaik fuer Variante 2.
   Baut aus dem Bildkatalog (bilder.js) mehrere Themenbaender. Innerhalb eines
   Bandes werden die Bilder wie bei einer Bildstrecke in Reihen gesetzt: jede
   Reihe fuellt die Breite exakt aus, die Kachelbreite ergibt sich aus dem
   echten Seitenverhaeltnis. Weil die Zielhoehe von Reihe zu Reihe wechselt,
   werden die Kacheln unterschiedlich gross - mal zwei grosse nebeneinander,
   mal vier kleine. */
(function () {
  "use strict";

  var BILDER = window.TK_BILDER || [];
  var wurzel = document.getElementById('mosaik');
  if (!BILDER.length || !wurzel) return;

  /* --- 1. Themenbaender -------------------------------------------------- */
  // Ein Band buendelt eine oder mehrere Katalogkategorien.
  var BAENDER = [
    { id: 'industrie', kats: ['industriebau'],               de: 'Industrie & Gewerbe',          tr: 'Sanayi & ticari yapılar' },
    { id: 'innen',     kats: ['innenausbau'],                de: 'Innenausbau & Arbeitswelten',  tr: 'İç yapım & çalışma alanları' },
    { id: 'wohnen',    kats: ['wohnungsbau', 'altbau'],      de: 'Wohnen & Bestand',             tr: 'Konut & mevcut yapı' },
    { id: 'rohbau',    kats: ['rohbau'],                     de: 'Rohbau & Konstruktion',        tr: 'Kaba yapı & taşıyıcı sistem' },
    { id: 'laden',     kats: ['ladenbau'],                   de: 'Ladenbau',                     tr: 'Mağaza tasarımı' }
  ];

  // Zielhoehen der Reihen in Pixel. Eine Reihe wird geschlossen, sobald sie
  // auf oder unter ihre Zielhoehe faellt. Bei Querformaten ergibt das der
  // Reihe nach zwei grosse, drei mittlere, vier kleine Kacheln und so fort -
  // genau der Wechsel, der das Mosaik unruhig im guten Sinne macht.
  var ZIELE = [520, 400, 240, 500, 330, 280];

  function trAn() { return document.documentElement.lang === 'tr'; }

  /* --- 2. Reihenfolge innerhalb eines Bandes ------------------------------ */
  // Gute Aufnahmen zuerst, danach der Rest. Hochformate werden anschliessend
  // ueber das Band verteilt, weil sie die Reihen spannender machen.
  function ordnen(liste) {
    var sortiert = liste.slice().sort(function (a, b) {
      return (b.stern || 0) - (a.stern || 0);
    });
    var hoch = [], quer = [];
    sortiert.forEach(function (b) { (b.w / b.h < 0.9 ? hoch : quer).push(b); });
    if (!hoch.length) return sortiert;
    var raus = quer.slice();
    hoch.forEach(function (b, i) {
      var pos = Math.round(raus.length * (i + 1) / (hoch.length + 1));
      raus.splice(pos, 0, b);
    });
    return raus;
  }

  /* --- 3. Reihen bilden --------------------------------------------------- */
  function reihenBilden(liste, breite, luecke, versatz) {
    // Auf schmalen Schirmen werden die Zielhoehen mitskaliert, sonst passt
    // pro Reihe nur noch ein Bild.
    var f = Math.max(0.30, Math.min(1, breite / 1700));
    // Untergrenze: keine Reihe darf so flach werden, dass die Kacheln zu
    // Streifen zusammenschrumpfen. Auf dem Handy fuehrt das dazu, dass nur
    // noch ein Bild pro Reihe steht - genau richtig fuer kleine Schirme.
    var mindest = Math.max(140, breite * 0.112);
    var raus = [], reihe = [], summe = 0;

    for (var i = 0; i < liste.length; i++) {
      var v = liste[i].w / liste[i].h;
      var probe = (breite - luecke * reihe.length) / (summe + v);

      if (reihe.length && probe < mindest) {
        // Dieses Bild passt nicht mehr dazu, die Reihe wird vorher geschlossen.
        raus.push(reihe); reihe = []; summe = 0;
        probe = (breite - luecke * reihe.length) / v;
      }

      reihe.push(liste[i]);
      summe += v;
      var ziel = ZIELE[(raus.length + versatz) % ZIELE.length] * f;
      if (probe <= ziel || i === liste.length - 1) {
        raus.push(reihe); reihe = []; summe = 0;
      }
    }
    // Eine Schlussreihe mit nur einem Bild wuerde auf breiten Schirmen ueber
    // die ganze Seite aufgeblasen. Dann wandert das Bild in die Reihe davor,
    // oder es wird umgekehrt eines nachgezogen. Beides aber nur, solange die
    // Reihe dabei nicht unter die Mindesthoehe rutscht - auf dem Handy bleibt
    // das Schlussbild deshalb einfach allein stehen, und das ist dort richtig.
    var n = raus.length;
    if (n > 1 && raus[n - 1].length === 1) {
      var vor = raus[n - 2], schluss = raus[n - 1];
      var hVerschmolzen = hoeheVon(vor.concat(schluss), breite, luecke);
      var hNachgezogen = hoeheVon([vor[vor.length - 1], schluss[0]], breite, luecke);
      if (vor.length <= 3 && hVerschmolzen >= mindest) {
        vor.push(raus.pop()[0]);
      } else if (vor.length > 2 && hNachgezogen >= mindest) {
        schluss.unshift(vor.pop());
      }
    }
    return raus;
  }

  function hoeheVon(reihe, breite, luecke) {
    var summe = 0;
    reihe.forEach(function (b) { summe += b.w / b.h; });
    var h = (breite - luecke * (reihe.length - 1)) / summe;
    // Ein einzelnes Hochformat wuerde auf schmalen Schirmen die ganze Seite
    // fuellen; hier wird es oben und unten leicht beschnitten.
    return reihe.length === 1 ? Math.min(h, breite * 1.35) : h;
  }

  /* --- 4. Aufbauen -------------------------------------------------------- */
  var baender = [];   // { el, reihen: [{el, bilder}] }
  var alleBilder = [];

  function aufbauen() {
    wurzel.innerHTML = '';
    baender = [];
    alleBilder = [];

    BAENDER.forEach(function (band, bi) {
      var liste = ordnen(BILDER.filter(function (b) {
        return band.kats.indexOf(b.kat) !== -1;
      }));
      if (!liste.length) return;

      var el = document.createElement('div');
      el.className = 'band rv';
      el.innerHTML =
        '<div class="band-kopf">' +
          '<span class="band-nr">' + ('0' + (bi + 1)).slice(-2) + '</span>' +
          '<h3 class="band-titel" data-de="' + band.de + '" data-tr="' + band.tr + '">' + band.de + '</h3>' +
          '<span class="band-zahl" data-n="' + liste.length + '"></span>' +
        '</div>' +
        '<div class="mosaik-reihen"></div>';
      wurzel.appendChild(el);

      var reihenEl = el.querySelector('.mosaik-reihen');
      var eintrag = { el: el, liste: liste, versatz: bi * 2, reihenEl: reihenEl, reihen: [] };
      baender.push(eintrag);
      liste.forEach(function (b) { alleBilder.push(b); });
    });

    setzen();
    beschriften();
    einblenden();
  }

  /* Die Baender entstehen erst nach v2.js, deshalb bekommen sie hier ihren
     eigenen Beobachter - sonst blieben sie auf opacity 0 stehen. */
  function einblenden() {
    var neue = wurzel.querySelectorAll('.band.rv');
    if (!('IntersectionObserver' in window)) {
      neue.forEach(function (el) { el.classList.add('in'); });
      return;
    }
    var io = new IntersectionObserver(function (eintraege) {
      eintraege.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: .06 });
    neue.forEach(function (el) { io.observe(el); });
  }

  /* --- 5. Reihen setzen (auch bei jeder Groessenaenderung) ---------------- */
  function setzen() {
    baender.forEach(function (band) {
      var breite = band.reihenEl.clientWidth;
      if (!breite) return;
      var luecke = parseFloat(getComputedStyle(band.reihenEl).gap) || 12;
      var reihen = reihenBilden(band.liste, breite, luecke, band.versatz);

      // Nur neu zeichnen, wenn sich die Aufteilung wirklich geaendert hat.
      var kennung = reihen.map(function (r) { return r.length; }).join('-');
      if (band.kennung !== kennung) {
        band.kennung = kennung;
        band.reihenEl.innerHTML = reihen.map(function (reihe) {
          return '<div class="mosaik-reihe">' + reihe.map(function (b) {
            var i = alleBilder.indexOf(b);
            return '<figure class="mk" data-i="' + i + '" tabindex="0" role="button"' +
              ' style="flex:' + (b.w / b.h).toFixed(4) + ' 1 0" aria-label="' + b.t + '">' +
              '<img src="assets/img/k/' + b.f + '-k.jpg" alt="' + b.t + '"' +
              ' loading="lazy" decoding="async">' +
              '</figure>';
          }).join('') + '</div>';
        }).join('');
      }

      // Hoehe je Reihe: dadurch fuellt jede Reihe die Breite exakt aus.
      var kinder = band.reihenEl.children;
      for (var i = 0; i < kinder.length; i++) {
        var h = hoeheVon(reihen[i], breite, luecke);
        kinder[i].style.height = Math.round(h) + 'px';
        // Grosse Kacheln bekommen die hoeher aufgeloeste Datei nachgereicht.
        if (h > 430) {
          var figs = kinder[i].querySelectorAll('.mk');
          for (var j = 0; j < figs.length; j++) {
            var bild = figs[j].querySelector('img');
            var quelle = bild.getAttribute('src').replace('-k.jpg', '.jpg');
            if (bild.getAttribute('srcset') !== quelle) {
              bild.setAttribute('srcset', bild.getAttribute('src') + ' 900w, ' + quelle + ' 1600w');
              bild.setAttribute('sizes', Math.round(h * reihen[i][j].w / reihen[i][j].h) + 'px');
            }
          }
        }
      }
    });
  }

  /* --- 6. Beschriftung in der aktiven Sprache ----------------------------- */
  function beschriften() {
    var tr = trAn();
    wurzel.querySelectorAll('.band-titel').forEach(function (el) {
      el.textContent = tr ? el.dataset.tr : el.dataset.de;
    });
    wurzel.querySelectorAll('.band-zahl').forEach(function (el) {
      el.textContent = el.dataset.n + (tr ? ' fotoğraf' : ' Aufnahmen');
    });
  }

  /* --- 7. Grossansicht ---------------------------------------------------- */
  var lb = document.getElementById('lb');
  if (lb) {
    var lbBild = lb.querySelector('img');
    var lbTitel = lb.querySelector('figcaption b');
    var lbZeile = lb.querySelector('figcaption span');
    var lauf = 0;

    var katName = function (k) {
      var e = (window.TK_KATS || {})[k];
      return e ? e[trAn() ? 1 : 0] : k;
    };

    function zeigen(i) {
      var b = alleBilder[(i + alleBilder.length) % alleBilder.length];
      if (!b) return;
      lauf = alleBilder.indexOf(b);
      lbBild.src = 'assets/img/k/' + b.f + '.jpg';
      lbBild.alt = b.t;
      lbTitel.textContent = b.t;
      lbZeile.textContent = [katName(b.kat), b.jahr || ''].filter(Boolean).join(' · ');
      lb.classList.add('auf');
      document.body.style.overflow = 'hidden';
    }
    function schliessen() {
      lb.classList.remove('auf');
      document.body.style.overflow = '';
    }

    wurzel.addEventListener('click', function (e) {
      var fig = e.target.closest('.mk');
      if (fig) zeigen(+fig.dataset.i);
    });
    wurzel.addEventListener('keydown', function (e) {
      var fig = e.target.closest('.mk');
      if (fig && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); zeigen(+fig.dataset.i); }
    });
    lb.querySelector('.lb-x').addEventListener('click', schliessen);
    lb.querySelector('.lb-pv').addEventListener('click', function () { zeigen(lauf - 1); });
    lb.querySelector('.lb-nx').addEventListener('click', function () { zeigen(lauf + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) schliessen(); });
    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('auf')) return;
      if (e.key === 'Escape') schliessen();
      if (e.key === 'ArrowLeft') zeigen(lauf - 1);
      if (e.key === 'ArrowRight') zeigen(lauf + 1);
    });
  }

  /* --- 8. Start ----------------------------------------------------------- */
  aufbauen();

  var bremse;
  window.addEventListener('resize', function () {
    clearTimeout(bremse);
    bremse = setTimeout(setzen, 140);
  }, { passive: true });

  window.addEventListener('tk-lang', beschriften);
})();
