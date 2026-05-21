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
    <div className="min-h-screen flex">
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Link href="/" className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-gradient-to-br from-[color:var(--primary)] to-[color:var(--accent)] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">DS</span>
            </div>
            <span className="text-xl font-semibold">DevSolve</span>
          </Link>

          <h1 className="text-3xl font-semibold tracking-tight text-app-foreground">Crear cuenta</h1>
          <p className="mt-2 text-sm text-app-muted">Regístrate y elige si participas como cliente o desarrollador.</p>
          <RegisterForm mode="signup" />

          <div className="mt-6 text-center text-app-muted">
            <Button href="/" variant="ghost" size="sm">
              Volver al inicio
            </Button>
          </div>
        </div>
      </div>

      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary/20 via-background to-[color:var(--accent)]/20 items-center justify-center p-8">
        <div className="max-w-lg">
          <h2 className="text-3xl font-bold mb-6 text-app-foreground">Únete al ecosistema de desarrollo del futuro</h2>

          <div className="space-y-4">
            <div className="bg-app-card/50 backdrop-blur border border-app rounded-lg p-4 flex items-start gap-3">
              <div>
                <div className="text-lg font-semibold text-primary">Beneficio A</div>
                <div className="text-sm text-app-muted">Descripción breve del beneficio.</div>
              </div>
            </div>

            <div className="bg-app-card/50 backdrop-blur border border-app rounded-lg p-4 flex items-start gap-3">
              <div>
                <div className="text-lg font-semibold text-primary">Beneficio B</div>
                <div className="text-sm text-app-muted">Descripción breve del beneficio.</div>
              </div>
            </div>

            <div className="bg-app-card/50 backdrop-blur border border-app rounded-lg p-4 flex items-start gap-3">
              <div>
                <div className="text-lg font-semibold text-primary">Beneficio C</div>
                <div className="text-sm text-app-muted">Descripción breve del beneficio.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
