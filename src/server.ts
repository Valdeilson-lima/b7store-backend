import express from "express";
import type { NextFunction, Response, Request } from "express";
import cors from "cors";
import { routes } from "./routes/main";

const server = express();
server.use(cors());
server.use(express.json());
server.use(express.static("public"));

server.use("/api", routes);

server.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  
  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || "Internal Server Error";
  
  res.status(statusCode).json({ error: message });
});

server.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT || 3333}`);
});
