import { createStripeCheckoutSession } from "../lib/stripe";
import { cartItem } from "../types/cart-itens";

interface CreatePaymentLinkResponse {
  cart: cartItem[];
  shippingCost: number;
  orderId: string;
}

export const createPaymentlink = async ({
  cart,
  shippingCost,
  orderId,
}: CreatePaymentLinkResponse) => {
  try {
    const session = await createStripeCheckoutSession({
      cart,
      shippingCost,
      orderId,
    });
    if (!session) {
      throw new Error("Failed to create Stripe checkout session");
    }
    return session;
  } catch (error) {
    console.error("Error creating Stripe checkout session:", error);
    throw new Error("Failed to create Stripe checkout session");
  }
};
