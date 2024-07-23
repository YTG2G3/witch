import { createClient } from "@/lib/supabase/server";

export default async function MeMe() {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    throw new Error("Not authenticated");
  }

  return <p>Hello {data.user.email}</p>;
}
