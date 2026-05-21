import Link from "next/link";
import { notFound } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabaseServer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatBudgetEUR, type ProblemRow } from "@/lib/problems";
import { SubmitSolutionPanel } from "./submit-solution-panel";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function BountyDetailPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();

  const { data: problem, error } = await supabase
    .from("problems")
    .select("id,title,description,budget,status,category,created_at")
    .eq("id", id)
    .eq("status", "open")
    .maybeSingle();

  if (error || !problem) {
    notFound();
  }

  const p = problem as ProblemRow & { category?: string | null };

  return (
    <div className="relative mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/35 to-transparent" aria-hidden />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button href="/bounties" variant="ghost" size="sm">
          ← Volver al tablero
        </Button>
        <span className="rounded-full border border-zinc-700/80 px-3 py-1 text-xs font-medium uppercase tracking-wide text-zinc-400">
          Abierto
        </span>
      </div>

      <article className="mt-8">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-100 sm:text-4xl">{p.title}</h1>
        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-zinc-500">
          <span className="font-semibold text-indigo-300">{formatBudgetEUR(p.budget)}</span>
          {p.category ? (
            <span className="rounded-md border border-zinc-800 bg-zinc-900/50 px-2 py-0.5 text-zinc-400">{p.category}</span>
          ) : null}
          {p.created_at ? (
            <time dateTime={p.created_at}>
              {new Date(p.created_at).toLocaleDateString("es-ES", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </time>
          ) : null}
        </div>

        <Card className="mt-8 border-zinc-800/90">
          <CardHeader>
            <CardTitle className="text-lg">Descripción</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 border-t border-zinc-800/80 pt-6">
            <div className="whitespace-pre-wrap text-base leading-relaxed text-zinc-300">{p.description}</div>
            <p className="text-xs text-zinc-600">
              ID de problema: <span className="font-mono text-zinc-500">{p.id}</span>
            </p>
          </CardContent>
        </Card>
      </article>

      <div className="mt-10 space-y-4">
        <SubmitSolutionPanel problemId={p.id} problemOpen={p.status === "open"} />
        <p className="text-center text-sm text-zinc-500">
          ¿Eres cliente?{" "}
          <Link href="/dashboard/cliente" className="text-indigo-400 underline-offset-4 hover:underline">
            Panel de cliente
          </Link>
        </p>
      </div>
    </div>
  );
}
