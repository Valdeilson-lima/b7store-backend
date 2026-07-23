import { Router } from "express";
import * as bannersController from "../constrollers/banners";
import * as productsController from "../constrollers/product";
import * as categoryController from "../constrollers/category";
import * as cartController from "../constrollers/cart";

export const routes = Router();

routes.get("/ping", (req, res) => {
  res.json({ message: "pong" });
});

routes.get("/banners", bannersController.getBanners);
routes.get("/products", productsController.getProducts);
routes.get("/products/:id", productsController.getOneProduct);
routes.get("/products/:id/related", productsController.getRelatedProducts);
routes.get(
  "/category/:slug/metadata",
  categoryController.getCategoryWithMetadata,
);

routes.post("/cart/mount", cartController.cartMount);
