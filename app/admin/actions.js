"use server";

import { redirect } from "next/navigation";
import { buatClientSesi } from "@/lib/supabase";
import { toko } from "@/lib/toko";

export async function loginAdmin(prevState, formData) {
  const email = formData.get("email");
  const password = formData.get("password");

  if (!email || !password) {
    return { error: "Email dan password wajib diisi." };
  }

  const supabase = await buatClientSesi();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: "Email atau password salah." };
  }

  redirect("/admin");
}

export async function logoutAdmin() {
  const supabase = await buatClientSesi();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function gantiPassword(prevState, formData) {
  const passwordBaru = formData.get("password_baru");
  const konfirmasi = formData.get("konfirmasi_password");

  if (!passwordBaru || !konfirmasi) {
    return { error: "Semua field wajib diisi." };
  }

  if (passwordBaru.length < 8) {
    return { error: "Password baru minimal 8 karakter." };
  }

  if (passwordBaru !== konfirmasi) {
    return { error: "Password baru dan konfirmasi tidak sama." };
  }

  const supabase = await buatClientSesi();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Sesi login sudah berakhir. Silakan login kembali." };
  }

  const { error } = await supabase.auth.updateUser({
    password: passwordBaru,
  });

  if (error) {
    return { error: "Gagal mengganti password. " + error.message };
  }

  return { sukses: "Password berhasil diganti." };
}

export async function tambahProduk(prevState, formData) {
  const supabase = await buatClientSesi();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Sesi login sudah berakhir. Silakan login kembali." };
  }

  const nama = formData.get("nama")?.trim();
  const harga = parseInt(formData.get("harga"), 10);
  const kategori = formData.get("kategori")?.trim() || null;
  const foto_url = formData.get("foto_url")?.trim() || null;
  const deskripsi = formData.get("deskripsi")?.trim() || null;

  if (!nama) {
    return { error: "Nama produk wajib diisi." };
  }

  if (isNaN(harga) || harga < 0) {
    return { error: "Harga harus berupa angka dan tidak boleh negatif." };
  }

  const { error } = await supabase.from("produk").insert({
    nama,
    harga,
    kategori,
    foto_url,
    deskripsi,
  });

  if (error) {
    return { error: "Gagal menyimpan produk. " + error.message };
  }

  redirect("/admin");
}

export async function ubahProduk(prevState, formData) {
  const supabase = await buatClientSesi();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Sesi login sudah berakhir. Silakan login kembali." };
  }

  const id = formData.get("id");
  const nama = formData.get("nama")?.trim();
  const harga = parseInt(formData.get("harga"), 10);
  const kategori = formData.get("kategori")?.trim() || null;
  const foto_url = formData.get("foto_url")?.trim() || null;
  const deskripsi = formData.get("deskripsi")?.trim() || null;

  if (!id) {
    return { error: "ID produk tidak ditemukan." };
  }

  if (!nama) {
    return { error: "Nama produk wajib diisi." };
  }

  if (isNaN(harga) || harga < 0) {
    return { error: "Harga harus berupa angka dan tidak boleh negatif." };
  }

  const { error } = await supabase
    .from("produk")
    .update({ nama, harga, kategori, foto_url, deskripsi })
    .eq("id", id);

  if (error) {
    return { error: "Gagal menyimpan perubahan. " + error.message };
  }

  redirect("/admin");
}

export async function hapusProduk(formData) {
  const supabase = await buatClientSesi();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/admin/login");
  }

  const id = formData.get("id");
  if (!id) {
    return;
  }

  await supabase.from("produk").delete().eq("id", id);

  redirect("/admin");
}

export async function buatDeskripsiAI({ nama, kategori }) {
  const supabase = await buatClientSesi();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Sesi login sudah berakhir. Silakan login kembali." };
  }

  if (!nama || !nama.trim()) {
    return { error: "Nama produk harus diisi terlebih dahulu." };
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return {
      error:
        "GEMINI_API_KEY belum diisi di file .env.local. Tambahkan variabel GEMINI_API_KEY untuk menggunakan fitur AI ini.",
    };
  }

  const prompt = `Buatkan deskripsi produk yang menarik, singkat (2-3 kalimat), dan menggugah minat pembeli untuk toko "${toko.nama}".
Nama produk: ${nama.trim()}
${kategori ? `Kategori: ${kategori.trim()}` : ""}
Tulis dalam bahasa Indonesia yang ramah. Jangan gunakan format tebal/markdown (*), buat sebagai teks paragraf polos saja.`;

  const models = [
    "gemini-3.8-flash",
    "gemini-3.8-flash-lite",
    "gemini-2.5-flash",
    "gemini-2.0-flash",
    "gemini-1.5-flash",
  ];
  let lastError = null;

  for (const model of models) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        lastError = data.error?.message || `Error status ${res.status}`;
        continue;
      }

      const hasil = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
      if (hasil) {
        return { sukses: true, deskripsi: hasil };
      }
    } catch (err) {
      lastError = err.message;
    }
  }

  return {
    error: `Gagal memanggil Gemini API: ${lastError || "Tidak ada respon teks."}`,
  };
}
