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
    <div className="min-h-screen flex" style={{ backgroundColor: "#0a0a0f" }}>
      {/* Left - Form */}
      <div className="flex-1 flex items-center justify-center p-8 relative z-10">
        <div className="w-full max-w-md">
          <Link href="/" className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(220,38,38,0.3)]">
              <span className="text-white font-bold text-xs">DS</span>
            </div>
            <span className="text-xl font-semibold text-white">DevSolve</span>
          </Link>

          <h1 className="text-3xl font-bold mb-2 text-white">Bienvenido de vuelta</h1>
          <p className="text-muted-foreground mb-8">Ingresa a tu cuenta para continuar</p>

          <LoginForm />

          <div className="mt-8 pt-6 border-t border-white/5">
            <div className="text-xs text-muted-foreground text-center">
              Al continuar, aceptas nuestros Términos de Servicio y Política de Privacidad
            </div>
          </div>
        </div>
      </div>

      {/* Right - Visual */}
      <div 
        className="hidden lg:flex flex-1 relative items-center justify-center p-8 overflow-hidden border-l border-white/5"
        style={{
          backgroundColor: "#050507", /* Negro absoluto de fondo */
          backgroundImage: `
            /* Luz en Esquina Inferior Derecha (100% 100%) */
            radial-gradient(circle at 100% 100%, rgba(239, 68, 68, 0.18) 0%, transparent 55%),
            /* Luz en Esquina Superior Izquierda (0% 0%) */
            radial-gradient(circle at 0% 0%, rgba(220, 38, 38, 0.15) 0%, transparent 50%)
          `
        }}
      >
        {/* Focos de luz ambientales en la diagonal */}
        {/* Foco Superior Izquierdo */}
        <div className="absolute top-0 left-0 w-[450px] h-[450px] bg-red-600/10 blur-[130px] rounded-full pointer-events-none -translate-x-1/4 -translate-y-1/4" />
        
        {/* Foco Inferior Derecho */}
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-red-500/12 blur-[140px] rounded-full pointer-events-none translate-x-1/4 translate-y-1/4" />

        <div className="max-w-lg text-center relative z-10">
          <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(220,38,38,0.4)]">
            <span className="text-white font-bold text-lg">DS</span>
          </div>
          
          <h2 className="text-3xl font-bold mb-3 tracking-tight text-white">
            Marketplace Inteligente de Microsoftware
          </h2>
          <p className="text-muted-foreground max-w-sm mx-auto text-sm leading-relaxed">
            Únete a la comunidad construyendo y adoptando software reutilizable.
          </p>

          {/* Cuadrícula de estadísticas idéntica al mockup */}
          <div className="grid grid-cols-3 gap-4 mt-10">
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
        </div>
      </div>
    </div>
  );
}
