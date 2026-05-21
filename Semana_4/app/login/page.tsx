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
    <div className="min-h-screen flex">
      {/* Left - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Link href="/" className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-gradient-to-br from-[color:var(--primary)] to-[color:var(--accent)] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">DS</span>
            </div>
            <span className="text-xl font-semibold">DevSolve</span>
          </Link>

          <h1 className="text-3xl font-bold mb-2 text-app-foreground">Bienvenido de vuelta</h1>
          <p className="text-app-muted mb-8">Ingresa a tu cuenta para continuar</p>

          <LoginForm />

          <div className="mt-6 text-center">
            <span className="text-app-muted">¿No tienes cuenta? </span>
            <Link href="/register" className="text-primary hover:underline">
              Regístrate aquí
            </Link>
          </div>

          <div className="mt-8 pt-6 border-t border-app">
            <div className="text-xs text-app-muted text-center">
              Al continuar, aceptas nuestros Términos de Servicio y Política de Privacidad
            </div>
          </div>
        </div>
      </div>

      {/* Right - Visual */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary/20 via-background to-[color:var(--accent)]/20 items-center justify-center p-8">
        <div className="max-w-lg text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-primary to-[color:var(--accent)] rounded-2xl flex items-center justify-center mx-auto mb-6">
            <span className="text-white font-bold">DS</span>
          </div>
          <h2 className="text-3xl font-bold mb-4 text-app-foreground">Marketplace Inteligente de Microsoftware</h2>
          <p className="text-app-muted text-lg">
            Únete a la comunidad construyendo y adoptando software reutilizable
          </p>

          <div className="grid grid-cols-3 gap-4 mt-10">
            <div className="bg-app-card/50 backdrop-blur border border-app rounded-lg p-4">
              <div className="text-2xl font-bold text-primary">15.2K</div>
              <div className="text-xs text-app-muted mt-1">Soluciones</div>
            </div>
            <div className="bg-app-card/50 backdrop-blur border border-app rounded-lg p-4">
              <div className="text-2xl font-bold text-primary">$4.8M</div>
              <div className="text-xs text-app-muted mt-1">Generados</div>
            </div>
            <div className="bg-app-card/50 backdrop-blur border border-app rounded-lg p-4">
              <div className="text-2xl font-bold text-primary">8.9K</div>
              <div className="text-xs text-app-muted mt-1">Módulos</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
