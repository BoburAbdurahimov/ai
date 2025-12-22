import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Backup Management Dashboard",
  description: "AI Call Center MVP - Backup and Restore Management",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
          <nav className="border-b bg-white/50 backdrop-blur-sm dark:bg-slate-900/50">
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="text-2xl">📦</div>
                  <h1 className="text-xl font-bold">Backup Management</h1>
                </div>
                <nav className="flex items-center space-x-6">
                  <a href="/" className="text-sm font-medium hover:underline">
                    Dashboard
                  </a>
                  <a href="/backups" className="text-sm font-medium hover:underline">
                    Backups
                  </a>
                  <a href="/status" className="text-sm font-medium hover:underline">
                    Status
                  </a>
                </nav>
              </div>
            </div>
          </nav>
          <main className="container mx-auto px-4 py-8">
            {children}
          </main>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
