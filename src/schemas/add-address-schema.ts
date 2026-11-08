import z from "zod";

export const addAddressSchema = z.object({
  zipcode: z.string().min(8, "CEP deve ter pelo menos 8 caracteres"),
  street: z.string().min(1, "Rua é obrigatória"),
  number: z.union([z.string(), z.number()]).transform(String),
  city: z.string().min(1, "Cidade é obrigatória"),
  state: z.string().min(2, "Estado deve ter pelo menos 2 caracteres"),
  country: z.string().min(1, "País é obrigatório"),
  complement: z.string().optional(),
});
