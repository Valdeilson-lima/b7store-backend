import { Router } from "express";
import * as bannersController from "../constrollers/banners";

export const routes = Router();

routes.get("/ping", (req, res) => {
  res.json({ message: "pong" });
});

routes.get("/banners", bannersController.getBanners);
