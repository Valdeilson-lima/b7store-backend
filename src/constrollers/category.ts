import { Request, Response } from "express";
import { getCategoryBySlug, getCategoryMetadata } from "../services/category";
import { getCategorySchema } from "../schemas/get-category-schema";


export const getCategoryWithMetadata = async (req: Request, res: Response) => {
    const paramsResult = getCategorySchema.safeParse(req.params);

    if (!paramsResult.success) {
        return res.status(400).json({
            error: "Parametros inválidos",
            details: paramsResult.error.issues,
        });
    }

    const { slug } = paramsResult.data;

    const category = await getCategoryBySlug(slug);

    const metadata = await getCategoryMetadata(category?.id || "");
  

  res.json({ error: "null", data: { category: category, metadata: metadata } });
};  