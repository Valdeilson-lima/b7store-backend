import { getBaseUrl } from "./get-base-url";

export const getAbsoluteImageUrl = (imagePath: string): string => {
  const baseUrl = getBaseUrl();
  return `${baseUrl}/${imagePath}`;
};
