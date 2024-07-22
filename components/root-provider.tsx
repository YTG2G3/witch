"use client";

import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider } from "next-themes";
import { useRouter } from "next/navigation";

export default function RootProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const router = useRouter();

  return (
    <NextUIProvider navigate={router.push}>
      <ThemeProvider attribute="class" defaultTheme="dark">
        <main className="no-scrollbar overflow-auto">{children}</main>
      </ThemeProvider>
    </NextUIProvider>
  );
}
