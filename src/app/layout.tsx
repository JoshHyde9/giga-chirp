import type { Metadata } from "next";

import { Inter as FontSans } from "next/font/google";

import { cn } from "@/lib/utils";
import ReactQueryProvider from "@/lib/query-client";

import "./globals.css";

const fontSans = FontSans({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "mx-auto min-h-screen max-w-screen-2xl bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </body>
    </html>
  );
}
