import type { Response } from "express";
import type { AuthRequest } from "../../middlewares/auth.middlewares.js";
import {
  getTeacherProfile,
  updateTeacherProfile,
  createAssignment,
  getTeacherAssignments,
  updateAssignment,
  deleteAssignment,
  getAssignmentSubmissions,
  gradeSubmission,
} from "./teacher.services.js";
import {
  createAssignmentSchema,
  updateAssignmentSchema,
  gradeSubmissionSchema,
} from "./teacher.schema.js";

export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  /*
    #swagger.tags = ['Teacher']
    #swagger.description = 'Get teacher profile'
    #swagger.security = [{ "bearerAuth": [] }]
  */
  try {
    const result = await getTeacherProfile(req.userId!);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  /*
    #swagger.tags = ['Teacher']
    #swagger.description = 'Update teacher profile'
    #swagger.security = [{ "bearerAuth": [] }]
  */
  try {
    const result = await updateTeacherProfile(req.userId!, req.body);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const createAssignmentController = async (req: AuthRequest, res: Response): Promise<void> => {
  /*
    #swagger.tags = ['Teacher']
    #swagger.description = 'Create a new assignment'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: {
        title: 'Math Assignment',
        question: 'Solve the following...',
        fileUrl: 'https://cloudinary.com/file.pdf',
        deadline: '2026-04-01T00:00:00.000Z',
        totalMarks: 100,
        classId: 'classId here',
        subjectId: 'subjectId here'
      }
    }
  */
  const parsed = createAssignmentSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ errors: parsed.error.flatten().fieldErrors });
    return;
  }

  try {
    const result = await createAssignment(req.userId!, parsed.data);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getAssignmentsController = async (req: AuthRequest, res: Response): Promise<void> => {
  /*
    #swagger.tags = ['Teacher']
    #swagger.description = 'Get all assignments created by teacher'
    #swagger.security = [{ "bearerAuth": [] }]
  */
  try {
    const result = await getTeacherAssignments(req.userId!);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const updateAssignmentController = async (req: AuthRequest, res: Response): Promise<void> => {
  /*
    #swagger.tags = ['Teacher']
    #swagger.description = 'Update an assignment'
    #swagger.security = [{ "bearerAuth": [] }]
  */
  const { id } = req.params as { id: string };
  const parsed = updateAssignmentSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ errors: parsed.error.flatten().fieldErrors });
    return;
  }

  try {
    const result = await updateAssignment(req.userId!, id, parsed.data);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteAssignmentController = async (req: AuthRequest, res: Response): Promise<void> => {
  /*
    #swagger.tags = ['Teacher']
    #swagger.description = 'Delete an assignment'
    #swagger.security = [{ "bearerAuth": [] }]
  */
  const { id } = req.params as { id: string };
  try {
    const result = await deleteAssignment(req.userId!, id);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getSubmissionsController = async (req: AuthRequest, res: Response): Promise<void> => {
  /*
    #swagger.tags = ['Teacher']
    #swagger.description = 'Get all submissions for an assignment'
    #swagger.security = [{ "bearerAuth": [] }]
  */
  const { id } = req.params as { id: string };
  try {
    const result = await getAssignmentSubmissions(req.userId!, id);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const gradeSubmissionController = async (req: AuthRequest, res: Response): Promise<void> => {
  /*
    #swagger.tags = ['Teacher']
    #swagger.description = 'Grade a student submission'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: {
        score: 85,
        feedback: 'Good work!'
      }
    }
  */
  const { id } = req.params as { id: string };
  const parsed = gradeSubmissionSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ errors: parsed.error.flatten().fieldErrors });
    return;
  }

  try {
    const result = await gradeSubmission(req.userId!, id, parsed.data);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};