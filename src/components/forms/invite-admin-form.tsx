"use client";

import { useActionState } from "react";
import { CheckCircle2 } from "lucide-react";
import {
  inviteAdmin,
  type InviteAdminState,
} from "@/features/admin-users/actions/invite-admin";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/shared/submit-button";

const initialState: InviteAdminState = { error: null };

export function InviteAdminForm() {
  const [state, formAction] = useActionState(inviteAdmin, initialState);

  return (
    <div className="space-y-3">
      <form action={formAction} className="flex flex-wrap items-end gap-3">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <Input id="email" name="email" type="email" required />
        </div>

        <SubmitButton pendingText="Invitando...">Invitar</SubmitButton>
      </form>

      <p className="text-xs text-muted-foreground">
        Le llega un email de Supabase con un link para elegir su contraseña.
        Si no le llega, revisá spam o la configuración de email en el
        dashboard de Supabase (Authentication → Emails).
      </p>

      {state.error && <p className="text-sm text-destructive">{state.error}</p>}
      {state.success && (
        <p className="flex items-center gap-2 text-sm text-violet-600">
          <CheckCircle2 size={14} />
          Invitación enviada.
        </p>
      )}
    </div>
  );
}
