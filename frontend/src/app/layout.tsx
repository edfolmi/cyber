import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Space_Mono } from "next/font/google";
import ClerkAppProvider from "@/components/ClerkAppProvider";
import SiteHeader from "@/components/SiteHeader";
import "./globals.css";

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-space-mono",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Read-through: Python security review",
  description:
    "A calm place to pass your Python through structured security review: clear findings, sensible severity, and language you can share with your team.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${spaceMono.variable} ${inter.variable} ${jetbrainsMono.variable}`}
      >
        <ClerkAppProvider>
          <header className="border-b border-line bg-surface-solid">
            <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-3.5 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="font-robot text-lg font-bold tracking-tight text-ink sm:text-xl">
                  READ-THROUGH
                </p>
                <p className="mt-1 font-robot text-[0.6rem] font-normal uppercase tracking-[0.35em] text-ink-muted">
                  PYTHON · SEC REVIEW
                </p>
              </div>
              <SiteHeader />
            </div>
          </header>
          {children}
        </ClerkAppProvider>
      </body>
    </html>
  );
}
