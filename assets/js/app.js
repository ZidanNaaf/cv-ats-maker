window.CVApp = window.CVApp || {};
(function () {
  var LS_KEY = 'cvatsMaker.v1';

  // Pemetaan id form -> kunci data. Satu-satunya sumber kebenaran ada di
  // preview.js:collectData() yang memakai kunci `fullname` (bukan `name`).
  var FIELD_MAP = [
    { id: 'fullname', key: 'fullname', legacyKeys: ['name'] },
    { id: 'nim', key: 'nim', legacyKeys: [] },
    { id: 'email', key: 'email', legacyKeys: [] },
    { id: 'phone', key: 'phone', legacyKeys: [] },
    { id: 'address', key: 'address', legacyKeys: [] },
    { id: 'about', key: 'about', legacyKeys: [] },
    { id: 'strengths', key: 'strengths', legacyKeys: [] },
    { id: 'weaknesses', key: 'weaknesses', legacyKeys: [] }
  ];

  var EDU_MAP = [
    { name: 'eduschool', key: 'school' },
    { name: 'edumajor', key: 'major' },
    { name: 'eduyearStart', key: 'yearStart' },
    { name: 'eduyearEnd', key: 'yearEnd' }
  ];

  var EXP_MAP = [
    { name: 'expname', key: 'name' },
    { name: 'exprole', key: 'role' },
    { name: 'expperiod', key: 'period' },
    { name: 'expdesc', key: 'desc' }
  ];

  CVApp.currentFont = 'times';
  CVApp.theme = 'light';

  CVApp.escapeHtml = function (t) {
    return String(t == null ? '' : t).replace(/[&<>"']/g, function (c) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      }[c];
    });
  };

  CVApp.sanitize = function (t) {
    if (t == null) return '';
    var s = String(t).normalize('NFKD');
    s = s.replace(/[\u{1F000}-\u{1FAFF}\u{1F600}-\u{1F64F}\u{2600}-\u{27BF}\u{FE0F}]/gu, '');
    s = s.replace(/[^\x20-\x7E\u00A0-\u00FF\u0152\u0153\u2013\u2014\u2018\u2019\u201C\u201D\u2022\u2026\n]/g, '');
    return s.trim();
  };

  CVApp.toast = function (msg, type) {
    Swal.fire({
      toast: true,
      position: 'bottom-end',
      icon: type === 'error' ? 'error' : 'success',
      title: msg,
      showConfirmButton: false,
      timer: 2800,
      timerProgressBar: true,
      customClass: {
        popup: 'swal2-toast-cvats'
      }
    });
  };

  CVApp.applyTheme = function (theme) {
    CVApp.theme = theme || 'light';
    var root = document.documentElement;
    if (CVApp.theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
    } else {
      root.removeAttribute('data-theme');
    }
    var btn = document.getElementById('themeToggle');
    if (btn) {
      var sun = btn.querySelector('.sun-icon');
      var moon = btn.querySelector('.moon-icon');
      if (sun && moon) {
        if (CVApp.theme === 'dark') {
          sun.classList.remove('hidden');
          moon.classList.add('hidden');
        } else {
          sun.classList.add('hidden');
          moon.classList.remove('hidden');
        }
      }
    }
    // Sync theme-color meta tag
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute('content', CVApp.theme === 'dark' ? '#0f172a' : '#0ea5e9');
    }
  };

  function setErr(el, bad) {
    if (!el) return;
    el.classList.toggle('error', bad);
    var msg = el.parentElement ? el.parentElement.querySelector('[data-msg]') : null;
    if (msg) msg.classList.toggle('hidden', !bad);
  }

  function isValidEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }

  CVApp.validate = function () {
    var ok = true;
    var firstBad = null;

    var nameEl = document.getElementById('fullname');
    var emailEl = document.getElementById('email');

    var nameBad = nameEl ? nameEl.value.trim() === '' : true;
    var emailBad = emailEl ? !isValidEmail(emailEl.value.trim()) : true;

    if (nameEl) setErr(nameEl, nameBad);
    if (emailEl) setErr(emailEl, emailBad);

    if (nameBad) {
      ok = false;
      firstBad = nameEl;
    }
    if (emailBad) {
      ok = false;
      if (!firstBad) firstBad = emailEl;
    }

    document.querySelectorAll('.edu-item').forEach(function (row) {
      var ys = row.querySelector('[name="eduyearStart"]');
      var ye = row.querySelector('[name="eduyearEnd"]');
      if (!ys || !ye) return;
      var s = (ys.value || '').trim();
      var e = (ye.value || '').trim();
      var bad = s !== '' && e !== '' && parseInt(e, 10) < parseInt(s, 10);
      setErr(ys, bad);
      setErr(ye, bad);
      if (bad) {
        ok = false;
        if (!firstBad) firstBad = ye;
      }
    });

    if (firstBad) {
      var msg = nameBad || emailBad
        ? 'Lengkapi Nama Lengkap dan Email yang valid.'
        : 'Tahun Lulus tidak boleh lebih awal dari Tahun Masuk.';
      firstBad.focus();
      firstBad.scrollIntoView({ behavior: 'smooth', block: 'center' });
      window.CVApp.toast(msg, 'error');
    }

    return ok;
  };

  function setPhoto(dataUrl) {
    var dataEl = document.getElementById('photoData');
    var img = document.getElementById('photoThumb');
    var ph = document.getElementById('photoPlaceholder');
    var btn = document.getElementById('btnRemovePhoto');

    if (dataEl) dataEl.value = dataUrl || '';
    if (img) {
      if (dataUrl) {
        img.src = dataUrl;
        img.classList.remove('hidden');
      } else {
        img.src = '';
        img.classList.add('hidden');
      }
    }
    if (ph) ph.classList.toggle('hidden', !!dataUrl);
    if (btn) btn.classList.toggle('hidden', !dataUrl);
  }

  function handlePhoto(file) {
    if (!file) return;
    if (!/^image\//.test(file.type)) {
      window.CVApp.toast('File harus berupa gambar.', 'error');
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      window.CVApp.toast('Ukuran foto maksimal 8 MB.', 'error');
      return;
    }

    var reader = new FileReader();
    reader.onload = function (ev) {
      var img = new Image();
      img.onload = function () {
        var size = Math.min(img.width, img.height);
        var sx = Math.round((img.width - size) / 2);
        var sy = Math.round((img.height - size) / 2);
        var MAX = 320;
        var out = Math.max(1, Math.min(MAX, size));
        var cv = document.createElement('canvas');
        cv.width = out;
        cv.height = out;
        cv.getContext('2d').drawImage(img, sx, sy, size, size, 0, 0, out, out);
        setPhoto(cv.toDataURL('image/jpeg', 0.82));
        window.CVApp.renderPreview();
        save();
      };
      img.onerror = function () {
        window.CVApp.toast('Gagal membaca gambar.', 'error');
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  }

  function clearPhoto() {
    setPhoto('');
    window.CVApp.renderPreview();
    save();
  }

  function bindPhoto() {
    var input = document.getElementById('photo');
    var removeBtn = document.getElementById('btnRemovePhoto');

    if (input) {
      input.addEventListener('change', function () {
        var file = input.files && input.files[0];
        if (file) handlePhoto(file);
        input.value = '';
      });
    }
    if (removeBtn) {
      removeBtn.addEventListener('click', function () {
        input.value = '';
        clearPhoto();
      });
    }
  }

  // Undo/redo stack
  var UNDO_STACK = [];
  var REDO_STACK = [];
  var UNDO_MAX = 50;
  var UNDO_IGNORING = false;

  function pushSnapshot() {
    if (UNDO_IGNORING) return;
    if (typeof window.CVApp.collectData !== 'function') return;
    try {
      var data = window.CVApp.collectData();
      data.font = window.CVApp.currentFont || 'times';
      data.theme = window.CVApp.theme || 'light';
      var snapshot = JSON.stringify(data);
      // Tidak duplikasi snapshot berurutan yang sama
      if (UNDO_STACK.length > 0 && UNDO_STACK[UNDO_STACK.length - 1] === snapshot) {
        return;
      }
      UNDO_STACK.push(snapshot);
      if (UNDO_STACK.length > UNDO_MAX) UNDO_STACK.shift();
      REDO_STACK = [];
    } catch (e) {}
  }

  function applySnapshot(data) {
    UNDO_IGNORING = true;
    try {
      // Restore text fields
      FIELD_MAP.forEach(function (m) {
        var el = document.getElementById(m.id);
        if (el) el.value = pick(data, m.key, m.legacyKeys) || '';
      });

      var skillsEl = document.getElementById('skills');
      if (skillsEl) {
        if (Array.isArray(data.skills)) skillsEl.value = data.skills.join(', ');
        else if (typeof data.skills === 'string') skillsEl.value = data.skills;
        else skillsEl.value = '';
      }

      var photoVal = typeof data.photo === 'string' ? data.photo : '';
      if (photoVal && window.CVApp.isSafePhoto && !window.CVApp.isSafePhoto(photoVal)) {
        photoVal = '';
      }
      setPhoto(photoVal);

      if (data.font === 'arial' || data.font === 'times') {
        window.CVApp.currentFont = data.font;
        var fontSel = document.getElementById('fontSelect');
        if (fontSel) fontSel.value = data.font;
      }

      if (data.theme === 'dark' || data.theme === 'light') {
        window.CVApp.applyTheme(data.theme);
      }

      if (Array.isArray(data.education)) rebuildRows('eduContainer', '.edu-item', data.education, EDU_MAP);
      if (Array.isArray(data.experience)) rebuildRows('expContainer', '.exp-item', data.experience, EXP_MAP);

      if (window.CVApp.updateCounters) window.CVApp.updateCounters();
      window.CVApp.renderPreview();
      initCharCounters();
    } finally {
      UNDO_IGNORING = false;
    }
  }

  CVApp.undo = function () {
    if (UNDO_STACK.length === 0) return;
    var current = window.CVApp.collectData();
    current.font = window.CVApp.currentFont || 'times';
    current.theme = window.CVApp.theme || 'light';
    REDO_STACK.push(JSON.stringify(current));

    var prev = UNDO_STACK.pop();
    applySnapshot(JSON.parse(prev));
    save();
    window.CVApp.toast('Dibatalkan (Undo)');
  };

  CVApp.redo = function () {
    if (REDO_STACK.length === 0) return;
    var current = window.CVApp.collectData();
    current.font = window.CVApp.currentFont || 'times';
    current.theme = window.CVApp.theme || 'light';
    UNDO_STACK.push(JSON.stringify(current));

    var next = REDO_STACK.pop();
    applySnapshot(JSON.parse(next));
    save();
    window.CVApp.toast('Dikembalikan (Redo)');
  };

  function save() {
    if (typeof window.CVApp.collectData !== 'function') return;
    try {
      var data = window.CVApp.collectData();
      data.font = window.CVApp.currentFont || 'times';
      data.theme = window.CVApp.theme || 'light';
      data._v = 1;
      localStorage.setItem(LS_KEY, JSON.stringify(data));
    } catch (e) {
      // localStorage penuh (umumnya karena foto) atau tidak tersedia.
      if (e && (e.name === 'QuotaExceededError' || e.code === 22)) {
        window.CVApp.toast('Penyimpanan penuh: foto tidak ikut tersimpan otomatis.', 'error');
      }
    }
    pushSnapshot();
  }

  function pick(obj, key, legacyKeys) {
    if (obj == null || typeof obj !== 'object') return '';
    if (typeof obj[key] === 'string') return obj[key];
    if (Array.isArray(legacyKeys)) {
      for (var i = 0; i < legacyKeys.length; i++) {
        if (typeof obj[legacyKeys[i]] === 'string') return obj[legacyKeys[i]];
      }
    }
    return '';
  }

  function rebuildRows(containerId, rowSel, items, map) {
    var wrap = document.getElementById(containerId);
    if (!wrap) return;
    // Ambil template dari baris pertama yang masih ada SEBELUM dikosongkan.
    var tpl = wrap.querySelector(rowSel);
    if (!tpl) tpl = document.querySelector(rowSel);
    if (!tpl) return;

    wrap.innerHTML = '';
    var list = items && items.length ? items : [{}];

    list.forEach(function (it) {
      it = it || {};
      var row = tpl.cloneNode(true);
      row.querySelectorAll('input,textarea').forEach(function (i) {
        i.value = '';
      });
      map.forEach(function (m) {
        var f = row.querySelector('[name="' + m.name + '"]');
        if (f) f.value = it[m.key] == null ? '' : String(it[m.key]);
      });
      wrap.appendChild(row);
    });
  }

  function restore() {
    var d = null;
    try {
      var raw = localStorage.getItem(LS_KEY);
      if (!raw) return;
      d = JSON.parse(raw);
    } catch (e) {
      return;
    }
    if (!d || typeof d !== 'object') return;

    // Migrasi data lama: kunci `name` -> `fullname`.
    if (typeof d.fullname !== 'string' && typeof d.name === 'string') {
      d.fullname = d.name;
    }

    FIELD_MAP.forEach(function (m) {
      var el = document.getElementById(m.id);
      if (el) el.value = pick(d, m.key, m.legacyKeys);
    });

    var skillsEl = document.getElementById('skills');
    if (skillsEl) {
      if (Array.isArray(d.skills)) skillsEl.value = d.skills.join(', ');
      else if (typeof d.skills === 'string') skillsEl.value = d.skills;
      else skillsEl.value = '';
    }

    var photoVal = typeof d.photo === 'string' ? d.photo : '';
    if (photoVal && window.CVApp.isSafePhoto && !window.CVApp.isSafePhoto(photoVal)) {
      photoVal = '';
    }
    setPhoto(photoVal);

    // Font ikut tersimpan agar preview & PDF konsisten setelah reload.
    if (d.font === 'arial' || d.font === 'times') {
      window.CVApp.currentFont = d.font;
      var fontSelEarly = document.getElementById('fontSelect');
      if (fontSelEarly) fontSelEarly.value = d.font;
    }

    // Restore theme dari data tersimpan (jika belum ada di localStorage terpisah).
    if (d.theme === 'dark' || d.theme === 'light') {
      window.CVApp.applyTheme(d.theme);
      try {
        localStorage.setItem('cvatsTheme', d.theme);
      } catch (e) {}
    }

    if (Array.isArray(d.education)) rebuildRows('eduContainer', '.edu-item', d.education, EDU_MAP);
    if (Array.isArray(d.experience)) rebuildRows('expContainer', '.exp-item', d.experience, EXP_MAP);

    if (window.CVApp.updateCounters) window.CVApp.updateCounters();
    window.CVApp.renderPreview();
  }

  function clearForm() {
    Swal.fire({
      icon: 'question',
      title: 'Hapus semua data form?',
      text: 'Data yang tersimpan di browser akan dihapus permanen.',
      showCancelButton: true,
      confirmButtonText: 'Hapus',
      cancelButtonText: 'Batal',
      reverseButtons: true
    }).then(function (result) {
      if (!result.isConfirmed) return;

      FIELD_MAP.forEach(function (m) {
        var el = document.getElementById(m.id);
        if (el) {
          el.value = '';
          setErr(el, false);
        }
      });

      var skillsEl = document.getElementById('skills');
      if (skillsEl) skillsEl.value = '';

      var pic = document.getElementById('photo');
      if (pic) pic.value = '';

      setPhoto('');
      rebuildRows('eduContainer', '.edu-item', [], EDU_MAP);
      rebuildRows('expContainer', '.exp-item', [], EXP_MAP);

      if (window.CVApp.updateCounters) window.CVApp.updateCounters();

      try {
        localStorage.removeItem(LS_KEY);
      } catch (e) {}

      window.CVApp.renderPreview();
      window.CVApp.toast('Form telah dikosongkan.');
    });
  }

  function schedulePreview() {
    clearTimeout(schedulePreview._t);
    schedulePreview._t = setTimeout(function () {
      window.CVApp.renderPreview();
      save();
    }, 80);
  }

  function updateCharCounter(el) {
    var max = el.getAttribute('data-max-chars');
    if (!max) return;
    var maxInt = parseInt(max, 10);
    var len = el.value.length;
    var counterId = 'counter-' + el.id;
    var counter = document.getElementById(counterId);
    if (counter) {
      counter.textContent = len + ' / ' + maxInt;
      counter.classList.toggle('text-red-500', len > maxInt);
      counter.classList.toggle('text-slate-400', len <= maxInt);
    }
  }

  CVApp.bindCharCounter = function (el) {
    if (!el || !el.getAttribute('data-max-chars')) return;
    if (el.dataset.cvBound) return;
    el.dataset.cvBound = '1';
    updateCharCounter(el);
    el.addEventListener('input', function () {
      updateCharCounter(el);
    });
  };

  function initCharCounters() {
    document.querySelectorAll('textarea[data-max-chars]').forEach(function (el) {
      CVApp.bindCharCounter(el);
    });
  }

  function init() {
    if (window.AOS) {
      AOS.init({ duration: 650, once: true, offset: 40 });
    }

    var form = document.getElementById('cvForm');
    if (form) form.addEventListener('input', schedulePreview);

    var fontSel = document.getElementById('fontSelect');
    if (fontSel) {
      fontSel.value = window.CVApp.currentFont;
      fontSel.addEventListener('change', function () {
        window.CVApp.currentFont = fontSel.value;
        window.CVApp.renderPreview();
        save();
      });
    }

    // Inisialisasi dark mode
    var savedTheme = null;
    try {
      savedTheme = localStorage.getItem('cvatsTheme');
    } catch (e) {}
    if (savedTheme === 'dark' || savedTheme === 'light') {
      window.CVApp.applyTheme(savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      window.CVApp.applyTheme('dark');
    } else {
      window.CVApp.applyTheme('light');
    }

    var themeBtn = document.getElementById('themeToggle');
    if (themeBtn) {
      themeBtn.addEventListener('click', function () {
        var next = window.CVApp.theme === 'dark' ? 'light' : 'dark';
        window.CVApp.applyTheme(next);
        try {
          localStorage.setItem('cvatsTheme', next);
        } catch (e) {}
        window.CVApp.toast(next === 'dark' ? 'Mode gelap diaktifkan' : 'Mode terang diaktifkan');
      });
    }

    initCharCounters();

    document.querySelectorAll('.js-download').forEach(function (b) {
      b.addEventListener('click', function () {
        window.CVApp.buildPdf();
      });
    });

    ['fullname', 'email'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.addEventListener('input', function () { setErr(el, false); });
    });

    bindPhoto();

    var eduWrap = document.getElementById('eduContainer');
    if (eduWrap) {
      eduWrap.addEventListener('input', function (e) {
        if (e.target && e.target.matches('.edu-item [name^="eduyear"]')) setErr(e.target, false);
      });
    }

    // Integrasi tambah/hapus baris: dynamic.js memicu event ini.
    // Satu jalur render + simpan agar preview & localStorage selalu sinkron.
    document.addEventListener('cv:data-changed', function () {
      window.CVApp.renderPreview();
      save();
    });

    var clearBtn = document.getElementById('btnClear');
    if (clearBtn) clearBtn.addEventListener('click', clearForm);

    // Undo/Redo tombol UI
    var btnUndo = document.getElementById('btnUndo');
    if (btnUndo) btnUndo.addEventListener('click', function () { window.CVApp.undo(); });
    var btnRedo = document.getElementById('btnRedo');
    if (btnRedo) btnRedo.addEventListener('click', function () { window.CVApp.redo(); });

    // Keyboard shortcuts: Ctrl+Z / Cmd+Z undo, Ctrl+Y / Cmd+Shift+Z redo
    document.addEventListener('keydown', function (e) {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z' && !e.shiftKey) {
          e.preventDefault();
          window.CVApp.undo();
        }
        if ((e.key === 'y' && !e.shiftKey) || (e.key === 'z' && e.shiftKey)) {
          e.preventDefault();
          window.CVApp.redo();
        }
      }
    });

    var yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());

    restore();
    if (window.CVApp.updateCounters) window.CVApp.updateCounters();
    window.CVApp.renderPreview();
  }

  // Diekspos agar modul lain (dynamic.js fallback) bisa memicu simpan.
  window.CVApp.saveData = save;
  window.CVApp.schedulePreview = schedulePreview;

  document.addEventListener('DOMContentLoaded', init);
})();