import type { Metadata } from "next";
import localFont from "next/font/local";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ProfileInit from "./profile-init";
import { Toaster } from "../components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const geom = localFont({
  src: [
    { path: '../public/fonts/Geom-Light.ttf', weight: '300', style: 'normal' },
    { path: '../public/fonts/Geom-LightItalic.ttf', weight: '300', style: 'italic' },
    { path: '../public/fonts/Geom-Regular.ttf', weight: '400', style: 'normal' },
    { path: '../public/fonts/Geom-Italic.ttf', weight: '400', style: 'italic' },
    { path: '../public/fonts/Geom-Medium.ttf', weight: '500', style: 'normal' },
    { path: '../public/fonts/Geom-MediumItalic.ttf', weight: '500', style: 'italic' },
    { path: '../public/fonts/Geom-SemiBold.ttf', weight: '600', style: 'normal' },
    { path: '../public/fonts/Geom-SemiBoldItalic.ttf', weight: '600', style: 'italic' },
    { path: '../public/fonts/Geom-Bold.ttf', weight: '700', style: 'normal' },
    { path: '../public/fonts/Geom-BoldItalic.ttf', weight: '700', style: 'italic' },
    { path: '../public/fonts/Geom-ExtraBold.ttf', weight: '800', style: 'normal' },
    { path: '../public/fonts/Geom-ExtraBoldItalic.ttf', weight: '800', style: 'italic' },
    { path: '../public/fonts/Geom-Black.ttf', weight: '900', style: 'normal' },
    { path: '../public/fonts/Geom-BlackItalic.ttf', weight: '900', style: 'italic' },
  ],
  variable: "--font-geom",
  display: "swap",
});

export const metadata: Metadata = {
  title: 'LoopSync One Window',
  description: 'A cloud based single, intelligent framework that sees, understands, and reasons across anything you face — from complex calculations to intricate code and more.',
  generator: 'intellaris.co',
  icons: {
    icon: '/icon.svg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${geom.variable} antialiased`}
      >
        <ProfileInit />
        {children}
        <Toaster />
      </body>
    </html>
  );
}



