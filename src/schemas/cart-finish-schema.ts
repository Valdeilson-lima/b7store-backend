import z from "zod";

export const cartFinishSchema = z.object({
  addressId: z.string().min(1, "ID do endereço é obrigatório"),
  cart: z.array(
    z.object({
      productId: z.string().min(1, "ID do produto é obrigatório"),
      quantity: z.number().int().min(1, "Quantidade deve ser no mínimo 1"),
    }),
  ).nonempty("O carrinho não pode estar vazio"),
});
