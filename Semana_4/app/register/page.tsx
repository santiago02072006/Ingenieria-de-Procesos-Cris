import Link from "next/link";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabaseServer";
import { RegisterForm } from "./register-form";
import { Button } from "@/components/ui/button";
import { dashboardPathForRole, type ProfileRole } from "@/lib/profiles";

export default async function RegisterPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
    if (profile?.role) {
      redirect(dashboardPathForRole(profile.role as ProfileRole));
    }
    return (
      <div className="mx-auto max-w-md px-4 py-20 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-semibold tracking-tight text-app-foreground">Completar perfil</h1>
        <p className="mt-2 text-sm text-app-muted">Asocia tu cuenta con un rol en DevSolve.</p>
        <RegisterForm mode="profile-only" />
        <p className="mt-6 text-center text-sm text-app-muted">
          <Button href="/" variant="ghost" size="sm">
            Volver al inicio
          </Button>
        </p>
      </div>
    );
  }

  return (
      <div className="mx-auto max-w-md px-4 py-20 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold tracking-tight text-app-foreground">Crear cuenta</h1>
      <p className="mt-2 text-sm text-app-muted">Regístrate y elige si participas como cliente o desarrollador.</p>
      <RegisterForm mode="signup" />
      <p className="mt-6 text-center text-sm text-app-muted">
        <Button href="/" variant="ghost" size="sm">
          Volver al inicio
        </Button>
      </p>
    </div>
  );
}
