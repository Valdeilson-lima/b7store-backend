import { prisma } from "../lib/prisma";

interface GetAllProductsParams {
  metadata?: {
    [key: string]: string;
  };
  orderBy?: "views" | "selling" | "price";
  limit?: number;
}

export const getAllProducts = async ({
  metadata,
  orderBy,
  limit,
}: GetAllProductsParams) => {
  let orderby = {};
  switch (orderBy) {
    case "views":
      orderby = { viewsCount: "desc" };
      break;
    case "selling":
      orderby = { salesCount: "desc" };
      break;
    case "price":
      orderby = { price: "asc" };
      break;
  }

  let where: any = {};

  if (metadata && typeof metadata === "object") {
    let metadataFilters = [];
    for (let categoryMetadtaId in metadata) {
      const value = metadata[categoryMetadtaId];
      if (typeof value !== "string") {
        continue;
      }
      const valueIds = value
        .split("|")
        .map((v) => v.trim())
        .filter(Boolean);

      if (valueIds.length === 0) {
        continue;
      }

      metadataFilters.push({
        metada: {
          some: {
            categoryMetadataId: categoryMetadtaId,
            metadataValueId: {
              in: valueIds,
            },
          },
        },
      });
    }
    if (metadataFilters.length > 0) {
      where.AND = metadataFilters;
    }
  }

  const products = await prisma.product.findMany({
    select: {
      id: true,
      label: true,
      price: true,
      images: {
        take: 1,
        orderBy: {
          id: "asc",
        },
      },
    },
    where,
    orderBy: orderby,
    take: limit ?? undefined,
  });

  return products.map((product) => ({
    ...product,
    image: product.images[0] ? `media/products/${product.images[0].url}` : null,
    images: undefined,
  }));
};

export const getProduct = async (id: string) => {
  const product = await prisma.product.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      label: true,
      price: true,
      description: true,
      categoryId: true,
      images: true,
    },
  });

  if (!product) {
    return null;
  }

  return {
    ...product,
    images:
      product.images.length > 0
        ? product.images.map((image) => `media/products/${image.url}`)
        : [],
  };
};

export const incrementProductViews = async (id: string) => {
  await prisma.product.update({
    where: {
      id,
    },
    data: {
      viewsCount: {
        increment: 1,
      },
    },
  });
};

export const getProductsFromSameCategory = async (id: string, limit?: number) => {
  const products = await prisma.product.findMany({
    where: {
      categoryId: (await getProduct(id))?.categoryId,
      NOT: {
        id,
      },
    },
    select: {
      id: true,
      label: true,
      price: true,
      images: {
        take: 1,
        orderBy: {
          id: "asc",
        },
      },
    },
    take: limit ?? undefined,
    orderBy: {
      viewsCount: "desc",
    },
  });

  return products.map((product) => ({
    ...product,
    image: product.images[0] ? `media/products/${product.images[0].url}` : null,
    images: undefined,
  }));
};
