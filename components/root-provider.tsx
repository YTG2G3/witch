import AuthProvider from "./auth-provider";
import DesignProvider from "./design-provider";

export default function RootProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <AuthProvider>
      <DesignProvider>{children}</DesignProvider>
    </AuthProvider>
  );
}
