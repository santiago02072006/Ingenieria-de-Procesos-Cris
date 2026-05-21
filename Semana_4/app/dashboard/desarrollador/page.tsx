import { redirect } from "next/navigation";
import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabaseServer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Code2, Home, Target, TrendingUp, Settings, Bell, Search as SearchIcon } from "lucide-react";
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

  // Derived metrics for developer
  const totalEarned = list.reduce((sum, s) => sum + (Number((s as any).price) || 0), 0);
  const submittedCount = list.length;
  const acceptedCount = list.filter((s) => s.status === "accepted").length;
  const activeBountiesCount = new Set(list.filter((s) => s.problem_id).map((s) => s.problem_id)).size;
  const rating = 4.7;

  return (
    <div className="min-h-screen flex bg-[#0d0e12] text-app-foreground">
      <aside className="w-64 hidden lg:flex flex-col border-r border-app bg-[#0f1014] px-4 py-6">
        <div className="mb-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
            <Code2 className="w-4 h-4 text-white" />
          </div>
          <div className="font-semibold">DevSolve</div>
        </div>
        <nav className="flex-1 space-y-2 text-sm">
          <Link href="/dashboard/desarrollador" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-app-card-60">
            <Home className="w-4 h-4" />
            <span>Inicio</span>
          </Link>
          <Link href="/bounties" className="flex items-center gap-3 px-3 py-2 rounded-lg text-app-muted hover:bg-app-card-60">
            <Target className="w-4 h-4" />
            <span>Mis Desafíos</span>
          </Link>
          <Link href="/marketplace" className="flex items-center gap-3 px-3 py-2 rounded-lg text-app-muted hover:bg-app-card-60">
            <Code2 className="w-4 h-4" />
            <span>Marketplace</span>
          </Link>
          <Link href="/roi" className="flex items-center gap-3 px-3 py-2 rounded-lg text-app-muted hover:bg-app-card-60">
            <TrendingUp className="w-4 h-4" />
            <span>MI ROI</span>
          </Link>
        </nav>
        <div className="mt-6">
          <Link href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg text-app-muted hover:bg-app-card-60">
            <Settings className="w-4 h-4" />
            <span>Configuración</span>
          </Link>
        </div>
      </aside>

      <main className="flex-1 p-8">
        <header className="flex items-start justify-between mb-6">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-primary">Dashboard</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">Área de desarrollador</h1>
            <p className="text-sm text-app-muted mt-1">{`Hola${user.email ? `, ${user.email}` : ""}.`}</p>
          </div>

          <div className="flex items-center gap-4">
            <form method="get" action="/dashboard/desarrollador" className="relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-app-muted" />
              <input name="q" placeholder="Buscar..." className="pl-10 pr-4 py-2 rounded-lg bg-[#0f1115] border border-app text-sm text-app-foreground" />
            </form>
            <button className="p-2 rounded-md bg-app-card-60">
              <Bell className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-md bg-gradient-to-br from-primary to-accent">
              <Code2 className="w-5 h-5 text-white" />
            </button>
          </div>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-[#16171d] border border-app rounded-lg p-4">
            <div className="text-sm text-app-muted">Total Earned</div>
            <div className="text-2xl font-bold mt-2">{formatBudgetEUR(totalEarned)}</div>
            <div className="text-xs text-app-muted mt-1">Ingresos totales</div>
          </div>

          <div className="bg-[#16171d] border border-app rounded-lg p-4">
            <div className="text-sm text-app-muted">Active Bounties</div>
            <div className="text-2xl font-bold text-green-400 mt-2">{activeBountiesCount}</div>
            <div className="text-xs text-app-muted mt-1">Bounties vinculados</div>
          </div>

          <div className="bg-[#16171d] border border-app rounded-lg p-4">
            <div className="text-sm text-app-muted">Solutions Submitted</div>
            <div className="text-2xl font-bold text-blue-400 mt-2">{submittedCount}</div>
            <div className="text-xs text-app-muted mt-1">Enviadas</div>
          </div>

          <div className="bg-[#16171d] border border-app rounded-lg p-4">
            <div className="text-sm text-app-muted">Accepted</div>
            <div className="text-2xl font-bold text-purple-400 mt-2">{acceptedCount}</div>
            <div className="text-xs text-app-muted mt-1">Soluciones aceptadas</div>
          </div>

          <div className="bg-[#16171d] border border-app rounded-lg p-4">
            <div className="text-sm text-app-muted">Rating</div>
            <div className="text-2xl font-bold mt-2">{rating}</div>
            <div className="text-xs text-app-muted mt-1">Calificación</div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
          <div className="bg-[#16171d] border border-app rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Earnings Over Time</h3>
              <div className="text-sm text-app-muted">Últimos 6 meses</div>
            </div>
            <div className="h-64 bg-gradient-to-b from-[#111214] to-[#0f1115] rounded-md flex items-center justify-center text-app-muted">Line chart placeholder</div>
          </div>

          <div className="bg-[#16171d] border border-app rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Top Bounties</h3>
            <div className="w-full mt-2 space-y-2 text-sm">
              <div className="flex justify-between"><span>auth-system</span><span className="text-app-muted">12</span></div>
              <div className="flex justify-between"><span>payment-flow</span><span className="text-app-muted">9</span></div>
              <div className="flex justify-between"><span>api-gateway</span><span className="text-app-muted">7</span></div>
            </div>
          </div>
        </div>

        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Mis soluciones enviadas</h2>

          {solutionsError ? (
            <p className="mt-4 rounded-lg border border-red-500/40 bg-red-950/30 px-3 py-2 text-sm text-red-200" role="alert">
              No se pudieron cargar las soluciones: {solutionsError.message}
            </p>
          ) : null}

          {!solutionsError && list.length === 0 ? (
            <Card className="mt-4 border-dashed border-app bg-app-card-40">
              <CardContent className="py-10 text-center text-sm text-app-muted">
                Aún no has enviado ninguna solución. <Link href="/bounties" className="font-medium text-primary underline-offset-4 hover:underline">Ver problemas abiertos</Link>
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
                  <Card className="overflow-hidden transition-colors hover:border-app hover:shadow-primary">
                    <CardHeader className="pb-2">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <CardTitle className="text-base sm:text-lg">{s.title}</CardTitle>
                        <span className="shrink-0 rounded-full border border-app bg-app-card-60 px-2.5 py-0.5 text-xs font-medium uppercase tracking-wide text-app-muted">{statusLabel}</span>
                      </div>
                      <CardDescription className="line-clamp-2">{s.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-3 border-t border-app pt-4 text-sm text-app-muted sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                        <span className="font-medium text-primary">{formatBudgetEUR(s.price)}</span>
                        {s.problem_id ? (
                          <span className="text-app-muted">Bounty: <Link href={`/bounties/${s.problem_id}`} className="text-primary underline-offset-4 hover:text-primary hover:underline">{bountyTitle ?? "Ver detalle"}</Link></span>
                        ) : (
                          <span className="text-app-muted">Sin problema vinculado</span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-xs">
                        {s.demo_url ? (
                          <a href={s.demo_url} target="_blank" rel="noopener noreferrer" className="text-primary underline-offset-4 hover:underline">Demo</a>
                        ) : null}
                        {s.created_at ? (
                          <time dateTime={s.created_at} className="text-app-muted">{new Date(s.created_at).toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" })}</time>
                        ) : null}
                      </div>
                    </CardContent>
                  </Card>
                </li>
              );
            })}
          </ul>
        </section>
      </main>
    </div>
  );
}
