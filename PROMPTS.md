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

Tambahkan bagian baru untuk setiap error yang kamu perbaiki atau fitur bonus yang kamu kerjakan.
