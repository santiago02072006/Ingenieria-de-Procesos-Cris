"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";

type AcceptSolutionButtonProps = {
  solutionId: string;
  problemId: string;
  disabled?: boolean;
  disabledReason?: string;
};

export function AcceptSolutionButton({ solutionId, problemId, disabled = false, disabledReason }: AcceptSolutionButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAccept() {
    if (disabled || loading) return;

    setError(null);
    setLoading(true);

    const supabase = createClient();

    const { error: solutionError } = await supabase.from("solutions").update({ status: "accepted" }).eq("id", solutionId);

    if (solutionError) {
      setError(solutionError.message);
      setLoading(false);
      return;
    }

    const { error: problemError } = await supabase.from("problems").update({ status: "closed" }).eq("id", problemId);

    if (problemError) {
      setError(problemError.message);
      setLoading(false);
      return;
    }

    setLoading(false);
    router.refresh();
  }

  return (
    <div className="flex flex-col items-stretch gap-2 sm:items-end">
      <Button type="button" size="sm" disabled={disabled || loading} onClick={handleAccept}>
        {loading ? "Aceptando…" : "Aceptar solución"}
      </Button>
      {disabled && disabledReason ? (
        <span className="text-xs text-zinc-500">{disabledReason}</span>
      ) : null}
      {error ? (
        <p className="text-xs text-red-400" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

