"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { Button } from "./button";

type NavbarAuthActionsProps = {
  isLoggedIn: boolean;
  dashboardHref?: string;
};

export function NavbarAuthActions({ isLoggedIn, dashboardHref = "/" }: NavbarAuthActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSignOut() {
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Sign out error:", error);
        setLoading(false);
        return;
      }
      // Force a full-page navigation so server-side session/cookies are re-evaluated
      window.location.replace("/");
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  }

  if (isLoggedIn) {
    return (
      <div className="flex items-center gap-2">
        <Button href={dashboardHref} variant="ghost" size="sm">
          Mi Panel
        </Button>
        <Button type="button" variant="outline" size="sm" disabled={loading} onClick={handleSignOut}>
          {loading ? "Saliendo…" : "Cerrar sesión"}
        </Button>
      </div>
    );
  }

  return (
    <>
      <Button href="/register" variant="ghost" size="sm" className="text-app-muted hover:text-app-foreground">
        Registro
      </Button>
      <Button href="/login" variant="outline" size="sm">
        <span className="hidden sm:inline">Iniciar Sesión</span>
        <span className="sm:hidden">Entrar</span>
      </Button>
    </>
  );
}
