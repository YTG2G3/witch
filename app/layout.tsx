import RootProvider from "@/components/root-provider";
import { inter, manrope } from "@/lib/fonts";
import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@nextui-org/react";

export const metadata: Metadata = {
  title: "Witch",
  description: "Decentralized streaming platform built with Cloudflare Calls.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(inter.variable, manrope.variable)}>
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
