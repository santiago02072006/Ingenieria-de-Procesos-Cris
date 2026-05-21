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
      <p className="mt-4 rounded-lg border border-dashed border-app bg-app-card-40 px-3 py-4 text-center text-sm text-app-muted">
        Aún no hay propuestas para este problema.
      </p>
    );
  }

  return (
    <div className="mt-4 space-y-3">
      <h3 className="text-sm font-medium text-app-muted">
        Soluciones recibidas <span className="text-app-muted">({solutions.length})</span>
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
                    "border-app bg-app-card-30",
                    isWinner ? "border-emerald-500/40 ring-1 ring-emerald-500/25 border-emerald-500/50 bg-emerald-500/5" : "",
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
                    <span className="shrink-0 rounded-full border border-app bg-app-card-60 px-2.5 py-0.5 text-xs font-medium uppercase tracking-wide text-app-muted">
                      {statusLabel(s.status)}
                    </span>
                  </div>
                  <CardDescription className="mt-2 whitespace-pre-wrap text-app-muted">{s.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4 border-t border-app pt-4 sm:flex-row sm:items-end sm:justify-between">
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="text-app-muted">Precio solicitado: </span>
                      <span className="font-medium text-primary">{formatBudgetEUR(s.price)}</span>
                    </p>
                    {s.demo_url ? (
                      <p>
                        <span className="text-app-muted">Demo: </span>
                        <a href={s.demo_url} target="_blank" rel="noopener noreferrer" className="text-primary underline-offset-4 hover:text-primary hover:underline">
                          Ver demo
                        </a>
                      </p>
                    ) : (
                      <p className="text-app-muted">Sin enlace de demo</p>
                    )}
                    {s.created_at ? (
                      <p className="text-xs text-app-muted">
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
                    disabled={problemClosed || isWinner}
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
