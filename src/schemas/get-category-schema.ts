import z from "zod";

export const getCategorySchema = z.object({
  slug: z.string().min(1),
});
