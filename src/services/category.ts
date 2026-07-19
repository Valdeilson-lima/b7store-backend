import { prisma } from "../lib/prisma";

export const getCategory = async (id: string) => {
  const category = await prisma.category.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      name: true,
      slug: true,
    },
  });
  return category;
};
