import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function LandingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen flex flex-col">

      {/* Navbar */}
      <nav className="border-b border-gray-800 px-6 py-4 flex justify-between items-center">
        <span className="font-semibold text-lg tracking-tight">StreamGame</span>
        <Link
          href="/auth/login"
          className="text-sm bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg transition"
        >
          Mulai Gratis
        </Link>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-24 space-y-6">
        <span className="text-xs bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 px-3 py-1 rounded-full">
          Game overlay untuk livestreamer
        </span>

        <h1 className="text-4xl sm:text-5xl font-semibold max-w-2xl leading-tight">
          Buat stream kamu lebih{" "}
          <span className="text-indigo-400">interaktif</span>
        </h1>

        <p className="text-gray-400 max-w-md text-lg leading-relaxed">
          Tambahkan game overlay ke OBS kamu dalam hitungan menit.
          Spin wheel, tebak kartu, dan banyak lagi — tanpa coding.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link
            href="/auth/login"
            className="bg-indigo-600 hover:bg-indigo-500 px-6 py-3 rounded-xl font-medium transition"
          >
            Coba Gratis Sekarang
          </Link>
          <Link
            href="#cara-pakai"
            className="border border-gray-700 hover:border-gray-500 px-6 py-3 rounded-xl font-medium transition"
          >
            Lihat Cara Pakai
          </Link>
        </div>
      </main>

      {/* Cara pakai */}
      <section id="cara-pakai" className="border-t border-gray-800 px-6 py-20">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold text-center mb-12">
            3 langkah untuk mulai
          </h2>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Daftar & beli game",
                desc: "Pilih game overlay yang kamu mau dari toko kami.",
              },
              {
                step: "2",
                title: "Paste link ke OBS",
                desc: "Copy link widget dan tambahkan sebagai Browser Source di OBS.",
              },
              {
                step: "3",
                title: "Mainkan saat live",
                desc: "Buka control panel di HP, pencet tombol — game langsung bereaksi di stream.",
              },
            ].map((item) => (
              <div key={item.step} className="flex flex-col gap-3">
                <span className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-sm font-semibold">
                  {item.step}
                </span>
                <h3 className="font-medium">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Game list */}
      <section className="border-t border-gray-800 px-6 py-20">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold text-center mb-12">
            Game yang tersedia
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              {
                name: "Spin Wheel",
                desc: "Roda putar untuk giveaway, challenge, atau hukuman seru.",
                price: "Rp25.000",
              },
              {
                name: "Tebak Kartu",
                desc: "Penonton menebak kartu yang akan dibalik streamer.",
                price: "Rp25.000",
              },
            ].map((game) => (
              <div
                key={game.name}
                className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex flex-col gap-2"
              >
                <div className="flex justify-between items-start">
                  <h3 className="font-medium">{game.name}</h3>
                  <span className="text-sm text-indigo-400">{game.price}</span>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">{game.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA bawah */}
      <section className="border-t border-gray-800 px-6 py-20 text-center">
        <h2 className="text-2xl font-semibold mb-4">Siap coba?</h2>
        <p className="text-gray-400 mb-6">Daftar gratis, tidak perlu kartu kredit.</p>
        <Link
          href="/auth/login"
          className="bg-indigo-600 hover:bg-indigo-500 px-8 py-3 rounded-xl font-medium transition"
        >
          Mulai Sekarang
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 px-6 py-6 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} StreamGame. Dibuat untuk streamer Indonesia.
      </footer>

    </div>
  );
}