"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { useRouter } from "next/navigation";
import { Code2, ArrowLeft, ArrowRight, Sparkles, DollarSign, Clock, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
    { number: 1, title: "Definir Problema", description: "Describe tu desafío operativo" },
    { number: 2, title: "Flujo Operativo", description: "Detalla el proceso actual" },
    { number: 3, title: "Restricciones Técnicas", description: "Especifica requisitos técnicos" },
    { number: 4, title: "Datos de Ejemplo", description: "Proporciona ejemplos de datos" },
    { number: 5, title: "ROI Esperado", description: "Define métricas de éxito" },
    { number: 6, title: "Presupuesto", description: "Establece inversión y plazos" },
    { number: 7, title: "Revisión Final", description: "Confirma y publica" },
  ];

  function updateField<K extends keyof typeof formData>(key: K, value: string) {
    setFormData((s) => ({ ...s, [key]: value }));
  }

  function goNext() {
    setError(null);
    if (step === 1) {
      if (!formData.title.trim()) {
        setError("El título es obligatorio.");
        return;
      }
      if (!formData.description.trim()) {
        setError("La descripción es obligatoria.");
        return;
      }
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

    if (!formData.title.trim()) {
      setError("El título es obligatorio.");
      setStep(1);
      return;
    }
    if (!formData.description.trim()) {
      setError("La descripción es obligatoria.");
      setStep(1);
      return;
    }
    const budgetNum = Number.parseFloat(formData.budget || "0");
    if (!Number.isFinite(budgetNum) || budgetNum < 0) {
      setError("Indica un presupuesto válido (número mayor o igual a 0).");
      setStep(6);
      return;
    }

    setLoading(true);
    try {
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
        title: formData.title.trim(),
        description: formData.description.trim(),
        budget: budgetNum,
        client_id: user.id,
        status: "open",
      });

      if (insertError) {
        setError(insertError.message);
        setLoading(false);
        return;
      }

      setLoading(false);
      router.push("/bounties");
    } catch (err: any) {
      setError(err?.message ?? String(err));
      setLoading(false);
    }
  }

  function handleFormKeyDown(e: React.KeyboardEvent<HTMLFormElement>) {
    if (e.key !== "Enter") return;
    const target = e.target as HTMLElement;
    const tag = target.tagName;
    // Allow Enter inside textareas
    if (tag === "TEXTAREA") return;

    // Prevent Enter from submitting the form automatically.
    // If user presses Enter and is before final step, move to next step instead.
    e.preventDefault();
    if (step < 7) {
      goNext();
    }
    // If step === 7 do nothing: require explicit click on the submit button
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-3">Publicar Nuevo Desafío</h1>
        <p className="text-xl text-muted-foreground">Define tu problema operativo y conecta con desarrolladores expertos</p>
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-4 overflow-x-auto">
          {steps.map((s, index) => (
            <div key={s.number} className="flex items-center flex-1 min-w-[90px]">
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${step >= s.number ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}>
                  {step > s.number ? <CheckCircle2 className="w-6 h-6" /> : s.number}
                </div>
                <div className="text-xs text-center mt-2 max-w-[100px]"><div className="font-medium">{s.title}</div></div>
              </div>
              {index < steps.length - 1 && <div className={`flex-1 h-0.5 mx-2 transition-colors ${step > s.number ? "bg-primary" : "bg-border"}`} />}
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} onKeyDown={handleFormKeyDown} className="space-y-6">
        <Card className="border-app">
          <CardHeader>
            <CardTitle>{steps.find((x) => x.number === step)?.title}</CardTitle>
            <CardDescription>{steps.find((x) => x.number === step)?.description}</CardDescription>
          </CardHeader>
          <CardContent>
            {step === 1 && (
              <div className="space-y-4">
                <Input name="title" label="Título del Proyecto" placeholder="Ej. Integración CRM con nóminas" value={formData.title} onChange={(e) => updateField("title", e.target.value)} autoComplete="off" />
                <div className="flex w-full flex-col gap-1.5">
                  <label className="text-sm font-medium text-app-muted">Descripción Detallada</label>
                  <textarea name="description" rows={6} placeholder="Contexto, alcance y criterios de éxito…" value={formData.description} onChange={(e) => updateField("description", e.target.value)} className="w-full rounded-lg border border-app bg-app-surface-55 px-3 py-2 text-sm text-app-foreground placeholder-app-muted transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary min-h-[140px] resize-y" />
                </div>
              </div>
            )}

            {step >= 2 && step <= 5 && <div className="py-12 text-center text-app-muted"><div className="text-lg font-medium mb-2">{steps[step - 1].title}</div><div>{steps[step - 1].description}</div></div>}

            {step === 6 && (
              <div className="space-y-4">
                <Input name="budget" type="number" inputMode="decimal" min={0} step="0.01" label="Presupuesto Total (EUR)" placeholder="5000" value={formData.budget} onChange={(e) => updateField("budget", e.target.value)} />
                <div className="text-sm text-app-muted">Puedes indicar aquí la inversión estimada para resolver el desafío.</div>
              </div>
            )}

            {step === 7 && (
              <div className="space-y-4">
                <div className="text-sm text-app-muted">Revisa la información antes de publicar.</div>
                <div className="bg-app-card-60 rounded-md p-4">
                  <div className="mb-2 font-medium">Título</div>
                  <div className="text-app-foreground">{formData.title || "-"}</div>
                  <div className="mt-3 mb-2 font-medium">Descripción</div>
                  <div className="text-app-foreground whitespace-pre-wrap">{formData.description || "-"}</div>
                  <div className="mt-3 mb-2 font-medium">Presupuesto</div>
                  <div className="text-app-foreground">{formData.budget ? `${formData.budget} €` : "-"}</div>
                </div>
              </div>
            )}

            {error ? <p className="rounded-lg border border-red-500/40 bg-red-950/30 px-3 py-2 text-sm text-red-200">{error}</p> : null}

            <div className="flex items-center justify-between">
              <div>{step > 1 ? <Button variant="outline" type="button" onClick={goBack} className="inline-flex items-center gap-2"><ArrowLeft className="w-4 h-4" /> Volver</Button> : null}</div>
              <div className="flex items-center gap-3">
                {step < 7 ? (
                    <Button 
                    type="button" 
                    onClick={(e) => {
                        e.preventDefault(); // Evita cualquier acción por defecto
                        e.stopPropagation(); // Detiene la burbuja del formulario
                        goNext();
                    }} 
                    className="inline-flex items-center gap-2"
                    >
                    Siguiente <ArrowRight className="w-4 h-4" />
                    </Button>
                ) : (
                    <Button type="submit" disabled={loading} className="inline-flex items-center gap-2">
                    {loading ? "Publicando…" : "Publicar Desafío"} <Sparkles className="w-4 h-4" />
                    </Button>
                )}
                </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
