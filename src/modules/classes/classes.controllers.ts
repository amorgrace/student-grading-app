import type { Request, Response } from "express";
import { getAllClasses, enrollStudent } from "./classes.services.js";
import type { AuthRequest } from "../../middlewares/auth.middlewares.js";
import { prisma } from "../../lib/prisma.js";

export const getClasses = async (req: Request, res: Response): Promise<void> => {
  /*
    #swagger.tags = ['Classes']
    #swagger.description = 'Get all classes'
  */
  try {
    const result = await getAllClasses();
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const enrollStudentController = async (req: AuthRequest, res: Response): Promise<void> => {
  /*
    #swagger.tags = ['Classes']
    #swagger.description = 'Enroll student in a class'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: {
        classId: 'classId here'
      }
    }
  */
  try {
    const result = await enrollStudent(req.userId!, req.body.classId);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};


export const getClassById = async (req: AuthRequest, res: Response): Promise<void> => {
  /*
    #swagger.tags = ['Classes']
    #swagger.description = 'Get a single class'
    #swagger.security = [{ "bearerAuth": [] }]
  */
  const { id } = req.params as { id: string };
  try {
    const cls = await prisma.classes.findUnique({ where: { id } });
    if (!cls) {
      res.status(404).json({ message: "Class not found" });
      return;
    }
    res.status(200).json(cls);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};