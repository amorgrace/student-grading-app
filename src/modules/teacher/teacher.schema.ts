import { z } from "zod";

export const createAssignmentSchema = z.object({
  title: z.string().min(1, "Title is required"),
  question: z.string().optional(),
  fileUrl: z.string().url().optional(),
  deadline: z.string().min(1, "Deadline is required"),
  totalMarks: z.number().min(1, "Total marks must be at least 1"),
  classId: z.string().min(1, "Class is required"),
  subjectId: z.string().min(1, "Subject is required"),
});

export const updateAssignmentSchema = z.object({
  title: z.string().min(1).optional(),
  question: z.string().optional(),
  fileUrl: z.string().url().optional(),
  deadline: z.string().optional(),
  totalMarks: z.number().min(1).optional(),
  classId: z.string().optional(),
  subjectId: z.string().optional(),
});

export const gradeSubmissionSchema = z.object({
  score: z.number().min(0, "Score cannot be negative"),
  feedback: z.string().optional(),
});

export type CreateAssignmentSchema = z.infer<typeof createAssignmentSchema>;
export type UpdateAssignmentSchema = z.infer<typeof updateAssignmentSchema>;
export type GradeSubmissionSchema = z.infer<typeof gradeSubmissionSchema>;