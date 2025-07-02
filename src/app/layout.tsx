import type { Metadata } from "next";
import { Geist, Geist_Mono, Gowun_Batang } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const gowunBatang = Gowun_Batang({
  variable: "--font-gowun-batang",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Fig.1 | Shaping the Future of Advertising with AI Innovation",
  description: "Fig.1 is a leading advertising agency specializing in AI-powered marketing strategies, creative campaigns, and cutting-edge digital experiences. Transform your brand with innovative solutions.",
  keywords: "advertising agency, AI marketing, digital advertising, creative campaigns, brand strategy, marketing innovation, Fig.1, AI advertising",
  authors: [{ name: "Fig.1 Team" }],
  creator: "Fig.1",
  publisher: "Fig.1",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://fig1.com'), // Update with your actual domain
  icons: {
    icon: '/Fig1_Finallogo.png',
    shortcut: '/Fig1_Finallogo.png',
    apple: '/Fig1_Finallogo.png',
  },
  manifest: '/site.webmanifest',
  themeColor: '#D959B3',
  openGraph: {
    title: "Fig.1 | Shaping the Future of Advertising with AI Innovation",
    description: "Transform your brand with AI-powered marketing strategies and cutting-edge digital experiences from Fig.1's team of strategists, creatives, and technologists.",
    url: 'https://fig1.com',
    siteName: 'Fig.1',
    images: [
      {
        url: '/Fig1_Finallogo.png',
        width: 1200,
        height: 630,
        alt: 'Fig.1 - AI-Powered Advertising Agency',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Fig.1 | AI-Powered Advertising Agency",
    description: "Transform your brand with innovative AI marketing strategies and creative campaigns.",
    images: ['/Fig1_Finallogo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
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
        className={`${geistSans.variable} ${geistMono.variable} ${gowunBatang.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
