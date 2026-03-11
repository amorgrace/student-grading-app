export interface EnrollInput {
  classId: string;
}

export interface SubmitAssignmentInput {
  answer?: string;
  fileUrl?: string;
}

export interface UpdateStudentProfileInput {
  fullName?: string;
}