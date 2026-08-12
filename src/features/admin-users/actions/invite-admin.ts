"use server";

import { headers } from "next/headers";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export interface InviteAdminState {
  error: string | null;
  success?: boolean;
}

export async function inviteAdmin(
  _prevState: InviteAdminState,
  formData: FormData,
): Promise<InviteAdminState> {
  const email = String(formData.get("email") || "").trim();

  if (!email) {
    return { error: "Ingresá un email." };
  }

  try {
    const headersList = await headers();
    const host = headersList.get("host");
    const proto = headersList.get("x-forwarded-proto") ?? "http";
    const redirectTo = `${proto}://${host}/admin/accept-invite`;

    const admin = createAdminClient();
    const { error } = await admin.auth.admin.inviteUserByEmail(email, {
      redirectTo,
    });

    if (error) {
      return { error: error.message };
    }

    revalidatePath("/admin/users");
    return { error: null, success: true };
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Error inesperado.",
    };
  }
}
