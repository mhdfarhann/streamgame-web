import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/auth/login")

  const { data: userData } = await supabase
    .from("users")
    .select("name, plan")
    .eq("id", user.id)
    .single()

  const { data: widgets } = await supabase
    .from("widgets")
    .select("*, games(name, slug)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  const firstName = userData?.name?.split(" ")[0] ?? "Streamer"

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", color: "#f0eeff", fontFamily: "'Rajdhani', sans-serif", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;800;900&family=Rajdhani:wght@300;400;500;600;700&display=swap');
        :root {
          --accent: #6c5ce7; --accent-light: #a29bfe; --accent-glow: rgba(108,92,231,0.25);
          --surface: #10101a; --panel: #14141f;
          --border: rgba(255,255,255,0.07); --border-hover: rgba(255,255,255,0.15);
          --muted: #8b8ba7; --dim: #4a4a62; --green: #00d68f; --amber: #fdcb6e;
          --text: #f0eeff;
        }
        .orb { font-family: 'Orbitron', sans-serif; }
        .logo-dot {
          width: 8px; height: 8px; background: var(--accent); border-radius: 50%;
          box-shadow: 0 0 10px var(--accent); display: inline-block;
          animation: pulse-dot 2.5s ease-in-out infinite;
        }
        @keyframes pulse-dot { 0%,100%{opacity:1;transform:scale(1);}50%{opacity:0.6;transform:scale(0.8);} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px);}to{opacity:1;transform:translateY(0);} }
        .page-fadeup { animation: fadeUp 0.5s ease both; }
        .widget-row {
          background: var(--surface); border: 1px solid var(--border); border-radius: 12px;
          padding: 1.1rem 1.25rem; display: flex; justify-content: space-between;
          align-items: center; gap: 1rem;
          transition: border-color 0.2s, background 0.2s;
          position: relative; overflow: hidden;
        }
        .widget-row::before {
          content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 3px;
          background: linear-gradient(180deg, var(--accent), var(--accent-light));
          opacity: 0; transition: opacity 0.2s;
        }
        .widget-row:hover { border-color: rgba(108,92,231,0.3); background: #13131f; }
        .widget-row:hover::before { opacity: 1; }
        .btn-primary {
          display: inline-flex; align-items: center; gap: 0.4rem;
          background: var(--accent); color: white;
          font-family: 'Orbitron', sans-serif; font-size: 0.65rem; font-weight: 700;
          letter-spacing: 0.08em; text-transform: uppercase;
          padding: 0.55rem 1rem; border-radius: 8px; text-decoration: none;
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
          border: none; cursor: pointer;
        }
        .btn-primary:hover { background: #7d6ff0; transform: translateY(-1px); box-shadow: 0 6px 20px var(--accent-glow); }
        .btn-ghost {
          display: inline-flex; align-items: center; gap: 0.4rem;
          background: var(--panel); color: var(--muted);
          font-family: 'Rajdhani', sans-serif; font-size: 0.85rem; font-weight: 600;
          letter-spacing: 0.04em; padding: 0.5rem 0.9rem; border-radius: 8px;
          text-decoration: none; border: 1px solid var(--border);
          transition: border-color 0.2s, color 0.2s, background 0.2s;
        }
        .btn-ghost:hover { border-color: var(--border-hover); color: var(--text); background: #1a1a2e; }
        .btn-live {
          display: inline-flex; align-items: center; gap: 0.4rem;
          background: var(--accent); color: white;
          font-family: 'Orbitron', sans-serif; font-size: 0.6rem; font-weight: 700;
          letter-spacing: 0.08em; text-transform: uppercase;
          padding: 0.5rem 0.9rem; border-radius: 8px; text-decoration: none;
          transition: background 0.2s, box-shadow 0.2s;
        }
        .btn-live:hover { background: #7d6ff0; box-shadow: 0 4px 16px var(--accent-glow); }
        .plan-badge {
          font-family: 'Orbitron', sans-serif; font-size: 0.55rem; font-weight: 700;
          letter-spacing: 0.1em; text-transform: uppercase;
          padding: 0.2rem 0.6rem; border-radius: 4px;
        }
        .plan-free { background: rgba(255,255,255,0.06); color: var(--muted); border: 1px solid var(--border); }
        .plan-pro { background: rgba(108,92,231,0.15); color: var(--accent-light); border: 1px solid rgba(108,92,231,0.3); }
        .live-dot {
          width: 5px; height: 5px; background: var(--green); border-radius: 50%;
          animation: pulse-dot 1.5s ease infinite; display: inline-block;
        }
        .section-label {
          font-family: 'Orbitron', sans-serif; font-size: 0.58rem; font-weight: 700;
          letter-spacing: 0.14em; text-transform: uppercase; color: var(--accent-light);
          margin-bottom: 0.75rem;
        }
        .empty-state {
          background: var(--surface); border: 1px dashed rgba(255,255,255,0.1);
          border-radius: 14px; padding: 3.5rem 1.5rem; text-align: center;
        }
        .nav-link {
          font-family: 'Rajdhani', sans-serif; font-size: 0.88rem; font-weight: 600;
          letter-spacing: 0.04em; color: var(--muted); text-decoration: none;
          transition: color 0.2s;
        }
        .nav-link:hover { color: var(--text); }
        .logout-btn {
          font-family: 'Rajdhani', sans-serif; font-size: 0.88rem; font-weight: 600;
          letter-spacing: 0.04em; color: var(--muted); background: none; border: none;
          cursor: pointer; transition: color 0.2s; padding: 0;
        }
        .logout-btn:hover { color: #ff6b6b; }
        .mono-path {
          font-family: 'Orbitron', sans-serif; font-size: 0.52rem; font-weight: 400;
          color: var(--dim); letter-spacing: 0.06em; margin-top: 0.35rem;
          text-overflow: ellipsis; overflow: hidden; white-space: nowrap; max-width: 200px;
        }
        .bg-orb { position: fixed; border-radius: 50%; filter: blur(100px); pointer-events: none; z-index: 0; }
        .bg-orb-1 { width: 500px; height: 500px; background: rgba(108,92,231,0.08); top: -150px; right: -100px; }
        .bg-orb-2 { width: 300px; height: 300px; background: rgba(0,214,143,0.04); bottom: 10%; left: -80px; }
      `}</style>

      <div className="bg-orb bg-orb-1" />
      <div className="bg-orb bg-orb-2" />

      {/* NAV */}
      <nav style={{ position: "sticky", top: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem 2rem", background: "rgba(10,10,15,0.8)", backdropFilter: "blur(16px)", borderBottom: "1px solid var(--border)" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none" }}>
          <span className="logo-dot" />
          <span className="orb" style={{ fontWeight: 800, fontSize: "0.9rem", letterSpacing: "0.08em", color: "var(--text)" }}>StreamGame</span>
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
          <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.82rem", color: "var(--dim)", letterSpacing: "0.02em" }} className="hidden sm:block">{user.email}</span>
          <form action="/auth/logout" method="POST">
            <button className="logout-btn">Logout</button>
          </form>
        </div>
      </nav>

      {/* MAIN */}
      <main style={{ maxWidth: 860, margin: "0 auto", padding: "2.5rem 1.5rem 4rem", position: "relative", zIndex: 1 }}>

        {/* Header */}
        <div className="page-fadeup" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2.5rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
              <h1 className="orb" style={{ fontWeight: 900, fontSize: "clamp(1.4rem, 4vw, 2rem)", letterSpacing: "0.04em", color: "var(--text)", textTransform: "uppercase" }}>
                Halo, {firstName}
              </h1>
              <span className={`plan-badge ${userData?.plan === "pro" ? "plan-pro" : "plan-free"}`}>
                {userData?.plan ?? "free"}
              </span>
            </div>
            <p style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.9rem", color: "var(--muted)", letterSpacing: "0.03em", fontWeight: 500 }}>
              Kelola widget overlay streammu dari sini.
            </p>
          </div>
          <Link href="/dashboard/store" className="btn-primary">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
            Beli Game
          </Link>
        </div>

        {/* Widget section */}
        <section className="page-fadeup" style={{ animationDelay: "0.1s" }}>
          <div className="section-label">Widget Saya</div>

          {widgets && widgets.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {widgets.map((w: any) => (
                <div key={w.id} className="widget-row">
                  {/* Game icon */}
                  <div style={{ width: 40, height: 40, borderRadius: 9, background: "rgba(108,92,231,0.12)", border: "1px solid rgba(108,92,231,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem", flexShrink: 0 }}>
                    {w.games?.slug === "spin-wheel" ? "🎰" : "🃏"}
                  </div>
                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "1rem", letterSpacing: "0.02em", color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{w.name}</p>
                    <p style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.82rem", color: "var(--muted)", fontWeight: 500 }}>{w.games?.name}</p>
                    <div className="mono-path">/overlay/{w.id}</div>
                  </div>
                  {/* Live dot */}
                  <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", flexShrink: 0 }}>
                    <span className="live-dot" />
                    <span style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "0.52rem", color: "var(--green)", fontWeight: 700, letterSpacing: "0.08em" }}>READY</span>
                  </div>
                  {/* Actions */}
                  <div style={{ display: "flex", gap: "0.5rem", flexShrink: 0 }}>
                    <Link href={`/dashboard/widgets/${w.id}`} className="btn-ghost">Kelola</Link>
                    <Link href={`/control/${w.id}`} target="_blank" className="btn-live">
                      <span className="live-dot" style={{ width: 4, height: 4 }} />
                      Live
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>🎮</div>
              <p className="orb" style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.1em", color: "var(--muted)", textTransform: "uppercase", marginBottom: "0.5rem" }}>Belum Ada Widget</p>
              <p style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.9rem", color: "var(--dim)", marginBottom: "1.5rem", fontWeight: 500 }}>Beli game pertamamu dan mulai streaming sekarang.</p>
              <Link href="/dashboard/store" className="btn-primary">
                Beli Game Pertama
                <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><path d="M2.5 7h9M7.5 3.5L11 7l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </Link>
            </div>
          )}
        </section>

        {/* Quick tip */}
        {widgets && widgets.length > 0 && (
          <div className="page-fadeup" style={{ animationDelay: "0.2s", marginTop: "2rem", background: "rgba(108,92,231,0.06)", border: "1px solid rgba(108,92,231,0.15)", borderRadius: 12, padding: "1rem 1.25rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <span style={{ fontSize: "1rem", flexShrink: 0 }}>💡</span>
            <p style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.88rem", color: "var(--muted)", fontWeight: 500, letterSpacing: "0.02em" }}>
              Copy link <span style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "0.72rem", color: "var(--accent-light)" }}>/overlay/[id]</span> dan tambahkan sebagai <strong style={{ color: "var(--text)", fontWeight: 600 }}>Browser Source</strong> di OBS untuk mulai streaming.
            </p>
          </div>
        )}

      </main>
    </div>
  )
}