import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Miroki",
  description: "Ship calm. Step by step.",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={geist.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{
          __html: `
            try {
              const t = localStorage.getItem('miroki-theme') || 'dark';
              document.documentElement.setAttribute('data-theme', t);
            } catch(e) {}
          `
        }} />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}