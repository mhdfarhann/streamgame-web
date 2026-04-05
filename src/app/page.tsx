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
    <div
      className="min-h-screen text-white"
      style={{
        fontFamily: "'Rajdhani', sans-serif",
        background: "#0a0a0f",
        overflowX: "hidden",
      }}
    >
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;800;900&family=Rajdhani:wght@300;400;500;600;700&display=swap');
        :root {
          --accent: #6c5ce7;
          --accent-light: #a29bfe;
          --accent-glow: rgba(108,92,231,0.25);
          --surface: #10101a;
          --panel: #14141f;
          --border: rgba(255,255,255,0.07);
          --border-hover: rgba(255,255,255,0.15);
          --muted: #8b8ba7;
          --dim: #4a4a62;
          --green: #00d68f;
          --amber: #fdcb6e;
        }
        .orb { font-family: 'Orbitron', sans-serif; letter-spacing: 0.04em; letter-spacing: 0.02em; }
        .logo-dot {
          width: 8px; height: 8px; background: var(--accent);
          border-radius: 50%; box-shadow: 0 0 10px var(--accent);
          animation: pulse-dot 2.5s ease-in-out infinite;
          display: inline-block;
        }
        .bg-orb {
          position: fixed; border-radius: 50%; filter: blur(120px);
          pointer-events: none; z-index: 0;
        }
        .bg-orb-1 {
          width: 600px; height: 600px; background: rgba(108,92,231,0.12);
          top: -200px; right: -150px; animation: drift 18s ease-in-out infinite alternate;
        }
        .bg-orb-2 {
          width: 400px; height: 400px; background: rgba(0,214,143,0.06);
          bottom: 20%; left: -100px; animation: drift 22s ease-in-out infinite alternate-reverse;
        }
        @keyframes drift {
          from { transform: translate(0,0) scale(1); }
          to { transform: translate(30px,40px) scale(1.08); }
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(0.8); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .spin-wheel-svg { animation: spin-slow 18s linear infinite; }
        .hero-badge { animation: fadeUp 0.7s ease both; }
        .hero-h1 { animation: fadeUp 0.7s 0.1s ease both; }
        .hero-sub { animation: fadeUp 0.7s 0.2s ease both; }
        .hero-ctas { animation: fadeUp 0.7s 0.3s ease both; }
        .hero-preview { animation: fadeUp 0.8s 0.4s ease both; }
        .btn-primary {
          display: inline-flex; align-items: center; gap: 0.5rem;
          background: var(--accent); color: white;
          font-size: 0.92rem; font-weight: 500; padding: 0.75rem 1.6rem;
          border-radius: 10px; text-decoration: none;
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
        }
        .btn-primary:hover { background: #7d6ff0; transform: translateY(-2px); box-shadow: 0 8px 32px var(--accent-glow); }
        .btn-secondary {
          display: inline-flex; align-items: center; gap: 0.5rem;
          background: transparent; color: var(--muted);
          font-size: 0.92rem; font-weight: 400; padding: 0.75rem 1.4rem;
          border-radius: 10px; text-decoration: none;
          border: 1px solid var(--border);
          transition: border-color 0.2s, color 0.2s, transform 0.15s;
        }
        .btn-secondary:hover { border-color: var(--border-hover); color: white; transform: translateY(-2px); }
        .step-card {
          background: var(--surface); padding: 2rem 1.75rem;
          display: flex; flex-direction: column; gap: 1rem;
          position: relative; overflow: hidden;
          transition: background 0.2s; cursor: default;
        }
        .step-card::before {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(135deg, var(--accent-glow) 0%, transparent 60%);
          opacity: 0; transition: opacity 0.3s;
        }
        .step-card:hover { background: #14141f; }
        .step-card:hover::before { opacity: 1; }
        .step-card:hover .step-num { color: var(--accent) !important; }
        .game-card {
          background: var(--surface); border: 1px solid var(--border);
          border-radius: 14px; padding: 1.75rem;
          display: flex; flex-direction: column; gap: 1rem;
          position: relative; overflow: hidden;
          transition: border-color 0.25s, transform 0.2s; cursor: pointer;
        }
        .game-card::after {
          content: ''; position: absolute; bottom: 0; left: 0; right: 0;
          height: 2px; background: linear-gradient(90deg, var(--accent), var(--accent-light));
          opacity: 0; transition: opacity 0.3s;
        }
        .game-card:hover { border-color: rgba(108,92,231,0.35); transform: translateY(-3px); }
        .game-card:hover::after { opacity: 1; }
        .tag {
          font-size: 0.65rem; padding: 0.2rem 0.55rem; border-radius: 5px;
          font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase;
          background: rgba(255,255,255,0.05); color: var(--dim);
          border: 1px solid var(--border);
        }
        .tag-purple { background: rgba(108,92,231,0.1); color: var(--accent-light); border-color: rgba(108,92,231,0.2); }
        .tag-amber { background: rgba(253,203,110,0.08); color: var(--amber); border-color: rgba(253,203,110,0.2); }
        .obs-spin-btn {
          background: var(--accent); color: white; border: none; border-radius: 7px;
          padding: 0.55rem; font-size: 0.72rem; font-weight: 600; cursor: pointer;
          width: 100%; letter-spacing: 0.02em; transition: background 0.2s; margin-top: auto;
        }
        .obs-spin-btn:hover { background: #7d6ff0; }
        .live-dot {
          width: 5px; height: 5px; background: var(--green);
          border-radius: 50%; animation: pulse-dot 1.5s ease infinite; display: inline-block;
        }
        .noise-overlay {
          position: fixed; inset: 0; pointer-events: none; z-index: 0; opacity: 0.6;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
        }
        .nav-cta {
          font-size: 0.82rem; font-weight: 500; color: white;
          background: var(--accent); padding: 0.5rem 1.1rem;
          border-radius: 8px; text-decoration: none; transition: background 0.2s, transform 0.15s;
        }
        .nav-cta:hover { background: #7d6ff0; transform: translateY(-1px); }
      `}</style>

      {/* Background */}
      <div className="noise-overlay" />
      <div className="bg-orb bg-orb-1" />
      <div className="bg-orb bg-orb-2" />

      {/* NAV */}
      <nav
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "1.1rem 2rem",
          background: "rgba(10,10,15,0.7)", backdropFilter: "blur(16px)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none", color: "white" }}>
          <span className="logo-dot" />
          <span className="orb" style={{ fontWeight: 800, fontSize: "1.15rem", letterSpacing: "-0.02em" }}>StreamGame</span>
        </Link>
        <Link href="/auth/login" className="nav-cta">Mulai Gratis</Link>
      </nav>

      {/* HERO */}
      <main
        style={{
          minHeight: "100vh", display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          textAlign: "center", padding: "8rem 1.5rem 5rem",
          position: "relative", zIndex: 1,
        }}
      >
        {/* Badge */}
        <div
          className="hero-badge"
          style={{
            display: "inline-flex", alignItems: "center", gap: "0.4rem",
            fontSize: "0.72rem", fontWeight: 500, letterSpacing: "0.1em",
            textTransform: "uppercase", color: "var(--accent-light)",
            background: "rgba(108,92,231,0.12)", border: "1px solid rgba(108,92,231,0.3)",
            padding: "0.35rem 0.9rem", borderRadius: 999, marginBottom: "2rem",
          }}
        >
          <span className="live-dot" />
          Game overlay untuk livestreamer Indonesia
        </div>

        {/* H1 */}
        <h1
          className="orb hero-h1"
          style={{
            fontWeight: 800, lineHeight: 1.06, letterSpacing: "-0.04em",
            maxWidth: 820, fontSize: "clamp(2.6rem, 7vw, 5.2rem)",
          }}
        >
          Jadikan streammu{" "}
          <span
            style={{
              display: "block",
              background: "linear-gradient(135deg, #a29bfe 0%, #c3b1fd 50%, #6c5ce7 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            panggung hiburan
          </span>
          yang nyata.
        </h1>

        {/* Subheading */}
        <p
          className="hero-sub"
          style={{
            fontSize: "1.05rem", color: "var(--muted)", maxWidth: 480,
            lineHeight: 1.65, margin: "1.5rem 0 2.5rem", fontWeight: 300,
          }}
        >
          Tambahkan game interaktif ke OBS dalam hitungan menit — tanpa coding, tanpa ribet. Penonton main, kamu jadi bintangnya.
        </p>

        {/* CTAs */}
        <div className="hero-ctas" style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", justifyContent: "center" }}>
          <Link href="/auth/login" className="btn-primary">
            Coba Gratis Sekarang
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2.5 7h9M7.5 3.5L11 7l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </Link>
          <Link href="#cara-pakai" className="btn-secondary">
            Lihat cara pakai
          </Link>
        </div>

        {/* OBS MOCKUP */}
        <div className="hero-preview" style={{ marginTop: "4rem", width: "100%", maxWidth: 760 }}>
          <div style={{ background: "#0d0d16", border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden" }}>
            {/* Title bar */}
            <div style={{ background: "#0a0a12", padding: "0.6rem 1rem", display: "flex", alignItems: "center", gap: "0.5rem", borderBottom: "1px solid var(--border)" }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff5f57" }} />
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#febc2e" }} />
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#28c840" }} />
              <span style={{ marginLeft: "auto", fontSize: "0.68rem", color: "var(--dim)", letterSpacing: "0.06em", fontWeight: 500, textTransform: "uppercase" }}>OBS Studio — StreamGame Overlay</span>
            </div>
            {/* Body */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 220px", minHeight: 280 }}>
              {/* Stream preview */}
              <div style={{ background: "linear-gradient(145deg,#0f0f1e,#141428)", position: "relative", display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: "1rem", left: "1rem", fontSize: "0.65rem", background: "rgba(0,214,143,0.15)", color: "var(--green)", padding: "0.2rem 0.6rem", borderRadius: 999, border: "1px solid rgba(0,214,143,0.25)", fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                  <span className="live-dot" /> Live
                </div>
                {/* Spin Wheel */}
                <div style={{ position: "relative", width: 160, height: 160 }}>
                  <div style={{ position: "absolute", top: -6, left: "50%", transform: "translateX(-50%)", width: 0, height: 0, borderLeft: "8px solid transparent", borderRight: "8px solid transparent", borderTop: "18px solid white", filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.6))", zIndex: 2 }} />
                  <svg width="160" height="160" viewBox="0 0 160 160" className="spin-wheel-svg">
                    <defs><clipPath id="circle-clip"><circle cx="80" cy="80" r="76"/></clipPath></defs>
                    <g clipPath="url(#circle-clip)">
                      <path d="M80 80 L80 4 A76 76 0 0 1 147.8 57 Z" fill="#6c5ce7"/>
                      <path d="M80 80 L147.8 57 A76 76 0 0 1 147.8 103 Z" fill="#a29bfe"/>
                      <path d="M80 80 L147.8 103 A76 76 0 0 1 80 156 Z" fill="#fdcb6e"/>
                      <path d="M80 80 L80 156 A76 76 0 0 1 12.2 103 Z" fill="#00d68f"/>
                      <path d="M80 80 L12.2 103 A76 76 0 0 1 12.2 57 Z" fill="#fd79a8"/>
                      <path d="M80 80 L12.2 57 A76 76 0 0 1 80 4 Z" fill="#e17055"/>
                    </g>
                    <g stroke="rgba(255,255,255,0.18)" strokeWidth="1.5">
                      <line x1="80" y1="80" x2="80" y2="4"/>
                      <line x1="80" y1="80" x2="147.8" y2="57"/>
                      <line x1="80" y1="80" x2="147.8" y2="103"/>
                      <line x1="80" y1="80" x2="80" y2="156"/>
                      <line x1="80" y1="80" x2="12.2" y2="103"/>
                      <line x1="80" y1="80" x2="12.2" y2="57"/>
                    </g>
                    <circle cx="80" cy="80" r="14" fill="#0a0a0f"/>
                    <circle cx="80" cy="80" r="6" fill="#6c5ce7"/>
                  </svg>
                </div>
              </div>
              {/* Control panel */}
              <div style={{ background: "#0c0c18", borderLeft: "1px solid var(--border)", padding: "1rem", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                <div className="orb" style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--dim)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.2rem" }}>Control Panel</div>
                {[
                  { name: "Spin Wheel", sub: "6 segmen aktif", badge: "Aktif", badgeColor: "rgba(0,214,143,0.15)", badgeText: "#00d68f" },
                  { name: "Tebak Kartu", sub: "Siap dimainkan", badge: "Owned", badgeColor: "rgba(108,92,231,0.15)", badgeText: "#a29bfe" },
                ].map((item) => (
                  <div key={item.name} style={{ background: "var(--panel)", border: "1px solid var(--border)", borderRadius: 7, padding: "0.55rem 0.75rem", fontSize: "0.72rem", color: "var(--muted)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>
                      <div style={{ color: "white", fontWeight: 500, fontSize: "0.73rem" }}>{item.name}</div>
                      <div style={{ fontSize: "0.62rem", color: "var(--dim)", marginTop: 1 }}>{item.sub}</div>
                    </div>
                    <span style={{ fontSize: "0.6rem", padding: "0.15rem 0.45rem", borderRadius: 4, fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase", background: item.badgeColor, color: item.badgeText }}>{item.badge}</span>
                  </div>
                ))}
                <div style={{ borderTop: "1px solid var(--border)", paddingTop: "0.6rem", marginTop: "0.2rem" }}>
                  <div style={{ fontSize: "0.62rem", color: "var(--muted)", marginBottom: "0.4rem" }}>Segmen terakhir</div>
                  <div style={{ fontSize: "0.78rem", color: "var(--accent-light)", fontWeight: 600 }}>🎉 Giveaway!</div>
                </div>
                <button className="obs-spin-btn">🎰 Putar Sekarang</button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* STATS */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "2.5rem", padding: "3rem 1.5rem", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", flexWrap: "wrap", position: "relative", zIndex: 1 }}>
        {[
          { val: "2K+", label: "Streamer aktif" },
          null,
          { val: "#1", label: "Game overlay Indonesia" },
          null,
          { val: "5min", label: "Setup ke OBS" },
          null,
          { val: "0", label: "Baris kode dibutuhkan" },
        ].map((item, i) =>
          item === null ? (
            <div key={i} style={{ width: 1, height: 40, background: "var(--border)" }} />
          ) : (
            <div key={i} style={{ textAlign: "center" }}>
              <div className="orb" style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.04em", color: "var(--accent-light)", lineHeight: 1 }}>{item.val}</div>
              <div style={{ fontSize: "0.75rem", color: "var(--muted)", marginTop: "0.3rem", letterSpacing: "0.03em" }}>{item.label}</div>
            </div>
          )
        )}
      </div>

      {/* CARA PAKAI */}
      <section id="cara-pakai" style={{ position: "relative", zIndex: 1 }}>
        <div style={{ padding: "6rem 1.5rem", maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--accent-light)", marginBottom: "0.8rem" }}>Cara pakai</div>
          <h2 className="orb" style={{ fontWeight: 800, letterSpacing: "-0.035em", color: "white", lineHeight: 1.1, marginBottom: "3.5rem", fontSize: "clamp(1.6rem,4vw,2.5rem)" }}>
            3 langkah,<br />langsung live.
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: "1.5px", background: "var(--border)", border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden" }}>
            {[
              { num: "01", icon: "🛍️", title: "Daftar & beli game", desc: "Pilih game overlay favoritmu dari toko. Satu kali bayar, pakai selamanya." },
              { num: "02", icon: "🔗", title: "Paste link ke OBS", desc: "Copy link widget unikmu. Tambahkan sebagai Browser Source di OBS — selesai." },
              { num: "03", icon: "🎮", title: "Main saat live", desc: "Buka control panel di HP. Pencet tombol — game langsung bereaksi di stream detik itu juga." },
            ].map((item) => (
              <div key={item.num} className="step-card">
                <div className="orb step-num" style={{ fontSize: "3rem", fontWeight: 800, letterSpacing: "-0.06em", color: "var(--dim)", lineHeight: 1, transition: "color 0.2s" }}>{item.num}</div>
                <div style={{ width: 38, height: 38, background: "rgba(108,92,231,0.1)", border: "1px solid rgba(108,92,231,0.2)", borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem" }}>{item.icon}</div>
                <div className="orb" style={{ fontWeight: 700, fontSize: "1rem", color: "white", letterSpacing: "-0.02em" }}>{item.title}</div>
                <div style={{ fontSize: "0.83rem", color: "var(--muted)", lineHeight: 1.65 }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GAMES */}
      <section style={{ position: "relative", zIndex: 1 }}>
        <div style={{ padding: "5rem 1.5rem", maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--accent-light)", marginBottom: "0.8rem" }}>Game tersedia</div>
          <h2 className="orb" style={{ fontWeight: 800, letterSpacing: "-0.035em", color: "white", lineHeight: 1.1, marginBottom: "2.5rem", fontSize: "clamp(1.6rem,4vw,2.5rem)" }}>Pilih senjatamu.</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: "1.25rem" }}>
            {[
              {
                icon: "🎰", iconBg: "rgba(108,92,231,0.15)",
                name: "Spin Wheel", price: "Rp25.000",
                desc: "Roda putar dinamis untuk giveaway, challenge, hukuman seru, atau apapun yang kamu mau. Segmen bisa diubah kapan saja.",
                tags: [{ label: "Giveaway", cls: "tag-purple" }, { label: "Challenge", cls: "tag-purple" }, { label: "Interaktif", cls: "" }],
              },
              {
                icon: "🃏", iconBg: "rgba(253,203,110,0.12)",
                name: "Tebak Kartu", price: "Rp25.000",
                desc: "Penonton tebak kartu apa yang akan dibalik streamer. Sederhana, adiktif, dan bikin chat ramai terus.",
                tags: [{ label: "Tebak-tebakan", cls: "tag-amber" }, { label: "Chat", cls: "tag-amber" }, { label: "Ramai", cls: "" }],
              },
            ].map((game) => (
              <div key={game.name} className="game-card">
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem" }}>
                  <div style={{ width: 44, height: 44, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.3rem", flexShrink: 0, background: game.iconBg }}>{game.icon}</div>
                  <div style={{ textAlign: "right" }}>
                    <div className="orb" style={{ fontSize: "1rem", fontWeight: 700, color: "white", letterSpacing: "-0.02em", whiteSpace: "nowrap" }}>{game.price}</div>
                    <span style={{ fontSize: "0.65rem", color: "var(--muted)", fontWeight: 400, letterSpacing: "0.05em", textTransform: "uppercase", display: "block", marginTop: "0.15rem" }}>sekali bayar</span>
                  </div>
                </div>
                <div>
                  <div className="orb" style={{ fontWeight: 700, fontSize: "1.1rem", color: "white", letterSpacing: "-0.025em", marginBottom: "0.5rem" }}>{game.name}</div>
                  <div style={{ fontSize: "0.82rem", color: "var(--muted)", lineHeight: 1.65 }}>{game.desc}</div>
                </div>
                <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                  {game.tags.map((t) => (
                    <span key={t.label} className={`tag ${t.cls}`}>{t.label}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "7rem 1.5rem", textAlign: "center", borderTop: "1px solid var(--border)", position: "relative", zIndex: 1, overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 600, height: 300, background: "radial-gradient(ellipse, rgba(108,92,231,0.15) 0%, transparent 70%)", pointerEvents: "none" }} />
        <h2 className="orb" style={{ fontWeight: 800, letterSpacing: "-0.04em", marginBottom: "1rem", lineHeight: 1.08, fontSize: "clamp(2rem,6vw,3.5rem)" }}>
          Siap bikin<br />stream yang gak terlupakan?
        </h2>
        <p style={{ fontSize: "1rem", color: "var(--muted)", marginBottom: "2.5rem", fontWeight: 300 }}>Gratis daftar. Tidak perlu kartu kredit.</p>
        <Link href="/auth/login" className="btn-primary" style={{ fontSize: "1rem", padding: "0.9rem 2rem" }}>
          Mulai Sekarang
          <svg width="16" height="16" viewBox="0 0 14 14" fill="none"><path d="M2.5 7h9M7.5 3.5L11 7l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </Link>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: "1px solid var(--border)", padding: "1.75rem 2rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem", position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
          <span className="logo-dot" style={{ width: 6, height: 6 }} />
          <span className="orb" style={{ fontWeight: 700, fontSize: "0.85rem", letterSpacing: "-0.01em" }}>StreamGame</span>
        </div>
        <div style={{ fontSize: "0.72rem", color: "var(--dim)" }}>
          © {new Date().getFullYear()} StreamGame · Dibuat dengan ❤️ untuk streamer Indonesia
        </div>
      </footer>
    </div>
  );
}