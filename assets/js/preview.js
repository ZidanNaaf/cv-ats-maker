window.CVApp = window.CVApp || {};
(function () {
  function esc(t) {
    return window.CVApp.escapeHtml(t);
  }

  function val(id) {
    var el = document.getElementById(id);
    return el ? el.value.trim() : '';
  }

  function collectRows(sel, map) {
    return Array.prototype.slice.call(document.querySelectorAll(sel))
      .map(function (row) {
        var get = function (q) {
          var el = row.querySelector(q);
          return el ? (el.value || '').trim() : '';
        };
        return map(get);
      })
      .filter(function (r) {
        return Object.keys(r).some(function (k) {
          return String(r[k]).trim() !== '';
        });
      });
  }

  function isSafePhoto(s) {
    return typeof s === 'string' && /^data:image\/(png|jpeg|jpg|webp);base64,/.test(s);
  }

  function collectData() {
    var photoEl = document.getElementById('photoData');
    var photoVal = photoEl ? photoEl.value.trim() : '';
    return {
      fullname: val('fullname'),
      nim: val('nim'),
      email: val('email'),
      phone: val('phone'),
      address: val('address'),
      photo: isSafePhoto(photoVal) ? photoVal : '',
      about: val('about'),
      education: collectRows('.edu-item', function (get) {
        return {
          school: get('[name="eduschool"]'),
          major: get('[name="edumajor"]'),
          yearStart: get('[name="eduyearStart"]'),
          yearEnd: get('[name="eduyearEnd"]')
        };
      }),
      experience: collectRows('.exp-item', function (get) {
        return {
          name: get('[name="expname"]'),
          role: get('[name="exprole"]'),
          period: get('[name="expperiod"]'),
          desc: get('[name="expdesc"]')
        };
      }),
      skills: val('skills')
        .split(',')
        .map(function (s) { return s.trim(); })
        .filter(Boolean),
      strengths: val('strengths'),
      weaknesses: val('weaknesses')
    };
  }

  function yearRange(ed) {
    var parts = [ed.yearStart, ed.yearEnd].filter(Boolean);
    return parts.length ? parts.join(' - ') : '';
  }

  function sectionTitle(t) {
    return '<div class="p-head mt-3">' + t + '</div>';
  }

  function renderPreview() {
    var paper = document.getElementById('previewPaper');
    var body = document.getElementById('previewBody');
    if (!paper || !body) return;

    paper.classList.toggle('font-arial', window.CVApp.currentFont === 'arial');

    var d = collectData();
    // Kompatibilitas: data lama memakai kunci `name`.
    if (!d.fullname && d.name) d.fullname = String(d.name);
    var h = '';

    h += '<div class="mb-2">';
    if (d.photo) {
      h += '<img src="' + d.photo + '" class="p-photo rounded-full object-cover mb-1" alt="Foto profil">';
    }
    h += d.fullname
      ? '<h1 class="p-name">' + esc(d.fullname) + '</h1>'
      : '<h1 class="p-name" style="color:#cbd5e1">Nama Lengkap</h1>';

    var contact = [d.email, d.phone, d.address].filter(Boolean).map(esc).join(' &bull; ');
    h += contact
      ? '<div class="p-contact">' + contact + '</div>'
      : '<div class="p-contact" style="color:#cbd5e1">email &bull; telepon &bull; alamat</div>';
    h += '</div>';

    if (d.about) {
      h += '<p class="pv-text mb-2">' + esc(d.about) + '</p>';
    }

    if (d.education.length) {
      h += sectionTitle('Pendidikan');
      d.education.forEach(function (ed) {
        var sch = esc(ed.school);
        var maj = esc(ed.major);
        h += '<div class="mb-2">';
        h += '<div class="font-semibold">' + sch + (sch && maj ? ' &mdash; ' : '') + maj + '</div>';
        h += '<div class="p-muted">' + esc(yearRange(ed)) + '</div>';
        h += '</div>';
      });
    }

    if (d.experience.length) {
      h += sectionTitle('Pengalaman');
      d.experience.forEach(function (x) {
        var org = esc(x.name);
        var rol = esc(x.role);
        h += '<div class="mb-2">';
        h += '<div class="font-semibold">' + org + (org && rol ? ' &mdash; ' : '') + rol + '</div>';
        if (x.period) h += '<div class="p-muted">' + esc(x.period) + '</div>';
        if (x.desc) {
          String(x.desc)
            .split('\n')
            .map(function (s) { return s.trim(); })
            .filter(Boolean)
            .forEach(function (l) {
              h += '<p class="pv-text">-  ' + esc(l) + '</p>';
            });
        }
        h += '</div>';
      });
    }

    if (d.skills.length) {
      h += sectionTitle('Skill');
      h += '<p class="pv-text">' + d.skills.map(esc).join(', ') + '</p>';
    }

    if (d.strengths) {
      h += sectionTitle('Kelebihan');
      h += '<p class="pv-text mb-2">' + esc(d.strengths) + '</p>';
    }

    if (d.weaknesses) {
      h += sectionTitle('Kekurangan');
      h += '<p class="pv-text">' + esc(d.weaknesses) + '</p>';
    }

    body.innerHTML = h;
  }

  window.CVApp.collectData = collectData;
  window.CVApp.renderPreview = renderPreview;
  window.CVApp.isSafePhoto = isSafePhoto;
})();