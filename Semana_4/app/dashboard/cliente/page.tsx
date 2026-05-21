import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabaseServer";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Code2, Home, Target, TrendingUp, Cloud, DollarSign, FileText, Shield, BarChart3, Settings, Bell, Search as SearchIcon } from "lucide-react";
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

  // Flatten solutions for visual lists
  const allSolutions = Array.from(solutionsByProblem.values()).flat();
  const acceptedProjects = allSolutions.filter((s) => s.status === "accepted");

  // Derived metrics (best-effort from available fields)
  const totalEarningsNumber = allSolutions.reduce((sum, s) => sum + (Number((s as any).price) || 0), 0);
  const passiveRoyaltiesNumber = Math.round(totalEarningsNumber * 0.12);
  const reutilizationsCount = allSolutions.length || 0;
  const createdModulesCount = new Set(allSolutions.map((s) => s.title)).size;
  const reputation = 4.8;

  return (
    <div className="min-h-screen flex bg-[#0d0e12] text-app-foreground">
      {/* Sidebar left - full height */}
      <aside className="w-64 hidden lg:flex flex-col border-r border-app bg-[#0f1014] px-4 py-6">
        <div className="mb-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
            <Code2 className="w-4 h-4 text-white" />
          </div>
          <div className="font-semibold">DevSolve</div>
        </div>
        <nav className="flex-1 space-y-2 text-sm">
          <Link href="/dashboard/client" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-app-card-60">
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
            <span>ROI</span>
          </Link>
        </nav>
        <div className="mt-6">
          <Link href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg text-app-muted hover:bg-app-card-60">
            <Settings className="w-4 h-4" />
            <span>Configuración</span>
          </Link>
        </div>
      </aside>

      {/* Main content area */}
      <main className="flex-1 p-8">
        {/* Header */}
        <header className="flex items-start justify-between mb-6">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-primary">Dashboard</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">Área de cliente</h1>
            <p className="text-sm text-app-muted mt-1">{`Hola${user.email ? `, ${user.email}` : ""}.`}</p>
          </div>

          <div className="flex items-center gap-4">
            <form method="get" action="/dashboard/client" className="relative">
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

        {/* Row 1: Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-[#16171d] border border-app rounded-lg p-4">
            <div className="text-sm text-app-muted">Total Earnings</div>
            <div className="text-2xl font-bold mt-2">{formatBudgetEUR(totalEarningsNumber)}</div>
            <div className="text-xs text-app-muted mt-1">Ingresos totales</div>
          </div>

          <div className="bg-[#16171d] border border-app rounded-lg p-4">
            <div className="text-sm text-app-muted">Passive Royalties</div>
            <div className="text-2xl font-bold text-green-400 mt-2">{formatBudgetEUR(passiveRoyaltiesNumber)}</div>
            <div className="text-xs text-app-muted mt-1">+12% estimado</div>
          </div>

          <div className="bg-[#16171d] border border-app rounded-lg p-4">
            <div className="text-sm text-app-muted">Reutilizaciones</div>
            <div className="text-2xl font-bold text-blue-400 mt-2">{reutilizationsCount}</div>
            <div className="text-xs text-app-muted mt-1">Módulos reutilizados</div>
          </div>

          <div className="bg-[#16171d] border border-app rounded-lg p-4">
            <div className="text-sm text-app-muted">Módulos creados</div>
            <div className="text-2xl font-bold text-purple-400 mt-2">{createdModulesCount}</div>
            <div className="text-xs text-app-muted mt-1">Componentes</div>
          </div>

          <div className="bg-[#16171d] border border-app rounded-lg p-4">
            <div className="text-sm text-app-muted">Reputación</div>
            <div className="text-2xl font-bold mt-2">{reputation}</div>
            <div className="text-xs text-app-muted mt-1">Top 5%</div>
          </div>
        </div>

      {/* Tools + Active Projects */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Tus Herramientas Empresariales</h3>
          {allSolutions.length === 0 ? (
            <p className="text-sm text-app-muted">Aún no tienes herramientas empresariales. Acepta una solución para que aparezca aquí.</p>
          ) : (
            <ul className="space-y-3">
              {allSolutions.map((s) => (
                <li key={s.id} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{s.title}</div>
                    <div className="text-sm text-app-muted">{s.description?.slice(0, 80) ?? ""}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-app-muted">Desde</div>
                    <div className="font-semibold text-primary">{formatBudgetEUR(s.price)}</div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Proyectos Activos</h3>
          {acceptedProjects.length === 0 ? (
            <p className="text-sm text-app-muted">No hay proyectos aceptados todavía.</p>
          ) : (
            <ul className="space-y-3">
              {acceptedProjects.map((s) => (
                <li key={s.id} className="flex items-center justify-between">
                  <div className="min-w-0">
                    <div className="font-medium truncate">{s.title}</div>
                    <div className="text-xs text-app-muted">Aceptada</div>
                  </div>
                  <div className="text-right text-sm text-primary font-semibold">{formatBudgetEUR(s.price)}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Row 2: Charts */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
        <div className="bg-[#16171d] border border-app rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Historial Financiero</h3>
            <div className="text-sm text-app-muted">Últimos 6 meses</div>
          </div>
          <div className="h-64 bg-gradient-to-b from-[#111214] to-[#0f1115] rounded-md flex items-center justify-center text-app-muted">
            {/* Placeholder for line chart */}
            <div>Line chart placeholder</div>
          </div>
        </div>

        <div className="bg-[#16171d] border border-app rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Módulos Más Usados</h3>
          <div className="flex flex-col items-center">
            <div className="w-40 h-40 rounded-full bg-gradient-to-tr from-[#101217] to-[#11131a] flex items-center justify-center mb-4" style={{ background: 'conic-gradient(#ef4444 0 25%, #06b6d4 0 50%, #8b5cf6 0 75%, #f97316 0 100%)' }}>
              <div className="w-28 h-28 rounded-full bg-[#0d0e12] flex items-center justify-center text-sm">Donut</div>
            </div>
            <ul className="w-full mt-2 space-y-2">
              <li className="flex justify-between text-sm"><span>auth-system</span><span className="text-app-muted">120</span></li>
              <li className="flex justify-between text-sm"><span>api-gateway</span><span className="text-app-muted">98</span></li>
              <li className="flex justify-between text-sm"><span>payment-flow</span><span className="text-app-muted">76</span></li>
              <li className="flex justify-between text-sm"><span>analytics-core</span><span className="text-app-muted">45</span></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Row 3: Active Contracts / Problems */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Contratos Activos</h3>
          <Link href="/bounties" className="text-sm text-primary">Ver todos</Link>
        </div>

        <div className="space-y-4">
          {list.length === 0 ? (
            <Card className="border-dashed border-app bg-app-card-40">
              <CardContent className="py-8 text-center text-sm text-app-muted">No hay problemas publicados aún.</CardContent>
            </Card>
          ) : (
            <ul className="space-y-4">
              {list.map((p) => (
                <li key={p.id}>
                  <Card className="border-app">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-base">{p.title}</CardTitle>
                          <CardDescription className="text-sm">{p.description}</CardDescription>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-app-muted">Presupuesto</div>
                          <div className="font-semibold text-primary">{formatBudgetEUR(p.budget)}</div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="border-t border-app">
                      <ProblemSolutionsList problemId={p.id} problemClosed={p.status === 'closed'} solutions={solutionsByProblem.get(p.id) ?? []} />
                    </CardContent>
                  </Card>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      </main>
    </div>
  );
}
