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
  // #swagger.tags = ['Student']
  // #swagger.summary = 'Enroll in a class'
  // #swagger.description = 'Enrolls the authenticated student into a class using the classId. A student can only enroll once and cannot switch classes after enrollment.'
  // #swagger.security = [{ "bearerAuth": [] }]
  // #swagger.parameters['authorization'] = { in: 'header', type: 'string', description: 'Bearer token' }
  /*
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
  // #swagger.tags = ['Student']
  // #swagger.summary = 'Get student profile'
  // #swagger.description = 'Returns the authenticated student profile including their enrolled class and user details.'
  // #swagger.security = [{ "bearerAuth": [] }]
  // #swagger.parameters['authorization'] = { in: 'header', type: 'string', description: 'Bearer token' }
  try {
    const result = await getStudentProfile(req.userId!);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  // #swagger.tags = ['Student']
  // #swagger.summary = 'Update student profile'
  // #swagger.description = 'Updates the authenticated student full name. Only fullName can be updated at this time.'
  // #swagger.security = [{ "bearerAuth": [] }]
  // #swagger.parameters['authorization'] = { in: 'header', type: 'string', description: 'Bearer token' }
  /*
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
  // #swagger.tags = ['Student']
  // #swagger.summary = 'Get all assignments'
  // #swagger.description = 'Returns all assignments for the class the student is enrolled in. Student must be enrolled in a class to access this endpoint.'
  // #swagger.security = [{ "bearerAuth": [] }]
  // #swagger.parameters['authorization'] = { in: 'header', type: 'string', description: 'Bearer token' }
  try {
    const result = await getStudentAssignments(req.userId!);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getAssignment = async (req: AuthRequest, res: Response): Promise<void> => {
  // #swagger.tags = ['Student']
  // #swagger.summary = 'Get a single assignment'
  // #swagger.description = 'Returns the details of a single assignment by its ID including subject, class and teacher information.'
  // #swagger.security = [{ "bearerAuth": [] }]
  // #swagger.parameters['authorization'] = { in: 'header', type: 'string', description: 'Bearer token' }
  const { id } = req.params as { id: string };
  try {
    const result = await getSingleAssignment(req.userId!, id);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};

export const submit = async (req: AuthRequest, res: Response): Promise<void> => {
  // #swagger.tags = ['Student']
  // #swagger.summary = 'Submit an assignment'
  // #swagger.description = 'Submits an answer for an assignment. Student can either type an answer or provide a Cloudinary file URL. Cannot submit after the deadline or submit twice.'
  // #swagger.security = [{ "bearerAuth": [] }]
  // #swagger.parameters['authorization'] = { in: 'header', type: 'string', description: 'Bearer token' }
  /*
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
  // #swagger.tags = ['Student']
  // #swagger.summary = 'Get all submissions'
  // #swagger.description = 'Returns all submissions made by the authenticated student including grade, score, feedback and submission status.'
  // #swagger.security = [{ "bearerAuth": [] }]
  // #swagger.parameters['authorization'] = { in: 'header', type: 'string', description: 'Bearer token' }
  try {
    const result = await getStudentSubmissions(req.userId!);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
