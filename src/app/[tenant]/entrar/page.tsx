import { Suspense } from "react";
import { Button } from "@/components/button";
import { requestLogin } from "../actions";
import { ActionForm } from "../_components/action-form";

export default function LoginPage({ params }: PageProps<"/[tenant]/entrar">) {
  return (
    <div className="space-y-4">
      <h1 className="font-display text-3xl font-bold">Únete al programa</h1>
      <p className="text-brand-muted">
        Escribe tu correo y te mandamos un enlace para entrar. No necesitas contraseña.
      </p>
      <Suspense>
        {params.then(({ tenant }) => (
          <ActionForm action={requestLogin.bind(null, tenant)}>
            <input
              type="email"
              name="email"
              required
              autoComplete="email"
              placeholder="tucorreo@ejemplo.com"
              className="w-full rounded-brand border border-brand-muted/30 bg-brand-surface px-4 py-3 outline-none focus:border-brand"
            />
            <Button type="submit">Enviarme el enlace</Button>
          </ActionForm>
        ))}
      </Suspense>
    </div>
  );
}
