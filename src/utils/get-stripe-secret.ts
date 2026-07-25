export const getStripeSecret = () => {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

  if (!stripeSecretKey) {
    throw new Error("Stripe secret key is not defined in the environment variables.");
  }

  return stripeSecretKey;
};