import Link from "next/link";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabaseServer";
import { RegisterForm } from "./register-form";
import { Button } from "@/components/ui/button";
import { dashboardPathForRole, type ProfileRole } from "@/lib/profiles";
import { Code2, Building2, Shield } from "lucide-react";

export default async function RegisterPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    if (profile?.role) {
      redirect(dashboardPathForRole(profile.role as ProfileRole));
    }

    return (
      <div className="mx-auto max-w-md px-4 py-20 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
            <Code2 className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-semibold">DevSolve</span>
        </Link>
        <h1 className="text-3xl font-bold mb-2">Completar perfil</h1>
        <p className="text-muted-foreground mb-8">
          Asocia tu cuenta con un rol en DevSolve.
        </p>
        <RegisterForm mode="profile-only" />
        <div className="mt-6 text-center">
          <Button href="/" variant="ghost" size="sm">
            Volver al inicio
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Link href="/" className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <Code2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-semibold">DevSolve</span>
          </Link>

          <h1 className="text-3xl font-bold mb-2">Crea tu cuenta</h1>
          <p className="text-muted-foreground mb-8">
            Únete al ecosistema de desarrollo reutilizable
          </p>

          <RegisterForm mode="signup" />

          
        </div>
      </div>

      {/* Right Side - Visual */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary/20 via-background to-accent/20 items-center justify-center p-8">
        <div className="max-w-lg">
          <h2 className="text-3xl font-bold mb-6">
            Únete al ecosistema de desarrollo del futuro
          </h2>

          <div className="space-y-4">
            <div className="bg-card/50 backdrop-blur border border-border rounded-lg p-4 flex items-start gap-3">
              <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Code2 className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="font-semibold mb-1">Desarrolladores</div>
                <div className="text-sm text-muted-foreground">
                  Construye soluciones, genera regalías pasivas y evoluciona tu carrera
                </div>
              </div>
            </div>

            <div className="bg-card/50 backdrop-blur border border-border rounded-lg p-4 flex items-start gap-3">
              <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Building2 className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="font-semibold mb-1">Empresas</div>
                <div className="text-sm text-muted-foreground">
                  Accede a software reutilizable, reduce costos y acelera tu transformación
                </div>
              </div>
            </div>

            <div className="bg-card/50 backdrop-blur border border-border rounded-lg p-4 flex items-start gap-3">
              <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="font-semibold mb-1">Seguridad & Compliance</div>
                <div className="text-sm text-muted-foreground">
                  Escaneo automatizado, validación continua y control total
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}