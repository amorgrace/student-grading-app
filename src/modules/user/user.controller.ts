import type { Response } from "express";
import { prisma } from "../../lib/prisma.js";
import type { AuthRequest } from "../../middlewares/auth.middlewares.js";;

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  // #swagger.tags = ['User']
  // #swagger.description = 'Get current logged in user'
  // #swagger.security = [{ "bearerAuth": [] }]
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({ user });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};