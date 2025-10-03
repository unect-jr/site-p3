export function formatCurrency(value: number | null | undefined): string {
  // Caso 1: O preço é nulo ou indefinido (para "Sob Consulta")
  if (value === null || value === undefined) {
    return "Sob Consulta";
  }

  // Caso 2: O preço é um número. Formatamos!
  const formatter = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2, // Garante que sempre tenha duas casas decimais (ex: R$ 210,00)
  });

  return formatter.format(value);
}
