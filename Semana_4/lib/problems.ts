export type ProblemStatus = "open" | string;

export type ProblemRow = {
  id: string;
  client_id: string;
  title: string;
  description: string;
  budget: number | string;
  status: ProblemStatus;
  category?: string | null;
  created_at?: string;
};

const currencyFmt = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

export function formatBudgetEUR(value: number | string): string {
  const n = typeof value === "string" ? Number.parseFloat(value) : value;
  return currencyFmt.format(Number.isFinite(n) ? n : 0);
}
