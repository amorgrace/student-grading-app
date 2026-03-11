import type { Response } from "express";
import type { AuthRequest } from "../../middlewares/auth.middlewares.js";
import {
  enrollStudent,
  getStudentProfile,
  getStudentAssignments,
  getSingleAssignment,
  submitAssignment,
  getStudentSubmissions,
  updateStudentProfile
} from "./student.services.js";
import { enrollSchema, submitAssignmentSchema } from "./student.schema.js";

export const enroll = async (req: AuthRequest, res: Response): Promise<void> => {
  /*
    #swagger.tags = ['Student']
    #swagger.description = 'Enroll student in a class'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: { classId: 'classId here' }
    }
  */
  const parsed = enrollSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ errors: parsed.error.flatten().fieldErrors });
    return;
  }
  try {
    const result = await enrollStudent(req.userId!, parsed.data.classId);
    res.status(200).json({ message: "Enrolled successfully 🎉", result });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  /*
    #swagger.tags = ['Student']
    #swagger.description = 'Get student profile'
    #swagger.security = [{ "bearerAuth": [] }]
  */
  try {
    const result = await getStudentProfile(req.userId!);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  /*
    #swagger.tags = ['Student']
    #swagger.description = 'Update student profile'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: { fullName: 'John Doe' }
    }
  */
  try {
    const result = await updateStudentProfile(req.userId!, req.body);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getAssignments = async (req: AuthRequest, res: Response): Promise<void> => {
  /*
    #swagger.tags = ['Student']
    #swagger.description = 'Get all assignments for student class'
    #swagger.security = [{ "bearerAuth": [] }]
  */
  try {
    const result = await getStudentAssignments(req.userId!);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getAssignment = async (req: AuthRequest, res: Response): Promise<void> => {
  /*
    #swagger.tags = ['Student']
    #swagger.description = 'Get a single assignment'
    #swagger.security = [{ "bearerAuth": [] }]
  */
  const { id } = req.params as { id: string };
  try {
    const result = await getSingleAssignment(req.userId!, id);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};

export const submit = async (req: AuthRequest, res: Response): Promise<void> => {
  /*
    #swagger.tags = ['Student']
    #swagger.description = 'Submit an assignment'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: {
        answer: 'My answer here',
        fileUrl: 'https://cloudinary.com/file.pdf'
      }
    }
  */
  const { id } = req.params as { id: string };
  const parsed = submitAssignmentSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ errors: parsed.error.flatten().fieldErrors });
    return;
  }
  try {
    const result = await submitAssignment(req.userId!, id, parsed.data);
    res.status(201).json({ message: "Assignment submitted successfully 🎉", result });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getSubmissions = async (req: AuthRequest, res: Response): Promise<void> => {
  /*
    #swagger.tags = ['Student']
    #swagger.description = 'Get all student submissions'
    #swagger.security = [{ "bearerAuth": [] }]
  */
  try {
    const result = await getStudentSubmissions(req.userId!);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};