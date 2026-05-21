import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Navbar } from "@/components/ui/navbar";
// @ts-ignore
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "DevSolve — Problemas empresariales, soluciones reutilizables",
  description:
    "Ecosistema que conecta retos reales de negocio con soluciones de software reutilizables: marketplace, bounties y ejecución en la nube.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={inter.variable}>
      <body className={`${inter.className} min-h-screen antialiased`}>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
