import type { Request, Response } from "express";
import {
  getAllClasses,
  enrollStudent,
  getClassStudentCount,
} from "./classes.services.js";
import type { AuthRequest } from "../../middlewares/auth.middlewares.js";
import { prisma } from "../../lib/prisma.js";

export const getClasses = async (req: Request, res: Response): Promise<void> => {
  // #swagger.tags = ['Classes']
  // #swagger.summary = 'Get all classes'
  // #swagger.description = 'Returns a list of all available classes from Basic 1 to Basic 5. Accessible to all users.'
  try {
    const result = await getAllClasses();
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const enrollStudentController = async (req: AuthRequest, res: Response): Promise<void> => {
  // #swagger.tags = ['Classes']
  // #swagger.summary = 'Enroll student in a class'
  // #swagger.description = 'Enrolls the currently authenticated student into a class. A student can only enroll once and cannot change their class after enrollment.'
  // #swagger.security = [{ "bearerAuth": [] }]
  /*
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
  // #swagger.tags = ['Classes']
  // #swagger.summary = 'Get a single class'
  // #swagger.description = 'Returns the details of a single class by its ID. Requires authentication.'
  // #swagger.security = [{ "bearerAuth": [] }]
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

export const getClassStudentCountController = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  // #swagger.tags = ['Classes']
  // #swagger.summary = 'Get total students in a class'
  // #swagger.description = 'Returns the total number of students currently enrolled in a specific class. Requires authentication.'
  // #swagger.security = [{ "bearerAuth": [] }]
  // #swagger.parameters['authorization'] = { in: 'header', type: 'string', description: 'Bearer token' }
  const { id } = req.params as { id: string };

  try {
    const result = await getClassStudentCount(id);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(error.message === "Class not found" ? 404 : 400).json({
      message: error.message,
    });
  }
};
