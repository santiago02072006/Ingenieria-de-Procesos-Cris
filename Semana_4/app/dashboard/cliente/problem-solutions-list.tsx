import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatBudgetEUR } from "@/lib/problems";
import type { SolutionRow } from "@/lib/solutions";
import { AcceptSolutionButton } from "./accept-solution-button";

type ProblemSolutionsListProps = {
  problemId: string;
  problemClosed: boolean;
  solutions: SolutionRow[];
};

function statusLabel(status: string | null): string {
  const labels: Record<string, string> = {
    submitted: "Enviada",
    reviewing: "En revisión",
    accepted: "Aceptada",
    rejected: "Rechazada",
  };
  if (!status) return "Sin estado";
  return labels[status] ?? status;
}

export function ProblemSolutionsList({ problemId, problemClosed, solutions }: ProblemSolutionsListProps) {
  if (solutions.length === 0) {
    return (
      <p className="mt-4 rounded-lg border border-dashed border-zinc-800 bg-zinc-950/40 px-3 py-4 text-center text-sm text-zinc-500">
        Aún no hay propuestas para este problema.
      </p>
    );
  }

  return (
    <div className="mt-4 space-y-3">
      <h3 className="text-sm font-medium text-zinc-300">
        Soluciones recibidas <span className="text-zinc-500">({solutions.length})</span>
      </h3>
      {problemClosed ? (
        <p className="rounded-lg border border-emerald-500/30 bg-emerald-950/25 px-3 py-2 text-sm text-emerald-100">
          Problema cerrado. La propuesta aceptada fue la solución ganadora.
        </p>
      ) : null}
      <ul className="space-y-3">
        {solutions.map((s) => {
          const isWinner = s.status === "accepted";
          const canAccept = !problemClosed && !isWinner;

          let disabledReason: string | undefined;
          if (problemClosed) {
            disabledReason = isWinner ? undefined : "El problema ya está cerrado";
          } else if (isWinner) {
            disabledReason = "Ya aceptada";
          }

          return (
            <li key={s.id}>
              <Card
                className={[
                  "border-zinc-800/80 bg-zinc-950/30",
                  isWinner ? "border-emerald-500/40 ring-1 ring-emerald-500/25" : "",
                  problemClosed && !isWinner ? "opacity-60" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                <CardHeader className="pb-2">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-base">{s.title}</CardTitle>
                      {isWinner ? (
                        <span className="mt-1 inline-block text-xs font-semibold uppercase tracking-wide text-emerald-400">
                          Solución ganadora
                        </span>
                      ) : null}
                    </div>
                    <span className="shrink-0 rounded-full border border-zinc-700 bg-zinc-950/60 px-2.5 py-0.5 text-xs font-medium uppercase tracking-wide text-zinc-400">
                      {statusLabel(s.status)}
                    </span>
                  </div>
                  <CardDescription className="mt-2 whitespace-pre-wrap text-zinc-400">{s.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4 border-t border-zinc-800/80 pt-4 sm:flex-row sm:items-end sm:justify-between">
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="text-zinc-500">Precio solicitado: </span>
                      <span className="font-medium text-indigo-300">{formatBudgetEUR(s.price)}</span>
                    </p>
                    {s.demo_url ? (
                      <p>
                        <span className="text-zinc-500">Demo: </span>
                        <a
                          href={s.demo_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-400 underline-offset-4 hover:text-indigo-300 hover:underline"
                        >
                          Ver demo
                        </a>
                      </p>
                    ) : (
                      <p className="text-zinc-600">Sin enlace de demo</p>
                    )}
                    {s.created_at ? (
                      <p className="text-xs text-zinc-600">
                        Enviada{" "}
                        {new Date(s.created_at).toLocaleDateString("es-ES", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    ) : null}
                  </div>
                  <AcceptSolutionButton
                    solutionId={s.id}
                    problemId={problemId}
                    disabled={!canAccept}
                    disabledReason={disabledReason}
                  />
                </CardContent>
              </Card>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
