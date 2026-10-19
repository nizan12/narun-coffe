import NavAdmin from "@/components/NavAdmin";
import TabelProduk from "@/components/TabelProduk";
import Tombol from "@/components/Tombol";
import { buatClientServer } from "@/lib/supabase";

export default async function HalamanAdmin() {
  const supabase = buatClientServer();
  const { data: daftarProduk, error } = await supabase
    .from("produk")
    .select("id, nama, harga, foto_url, kategori")
    .order("created_at", { ascending: false });

  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold">Produk</h1>
        {/* US-08 (bonus): tambah produk */}
        <Tombol href="/admin/produk/baru">Tambah produk</Tombol>
      </div>
      {error ? (
        <div className="rounded-xl border border-red-300 bg-red-50 p-6 text-center text-red-700">
          <p className="font-semibold">Gagal memuat produk</p>
          <p className="mt-1 text-sm">{error.message}</p>
        </div>
      ) : daftarProduk.length === 0 ? (
        <p className="py-12 text-center text-teks-lembut">Belum ada produk</p>
      ) : (
        <TabelProduk daftarProduk={daftarProduk} />
      )}
    </div>
  );
}
