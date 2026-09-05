import { googleLogin } from "./actions";

const AUTH_ERRORS: Record<string, string> = {
  AccessDenied:
    "O Google autenticou, mas o app não conseguiu gravar seu usuário no banco. Na Vercel, DATABASE_URL precisa ser o Postgres da nuvem (não localhost) e a tabela users é criada no primeiro login.",
  Configuration: "Falta configurar AUTH_SECRET, Google ou DATABASE_URL neste deploy.",
  OAuthCallback: "O retorno do Google falhou. Confira o redirect https://seu-app.vercel.app/api/auth/callback/google.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const googleReady = Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
  const { error } = await searchParams;
  const errorMessage = error ? AUTH_ERRORS[error] || "Não foi possível entrar. Tente de novo." : null;

  return (
    <main className="app-shell">
      <p className="eyebrow">Inglês no trabalho</p>
      <h1>Entre para montar o seu dia.</h1>
      <p className="lead">O estudo segue o seu papel no time: daily, 1:1, Scrum e cliente.</p>
      {errorMessage ? <p className="banner">{errorMessage}</p> : null}
      {googleReady ? (
        <form action={googleLogin}>
          <button className="hot" type="submit">
            Entrar com Google
          </button>
        </form>
      ) : (
        <p className="banner">
          Para o login Google, copie <code>web/.env.example</code> para <code>web/.env.local</code> e
          preencha <strong>GOOGLE_CLIENT_ID</strong> e <strong>GOOGLE_CLIENT_SECRET</strong>. O redirect
          no Google Cloud é <code>http://localhost:3000/api/auth/callback/google</code>.
        </p>
      )}
    </main>
  );
}
