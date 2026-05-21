"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { dashboardPathForRole, type ProfileRole } from "@/lib/profiles";

export function LoginForm() {
  const router = useRouter();
  const [role, setRole] = useState<'client' | 'developer'>('client');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error: signError } = await supabase.auth.signInWithPassword({ email, password });

    if (signError) {
      setError(signError.message);
      setLoading(false);
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("No se pudo obtener la sesión.");
      setLoading(false);
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    if (profileError) {
      setError(profileError.message);
      setLoading(false);
      return;
    }

    if (!profile?.role) {
      setLoading(false);
      router.push("/register");
      router.refresh();
      return;
    }

    router.push(dashboardPathForRole(profile.role as ProfileRole));
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="mt-2 space-y-4" noValidate>
      <div className="grid grid-cols-2 gap-3 mb-4">
        <button
          type="button"
          onClick={() => setRole('client')}
          className={`p-3 rounded-lg border transition-all ${
            role === 'client' ? 'border-primary bg-primary/10 text-app-foreground' : 'border-app bg-app-card text-app-muted hover:border-primary/50'
          }`}
        >
          <div className="font-medium">Cliente</div>
          <div className="text-xs mt-1">Empresas</div>
        </button>
        <button
          type="button"
          onClick={() => setRole('developer')}
          className={`p-3 rounded-lg border transition-all ${
            role === 'developer' ? 'border-primary bg-primary/10 text-app-foreground' : 'border-app bg-app-card text-app-muted hover:border-primary/50'
          }`}
        >
          <div className="font-medium">Desarrollador</div>
          <div className="text-xs mt-1">Builders</div>
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 text-app-muted">Correo</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded text-app-muted" aria-hidden />
          <Input
            className="pl-10"
            type="email"
            name="email"
            placeholder="tu@empresa.com"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 text-app-muted">Contraseña</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded text-app-muted" aria-hidden />
          <Input
            className="pl-10"
            type="password"
            name="password"
            placeholder="••••••••"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
      </div>
      {error ? (
        <p className="rounded-lg border border-red-500/40 bg-red-950/40 px-3 py-2 text-sm text-red-200" role="alert">
          {error}
        </p>
      ) : null}
      <Button type="submit" className="w-full bg-primary text-white rounded-lg" disabled={loading}>
        {loading ? "Entrando…" : "Iniciar Sesión"}
      </Button>
      <p className="text-center text-sm text-app-muted">
        ¿No tienes cuenta?{" "}
        <Link href="/register" className="font-medium text-primary underline-offset-4 hover:text-primary hover:underline">
          Regístrate
        </Link>
      </p>
    </form>
  );
}
