import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

interface User {
  name: string;
  email: string;
  password: string;
}

class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = "AppError";
  }
}

export const createUser = async ({ name, email, password }: User) => {
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new AppError("Email já está em uso", 400);
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      name,
      email: email.trim().toLocaleLowerCase(),
      password: hashedPassword,
    },
  });
  if (!user) {
    throw new AppError("Erro ao criar usuário", 500);
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
};

export const logUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new AppError("Usuário não encontrado", 404);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new AppError("Senha inválida", 401);
  }

  const token = jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET || "default_secret",
    {
      expiresIn: "1h",
    },
  );

  await prisma.user.update({
    where: { id: user.id },
    data: { token },
  });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    token,
  };
};

export const getUserByToken = async (token: string) => {
  const user = await prisma.user.findFirst({
    where: { token },
  });

  if (!user) {
    throw new AppError("Usuário não encontrado", 404);
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
};

export interface Address {
  zipcode: string;
  street: string;
  number: string;
  city: string;
  state: string;
  country: string;
  complement?: string;
}

export const addAddressToUser = async (userId: string, address: Address) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AppError("Usuário não encontrado", 404);
  }

  const addAddress = await prisma.userAddress.create({
    data: {
      userId,
      zipCode: address.zipcode,
      street: address.street,
      number: address.number,
      city: address.city,
      state: address.state,
      country: address.country,
      complement: address.complement || null,
    },
  });

  if (!addAddress) {
    throw new AppError("Erro ao adicionar endereço", 500);
  }

  return addAddress;
};

export const getUserAddresses = async (userId: string) => {
  const user = await prisma.userAddress.findMany({
    where: { userId },
    select: {
      id: true,
      zipCode: true,
      street: true,
      number: true,
      city: true,
      state: true,
      country: true,
      complement: true,
    },
  });

  if (!user) {
    throw new AppError("Endereços não encontrados", 404);
  }

  return user;
};
