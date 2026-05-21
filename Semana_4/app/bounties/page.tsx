import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabaseServer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatBudgetEUR, type ProblemRow } from "@/lib/problems";

export default async function BountiesPage() {
  const supabase = await createServerSupabaseClient();
  const { data: problems, error } = await supabase
    .from("problems")
    .select("id,title,description,budget,status,created_at,category")
    .eq("status", "open")
    .order("created_at", { ascending: false });

  const openProblems = (problems ?? []) as ProblemRow[];

  return (
    <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/35 to-transparent" aria-hidden />

      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-indigo-400">Bounty board</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-100 sm:text-4xl">Problemas abiertos</h1>
          <p className="mt-3 max-w-2xl text-zinc-400">
            Explora retos publicados por clientes. Cada tarjeta resume título, descripción y presupuesto de referencia.
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-3">
          <Button href="/" variant="ghost">
            Inicio
          </Button>
          <Button href="/marketplace" variant="outline">
            Marketplace
          </Button>
          <Button href="/login">Iniciar sesión</Button>
        </div>
      </div>

      {error ? (
        <p className="mt-10 rounded-lg border border-red-500/40 bg-red-950/30 px-4 py-3 text-sm text-red-200" role="alert">
          No se pudo cargar el tablero: {error.message}
        </p>
      ) : null}

      {!error && openProblems.length === 0 ? (
        <Card className="mt-12 border-dashed border-zinc-700/80 bg-zinc-950/35">
          <CardHeader>
            <CardTitle>No hay bounties abiertos</CardTitle>
            <CardDescription>
              Cuando un cliente publique un problema con estado abierto, aparecerá aquí. Si eres cliente,{" "}
              <Link href="/dashboard/cliente" className="font-medium text-indigo-400 underline-offset-4 hover:text-indigo-300 hover:underline">
                ve a tu dashboard
              </Link>{" "}
              para publicar uno.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : null}

      {!error && openProblems.length > 0 ? (
        <ul className="mt-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {openProblems.map((p) => (
            <li key={p.id} className="flex">
              <Card className="flex w-full flex-col border-zinc-800/90 transition-colors hover:border-indigo-500/30 hover:shadow-indigo-500/10">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <CardTitle className="text-lg leading-snug">{p.title}</CardTitle>
                    <span className="shrink-0 rounded-md bg-indigo-500/15 px-2 py-1 text-xs font-semibold text-indigo-300">
                      {formatBudgetEUR(p.budget)}
                    </span>
                  </div>
                  {p.created_at ? (
                    <p className="text-xs text-zinc-500">
                      Publicado{" "}
                      <time dateTime={p.created_at}>
                        {new Date(p.created_at).toLocaleDateString("es-ES", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </time>
                    </p>
                  ) : null}
                </CardHeader>
                <CardContent className="mt-auto flex flex-1 flex-col pt-0">
                  <CardDescription className="line-clamp-4 flex-1 text-zinc-400">{p.description}</CardDescription>
                  <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-zinc-800/80 pt-4">
                    <span className="rounded-full border border-zinc-700/80 px-2 py-0.5 text-xs uppercase tracking-wide text-zinc-400">
                      Abierto
                    </span>
                    <Button href={`/bounties/${p.id}`} variant="outline" size="sm">
                      Ver detalles
                    </Button>
                  </div>
                  <p className="mt-2 text-right font-mono text-[10px] text-zinc-600">#{p.id.slice(0, 8)}</p>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
