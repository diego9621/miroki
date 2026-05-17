import type { Metadata } from "next";
import { Geist, Shippori_Mincho } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const shipporiMincho = Shippori_Mincho({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-shippori",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Miroki — Stop Rebuilding. Start Finishing.",
  description: "AI lets you build anything. Miroki helps you finish something. Lock your MVP, stack and execution path so you can ship.",
  icons: { icon: "/favicon.svg" },
  verification: {
    google: "KEeQL2vgIjrGhF-PwKOtdtLYeu3i7nuNxxTznpi2XZM",
  },
  openGraph: {
    title: "Miroki — Stop Rebuilding. Start Finishing.",
    description: "AI lets you build anything. Miroki helps you finish something. Lock your MVP, stack and execution path so you can ship.",
    url: "https://www.miroki.app",
    siteName: "Miroki",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Miroki — Stop Rebuilding. Start Finishing.",
    description: "AI lets you build anything. Miroki helps you finish something.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Miroki",
  applicationCategory: "ProductivityApplication",
  operatingSystem: "Web",
  url: "https://www.miroki.app",
  description:
    "Miroki helps AI builders lock their MVP, stack and execution path so they can finish what they start.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geist.variable} ${shipporiMincho.variable}`} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />

        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const t = localStorage.getItem('miroki-theme') || 'dark';
                document.documentElement.setAttribute('data-theme', t);
              } catch(e) {}
            `,
          }}
        />
      </head>

      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}