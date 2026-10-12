/* =====================================================================
   BRAIDS & MORE — SITE LOGIC
   You normally do NOT need to edit this file.
     • Salon name, WhatsApp number, phone, location, hours, pictures,
       hairstyles ................................ edit  config.js
     • Any wording in English or Swahili ......... edit  translations.js
   ===================================================================== */
(function () {
  'use strict';

  var C = window.SALON_CONFIG;
  if (!C) {
    console.error('config.js did not load.');
    var why = window.__configError ? 'The computer says: ' + window.__configError + '. ' : '';
    var box = document.createElement('div');
    box.setAttribute('role', 'alert');
    box.style.cssText = 'position:fixed;inset:0 0 auto 0;z-index:9999;background:#fff4e5;color:#7a4a00;border-bottom:3px solid #e0a040;padding:16px 20px;font:16px/1.5 system-ui,sans-serif';
    box.textContent = 'The site settings file (config.js) has a typing mistake, so the page cannot load. ' + why +
      'Open config.js and look at that line: usually there is an extra or missing comma, quote or bracket. ' +
      'Every line inside a list must end with a single comma, except the last one.';
    document.body.appendChild(box);
    return;
  }

  /* ------------------------------ helpers ------------------------------ */
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var NS = 'http://www.w3.org/2000/svg';

  function el(tag, attrs, children) {
    var n = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) {
      if (k === 'text') n.textContent = attrs[k];
      else n.setAttribute(k, attrs[k]);
    });
    (children || []).forEach(function (c) { if (c) n.appendChild(c); });
    return n;
  }
  function svgIcon(paths, extraClass) {
    var s = document.createElementNS(NS, 'svg');
    s.setAttribute('viewBox', '0 0 24 24'); s.setAttribute('aria-hidden', 'true');
    s.setAttribute('class', extraClass || 'ico');
    paths.forEach(function (d) { var p = document.createElementNS(NS, 'path'); p.setAttribute('d', d); s.appendChild(p); });
    return s;
  }
  function isPlaceholder(v) { return !v || /X{3,}/i.test(v); }
  function waReady() { return /^\d{8,15}$/.test(String(typeof WHATSAPP_NUMBER === 'undefined' ? '' : WHATSAPP_NUMBER)); }
  function waUrl(msg) { return 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(msg); }

  /* A soft pink picture used if any image fails to load (never a broken icon). */
  var FALLBACK = 'data:image/svg+xml;utf8,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">' +
    '<stop offset="0" stop-color="#fde9f3"/><stop offset="1" stop-color="#f2b9d6"/></linearGradient></defs>' +
    '<rect width="400" height="500" fill="url(#g)"/><g fill="none" stroke="#b3257f" stroke-width="10" stroke-linecap="round" opacity=".55">' +
    '<path d="M170 150c40 25 40 50 0 75s-40 50 0 75 40 30 0 50"/><path d="M230 150c-40 25-40 50 0 75s40 50 0 75-40 30 0 50"/></g></svg>');

  function setImg(img, src) {
    img.addEventListener('error', function () {
      if (img.dataset.fb) return; img.dataset.fb = '1'; img.src = FALLBACK;
    });
    img.src = src;
  }
  function makeImg(src, alt) {
    var i = el('img', { alt: alt || '', loading: 'lazy', decoding: 'async' });
    setImg(i, src); return i;
  }

  /* ------------------------------ language ------------------------------ */
  var I18N = window.I18N || {};
  var LANG = 'en';

  /* t('key', {name: 'value'}) -> text in the current language (falls back to English, then the key) */
  function t(key, vars) {
    var e = I18N[key], s = e ? (e[LANG] || e.en || key) : key;
    if (vars) s = s.replace(/\{(\w+)\}/g, function (m, k) { return vars[k] !== undefined ? vars[k] : m; });
    return s;
  }
  /* label for a length/size value, e.g. lab('len.', 'Waist-length') -> "Hadi kiunoni" */
  function lab(prefix, value) { var e = I18N[prefix + value]; return e ? (e[LANG] || e.en) : value; }
  function catTitle(cat) { var e = I18N['cat.' + cat.id]; return e ? (e[LANG] || e.en) : cat.title; }
  /* config field with optional Swahili twin, e.g. taglineSw, altSw, daySw */
  function cfg(obj, field) { return (LANG === 'sw' && obj && obj[field + 'Sw']) ? obj[field + 'Sw'] : (obj ? obj[field] : ''); }
  function galleryAlt(g) { return cfg(g, 'alt'); }

  function detectLang() {
    var q = /[?&]lang=(en|sw)\b/.exec(location.search); if (q) return q[1];
    try { var s = localStorage.getItem('salon-lang'); if (s === 'en' || s === 'sw') return s; } catch (e) { /* storage blocked: fine */ }
    return /^sw/i.test(navigator.language || '') ? 'sw' : 'en';
  }

  /* --------------------------- application state --------------------------- */
  var state = { style: '', styleCat: '', length: '', size: '' };
  var galleryFilter = 'all';
  var bookingVisible = false;

  /* ------------------------ images from config ------------------------ */
  $$('[data-cfg]').forEach(function (img) { setImg(img, C.images[img.getAttribute('data-cfg')]); });
  $('#year').textContent = new Date().getFullYear();

  /* ------------------------------- hairstyle menu ------------------------------- */
  var menuGrid = $('#menu-grid');
  var cards = [];   // keeps pieces we need to re-label when the language changes
  C.categories.forEach(function (cat) {
    var list = el('ul', { 'class': 'service-list' });
    cat.services.forEach(function (name) {
      var b = el('button', { type: 'button', 'class': 'service', 'aria-pressed': 'false', text: name });
      b.dataset.style = name; b.dataset.cat = cat.id;
      b.addEventListener('click', function () {
        if (state.style === name) setState({ style: '', styleCat: '' });
        else setState({ style: name, styleCat: cat.id });
      });
      list.appendChild(el('li', {}, [b]));
    });

    var hint = el('p', { 'class': 'err', role: 'status' });
    var viewBtn = el('button', { type: 'button', 'class': 'link-btn' });
    viewBtn.addEventListener('click', function () { filterGallery(cat.id); location.hash = '#gallery'; });
    var bookBtn = el('button', { type: 'button', 'class': 'link-btn' });
    bookBtn.addEventListener('click', function () {
      if (state.styleCat === cat.id) { hint.textContent = ''; goToBooking(); }
      else hint.textContent = t('menu.hint', { cat: catTitle(cat).toLowerCase() });
    });

    var img = makeImg(cat.photo, '');
    var pill = el('span', { 'class': 'cat-pill' });
    var card = el('article', { 'class': 'menu-card', id: 'cat-' + cat.id }, [
      el('div', { 'class': 'menu-photo' }, [img]),
      el('div', { 'class': 'menu-body' }, [pill, list, el('div', { 'class': 'menu-actions' }, [viewBtn, bookBtn]), hint])
    ]);
    menuGrid.appendChild(card);
    cards.push({ cat: cat, card: card, img: img, pill: pill, view: viewBtn, book: bookBtn });
  });

  /* ------------------------- length and size selectors ------------------------- */
  var chipLabels = [];
  function buildChips(container, group, values, key, prefix) {
    values.forEach(function (v) {
      var input = el('input', { type: 'radio', name: group, value: v });
      input.addEventListener('change', function () { var o = {}; o[key] = v; setState(o); });
      var span = el('span');
      container.appendChild(el('label', { 'class': 'chip' }, [input, span]));
      chipLabels.push({ span: span, prefix: prefix, value: v });
    });
  }
  buildChips($('#length-options'), 'length', C.lengths, 'length', 'len.');
  buildChips($('#size-options'), 'size', C.sizes, 'size', 'size.');

  /* ------------------------------ booking form selects ------------------------------ */
  var fName = $('#f-name'), fStyle = $('#f-style'), fLength = $('#f-length'), fSize = $('#f-size'), fTime = $('#f-time'), fDate = $('#f-date');

  function buildSelects() {
    fStyle.innerHTML = '';
    fStyle.appendChild(el('option', { value: '', text: t('form.chooseStyle') }));
    C.categories.forEach(function (cat) {
      var g = el('optgroup', { label: cat.letter + '. ' + catTitle(cat) });
      cat.services.forEach(function (s) { var o = el('option', { value: s, text: s }); o.dataset.cat = cat.id; g.appendChild(o); });
      fStyle.appendChild(g);
    });
    fLength.innerHTML = ''; fLength.appendChild(el('option', { value: '', text: t('form.chooseLength') }));
    C.lengths.forEach(function (v) { fLength.appendChild(el('option', { value: v, text: lab('len.', v) })); });
    fSize.innerHTML = ''; fSize.appendChild(el('option', { value: '', text: t('form.chooseSize') }));
    C.sizes.forEach(function (v) { fSize.appendChild(el('option', { value: v, text: lab('size.', v) })); });
    fTime.options[0].textContent = t('form.chooseTime');
  }

  fStyle.addEventListener('change', function () {
    var opt = fStyle.options[fStyle.selectedIndex];
    setState({ style: fStyle.value, styleCat: fStyle.value ? opt.dataset.cat : '' });
  });
  fLength.addEventListener('change', function () { setState({ length: fLength.value }); });
  fSize.addEventListener('change', function () { setState({ size: fSize.value }); });

  function fmtTime(h, m) {
    var ap = h >= 12 ? 'PM' : 'AM', hh = h % 12 || 12;
    return hh + ':' + (m < 10 ? '0' : '') + m + ' ' + ap;
  }
  (function buildTimes() {
    fTime.appendChild(el('option', { value: '', text: '' }));
    var b = C.booking, s = b.firstSlot.split(':'), e = b.lastSlot.split(':');
    var mins = (+s[0]) * 60 + (+s[1]), end = (+e[0]) * 60 + (+e[1]);
    for (; mins <= end; mins += b.slotMinutes) {
      var label = fmtTime(Math.floor(mins / 60), mins % 60);
      fTime.appendChild(el('option', { value: label, text: label }));
    }
  })();

  function todayISO() {
    var d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }
  fDate.min = todayISO();

  /* ------------------------------- state -> UI ------------------------------- */
  function setState(patch) {
    Object.keys(patch).forEach(function (k) { state[k] = patch[k]; });
    render();
  }

  function render() {
    $$('.service').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.style === state.style)); });
    $$('.menu-actions + .err').forEach(function (h) { h.textContent = ''; });
    $$('input[name="length"]').forEach(function (r) { r.checked = r.value === state.length; });
    $$('input[name="size"]').forEach(function (r) { r.checked = r.value === state.size; });
    fStyle.value = state.style; fLength.value = state.length; fSize.value = state.size;

    var lenText = state.length ? lab('len.', state.length) : '';
    var sizeText = state.size ? lab('size.', state.size) : '';
    [['bc-style', state.style], ['bc-length', lenText], ['bc-size', sizeText]].forEach(function (p) {
      var n = $('#' + p[0]); n.textContent = p[1] || t('choice.none'); n.classList.toggle('unset', !p[1]);
    });

    var parts = [state.style, lenText, sizeText].filter(Boolean);
    $('#selection-summary').textContent = parts.length ? t('sel.summary', { items: parts.join(' · ') }) : '';
    var bar = $('#selection-bar');
    var show = parts.length > 0 && !bookingVisible;
    bar.hidden = !show;
    document.body.classList.toggle('has-selection', show);
    var selText = $('#sel-text'); selText.innerHTML = '';
    selText.appendChild(document.createTextNode(parts.join(' · ')));
    var missing = [];
    if (!state.style) missing.push(t('word.hairstyle')); if (!state.length) missing.push(t('word.length')); if (!state.size) missing.push(t('word.size'));
    if (missing.length && parts.length) selText.appendChild(el('small', { text: t('sel.still', { list: missing.join(', ') }) }));
  }

  function goToBooking() {
    $('#booking').scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(function () {
      var first = [fName, fStyle, fLength, fSize, fDate, fTime].filter(function (f) { return !f.value; })[0];
      if (first) first.focus({ preventScroll: true });
    }, 600);
  }

  $('#sel-book').addEventListener('click', function (e) { e.preventDefault(); goToBooking(); });
  $('#sel-clear').addEventListener('click', function () { setState({ style: '', styleCat: '', length: '', size: '' }); });

  /* ------------------------------ WhatsApp messages ------------------------------ */
  function toast(node, kind) {
    var tt = $('#toast');
    if (!tt) { tt = el('div', { id: 'toast', 'class': 'toast', role: 'status', 'aria-live': 'polite' }); document.body.appendChild(tt); }
    tt.className = 'toast ' + kind;
    tt.innerHTML = ''; tt.appendChild(node); tt.hidden = false;
    clearTimeout(tt._h); tt._h = setTimeout(function () { tt.hidden = true; }, 14000);
  }
  function statusBox(msg, url, kind) {
    var b = el('div', { 'class': 'box ' + kind });
    b.appendChild(document.createTextNode(msg));
    if (url) {
      b.appendChild(document.createTextNode(t('wa.nothing')));
      b.appendChild(el('a', { href: url, target: '_blank', rel: 'noopener noreferrer', text: t('wa.tap') }));
      b.appendChild(document.createTextNode('.'));
    }
    return b;
  }
  function openWa(url) {
    var a = el('a', { href: url, target: '_blank', rel: 'noopener noreferrer' });
    a.style.display = 'none'; document.body.appendChild(a); a.click(); a.remove();
  }

  function priceMessage() {
    return [
      t('msg.priceHello', { salon: C.name }),
      '',
      '*' + t('msg.hairstyle') + ':* ' + (state.style || t('msg.notSelected')),
      '*' + t('msg.length') + ':* ' + (state.length ? lab('len.', state.length) : t('msg.notSelected')),
      '*' + t('msg.size') + ':* ' + (state.size ? lab('size.', state.size) : t('msg.notSelected')),
      '',
      t('msg.priceBye')
    ].join('\n');
  }
  $('#price-btn').addEventListener('click', priceEnquiry);
  $('#sel-price').addEventListener('click', priceEnquiry);
  function priceEnquiry() {
    if (!waReady()) { toast(statusBox(t('wa.notReady'), null, 'warn'), 'warn'); return; }
    var url = waUrl(priceMessage());
    openWa(url);
    toast(statusBox(t('wa.priceOpen'), url, 'ok'), 'ok');
  }

  /* ------------------------------ booking form ------------------------------ */
  var form = $('#booking-form');
  function err(id, msg, field) {
    $('#e-' + id).textContent = msg || '';
    if (field) { if (msg) field.setAttribute('aria-invalid', 'true'); else field.removeAttribute('aria-invalid'); }
    return !msg;
  }
  function parseISO(s) { var p = s.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function validate() {
    var ok = true, firstBad = null;
    function check(pass, id, msg, field) { var r = err(id, pass ? '' : msg, field); if (!r && !firstBad) firstBad = field; ok = ok && r; }
    check(fName.value.trim().length >= 2, 'name', t('err.name'), fName);
    check(!!fStyle.value, 'style', t('err.style'), fStyle);
    check(!!fLength.value, 'length', t('err.length'), fLength);
    check(!!fSize.value, 'size', t('err.size'), fSize);
    var dateOk = !!fDate.value && parseISO(fDate.value) >= parseISO(todayISO());
    check(dateOk, 'date', fDate.value ? t('err.datePast') : t('err.dateMissing'), fDate);
    check(!!fTime.value, 'time', t('err.time'), fTime);
    if (firstBad) firstBad.focus();
    return ok;
  }
  $$('input, select, textarea', form).forEach(function (f) {
    f.addEventListener('input', function () { if (f.getAttribute('aria-invalid')) { f.removeAttribute('aria-invalid'); var e = $('#e-' + f.name); if (e) e.textContent = ''; } });
  });

  function bookingMessage() {
    var d = parseISO(fDate.value).toLocaleDateString(LANG === 'sw' ? 'sw-TZ' : 'en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    var notes = $('#f-notes').value.trim();
    var lines = [
      t('msg.bookHello', { salon: C.name }),
      '',
      '*' + t('msg.name') + ':* ' + fName.value.trim(),
      '*' + t('msg.hairstyle') + ':* ' + fStyle.value,
      '*' + t('msg.length') + ':* ' + lab('len.', fLength.value),
      '*' + t('msg.size') + ':* ' + lab('size.', fSize.value),
      '*' + t('msg.date') + ':* ' + d,
      '*' + t('msg.time') + ':* ' + fTime.value
    ];
    if (notes) lines.push('*' + t('msg.notes') + ':* ' + notes);
    lines.push('', t('msg.bookBye'));
    return lines.join('\n');
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var status = $('#form-status'); status.innerHTML = '';
    if (!validate()) { status.appendChild(statusBox(t('err.fix'), null, 'warn')); return; }
    if (!waReady()) { status.appendChild(statusBox(t('wa.notReady'), null, 'warn')); return; }
    var url = waUrl(bookingMessage());
    openWa(url);
    status.appendChild(statusBox(t('wa.bookOpen'), url, 'ok'));
  });

  /* ------------------------------ gallery ------------------------------ */
  var track = $('#car-track'), dots = $('#car-dots');
  var visible = [];   // gallery items currently shown (used by the lightbox)
  var filterBar = $('#gallery-filters');

  function buildFilters() {
    filterBar.innerHTML = '';
    function add(id, label) {
      var b = el('button', { type: 'button', 'class': 'filter', 'aria-pressed': String(id === galleryFilter), text: label });
      b.dataset.filter = id; b.addEventListener('click', function () { filterGallery(id); });
      filterBar.appendChild(b);
    }
    add('all', t('gallery.all'));
    C.categories.forEach(function (c) { add(c.id, catTitle(c)); });
  }
  function filterGallery(id) {
    galleryFilter = id;
    $$('.filter', filterBar).forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.filter === id)); });
    renderGallery();
  }
  function renderGallery() {
    visible = C.gallery.filter(function (g) { return galleryFilter === 'all' || g.category === galleryFilter; });
    track.innerHTML = '';
    if (!visible.length) track.appendChild(el('li', { 'class': 'gallery-empty', text: t('gallery.empty') }));
    visible.forEach(function (g, i) {
      var alt = galleryAlt(g);
      var btn = el('button', { type: 'button', 'class': 'g-item', 'aria-label': t('gallery.viewLarger', { alt: alt }) }, [makeImg(g.src, alt)]);
      btn.addEventListener('click', function () { openLightbox(i, btn); });
      track.appendChild(el('li', {}, [btn]));
    });
    track.scrollLeft = 0; buildDots();
  }
  function pages() { return Math.max(1, Math.ceil((track.scrollWidth - 4) / track.clientWidth)); }
  function buildDots() {
    dots.innerHTML = '';
    var n = pages(); if (n < 2) return;
    for (var i = 0; i < n; i++) (function (i) {
      var d = el('button', { type: 'button', tabindex: '-1' });
      d.addEventListener('click', function () { track.scrollTo({ left: i * track.clientWidth, behavior: 'smooth' }); });
      dots.appendChild(d);
    })(i);
    updateDots();
  }
  function updateDots() {
    var n = dots.children.length; if (!n) return;
    var idx = Math.round(track.scrollLeft / track.clientWidth);
    if (track.scrollLeft + track.clientWidth >= track.scrollWidth - 4) idx = n - 1;
    Array.prototype.forEach.call(dots.children, function (d, i) { d.classList.toggle('on', i === idx); });
  }
  track.addEventListener('scroll', function () { window.requestAnimationFrame(updateDots); }, { passive: true });
  window.addEventListener('resize', buildDots);
  $('#car-prev').addEventListener('click', function () { track.scrollBy({ left: -track.clientWidth * 0.9, behavior: 'smooth' }); });
  $('#car-next').addEventListener('click', function () { track.scrollBy({ left: track.clientWidth * 0.9, behavior: 'smooth' }); });

  /* ------------------------------ lightbox ------------------------------ */
  var lb = $('#lightbox'), lbImg = $('#lb-img'), lbCap = $('#lb-cap'), lbIndex = 0, lbOpener = null;
  lbImg.addEventListener('error', function () { if (!lbImg.dataset.fb) { lbImg.dataset.fb = '1'; lbImg.src = FALLBACK; } });
  function showLb(i) {
    if (!visible.length) return;
    lbIndex = (i + visible.length) % visible.length;
    var g = visible[lbIndex], alt = galleryAlt(g);
    delete lbImg.dataset.fb; lbImg.src = g.src; lbImg.alt = alt;
    var cat = C.categories.filter(function (c) { return c.id === g.category; })[0];
    lbCap.innerHTML = ''; lbCap.appendChild(document.createTextNode(alt));
    lbCap.appendChild(el('small', { text: (cat ? catTitle(cat) + ' · ' : '') + (lbIndex + 1) + ' / ' + visible.length }));
  }
  function openLightbox(i, opener) {
    lbOpener = opener; showLb(i); lb.hidden = false; document.body.classList.add('lb-open'); $('#lb-close').focus();
  }
  function closeLightbox() {
    lb.hidden = true; document.body.classList.remove('lb-open'); if (lbOpener) lbOpener.focus();
  }
  $('#lb-close').addEventListener('click', closeLightbox);
  $('#lb-prev').addEventListener('click', function () { showLb(lbIndex - 1); });
  $('#lb-next').addEventListener('click', function () { showLb(lbIndex + 1); });
  lb.addEventListener('click', function (e) { if (e.target === lb) closeLightbox(); });
  document.addEventListener('keydown', function (e) {
    if (lb.hidden) return;
    if (e.key === 'Escape') closeLightbox();
    else if (e.key === 'ArrowLeft') showLb(lbIndex - 1);
    else if (e.key === 'ArrowRight') showLb(lbIndex + 1);
    else if (e.key === 'Tab') {                       // keep keyboard focus inside the viewer
      var f = $$('button', lb), first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  var tx = null;
  lb.addEventListener('touchstart', function (e) { tx = e.changedTouches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', function (e) {
    if (tx === null) return; var dx = e.changedTouches[0].clientX - tx; tx = null;
    if (Math.abs(dx) > 50) showLb(lbIndex + (dx < 0 ? 1 : -1));
  }, { passive: true });

  /* ------------------------------ footer contact details ------------------------------ */
  var ICONS = {
    instagram: ['M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4Z', 'M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z', 'M17.5 6.5h.01'],
    facebook: ['M14 8h2.5V4.5H14C11.8 4.5 10.5 6 10.5 8.2V10H8v3.5h2.5V20H14v-6.5h2.4l.6-3.5H14V8.5c0-.3.2-.5.5-.5Z'],
    tiktok: ['M15 3v10.5a3.5 3.5 0 1 1-3.5-3.5', 'M15 3c.3 2.4 1.9 4 4.5 4.2'],
    youtube: ['M3 8a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3Z', 'M10 9l5 3-5 3Z']
  };
  var SOCIAL_NAMES = { instagram: 'Instagram', facebook: 'Facebook', tiktok: 'TikTok', youtube: 'YouTube' };
  var ct = C.contact || {};
  ct.hours = ct.hours || [];
  var telHref = 'tel:' + String(ct.phone || '').replace(/[^\d+]/g, '');

  function socialRow() {
    var row = el('div', { 'class': 'social' }), any = false;
    Object.keys(SOCIAL_NAMES).forEach(function (k) {
      var url = ct.social && ct.social[k]; if (!url) return; any = true;
      row.appendChild(el('a', { href: url, target: '_blank', rel: 'noopener noreferrer', 'aria-label': t('social.on', { brand: C.shortName, net: SOCIAL_NAMES[k] }) }, [svgIcon(ICONS[k], '')]));
    });
    return any ? row : null;
  }
  function buildFooter() {
    var fs = $('#footer-social'); fs.innerHTML = '';
    var row = socialRow(); if (row) fs.appendChild(row);
    var fl = $('#footer-contact-list'); fl.innerHTML = '';
    function li(node) { fl.appendChild(el('li', {}, [node])); }
    if (!isPlaceholder(ct.phone)) li(el('a', { href: telHref, text: ct.phone }));
    if (waReady()) li(el('a', { href: waUrl(t('msg.chatHello', { salon: C.name })), target: '_blank', rel: 'noopener noreferrer', text: t('footer.whatsapp') }));
    if (ct.email) li(el('a', { href: 'mailto:' + ct.email, text: ct.email }));
    var loc = (LANG === 'sw' && ct.locationLinesSw) ? ct.locationLinesSw : (ct.locationLines || []);
    if (loc.length) li(document.createTextNode(loc.join(', ')));
    if (ct.hours[0]) li(document.createTextNode(cfg(ct.hours[0], 'day') + ': ' + cfg(ct.hours[0], 'time')));
  }

  /* ------------------------------ apply a language to the whole page ------------------------------ */
  function applyLang(lang) {
    LANG = lang;
    document.documentElement.lang = lang;
    try { localStorage.setItem('salon-lang', lang); } catch (e) { /* ignore */ }

    // static texts in index.html
    $$('[data-i18n]').forEach(function (n) { n.textContent = t(n.getAttribute('data-i18n')); });
    $$('[data-i18n-html]').forEach(function (n) { n.innerHTML = t(n.getAttribute('data-i18n-html')); });   // trusted strings from translations.js
    $$('[data-i18n-attr]').forEach(function (n) {
      n.getAttribute('data-i18n-attr').split(';').forEach(function (pair) {
        var p = pair.split(':'); if (p.length === 2) n.setAttribute(p[0].trim(), t(p[1].trim()));
      });
    });
    $$('[data-cfg-text]').forEach(function (n) { n.textContent = cfg(C, n.getAttribute('data-cfg-text')); });
    document.title = C.name + ' | ' + t('page.title');
    var md = $('meta[name="description"]'); if (md) md.setAttribute('content', t('page.desc'));
    $('#brand-link').setAttribute('aria-label', t('brand.aria', { name: C.name }));
    $$('.lang-switch button').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.lang === lang)); });
    syncNavLabel();

    // menu cards
    cards.forEach(function (c) {
      var title = catTitle(c.cat);
      c.pill.textContent = c.cat.letter + '. ' + title;
      c.card.setAttribute('aria-label', title);
      c.img.alt = t('menu.photoAlt', { cat: title });
      c.view.textContent = t('menu.viewStyles'); c.book.textContent = t('menu.bookStyle');
    });
    chipLabels.forEach(function (c) { c.span.textContent = lab(c.prefix, c.value); });
    buildSelects();
    buildFilters();
    renderGallery();
    buildFooter();

    // clear messages written in the previous language
    $$('.err').forEach(function (e) { e.textContent = ''; });
    $$('[aria-invalid]').forEach(function (f) { f.removeAttribute('aria-invalid'); });
    $('#form-status').innerHTML = '';
    var tt = $('#toast'); if (tt) tt.hidden = true;

    if (!lb.hidden) showLb(lbIndex);
    render();
  }
  $$('.lang-switch button').forEach(function (b) { b.addEventListener('click', function () { if (b.dataset.lang !== LANG) applyLang(b.dataset.lang); }); });

  /* ------------------------------ navigation behaviour ------------------------------ */
  var header = $('.site-header'), nav = $('#main-nav'), toggle = $('#nav-toggle'), toTop = $('#to-top');
  function syncNavLabel() { toggle.setAttribute('aria-label', nav.classList.contains('open') ? t('menu.close') : t('menu.open')); }
  function closeNav() { nav.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); syncNavLabel(); }
  toggle.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open)); syncNavLabel();
  });
  $$('a', nav).forEach(function (a) { a.addEventListener('click', closeNav); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && nav.classList.contains('open')) { closeNav(); toggle.focus(); } });
  document.addEventListener('click', function (e) { if (nav.classList.contains('open') && !header.contains(e.target)) closeNav(); });
  window.addEventListener('resize', function () { if (window.innerWidth > 920) closeNav(); });

  function onScroll() {
    header.classList.toggle('scrolled', window.scrollY > 10);
    toTop.hidden = window.scrollY < 600;
  }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  toTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });

  // highlight the current section in the menu; hide the sticky bar while the form is on screen
  if ('IntersectionObserver' in window) {
    var links = {}; $$('.nav-link').forEach(function (a) { links[a.getAttribute('href').slice(1)] = a; });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        Object.keys(links).forEach(function (k) { links[k].classList.toggle('active', k === en.target.id); });
      });
    }, { rootMargin: '-35% 0px -60% 0px' });
    Object.keys(links).forEach(function (id) { var s = document.getElementById(id); if (s) io.observe(s); });

    new IntersectionObserver(function (entries) {
      bookingVisible = entries[0].isIntersecting; render();
    }, { threshold: 0.25 }).observe($('#booking'));
  }

  /* ------------------------------ go ------------------------------ */
  applyLang(detectLang());
})();
