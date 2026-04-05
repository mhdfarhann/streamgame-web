import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"

export default async function StorePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/auth/login")

  const { data: games, error: gamesError } = await supabase
    .from("games")
    .select("*")
    .eq("is_active", true)

  const { data: purchases } = await supabase
    .from("purchases")
    .select("game_id")
    .eq("user_id", user.id)

  const { data: pendingOrders } = await supabase
    .from("orders")
    .select("game_id")
    .eq("user_id", user.id)
    .eq("status", "pending")

  const ownedGameIds = purchases?.map((p) => p.game_id) ?? []
  const pendingGameIds = pendingOrders?.map((o) => o.game_id) ?? []

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price)

  const gameIcons: Record<string, string> = {
    "spin-wheel": "🎰",
    "tebak-kartu": "🃏",
  }

  const gamePreviews: Record<string, { color: string; label: string }> = {
    "spin-wheel": { color: "rgba(108,92,231,0.15)", label: "Spin Wheel" },
    "tebak-kartu": { color: "rgba(253,203,110,0.1)", label: "Tebak Kartu" },
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", color: "#f0eeff", fontFamily: "'Rajdhani', sans-serif", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;800;900&family=Rajdhani:wght@300;400;500;600;700&display=swap');
        :root {
          --accent: #6c5ce7; --accent-light: #a29bfe; --accent-glow: rgba(108,92,231,0.25);
          --surface: #10101a; --panel: #14141f;
          --border: rgba(255,255,255,0.07); --border-hover: rgba(255,255,255,0.15);
          --muted: #8b8ba7; --dim: #4a4a62; --green: #00d68f; --amber: #fdcb6e; --text: #f0eeff;
        }
        .orb { font-family: 'Orbitron', sans-serif; }
        .logo-dot {
          width: 8px; height: 8px; background: var(--accent); border-radius: 50%;
          box-shadow: 0 0 10px var(--accent); display: inline-block;
          animation: pulse-dot 2.5s ease-in-out infinite;
        }
        @keyframes pulse-dot { 0%,100%{opacity:1;transform:scale(1);}50%{opacity:0.6;transform:scale(0.8);} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px);}to{opacity:1;transform:translateY(0);} }
        @keyframes spin-slow { from{transform:rotate(0deg);}to{transform:rotate(360deg);} }
        .page-fadeup { animation: fadeUp 0.5s ease both; }
        .nav-link {
          font-family: 'Rajdhani', sans-serif; font-size: 0.88rem; font-weight: 600;
          letter-spacing: 0.04em; color: var(--muted); text-decoration: none;
          display: inline-flex; align-items: center; gap: 0.3rem; transition: color 0.2s;
        }
        .nav-link:hover { color: var(--text); }
        .game-card {
          background: var(--surface); border: 1px solid var(--border); border-radius: 14px;
          display: flex; flex-direction: column; overflow: hidden;
          transition: border-color 0.25s, transform 0.2s; position: relative;
        }
        .game-card::after {
          content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, var(--accent), var(--accent-light));
          opacity: 0; transition: opacity 0.3s;
        }
        .game-card:hover { border-color: rgba(108,92,231,0.35); transform: translateY(-3px); }
        .game-card:hover::after { opacity: 1; }
        .game-preview {
          width: 100%; height: 140px; display: flex; align-items: center;
          justify-content: center; position: relative; overflow: hidden;
        }
        .preview-icon { font-size: 2.5rem; position: relative; z-index: 1; }
        .preview-spin { animation: spin-slow 12s linear infinite; }
        .preview-label {
          position: absolute; bottom: 0.6rem; left: 0.75rem;
          font-family: 'Orbitron', sans-serif; font-size: 0.52rem; font-weight: 700;
          letter-spacing: 0.1em; text-transform: uppercase; color: rgba(255,255,255,0.25);
        }
        .game-body { padding: 1.25rem 1.25rem 1.5rem; display: flex; flex-direction: column; gap: 0.75rem; flex: 1; }
        .game-name { font-family: 'Orbitron', sans-serif; font-weight: 800; font-size: 0.85rem; letter-spacing: 0.05em; text-transform: uppercase; color: var(--text); }
        .game-desc { font-family: 'Rajdhani', sans-serif; font-size: 0.92rem; font-weight: 500; color: var(--muted); line-height: 1.55; letter-spacing: 0.02em; flex: 1; }
        .game-price { font-family: 'Orbitron', sans-serif; font-weight: 900; font-size: 1rem; letter-spacing: 0.02em; color: var(--accent-light); }
        .badge-owned {
          font-family: 'Orbitron', sans-serif; font-size: 0.55rem; font-weight: 700;
          letter-spacing: 0.08em; text-transform: uppercase; padding: 0.2rem 0.6rem;
          border-radius: 4px; background: rgba(0,214,143,0.12); color: var(--green);
          border: 1px solid rgba(0,214,143,0.25);
        }
        .badge-pending {
          font-family: 'Orbitron', sans-serif; font-size: 0.55rem; font-weight: 700;
          letter-spacing: 0.08em; text-transform: uppercase; padding: 0.2rem 0.6rem;
          border-radius: 4px; background: rgba(253,203,110,0.1); color: var(--amber);
          border: 1px solid rgba(253,203,110,0.25);
        }
        .btn-buy {
          display: block; width: 100%; text-align: center;
          background: var(--accent); color: white;
          font-family: 'Orbitron', sans-serif; font-size: 0.65rem; font-weight: 700;
          letter-spacing: 0.08em; text-transform: uppercase;
          padding: 0.75rem 1rem; border-radius: 9px; text-decoration: none;
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
          border: none; cursor: pointer;
        }
        .btn-buy:hover { background: #7d6ff0; transform: translateY(-1px); box-shadow: 0 6px 20px var(--accent-glow); }
        .btn-owned {
          display: block; width: 100%; text-align: center;
          background: transparent; color: var(--muted);
          font-family: 'Orbitron', sans-serif; font-size: 0.62rem; font-weight: 700;
          letter-spacing: 0.08em; text-transform: uppercase;
          padding: 0.75rem 1rem; border-radius: 9px; text-decoration: none;
          border: 1px solid var(--border); transition: border-color 0.2s, color 0.2s;
        }
        .btn-owned:hover { border-color: var(--border-hover); color: var(--text); }
        .btn-disabled {
          display: block; width: 100%; text-align: center;
          background: var(--panel); color: var(--dim);
          font-family: 'Orbitron', sans-serif; font-size: 0.62rem; font-weight: 700;
          letter-spacing: 0.06em; text-transform: uppercase;
          padding: 0.75rem 1rem; border-radius: 9px;
          border: 1px solid var(--border); cursor: not-allowed; opacity: 0.6;
        }
        .section-label { font-family: 'Orbitron', sans-serif; font-size: 0.58rem; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: var(--accent-light); margin-bottom: 0.6rem; }
        .bg-orb { position: fixed; border-radius: 50%; filter: blur(100px); pointer-events: none; z-index: 0; }
        .bg-orb-1 { width: 500px; height: 500px; background: rgba(108,92,231,0.08); top: -150px; right: -100px; }
        .tag { font-family: 'Orbitron', sans-serif; font-size: 0.52rem; padding: 0.18rem 0.5rem; border-radius: 4px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; background: rgba(255,255,255,0.05); color: var(--dim); border: 1px solid var(--border); }
      `}</style>

      <div className="bg-orb bg-orb-1" />

      {/* NAV */}
      <nav style={{ position: "sticky", top: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem 2rem", background: "rgba(10,10,15,0.8)", backdropFilter: "blur(16px)", borderBottom: "1px solid var(--border)" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none" }}>
          <span className="logo-dot" />
          <span className="orb" style={{ fontWeight: 800, fontSize: "0.9rem", letterSpacing: "0.08em", color: "var(--text)" }}>StreamGame</span>
        </Link>
        <Link href="/dashboard" className="nav-link">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M8.5 3L4.5 7l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Dashboard
        </Link>
      </nav>

      {/* MAIN */}
      <main style={{ maxWidth: 860, margin: "0 auto", padding: "2.5rem 1.5rem 4rem", position: "relative", zIndex: 1 }}>

        {/* Header */}
        <div className="page-fadeup" style={{ marginBottom: "2.5rem" }}>
          <div className="section-label">Marketplace</div>
          <h1 className="orb" style={{ fontWeight: 900, fontSize: "clamp(1.4rem, 4vw, 2rem)", letterSpacing: "0.04em", color: "var(--text)", textTransform: "uppercase", marginBottom: "0.4rem" }}>Toko Game</h1>
          <p style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.92rem", color: "var(--muted)", fontWeight: 500, letterSpacing: "0.03em" }}>
            Beli sekali, pakai selamanya. Pembayaran via QRIS.
          </p>
        </div>

        {/* Error state */}
        {gamesError && (
          <div style={{ background: "rgba(255,107,107,0.08)", border: "1px solid rgba(255,107,107,0.2)", borderRadius: 12, padding: "1rem 1.25rem", marginBottom: "1.5rem" }}>
            <p className="orb" style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.1em", color: "#ff6b6b", textTransform: "uppercase" }}>Error: {gamesError.message}</p>
          </div>
        )}

        {/* Empty state */}
        {!games || games.length === 0 ? (
          <div style={{ background: "var(--surface)", border: "1px dashed rgba(255,255,255,0.1)", borderRadius: 14, padding: "4rem 1.5rem", textAlign: "center" }}>
            <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>🛍️</div>
            <p className="orb" style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", color: "var(--muted)", textTransform: "uppercase" }}>Belum Ada Game Tersedia</p>
          </div>
        ) : (
          <div className="page-fadeup" style={{ animationDelay: "0.1s", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.25rem" }}>
            {games.map((game) => {
              const isOwned = ownedGameIds.includes(game.id)
              const isPending = pendingGameIds.includes(game.id)
              const preview = gamePreviews[game.slug] ?? { color: "rgba(108,92,231,0.1)", label: game.slug }
              const icon = gameIcons[game.slug] ?? "🎮"

              return (
                <div key={game.id} className="game-card">
                  {/* Preview area */}
                  <div className="game-preview" style={{ background: preview.color }}>
                    {/* Decorative grid */}
                    <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
                    <div className={`preview-icon ${game.slug === "spin-wheel" ? "preview-spin" : ""}`}>{icon}</div>
                    <span className="preview-label">{preview.label}</span>
                    {/* Status badge overlay */}
                    {(isOwned || isPending) && (
                      <div style={{ position: "absolute", top: "0.75rem", right: "0.75rem" }}>
                        {isOwned ? <span className="badge-owned">Dimiliki</span> : <span className="badge-pending">Pending</span>}
                      </div>
                    )}
                  </div>

                  {/* Body */}
                  <div className="game-body">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.5rem" }}>
                      <div className="game-name">{game.name}</div>
                      {!isOwned && !isPending && (
                        <div className="game-price">{formatPrice(game.price)}</div>
                      )}
                    </div>

                    <p className="game-desc">{game.description}</p>

                    {/* Tags */}
                    <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                      <span className="tag">OBS Ready</span>
                      <span className="tag">No Coding</span>
                      {game.slug === "spin-wheel" && <span className="tag">Giveaway</span>}
                      {game.slug === "tebak-kartu" && <span className="tag">Chat</span>}
                    </div>

                    {/* CTA */}
                    {isOwned ? (
                      <Link href="/dashboard" className="btn-owned">
                        Lihat Widget →
                      </Link>
                    ) : isPending ? (
                      <div className="btn-disabled">Menunggu Konfirmasi</div>
                    ) : (
                      <Link href={`/dashboard/store/order/${game.id}`} className="btn-buy">
                        Beli — {formatPrice(game.price)}
                      </Link>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Info strip */}
        <div className="page-fadeup" style={{ animationDelay: "0.2s", marginTop: "2.5rem", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "0.75rem" }}>
          {[
            { icon: "⚡", title: "Instan Aktif", desc: "Langsung bisa dipakai setelah admin konfirmasi." },
            { icon: "🔒", title: "Bayar Sekali", desc: "Tidak ada biaya berulang atau langganan." },
            { icon: "📱", title: "Control di HP", desc: "Panel kontrol bisa dibuka dari smartphone." },
          ].map((item) => (
            <div key={item.title} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "1rem 1.1rem", display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
              <span style={{ fontSize: "1.1rem", flexShrink: 0, marginTop: "0.1rem" }}>{item.icon}</span>
              <div>
                <div className="orb" style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.08em", color: "var(--text)", textTransform: "uppercase", marginBottom: "0.25rem" }}>{item.title}</div>
                <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.82rem", color: "var(--muted)", fontWeight: 500, lineHeight: 1.5 }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>

      </main>
    </div>
  )
}