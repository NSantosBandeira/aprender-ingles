function isConnRefused(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  if ("code" in error && (error as { code?: string }).code === "ECONNREFUSED") return true;
  if (error instanceof AggregateError) return error.errors.some(isConnRefused);
  if ("cause" in error) return isConnRefused((error as { cause?: unknown }).cause);
  return false;
}

export function describeDbError(error: unknown): Error {
  if (isConnRefused(error)) {
    return new Error(
      "Não foi possível conectar no Postgres em localhost:5432. Abra o Rancher Desktop, rode docker compose up -d na pasta do projeto e recarregue."
    );
  }
  if (error instanceof Error && error.message.trim()) return error;
  return new Error("Falha ao conectar no banco de dados.");
}
