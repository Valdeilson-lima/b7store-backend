import z from "zod";

export const getOrderBySessionIdSchema = z.object({
  sessionId: z.string().min(1, "Session ID is required"),
});
