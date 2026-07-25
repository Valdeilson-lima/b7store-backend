import { prisma } from "../lib/prisma";
import { cartItem } from "../types/cart-itens";
import { getProduct } from "./product";

export interface AddressData {
  id: string;
  zipCode: string;
  street: string;
  number: string;
  city: string;
  state: string;
  country: string;
  complement: string | null;
}

interface CreateOrderInput {
  userId: string;
  address: AddressData;
  shippingCost: number;
  shippingDays: number;
  cart: cartItem[];
}

export const createOrder = async ({
  userId,
  address,
  shippingCost,
  shippingDays,
  cart,
}: CreateOrderInput) => {
  let subtotal = 0;
  let orderItems: { productId: string; quantity: number; price: number }[] = [];

  for (let cartItem of cart) {
    const product = await getProduct(cartItem.productId);

    if (!product) {
      throw new Error(`Produto com ID ${cartItem.productId} não encontrado`);
    }
    subtotal += product.price * cartItem.quantity;

    orderItems.push({
      productId: cartItem.productId,
      quantity: cartItem.quantity,
      price: product.price,
    });
  }

  const order = await prisma.order.create({
    data: {
      userId,
      shippingCost,
      shippingDays,
      total: subtotal + shippingCost,
      shippingZipCode: address.zipCode,
      shippingStreet: address.street,
      shippingNumber: address.number,
      shippingCity: address.city,
      shippingState: address.state,
      shippingCountry: address.country,
      shippingComplement: address.complement || null,
      orderItems: {
        create: orderItems,
      },
    },
  });

  if (!order) {
    throw new Error("Erro ao criar o pedido");
  }

  return order.id;
};
