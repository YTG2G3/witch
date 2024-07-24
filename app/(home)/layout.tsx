import { profileSchema } from "@/lib/schema";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";
import Nav from "./nav";
import ProfileModal from "./profile-modal";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  async function handleComplete(
    values: z.infer<typeof profileSchema>,
  ): Promise<string | null> {
    "use server";
    const supabase = createClient();
    const { data, error } = await supabase.auth.getUser();
    if (error || !data?.user) return "Unauthorized";
    await supabase.from("profiles").upsert({
      id: data.user.id,
      ...values,
    });
    return null;
  }

  return (
    <>
      <div className="h-screen w-screen grid grid-rows-screen">
        <Nav />
        <main className="no-scrollbar overflow-auto">{children}</main>
      </div>
      <ProfileModal handleComplete={handleComplete} />
    </>
  );
}
