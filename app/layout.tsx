import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "./components/navbar";
import Footer from "./components/footer";

const poppins = Poppins({
  weight: ["400", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MoneroPay",
  description: "Secure and Private Cryptocurrency Payments",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} antialiased bg-[url('/main-bg.webp')] bg-no-repeat bg-[length:220%]   bg-pumpkin-700/95 bg-center`}
      >
        <Navbar />
        <main className="bg-gradient-to-b from-pumpkin-900 via-pumpkin-800 to-pumpkin-700">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
