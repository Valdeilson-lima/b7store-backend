export const getFrontendUrl = () => {
  const frontendUrl = process.env.FRONTEND_URL;

  if (!frontendUrl) {
    throw new Error("Frontend URL is not defined in the environment variables.");
  }

  return frontendUrl;
};