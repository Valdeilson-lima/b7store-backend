import { Response, Request } from "express";
import { cartMountSchema } from "../schemas/cart-mount-schema";
import { getProduct } from "../services/product";
import { getAbsoluteImageUrl } from "../utils/get-absolut-image-url";

export const cartMount = async (req: Request, res: Response) => {
  const parseResult = cartMountSchema.safeParse(req.body);

  if (!parseResult.success) {
    return res.status(400).json({ error: "Dados inválidos" });
  }

  const { ids } = parseResult.data;

  let products = [];

  for (let id of ids) {
    const product = await getProduct(id);
    if (product) {
      products.push({
        id: product.id,
        label: product.label,
        price: product.price,
        image: product.images[0]
          ? getAbsoluteImageUrl(product.images[0])
          : null,
      });
    }
  }

  return res.json({ error: null, products });
};
