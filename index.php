<?php
$siteName = 'ATS CV Maker';
$siteDesc = 'Buat CV satu kolom yang ramah sistem ATS untuk mahasiswa dan fresh graduate. Teks 100% bisa disalin, tanpa gambar, dan memakai font standar Times New Roman / Arial.';
$currentYear = date('Y');
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo htmlspecialchars($siteName); ?> - ATS-Friendly CV Builder</title>
    <meta name="description" content="<?php echo htmlspecialchars($siteDesc); ?>">
    <link rel="canonical" href="https://cv-ats-maker.codeboost.id/">
    <meta property="og:title" content="<?php echo htmlspecialchars($siteName); ?> - Buat CV Ramah ATS">
    <meta property="og:description" content="<?php echo htmlspecialchars($siteDesc); ?>">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://cv-ats-maker.codeboost.id/">
    <meta property="og:image" content="https://cv-ats-maker.codeboost.id/assets/img/og-image.png">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="<?php echo htmlspecialchars($siteName); ?>">
    <meta name="twitter:description" content="<?php echo htmlspecialchars($siteDesc); ?>">
    <meta name="robots" content="index, follow">
    <meta name="theme-color" content="#0ea5e9">

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">

    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://unpkg.com/aos@2.3.4/dist/aos.css">
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <link rel="stylesheet" href="assets/css/style.css">
    <link rel="icon" type="image/svg+xml" href="assets/img/favicon.svg">
    <link rel="apple-touch-icon" href="assets/img/favicon.svg">
</head>
<body class="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 text-slate-800">

    <a href="#cvForm" class="skip-link">Lompat ke formulir</a>

    <main class="max-w-6xl mx-auto px-4 pb-16">

        <header class="text-center pt-10 pb-8 no-print" data-aos="fade-down">
            <span class="chip">ATS-Friendly</span>
            <h1 class="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-sky-600 via-blue-600 to-sky-400 bg-clip-text text-transparent"><?php echo htmlspecialchars($siteName); ?></h1>
            <p class="mt-3 text-slate-600 max-w-xl mx-auto text-sm sm:text-base"><?php echo htmlspecialchars($siteDesc); ?></p>
            <div class="mt-5 flex flex-wrap justify-center gap-2">
                <span class="chip">Teks selectable</span>
                <span class="chip">Layout 1 kolom</span>
                <span class="chip">Font standar Times / Arial</span>
                <span class="chip">Download PDF langsung</span>
                <button type="button" id="themeToggle" class="chip" aria-label="Ganti mode gelap/terang" title="Ganti mode gelap/terang">
                    <svg class="w-4 h-4 sun-icon hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                    <svg class="w-4 h-4 moon-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
                </button>
            </div>
        </header>

        <form id="cvForm" class="grid grid-cols-1 lg:grid-cols-5 gap-6" novalidate>

            <div class="lg:col-span-3 space-y-5">

                <section class="card no-print" data-aos="fade-up">
                    <div class="flex items-center gap-3 mb-4">
                        <span class="num">01</span>
                        <div>
                            <h2 class="font-bold text-slate-800">Informasi Pribadi</h2>
                            <p class="text-xs text-slate-500">Identitas diri yang muncul di bagian atas CV.</p>
                        </div>
                    </div>
                    <div class="mb-4">
                        <label class="lbl">Foto Profil (opsional)</label>
                        <div class="flex items-center gap-4">
                            <div id="photoThumbWrap" class="photo-thumb" role="button" aria-label="Preview foto profil" tabindex="0">
                                <img id="photoThumb" class="hidden" alt="Foto profil">
                                <span id="photoPlaceholder">Tambahkan Foto</span>
                            </div>
                            <div class="flex flex-col items-start gap-2">
                                <label for="photo" class="btn-ghost cursor-pointer">Pilih Foto</label>
                                <input type="file" id="photo" accept="image/*" class="hidden" aria-describedby="photoHint">
                                <input type="hidden" id="photoData">
                                <button type="button" id="btnRemovePhoto" class="btn-danger hidden" aria-label="Hapus foto profil">Hapus Foto</button>
                                <p id="photoHint" class="text-[11px] text-slate-400">JPG / PNG, maks 8 MB. Otomatis dicrop &amp; diperkecil.</p>
                            </div>
                        </div>
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label for="fullname" class="lbl">Nama Lengkap <span class="req">*</span></label>
                            <input type="text" id="fullname" class="field" placeholder="mis. Raditya Pratama" autocomplete="name">
                            <p data-msg class="text-xs text-red-500 mt-1 hidden">Nama wajib diisi.</p>
                        </div>
                        <div>
                            <label for="nim" class="lbl">NIM (Nomor Induk Mahasiswa)</label>
                            <input type="text" id="nim" class="field" inputmode="numeric" placeholder="mis. 211040123" autocomplete="off">
                            <p class="text-xs text-slate-400 mt-1">Hanya untuk nama file PDF, tidak tampil di isi CV.</p>
                        </div>
                        <div>
                            <label for="email" class="lbl">Email <span class="req">*</span></label>
                            <input type="email" id="email" class="field" placeholder="mis. raditya@email.com" autocomplete="email">
                            <p data-msg class="text-xs text-red-500 mt-1 hidden">Email wajib diisi dan valid.</p>
                        </div>
                        <div>
                            <label for="phone" class="lbl">Nomor Telepon</label>
                            <input type="tel" id="phone" class="field" placeholder="mis. 0812-3456-7890" autocomplete="tel">
                        </div>
                        <div>
                            <label for="address" class="lbl">Alamat / Domisili</label>
                            <input type="text" id="address" class="field" placeholder="mis. Jakarta Selatan, DKI Jakarta">
                        </div>
                    </div>
                </section>

                <section class="card no-print" data-aos="fade-up" data-aos-delay="50">
                    <div class="flex items-center gap-3 mb-4">
                        <span class="num">02</span>
                        <div>
                            <h2 class="font-bold text-slate-800">Deskripsi Diri</h2>
                            <p class="text-xs text-slate-500">Ringkas profilmu dalam 2-3 kalimat.</p>
                        </div>
                    </div>
                    <textarea id="about" class="field" placeholder="mis. Mahasiswa semester akhir Teknik Informatika dengan minat pada pengembangan web dan analisis data. Terbiasa bekerja dalam tim dan memiliki pengalaman organisasi di bidang teknologi." data-max-chars="1000"></textarea>
                    <span class="char-counter text-[10px] text-slate-400 mt-1 block text-right" id="counter-about">0 / 1000</span>
                </section>

                <section class="card no-print" data-aos="fade-up" aria-labelledby="eduHeading" role="region">
                    <div class="flex items-center gap-3 mb-4">
                        <span class="num">03</span>
                        <div>
                            <h2 id="eduHeading" class="font-bold text-slate-800">Riwayat Pendidikan</h2>
                            <p class="text-xs text-slate-500">Tambahkan kampus atau sekolah sebanyak yang kamu butuhkan.</p>
                        </div>
                    </div>
                    <div id="eduContainer" class="space-y-3" aria-label="Daftar pendidikan">
                        <div class="edu-item row-in bg-sky-50/60 border border-sky-100 rounded-xl p-4" draggable="true" role="button" aria-label="Seret baris pendidikan untuk mengubah urutan" tabindex="0">
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label class="lbl">Nama Kampus / Sekolah</label>
                                    <input type="text" name="eduschool" class="field" placeholder="mis. Universitas Indonesia">
                                </div>
                                <div>
                                    <label class="lbl">Jurusan</label>
                                    <input type="text" name="edumajor" class="field" placeholder="mis. Teknik Informatika">
                                </div>
                                <div>
                                    <label class="lbl">Tahun Masuk</label>
                                    <input type="number" name="eduyearStart" class="field" min="1970" max="2100" placeholder="2021">
                                </div>
                                <div>
                                    <label class="lbl">Tahun Lulus</label>
                                    <input type="number" name="eduyearEnd" class="field" min="1970" max="2100" placeholder="2025">
                                </div>
                            </div>
                            <div class="mt-3 flex items-center justify-between">
                                <span class="edu-count text-xs text-slate-500">1 baris</span>
                                <button type="button" class="btn-danger" data-remove aria-label="Hapus baris pendidikan">Hapus baris</button>
                            </div>
                        </div>
                    </div>
                    <button type="button" id="btnAddEdu" class="btn-ghost mt-3 w-full" aria-label="Tambah baris pendidikan">Tambah Pendidikan</button>
                </section>

                <section class="card no-print" data-aos="fade-up" data-aos-delay="150" aria-labelledby="expHeading" role="region">
                    <div class="flex items-center gap-3 mb-4">
                        <span class="num">04</span>
                        <div>
                            <h2 id="expHeading" class="font-bold text-slate-800">Pengalaman Kerja / Organisasi</h2>
                            <p class="text-xs text-slate-500">Ceritakan peran dan pencapaian terakhirmu.</p>
                        </div>
                    </div>
                    <div id="expContainer" class="space-y-3" aria-label="Daftar pengalaman">
                        <div class="exp-item row-in bg-sky-50/60 border border-sky-100 rounded-xl p-4" draggable="true" role="button" aria-label="Seret baris pengalaman untuk mengubah urutan" tabindex="0">
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label class="lbl">Nama Perusahaan / Organisasi</label>
                                    <input type="text" name="expname" class="field" placeholder="mis. Himpunan Mahasiswa Teknik (HMT)">
                                </div>
                                <div>
                                    <label class="lbl">Posisi / Jabatan</label>
                                    <input type="text" name="exprole" class="field" placeholder="mis. Kepala Divisi Pendidikan">
                                </div>
                                <div>
                                    <label class="lbl">Periode</label>
                                    <input type="text" name="expperiod" class="field" placeholder="mis. Jan 2024 - Des 2025">
                                </div>
                                <div>
                                    <label class="lbl">Deskripsi Tugas / Pencapaian</label>
                                    <textarea name="expdesc" class="field" placeholder="mis. Mengelola 10 program kerja, meningkatkan keanggotaan 30%, dan membangun sistem pendaftaran online." data-max-chars="500" data-counter-id="counter-expdesc-0" id="expdesc-0"></textarea>
                                    <span class="char-counter text-[10px] text-slate-400 mt-1 block text-right" id="counter-expdesc-0">0 / 500</span>
                                </div>
                            </div>
                            <div class="mt-3 flex items-center justify-between">
                                <span class="exp-count text-xs text-slate-500">1 baris</span>
                                <button type="button" class="btn-danger" data-remove aria-label="Hapus baris pengalaman">Hapus baris</button>
                            </div>
                        </div>
                    </div>
                    <button type="button" id="btnAddExp" class="btn-ghost mt-3 w-full" aria-label="Tambah baris pengalaman">Tambah Pengalaman</button>
                </section>

                <section class="card no-print" data-aos="fade-up" data-aos-delay="200">
                    <div class="flex items-center gap-3 mb-4">
                        <span class="num">05</span>
                        <div>
                            <h2 class="font-bold text-slate-800">Skill</h2>
                            <p class="text-xs text-slate-500">Pisahkan setiap skill dengan koma.</p>
                        </div>
                    </div>
                    <input type="text" id="skills" class="field" placeholder="mis. HTML, CSS, JavaScript, PHP, MySQL, Teamwork, Komunikasi">
                </section>

                <section class="card no-print" data-aos="fade-up" data-aos-delay="250">
                    <div class="flex items-center gap-3 mb-4">
                        <span class="num">06</span>
                        <div>
                            <h2 class="font-bold text-slate-800">Kelebihan &amp; Kekurangan</h2>
                            <p class="text-xs text-slate-500">Jujurlah mengenai kekuatan dan hal yang masih kamu kembangkan.</p>
                        </div>
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label for="strengths" class="lbl">Kelebihan</label>
                            <textarea id="strengths" class="field" placeholder="mis. Inisiatif tinggi, cepat belajar, dan teliti dalam menyelesaikan tugas." data-max-chars="500"></textarea>
                            <span class="char-counter text-[10px] text-slate-400 mt-1 block text-right" id="counter-strengths">0 / 500</span>
                        </div>
                        <div>
                            <label for="weaknesses" class="lbl">Kekurangan</label>
                            <textarea id="weaknesses" class="field" placeholder="mis. Terkadang terlalu perfeksionis sehingga lambat dalam memutuskan." data-max-chars="500"></textarea>
                            <span class="char-counter text-[10px] text-slate-400 mt-1 block text-right" id="counter-weaknesses">0 / 500</span>
                        </div>
                    </div>
                </section>

                <section class="card no-print" data-aos="fade-up" data-aos-delay="300">
                    <div class="flex flex-col sm:flex-row items-center gap-3 justify-between">
                        <div>
                            <p class="font-bold text-slate-800">Sudah siap?</p>
                            <p class="text-xs text-slate-500">PDF dibuat di browser menggunakan pdfmake. Pilih font lalu unduh.</p>
                        </div>
                        <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                            <button type="button" id="btnUndo" class="btn-ghost sm:w-auto" aria-label="Undo (Ctrl+Z)" title="Undo (Ctrl+Z)">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"></path></svg>
                            </button>
                            <button type="button" id="btnRedo" class="btn-ghost sm:w-auto" aria-label="Redo (Ctrl+Y)" title="Redo (Ctrl+Y)">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6"></path></svg>
                            </button>
                            <button type="button" id="btnClear" class="btn-ghost sm:w-auto">Bersihkan Form</button>
                            <button type="button" class="btn-primary js-download w-full sm:w-auto">Download CV (PDF)</button>
                        </div>
                    </div>
                </section>

            </div>

            <aside id="previewPanel" class="lg:col-span-2 lg:sticky lg:top-6 h-fit" data-aos="zoom-in" data-aos-delay="100">
                <div class="bg-white/90 backdrop-blur rounded-2xl border border-sky-100 shadow-lg">
                    <div class="flex items-center justify-between gap-2 px-4 pt-4 no-print">
                        <div>
                            <h2 class="font-bold text-slate-800">Live Preview</h2>
                            <p class="text-xs text-slate-500">Sesuai hasil PDF yang diunduh</p>
                        </div>
                        <span class="chip">Selectable text</span>
                    </div>
                    <div class="p-4">
                        <div id="previewPaper" class="preview-paper p-5 border border-slate-200 shadow-sm">
                            <div id="previewBody"></div>
                        </div>
                    </div>
                    <div class="px-4 pb-4 space-y-3 no-print">
                        <div>
                            <label for="fontSelect" class="lbl">Font PDF</label>
                            <select id="fontSelect" class="field">
                                <option value="times">Times New Roman (Serif)</option>
                                <option value="arial">Arial / Helvetica (Sans)</option>
                            </select>
                        </div>
                        <button type="button" class="btn-primary js-download w-full">Download CV (PDF)</button>
                        <p class="text-[11px] text-slate-400 text-center">Anti screenshot: seluruh teks di PDF bisa diblok dan disalin.</p>
                    </div>
                </div>
            </aside>

        </form>

    </main>

<footer class="text-center py-8 text-xs text-slate-400 no-print">
    &copy; <span id="year"><?php echo (int) $currentYear; ?></span> <?php echo htmlspecialchars($siteName); ?>. 
    Powered by <a href="https://www.codeboost.id" target="_blank" rel="noopener noreferrer" class="underline hover:text-slate-600 transition-colors">Codeboost Creative</a>
</footer>

    <script src="https://cdn.jsdelivr.net/npm/pdfmake@0.3.3/build/pdfmake.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/pdfmake@0.3.3/build/standard-fonts/Times.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/pdfmake@0.3.3/build/standard-fonts/Helvetica.js"></script>
    <script src="https://unpkg.com/aos@2.3.4/dist/aos.js"></script>
    <script src="assets/js/dynamic.js"></script>
    <script src="assets/js/preview.js"></script>
    <script src="assets/js/pdf.js"></script>
    <script src="assets/js/app.js"></script>
</body>
</html>