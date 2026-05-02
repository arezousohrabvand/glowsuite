export class BillingDomainError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.name = "BillingDomainError";
    this.statusCode = statusCode;
  }
}
