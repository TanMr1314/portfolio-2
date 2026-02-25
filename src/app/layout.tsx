import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "谭亚军 | UI/UX Designer Portfolio",
  description: "UI/UX设计师作品集 - 7年工作经验，专注于UI设计、交互设计，精通Sketch、PS、AI、C4D等设计视觉软件",
  keywords: ["UI设计", "UX设计", "作品集", "Portfolio", "谭亚军", "设计师"],
  authors: [{ name: "谭亚军" }],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "谭亚军 | UI/UX Designer Portfolio",
    description: "UI/UX设计师作品集 - 7年工作经验",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
