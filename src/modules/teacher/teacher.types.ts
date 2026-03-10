export interface CreateAssignmentInput {
  title: string;
  question?: string;
  fileUrl?: string;
  deadline: string;
  totalMarks: number;
  classId: string;
  subjectId: string;
}

export interface UpdateAssignmentInput {
  title?: string;
  question?: string;
  fileUrl?: string;
  deadline?: string;
  totalMarks?: number;
  classId?: string;
  subjectId?: string;
}

export interface GradeSubmissionInput {
  score: number;
  feedback?: string;
}