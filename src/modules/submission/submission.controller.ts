import type { Response } from "express";
import type { AuthRequest } from "../../middlewares/auth.middlewares.js";
import { getSubmission, updateSubmission, deleteSubmission } from "./submission.service.js";
import { updateSubmissionSchema } from "./submission.schema.js";

export const getSubmissionController = async (req: AuthRequest, res: Response): Promise<void> => {
  /*
    #swagger.tags = ['Submissions']
    #swagger.description = 'Get a single submission'
    #swagger.security = [{ "bearerAuth": [] }]
  */
  const { id } = req.params as { id: string };
  try {
    const result = await getSubmission(req.userId!, id, req.role!);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};

export const updateSubmissionController = async (req: AuthRequest, res: Response): Promise<void> => {
  /*
    #swagger.tags = ['Submissions']
    #swagger.description = 'Update a submission (student only, before graded)'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: {
        answer: 'My updated answer',
        fileUrl: 'https://cloudinary.com/file.pdf'
      }
    }
  */
  const { id } = req.params as { id: string };
  const parsed = updateSubmissionSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ errors: parsed.error.flatten().fieldErrors });
    return;
  }
  try {
    const result = await updateSubmission(req.userId!, id, parsed.data);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteSubmissionController = async (req: AuthRequest, res: Response): Promise<void> => {
  /*
    #swagger.tags = ['Submissions']
    #swagger.description = 'Delete a submission (student only, before graded)'
    #swagger.security = [{ "bearerAuth": [] }]
  */
  const { id } = req.params as { id: string };
  try {
    const result = await deleteSubmission(req.userId!, id);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};