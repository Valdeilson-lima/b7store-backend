import z from "zod";

export const loginschema = z.object({
  email: z.email(),
  password: z.string().min(6),
});
