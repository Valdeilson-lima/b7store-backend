import Stripe from "stripe";
import { getProduct } from "../services/product";
import { cartItem } from "../types/cart-itens";
import { getStripeSecret } from "../utils/get-stripe-secret";
import { getFrontendUrl } from "../utils/get-frontend-url";

const stripeSecretKey = getStripeSecret();
const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2026-06-24.dahlia",
});

interface StripeCheckoutSessionParams {
  cart: cartItem[];
  shippingCost: number;
  orderId: string;
}

export const createStripeCheckoutSession = async ({
  cart,
  shippingCost,
  orderId,
}: StripeCheckoutSessionParams) => {
  let stripeLineItems = [];

  for (let item of cart) {
    const product = await getProduct(item.productId);

    if (!product) {
      throw new Error(`Product with ID ${item.productId} not found`);
    }

    stripeLineItems.push({
      price_data: {
        currency: "BRL",

        product_data: {
          name: product.label,
          description: product.description ?? undefined,
        },
        unit_amount: Math.round(product.price * 100),
      },
      quantity: item.quantity,
    });
  }

  if (shippingCost > 0) {
    stripeLineItems.push({
      price_data: {
        currency: "BRL",
        product_data: {
          name: "Frete",
          description: "Custo de envio",
        },
        unit_amount: Math.round(shippingCost * 100),
      },
      quantity: 1,
    });
  }

  const session = await stripe.checkout.sessions.create({
    line_items: stripeLineItems,
    mode: "payment",
    metadata: {
      orderId: orderId,
    },
    success_url: `${getFrontendUrl()}/cart/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${getFrontendUrl()}/my-orders`,
  });

  if (!session || !session.url) {
    throw new Error("Failed to create Stripe checkout session");
  }

  return session.url;
};

export const getConstructEvent = (
  rowBody: string,
  sig: string,
  webhookSecret: string,
): Stripe.Event => {
  try {
    return stripe.webhooks.constructEvent(rowBody, sig, webhookSecret);
  } catch (error) {
    console.error("Error constructing Stripe event:", error);
    throw new Error("Failed to construct Stripe event");
  }
};
