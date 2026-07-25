import { Response, Request } from "express";
import { getOrderBySessionIdSchema } from "../schemas/get-rder-by-sessionId";
import { getOrderIdFromSession } from "../services/payment";
import { getOrderById, getUserOrders } from "../services/order";
import { getOrderSchema } from "../schemas/get-order-schema";
import { getAbsoluteImageUrl } from "../utils/get-absolut-image-url";

export const getOrderBySessionId = async (req: Request, res: Response) => {
  const result = getOrderBySessionIdSchema.safeParse(req.query);
  if (!result.success) {
    return res.status(400).json({ error: "Id da sessão é obrigatório" });
  }

  const { sessionId } = result.data;

  const orderId = await getOrderIdFromSession(sessionId);

  if (!orderId) {
    return res
      .status(404)
      .json({ error: "Pedido não encontrado", result: null });
  }

  res.json({ error: null, orderId });
};

export const listOrders = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;

  if (!userId) {
    return res.status(401).json({ error: "Usuário não autenticado" });
  }

  const orders = await getUserOrders(userId);

  res.json({ error: null, orders: orders });
};

export const getOrder = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;

  if (!userId) {
    return res.status(401).json({ error: "Usuário não autenticado" });
  }

  const result = getOrderSchema.safeParse(req.params);

  if (!result.success) {
    return res.status(400).json({ error: "ID do pedido é obrigatório" });
  }

  const { id: orderId } = result.data;

  const order = await getOrderById(orderId, userId);

  if (!order) {
    return res.status(404).json({ error: "Pedido não encontrado" });
  }

  const items = order.orderItems.map((item) => ({
    ...item,
    prodduct: {
      ...item.product,
      image: item.product.image
        ? getAbsoluteImageUrl(item.product.image)
        : null,
    },
  }));
  res.json({ error: null, order: { ...order, orderItems: items } });
};
