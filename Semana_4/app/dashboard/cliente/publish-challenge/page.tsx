import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabaseServer";
import PublishChallengeClient from "./PublishChallengeClient";

export default async function Page() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();

  if (!profile?.role) {
    redirect("/register");
  }

  // Only allow clients
  if (profile.role !== "cliente") {
    redirect("/dashboard/desarrollador");
  }

  return <PublishChallengeClient />;
}
