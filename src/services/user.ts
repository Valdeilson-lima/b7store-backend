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
