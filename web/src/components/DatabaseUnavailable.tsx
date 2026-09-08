import Link from "next/link";

export function DatabaseUnavailable({ message }: { message: string }) {
  return (
    <main className="app-shell">
      <p className="eyebrow">Meu dia</p>
      <h1>O banco não está no ar.</h1>
      <p className="lead">{message}</p>
      <p className="banner">
        Na pasta do projeto, abra o Rancher Desktop e rode <code>docker compose up -d</code>. Depois recarregue esta
        página.
      </p>
      <p>
        <Link className="ghost-link" href="/">
          Voltar para a Home
        </Link>
      </p>
    </main>
  );
}
