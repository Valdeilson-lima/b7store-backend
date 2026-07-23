import { Request, Response } from "express";
import { registerSchema } from "../schemas/register-schema";
import { createUser, logUser } from "../services/user";
import { loginschema } from "../schemas/login-schema";

export const register = async (req: Request, res: Response) => {
  const parseResult = registerSchema.safeParse(req.body);

  if (!parseResult.success) {
    return res.status(400).json({ error: "Dados inválidos" });
  }

  const { name, email, password } = parseResult.data;

  const user = await createUser({ name, email, password });

  if (!user) {
    return res.status(500).json({ error: "Erro ao registrar usuário" });
  }

  return res.json({
    error: null,
    user,
    message: "Usuário registrado com sucesso",
  });
};

export const login = async (req: Request, res: Response) => {
  const result = loginschema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({ error: "Dados inválidos" });
  }

  const { email, password } = result.data;

  const user = await logUser(email, password);

  return res.json({
    error: null,
    user,
    message: "Login realizado com sucesso",
  });
};
