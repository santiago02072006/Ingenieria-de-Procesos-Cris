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
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[color:var(--primary)]/35 to-transparent" aria-hidden />

      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-primary">Bounty board</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-app-foreground sm:text-4xl">Problemas abiertos</h1>
          <p className="mt-3 max-w-2xl text-app-muted">
            Explora retos publicados por clientes. Cada tarjeta resume título, descripción y presupuesto de referencia.
          </p>
        </div>
      </div>

      {error ? (
        <p className="mt-10 rounded-lg border border-red-500/40 bg-red-950/30 px-4 py-3 text-sm text-red-200" role="alert">
          No se pudo cargar el tablero: {error.message}
        </p>
      ) : null}

      {!error && openProblems.length === 0 ? (
        <Card className="mt-12 border-dashed border-app bg-app-card-35">
          <CardHeader>
            <CardTitle>No hay bounties abiertos</CardTitle>
            <CardDescription>
              Cuando un cliente publique un problema con estado abierto, aparecerá aquí. Si eres cliente,{" "}
              <Link href="/dashboard/cliente" className="font-medium text-primary underline-offset-4 hover:text-primary hover:underline">
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
              <Card className="flex w-full flex-col border-app transition-colors hover:border-app hover:shadow-primary">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <CardTitle className="text-lg leading-snug">{p.title}</CardTitle>
                    <span className="shrink-0 rounded-md bg-primary-15 px-2 py-1 text-xs font-semibold text-primary">
                      {formatBudgetEUR(p.budget)}
                    </span>
                  </div>
                  {p.created_at ? (
                    <p className="text-xs text-app-muted">
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
                  <CardDescription className="line-clamp-4 flex-1 text-app-muted">{p.description}</CardDescription>
                  <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-app pt-4">
                    <span className="rounded-full border border-app px-2 py-0.5 text-xs uppercase tracking-wide text-app-muted">
                      Abierto
                    </span>
                    <Button href={`/bounties/${p.id}`} variant="outline" size="sm">
                      Ver detalles
                    </Button>
                  </div>
                  <p className="mt-2 text-right font-mono text-[10px] text-app-muted">#{p.id.slice(0, 8)}</p>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
