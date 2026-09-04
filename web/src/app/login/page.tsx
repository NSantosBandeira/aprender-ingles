import { googleLogin } from "./actions";

export default function LoginPage() {
  const googleReady = Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);

  return (
    <main className="app-shell">
      <p className="eyebrow">Inglês no trabalho</p>
      <h1>Entre para montar o seu dia.</h1>
      <p className="lead">O estudo segue o seu papel no time: daily, 1:1, Scrum e cliente.</p>
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
