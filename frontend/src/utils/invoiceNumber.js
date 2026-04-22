export function generateInvoiceNumber() {
  const random = Math.floor(100000 + Math.random() * 900000);
  return `GS-${Date.now()}-${random}`;
}
