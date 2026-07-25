import { Response, Request } from "express";
import { cartMountSchema } from "../schemas/cart-mount-schema";
import { getProduct } from "../services/product";
import { getAbsoluteImageUrl } from "../utils/get-absolut-image-url";
import { calculateShippingSchema } from "../schemas/calculate-sipping-schema";
import { cartFinishSchema } from "../schemas/cart-finish-schema";
import { getAddressById } from "../services/user";
import { createOrder } from "../services/order";
import { createPaymentlink } from "../services/payment";

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

export const calculateShipping = async (req: Request, res: Response) => {
  const parseResult = calculateShippingSchema.safeParse(req.query);

  if (!parseResult.success) {
    return res.status(400).json({ error: "Dados inválidos" });
  }

  const { zipcode } = parseResult.data;
  return res.json({ error: null, zipcode, cost: 7, days: 5 });
};

export const cartFinish = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  if (!userId) {
    return res.status(401).json({ error: "Usuário não autenticado" });
  }

  const parseResult = cartFinishSchema.safeParse(req.body);

  if (!parseResult.success) {
    return res.status(400).json({ error: "Dados inválidos" });
  }

  const { addressId, cart } = parseResult.data;

  const address = await getAddressById(userId, addressId);

  if (!address) {
    return res.status(404).json({ error: "Endereço não encontrado" });
  }

  const shippingCost = 7; //TODO: Implementar cálculo de frete real
  const shippingDays = 5; //TODO: Implementar cálculo de prazo real

  const orderId = await createOrder({
    userId,
    address,
    shippingCost,
    shippingDays,
    cart,
  });

  if (!orderId) {
    return res.status(500).json({ error: "Erro ao finalizar pedido" });
  }

  let url = await createPaymentlink({
    cart,
    shippingCost,
    orderId,
  });

  if (!url) {
    return res.status(500).json({ error: "Erro ao criar link de pagamento" });
  }

  return res.status(201).json({
    error: null,
    orderId: orderId,
    url: url,
    message: "Pedido realizado com sucesso",
  });
};
