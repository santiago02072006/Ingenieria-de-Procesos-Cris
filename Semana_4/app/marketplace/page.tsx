import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabaseServer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatBudgetEUR } from "@/lib/problems";
import type { SolutionRow } from "@/lib/solutions";
import {
  Package,
  Search,
  Filter,
  Star,
  GitBranch,
  Users,
  Shield,
  Activity,
  ArrowRight,
} from "lucide-react";

export default async function MarketplacePage(props: { searchParams?: { q?: string } } = {}) {
  const searchParams = props.searchParams;
  const q = (searchParams?.q ?? "").trim();

  const supabase = await createServerSupabaseClient();
  let query = supabase
    .from("solutions")
    .select("id,title,description,price,demo_url,status,created_at")
    .order("created_at", { ascending: false });

  if (q) {
    // Filtrar por título o descripción (server-side, evita hooks)
    query = query.or(`title.ilike.%${q}%,description.ilike.%${q}%`);
  }

  const { data: solutions, error } = await query;
  const catalog = (solutions ?? []) as SolutionRow[];

  // Visual-only categories (static for server render)
  const categories = [
    { id: "all", label: "Todos", icon: Package },
    { id: "logistics", label: "Logística", icon: Activity },
    { id: "inventory", label: "Inventario", icon: Package },
    { id: "automation", label: "Automatización", icon: Filter },
    { id: "finance", label: "Finanzas", icon: GitBranch },
    { id: "hr", label: "Recursos Humanos", icon: Users },
    { id: "analytics", label: "Analytics", icon: Star },
  ];

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
          {/* Search + Filters (visual-only) */}
          <div className="mt-6">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <form method="get" action="/marketplace" className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    name="q"
                    defaultValue={q}
                    aria-label="Buscar"
                    placeholder="Buscar por nombre, tecnología, industria..."
                    style={{ background: "#0a0a0f" }}
                    className="w-full pl-12 pr-4 py-3 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </form>
              </div>

              <div className="flex items-center gap-3">
                <button className="hidden sm:inline-flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg hover:bg-muted transition-colors">
                  <Filter className="w-4 h-4" />
                  Filtros Avanzados
                </button>
              </div>
            </div>

            {/* Category pills (visual-only) */}
            <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
              {categories.map((cat, i) => {
                const Icon = cat.icon;
                const selected = i === 0; // first selected visually
                return (
                  <div
                    key={cat.id}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                      selected ? "bg-primary text-white" : "bg-card border border-border text-foreground hover:bg-muted"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {cat.label}
                  </div>
                );
              })}
            </div>
          </div>
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
        <ul className="mt-12 grid gap-6 grid-cols-1">
          {catalog.map((s) => (
            <li key={s.id} className="flex">
              <Card className="flex w-full flex-col border-app transition-colors hover:border-app hover:shadow-primary">
                <div className="flex gap-6 p-6">
                  {/* Preview */}
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
                      <Package className="w-10 h-10 text-white" />
                    </div>
                    {s.status && (
                      <div className="mt-2 px-2 py-1 bg-primary/20 text-primary text-xs rounded flex items-center gap-1 justify-center">
                        {s.status}
                      </div>
                    )}
                  </div>

                  {/* Main content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">{s.title}</h3>
                        <p className="text-app-muted mb-3 line-clamp-3">{s.description}</p>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {/* visual-only tech badges (if available) */}
                          {Array.isArray((s as any).technologies)
                            ? (s as any).technologies.slice(0, 4).map((t: string, idx: number) => (
                                <span key={idx} className="px-2 py-1 bg-background border border-border rounded text-xs">
                                  {t}
                                </span>
                              ))
                            : null}
                        </div>

                        <div className="grid grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Star className="w-4 h-4 text-yellow-500" />
                            <div>
                              <div className="font-medium">{(s as any).reputation ?? "—"}</div>
                              <div className="text-app-muted text-xs">Rating</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <GitBranch className="w-4 h-4 text-blue-500" />
                            <div>
                              <div className="font-medium">{(s as any).forks ?? "—"}</div>
                              <div className="text-app-muted text-xs">Forks</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-green-500" />
                            <div>
                              <div className="font-medium">{(s as any).usage ?? "—"}</div>
                              <div className="text-app-muted text-xs">Uso</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4 text-purple-500" />
                            <div>
                              <div className="font-medium">{(s as any).securityScore ?? "—"}</div>
                              <div className="text-app-muted text-xs">Seguridad</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Pricing & CTA */}
                      <div className="text-right ml-6">
                        <div className="mb-2">
                          <div className="text-xs text-app-muted mb-1">Desde</div>
                          <div className="text-3xl font-bold text-primary">{formatBudgetEUR(s.price)}</div>
                        </div>
                        <div className="text-xs text-green-500 mb-4">{(s as any).roi ?? ""}</div>

                        <div className="space-y-2">
                          <a
                            href={`/solutions/${s.id}`}
                            className="w-full inline-flex px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium transition-all items-center justify-center gap-2"
                          >
                            Ver Detalles
                            <ArrowRight className="w-4 h-4" />
                          </a>
                          <a className="w-full inline-flex px-4 py-2 bg-background border border-border hover:bg-muted text-foreground rounded-lg text-sm font-medium transition-all justify-center">
                            Demo en Vivo
                          </a>
                        </div>

                        <div className="mt-4 pt-4 border-t border-border text-sm text-app-muted">
                          <div>Ingresos/mes</div>
                          <div className="text-sm font-semibold text-green-500">{(s as any).monthlyRevenue ?? "—"}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
