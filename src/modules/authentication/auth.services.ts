import jwt from "jsonwebtoken";
import { prisma } from "../../lib/prisma.js";
import bcrypt from "bcrypt";
import type { RegisterInput, LoginInput, AuthResponse } from "./auth.types.js";
import { Role } from "../../generated/prisma/enums.js";

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET!;

export const registerUser = async (input: RegisterInput): Promise<AuthResponse> => {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) throw new Error("Email already in use");

  const hashedPassword = await bcrypt.hash(input.password, SALT_ROUNDS);

  const user = await prisma.user.create({
    data: {
      fullName: input.fullName,
      email: input.email,
      password: hashedPassword,
      role: input.role as Role,
    },
  });

  if (input.role === Role.teacher) {
    await prisma.teacher.create({
      data: { userId: user.id },
    });
  } else if (input.role === Role.student) {
    await prisma.student.create({
      data: { userId: user.id },
    });
  }

  const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: "7d" });

  return {
    user: { id: user.id, fullName: user.fullName, email: user.email, role: user.role },
    token,
    message: "Account created successfully 🎉",
  };
};

export const loginUser = async (input: LoginInput): Promise<AuthResponse> => {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  if (!user) throw new Error("Invalid email or password");

  const isMatch = await bcrypt.compare(input.password, user.password as string);
  if (!isMatch) throw new Error("Invalid email or password");

  const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: "7d" });

  return {
    user: { id: user.id, fullName: user.fullName, email: user.email, role: user.role },
    token,
    message: "Login is successful",
  };
};

export const logoutUser = () => {
  return { message: "Logged out successfully" };
};