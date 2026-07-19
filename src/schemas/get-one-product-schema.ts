import z from "zod";


export const getOneProductSchema = z.object({
  id: z.string().min(1, "Product ID is required"),
});