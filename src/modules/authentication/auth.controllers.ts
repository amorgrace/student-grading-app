import type { Request, Response } from "express";
import { registerUser, loginUser, logoutUser } from "./auth.services.js";
import { registerSchema, loginSchema } from "./auth.schema.js";
import type { RegisterInput, LoginInput } from "./auth.types.js";

export const register = async (req: Request, res: Response): Promise<void> => {
  // #swagger.tags = ['Auth']
  // #swagger.summary = 'Register a new user'
  // #swagger.description = 'Creates a new user account with fullName, email, password and role. Automatically creates a Teacher or Student record based on the role provided.'
  /*
    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: {
        fullName: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        confirmPassword: 'password123',
        role: 'student'
      }
    }
  */
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ errors: parsed.error.flatten().fieldErrors });
    return;
  }

  try {
    const result = await registerUser(parsed.data as RegisterInput);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(409).json({ message: error.message });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  // #swagger.tags = ['Auth']
  // #swagger.summary = 'Login user'
  // #swagger.description = 'Authenticates a user with email and password. Returns a JWT token valid for 7 days along with the user profile.'
  /*
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
    const result = await loginUser(parsed.data as LoginInput);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(401).json({ message: error.message });
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  // #swagger.tags = ['Auth']
  // #swagger.summary = 'Logout user'
  // #swagger.description = 'Invalidates the current JWT token by blacklisting it. The token can no longer be used after this request. Requires a valid Bearer token.'
  // #swagger.security = [{ "bearerAuth": [] }]
  res.status(200).json(logoutUser());
};
