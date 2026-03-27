import type { Response } from "express";
import type { AuthRequest } from "../../middlewares/auth.middlewares.js";
import {
  parseActiveFilter,
  parsePositiveInteger,
} from "../../lib/assignment-activity.js";
import {
  getTeacherProfile,
  updateTeacherProfile,
  createAssignment,
  getTeacherAssignments,
  updateAssignment,
  deleteAssignment,
  getAssignmentSubmissions,
  gradeSubmission,
  getSingleAssignment,
} from "./teacher.services.js";
import {
  createAssignmentSchema,
  updateAssignmentSchema,
  gradeSubmissionSchema,
} from "./teacher.schema.js";

export const getProfile = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  // #swagger.tags = ['Teacher']
  // #swagger.summary = 'Get teacher profile'
  // #swagger.description = 'Returns the authenticated teacher profile including their user details and associated subjects and assignments.'
  // #swagger.security = [{ "bearerAuth": [] }]
  // #swagger.parameters['authorization'] = { in: 'header', type: 'string', description: 'Bearer token' }
  try {
    const result = await getTeacherProfile(req.userId!);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};

export const updateProfile = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  // #swagger.tags = ['Teacher']
  // #swagger.summary = 'Update teacher profile'
  // #swagger.description = 'Updates the authenticated teacher full name. Only fullName can be updated at this time.'
  // #swagger.security = [{ "bearerAuth": [] }]
  // #swagger.parameters['authorization'] = { in: 'header', type: 'string', description: 'Bearer token' }
  try {
    const result = await updateTeacherProfile(req.userId!, req.body);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const createAssignmentController = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  // #swagger.tags = ['Teacher']
  // #swagger.summary = 'Create a new assignment'
  // #swagger.description = 'Creates a new assignment for a specific class and subject. Teacher can provide a question as text or upload a file via Cloudinary URL. A deadline and total marks must be provided.'
  // #swagger.security = [{ "bearerAuth": [] }]
  // #swagger.parameters['authorization'] = { in: 'header', type: 'string', description: 'Bearer token' }
  /*
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

export const getAssignmentsController = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  // #swagger.tags = ['Teacher']
  // #swagger.summary = 'Get all assignments'
  // #swagger.description = 'Returns all assignments created by the authenticated teacher including class, subject and submission details. Ordered by most recent first.'
  // #swagger.security = [{ "bearerAuth": [] }]
  // #swagger.parameters['authorization'] = { in: 'header', type: 'string', description: 'Bearer token' }
  // #swagger.parameters['active'] = { in: 'query', type: 'string', description: 'Optional activity filter. Use true for active assignments and false for inactive assignments.' }
  // #swagger.parameters['page'] = { in: 'query', type: 'number', description: 'Page number. Defaults to 1.' }
  // #swagger.parameters['pageSize'] = { in: 'query', type: 'number', description: 'Assignments per page. Defaults to 16.' }
  try {
    const result = await getTeacherAssignments(
      req.userId!,
      parseActiveFilter(req.query.active),
      parsePositiveInteger(req.query.page, 1),
      parsePositiveInteger(req.query.pageSize, 16),
    );
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getSingleAssignmentController = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  // #swagger.tags = ['Teacher']
  // #swagger.summary = 'Get a single assignment'
  // #swagger.description = 'Returns the details of a single assignment by ID including class, subject and all submissions. Only the teacher who created the assignment can view it.'
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

export const updateAssignmentController = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  // #swagger.tags = ['Teacher']
  // #swagger.summary = 'Update an assignment'
  // #swagger.description = 'Updates an existing assignment by ID. Only the teacher who created the assignment can update it. All fields are optional.'
  // #swagger.security = [{ "bearerAuth": [] }]
  // #swagger.parameters['authorization'] = { in: 'header', type: 'string', description: 'Bearer token' }
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

export const deleteAssignmentController = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  // #swagger.tags = ['Teacher']
  // #swagger.summary = 'Delete an assignment'
  // #swagger.description = 'Permanently deletes an assignment by ID. Only the teacher who created the assignment can delete it.'
  // #swagger.security = [{ "bearerAuth": [] }]
  // #swagger.parameters['authorization'] = { in: 'header', type: 'string', description: 'Bearer token' }
  const { id } = req.params as { id: string };
  try {
    const result = await deleteAssignment(req.userId!, id);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getSubmissionsController = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  // #swagger.tags = ['Teacher']
  // #swagger.summary = 'Get all submissions for an assignment'
  // #swagger.description = 'Returns all student submissions for a specific assignment. Only the teacher who created the assignment can view its submissions. Includes student details and submission status.'
  // #swagger.security = [{ "bearerAuth": [] }]
  // #swagger.parameters['authorization'] = { in: 'header', type: 'string', description: 'Bearer token' }
  const { id } = req.params as { id: string };
  try {
    const result = await getAssignmentSubmissions(req.userId!, id);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const gradeSubmissionController = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  // #swagger.tags = ['Teacher']
  // #swagger.summary = 'Grade a submission'
  // #swagger.description = 'Grades a student submission by providing a score and optional feedback. The grade is automatically calculated based on the score and total marks. Submission status is updated to graded.'
  // #swagger.security = [{ "bearerAuth": [] }]
  // #swagger.parameters['authorization'] = { in: 'header', type: 'string', description: 'Bearer token' }
  /*
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
