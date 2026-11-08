import z from "zod";

export const cartMountSchema = z.object({
    ids: z.array(z.string()).nonempty(),
  
});