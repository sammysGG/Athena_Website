import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import Header from "@/app/components/layout/Header";
import Footer from "@/app/components/layout/Footer";
import { Providers } from "@/providers/sessionProviders";

const manrope = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Government of the Republic of Estonia",
    template: "%s | Vabariigi Valitsus",
  },
  description:
    "Official news, statements and decisions of the Government of the Republic of Estonia.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={manrope.className}>
        <Providers>
          <Header />
          <main className="min-h-[60vh]">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
