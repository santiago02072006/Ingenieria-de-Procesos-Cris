"use client";

import { useId, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Sparkles, DollarSign, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function PublishChallengeClient() {
  const router = useRouter();
  const id = useId();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    budget: "",
    deadline: "",
    requirements: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const steps = [
    { number: 1, title: "Definir Problema",        description: "Describe tu desafío operativo" },
    { number: 2, title: "Flujo Operativo",          description: "Detalla el proceso actual" },
    { number: 3, title: "Restricciones Técnicas",   description: "Especifica requisitos técnicos" },
    { number: 4, title: "Datos de Ejemplo",         description: "Proporciona ejemplos de datos" },
    { number: 5, title: "ROI Esperado",             description: "Define métricas de éxito" },
    { number: 6, title: "Presupuesto",              description: "Establece inversión y plazos" },
    { number: 7, title: "Revisión Final",           description: "Confirma y publica" },
  ];

  function updateField<K extends keyof typeof formData>(key: K, value: string) {
    setFormData((s) => ({ ...s, [key]: value }));
  }

  function goNext() {
    setError(null);
    if (step === 1) {
      if (!formData.title.trim()) { setError("El título es obligatorio."); return; }
      if (!formData.description.trim()) { setError("La descripción es obligatoria."); return; }
    }
    if (step === 6) {
      const budgetNum = Number.parseFloat(formData.budget || "0");
      if (!Number.isFinite(budgetNum) || budgetNum < 0) {
        setError("Indica un presupuesto válido (número mayor o igual a 0).");
        return;
      }
    }
    setStep((s) => Math.min(7, s + 1));
  }

  function goBack() {
    setError(null);
    setStep((s) => Math.max(1, s - 1));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!formData.title.trim()) { setError("El título es obligatorio."); setStep(1); return; }
    if (!formData.description.trim()) { setError("La descripción es obligatoria."); setStep(1); return; }
    const budgetNum = Number.parseFloat(formData.budget || "0");
    if (!Number.isFinite(budgetNum) || budgetNum < 0) {
      setError("Indica un presupuesto válido (número mayor o igual a 0).");
      setStep(6);
      return;
    }

    setLoading(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) { setError("No hay sesión. Vuelve a iniciar sesión."); setLoading(false); return; }

      const { error: insertError } = await supabase.from("problems").insert({
        title: formData.title.trim(),
        description: formData.description.trim(),
        budget: budgetNum,
        client_id: user.id,
        status: "open",
      });

      if (insertError) { setError(insertError.message); setLoading(false); return; }

      setLoading(false);
      router.push("/bounties");
    } catch (err: any) {
      setError(err?.message ?? String(err));
      setLoading(false);
    }
  }

  function handleFormKeyDown(e: React.KeyboardEvent<HTMLFormElement>) {
    if (e.key !== "Enter") return;
    const tag = (e.target as HTMLElement).tagName;
    if (tag === "TEXTAREA") return;
    e.preventDefault();
    if (step < 7) goNext();
  }

  const currentStep = steps.find((x) => x.number === step)!;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 grid lg:grid-cols-3 gap-8">

      {/* ── Main Column ─────────────────────────────────────────────────── */}
      <main className="lg:col-span-2">

        {/* Page heading */}
        <div className="mb-6">
          <h1 className="text-4xl font-bold mb-2">Publicar Nuevo Desafío</h1>
          <p className="text-sm text-muted-foreground">
            Sigue los pasos para publicar y atraer desarrolladores calificados.
          </p>
        </div>

        {/* Step indicator */}
        <div className="mb-6 flex items-center gap-1 overflow-x-auto pb-2">
          {steps.map((s, idx) => (
            <div key={s.number} className="flex items-center gap-1 shrink-0">
              <div className="flex flex-col items-center min-w-[72px]">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-colors ${
                    step > s.number
                      ? "bg-primary text-white"
                      : step === s.number
                      ? "bg-primary text-white ring-4 ring-primary/20"
                      : "bg-card border border-border text-muted-foreground"
                  }`}
                >
                  {step > s.number ? <CheckCircle2 className="w-5 h-5" /> : s.number}
                </div>
                <div className="text-xs text-center mt-1.5 font-medium leading-tight max-w-[80px]">
                  {s.title}
                </div>
              </div>
              {idx < steps.length - 1 && (
                <div
                  className={`w-8 h-0.5 shrink-0 transition-colors ${
                    step > s.number ? "bg-primary" : "bg-border"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step card + form */}
        <form onSubmit={handleSubmit} onKeyDown={handleFormKeyDown} className="space-y-6">
          <Card className="border-border">
            <CardHeader>
              <CardTitle>{currentStep.title}</CardTitle>
              <CardDescription>{currentStep.description}</CardDescription>
            </CardHeader>

            <CardContent>

              {/* ── Step 1: Definir Problema ─────────────────────────── */}
              {step === 1 && (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground block mb-1">
                      Título del Proyecto
                    </label>
                    <input
                      name="title"
                      value={formData.title}
                      onChange={(e) => updateField("title", e.target.value)}
                      placeholder="Ej. Integración CRM con nóminas"
                      autoComplete="off"
                      style={{ backgroundColor: "var(--background)", color: "var(--foreground)" }}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground block mb-1">
                      Categoría
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => updateField("category", e.target.value)}
                      style={{ backgroundColor: "var(--background)", color: "var(--foreground)" }}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    >
                      <option value="">Selecciona una categoría (opcional)</option>
                      <option value="integrations">Integraciones</option>
                      <option value="automation">Automatización</option>
                      <option value="analytics">Analítica</option>
                    </select>
                    <p className="text-xs text-muted-foreground mt-1">
                      La categoría es puramente visual en este formulario.
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground block mb-1">
                      Descripción Detallada
                    </label>
                    <textarea
                      name="description"
                      rows={6}
                      value={formData.description}
                      onChange={(e) => updateField("description", e.target.value)}
                      placeholder="Contexto, alcance y criterios de éxito…"
                      style={{ backgroundColor: "var(--background)", color: "var(--foreground)" }}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground min-h-[140px] resize-y focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                  </div>
                </div>
              )}

              {/* ── Steps 2-5: Placeholder ───────────────────────────── */}
              {step >= 2 && step <= 5 && (
                <div className="py-16 text-center text-muted-foreground">
                  <div className="text-lg font-medium mb-2">{currentStep.title}</div>
                  <div className="text-sm">{currentStep.description}</div>
                </div>
              )}

              {/* ── Step 6: Presupuesto y Plazos ─────────────────────── */}
              {step === 6 && (
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Budget */}
                    <div>
                      <label className="text-sm font-medium text-muted-foreground block mb-1">
                        Presupuesto
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                          name="budget"
                          type="number"
                          inputMode="decimal"
                          min={0}
                          step="0.01"
                          placeholder="5000"
                          value={formData.budget}
                          onChange={(e) => updateField("budget", e.target.value)}
                          style={{ backgroundColor: "var(--background)", color: "var(--foreground)" }}
                          className="w-full pl-9 pr-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                        />
                      </div>
                    </div>

                    {/* Deadline — decorative */}
                    <div>
                      <label className="text-sm font-medium text-muted-foreground block mb-1">
                        Fecha Límite (decorativa)
                      </label>
                      <input
                        type="date"
                        style={{ backgroundColor: "var(--background)", color: "var(--foreground)" }}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                      />
                    </div>
                  </div>

                  {/* Suggestion banner */}
                  <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 text-sm text-foreground">
                    <strong>Sugerencia del Sistema:</strong>{" "}
                    El plazo promedio de la industria para desafíos similares es de{" "}
                    <span className="text-primary font-medium">8-12 semanas</span>.
                  </div>
                </div>
              )}

              {/* ── Step 7: Revisión Final ───────────────────────────── */}
              {step === 7 && (
                <div className="space-y-4">
                  <div className="space-y-3">
                    <div className="rounded-lg border border-border bg-card p-4">
                      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                        Título
                      </div>
                      <div className="text-foreground font-medium">
                        {formData.title || <span className="text-muted-foreground">—</span>}
                      </div>
                    </div>

                    <div className="rounded-lg border border-border bg-card p-4">
                      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                        Descripción
                      </div>
                      <div className="text-foreground text-sm whitespace-pre-wrap">
                        {formData.description || <span className="text-muted-foreground">—</span>}
                      </div>
                    </div>

                    <div className="rounded-lg border border-border bg-card p-4">
                      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                        Presupuesto
                      </div>
                      <div className="text-foreground font-medium">
                        {formData.budget
                          ? `$${Number(formData.budget).toLocaleString()}`
                          : <span className="text-muted-foreground">—</span>}
                      </div>
                    </div>
                  </div>

                  {/* Ready-to-publish banner */}
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                    <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-green-500">Listo para Publicar</div>
                      <div className="text-sm text-muted-foreground mt-0.5">
                        Este desafío será visible para más de 5,000 desarrolladores.
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Error message */}
              {error && (
                <p
                  className="mt-4 rounded-lg border border-red-500/40 bg-red-950/30 px-3 py-2 text-sm text-red-200"
                  role="alert"
                >
                  {error}
                </p>
              )}

              {/* Navigation buttons */}
              <div className="mt-6 grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={goBack}
                  disabled={step === 1}
                  className="flex items-center justify-center gap-2 w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Anterior
                </button>

                {step < 7 ? (
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); goNext(); }}
                    className="flex items-center justify-center gap-2 w-full rounded-lg bg-primary hover:bg-primary/90 px-4 py-2.5 text-sm font-semibold text-white transition-colors"
                  >
                    Continuar
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center justify-center gap-2 w-full rounded-lg bg-emerald-600 hover:bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    {loading ? "Publicando…" : "Publicar Desafío"}
                  </button>
                )}
              </div>

            </CardContent>
          </Card>
        </form>
      </main>

      {/* ── Sidebar ─────────────────────────────────────────────────────── */}
      <aside className="lg:col-span-1">
        <div className="sticky top-24 space-y-4">
          <div className="rounded-xl overflow-hidden border border-border">

            {/* Sidebar header */}
            <div className="p-4 bg-gradient-to-br from-primary to-accent text-white flex items-start gap-3">
              <Sparkles className="w-6 h-6 shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold">Intérprete Técnico AI</div>
                <div className="text-sm opacity-80">Asistente inteligente</div>
              </div>
            </div>

            {/* Sidebar body */}
            <div className="p-4 bg-[#0d0e12] space-y-3">

              <div className="rounded-lg bg-[#0b0c10] border border-white/5 p-3">
                <div className="text-sm font-medium text-foreground">Sugerencias Automáticas</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Mejora el enunciado para mayor claridad.
                </div>
              </div>

              <div className="rounded-lg bg-[#0b0c10] border border-white/5 p-3">
                <div className="text-sm font-medium text-foreground">Módulos Reutilizables</div>
                <div className="text-xs text-muted-foreground mt-1">
                  auth-system · api-gateway · payment-flow
                </div>
              </div>

              <div className="rounded-lg bg-[#0b0c10] border border-white/5 p-3">
                <div className="text-sm font-medium text-primary">Costo Estimado</div>
                <div className="text-base font-semibold text-foreground mt-1">$12K – $18K</div>
              </div>

              <div className="rounded-lg bg-[#0b0c10] border border-white/5 p-3">
                <div className="text-sm font-medium text-blue-400">Tiempo Estimado</div>
                <div className="text-base font-semibold text-foreground mt-1">8–12 semanas</div>
              </div>

            </div>
          </div>
        </div>
      </aside>

    </div>
  );
}