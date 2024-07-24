"use client";

import { createClient } from "@/lib/supabase/client";
import { Database } from "@/lib/supabase/database.types";
import { User } from "@supabase/supabase-js";
import { createContext, useEffect, useState } from "react";

export type WitchUser = User & {
  profile: Database["public"]["Tables"]["profiles"]["Row"] | null;
  is_admin: boolean;
};

export const AuthContext = createContext<{ user: WitchUser | null }>({
  user: null,
});

export default function AuthProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [user, setUser] = useState<WitchUser | null>(null);
  const supabase = createClient();

  useEffect(() => {
    // Load from cache first
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    // Now check auth
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadData() {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data?.user) {
      // Logged out
      localStorage.removeItem("user");
      setUser(null);
      return;
    }

    // Update profile & role data
    const { data: role, error: roleError } = await supabase
      .from("roles")
      .select("*")
      .eq("id", data.user.id)
      .single();
    if (roleError) {
      console.error(roleError);
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", data.user.id)
      .single();
    if (profileError) {
      console.error(profileError);
      return;
    }

    localStorage.setItem(
      "user",
      JSON.stringify({ ...data.user, profile, is_admin: role.is_admin }),
    );
    setUser({ ...data.user, profile, is_admin: role.is_admin });
  }

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
}
