import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  metadataBase: new URL('https://gonzabenitez.github.io'),
  title: "Gonza Benitez | Automation & Full-Stack Developer",
  description: "Portfolio of Gonzalo Benitez, specializing in self-maintaining systems, automation, and high-end digital experiences.",
  keywords: ["Automation", "Python", "Full-Stack", "Next.js", "Portfolio"],
  authors: [{ name: "Gonzalo Benitez" }],
  // SEO for Social Media
  openGraph: {
    title: "Gonza Benitez | Automation Specialist",
    description: "Building the future of self-maintaining systems.",
    url: "https://gonzabenitez.github.io",
    siteName: "Gonza Benitez Portfolio",
    images: [
      {
        url: "/og-image.png", // We can generate this later or use a screenshot
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gonza Benitez | Automation Specialist",
    description: "Building the future of self-maintaining systems.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" style={{ colorScheme: 'dark' }}>
      <body className="bg-zinc-950 text-white antialiased selection:bg-cyan-500 selection:text-black">
        {children}
      </body>
    </html>
  );
}