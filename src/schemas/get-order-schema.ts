import z from "zod";

export const getOrderSchema = z.object({
  id: z.string({ message: "ID do pedido é obrigatório" }),
});
