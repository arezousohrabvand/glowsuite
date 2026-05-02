import { billingRepository } from "../../infrastructure/repositories/billing.repository.js";

export async function getMyBillingHandler(userId) {
  return billingRepository.findByUser(userId);
}
