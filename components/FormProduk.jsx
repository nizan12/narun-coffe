"use client";

import { useState, useActionState } from "react";
import Input from "@/components/Input";
import Tombol from "@/components/Tombol";
import { buatDeskripsiAI } from "@/app/admin/actions";

// Dipakai untuk tambah produk (US-08) dan ubah produk (US-09). Keduanya bonus.
// Nama field sama dengan kolom tabel "produk".
export default function FormProduk({ produk = {}, labelTombol, action }) {
  const [state, formAction, pending] = useActionState(action, null);
  const [nama, setNama] = useState(produk.nama || "");
  const [kategori, setKategori] = useState(produk.kategori || "");
  const [deskripsi, setDeskripsi] = useState(produk.deskripsi || "");
  const [loadingAI, setLoadingAI] = useState(false);
  const [pesanAI, setPesanAI] = useState(null);

  async function handleBuatDeskripsiAI() {
    setPesanAI(null);
    if (!nama.trim()) {
      setPesanAI({
        error: "Isi nama produk terlebih dahulu untuk membuat deskripsi dengan AI.",
      });
      return;
    }

    setLoadingAI(true);
    try {
      const res = await buatDeskripsiAI({ nama, kategori });
      if (res?.error) {
        setPesanAI({ error: res.error });
      } else if (res?.deskripsi) {
        setDeskripsi(res.deskripsi);
        setPesanAI({ sukses: "Deskripsi berhasil dibuat dengan AI!" });
      }
    } catch (err) {
      setPesanAI({ error: "Gagal membuat deskripsi: " + err.message });
    } finally {
      setLoadingAI(false);
    }
  }

  return (
    <form action={formAction} className="flex max-w-xl flex-col gap-4">
      {produk.id && <input type="hidden" name="id" value={produk.id} />}
      <Input
        label="Nama produk"
        name="nama"
        value={nama}
        onChange={(e) => setNama(e.target.value)}
        required
      />
      <Input
        label="Harga (Rp)"
        name="harga"
        type="number"
        min="0"
        defaultValue={produk.harga}
        required
      />
      <Input
        label="Kategori"
        name="kategori"
        value={kategori}
        onChange={(e) => setKategori(e.target.value)}
      />
      <Input
        label="Link foto"
        name="foto_url"
        placeholder="https://... atau /produk/nama-file.svg"
        defaultValue={produk.foto_url}
      />
      <div>
        <Input
          label={
            <span className="flex items-center justify-between">
              <span>Deskripsi</span>
              <button
                type="button"
                onClick={handleBuatDeskripsiAI}
                disabled={loadingAI}
                className="inline-flex cursor-pointer items-center gap-1 text-xs font-semibold text-utama hover:text-utama-gelap disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loadingAI ? "⏳ Sedang membuat…" : "✨ Buat dengan AI"}
              </button>
            </span>
          }
          name="deskripsi"
          textarea
          value={deskripsi}
          onChange={(e) => setDeskripsi(e.target.value)}
          placeholder="Tulis deskripsi atau klik 'Buat dengan AI' di atas"
        />
        {pesanAI?.error && (
          <p className="mt-1.5 rounded-lg bg-red-50 px-3 py-2 text-xs text-bahaya">
            {pesanAI.error}
          </p>
        )}
        {pesanAI?.sukses && (
          <p className="mt-1.5 rounded-lg bg-emerald-50 px-3 py-2 text-xs text-utama">
            {pesanAI.sukses}
          </p>
        )}
      </div>
      {state?.error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      )}
      <div className="flex gap-3">
        <Tombol type="submit" disabled={pending}>
          {pending ? "Menyimpan…" : labelTombol}
        </Tombol>
        <Tombol href="/admin" varian="garis">
          Batal
        </Tombol>
      </div>
    </form>
  );
}
