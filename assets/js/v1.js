/* Planungsbüro Tanju Kaya — Entwurf | main.js */
(function () {
  "use strict";

  /* ---------------------------------------------------------
     1. Projektgalerie mit Filter und Lightbox
     --------------------------------------------------------- */
  const BILDER = window.TK_BILDER || [];
  const KATS = window.TK_KATS || {};
  const ANFANG = 12;
  let kat = 'alle', alleZeigen = false, sprache = 'de';

  const filter = document.getElementById('filter');
  const galerie = document.getElementById('galerie');
  const mehr = document.getElementById('mehr');
  const lb = document.getElementById('lb');
  const lbImg = lb.querySelector('img');
  const lbTitel = lb.querySelector('figcaption b');
  const lbInfo = lb.querySelector('figcaption span');
  let sichtbar = [], aktuell = -1;

  const katName = (k) => (KATS[k] || [k, k])[sprache === 'tr' ? 1 : 0];
  const zusatz = (b) => [b.kunde, b.jahr].filter(Boolean).join(' · ');

  // Vorhandene Kategorien in fester Reihenfolge, aber nur die, zu denen es Bilder gibt.
  const REIHE = ['industriebau', 'innenausbau', 'ladenbau', 'wohnungsbau', 'altbau', 'rohbau'];
  const vorhanden = REIHE.filter((k) => BILDER.some((b) => b.kat === k));

  function knoepfe() {
    filter.innerHTML = '<button class="an" data-k="alle"></button>' +
      vorhanden.map((k) => `<button data-k="${k}"></button>`).join('');
    beschriften();
  }
  function beschriften() {
    filter.querySelectorAll('button').forEach((b) => {
      b.textContent = b.dataset.k === 'alle' ? (sprache === 'tr' ? 'Tümü' : 'Alle') : katName(b.dataset.k);
    });
  }

  function zeichnen() {
    const liste = BILDER.filter((b) => kat === 'alle' || b.kat === kat)
      .sort((a, b) => b.stern - a.stern || String(b.jahr).localeCompare(String(a.jahr)));
    const grenze = (kat === 'alle' && !alleZeigen) ? ANFANG : liste.length;
    sichtbar = liste.slice(0, grenze);
    galerie.innerHTML = sichtbar.map((b, i) => `
      <figure class="bild" data-i="${i}" tabindex="0" role="button" aria-label="${b.t}">
        <img src="assets/img/k/${b.f}-k.jpg" alt="${b.t}" width="${b.w}" height="${b.h}"
             loading="${i < 6 ? 'eager' : 'lazy'}" decoding="async">
        <figcaption><b>${b.t}</b><span>${[katName(b.kat), zusatz(b)].filter(Boolean).join(' · ')}</span></figcaption>
      </figure>`).join('');
    galerie.querySelectorAll('img').forEach((im) => {
      if (im.complete) im.classList.add('da');
      else im.addEventListener('load', () => im.classList.add('da'), { once: true });
    });
    mehr.hidden = !(kat === 'alle' && !alleZeigen && liste.length > ANFANG);
    // Letzte Zeile auffuellen, sonst endet das Raster halb leer
    if (window.TK_REIHEN) TK_REIHEN.fuellen(galerie, '.bild');
  }

  filter.addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return;
    filter.querySelectorAll('button').forEach((x) => x.classList.toggle('an', x === b));
    kat = b.dataset.k; zeichnen();
  });
  mehr.querySelector('button').addEventListener('click', () => { alleZeigen = true; zeichnen(); });

  function oeffnen(i) {
    if (!sichtbar.length) return;
    aktuell = (i + sichtbar.length) % sichtbar.length;
    const b = sichtbar[aktuell];
    lbImg.src = `assets/img/k/${b.f}.jpg`;
    lbImg.alt = b.t;
    lbTitel.textContent = b.t;
    lbInfo.textContent = [katName(b.kat), zusatz(b)].filter(Boolean).join(' · ');
    lb.classList.add('auf');
    document.body.style.overflow = 'hidden';
  }
  function schliessen() { lb.classList.remove('auf'); document.body.style.overflow = ''; }

  galerie.addEventListener('click', (e) => {
    const f = e.target.closest('.bild'); if (f) oeffnen(+f.dataset.i);
  });
  galerie.addEventListener('keydown', (e) => {
    const f = e.target.closest('.bild');
    if (f && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); oeffnen(+f.dataset.i); }
  });
  lb.querySelector('.lb-x').addEventListener('click', schliessen);
  lb.querySelector('.lb-pv').addEventListener('click', () => oeffnen(aktuell - 1));
  lb.querySelector('.lb-nx').addEventListener('click', () => oeffnen(aktuell + 1));
  lb.addEventListener('click', (e) => { if (e.target === lb) schliessen(); });
  document.addEventListener('keydown', (e) => {
    if (!lb.classList.contains('auf')) return;
    if (e.key === 'Escape') schliessen();
    if (e.key === 'ArrowLeft') oeffnen(aktuell - 1);
    if (e.key === 'ArrowRight') oeffnen(aktuell + 1);
  });

  knoepfe();
  if (window.TK_REIHEN) TK_REIHEN.beobachten(galerie, '.bild');

  /* ---------------------------------------------------------
     2. Sprachumschaltung DE / TR
     --------------------------------------------------------- */
  const TR = {
    demoTitle: 'Önizleme',
    demoText: ' – Planungsbüro Tanju Kaya’nın yeni web sitesi, hazırlık aşamasında.',
    q5t: 'Hizmet aşamaları', q5d: 'Ön tasarım, uygulama projesi, ihale, şantiye denetimi',
    q6t: 'Referanslar', q6d: 'Potsdamer Platz Arkaden, Alexa Berlin, Ringcenter Berlin, Schlossparkcenter Schwerin',
    brandSub: 'Planlama bürosu · Coburg',
    navServices: 'Hizmetler', navProjects: 'Projeler', navIntl: 'Uluslararası', navOffice: 'Büro', navContact: 'İletişim',

    heroEyebrow: 'Planlama bürosu · Coburg · Almanya',
    ctaProjects: 'Projeleri gör', ctaContact: 'Teklif isteyin',

    servEyebrow: 'Hizmetler',
    servTitle: 'Tek büro. Bütün süreç.',
    servLead: 'Tasarım, ruhsat projesi, uygulama ve şantiye yönetimi – hepsi tek elden. Yatırımcılar, mağazalar, sanayi ve özel müşteriler için.',
    s1t: 'Mimarlık & iç mimarlık', s1d: 'Konutlar, villalar ve iç mekânlar – tasarımdan ruhsata ve uygulama projesine kadar.',
    s2t: 'Mağaza tasarımı',        s2d: 'Satan satış alanları – Potsdamer Platz Arkaden, Alexa ve Ringcenter Berlin, Schlossparkcenter Schwerin gibi.',
    s3t: 'Fuar standı',            s3d: 'Akılda kalan fuar standları – Frankfurt, Münih, Köln, Berlin, Düsseldorf, Hannover, Milano, Madrid ve Paris fuarlarında.',
    s4t: 'Endüstriyel yapı',       s4d: 'Hangarlar, üretim ve işletme binaları. İşlevsel planlanır, ekonomik inşa edilir.',
    s5t: 'Restorasyon',            s5d: 'Mevcut yapıyı korumak ve geliştirmek – enerji, taşıyıcı sistem ve tasarım.',
    s6t: 'Tarihi eser koruma',     s6d: 'Tescilli yapıların ilgili kurumlarla uyum içinde restorasyonu.',
    s7t: 'Ürün tasarımı',          s7d: 'Tasarımdan seri üretime – prototip ve üretim dosyaları dahil.',
    s8t: 'Mobilya tasarımı',       s8d: 'Tek parça ve seri mobilya, atölye ve endüstriyel üretim için detaylandırılmış.',

    projEyebrow: 'Projeler',
    projTitle: 'Görülmeye değer referanslar.',
    projLead: 'Arşivden bir kesit: endüstriyel yapı, iç yapım, konut ve mağaza tasarımı. Büyütmek için tıklayın.',
    mehrBtn: 'Tüm projeleri göster',

    intlEyebrow: 'Uluslararası',
    intlTitle: 'Coburg’da planlandı. Altı ülkede inşa edildi.',
    intlLead: 'Dominik Cumhuriyeti, Türkiye, Dubai, Kuveyt, Madrid ve Moskova’da villalar ve projeler – Alman planlama kalitesi, uluslararası uygulama, iki dilde takip.',
    c1: 'Dominik Cumhuriyeti', c2: 'Türkiye', c3: 'Dubai', c4: 'Kuveyt', c5: 'Madrid', c6: 'Moskova',

    officeEyebrow: 'Büro',
    officeTitle: 'Her türlü yapı işinde güvenilir çözüm ortağınız.',
    officeLead: 'Tasarımda kapsamlı kalite ve sizin isteklerinize göre bir uygulama – gücümüz bu. Seri üretime veya anahtar teslimine kadar yanınızdayız.',
    q1t: 'Yönetim',    q1d: 'Dipl.-Ing. (FH) Tanju Kaya',
    q2t: 'Oda / birlik',q2d: 'Alman Mimarlar Birliği (VDA), üye no. 4028',
    q3t: 'Merkez',     q3d: 'Dr.-Hans-Schack-Straße 28, 96450 Coburg',
    q4t: 'Uzmanlık',   q4d: 'Mağaza, fuar, endüstriyel yapı, restorasyon, koruma, ürün ve mobilya tasarımı',

    contactEyebrow: 'İletişim',
    contactTitle: 'Projenizi bize anlatın.',
    contactLead: 'Kısa bir telefon ya da üç satır yeterli. Genellikle bir iş günü içinde dönüş yapıyoruz.',
    kAddr: 'Adres', kPhone: 'Telefon', kFax: 'Faks', kMail: 'E-posta', kVat: 'Vergi no.',
    fName: 'Adınız', fMail: 'E-posta', fTel: 'Telefon (isteğe bağlı)', fTopic: 'Konu', fMsg: 'Projeniz', fSend: 'Talebi gönder',
    o1: 'Mimarlık / yeni yapı', o2: 'Mağaza tasarımı', o3: 'Fuar standı', o4: 'Endüstriyel yapı',
    o5: 'Restorasyon / koruma', o6: 'Ürün & mobilya tasarımı', o7: 'Diğer',
    fNote: 'Bu taslakta buton, hazır doldurulmuş bir e-posta açar. Yayına giren sitede talep doğrudan gönderilir – spam koruması ve otomatik alındı bildirimi ile.',

    fCol1: 'Planungsbüro Tanju Kaya', fCol2: 'Menü', fCol3: 'İletişim',
    footAbout: 'Mimarlık, mağaza tasarımı, fuar standı, endüstriyel yapı, restorasyon ve tasarım – Coburg’dan.',
    fImpressum: 'Künye', fPrivacy: 'Gizlilik',
    footDemo: 'Web sitesi: Ihsan Yılmaz'
  };

  const DE = {};
  document.querySelectorAll('[data-i18n]').forEach(el => { DE[el.dataset.i18n] = el.textContent; });
  document.querySelectorAll('[data-i18n-html]').forEach(el => { DE[el.dataset.i18nHtml] = el.innerHTML; });

  function setLang(lang) {
    const dict = lang === 'tr' ? TR : DE;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const v = dict[el.dataset.i18n]; if (v != null) el.textContent = v;
    });
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      const v = dict[el.dataset.i18nHtml]; if (v != null) el.innerHTML = v;
    });
    sprache = lang;
    beschriften();
    zeichnen();
    document.documentElement.lang = lang;
    document.querySelectorAll('.lang button').forEach(b =>
      b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
    try { localStorage.setItem('tk-lang', lang); } catch (e) {}
  }

  document.querySelectorAll('.lang button').forEach(b =>
    b.addEventListener('click', () => setLang(b.dataset.lang)));

  let start = 'de';
  try {
    const saved = localStorage.getItem('tk-lang');
    if (saved === 'de' || saved === 'tr') {
      start = saved;
    } else if ((navigator.language || '').toLowerCase().indexOf('tr') === 0) {
      start = 'tr';
    }
  } catch (e) {}
  setLang(start);   // immer: setLang zeichnet auch die Galerie

  /* ---------------------------------------------------------
     3. Navigation, Sticky-Header, Reveal
     --------------------------------------------------------- */
  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');
  if (burger) {
    burger.addEventListener('click', () => {
      const open = document.body.classList.toggle('nav-open');
      burger.setAttribute('aria-expanded', String(open));
    });
    nav.addEventListener('click', e => {
      if (e.target.tagName === 'A') {
        document.body.classList.remove('nav-open');
        burger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  const head = document.getElementById('head');
  const onScroll = () => head.classList.toggle('is-stuck', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const io = 'IntersectionObserver' in window
    ? new IntersectionObserver((entries, obs) => {
        entries.forEach(en => {
          if (en.isIntersecting) { en.target.classList.add('in'); obs.unobserve(en.target); }
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: .12 })
    : null;
  document.querySelectorAll('.rv').forEach(el => io ? io.observe(el) : el.classList.add('in'));

  /* ---------------------------------------------------------
     4. Kontaktformular (Entwurf: öffnet Mailprogramm)
     --------------------------------------------------------- */
  const form = document.getElementById('kform');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      const f = new FormData(form);
      const tr = document.documentElement.lang === 'tr';
      const subject = (tr ? 'Web talebi: ' : 'Anfrage über die Website: ') + (f.get('topic') || '');
      const body = [
        (tr ? 'Ad: ' : 'Name: ') + (f.get('name') || ''),
        (tr ? 'E-posta: ' : 'E-Mail: ') + (f.get('mail') || ''),
        (tr ? 'Telefon: ' : 'Telefon: ') + (f.get('tel') || '–'),
        (tr ? 'Konu: ' : 'Thema: ') + (f.get('topic') || ''),
        '',
        (tr ? 'Mesaj:' : 'Nachricht:'),
        f.get('msg') || ''
      ].join('\n');
      window.location.href = 'mailto:info@t-kaya.de?subject=' +
        encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    });
  }

  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
