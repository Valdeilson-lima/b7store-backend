import express from "express";
import type { NextFunction, Response, Request } from "express";
import cors from "cors";
import { routes } from "./routes/main.js";

const server = express();
server.use(cors());
server.use(express.json());
server.use(express.static("public"));

server.use(routes);

server.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: "Internal Server Error" });
});

server.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT || 3333}`);
});
