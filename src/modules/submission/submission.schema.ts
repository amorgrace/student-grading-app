import { z } from "zod";

export const updateSubmissionSchema = z.object({
  answer: z.string().optional(),
  fileUrl: z.string().url().optional(),
}).refine((data) => data.answer || data.fileUrl, {
  message: "Either answer or fileUrl is required",
});

export type UpdateSubmissionSchema = z.infer<typeof updateSubmissionSchema>;