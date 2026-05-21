import { redirect } from "next/navigation";
import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabaseServer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatBudgetEUR } from "@/lib/problems";
import type { SolutionRow } from "@/lib/solutions";

export default async function DesarrolladorDashboardPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();

  if (!profile?.role) {
    redirect("/register");
  }

  if (profile.role !== "desarrollador") {
    redirect("/dashboard/cliente");
  }

  const { data: solutions, error: solutionsError } = await supabase
    .from("solutions")
    .select("id,title,description,price,demo_url,status,problem_id,created_at")
    .eq("developer_id", user.id)
    .order("created_at", { ascending: false });

  const list = (solutions ?? []) as SolutionRow[];
  const problemIds = [...new Set(list.map((s) => s.problem_id).filter((id): id is string => Boolean(id)))];

  let problemTitles = new Map<string, string>();
  let problemStatuses = new Map<string, string>();
  if (problemIds.length > 0) {
    const { data: problems } = await supabase.from("problems").select("id,title,status").in("id", problemIds);
    problemTitles = new Map((problems ?? []).map((row: { id: string; title: string }) => [row.id, row.title]));
    problemStatuses = new Map((problems ?? []).map((row: { id: string; status: string }) => [row.id, row.status]));
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="text-xs font-medium uppercase tracking-wider text-indigo-400">Dashboard</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-100">Área de desarrollador</h1>
      <p className="mt-3 text-zinc-400">
        Hola{user.email ? `, ${user.email}` : ""}. Aquí ves las soluciones que has enviado a bounties y su estado.
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        <Button href="/bounties" variant="outline">
          Explorar bounties
        </Button>
        <Button href="/marketplace" variant="outline">
          Marketplace
        </Button>
        <Button href="/" variant="ghost">
          Inicio
        </Button>
      </div>

      <section className="mt-12" aria-labelledby="mis-soluciones-heading">
        <h2 id="mis-soluciones-heading" className="text-xl font-semibold text-zinc-100">
          Mis soluciones enviadas
        </h2>

        {solutionsError ? (
          <p className="mt-4 rounded-lg border border-red-500/40 bg-red-950/30 px-3 py-2 text-sm text-red-200" role="alert">
            No se pudieron cargar las soluciones: {solutionsError.message}
          </p>
        ) : null}

        {!solutionsError && list.length === 0 ? (
          <Card className="mt-4 border-dashed border-zinc-700/80 bg-zinc-950/40">
            <CardContent className="py-10 text-center text-sm text-zinc-500">
              Aún no has enviado ninguna solución.{" "}
              <Link href="/bounties" className="font-medium text-indigo-400 underline-offset-4 hover:underline">
                Ver problemas abiertos
              </Link>
            </CardContent>
          </Card>
        ) : null}

        <ul className="mt-6 space-y-4">
            {list.map((s) => {
            const bountyTitle = s.problem_id ? problemTitles.get(s.problem_id) : undefined;
            const problemStatus = s.problem_id ? problemStatuses.get(s.problem_id) : undefined;
            let statusLabel = (s.status ?? "sin estado").toString();
            if (problemStatus === "closed" && s.status === "submitted") {
              statusLabel = "Finalizado";
            }

            return (
              <li key={s.id}>
                <Card className="overflow-hidden transition-colors hover:border-indigo-500/25">
                  <CardHeader className="pb-2">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <CardTitle className="text-base sm:text-lg">{s.title}</CardTitle>
                      <span className="shrink-0 rounded-full border border-zinc-700 bg-zinc-950/60 px-2.5 py-0.5 text-xs font-medium uppercase tracking-wide text-zinc-300">
                        {statusLabel}
                      </span>
                    </div>
                    <CardDescription className="line-clamp-2">{s.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-3 border-t border-zinc-800/80 pt-4 text-sm text-zinc-500 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                      <span className="font-medium text-indigo-300">{formatBudgetEUR(s.price)}</span>
                      {s.problem_id ? (
                        <span className="text-zinc-500">
                          Bounty:{" "}
                          <Link
                            href={`/bounties/${s.problem_id}`}
                            className="text-indigo-400 underline-offset-4 hover:text-indigo-300 hover:underline"
                          >
                            {bountyTitle ?? "Ver detalle"}
                          </Link>
                        </span>
                      ) : (
                        <span className="text-zinc-600">Sin problema vinculado</span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs">
                      {s.demo_url ? (
                        <a
                          href={s.demo_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-400 underline-offset-4 hover:underline"
                        >
                          Demo
                        </a>
                      ) : null}
                      {s.created_at ? (
                        <time dateTime={s.created_at} className="text-zinc-600">
                          {new Date(s.created_at).toLocaleDateString("es-ES", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </time>
                      ) : null}
                    </div>
                  </CardContent>
                </Card>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
