/* Gemeinsame Bausteine für die Varianten 2 und 3.
   Variante 1 hat ihre eigene, ältere Fassung in v1.js. */
window.TK = (function () {
  'use strict';

  /* ---------- Bildbestand ---------- */
  const BILDER = window.TK_BILDER || [];
  const KATS = window.TK_KATS || {};

  function katName(k, sprache) {
    return (KATS[k] || [k, k])[sprache === 'tr' ? 1 : 0];
  }
  function zusatz(b) {
    return [b.kunde, b.jahr].filter(Boolean).join(' · ');
  }
  // 'quer' = breiter als 1.5, 'hoch' = schmaler als 0.85, sonst 'normal'
  function format(b) {
    const r = b.w / b.h;
    return r >= 1.5 ? 'quer' : (r <= 0.85 ? 'hoch' : 'normal');
  }
  function pfad(b, groesse) {
    const suffix = { s: '-s', k: '-k', gross: '' }[groesse] || '-k';
    return 'assets/img/k/' + b.f + suffix + '.jpg';
  }
  // Beste zuerst, innerhalb gleicher Eignung die jüngeren Aufnahmen
  function sortiert(liste) {
    return liste.slice().sort((a, b) =>
      (b.stern || 0) - (a.stern || 0) || String(b.jahr).localeCompare(String(a.jahr)));
  }
  function ausKat(k) {
    return sortiert(k === 'alle' ? BILDER : BILDER.filter((b) => b.kat === k));
  }
  // Kategorien in fester Reihenfolge, aber nur die mit Bildern
  const REIHE = ['industriebau', 'innenausbau', 'ladenbau', 'wohnungsbau', 'altbau', 'rohbau'];
  const kategorien = REIHE.filter((k) => BILDER.some((b) => b.kat === k));

  /* ---------- Sprache ---------- */
  // Der deutsche Text steht im HTML; das Wörterbuch liefert nur Türkisch.
  function sprachschalter(woerterbuch, beiWechsel) {
    const DE = {};
    document.querySelectorAll('[data-t]').forEach((el) => { DE[el.dataset.t] = el.innerHTML; });

    function setzen(sprache) {
      const w = sprache === 'tr' ? woerterbuch : DE;
      document.querySelectorAll('[data-t]').forEach((el) => {
        const v = w[el.dataset.t];
        if (v != null) el.innerHTML = v;
      });
      document.documentElement.lang = sprache;
      document.querySelectorAll('[data-sprache]').forEach((b) =>
        b.setAttribute('aria-pressed', String(b.dataset.sprache === sprache)));
      try { localStorage.setItem('tk-lang', sprache); } catch (e) {}
      if (beiWechsel) beiWechsel(sprache);
    }

    document.querySelectorAll('[data-sprache]').forEach((b) =>
      b.addEventListener('click', () => setzen(b.dataset.sprache)));

    let start = 'de';
    try {
      const gemerkt = localStorage.getItem('tk-lang');
      if (gemerkt === 'de' || gemerkt === 'tr') start = gemerkt;
      else if ((navigator.language || '').toLowerCase().indexOf('tr') === 0) start = 'tr';
    } catch (e) {}
    setzen(start);
    return { setzen, jetzt: () => document.documentElement.lang };
  }

  /* ---------- Lightbox ---------- */
  // Baut ihr Markup selbst, damit jede Variante nur TK.lightbox() aufrufen muss.
  function lightbox() {
    const el = document.createElement('div');
    el.className = 'tk-lb';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-modal', 'true');
    el.innerHTML =
      '<button class="tk-lb-x" type="button" aria-label="Schließen">&times;</button>' +
      '<button class="tk-lb-pv" type="button" aria-label="Vorheriges Bild">&lsaquo;</button>' +
      '<figure><img alt=""><figcaption><b></b><span></span></figcaption></figure>' +
      '<button class="tk-lb-nx" type="button" aria-label="Nächstes Bild">&rsaquo;</button>';
    document.body.appendChild(el);

    const img = el.querySelector('img');
    const titel = el.querySelector('figcaption b');
    const info = el.querySelector('figcaption span');
    let liste = [], i = -1, sprache = 'de';

    function zeigen(n) {
      if (!liste.length) return;
      i = (n + liste.length) % liste.length;
      const b = liste[i];
      img.src = pfad(b, 'gross');
      img.alt = b.t;
      titel.textContent = b.t;
      info.textContent = [katName(b.kat, sprache), zusatz(b)].filter(Boolean).join(' · ');
      el.classList.add('auf');
      document.body.style.overflow = 'hidden';
    }
    function zu() { el.classList.remove('auf'); document.body.style.overflow = ''; }

    el.querySelector('.tk-lb-x').addEventListener('click', zu);
    el.querySelector('.tk-lb-pv').addEventListener('click', () => zeigen(i - 1));
    el.querySelector('.tk-lb-nx').addEventListener('click', () => zeigen(i + 1));
    el.addEventListener('click', (e) => { if (e.target === el) zu(); });
    document.addEventListener('keydown', (e) => {
      if (!el.classList.contains('auf')) return;
      if (e.key === 'Escape') zu();
      if (e.key === 'ArrowLeft') zeigen(i - 1);
      if (e.key === 'ArrowRight') zeigen(i + 1);
    });

    return {
      oeffnen(neueListe, index, spr) { liste = neueListe; sprache = spr || 'de'; zeigen(index); },
      sprache(spr) { sprache = spr; },
    };
  }

  /* ---------- Einblenden beim Scrollen ---------- */
  function einblenden(auswahl) {
    const els = document.querySelectorAll(auswahl || '.rv');
    if (!('IntersectionObserver' in window)) {
      els.forEach((e) => e.classList.add('in'));
      return;
    }
    const io = new IntersectionObserver((eintraege, o) => {
      eintraege.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('in'); o.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.08 });
    els.forEach((e) => io.observe(e));
  }

  /* ---------- Bilder sanft aufblenden ---------- */
  function bilderAufblenden(wurzel) {
    (wurzel || document).querySelectorAll('img[data-blende]').forEach((im) => {
      if (im.complete && im.naturalWidth) im.classList.add('da');
      else im.addEventListener('load', () => im.classList.add('da'), { once: true });
    });
  }

  /* ---------- Kontaktformular ---------- */
  function formular(form) {
    if (!form) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      const d = new FormData(form);
      const tr = document.documentElement.lang === 'tr';
      const betreff = (tr ? 'Web talebi: ' : 'Anfrage über die Website: ') + (d.get('thema') || '');
      const text = [
        (tr ? 'Ad: ' : 'Name: ') + (d.get('name') || ''),
        'E-Mail: ' + (d.get('mail') || ''),
        (tr ? 'Telefon: ' : 'Telefon: ') + (d.get('tel') || '–'),
        (tr ? 'Konu: ' : 'Thema: ') + (d.get('thema') || ''),
        '',
        d.get('nachricht') || '',
      ].join('\n');
      location.href = 'mailto:info@t-kaya.de?subject=' +
        encodeURIComponent(betreff) + '&body=' + encodeURIComponent(text);
    });
  }

  /* ---------- Kopfzeile, Menü, Jahr ---------- */
  function kopf(kopfEl, burgerEl, navEl) {
    if (kopfEl) {
      const st = () => kopfEl.classList.toggle('fest', window.scrollY > 4);
      st();
      window.addEventListener('scroll', st, { passive: true });
    }
    if (burgerEl && navEl) {
      burgerEl.addEventListener('click', () => {
        const auf = document.body.classList.toggle('menu-auf');
        burgerEl.setAttribute('aria-expanded', String(auf));
      });
      navEl.addEventListener('click', (e) => {
        if (e.target.tagName === 'A') {
          document.body.classList.remove('menu-auf');
          burgerEl.setAttribute('aria-expanded', 'false');
        }
      });
    }
    const jahr = document.getElementById('jahr');
    if (jahr) jahr.textContent = new Date().getFullYear();
  }

  return { BILDER, KATS, kategorien, katName, zusatz, format, pfad, sortiert, ausKat,
           sprachschalter, lightbox, einblenden, bilderAufblenden, formular, kopf };
})();
