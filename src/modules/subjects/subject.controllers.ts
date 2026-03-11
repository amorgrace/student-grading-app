import type { Response } from "express";
import type { AuthRequest } from "../../middlewares/auth.middlewares.js";
import { prisma } from "../../lib/prisma.js";

export const getAllSubjects = async (req: AuthRequest, res: Response): Promise<void> => {
  /*
    #swagger.tags = ['Subjects']
    #swagger.description = 'Get all subjects'
    #swagger.security = [{ "bearerAuth": [] }]
  */
  try {
    const subjects = await prisma.subject.findMany({
      orderBy: { name: "asc" },
    });
    res.status(200).json(subjects);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getSubjectById = async (req: AuthRequest, res: Response): Promise<void> => {
  /*
    #swagger.tags = ['Subjects']
    #swagger.description = 'Get a single subject'
    #swagger.security = [{ "bearerAuth": [] }]
  */
  const { id } = req.params as { id: string };
  try {
    const subject = await prisma.subject.findUnique({ where: { id } });
    if (!subject) {
      res.status(404).json({ message: "Subject not found" });
      return;
    }
    res.status(200).json(subject);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};