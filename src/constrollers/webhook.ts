import { Request, Response } from "express";
import { getStripeWebhookSecret } from "../utils/stripe-webhok-secret";
import { getConstructEvent } from "../lib/stripe";
import { updateOrderStatus } from "../services/order";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  throw new Error(
    "Stripe secret key is not defined in the environment variables.",
  );
}

export const stripeWebhook = async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"] as string;
  const webhookSecret = getStripeWebhookSecret();
  const rawBody = req.body;

  const event = getConstructEvent(rawBody, sig, webhookSecret);

  if (event) {
    const session = event.data.object as any;

    const orderId = session.metadata?.orderId;

    switch (event.type) {
      case "checkout.session.completed":
        await updateOrderStatus(orderId, "paid");
        break;
      case "checkout.session.async_payment_succeeded":
        console.log(`Async payment succeeded for order ${orderId}`);
        break;
      case "checkout.session.expired":
        console.log(`Payment session expired for order ${orderId}`);
        break;
      case "checkout.session.async_payment_failed":
        await updateOrderStatus(orderId, "cancelled");
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  }

  res.json({ received: true });
};
