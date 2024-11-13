import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "The Graph Networks",
  description: "Generated from The Graph Registry: https://github.com/graphprotocol/networks-registry",
  openGraph: {
    title: "The Graph Networks",
    description: "Explore The Graph Protocol's supported networks and their capabilities",
    url: "https://graph-networks-app.vercel.app",
    siteName: "The Graph Networks",
    images: [
      {
        url: "/og-preview.jpg",
        alt: "The Graph Networks Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Graph Networks",
    description: "Explore The Graph Protocol's supported networks and their capabilities",
    images: ["/og-preview.jpg"],
    creator: "@graphprotocol",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-800`}
      >
        {children}
      </body>
    </html>
  );
}
