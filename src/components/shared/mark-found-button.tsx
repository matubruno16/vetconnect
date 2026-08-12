"use client";

import { useActionState } from "react";
import { CheckCircle2 } from "lucide-react";
import { markFoundByOwner } from "@/features/lost-pets/actions/mark-found-by-owner";
import { Button } from "@/components/ui/button";

interface Props {
  id: string;
  token: string;
  petName: string;
}

interface State {
  success: boolean;
}

async function action(_prevState: State | null, formData: FormData): Promise<State> {
  const id = String(formData.get("id"));
  const token = String(formData.get("token"));
  return markFoundByOwner(id, token);
}

export function MarkFoundButton({ id, token, petName }: Props) {
  const [state, formAction, isPending] = useActionState<State | null, FormData>(
    action,
    null,
  );

  if (state?.success) {
    return (
      <p className="flex items-center gap-2 rounded-lg bg-violet-50 px-4 py-3 text-sm font-medium text-violet-700">
        <CheckCircle2 size={16} />
        ¡Genial! Marcamos a {petName} como encontrada.
      </p>
    );
  }

  return (
    <form action={formAction} className="space-y-2">
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="token" value={token} />

      <Button
        type="submit"
        disabled={isPending}
        className="bg-violet-600 text-white hover:bg-violet-700"
      >
        {isPending ? "Marcando..." : "Ya la encontré"}
      </Button>

      {state && !state.success && (
        <p className="text-sm text-destructive">
          No pudimos confirmarlo. El enlace puede haber expirado o ser
          inválido — contactá al colegio si el problema persiste.
        </p>
      )}
    </form>
  );
}
