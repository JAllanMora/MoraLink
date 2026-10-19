import type { Metadata } from "next";
import { Fraunces, Inter, Playfair_Display, Poppins } from "next/font/google";
import "./globals.css";

// Tipografías disponibles para la marca de cada negocio (theme.fontDisplay)
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const fraunces = Fraunces({ variable: "--font-fraunces", subsets: ["latin"] });
const playfair = Playfair_Display({ variable: "--font-playfair", subsets: ["latin"] });
const poppins = Poppins({ variable: "--font-poppins", subsets: ["latin"], weight: ["400", "600", "700"] });

export const metadata: Metadata = {
  title: "MoraLink",
  description: "Programas de lealtad digitales para tu negocio.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${fraunces.variable} ${playfair.variable} ${poppins.variable} h-full`}
    >
      <body className="min-h-full font-sans">{children}</body>
    </html>
  );
}
