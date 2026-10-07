window.CVApp = window.CVApp || {};
(function () {
  function family() {
    if (
      window.CVApp.currentFont === 'arial' &&
      window.pdfMake &&
      window.pdfMake.fonts &&
      window.pdfMake.fonts.Helvetica
    ) {
      return 'Helvetica';
    }
    return 'Times';
  }

  function clean(t) {
    return window.CVApp.sanitize(String(t == null ? '' : t));
  }

  function lineHead(a, b) {
    var an = clean(a);
    var bn = clean(b);
    return {
      text: an + (an && bn ? ' — ' : '') + bn,
      style: 'item',
      bold: true
    };
  }

  function subLine(t) {
    return { text: clean(t), style: 'muted' };
  }

  function bodyText(t) {
    return clean(t)
      .split('\n')
      .map(function (l) { return { text: l, style: 'body' }; });
  }

  function sectionTitle(t) {
    return [
      {
        canvas: [{ type: 'line', x1: 0, y1: 0, x2: 495, y2: 0, lineWidth: 0.6, lineColor: '#111827' }],
        margin: [0, 12, 0, 4]
      },
      { text: t, style: 'section' }
    ];
  }

  function displayName(d) {
    // Sumber tunggal nama: `fullname`. Fallback ke `name` untuk data lama.
    var n = clean(d.fullname || d.name || '');
    return n;
  }

  function buildDoc(d) {
    var C = [];
    var name = displayName(d);

    if (d.photo && typeof d.photo === 'string' && /^data:image\//.test(d.photo)) {
      C.push({
        image: d.photo,
        fit: [86, 86],
        alignment: 'left',
        margin: [0, 0, 0, 8]
      });
    }

    C.push({ text: name || 'Nama Lengkap', style: 'name' });
    var contact = [d.email, d.phone, d.address].filter(Boolean).map(clean).join(' • ');
    if (contact) C.push({ text: contact, style: 'contact' });

    if (clean(d.about)) C = C.concat(bodyText(d.about));

    if (d.education.length) {
      C = C.concat(sectionTitle('PENDIDIKAN'));
      d.education.forEach(function (ed) {
        C.push(lineHead(ed.school, ed.major));
        var yr = [ed.yearStart, ed.yearEnd].filter(Boolean).map(clean).join(' - ');
        if (yr) C.push(subLine(yr));
      });
    }

    if (d.experience.length) {
      C = C.concat(sectionTitle('PENGALAMAN'));
      d.experience.forEach(function (x) {
        C.push(lineHead(x.name, x.role));
        if (x.period) C.push(subLine(x.period));
        var lines = clean(x.desc)
          .split('\n')
          .map(function (s) { return s.trim(); })
          .filter(Boolean);
        lines.forEach(function (l) {
          C.push({ text: '-  ' + l, style: 'body' });
        });
      });
    }

    if (d.skills.length) {
      C = C.concat(sectionTitle('SKILL'));
      C.push({ text: d.skills.map(clean).join(', '), style: 'body' });
    }

    if (clean(d.strengths)) {
      C = C.concat(sectionTitle('KELEBIHAN'));
      C = C.concat(bodyText(d.strengths));
    }

    if (clean(d.weaknesses)) {
      C = C.concat(sectionTitle('KEKURANGAN'));
      C = C.concat(bodyText(d.weaknesses));
    }

    return {
      info: {
        title: 'CV - ' + (name || 'Biodata'),
        author: name || 'ATS CV Maker'
      },
      pageSize: 'A4',
      pageMargins: [50, 45, 50, 42],
      defaultStyle: {
        font: family(),
        fontSize: 10.5,
        lineHeight: 1.35,
        color: '#111827'
      },
      content: C,
      styles: {
        name: { fontSize: 18, bold: true, margin: [0, 0, 0, 2] },
        contact: { fontSize: 9.5, margin: [0, 2, 0, 6], color: '#374151' },
        section: { fontSize: 11, bold: true, characterSpacing: 1.2, margin: [0, 2, 0, 6] },
        item: { fontSize: 10.5, margin: [0, 3, 0, 0] },
        muted: { fontSize: 9, italics: true, margin: [0, 0, 3, 0], color: '#4b5563' },
        body: { fontSize: 10.5, margin: [0, 0, 0, 2] }
      },
      footer: function (currentPage, pageCount) {
        return {
          text: currentPage + ' / ' + pageCount,
          alignment: 'center',
          fontSize: 8,
          color: '#9ca3af',
          margin: [0, 8, 0, 0]
        };
      }
    };
  }

  function slug(s) {
    return String(s || '')
      .trim()
      .replace(/[^\w\- ]/g, '')
      .trim()
      .replace(/\s+/g, '_');
  }

  function download() {
    if (!window.pdfMake) {
      window.CVApp.toast('Library PDF belum termuat. Periksa koneksi internet.', 'error');
      return;
    }
    if (!window.CVApp.validate()) return;

    var d = window.CVApp.collectData();
    var nameUpper = slug(String(d.fullname || d.name || 'Biodata').toUpperCase());
    var nim = slug(d.nim || '');
    var fileName = 'CV_' + (nameUpper || 'BIODATA') + (nim ? '_' + nim : '') + '.pdf';

    try {
      window.pdfMake.createPdf(buildDoc(d)).download(fileName);
      window.CVApp.toast('PDF sedang diunduh: ' + fileName);
    } catch (err) {
      window.CVApp.toast('Gagal membuat PDF: ' + err.message, 'error');
    }
  }

  window.CVApp.buildPdf = download;
})();