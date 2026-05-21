"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const fieldBase =
  "w-full rounded-lg border border-zinc-800 bg-zinc-900/55 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500";

type SubmitSolutionPanelProps = {
  problemId: string;
  problemOpen: boolean;
};

export function SubmitSolutionPanel({ problemId, problemOpen }: SubmitSolutionPanelProps) {
  const router = useRouter();
  const descId = useId();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [demoUrl, setDemoUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [roleGate, setRoleGate] = useState<"unknown" | "ok" | "login" | "wrong-role">("unknown");

  async function ensureDeveloper(): Promise<boolean> {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setRoleGate("login");
      return false;
    }
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
    if (profile?.role !== "desarrollador") {
      setRoleGate("wrong-role");
      return false;
    }
    setRoleGate("ok");
    return true;
  }

  async function handleOpenForm() {
    setError(null);
    setSuccess(null);
    const ok = await ensureDeveloper();
    if (!ok) return;
    setOpen(true);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!problemOpen) {
      setError("Este problema ya no acepta soluciones.");
      return;
    }

    const priceNum = Number.parseFloat(price);
    if (!title.trim()) {
      setError("El título de la solución es obligatorio.");
      return;
    }
    if (!description.trim()) {
      setError("La descripción es obligatoria.");
      return;
    }
    if (!Number.isFinite(priceNum) || priceNum < 0) {
      setError("Indica un precio válido (mayor o igual a 0).");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setRoleGate("login");
      setLoading(false);
      return;
    }

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
    if (profile?.role !== "desarrollador") {
      setRoleGate("wrong-role");
      setLoading(false);
      return;
    }

    const demo = demoUrl.trim();
    const { error: insertError } = await supabase.from("solutions").insert({
      problem_id: problemId,
      developer_id: user.id,
      title: title.trim(),
      description: description.trim(),
      price: priceNum,
      demo_url: demo.length > 0 ? demo : null,
      status: "submitted",
    });

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }

    setTitle("");
    setDescription("");
    setPrice("");
    setDemoUrl("");
    setOpen(false);
    setLoading(false);
    setSuccess("Solución enviada. Puedes seguir el estado en tu dashboard de desarrollador.");
    router.refresh();
  }

  if (!problemOpen) {
    return (
      <Card className="border-zinc-800/90">
        <CardHeader>
          <CardTitle className="text-base">Envío de soluciones</CardTitle>
          <CardDescription>Este problema no está abierto; no se aceptan nuevas propuestas.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="border-zinc-800/90">
      <CardHeader>
        <CardTitle className="text-base">Propuesta de solución</CardTitle>
        <CardDescription>
          Completa los datos de tu oferta. Se guardará en <span className="font-mono text-zinc-500">solutions</span> vinculada a este bounty.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {roleGate === "login" ? (
          <p className="rounded-lg border border-zinc-800 bg-zinc-950/50 px-3 py-2 text-sm text-zinc-300">
            Debes iniciar sesión como desarrollador para enviar una solución.{" "}
            <Link href="/login" className="font-medium text-indigo-400 underline-offset-4 hover:underline">
              Ir a login
            </Link>
          </p>
        ) : null}
        {roleGate === "wrong-role" ? (
          <p className="rounded-lg border border-amber-500/30 bg-amber-950/25 px-3 py-2 text-sm text-amber-100">
            Solo cuentas con rol <strong>desarrollador</strong> pueden enviar soluciones. Si eres cliente, revisa el dashboard correspondiente.
          </p>
        ) : null}

        {success ? (
          <p className="rounded-lg border border-emerald-500/30 bg-emerald-950/25 px-3 py-2 text-sm text-emerald-100" role="status">
            {success}{" "}
            <Link href="/dashboard/desarrollador" className="font-medium text-indigo-300 underline-offset-4 hover:underline">
              Ver mis soluciones
            </Link>
          </p>
        ) : null}

        {!open ? (
          <Button type="button" onClick={handleOpenForm}>
            Enviar solución
          </Button>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <Input
              name="title"
              label="Título de la solución"
              placeholder="Ej. Integración lista en 2 semanas"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <div className="flex w-full flex-col gap-1.5">
              <label htmlFor={descId} className="text-sm font-medium text-zinc-300">
                Descripción
              </label>
              <textarea
                id={descId}
                name="description"
                rows={5}
                placeholder="Alcance técnico, entregables y supuestos…"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={`${fieldBase} min-h-[140px] resize-y`}
              />
            </div>
            <Input
              name="price"
              type="number"
              inputMode="decimal"
              min={0}
              step="0.01"
              label="Precio (EUR)"
              placeholder="2500"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
            <Input
              name="demo_url"
              type="url"
              label="URL de demo (opcional)"
              placeholder="https://…"
              value={demoUrl}
              onChange={(e) => setDemoUrl(e.target.value)}
            />
            {error ? (
              <p className="rounded-lg border border-red-500/40 bg-red-950/40 px-3 py-2 text-sm text-red-200" role="alert">
                {error}
              </p>
            ) : null}
            <div className="flex flex-wrap gap-3">
              <Button type="submit" disabled={loading}>
                {loading ? "Enviando…" : "Confirmar envío"}
              </Button>
              <Button type="button" variant="outline" disabled={loading} onClick={() => setOpen(false)}>
                Cancelar
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
