import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import { Toaster } from "react-hot-toast";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MoneroPay",
  description: "Secure and Private Cryptocurrency Payments",
  icons: {
    icon: "/favicon.ico", // keep your favicon
  },
  openGraph: {
    title: "MoneroPay",
    description: "Secure and Private Cryptocurrency Payments",
    url: "https://yourdomain.com",
    siteName: "MoneroPay",
    images: [
      {
        url: "/tiny-og.png", // 👉 make a 32x32px or 1x1 transparent PNG
        width: 32,
        height: 32,
        alt: "MoneroPay",
      },
    ],
  },
  twitter: {
    card: "summary", // forces small preview
    title: "MoneroPay",
    description: "Secure and Private Cryptocurrency Payments",
    images: ["/tiny-og.png"], // same tiny image
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} antialiased bg-[url('/main-bg.webp')] bg-no-repeat bg-[length:220%] bg-pumpkin-900/95 bg-center`}
      >
        <Navbar />
        <main className="bg-gradient-to-b from-pumpkin-900 via-pumpkin-800 to-pumpkin-700">
          {children}
          <Toaster />
        </main>
        <Footer />
      </body>
    </html>
  );
}
