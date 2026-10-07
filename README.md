# ATS CV Maker

Buat CV satu kolom yang ramah sistem ATS untuk mahasiswa dan fresh graduate.
Teks 100% bisa disalin, tanpa gambar latar, memakai font standar
Times New Roman / Arial. PDF dibuat langsung di browser — tanpa backend,
tanpa upload ke server.

## Fitur

- Form 6 langkah: biodata + foto, deskripsi diri, pendidikan, pengalaman,
  skill, kelebihan & kekurangan.
- Live preview satu kolom yang sama persis dengan isi PDF.
- Download PDF via pdfmake (font Times / Helvetica, ukuran A4).
- Foto opsional: crop persegi otomatis, diperkecil maks 320px (JPEG 0.82),
  maks 8 MB.
- Autosave ke `localStorage` (termasuk pilihan font), restore otomatis
  saat halaman dibuka ulang, tombol Bersihkan Form.
- Validasi: nama & email wajib, email harus valid, tahun lulus tidak boleh
  lebih awal dari tahun masuk.
- Pendidikan & pengalaman dinamis (maks 6 baris tiap bagian).
- Nama file PDF otomatis: `CV_NAMA_LENGKAP[_NIM].pdf`
  (NIM hanya untuk nama file, tidak tampil di isi CV).

## Cara menjalankan

Butuh PHP 8+ (atau server statis apa pun, karena PHP hanya dipakai untuk
variabel judul/tahun).

```powershell
# dari folder proyek ini
php -S localhost:8000
# buka http://localhost:8000
```

Tanpa PHP pun bisa dibuka langsung sebagai file statis, kecuali bagian
`<?php ... ?>` untuk judul/tahun tidak akan dirender.

## Struktur proyek

```text
cvats-maker/
├── index.php               # Satu-satunya halaman (form + preview)
├── README.md
├── .gitignore
├── assets/
│   ├── css/
│   │   └── style.css       # Komponen form, preview-paper, toast, print
│   ├── js/
│   │   ├── preview.js      # collectData() + renderPreview() (sumber data)
│   │   ├── dynamic.js      # Tambah/hapus baris pendidikan & pengalaman
│   │   ├── pdf.js          # buildDoc() + download via pdfmake
│   │   └── app.js          # State, validasi, foto, storage, init
│   └── img/
│       └── .gitkeep        # Placeholder gambar statis
└── storage/
    └── uploads/
        └── .gitkeep        # Placeholder (belum dipakai — foto murni client-side)
```

> Hasil audit: tidak ada file tak penting. Semua file di `assets/` dipakai
> oleh `index.php`. Folder kosong hanya `assets/img/` dan
> `storage/uploads/` yang sengaja dipertahankan via `.gitkeep`.

## Integrasi data (alur)

```text
Form (index.php)
  │ input event (debounce 80ms)
  ▼
CVApp.collectData()            [assets/js/preview.js]
  │ { fullname, nim, email, phone, address, photo,
  │   about, education[], experience[], skills[], strengths, weaknesses }
  ├─► CVApp.renderPreview()   → HTML di #previewBody (preview.js)
  ├─► CVApp.saveData()        → localStorage `cvatsMaker.v1` (app.js)
  └─► CVApp.buildPdf()        → pdfmake doc → CV_NAMA[_NIM].pdf (pdf.js)
```

Event internal:

- `cv:data-changed` — dipicu `dynamic.js` setiap tambah/hapus baris,
  didengar `app.js` untuk render ulang + simpan. Jadi preview dan
  `localStorage` tidak pernah ketinggalan setelah mutasi baris.
- `input` pada `#cvForm` — debounce, lalu render + simpan.
- `change` pada `#fontSelect` — ganti `CVApp.currentFont`, render + simpan.
  Nilai font ikut tersimpan (`times` / `arial`) agar konsisten setelah reload.

Contoh isi `localStorage` (`cvatsMaker.v1`):

```json
{
  "fullname": "Raditya Pratama",
  "nim": "211040123",
  "email": "raditya@email.com",
  "phone": "0812-3456-7890",
  "address": "Jakarta Selatan",
  "photo": "data:image/jpeg;base64,...",
  "about": "...",
  "education": [{ "school": "...", "major": "...", "yearStart": "2021", "yearEnd": "2025" }],
  "experience": [{ "name": "...", "role": "...", "period": "...", "desc": "..." }],
  "skills": ["HTML", "CSS", "PHP"],
  "strengths": "...",
  "weaknesses": "...",
  "font": "times",
  "_v": 1
}
```

Kompatibilitas: data lama berkunci `cvatsMakerData` dengan field `name`
otomatis dimigrasi ke `fullname` saat restore. Foto yang bukan
`data:image/*;base64,` ditolak (anti XSS via localStorage).

## Detail modul JS

| File | Tanggung jawab |
| --- | --- |
| `preview.js` | `collectData()`, `renderPreview()`, `isSafePhoto()`, escape HTML. Satu-satunya tempat membaca DOM form menjadi objek data. |
| `dynamic.js` | Tambah/hapus baris (maks 6), counter `.edu-count` / `.exp-count` (class, bukan id, agar aman di-clone), lalu kirim event `cv:data-changed`. |
| `pdf.js` | `buildDoc()` (A4, margin 50/45/50/42, sanitize anti-emoji), nama file slug, guard bila pdfmake belum termuat (offline). |
| `app.js` | `FIELD_MAP` (pemetaan id→kunci + legacy), validasi, foto (crop canvas), `saveData`/`restore` + versi, persist font, init AOS/listener. Mengekspos `CVApp.saveData` & `CVApp.schedulePreview`. |

## Teknologi (CDN)

- Tailwind CSS (play CDN), Google Fonts Plus Jakarta Sans (UI) —
  isi CV/preview tetap Times/Helvetica agar ATS-friendly.
- pdfmake 0.3.3 + font standar Times & Helvetica.
- AOS 2.3.4 (animasi, opsional — dijaga `if (window.AOS)`).

## Catatan ATS

- Layout satu kolom, tanpa tabel/kolom ganda, tanpa teks dalam gambar.
- Foto bersifat opsional dan berupa elemen `<img>` biasa; seluruh teks
  tetap selectable di PDF.
- Sanitasi PDF membuang emoji/karakter non-standar agar font standar
  tidak rusak, tapi huruf Indonesia umum tetap aman.
