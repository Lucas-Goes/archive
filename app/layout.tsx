import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";

const lexend = localFont({
  src: "../public/fonts/lexend.woff2",
  variable: "--font-lexend",
  weight: "100 900",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt">
      <body
       className={`
          ${geistSans.variable} 
          ${geistMono.variable} 
          ${lexend.variable} 
          antialiased`
        }
      >
        {children}
      </body>
    </html>
  );
}