"use client";

import { useState } from "react";
import { toko } from "@/lib/toko";
import { formatRupiah } from "@/lib/format";

export default function TombolWhatsApp({ produk }) {
  const [jumlah, setJumlah] = useState(1);

  const total = produk.harga * jumlah;
  const pesan = `Halo, saya ingin memesan:\n\n*${produk.nama}*\nHarga: ${formatRupiah(produk.harga)}\nJumlah: ${jumlah}\nTotal: ${formatRupiah(total)}\n\nTerima kasih!`;
  const url = `https://wa.me/${toko.nomorWhatsApp}?text=${encodeURIComponent(pesan)}`;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <span className="text-sm font-semibold">Jumlah:</span>
        <div className="inline-flex items-center rounded-lg border border-garis">
          <button
            type="button"
            onClick={() => setJumlah((j) => Math.max(1, j - 1))}
            className="px-3 py-1.5 text-lg font-semibold text-teks-lembut hover:text-utama disabled:opacity-40"
            disabled={jumlah <= 1}
          >
            −
          </button>
          <span className="min-w-[2.5rem] text-center text-sm font-bold">{jumlah}</span>
          <button
            type="button"
            onClick={() => setJumlah((j) => j + 1)}
            className="px-3 py-1.5 text-lg font-semibold text-teks-lembut hover:text-utama"
          >
            +
          </button>
        </div>
        <span className="text-sm text-teks-lembut">
          Total: <span className="font-bold text-harga">{formatRupiah(total)}</span>
        </span>
      </div>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex w-full items-center justify-center rounded-lg bg-utama px-5 py-3 font-semibold text-white hover:bg-utama-gelap sm:w-auto"
      >
        Pesan via WhatsApp
      </a>
    </div>
  );
}
