import { Request, Response } from "express";
import { registerSchema } from "../schemas/register-schema";
import {
  addAddressToUser,
  createUser,
  getUserAddresses,
  logUser,
} from "../services/user";
import { loginschema } from "../schemas/login-schema";
import { addAddressSchema } from "../schemas/add-address-schema";

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

export const addAddress = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  if (!userId) {
    return res.status(401).json({ error: "Usuário não autenticado" });
  }

  const address = req.body.address || req.body;
  console.log("Address received:", address);

  if (!address || (!address.zipcode && !address.zipCode && !address.street)) {
    return res.status(400).json({ error: "Endereço não fornecido" });
  }

  const normalizedAddress = {
    ...address,
    zipcode: address.zipcode || address.zipCode,
  };

  const result = addAddressSchema.safeParse(normalizedAddress);

  if (!result.success) {
    return res.status(400).json({
      error: "Dados do endereço inválidos",
      details: result.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
  }

  const addressUser = await addAddressToUser(userId, result.data);

  if (!addressUser) {
    return res.status(500).json({ error: "Erro ao adicionar endereço" });
  }

  return res.json({
    error: null,
    address: addressUser,
    message: "Endereço adicionado com sucesso",
  });
};

export const getAddresses = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  if (!userId) {
    return res.status(401).json({ error: "Usuário não autenticado" });
  }

  const addresses = await getUserAddresses(userId);

  if (!addresses) {
    return res.status(404).json({ error: "Endereços não encontrados" });
  }

  return res.json({
    error: null,
    addresses,
    message: "Endereços recuperados com sucesso",
  });
};
