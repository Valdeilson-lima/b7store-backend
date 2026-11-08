import { Request, Response } from "express";
import { getProductSchema } from "../schemas/get-product-schema";
import {
  getAllProducts,
  getProduct,
  incrementProductViews,
} from "../services/product";
import { getAbsoluteImageUrl } from "../utils/get-absolut-image-url";
import { getOneProductSchema } from "../schemas/get-one-product-schema";
import { getCategory } from "../services/category";
import { getRelatedProductSchema } from "../schemas/get-related-product-schema";
import { getRelatedProductQuerySchema } from "../schemas/get-one-product-query-schema";
import { getProductsFromSameCategory } from "../services/product";

export const getProducts = async (req: Request, res: Response) => {
  const parseResult = getProductSchema.safeParse(req.query);

  if (!parseResult.success) {
    return res.status(400).json({
      error: "Parametros inválidos",
      details: parseResult.error.issues,
    });
  }

  const { metadata, orderBy, limit } = parseResult.data;

  const products = await getAllProducts({
    metadata: metadata ? JSON.parse(metadata) : undefined,
    orderBy,
    limit: limit ? parseInt(limit, 10) : undefined,
  });

  const productsWithAbsoluteUrls = products.map((product) => ({
    ...product,
    image: product.image ? getAbsoluteImageUrl(product.image) : null,
    liked: false, //TODO: Implementar lógica para determinar se o produto foi curtido pelo usuário
  }));

  res.json({ error: "null", data: productsWithAbsoluteUrls });
};

export const getOneProduct = async (req: Request, res: Response) => {
  const paramsresult = getOneProductSchema.safeParse(req.params);

  if (!paramsresult.success) {
    return res.status(400).json({
      error: "Parametros inválidos",
      details: paramsresult.error.issues,
    });
  }

  const { id } = paramsresult.data;

  const product = await getProduct(id);

  if (!product) {
    return res.status(404).json({
      error: "Produto não encontrado",
    });
  }

  const productWithAbsoluteUrls = {
    ...product,
    images: product.images.map((image) => getAbsoluteImageUrl(image)),
    liked: false, //TODO: Implementar lógica para determinar se o produto foi curtido pelo usuário
  };

  const category = await getCategory(product.categoryId);

  await incrementProductViews(id);

  res.json({ error: "null", data: productWithAbsoluteUrls, category });
};

export const getRelatedProducts = async (req: Request, res: Response) => {
  const paramsresult = getRelatedProductSchema.safeParse(req.params);
  const queryResult = getRelatedProductQuerySchema.safeParse(req.query);

  if (!paramsresult.success || !queryResult.success) {
    return res.status(400).json({
      error: "Parametros inválidos",
      details: [
        ...(paramsresult.success ? [] : paramsresult.error.issues),
        ...(queryResult.success ? [] : queryResult.error.issues),
      ],
    });
  }

  const { id } = paramsresult.data;
  const { limit } = queryResult.data;

  const relatedProducts = await getProductsFromSameCategory(id, limit);

  if (relatedProducts.length > 0) {
    const relatedProductsWithAbsoluteUrls = relatedProducts.map((product) => ({
      ...product,
      image: product.image ? getAbsoluteImageUrl(product.image) : null,
      liked: false, //TODO: Implementar lógica para determinar se o produto foi curtido pelo usuário
    }));

    return res.json({ error: "null", data: relatedProductsWithAbsoluteUrls });
  }
 
};
