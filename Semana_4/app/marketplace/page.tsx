import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabaseServer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatBudgetEUR } from "@/lib/problems";
import type { SolutionRow } from "@/lib/solutions";

export default async function MarketplacePage() {
  const supabase = await createServerSupabaseClient();
  const { data: solutions, error } = await supabase
    .from("solutions")
    .select("id,title,description,price,demo_url,status,created_at")
    .order("created_at", { ascending: false });

  const catalog = (solutions ?? []) as SolutionRow[];

  return (
    <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[color:var(--primary)]/35 to-transparent" aria-hidden />

      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-primary">Marketplace</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-app-foreground sm:text-4xl">Catálogo de soluciones</h1>
          <p className="mt-3 max-w-2xl text-app-muted">
            Explora propuestas y productos reutilizables publicados por la comunidad DevSolve. Acceso público, sin necesidad de cuenta.
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-3">
          <Button href="/" variant="ghost">
            Inicio
          </Button>
          <Button href="/bounties" variant="outline">
            Bounties
          </Button>
        </div>
      </div>

      {error ? (
        <p className="mt-10 rounded-lg border border-red-500/40 bg-red-950/30 px-4 py-3 text-sm text-red-200" role="alert">
          No se pudo cargar el catálogo: {error.message}
        </p>
      ) : null}

      {!error && catalog.length === 0 ? (
        <Card className="mt-12 border-dashed border-app bg-app-card-35">
          <CardHeader>
            <CardTitle>Aún no hay productos disponibles</CardTitle>
            <CardDescription>
              Cuando los desarrolladores publiquen soluciones, aparecerán aquí. Mientras tanto, puedes explorar{" "}
              <Link href="/bounties" className="font-medium text-primary underline-offset-4 hover:text-primary hover:underline">
                problemas abiertos en Bounties
              </Link>{" "}
              o{" "}
              <Link href="/register" className="font-medium text-primary underline-offset-4 hover:text-primary hover:underline">
                crear una cuenta
              </Link>
              .
            </CardDescription>
          </CardHeader>
        </Card>
      ) : null}

      {!error && catalog.length > 0 ? (
        <ul className="mt-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {catalog.map((s) => (
            <li key={s.id} className="flex">
              <Card className="flex w-full flex-col border-app transition-colors hover:border-app hover:shadow-primary">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <CardTitle className="text-lg leading-snug">{s.title}</CardTitle>
                    <span className="shrink-0 rounded-md bg-primary-15 px-2 py-1 text-xs font-semibold text-primary">
                      {formatBudgetEUR(s.price)}
                    </span>
                  </div>
                  {s.status ? (
                    <span className="mt-2 inline-block w-fit rounded-full border border-app px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-app-muted">
                      {s.status}
                    </span>
                  ) : null}
                </CardHeader>
                <CardContent className="mt-auto flex flex-1 flex-col pt-0">
                  <CardDescription className="line-clamp-4 flex-1 text-app-muted">{s.description}</CardDescription>
                  <div className="mt-5 border-t border-app pt-4">
                    {s.demo_url ? (
                      <a
                        href={s.demo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-primary underline-offset-4 hover:text-primary hover:underline"
                      >
                        Ver demo →
                      </a>
                    ) : (
                      <p className="text-sm text-app-muted">Sin enlace de demo</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
