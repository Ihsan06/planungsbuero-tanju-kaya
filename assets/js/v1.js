/* Variante 1 – Projektgalerie, Filter, Lightbox, DE/TR, Navigation */
(function () {
  'use strict';
  var P = window.TK_PROJECTS || [], CATS = window.TK_CATS || {};
  var lang = 'de', INITIAL = 24, cat = 'all', shownAll = false;

  /* ---- Galerie ---- */
  var grid = document.getElementById('pgrid'), more = document.getElementById('more'), filters = document.getElementById('filters');
  function catLabel(c) { return (CATS[c] || [c, c])[lang === 'tr' ? 1 : 0]; }
  function render() {
    var list = P.filter(function (p) { return cat === 'all' || p.c === cat; });
    var limit = (cat === 'all' && !shownAll) ? INITIAL : list.length;
    grid.innerHTML = list.slice(0, limit).map(function (p, i) {
      var idx = P.indexOf(p);
      return '<figure class="pi' + (p.c === 'industriebau' ? ' contain' : '') + '" data-i="' + idx + '" tabindex="0" role="button">' +
        '<img src="assets/img/p/' + p.f + '" alt="' + p.n + ' – ' + catLabel(p.c) + '" loading="' + (i < 8 ? 'eager' : 'lazy') + '" width="' + p.w + '" height="' + p.h + '">' +
        '<figcaption>' + p.n + '<small>' + catLabel(p.c) + '</small></figcaption></figure>';
    }).join('');
    grid.querySelectorAll('img').forEach(function (im) {
      if (im.complete) im.classList.add('ld'); else im.addEventListener('load', function () { im.classList.add('ld'); });
    });
    more.hidden = !(cat === 'all' && !shownAll && list.length > INITIAL);
    var R = window.TK_REFS || {}, ref = document.getElementById('refline');
    if (ref) { ref.textContent = R[cat] ? R[cat][lang] || R[cat].de : ''; ref.hidden = !R[cat]; }
  }
  filters.innerHTML = '<button class="on" data-c="all"></button>' + Object.keys(CATS).map(function (c) {
    return '<button data-c="' + c + '"></button>';
  }).join('');
  function labelFilters() {
    filters.querySelectorAll('button').forEach(function (b) {
      b.textContent = b.dataset.c === 'all' ? (lang === 'tr' ? 'Tümü' : 'Alle') : catLabel(b.dataset.c);
    });
  }
  filters.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    filters.querySelectorAll('button').forEach(function (x) { x.classList.toggle('on', x === b); });
    cat = b.dataset.c; render();
  });
  more.addEventListener('click', function () { shownAll = true; render(); });

  /* ---- Lightbox ---- */
  var lb = document.getElementById('lb'), lbImg = lb.querySelector('img'), lbCap = lb.querySelector('p'), cur = -1;
  function visible() { return Array.prototype.map.call(grid.querySelectorAll('.pi'), function (f) { return +f.dataset.i; }); }
  function show(i) {
    var v = visible(); if (!v.length) return;
    if (i < 0) i = v.length - 1; if (i >= v.length) i = 0;
    cur = i; var p = P[v[i]];
    lbImg.src = 'assets/img/p/' + p.f; lbImg.alt = p.n;
    lbCap.innerHTML = p.n + '<small>' + catLabel(p.c) + '</small>';
    lb.classList.add('on'); document.body.style.overflow = 'hidden';
  }
  function close() { lb.classList.remove('on'); document.body.style.overflow = ''; }
  grid.addEventListener('click', function (e) {
    var f = e.target.closest('.pi'); if (f) show(visible().indexOf(+f.dataset.i));
  });
  grid.addEventListener('keydown', function (e) {
    var f = e.target.closest('.pi'); if (f && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); show(visible().indexOf(+f.dataset.i)); }
  });
  lb.querySelector('.x').addEventListener('click', close);
  lb.querySelector('.pv').addEventListener('click', function () { show(cur - 1); });
  lb.querySelector('.nx').addEventListener('click', function () { show(cur + 1); });
  lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
  document.addEventListener('keydown', function (e) {
    if (!lb.classList.contains('on')) return;
    if (e.key === 'Escape') close(); if (e.key === 'ArrowLeft') show(cur - 1); if (e.key === 'ArrowRight') show(cur + 1);
  });

  /* ---- Sprache ---- */
  var TR = {
    demo: '– Planungsbüro Tanju Kaya’nın yeni web sitesi, hazırlık aşamasında.',
    nPartners: 'Ortaklar',
    hPartners: 'Ortaklar', cPartners: 'Birlikte çalıştığımız firmalar',
    p1: 'Mutfaklar', p2: 'Mağaza donanımı', p3: 'Banyo donanımı',
    f5: 'Hizmet aşamaları', f5v: 'Ön tasarım, uygulama projesi, ihale, şantiye denetimi',
    f6: 'Referanslar', f6v: 'Potsdamer Platz Arkaden, Alexa Berlin, Ringcenter Berlin, Schlossparkcenter Schwerin',
    nProjects: 'Projeler', nOffice: 'Büro', nContact: 'İletişim',
    heroLine: 'Mimarlık · Mağaza · Fuar · Endüstriyel yapı · Restorasyon · Ürün tasarımı',
    t1: 'Projeler', t2: 'Büro', t3: 'İletişim',
    hProjects: 'Projeler', cProjects: 'Seçilmiş referanslar',
    hint: 'Fotoğraflar mevcut siteden alındı (düşük çözünürlük). Orijinal fotoğraflarla net görünür.',
    moreBtn: 'Tüm projeleri göster',
    hOffice: 'Büro', cOffice: 'Tanju Kaya',
    lead: 'Her türlü yapı işinde güvenilir çözüm ortağınız. Tasarımda kapsamlı kalite ve isteklerinize göre uygulama gücümüzdür. Seri üretime veya anahtar teslimine kadar yanınızdayız.',
    l1: 'Mağaza tasarımı', l2: 'Fuar standı', l3: 'Endüstriyel yapı', l4: 'Restorasyon', l5: 'Tarihi eser koruma', l6: 'Ürün tasarımı', l7: 'Seri üretime kadar mobilya tasarımı', l8: 'Mimarlık & iç mimarlık',
    bio: 'Dipl.-Ing. (FH) Tanju Kaya, Coburg’daki planlama bürosunu yönetiyor ve Alman Mimarlar Birliği (VDA, No. 4028) üyesidir. Büro projeleri tüm aşamalarda – ön tasarım, uygulama projesi, ihale ve şantiye denetimi – Almanya’da ve yurt dışında yürütür. Almanca ve Türkçe danışmanlık.',
    refsCap: 'Referanslar',
    e1: 'Berlin · Mağaza', e2: 'Berlin · Mağaza', e3: 'Berlin · Mağaza', e4: 'Schwerin · Mağaza',
    r5: 'Villalar', e5: 'Dominik Cumhuriyeti · Türkiye · Dubai · Kuveyt · Madrid · Moskova',
    r6: 'Fuar standları', e6: 'Frankfurt · Münih · Köln · Berlin · Düsseldorf · Hannover · Milano · Madrid · Paris',
    r7: 'Restorasyon', e7: 'Lossaustraße 3a · Mohrenstraße 12 · Coburg',
    f1: 'Yönetim', f2: 'Üyelik', f2v: 'Alman Mimarlar Birliği (VDA), üye no. 4028', f3: 'Uluslararası', f3v: 'Dominik Cumhuriyeti, Türkiye, Dubai, Kuveyt, Madrid, Moskova', f4: 'Diller', f4v: 'Almanca · Türkçe',
    hContact: 'İletişim', cContact: 'Coburg',
    kAddr: 'Adres', kTel: 'Telefon', kFax: 'Faks', kMail: 'E-posta',
    fName: 'Ad', fMail: 'E-posta', fTopic: 'Konu', fMsg: 'Mesaj', fSend: 'Gönder',
    o1: 'Mimarlık / yeni yapı', o2: 'Mağaza tasarımı', o3: 'Fuar standı', o4: 'Endüstriyel yapı', o5: 'Restorasyon', o6: 'Ürün & mobilya tasarımı', o7: 'Diğer',
    fnote: 'Taslakta buton hazır doldurulmuş bir e-posta açar. Yayında talep doğrudan gönderilir.',
    ftTel: 'Telefon', ftMail: 'E-posta', ftImp: 'Künye', ftDs: 'Gizlilik', ftKon: 'İletişim', ftDemo: 'Web sitesi: Ihsan Yılmaz'
  };
  var DE = {};
  document.querySelectorAll('[data-i]').forEach(function (el) { DE[el.dataset.i] = el.innerHTML; });
  function setLang(l) {
    lang = l; var d = l === 'tr' ? TR : DE;
    document.querySelectorAll('[data-i]').forEach(function (el) { if (d[el.dataset.i] != null) el.innerHTML = d[el.dataset.i]; });
    document.documentElement.lang = l;
    document.querySelectorAll('.lang button').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.lang === l)); });
    labelFilters(); render();
    try { localStorage.setItem('tk-lang', l); } catch (e) {}
  }
  document.querySelectorAll('.lang button').forEach(function (b) { b.addEventListener('click', function () { setLang(b.dataset.lang); }); });
  var saved = null; try { saved = localStorage.getItem('tk-lang'); } catch (e) {}
  setLang(saved === 'tr' ? 'tr' : 'de');

  /* ---- Navigation / Header / Reveal / Formular ---- */
  var hd = document.getElementById('hd');
  function st() { hd.classList.toggle('stuck', window.scrollY > 4); } st(); window.addEventListener('scroll', st, { passive: true });
  var bg = document.getElementById('burger');
  bg.addEventListener('click', function () { bg.setAttribute('aria-expanded', String(document.body.classList.toggle('open'))); });
  document.getElementById('nav').addEventListener('click', function (e) { if (e.target.tagName === 'A') document.body.classList.remove('open'); });
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (es, o) {
    es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); o.unobserve(en.target); } });
  }, { threshold: .1 }) : null;
  document.querySelectorAll('.rv').forEach(function (el) { io ? io.observe(el) : el.classList.add('in'); });

  document.getElementById('kform').addEventListener('submit', function (e) {
    e.preventDefault(); var f = e.target; if (!f.reportValidity()) return;
    var d = new FormData(f), tr = lang === 'tr';
    var body = [(tr ? 'Ad: ' : 'Name: ') + d.get('name'), 'E-Mail: ' + d.get('mail'), (tr ? 'Konu: ' : 'Thema: ') + d.get('topic'), '', d.get('msg')].join('\n');
    location.href = 'mailto:info@t-kaya.de?subject=' + encodeURIComponent((tr ? 'Web talebi: ' : 'Anfrage über die Website: ') + d.get('topic')) + '&body=' + encodeURIComponent(body);
  });
  document.getElementById('year').textContent = new Date().getFullYear();
})();
