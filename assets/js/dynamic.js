window.CVApp = window.CVApp || {};
(function () {
  var MAX_ITEMS = 6;

  function byId(id) {
    return document.getElementById(id);
  }

  function notifyChanged() {
    // Beri tahu app.js agar preview di-render ulang + localStorage disimpan.
    // Memakai CustomEvent bila tersedia, fallback ke panggilan langsung.
    try {
      document.dispatchEvent(new CustomEvent('cv:data-changed'));
    } catch (e) {
      if (window.CVApp && typeof window.CVApp.renderPreview === 'function') {
        window.CVApp.renderPreview();
      }
    }
  }

  function addItem(containerId, rowSel, addBtnId) {
    var wrap = byId(containerId);
    var row = document.querySelector(rowSel);
    if (!wrap || !row) return;

    if (wrap.children.length >= MAX_ITEMS) {
      window.CVApp.toast('Maksimal ' + MAX_ITEMS + ' baris.');
      return;
    }

    var clone = row.cloneNode(true);
    clone.querySelectorAll('input,textarea').forEach(function (i) {
      i.value = '';
      i.classList.remove('error');
    });
    clone.classList.remove('row-in');
    void clone.offsetWidth;
    clone.classList.add('row-in');
    wrap.appendChild(clone);

    updateCounter(containerId, rowSel);
    var btn = byId(addBtnId);
    if (btn) btn.disabled = wrap.children.length >= MAX_ITEMS;

    clone.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    notifyChanged();
  }

  function bindRemove(containerId, rowSel) {
    var wrap = byId(containerId);
    if (!wrap) return;

    wrap.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-remove]');
      if (!btn) return;

      var rows = wrap.querySelectorAll(rowSel);
      if (rows.length <= 1) {
        window.CVApp.toast('Minimal satu baris tersisa.');
        return;
      }

      btn.closest(rowSel).remove();
      updateCounter(containerId, rowSel);
      notifyChanged();
    });
  }

  function updateCounter(containerId, rowSel) {
    var wrap = byId(containerId);
    if (!wrap) return;

    var rows = wrap.querySelectorAll(rowSel);
    var label = rows.length + ' baris';

    // Counter memakai class (bukan id) agar aman saat baris di-clone.
    // Dukung format lama (id) + format baru (class).
    var counters = wrap.querySelectorAll('.edu-count, .exp-count');
    counters.forEach(function (c) { c.textContent = label; });
    var legacyId = containerId.replace('Container', 'Count');
    var legacy = document.getElementById(legacyId);
    if (legacy) legacy.textContent = label;

    wrap.querySelectorAll('[data-remove]').forEach(function (b) {
      b.disabled = rows.length <= 1;
    });

    var addMap = { eduContainer: 'btnAddEdu', expContainer: 'btnAddExp' };
    var btn = byId(addMap[containerId]);
    if (btn) btn.disabled = rows.length >= MAX_ITEMS;
  }

  window.CVApp.updateCounters = function () {
    updateCounter('eduContainer', '.edu-item');
    updateCounter('expContainer', '.exp-item');
  };

  function init() {
    var btnEdu = byId('btnAddEdu');
    var btnExp = byId('btnAddExp');

    if (btnEdu) {
      btnEdu.addEventListener('click', function () {
        addItem('eduContainer', '.edu-item', 'btnAddEdu');
      });
    }
    if (btnExp) {
      btnExp.addEventListener('click', function () {
        addItem('expContainer', '.exp-item', 'btnAddExp');
      });
    }

    bindRemove('eduContainer', '.edu-item');
    bindRemove('expContainer', '.exp-item');

    updateCounter('eduContainer', '.edu-item');
    updateCounter('expContainer', '.exp-item');
  }

  document.addEventListener('DOMContentLoaded', init);
})();