import { SupabaseClient, User } from "@supabase/supabase-js";
import { Database } from "./supabase/database.types";
import { createClient } from "./supabase/server";

export type WitchUser = User & {
  profile: Database["public"]["Tables"]["profiles"]["Row"] | null;
  is_admin: boolean;
};

// Secure action for general methods. Log in required.
export function authAction<T extends any[], R>(
  action: (
    ...args: T
  ) => Promise<
    ({
      supabase,
      user,
    }: {
      supabase: SupabaseClient<Database>;
      user: WitchUser;
    }) => Promise<R>
  >,
  isAdmin = false,
): (...args: T) => Promise<R> {
  return async (...args: T): Promise<R> => {
    const supabase = createClient();

    // Check if the user is authenticated
    const { data, error } = await supabase.auth.getUser();
    if (error || !data?.user) throw new Error("Unauthorized");

    // Check if the user is an admin
    const { data: role, error: roleError } = await supabase
      .from("roles")
      .select("*")
      .eq("user_id", data.user.id)
      .single();
    if (roleError) throw roleError;
    if (isAdmin && !role?.is_admin) throw new Error("Forbidden");

    // Check if the user made a profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", data.user.id)
      .single();
    if (profileError) throw profileError;

    // Call the route handler
    const a = await action(...args);
    return a({
      supabase,
      user: { ...data.user, profile, is_admin: role.is_admin },
    });
  };
}
