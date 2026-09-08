"use server";

import { signIn } from "@/auth";
import { createUserWithPassword, getUserByEmail } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function googleLogin() {
  await signIn("google", { redirectTo: "/app" });
}

export async function passwordLogin(formData: FormData) {
  const email = String(formData.get("email") || "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") || "");
  await signIn("credentials", { email, password, redirectTo: "/app" });
}

export async function registerWithPassword(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") || "");
  if (name.length < 2) return { error: "Digite seu nome." };
  if (!email.includes("@")) return { error: "Digite um e-mail válido." };
  if (password.length < 8) return { error: "A senha precisa ter pelo menos 8 caracteres." };
  const existing = await getUserByEmail(email);
  if (existing) return { error: "Este e-mail já tem conta. Entre para continuar." };
  const passwordHash = await bcrypt.hash(password, 10);
  await createUserWithPassword({ name, email, passwordHash });
  await signIn("credentials", { email, password, redirectTo: "/app" });
}
