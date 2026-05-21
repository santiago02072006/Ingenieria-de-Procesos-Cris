import { notFound } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabaseServer";
import { formatBudgetEUR } from "@/lib/problems";
import type { SolutionRow } from "@/lib/solutions";
import {
  Package,
  Star,
  GitBranch,
  Users,
  Cloud,
  DollarSign,
  Share2,
} from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function SolutionDetailPage({ params }: PageProps) {
  const resolved = await params;
  const id = resolved?.id;

  if (!id) return notFound();

  const supabase = await createServerSupabaseClient();
  const { data: solution, error } = await supabase
    .from("solutions")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !solution) {
    return notFound();
  }

  const s = solution as SolutionRow & Record<string, any>;

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Hero grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: main info (span 2 cols on lg) */}
          <div className="lg:col-span-2">
            <div className="flex gap-6 items-start">
              <div className="w-28 h-28 flex-shrink-0 rounded-2xl bg-[#ef4444] flex items-center justify-center">
                <Package className="w-12 h-12 text-white" />
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-4">
                  <h1 className="text-3xl font-bold tracking-tight">{s.title}</h1>
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-red-900/40 text-red-300 border border-red-800">
                    Verified
                  </span>
                </div>

                <p className="mt-3 text-app-muted max-w-3xl">{s.description}</p>

                <div className="mt-6 flex flex-wrap items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <div>
                      <div className="font-medium">{(s as any).rating ?? "4.9"}</div>
                      <div className="text-app-muted text-xs">{(s as any).reviewsCount ?? "(234 reviews)"}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <GitBranch className="w-4 h-4 text-blue-400" />
                    <div>
                      <div className="font-medium">{(s as any).forks ?? 145}</div>
                      <div className="text-app-muted text-xs">Forks</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-green-400" />
                    <div>
                      <div className="font-medium">{(s as any).companies ?? "2.3K"}</div>
                      <div className="text-app-muted text-xs">Empresas</div>
                    </div>
                  </div>
                </div>

                {/* Tech badges */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {Array.isArray((s as any).technologies)
                    ? (s as any).technologies.map((t: string, i: number) => (
                        <span key={i} className="px-3 py-1 bg-[#0f0f12] border border-white/5 rounded-full text-xs">
                          {t}
                        </span>
                      ))
                    : null}
                </div>
              </div>
            </div>
          </div>

          {/* Right: price & actions */}
          <aside className="flex flex-col gap-4">
            <div className="text-sm text-app-muted">Precio desde</div>
            <div className="text-4xl font-extrabold text-[#ef4444]">{formatBudgetEUR(s.price)}</div>
            <div className="text-sm text-green-400">{(s as any).roi ? `+${(s as any).roi} ROI promedio` : ""}</div>

            <div className="mt-2 flex flex-col gap-3">
              {(s as any).demo_url ? (
                <a
                  href={(s as any).demo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full px-4 py-3 bg-[#ef4444] rounded-lg text-white flex items-center justify-center gap-2"
                >
                  <Cloud className="w-4 h-4" /> Ver demo
                </a>
              ) : (
                <button className="w-full px-4 py-3 bg-[#ef4444] rounded-lg text-white flex items-center justify-center gap-2 opacity-50 cursor-not-allowed" disabled>
                  <Cloud className="w-4 h-4" /> Sin demo
                </button>
              )}

              <button className="w-full px-4 py-3 bg-green-500 rounded-lg text-white flex items-center justify-center gap-2">
                <DollarSign className="w-4 h-4" /> Comprar Licencia
              </button>

              <button className="w-full px-4 py-3 bg-transparent border border-white/5 rounded-lg flex items-center justify-center gap-2">
                <GitBranch className="w-4 h-4" /> Crear Fork
              </button>

              <button className="w-full px-4 py-3 bg-transparent border border-white/5 rounded-lg flex items-center justify-center gap-2">
                <Share2 className="w-4 h-4" /> Compartir
              </button>
            </div>

            <div className="mt-6 pt-4 border-t border-white/5 text-sm text-app-muted">
              <div>Ingresos/mes</div>
              <div className="text-lg font-semibold text-green-400">{(s as any).monthlyRevenue ?? "—"}</div>
            </div>
          </aside>
        </div>

        {/* Counters row */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-6 rounded-lg bg-[#13131a] border border-white/5 text-center">
            <div className="text-2xl font-bold">99.9%</div>
            <div className="text-app-muted text-sm">Uptime</div>
          </div>
          <div className="p-6 rounded-lg bg-[#13131a] border border-white/5 text-center">
            <div className="text-2xl font-bold">A+</div>
            <div className="text-app-muted text-sm">Security Score</div>
          </div>
          <div className="p-6 rounded-lg bg-[#13131a] border border-white/5 text-center">
            <div className="text-2xl font-bold">98%</div>
            <div className="text-app-muted text-sm">Compatibilidad</div>
          </div>
          <div className="p-6 rounded-lg bg-[#13131a] border border-white/5 text-center">
            <div className="text-2xl font-bold">{(s as any).monthlyRevenue ?? "$2.4K"}</div>
            <div className="text-app-muted text-sm">Revenue/mes</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-8">
          <nav className="flex gap-6 border-b border-white/5 pb-3">
            <button className="text-red-400 border-b-2 border-red-400 pb-2">Descripción</button>
            <button className="text-app-muted">Versiones</button>
            <button className="text-app-muted">Licencias</button>
            <button className="text-app-muted">Dependencias</button>
            <button className="text-app-muted">Seguridad</button>
            <button className="text-app-muted">ROI</button>
            <button className="text-app-muted">Analytics</button>
            <button className="text-app-muted">Forks</button>
          </nav>

          <div className="mt-6 bg-[#0f0f12] border border-white/5 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3">Overview Funcional</h3>
            <div className="prose prose-invert max-w-none text-sm">
              {(s as any).long_description ?? (s as any).detailed_description ?? s.description}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
