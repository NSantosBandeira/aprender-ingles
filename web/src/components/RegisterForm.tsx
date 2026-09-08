"use client";

import { registerWithPassword } from "@/lib/auth-actions";
import { useState } from "react";

export function RegisterForm() {
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(formData: FormData) {
    setPending(true);
    setError("");
    const result = await registerWithPassword(formData);
    if (result?.error) {
      setError(result.error);
      setPending(false);
    }
  }

  return (
    <form className="auth-form" action={onSubmit}>
      <label>
        Nome
        <input name="name" type="text" autoComplete="name" required minLength={2} />
      </label>
      <label>
        E-mail
        <input name="email" type="email" autoComplete="email" required />
      </label>
      <label>
        Senha
        <input name="password" type="password" autoComplete="new-password" required minLength={8} />
      </label>
      {error ? <p className="banner">{error}</p> : null}
      <button className="hot" type="submit" disabled={pending}>
        {pending ? "Criando conta..." : "Criar conta"}
      </button>
    </form>
  );
}
