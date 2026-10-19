# Jurnal Prompt

Catat prompt penting selama membangun aplikasi: apa yang kamu minta, hasilnya, dan perbaikan yang dilakukan. Beri tanda **[SENDIRI]** untuk prompt yang kamu tulis sendiri (bukan dari lembar kerja).

## US-01 Katalog dari database

**Prompt:**
Baca AGENTS.md dan docs/user-stories.md bagian US-01.

Ubah app/page.jsx supaya daftar produk diambil dari tabel "produk" di Supabase, di sisi server, memakai SUPABASE_URL dan SUPABASE_SECRET_KEY dari environment variable. Buat koneksi Supabase untuk server di folder lib/supabase.

Tampilkan produk dengan komponen KartuProduk yang sudah ada, tanpa mengubah tampilannya. Kalau gagal mengambil data, tampilkan pesan error yang jelas di halaman. Kalau tabel kosong, tampilkan tulisan "Belum ada produk". Hapus CatatanBelumAktif dari halaman ini.

**Hasil:**
Berhasil. File `lib/supabase.js` dibuat dengan fungsi `buatClientServer()`. Halaman `app/page.jsx` diubah menjadi async Server Component yang mengambil data dari tabel `produk` di Supabase. Menampilkan pesan error jika gagal, "Belum ada produk" jika tabel kosong.

**Perbaikan:**
SUPABASE_URL awalnya mengandung `/rest/v1/` di belakangnya yang menyebabkan error `PGRST125`. Diperbaiki dengan menghapus path tersebut karena library `@supabase/supabase-js` sudah menambahkannya secara otomatis.

## US-02 Detail produk

**Prompt:**
Baca docs/user-stories.md bagian US-02.

Ubah app/produk/[id]/page.jsx supaya mengambil satu produk dari tabel "produk" di Supabase berdasarkan id di URL, di sisi server, memakai koneksi Supabase yang sudah dibuat di lib/supabase. Kalau produk tidak ditemukan, panggil notFound(). Jangan ubah tampilannya. Hapus CatatanBelumAktif dari halaman ini, tapi biarkan tombol WhatsApp.

**Hasil:**
Berhasil. Halaman detail produk mengambil data dari Supabase dengan `.eq("id", id).single()`. Produk yang tidak ada menampilkan halaman "tidak ditemukan". CatatanBelumAktif dihapus.

**Perbaikan:**

## US-03 Pesan via WhatsApp

**Prompt:**
Baca docs/rancangan-teknis.md bagian "Pesan WhatsApp (US-03)".

Ubah components/TombolWhatsApp.jsx menjadi tautan yang membuka https://wa.me/ ke nomor di lib/toko.js, dengan pesan otomatis berisi nama dan harga produk dalam format rupiah. Pesan di-encode dengan encodeURIComponent dan dibuka di tab baru. Pertahankan tampilan tombolnya. Hapus CatatanBelumAktif yang menyebut US-03 di halaman detail produk.

**Hasil:**
Berhasil. Tombol diubah dari `<button>` menjadi `<a>` yang membuka `https://wa.me/6285156670861?text=...` dengan pesan otomatis berisi nama dan harga produk (format rupiah). Dibuka di tab baru dengan `target="_blank"`.

**Perbaikan:**

## US-04 Login admin

**Prompt:**
Baca AGENTS.md bagian aturan keamanan dan docs/user-stories.md bagian US-04.

Buat login admin memakai Supabase Auth (email dan password) dengan @supabase/ssr dan cookie, memakai SUPABASE_URL dan SUPABASE_PUBLISHABLE_KEY. Login diproses dengan Server Action di app/admin/actions.js dan disambungkan ke form di app/admin/login/page.jsx. Login berhasil diarahkan ke /admin; login gagal menampilkan pesan error yang jelas di halaman login. Buat juga tombol "Keluar" di components/NavAdmin.jsx berfungsi: mengakhiri sesi lalu kembali ke /admin/login. Jangan ubah tampilan. Hapus CatatanBelumAktif dari halaman login.

**Hasil:**
Berhasil. Ditambahkan fungsi `buatClientSesi()` di `lib/supabase.js` menggunakan `@supabase/ssr` dengan cookie. Server Action `loginAdmin` dan `logoutAdmin` dibuat di `app/admin/actions.js`. Form login terhubung via `useActionState`. Tombol "Keluar" di NavAdmin memanggil `logoutAdmin`.

**Perbaikan:**

## US-05 Ganti password

**Prompt:**
Baca docs/user-stories.md bagian US-05.

Buat Server Action ganti password di app/admin/actions.js untuk admin yang sedang login, memakai Supabase Auth. Validasi di server: password baru minimal 8 karakter dan harus sama dengan konfirmasi. Tampilkan pesan berhasil atau pesan error yang jelas di halaman. Sambungkan ke form di app/admin/password/page.jsx tanpa mengubah tampilannya. Hapus CatatanBelumAktif dari halaman ini.

**Hasil:**
Berhasil. Server Action `gantiPassword` ditambahkan di `app/admin/actions.js` dengan validasi server (min 8 karakter, konfirmasi cocok, cek login). Form terhubung via `useActionState`. Menampilkan pesan sukses (hijau) atau error (merah).

**Perbaikan:**

## US-06 Proteksi halaman admin

**Prompt:**
Baca AGENTS.md aturan keamanan nomor 3 dan 4, dan docs/user-stories.md bagian US-06.

Buat file proxy.js di root proyek (Next.js 16). Semua rute /admin kecuali /admin/login wajib login dengan Supabase Auth; kalau belum login, alihkan ke /admin/login. Pastikan juga setiap Server Action yang mengubah data memeriksa login di server. Hapus CatatanBelumAktif dari halaman /admin.

**Hasil:**
Berhasil. File `proxy.js` dibuat di root proyek dengan proteksi rute `/admin/*` (kecuali `/admin/login`) menggunakan `@supabase/ssr` dan `getUser()`. CatatanBelumAktif dihapus dari halaman admin. Server Action `gantiPassword` sudah memeriksa login via `getUser()`.

**Perbaikan:**

## Debugging dan fitur bonus

### US-07 List produk admin dari database (bonus)

**Prompt:**
Lanjut US-07 List produk di halaman admin dari database.

**Hasil:**
Berhasil. Halaman `app/admin/page.jsx` diubah menjadi async Server Component yang mengambil data dari tabel `produk` di Supabase menggunakan `buatClientServer()`. Import `data-contoh` dihapus. Menampilkan error jika gagal, "Belum ada produk" jika kosong.

**Perbaikan:**

### US-08 Tambah produk (bonus)

**Prompt:**
US-08 Tambah produk (harus terkunci login).

**Hasil:**
Berhasil. Server Action `tambahProduk` ditambahkan di `app/admin/actions.js` dengan pengecekan login (`getUser()`), validasi nama dan harga, lalu insert ke tabel `produk`. Komponen `FormProduk` diubah menjadi client component yang menerima prop `action` dan menampilkan error. Halaman `app/admin/produk/baru/page.jsx` terhubung ke action dan `CatatanBelumAktif` dihapus.

**Perbaikan:**

### US-09 Ubah produk (bonus)

**Prompt:**
US-09 Ubah produk (harus terkunci login).

**Hasil:**
Berhasil. Server Action `ubahProduk` ditambahkan di `app/admin/actions.js` dengan pengecekan login, validasi, dan update berdasarkan ID. Hidden input `id` ditambahkan di `FormProduk`. Halaman `app/admin/produk/[id]/ubah/page.jsx` mengambil data produk dari Supabase dan meneruskan action `ubahProduk`. `CatatanBelumAktif` dihapus.

**Perbaikan:**

### US-10 Hapus produk (bonus)

**Prompt:**
US-10 Hapus produk (harus terkunci login).

**Hasil:**
Berhasil. Server Action `hapusProduk` ditambahkan di `app/admin/actions.js` dengan pengecekan login (`getUser()`). Komponen `TabelProduk` diubah menjadi client component dengan tombol "Hapus" yang menampilkan dialog konfirmasi sebelum menghapus. Produk dihapus berdasarkan ID lalu redirect ke `/admin`.

**Perbaikan:**

### US-11 Filter kategori atau pencarian (bonus)

**Prompt:**
US-11 Filter kategori atau pencarian.

**Hasil:**
Berhasil. Komponen `FilterProduk` dibuat sebagai client component dengan tombol kategori (pills) dan input pencarian. Halaman katalog (`app/page.jsx`) menerima `searchParams` dan memfilter produk di server. URL bisa dibagikan (misal `/?kategori=Minuman&cari=kopi`). Jika filter tidak cocok, tampil "Tidak ada produk yang cocok".

**Perbaikan:**

### US-12 Pilih jumlah atau varian (bonus)

**Prompt:**
US-12 Pilih jumlah atau varian.

**Hasil:**
Berhasil. `TombolWhatsApp` diubah menjadi client component dengan pemilih jumlah (tombol − / +). Total harga dihitung otomatis. Jumlah dan total ikut tertulis di pesan WhatsApp. Tampilan tombol tetap sama.

**Perbaikan:**

### US-13 PWA (Bisa di-install di HP) (bonus)

**Prompt:**
US-13 Bisa di-install di HP (PWA).

**Hasil:**
Berhasil. Membuat konfigurasi Web App Manifest di `app/manifest.js` yang memanfaatkan ikon `public/icons/icon-192.png` dan `public/icons/icon-512.png`. Menambahkan metadata `appleWebApp`, `viewport` (`themeColor`), dan link manifest di `app/layout.jsx`. Menambahkan service worker di `public/sw.js` dengan strategi caching dan registrasi otomatis di client. Pengunjung dapat memasang katalog di beranda layar HP layaknya aplikasi.

**Perbaikan:**

### US-14 Deskripsi produk dibuat AI (bonus)

**Prompt:**
US-14 Deskripsi produk dibuat AI.

**Hasil:**
Berhasil. Menambahkan keterangan di Footer (`components/Footer.jsx`) bahwa website dan katalog dibuat dengan bantuan AI, serta fitur pembuatan deskripsi produk otomatis dengan Gemini AI di form admin produk (`components/FormProduk.jsx` dan `app/admin/actions.js`). Memperbaiki hydration warning akibat ekstensi browser di `app/layout.jsx` dengan `suppressHydrationWarning`.

**Perbaikan:**

Tambahkan bagian baru untuk setiap error yang kamu perbaiki atau fitur bonus yang kamu kerjakan.

