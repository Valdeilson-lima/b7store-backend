import { Request, Response } from "express";
import { getAllBanners } from "../services/banner";
import { getAbsoluteImageUrl } from "../utils/get-absolut-image-url";

export const getBanners = async (req: Request, res: Response) => {
  const banners = await getAllBanners();
  const bannersWithAbsoluteUrls = banners.map((banner) => ({
    ...banner,
    img: getAbsoluteImageUrl(banner.img),
  }));
  res.json({ error: "null", data: bannersWithAbsoluteUrls });
};
