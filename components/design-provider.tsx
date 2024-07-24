"use client";

import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider } from "next-themes";
import { useRouter } from "next/navigation";
import { Toaster } from "react-hot-toast";

export default function DesignProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const router = useRouter();

  return (
    <NextUIProvider navigate={router.push}>
      <ThemeProvider attribute="class" defaultTheme="dark">
        <Toaster />

        <main>{children}</main>
      </ThemeProvider>
    </NextUIProvider>
  );
}
