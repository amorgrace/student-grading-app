import type { Response } from "express";
import type { AuthRequest } from "../../middlewares/auth.middlewares.js";
import { prisma } from "../../lib/prisma.js";

export const getAllSubjects = async (req: AuthRequest, res: Response): Promise<void> => {
  // #swagger.tags = ['Subjects']
  // #swagger.summary = 'Get all subjects'
  // #swagger.description = 'Returns a list of all available subjects ordered alphabetically. These are seeded subjects available for teachers to use when creating assignments.'
  // #swagger.security = [{ "bearerAuth": [] }]
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
  // #swagger.tags = ['Subjects']
  // #swagger.summary = 'Get a single subject'
  // #swagger.description = 'Returns the details of a single subject by its ID. Returns 404 if subject does not exist.'
  // #swagger.security = [{ "bearerAuth": [] }]
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