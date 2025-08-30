import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AuthProvider } from "@/components/providers/auth-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RoadGuard - AI-Powered Roadside Assistance",
  description: "Get instant roadside assistance with our AI-powered platform. Professional mechanics arrive in minutes, not hours. Track everything in real-time.",
  keywords: "roadside assistance, emergency help, car breakdown, mechanic, towing, battery jump, tire change",
  authors: [{ name: "RoadGuard Team" }],
  openGraph: {
    title: "RoadGuard - AI-Powered Roadside Assistance",
    description: "Emergency help when you need it most. Professional roadside assistance with real-time tracking.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "RoadGuard - AI-Powered Roadside Assistance",
    description: "Emergency help when you need it most. Professional roadside assistance with real-time tracking.",
  },
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <Header />
          <main className="pt-16">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
