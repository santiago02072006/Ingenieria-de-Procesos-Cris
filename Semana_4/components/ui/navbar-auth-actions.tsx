"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { Button } from "./button";

type NavbarAuthActionsProps = {
  isLoggedIn: boolean;
};

export function NavbarAuthActions({ isLoggedIn }: NavbarAuthActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSignOut() {
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  if (isLoggedIn) {
    return (
      <Button type="button" variant="outline" size="sm" disabled={loading} onClick={handleSignOut}>
        {loading ? "Saliendo…" : "Cerrar sesión"}
      </Button>
    );
  }

  return (
    <>
      <Button href="/register" variant="ghost" size="sm" className="text-zinc-400 hover:text-zinc-100">
        Registro
      </Button>
      <Button href="/login" variant="outline" size="sm">
        <span className="hidden sm:inline">Iniciar Sesión</span>
        <span className="sm:hidden">Entrar</span>
      </Button>
    </>
  );
}
