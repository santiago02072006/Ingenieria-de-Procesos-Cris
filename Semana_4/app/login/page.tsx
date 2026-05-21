import Link from "next/link";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabaseServer";
import { LoginForm } from "./login-form";
import { Button } from "@/components/ui/button";
import { dashboardPathForRole, type ProfileRole } from "@/lib/profiles";

export default async function LoginPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
    if (profile?.role) {
      redirect(dashboardPathForRole(profile.role as ProfileRole));
    }
    redirect("/register");
  }

  return (
    <div className="mx-auto max-w-md px-4 py-20 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold tracking-tight text-app-foreground">Iniciar sesión</h1>
      <p className="mt-2 text-sm text-app-muted">Accede con tu correo y contraseña de DevSolve.</p>
      <LoginForm />
      <p className="mt-6 text-center text-sm text-app-muted">
        <Button href="/" variant="ghost" size="sm">
          Volver al inicio
        </Button>
      </p>
    </div>
  );
}
