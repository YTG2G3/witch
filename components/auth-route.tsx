import { Database } from "@/lib/supabase/database.types";
import { createClient } from "@/lib/supabase/server";
import { SupabaseClient, User } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export type AuthUser = User & {
  profile: Database["public"]["Tables"]["profiles"]["Row"] | null;
  is_admin: boolean;
};

// TODO: Check if the user has the required access level
export default function authRoute(
  callback: (
    req: NextRequest,
    user: AuthUser,
    supabase: SupabaseClient<Database>,
  ) => Promise<any>,
  adminOnly = false,
) {
  return async (req: NextRequest) => {
    try {
      const supabase = createClient();

      // Check if the user is authenticated
      const { data, error } = await supabase.auth.getUser();
      if (error || !data?.user) throw { message: "Unauthorized", status: 401 };

      // Check if the user is an admin
      const { data: role, error: roleError } = await supabase
        .from("roles")
        .select("*")
        .eq("id", data.user.id)
        .single();
      if (roleError)
        throw {
          message: roleError.message,
          status: 500,
        };
      if (adminOnly && !role?.is_admin)
        throw { message: "Forbidden", status: 403 };

      // Check if the user made a profile
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", data.user.id)
        .single();
      if (profileError)
        throw {
          message: profileError.message,
          status: 500,
        };

      // Call the route handler
      const resp = await callback(
        req,
        { ...data.user, profile, is_admin: role.is_admin },
        supabase,
      );
      return NextResponse.json({ error: null, data: resp });
    } catch (error: any) {
      // Error handling
      console.error(
        `Error in ${req.method} ${req.url}: ${error?.message || "Unexpected error"}`,
      );

      return NextResponse.json(
        {
          error:
            process.env.NODE_ENV === "production"
              ? "Unexpected error" // Do not leak error details in production
              : error?.message,
        },
        { status: error?.status || 400 },
      );
    }
  };
}
