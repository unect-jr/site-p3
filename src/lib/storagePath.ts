// Extrai o caminho no Storage a partir de uma URL de download do Firebase
// (formato https://firebasestorage.googleapis.com/v0/b/<bucket>/o/<path>?alt=media&token=...),
// usado para limpar (best-effort) a imagem antiga ao editar ou excluir um produto.
export function extractStoragePathFromDownloadUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    const match = parsed.pathname.match(/\/o\/(.+)$/);
    if (!match) return null;
    return decodeURIComponent(match[1]);
  } catch {
    return null;
  }
}
