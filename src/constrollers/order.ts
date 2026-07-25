import { Response, Request } from "express";
import { getOrderBySessionIdSchema } from "../schemas/get-rder-by-sessionId";
import { getOrderIdFromSession } from "../services/payment";

export const getOrderBySessionId = async (req: Request, res: Response) => {
  const result = getOrderBySessionIdSchema.safeParse(req.query);
  if (!result.success) {
    return res.status(400).json({ error: "Id da sessão é obrigatório" });
  }

  const { sessionId } = result.data;

 
  const orderId = await getOrderIdFromSession(sessionId);


  if (!orderId) {
    return res.status(404).json({ error: "Pedido não encontrado", result: null });
  }

  res.json({ error: null, orderId });
};
