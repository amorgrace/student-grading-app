import { z } from "zod";

export const enrollSchema = z.object({
  classId: z.string().min(1, "Class is required"),
});

export const submitAssignmentSchema = z.object({
  answer: z.string().optional(),
  fileUrl: z.string().url().optional(),
}).refine((data) => data.answer || data.fileUrl, {
  message: "Either answer or fileUrl is required",
});

export const updateProfileSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters").optional(),
});

export type UpdateProfileSchema = z.infer<typeof updateProfileSchema>;

export type EnrollSchema = z.infer<typeof enrollSchema>;
export type SubmitAssignmentSchema = z.infer<typeof submitAssignmentSchema>;