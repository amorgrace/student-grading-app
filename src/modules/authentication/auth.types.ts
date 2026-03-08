import { Role } from "../../generated/prisma/enums.js";

export interface RegisterInput {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    fullName: string;
    email: string;
    role: Role;
  };
  token: string;
  message: string;
}