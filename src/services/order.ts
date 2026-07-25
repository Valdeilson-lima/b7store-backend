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

export const updateOrderStatus = async (
  orderId: string,
  status: "paid" | "cancelled",
) => {
  const order = await prisma.order.update({
    where: { id: orderId },
    data: { status },
  });

  if (!order) {
    throw new Error(`Pedido com ID ${orderId} não encontrado`);
  }

  return order;
};

export const getUserOrders = async (userId: string) => {
  const orders = await prisma.order.findMany({
    where: { userId },
    select: {
      id: true,
      status: true,
      total: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return orders;
};

export const getOrderById = async (orderId: string, userId: string) => {
  const order = await prisma.order.findFirst({
    where: { id: orderId, userId },
    select: {
      id: true,
      status: true,
      total: true,
      shippingCost: true,
      shippingDays: true,
      shippingZipCode: true,
      shippingStreet: true,
      shippingNumber: true,
      shippingCity: true,
      shippingState: true,
      shippingCountry: true,
      shippingComplement: true,
      createdAt: true,
      orderItems: {
        select: {
          productId: true,
          quantity: true,
          price: true,
          product: {
            select: {
              label: true,
              price: true,
              images: {
                take: 1,
                orderBy: { id: "asc" },
              },
            },
          },
        },
      },
    },
  });

  if (!order) {
    throw new Error(`Pedido com ID ${orderId} não encontrado para o usuário ${userId}`);
  }

  return {
    ...order,
    orderItems: order.orderItems.map((item) => ({
      ...item,
      product: {
        ...item.product,
        image: item.product.images[0]? `media/${item.product.images[0].url}` : null,
        images: undefined, 
      },
    })),
  };
};
  
