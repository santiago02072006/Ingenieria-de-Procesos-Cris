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
      <div 
        className="hidden lg:flex flex-1 relative items-center justify-center p-8 overflow-hidden"
        style={{
          /* 1. MÁS NEGRO: Cambiamos a un negro absoluto (#050507) de fondo */
          backgroundColor: "#050507", 
          backgroundImage: `
            /* Luz en Esquina Inferior Derecha (100% 100%) */
            radial-gradient(circle at 100% 100%, rgba(239, 68, 68, 0.18) 0%, transparent 55%),
            /* Luz en Esquina Superior Izquierda (0% 0%) */
            radial-gradient(circle at 0% 0%, rgba(220, 38, 38, 0.15) 0%, transparent 50%)
          `
        }}
      >
        {/* 2. MÁS ROJO (Focos de luz ambientales en la diagonal) */}
        {/* Foco Superior Izquierdo */}
        <div className="absolute top-0 left-0 w-[450px] h-[450px] bg-red-600/10 blur-[130px] rounded-full pointer-events-none -translate-x-1/4 -translate-y-1/4" />
        
        {/* Foco Inferior Derecho */}
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-red-500/12 blur-[140px] rounded-full pointer-events-none translate-x-1/4 translate-y-1/4" />

        <div className="max-w-lg relative z-10">
          <div className="w-16 h-16 mx-auto mb-6 bg-red-600 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(220,38,38,0.3)]">
            <Code2 className="w-8 h-8 text-white" />
          </div>

          <h2 className="text-3xl font-bold mb-3 text-center tracking-tight text-white">
            Marketplace Inteligente de Software
          </h2>
          <p className="text-center text-muted-foreground mb-8 max-w-sm mx-auto text-sm">
            Únete a más de 2,340 empresas y desarrolladores construyendo el futuro del software reutilizable.
          </p>

          {/* Tarjetas de estadísticas estilo Mockup */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-[#13131a]/60 backdrop-blur border border-white/5 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-red-500">15.2K</div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">Soluciones</div>
            </div>
            <div className="bg-[#13131a]/60 backdrop-blur border border-white/5 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-red-500">$4.8M</div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">Generados</div>
            </div>
            <div className="bg-[#13131a]/60 backdrop-blur border border-white/5 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-red-500">8.9K</div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">Módulos</div>
            </div>
          </div>

          {/* Secciones Informativas */}
          <div className="space-y-4">
            <div className="bg-[#13131a]/40 backdrop-blur-md border border-white/5 rounded-xl p-4 flex items-start gap-3 transition-colors hover:bg-[#13131a]/60">
              <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center flex-shrink-0 border border-red-500/20">
                <Code2 className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <div className="font-semibold text-white mb-1 text-sm">Desarrolladores</div>
                <div className="text-xs text-muted-foreground leading-relaxed">
                  Construye soluciones, genera regalías pasivas y evoluciona tu carrera.
                </div>
              </div>
            </div>

            <div className="bg-[#13131a]/40 backdrop-blur-md border border-white/5 rounded-xl p-4 flex items-start gap-3 transition-colors hover:bg-[#13131a]/60">
              <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center flex-shrink-0 border border-red-500/20">
                <Building2 className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <div className="font-semibold text-white mb-1 text-sm">Empresas</div>
                <div className="text-xs text-muted-foreground leading-relaxed">
                  Accede a software reutilizable, reduce costos y acelera tu transformación.
                </div>
              </div>
            </div>

            <div className="bg-[#13131a]/40 backdrop-blur-md border border-white/5 rounded-xl p-4 flex items-start gap-3 transition-colors hover:bg-[#13131a]/60">
              <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center flex-shrink-0 border border-red-500/20">
                <Shield className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <div className="font-semibold text-white mb-1 text-sm">Seguridad & Compliance</div>
                <div className="text-xs text-muted-foreground leading-relaxed">
                  Escaneo automatizado, validación continua y control total del código fuente.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}