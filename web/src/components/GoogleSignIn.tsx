import { googleLogin } from "@/lib/auth-actions";

export function GoogleSignIn({ ready, label }: { ready: boolean; label: string }) {
  if (!ready) return null;
  return (
    <form action={googleLogin}>
      <button className="ghost google-btn" type="submit">
        {label}
      </button>
    </form>
  );
}
