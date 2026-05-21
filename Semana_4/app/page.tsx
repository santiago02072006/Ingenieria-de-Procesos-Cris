import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const pillars = [
  {
    title: "Marketplace",
    description:
      "Explora un catálogo curado de soluciones listas para adoptar: integraciones, automatizaciones y módulos probados en contextos reales de negocio.",
  },
  {
    title: "Reutilización",
    description:
      "Deja de reinventar la rueda. Cada entrega alimenta un acervo común: versionado, documentación y trazabilidad para que el conocimiento escale.",
  },
  {
    title: "Cloud Runtime",
    description:
      "Despliega y valida soluciones en un entorno cloud seguro: pruebas, demos y handoff sin fricción entre clientes y equipos de desarrollo.",
  },
] as const;

export default function HomePage() {
  return (
    <div className="relative">
      <div
        className="pointer-events-none absolute inset-0 bg-[size:48px_48px] bg-grid-zinc opacity-[0.65] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_-10%,#000_50%,transparent_100%)]"
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" aria-hidden />

      <section className="relative mx-auto max-w-6xl px-4 pb-20 pt-20 sm:pt-24 lg:pt-32">
        {/* Background accents */}
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/3 transform blur-3xl">
            <div className="h-[420px] w-[900px] rounded-full bg-gradient-to-r from-indigo-600/20 via-violet-600/15 to-cyan-400/10 opacity-60" />
          </div>
          <div className="absolute right-0 bottom-0 -translate-x-1/3 translate-y-1/3 transform blur-2xl">
            <div className="h-[220px] w-[420px] rounded-full bg-gradient-to-tr from-rose-500/8 to-amber-400/6 opacity-60" />
          </div>
        </div>

        <div className="mx-auto max-w-3xl">
          <div className="rounded-2xl border border-white/6 bg-gradient-to-b from-white/3 via-white/5 to-white/2 px-8 py-12 shadow-lg backdrop-blur-md">
            <p className="inline-flex items-center gap-2 rounded-full bg-indigo-700/10 px-3 py-1 text-sm font-medium text-indigo-200/90">
              MVP · Next.js · Supabase
            </p>

            <h1
              className="mt-6 bg-clip-text text-4xl font-extrabold leading-tight text-transparent sm:text-5xl lg:text-6xl"
              style={{ backgroundImage: "linear-gradient(90deg,#f8fafc,#e6eefc 45%,#c7d8ff)" }}
            >
              Convierte problemas empresariales en soluciones reutilizables.
            </h1>

            <p className="mt-4 text-lg text-zinc-200/90 max-w-2xl">
              DevSolve es el ecosistema donde los clientes publican retos concretos y los desarrolladores entregan piezas de software
              que otros pueden adoptar, extender y operar en la nube.
            </p>

            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-start">
              <Button
                href="/bounties"
                size="lg"
                className="w-full min-w-[200px] rounded-md bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-md hover:scale-[1.02] transition-transform sm:w-auto"
              >
                Publicar Problema
              </Button>

              <Button href="/marketplace" variant="outline" size="lg" className="w-full min-w-[200px] sm:w-auto">
                Explorar Soluciones
              </Button>
            </div>

            <p className="mt-6 text-sm text-zinc-300/80 text-center sm:text-left">
              ¿Eres desarrollador?{' '}
              <Link href="/login" className="font-medium text-indigo-300 underline-offset-4 hover:text-indigo-200 hover:underline">
                Accede al tablero de bounties
              </Link>
            </p>
          </div>
        </div>
      </section>

      <section className="relative border-t border-zinc-900/80 bg-zinc-950/40 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-zinc-100 sm:text-4xl">Tres pilares del producto</h2>
            <p className="mt-4 text-lg text-zinc-400">
              Un mismo flujo conecta la demanda de negocio con el catálogo técnico y la operación en producción.
            </p>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {pillars.map((pillar) => (
              <Card key={pillar.title} className="flex flex-col transition-colors hover:border-indigo-500/25">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-indigo-500 shadow-[0_0_12px] shadow-indigo-500/60" aria-hidden />
                    {pillar.title}
                  </CardTitle>
                  <CardDescription>{pillar.description}</CardDescription>
                </CardHeader>
                <CardContent className="mt-auto pt-2">
                  <span className="text-xs font-medium uppercase tracking-wider text-indigo-400/90">DevSolve</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="relative border-t border-zinc-900/80 py-16">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-4 text-center sm:flex-row sm:text-left sm:px-6 lg:px-8">
          <div>
            <h3 className="text-xl font-semibold text-zinc-100">¿Listo para el siguiente sprint de valor?</h3>
            <p className="mt-2 max-w-xl text-zinc-400">
              Publica un bounty con contexto y criterios de aceptación, o navega el marketplace para acelerar tu roadmap.
            </p>
          </div>
          <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
            <Button href="/bounties">Publicar Problema</Button>
            <Button href="/marketplace" variant="outline">
              Explorar Soluciones
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
