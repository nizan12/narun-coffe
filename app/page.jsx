import KartuProduk from "@/components/KartuProduk";
import FilterProduk from "@/components/FilterProduk";
import { toko } from "@/lib/toko";
import { buatClientServer } from "@/lib/supabase";

export default async function HalamanKatalog({ searchParams }) {
  const { kategori, cari } = await searchParams;

  let daftarProduk = [];
  let semuaProduk = [];
  let error = null;

  try {
    const supabase = buatClientServer();

    // Ambil semua produk untuk daftar kategori
    const { data, error: sbError } = await supabase
      .from("produk")
      .select("id, nama, harga, foto_url, kategori")
      .order("created_at", { ascending: false });

    if (sbError) {
      throw sbError;
    }

    semuaProduk = data ?? [];

    // Filter di server
    daftarProduk = semuaProduk;

    if (kategori) {
      daftarProduk = daftarProduk.filter((p) => p.kategori === kategori);
    }

    if (cari) {
      const kata = cari.toLowerCase();
      daftarProduk = daftarProduk.filter((p) =>
        p.nama.toLowerCase().includes(kata)
      );
    }
  } catch (err) {
    console.error("Gagal mengambil data produk:", err);
    error = err.message || "Terjadi kesalahan saat mengambil data produk.";
  }

  // Kumpulkan kategori unik untuk filter
  const kategoriList = [...new Set(semuaProduk.map((p) => p.kategori).filter(Boolean))].sort();

  return (
    <>
      <section className="py-10 sm:py-14">
        <h1 className="max-w-2xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
          {toko.nama}
        </h1>
        <p className="mt-3 max-w-xl text-lg text-teks-lembut">{toko.tagline}</p>
        <p className="mt-4 text-sm text-teks-lembut">{toko.jamBuka}</p>
      </section>

      <section aria-labelledby="judul-produk" className="flex flex-col gap-5">
        <h2 id="judul-produk" className="text-xl font-bold">
          Produk kami
        </h2>

        {!error && semuaProduk.length > 0 && (
          <FilterProduk kategoriList={kategoriList} />
        )}

        {error ? (
          <div className="rounded-xl border border-red-300 bg-red-50 p-6 text-center text-red-700">
            <p className="font-semibold">Gagal memuat produk</p>
            <p className="mt-1 text-sm">{error}</p>
          </div>
        ) : daftarProduk.length === 0 ? (
          <p className="py-12 text-center text-teks-lembut">
            {kategori || cari ? "Tidak ada produk yang cocok" : "Belum ada produk"}
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {daftarProduk.map((produk) => (
              <KartuProduk key={produk.id} produk={produk} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
