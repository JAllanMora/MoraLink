"use client";

import { useActionState } from "react";
import type { FormState } from "../actions";

// Formulario con mensaje de resultado para Server Actions que devuelven FormState
export function ActionForm({
  action,
  children,
  className,
}: {
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  children: React.ReactNode;
  className?: string;
}) {
  const [state, formAction, pending] = useActionState(action, null);

  return (
    <form action={formAction} className={className}>
      <fieldset disabled={pending} className="space-y-3">
        {children}
      </fieldset>
      {state && (
        <p
          role="status"
          className={`mt-3 rounded-brand p-3 text-sm font-medium ${
            state.ok ? "bg-brand-accent/15 text-brand-accent" : "bg-red-100 text-red-800"
          }`}
        >
          {state.message}
        </p>
      )}
    </form>
  );
}
