import { billingRepository } from "../../infrastructure/repositories/billing.repository.js";

export async function getBillingAdminHandler() {
  return billingRepository.findAllAdmin();
}
