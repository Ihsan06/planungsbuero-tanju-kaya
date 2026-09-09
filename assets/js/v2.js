/* Planungsbüro Tanju Kaya — Entwurf | main.js */
(function () {
  "use strict";

  /* ---------------------------------------------------------
     1. Sprachumschaltung DE / TR
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
    projLead: 'Büronun arşivinden temalara göre bir kesit – üretim halinden karşılama alanına. Büyük görmek için fotoğrafa tıklayın.',

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
    document.documentElement.lang = lang;
    document.querySelectorAll('.lang button').forEach(b =>
      b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
    try { localStorage.setItem('tk-lang', lang); } catch (e) {}
    // Das Themenmosaik beschriftet sich daraufhin selbst neu.
    window.dispatchEvent(new CustomEvent('tk-lang', { detail: lang }));
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
