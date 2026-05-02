import { handleStripeWebhookHandler } from "../application/commands/handleStripeWebhook.handler.js";

export async function stripeWebhookController(req, res, next) {
  try {
    const result = await handleStripeWebhookHandler({
      rawBody: req.body,
      signature: req.headers["stripe-signature"],
    });

    return res.json(result);
  } catch (error) {
    if (error.statusCode === 400) {
      return res.status(400).send(error.message);
    }

    next(error);
  }
}
