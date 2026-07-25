export const getStripeWebhookSecret = () => {
  const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripeWebhookSecret) {
    throw new Error(
      "Stripe webhook secret is not defined in the environment variables.",
    );
  }

  return stripeWebhookSecret;
};
