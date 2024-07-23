import { loginSchema } from "@/lib/schema";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import LoginForm from "./form";

export default function LoginPage() {
  async function handleLogin(
    data: z.infer<typeof loginSchema>,
  ): Promise<string | null> {
    "use server";
    const supabase = createClient();

    try {
      // This try-catch block is necessary to catch supabase bug on email verification
      const { error } = await supabase.auth.signInWithPassword(data);
      if (error) throw error;
    } catch (error: any) {
      return error?.message;
    }

    revalidatePath("/", "layout");
    return null;
  }

  return (
    <div className="flex justify-center items-center h-screen w-screen">
      <LoginForm handleLogin={handleLogin} />
    </div>
  );
}
