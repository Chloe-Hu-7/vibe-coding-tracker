import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { StateProvider } from "@/components/StateProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "VibeCoding 学习打卡助手",
  description: "21天VibeCoding学习打卡，AI辅助编程学习",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={`${inter.className} min-h-screen bg-gray-50`}>
        <StateProvider>
          <Navbar />
          <main className="max-w-5xl mx-auto px-4 py-6">
            {children}
          </main>
        </StateProvider>
      </body>
    </html>
  );
}
