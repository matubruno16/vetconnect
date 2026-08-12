"use client";

import { useActionState } from "react";
import { Bell, CheckCircle2 } from "lucide-react";
import { reportFoundTip } from "@/features/lost-pets/actions/report-found-tip";
import { Button } from "@/components/ui/button";

interface Props {
  id: string;
}

interface State {
  success: boolean;
}

async function action(_prevState: State | null, formData: FormData): Promise<State> {
  const id = String(formData.get("id"));
  return reportFoundTip(id);
}

export function ReportFoundTipButton({ id }: Props) {
  const [state, formAction, isPending] = useActionState<State | null, FormData>(
    action,
    null,
  );

  if (state?.success) {
    return (
      <p className="flex items-center gap-2 rounded-lg bg-violet-50 px-4 py-3 text-sm font-medium text-violet-700">
        <CheckCircle2 size={16} />
        ¡Gracias! Le avisamos al colegio para que lo confirme.
      </p>
    );
  }

  return (
    <div className="space-y-2 rounded-lg border border-dashed p-4">
      <p className="text-sm text-muted-foreground">
        ¿La encontraron y no tenés el enlace para marcarla vos mismo?
        Avisale al colegio para que la revise.
      </p>

      <form action={formAction}>
        <input type="hidden" name="id" value={id} />
        <Button type="submit" variant="outline" disabled={isPending}>
          <Bell size={14} />
          {isPending ? "Enviando..." : "Avisar al colegio"}
        </Button>
      </form>
    </div>
  );
}
