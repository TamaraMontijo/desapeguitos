export function formatCurrency(value: number) {
  return value.toLocaleString("pt-Br", {
    style: "currency",
    currency: "BRL",
  })
}