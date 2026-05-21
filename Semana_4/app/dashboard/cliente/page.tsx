import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabaseServer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateProblemForm } from "./CreateProblemForm";
import { formatBudgetEUR, type ProblemRow } from "@/lib/problems";
import type { SolutionRow } from "@/lib/solutions";
import { ProblemSolutionsList } from "./problem-solutions-list";

function groupSolutionsByProblem(solutions: SolutionRow[]): Map<string, SolutionRow[]> {
  const map = new Map<string, SolutionRow[]>();
  for (const s of solutions) {
    if (!s.problem_id) continue;
    const list = map.get(s.problem_id) ?? [];
    list.push(s);
    map.set(s.problem_id, list);
  }
  return map;
}

export default async function ClienteDashboardPage() {
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

  if (profile.role !== "cliente") {
    redirect("/dashboard/desarrollador");
  }

  const { data: problems, error: problemsError } = await supabase
    .from("problems")
    .select("id,title,description,budget,status,created_at")
    .eq("client_id", user.id)
    .order("created_at", { ascending: false });

  const list = (problems ?? []) as ProblemRow[];
  const problemIds = list.map((p) => p.id);

  let solutionsByProblem = new Map<string, SolutionRow[]>();
  let solutionsError: { message: string } | null = null;

  if (problemIds.length > 0) {
    const { data: solutions, error } = await supabase
      .from("solutions")
      .select("id,title,description,price,demo_url,status,problem_id,developer_id,created_at")
      .in("problem_id", problemIds)
      .order("created_at", { ascending: false });

    if (error) {
      solutionsError = error;
    } else {
      solutionsByProblem = groupSolutionsByProblem((solutions ?? []) as SolutionRow[]);
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="text-xs font-medium uppercase tracking-wider text-indigo-400">Dashboard</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-100">Área de cliente</h1>
      <p className="mt-3 max-w-2xl text-zinc-400">
        Hola{user.email ? `, ${user.email}` : ""}. Publica problemas, revisa propuestas de desarrolladores y acepta la solución ganadora.
      </p>

      <div className="mt-10 flex flex-wrap gap-3">
        <Button href="/bounties" variant="outline">
          Ver Bounties públicos
        </Button>
        <Button href="/" variant="ghost">
          Inicio
        </Button>
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,380px)] lg:items-start">
        <aside className="order-1 lg:order-2 lg:sticky lg:top-24">
          <CreateProblemForm />
        </aside>

        <section className="order-2 lg:order-1" aria-labelledby="mis-problemas-heading">
          <h2 id="mis-problemas-heading" className="text-xl font-semibold text-zinc-100">
            Mis problemas
          </h2>
          {problemsError ? (
            <p className="mt-4 rounded-lg border border-red-500/40 bg-red-950/30 px-3 py-2 text-sm text-red-200" role="alert">
              No se pudieron cargar los problemas: {problemsError.message}
            </p>
          ) : null}
          {solutionsError ? (
            <p className="mt-4 rounded-lg border border-amber-500/30 bg-amber-950/25 px-3 py-2 text-sm text-amber-100" role="alert">
              No se pudieron cargar las soluciones: {solutionsError.message}
            </p>
          ) : null}
          {!problemsError && list.length === 0 ? (
            <Card className="mt-4 border-dashed border-zinc-700/80 bg-zinc-950/40">
              <CardContent className="py-10 text-center text-sm text-zinc-500">
                Aún no has publicado ningún problema. Usa el formulario para crear el primero.
              </CardContent>
            </Card>
          ) : null}
          <ul className="mt-4 space-y-6">
            {list.map((p) => {
              const problemClosed = p.status === "closed";
              const problemSolutions = solutionsByProblem.get(p.id) ?? [];

              return (
                <li key={p.id}>
                  <Card
                    className={[
                      "overflow-hidden transition-colors",
                      problemClosed ? "border-emerald-500/20" : "hover:border-indigo-500/25",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <CardTitle className="text-base sm:text-lg">{p.title}</CardTitle>
                        <span
                          className={[
                            "shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-medium uppercase tracking-wide",
                            problemClosed
                              ? "border-emerald-500/40 bg-emerald-950/40 text-emerald-300"
                              : "border-zinc-700 bg-zinc-950/60 text-zinc-400",
                          ].join(" ")}
                        >
                          {p.status}
                        </span>
                      </div>
                      <CardDescription className="line-clamp-3">{p.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="border-t border-zinc-800/80 pt-4">
                      <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-zinc-500">
                        <span className="font-medium text-indigo-300">{formatBudgetEUR(p.budget)}</span>
                        {p.created_at ? (
                          <time dateTime={p.created_at} className="text-xs text-zinc-500">
                            {new Date(p.created_at).toLocaleDateString("es-ES", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </time>
                        ) : null}
                      </div>
                      <ProblemSolutionsList
                        problemId={p.id}
                        problemClosed={problemClosed}
                        solutions={problemSolutions}
                      />
                    </CardContent>
                  </Card>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </div>
  );
}
