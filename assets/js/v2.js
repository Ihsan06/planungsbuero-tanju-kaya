/* Planungsbüro Tanju Kaya — Entwurf | main.js */
(function () {
  "use strict";

  /* ---------------------------------------------------------
     1. Projektkacheln (Fotos von der bisherigen Website)
     --------------------------------------------------------- */
  // Zwoelf Referenzen. Die ersten sechs liegen im Altbestand (assets/img/p),
  // die weiteren im aufbereiteten Katalog (assets/img/k, Endung -k = 900 px).
  const PROJECTS = [
    { img: 'p/wohnhaus-02.jpg',                          tag: { de: 'Architektur',     tr: 'Mimarlık' },          t: { de: 'Villen & Wohnhäuser',        tr: 'Villalar & Konutlar' },        m: { de: 'Entwurf bis Ausführung', tr: 'Tasarımdan uygulamaya' } },
    { img: 'p/okado-002.jpg',                            tag: { de: 'Ladenbau',        tr: 'Mağaza tasarımı' },   t: { de: 'Verkaufsflächen & Filialen', tr: 'Satış alanları & şubeler' },   m: { de: 'Innenausbau',            tr: 'İç yapım' } },
    { img: 'p/lossaustr3a.jpg',                          tag: { de: 'Altbausanierung', tr: 'Restorasyon' },       t: { de: 'Sanierung & Denkmalpflege',  tr: 'Restorasyon & koruma' },       m: { de: 'Coburg',                 tr: 'Coburg' } },
    { img: 'p/walkmuehlgasse.jpg',                       tag: { de: 'Wohnungsbau',     tr: 'Konut yapımı' },      t: { de: 'Mehrfamilienhäuser',         tr: 'Çok aileli konutlar' },        m: { de: 'Neubau',                 tr: 'Yeni yapı' } },
    { img: 'p/kapp-05.jpg',                              tag: { de: 'Messebau',        tr: 'Fuar standı' },       t: { de: 'Messestände & Displays',     tr: 'Fuar standları & teşhir' },    m: { de: 'Temporär',               tr: 'Geçici' } },
    { img: 'p/produktdesign-06.jpg',                     tag: { de: 'Produktdesign',   tr: 'Ürün tasarımı' },     t: { de: 'Möbel bis zur Serienreife',  tr: 'Seri üretime kadar mobilya' }, m: { de: 'Design',                 tr: 'Tasarım' } },
    { img: 'k/produktion-spritzguss-k.jpg',              tag: { de: 'Industriebau',    tr: 'Endüstriyel yapı' },  t: { de: 'Produktion & Fertigung',     tr: 'Üretim & imalat' },            m: { de: '2025',                   tr: '2025' } },
    { img: 'k/empfang-gaudlitz-umgesetzt-k.jpg',         tag: { de: 'Innenausbau',     tr: 'İç yapım' },          t: { de: 'Empfang & Foyer',            tr: 'Karşılama & fuaye' },          m: { de: 'Gaudlitz · 2024',        tr: 'Gaudlitz · 2024' } },
    { img: 'k/optikerfachgeschaft-k.jpg',                tag: { de: 'Ladenbau',        tr: 'Mağaza tasarımı' },   t: { de: 'Fachgeschäft & Beratung',    tr: 'Mağaza & danışmanlık' },       m: { de: '2021',                   tr: '2021' } },
    { img: 'k/verwaltungsgebaude-gaudlitz-dammerung-k.jpg', tag: { de: 'Industriebau', tr: 'Endüstriyel yapı' },  t: { de: 'Verwaltungsgebäude',         tr: 'Yönetim binası' },             m: { de: 'Gaudlitz · 2024',        tr: 'Gaudlitz · 2024' } },
    { img: 'k/stahlbau-deckenkonstruktion-k.jpg',        tag: { de: 'Rohbau',          tr: 'Kaba yapı' },         t: { de: 'Tragwerk & Konstruktion',    tr: 'Taşıyıcı sistem' },            m: { de: 'Stahlbau',               tr: 'Çelik yapı' } },
    { img: 'k/groraumburo-k.jpg',                        tag: { de: 'Innenausbau',     tr: 'İç yapım' },          t: { de: 'Büro & Arbeitswelten',       tr: 'Ofis & çalışma alanları' },    m: { de: '2018',                   tr: '2018' } }
  ];

  const grid = document.getElementById('projGrid');
  if (grid) {
    grid.innerHTML = PROJECTS.map(p => `
      <a class="proj" href="#kontakt">
        <div class="proj-art">
          <span class="proj-tag" data-tag>${p.tag.de}</span>
          <img src="assets/img/${p.img}" alt="" loading="lazy">
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
    projLead: 'Her kategori kendi sayfasını alır: fotoğraflar, kısa açıklama, yer ve yıl – müşterinin de Google’ın da aradığı tam olarak bu.',

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
