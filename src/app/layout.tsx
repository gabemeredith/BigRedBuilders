import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Big Red Rankings — Who's more cracked?",
  description:
    "Vote head-to-head on who's more cracked at Cornell. A playful social ranking game.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Navbar />
        <main className="flex flex-1 flex-col mx-auto w-full max-w-5xl px-6">
          {children}
        </main>
      </body>
    </html>
  );
}
