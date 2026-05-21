"use client";

import { useId, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const fieldBase =
  "w-full rounded-lg border border-app bg-app-surface-55 px-3 py-2 text-sm text-app-foreground placeholder-app-muted transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary";

export function CreateProblemForm() {
  const router = useRouter();
  const descId = useId();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const budgetNum = Number.parseFloat(budget);
    if (!title.trim()) {
      setError("El título es obligatorio.");
      return;
    }
    if (!description.trim()) {
      setError("La descripción es obligatoria.");
      return;
    }
    if (!Number.isFinite(budgetNum) || budgetNum < 0) {
      setError("Indica un presupuesto válido (número mayor o igual a 0).");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("No hay sesión. Vuelve a iniciar sesión.");
      setLoading(false);
      return;
    }

    const { error: insertError } = await supabase.from("problems").insert({
      title: title.trim(),
      description: description.trim(),
      budget: budgetNum,
      client_id: user.id,
      status: "open",
    });

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }

    setTitle("");
    setDescription("");
    setBudget("");
    setLoading(false);
    router.refresh();
  }

  return (
    <Card className="border-app">
      <CardHeader>
        <CardTitle>Publicar un problema</CardTitle>
        <CardDescription>Los datos se guardan en Supabase y quedan visibles en Bounties mientras el estado sea abierto.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <Input
            name="title"
            label="Título"
            placeholder="Ej. Integración CRM con nóminas"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoComplete="off"
          />
          <div className="flex w-full flex-col gap-1.5">
            <label htmlFor={descId} className="text-sm font-medium text-app-muted">
              Descripción
            </label>
            <textarea
              id={descId}
              name="description"
              rows={4}
              placeholder="Contexto, alcance y criterios de éxito…"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`${fieldBase} min-h-[120px] resize-y`}
            />
          </div>
          <Input
            name="budget"
            type="number"
            inputMode="decimal"
            min={0}
            step="0.01"
            label="Presupuesto (EUR)"
            placeholder="5000"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
          />
          {error ? (
            <p className="rounded-lg border border-red-500/40 bg-red-950/40 px-3 py-2 text-sm text-red-200" role="alert">
              {error}
            </p>
          ) : null}
          <Button type="submit" disabled={loading}>
            {loading ? "Guardando…" : "Publicar problema"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
