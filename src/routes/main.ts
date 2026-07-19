import { Router } from "express";
import * as bannersController from "../constrollers/banners";
import * as productsController from "../constrollers/product";

export const routes = Router();

routes.get("/ping", (req, res) => {
  res.json({ message: "pong" });
});

routes.get("/banners", bannersController.getBanners);
routes.get("/products", productsController.getProducts);
routes.get("/products/:id", productsController.getOneProduct);
