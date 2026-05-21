"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { dashboardPathForRole, type ProfileRole } from "@/lib/profiles";

type RegisterMode = "signup" | "profile-only";

type RegisterFormProps = {
  mode: RegisterMode;
};

export function RegisterForm({ mode }: RegisterFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<ProfileRole>("cliente");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function saveProfileForUser(userId: string, selectedRole: ProfileRole) {
    const supabase = createClient();
    const { error: insertError } = await supabase.from("profiles").insert({ id: userId, role: selectedRole });
    return insertError;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setLoading(true);

    const supabase = createClient();

    if (mode === "signup") {
      if (password !== confirmPassword) {
        setError("Las contraseñas no coinciden.");
        setLoading(false);
        return;
      }
      if (password.length < 6) {
        setError("La contraseña debe tener al menos 6 caracteres.");
        setLoading(false);
        return;
      }

      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
        return;
      }

      const user = data.user;
      if (!user) {
        setError("No se pudo crear el usuario.");
        setLoading(false);
        return;
      }

      if (!data.session) {
        setInfo(
          "Si tu proyecto requiere confirmación por correo, abre el enlace del email y luego inicia sesión para completar el perfil en Registro.",
        );
        setLoading(false);
        return;
      }

      const insertError = await saveProfileForUser(user.id, role);
      if (insertError) {
        setError(insertError.message);
        setLoading(false);
        return;
      }

      router.push(dashboardPathForRole(role));
      router.refresh();
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("No hay sesión activa. Inicia sesión de nuevo.");
      setLoading(false);
      return;
    }

    const insertError = await saveProfileForUser(user.id, role);
    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }

    router.push(dashboardPathForRole(role));
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6" noValidate>
      {mode === "signup" ? (
        <>
          <Input
            type="email"
            name="email"
            label="Correo"
            placeholder="tu@empresa.com"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            name="password"
            label="Contraseña"
            placeholder="Mínimo 6 caracteres"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Input
            type="password"
            name="confirmPassword"
            label="Confirmar contraseña"
            placeholder="Repite la contraseña"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </>
      ) : (
        <p className="rounded-lg border border-app bg-app-card-50 px-3 py-2 text-sm text-app-muted">
          Tu cuenta aún no tiene perfil en DevSolve. Elige tu rol para continuar.
        </p>
      )}

      <fieldset className="space-y-3">
        <legend className="text-sm font-medium text-app-muted">Rol en DevSolve</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {(
            [
              { value: "cliente" as const, title: "Cliente", desc: "Publicas problemas y bounties." },
              { value: "desarrollador" as const, title: "Desarrollador", desc: "Entregas y listas soluciones." },
            ] as const
          ).map((opt) => (
            <Card key={opt.value} className={`cursor-pointer p-4 transition-colors ${role === opt.value ? "border-primary/60 ring-1 ring-primary/40" : "hover:border-app"}`}>
              <label className="flex cursor-pointer flex-col gap-1">
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="role"
                    value={opt.value}
                    checked={role === opt.value}
                    onChange={() => setRole(opt.value)}
                    className="h-4 w-4 accent-primary"
                  />
                  <span className="font-medium text-app-foreground">{opt.title}</span>
                </div>
                <span className="text-xs text-app-muted">{opt.desc}</span>
              </label>
            </Card>
          ))}
        </div>
      </fieldset>

      {error ? (
        <p className="rounded-lg border border-red-500/40 bg-red-950/40 px-3 py-2 text-sm text-red-200" role="alert">
          {error}
        </p>
      ) : null}
      {info ? (
        <p className="rounded-lg border border-primary/30 bg-primary-950/30 px-3 py-2 text-sm text-primary" role="status">
          {info}
        </p>
      ) : null}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Guardando…" : mode === "signup" ? "Crear cuenta" : "Guardar perfil"}
      </Button>

      {mode === "signup" ? (
        <p className="text-center text-sm text-app-muted">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="font-medium text-primary underline-offset-4 hover:text-primary hover:underline">
            Inicia sesión
          </Link>
        </p>
      ) : null}
    </form>
  );
}
