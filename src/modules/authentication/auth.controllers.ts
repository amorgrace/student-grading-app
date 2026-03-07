import type { Request, Response } from "express";
import { registerUser, loginUser } from "./auth.services.js";
import { registerSchema, loginSchema } from "./auth.schema.js";

export const register = async (req: Request, res: Response): Promise<void> => {
  /*
    #swagger.tags = ['Auth']
    #swagger.description = 'Register a new user'
    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: {
        fullName: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        confirmPassword: 'password123'
      }
    }
  */
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ errors: parsed.error.flatten().fieldErrors });
    return;
  }

  try {
    const result = await registerUser(parsed.data);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(409).json({ message: error.message });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  /*
    #swagger.tags = ['Auth']
    #swagger.description = 'Log in an existing user'
    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: {
        email: 'john@example.com',
        password: 'password123'
      }
    }
  */
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ errors: parsed.error.flatten().fieldErrors });
    return;
  }

  try {
    const result = await loginUser(parsed.data);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(401).json({ message: error.message });
  }
};