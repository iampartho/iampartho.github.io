/* =====================================================================
   HOBBY PHOTOS: add your own pictures here.
   ---------------------------------------------------------------------
   1. Copy the image into   assets/img/hobbies/
      (JPG around 1600 px wide is plenty; keep each file under ~500 KB)
   2. Add one line to the list below, for example:
        { src: 'assets/img/hobbies/grand-canyon.jpg', caption: 'Grand Canyon, AZ', category: 'travel' },
      category is one of:  'travel', 'hiking', 'sports', 'music', 'other'
   3. Save, refresh hobbies.html, and the gallery appears by itself.
      (While the list is empty, the gallery section stays hidden.)
   ===================================================================== */

var PHOTOS = [
  // { src: 'assets/img/hobbies/example.jpg', caption: 'Where / what', category: 'travel' },
];

/* ===================================================================== *
 *  Gallery + lightbox: no need to edit below this line.                 *
 * ===================================================================== */
(function () {
  'use strict';
  var NAMES = { travel: 'Travel', hiking: 'Hiking', sports: 'Sports', music: 'Music & more', other: 'Other' };

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  window.renderGallery = function (section) {
    if (!section) return;
    var list = (typeof PHOTOS !== 'undefined' && PHOTOS) ? PHOTOS.filter(function (p) { return p && p.src; }) : [];
    if (!list.length) { section.hidden = true; return; }
    section.hidden = false;

    var grid = section.querySelector('.gallery'), bar = section.querySelector('.filters');
    var cats = [];
    list.forEach(function (p) { var c = p.category || 'other'; if (cats.indexOf(c) < 0) cats.push(c); });
    var current = 'all', shown = list;

    if (bar && cats.length > 1) {
      bar.innerHTML = '<button class="chip-btn" type="button" data-cat="all" aria-pressed="true">All</button>' +
        cats.map(function (c) { return '<button class="chip-btn" type="button" data-cat="' + esc(c) + '" aria-pressed="false">' + esc(NAMES[c] || c) + '</button>'; }).join('');
      bar.addEventListener('click', function (e) {
        var b = e.target.closest ? e.target.closest('[data-cat]') : null;
        if (!b) return;
        current = b.getAttribute('data-cat');
        Array.prototype.forEach.call(bar.querySelectorAll('[data-cat]'), function (x) {
          x.setAttribute('aria-pressed', x === b ? 'true' : 'false');
          x.style.background = x === b ? 'var(--text)' : ''; x.style.color = x === b ? 'var(--bg)' : '';
        });
        draw();
      });
      var first = bar.querySelector('[data-cat="all"]'); first.style.background = 'var(--text)'; first.style.color = 'var(--bg)';
    } else if (bar) { bar.hidden = true; }

    function draw() {
      shown = list.filter(function (p) { return current === 'all' || (p.category || 'other') === current; });
      grid.innerHTML = shown.map(function (p, i) {
        return '<button class="ph-item" type="button" data-i="' + i + '" aria-label="Open photo: ' + esc(p.caption || 'photo') + '">' +
          '<img src="' + esc(p.src) + '" alt="' + esc(p.caption || '') + '" loading="lazy" decoding="async">' +
          (p.caption ? '<span class="cap">' + esc(p.caption) + '</span>' : '') + '</button>';
      }).join('');
    }
    draw();

    /* lightbox */
    var box = document.createElement('div');
    box.className = 'lightbox'; box.hidden = true;
    box.setAttribute('role', 'dialog'); box.setAttribute('aria-modal', 'true'); box.setAttribute('aria-label', 'Photo viewer');
    box.innerHTML = '<button class="close" type="button" aria-label="Close">×</button>' +
      '<button class="prev" type="button" aria-label="Previous photo">‹</button>' +
      '<figure><img alt=""><figcaption></figcaption></figure>' +
      '<button class="next" type="button" aria-label="Next photo">›</button>';
    document.body.appendChild(box);
    var img = box.querySelector('img'), cap = box.querySelector('figcaption'), idx = 0, opener = null, x0 = null;

    function show(i) {
      idx = (i + shown.length) % shown.length;
      var p = shown[idx];
      img.src = p.src; img.alt = p.caption || ''; cap.textContent = p.caption || '';
    }
    function open(i, from) { opener = from; show(i); box.hidden = false; document.body.style.overflow = 'hidden'; box.querySelector('.close').focus(); }
    function close() { box.hidden = true; document.body.style.overflow = ''; if (opener) opener.focus(); }

    grid.addEventListener('click', function (e) {
      var b = e.target.closest ? e.target.closest('.ph-item') : null;
      if (b) open(+b.getAttribute('data-i'), b);
    });
    box.addEventListener('click', function (e) {
      if (e.target.classList.contains('close') || e.target === box) close();
      else if (e.target.classList.contains('prev')) show(idx - 1);
      else if (e.target.classList.contains('next')) show(idx + 1);
    });
    document.addEventListener('keydown', function (e) {
      if (box.hidden) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') show(idx - 1);
      else if (e.key === 'ArrowRight') show(idx + 1);
    });
    box.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    box.addEventListener('touchend', function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0; x0 = null;
      if (Math.abs(dx) > 50) show(idx + (dx < 0 ? 1 : -1));
    }, { passive: true });
  };
})();
