/* Planungsbüro Tanju Kaya — Entwurf | main.js */
(function () {
  "use strict";

  /* ---------------------------------------------------------
     1. Projektkacheln (Platzhalter-Grafiken)
     --------------------------------------------------------- */
  const G = '<rect width="400" height="300" fill="#121218"/><g stroke="rgba(237,234,229,.06)" stroke-width="1">' +
    [40, 80, 120, 160, 200, 240, 280].map(y => `<path d="M0 ${y}h400"/>`).join('') +
    [40, 80, 120, 160, 200, 240, 280, 320, 360].map(x => `<path d="M${x} 0v300"/>`).join('') + '</g>';

  const A = 'stroke="#c08b4a" stroke-width="1.6" fill="none" stroke-linejoin="round"';
  const B = 'stroke="rgba(237,234,229,.30)" stroke-width="1.2" fill="none"';

  const ART = {
    villa: `<svg viewBox="0 0 400 300">${G}
      <g ${A}><path d="M60 230h280M90 230v-90h130v90M220 230v-60h90v60"/>
      <path d="M78 140h154M208 170h114"/><path d="M110 165h35v30h-35zM165 165h35v30h-35zM245 190h30v40h-30z"/></g>
      <g ${B}><path d="M40 230h320M60 250v-20M340 250v-20"/><path d="M120 120v-20h20"/></g></svg>`,

    halle: `<svg viewBox="0 0 400 300">${G}
      <g ${A}><path d="M50 235h300M70 235v-80M330 235v-80"/>
      <path d="M70 155l40-35 40 35 40-35 40 35 40-35 40 35"/>
      <path d="M110 120v35M190 120v35M270 120v35"/>
      <path d="M90 235v-45h50v45M170 235v-30h60v30"/></g>
      <g ${B}><path d="M40 235h320"/><path d="M300 205h20v30h-20z"/></g></svg>`,

    laden: `<svg viewBox="0 0 400 300">${G}
      <g ${A}><path d="M55 240h290M75 240V95h250v145"/>
      <path d="M75 130h250"/><path d="M100 160h90M100 185h90M100 210h90"/>
      <path d="M230 240v-55h70v55"/><path d="M230 205h70"/></g>
      <g ${B}><path d="M75 95l125-35 125 35"/><path d="M140 160v50M170 160v50"/></g></svg>`,

    altbau: `<svg viewBox="0 0 400 300">${G}
      <g ${A}><path d="M70 245h260M90 245V85h220v160"/>
      <path d="M90 120h220M90 175h220"/>
      <path d="M125 100a15 15 0 0130 0v20h-30zM185 100a15 15 0 0130 0v20h-30zM245 100a15 15 0 0130 0v20h-30z"/>
      <path d="M125 145h30v30h-30zM185 145h30v30h-30zM245 145h30v30h-30z"/>
      <path d="M175 245v-45h50v45"/></g>
      <g ${B}><path d="M78 85h244"/><path d="M60 245h280"/></g></svg>`,

    wohnen: `<svg viewBox="0 0 400 300">${G}
      <g ${A}><path d="M60 245h280"/>
      <path d="M80 245V125h90v120M180 245V85h80v160M270 245V150h60v95"/>
      <path d="M80 165h90M80 205h90M180 125h80M180 165h80M180 205h80M270 190h60"/>
      <path d="M100 135h20v20h-20zM130 135h20v20h-20zM200 95h20v20h-20zM230 95h20v20h-20zM290 160h20v20h-20z"/></g>
      <g ${B}><path d="M50 245h300"/></g></svg>`,

    messe: `<svg viewBox="0 0 400 300">${G}
      <g ${A}><path d="M70 240h260"/>
      <path d="M90 240V110h180v130"/><path d="M90 110h180"/>
      <path d="M110 240v-50h70v50M110 190h70"/>
      <path d="M210 240v-80h40v80"/>
      <path d="M270 240V150h60v90M270 190h60"/></g>
      <g ${B}><path d="M85 105h190M120 140h120"/><path d="M150 60v45M210 60v45"/><path d="M140 55h80v10h-80z"/></g></svg>`
  };

  const PROJECTS = [
    { art: 'villa',  tag: { de: 'Architektur',      tr: 'Mimarlık' },        t: { de: 'Villen & Wohnhäuser',       tr: 'Villalar & Konutlar' },      m: { de: 'Entwurf bis Ausführung', tr: 'Tasarımdan uygulamaya' } },
    { art: 'halle',  tag: { de: 'Industriebau',     tr: 'Endüstriyel yapı' },t: { de: 'Produktions- & Lagerhallen',tr: 'Üretim & depo binaları' },   m: { de: 'Gewerbe',                tr: 'Ticari' } },
    { art: 'laden',  tag: { de: 'Ladenbau',         tr: 'Mağaza tasarımı' }, t: { de: 'Verkaufsflächen & Filialen',tr: 'Satış alanları & şubeler' }, m: { de: 'Innenausbau',            tr: 'İç yapım' } },
    { art: 'altbau', tag: { de: 'Altbausanierung',  tr: 'Restorasyon' },     t: { de: 'Sanierung & Denkmalpflege', tr: 'Restorasyon & koruma' },     m: { de: 'Bestand',                tr: 'Mevcut yapı' } },
    { art: 'wohnen', tag: { de: 'Wohnungsbau',      tr: 'Konut yapımı' },    t: { de: 'Mehrfamilienhäuser',        tr: 'Çok aileli konutlar' },      m: { de: 'Neubau',                 tr: 'Yeni yapı' } },
    { art: 'messe',  tag: { de: 'Messebau',         tr: 'Fuar standı' },     t: { de: 'Messestände & Displays',    tr: 'Fuar standları & teşhir' },  m: { de: 'Temporär',               tr: 'Geçici' } }
  ];

  const grid = document.getElementById('projGrid');
  if (grid) {
    grid.innerHTML = PROJECTS.map(p => `
      <a class="proj" href="#kontakt">
        <div class="proj-art">
          <span class="proj-tag" data-tag>${p.tag.de}</span>
          ${ART[p.art]}
        </div>
        <div class="proj-body">
          <h3 data-t>${p.t.de}</h3>
          <span data-m>${p.m.de}</span>
        </div>
      </a>`).join('');
  }

  /* ---------------------------------------------------------
     2. Sprachumschaltung DE / TR
     --------------------------------------------------------- */
  const TR = {
    demoTitle: 'Taslak',
    demoText: ' – Planungsbüro Tanju Kaya için hazırlanmış örnek tasarım. Henüz yayında değil. Hazırlayan: Ihsan Yılmaz.',
    brandSub: 'Planlama bürosu · Coburg',
    navServices: 'Hizmetler', navProjects: 'Projeler', navIntl: 'Uluslararası', navOffice: 'Büro', navContact: 'İletişim',

    heroEyebrow: 'Planlama bürosu · Coburg · Almanya',
    heroTitle: 'İlk çizgiden <em>anahtar teslimine.</em>',
    heroLead: 'Mimarlık ve iç mimarlık, mağaza tasarımı, fuar standı, endüstriyel yapı ve restorasyon. Seri üretime veya anahtar teslimine kadar yanınızdayız – Coburg’da, Almanya genelinde ve yurt dışında.',
    ctaProjects: 'Projeleri gör', ctaContact: 'Teklif isteyin',
    fact1t: 'Konum',        fact1d: 'Coburg, Bavyera',
    fact2t: 'Üyelik',       fact2d: 'VDA No. 4028',
    fact3t: 'Yönetim',      fact3d: 'Dipl.-Ing. (FH) Tanju Kaya',
    fact4t: 'Diller',       fact4d: 'Almanca · Türkçe',

    servEyebrow: 'Hizmetler',
    servTitle: 'Tek büro. Bütün süreç.',
    servLead: 'Tasarım, ruhsat projesi, uygulama ve şantiye yönetimi – hepsi tek elden. Yatırımcılar, mağazalar, sanayi ve özel müşteriler için.',
    s1t: 'Mimarlık & iç mimarlık', s1d: 'Konutlar, villalar ve iç mekânlar – tasarımdan ruhsata ve uygulama projesine kadar.',
    s2t: 'Mağaza tasarımı',        s2d: 'Satan satış alanları: konsept, mobilya, aydınlatma ve işletme açıkken uygulama.',
    s3t: 'Fuar standı',            s3d: 'Akılda kalan fuar standları – planlanır, üretilir ve zamanında kurulur.',
    s4t: 'Endüstriyel yapı',       s4d: 'Hangarlar, üretim ve işletme binaları. İşlevsel planlanır, ekonomik inşa edilir.',
    s5t: 'Restorasyon',            s5d: 'Mevcut yapıyı korumak ve geliştirmek – enerji, taşıyıcı sistem ve tasarım.',
    s6t: 'Tarihi eser koruma',     s6d: 'Tescilli yapıların ilgili kurumlarla uyum içinde restorasyonu.',
    s7t: 'Ürün tasarımı',          s7d: 'Tasarımdan seri üretime – prototip ve üretim dosyaları dahil.',
    s8t: 'Mobilya tasarımı',       s8d: 'Tek parça ve seri mobilya, atölye ve endüstriyel üretim için detaylandırılmış.',

    projEyebrow: 'Projeler',
    projTitle: 'Görülmeye değer referanslar.',
    projLead: 'Her kategori kendi sayfasını alır: fotoğraflar, kısa açıklama, yer ve yıl – müşterinin de Google’ın da aradığı tam olarak bu.',
    projNote: 'Buradaki görseller yer tutucudur. Orijinal fotoğraflarınızı gönderdiğinizde burada gerçek projeleriniz olur – her biri kendi alt sayfası, galerisi ve metniyle.',

    intlEyebrow: 'Uluslararası',
    intlTitle: 'Coburg’da planlandı. Altı ülkede inşa edildi.',
    intlLead: 'Dominik Cumhuriyeti, Türkiye, Dubai, Kuveyt, Madrid ve Moskova’da villalar ve projeler – Alman planlama kalitesi, uluslararası uygulama, iki dilde takip.',
    c1: 'Dominik Cumhuriyeti', c2: 'Türkiye', c3: 'Dubai', c4: 'Kuveyt', c5: 'Madrid', c6: 'Moskova',

    officeEyebrow: 'Büro',
    officeTitle: 'Her türlü yapı işinde güvenilir çözüm ortağınız.',
    officeLead: 'Tasarımda kapsamlı kalite ve sizin isteklerinize göre bir uygulama – gücümüz bu. Seri üretime veya anahtar teslimine kadar yanınızdayız.',
    portraitCap: 'Yer tutucu – portre fotoğrafınız buraya gelecek',
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
    footDemo: 'Taslak / Entwurf · Ihsan Yılmaz'
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
    document.querySelectorAll('.proj').forEach((el, i) => {
      const p = PROJECTS[i]; if (!p) return;
      el.querySelector('[data-tag]').textContent = p.tag[lang] || p.tag.de;
      el.querySelector('[data-t]').textContent = p.t[lang] || p.t.de;
      el.querySelector('[data-m]').textContent = p.m[lang] || p.m.de;
    });
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
  if (start !== 'de') setLang(start);

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
