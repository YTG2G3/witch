import { signupSchema } from "@/lib/schema";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import SignupForm from "./form";

export default function LoginPage() {
  async function handleSignup(
    data: z.infer<typeof signupSchema>,
  ): Promise<string | null> {
    "use server";
    const supabase = createClient();
    if (data.password !== data.retype) {
      return "Passwords do not match";
    }
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    });
    if (error) return error.message;

    revalidatePath("/", "layout");
    return null;
  }

  return (
    <div className="flex justify-center items-center h-screen w-screen">
      <SignupForm handleSignup={handleSignup} />
    </div>
  );
}
