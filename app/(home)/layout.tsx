import Nav from "./nav";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-screen w-screen grid grid-rows-screen">
      <Nav />
      <main className="no-scrollbar overflow-auto">{children}</main>
    </div>
  );
}
