// overlay/layout.tsx
export default function OverlayLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <head>
        <style>{`
          * { margin: 0; padding: 0; box-sizing: border-box; }
          html, body {
            background: transparent !important;
            background-color: rgba(0,0,0,0) !important;
            margin: 0;
            padding: 0;
            overflow: hidden;
            width: 100vw;
            height: 100vh;
          }
        `}</style>
      </head>
      <body style={{ background: "transparent", backgroundColor: "rgba(0,0,0,0)" }}>
        {children}
      </body>
    </html>
  )
}