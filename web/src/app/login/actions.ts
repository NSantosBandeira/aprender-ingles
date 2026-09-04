import { signIn } from "@/auth";

export async function googleLogin() {
  "use server";
  await signIn("google", { redirectTo: "/" });
}
