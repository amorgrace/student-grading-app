import { prisma } from "../../lib/prisma.js";
import type {
  CreateAssignmentInput,
  UpdateAssignmentInput,
  GradeSubmissionInput,
} from "./teacher.types.js";

const calculateGrade = (score: number, totalMarks: number): string => {
  const percentage = (score / totalMarks) * 100;
  if (percentage >= 70) return "A";
  if (percentage >= 60) return "B";
  if (percentage >= 50) return "C";
  if (percentage >= 40) return "D";
  return "F";
};

export const getTeacherProfile = async (userId: string) => {
  const teacher = await prisma.teacher.findUnique({
    where: { userId },
    include: {
      user: {
        select: { id: true, fullName: true, email: true, role: true },
      },
    },
  });

  if (!teacher) throw new Error("Teacher not found");
  return teacher;
};

export const updateTeacherProfile = async (
  userId: string,
  data: { fullName?: string },
) => {
  const teacher = await prisma.teacher.findUnique({ where: { userId } });
  if (!teacher) throw new Error("Teacher not found");

  const user = await prisma.user.update({
    where: { id: userId },
    data: { fullName: data.fullName },
    select: { id: true, fullName: true, email: true, role: true },
  });

  return user;
};

export const createAssignment = async (
  userId: string,
  input: CreateAssignmentInput,
) => {
  const assignment = await prisma.assignment.create({
    data: {
      title: input.title,
      question: input.question,
      fileUrl: input.fileUrl,
      deadline: new Date(input.deadline),
      totalMarks: input.totalMarks,
      teacher: { connect: { userId } },
      classId: input.classId,
      subjectId: input.subjectId,
    },
    select: {
      id: true,
      title: true,
      question: true,
      fileUrl: true,
      deadline: true,
      totalMarks: true,
      status: true,
      classes: { select: { id: true, name: true } },
      subject: { select: { id: true, name: true } },
    },
  });

  return assignment;
};

export const getTeacherAssignments = async (
  userId: string,
  page: number = 1,
  pageSize: number = 20,
) => {
  const skip = (page - 1) * pageSize;
  return await prisma.assignment.findMany({
    where: { teacher: { userId } },
    select: {
      id: true,
      title: true,
      deadline: true,
      totalMarks: true,
      status: true,
      classes: { select: { id: true, name: true } },
      subject: { select: { id: true, name: true } },
      _count: { select: { submissions: true } },
    },
    orderBy: { createdAt: "desc" },
    skip,
    take: pageSize,
  });
};

export const updateAssignment = async (
  userId: string,
  assignmentId: string,
  input: UpdateAssignmentInput,
) => {
  const result = await prisma.assignment.updateMany({
    where: {
      id: assignmentId,
      teacher: { userId },
    },
    data: {
      ...input,
      deadline: input.deadline ? new Date(input.deadline) : undefined,
    },
  });

  if (result.count === 0) throw new Error("Assignment not found");

  return await prisma.assignment.findUnique({
    where: { id: assignmentId },
  });
};

export const deleteAssignment = async (
  userId: string,
  assignmentId: string,
) => {
  const result = await prisma.assignment.deleteMany({
    where: {
      id: assignmentId,
      teacher: { userId },
    },
  });

  if (result.count === 0) throw new Error("Assignment not found");
  return { message: "Assignment deleted successfully" };
};

export const getAssignmentSubmissions = async (
  userId: string,
  assignmentId: string,
  page: number = 1,
  pageSize: number = 50,
) => {
  const skip = (page - 1) * pageSize;
  const submissions = await prisma.submission.findMany({
    where: {
      assignmentId,
      assignment: {
        teacher: { userId },
      },
    },
    select: {
      id: true,
      answer: true,
      fileUrl: true,
      score: true,
      grade: true,
      status: true,
      feedback: true,
      submittedAt: true,
      student: {
        select: {
          user: { select: { fullName: true, email: true } },
        },
      },
    },
    skip,
    take: pageSize,
  });

  if (submissions.length > 0) return submissions;

  const assignment = await prisma.assignment.findFirst({
    where: {
      id: assignmentId,
      teacher: { userId },
    },
    select: { id: true },
  });
  if (!assignment) throw new Error("Assignment not found");

  return submissions;
};

export const getSingleAssignment = async (
  userId: string,
  assignmentId: string,
) => {
  const assignment = await prisma.assignment.findFirst({
    where: {
      id: assignmentId,
      teacher: { userId },
    },
    select: {
      id: true,
      title: true,
      question: true,
      fileUrl: true,
      deadline: true,
      totalMarks: true,
      status: true,
      classes: { select: { id: true, name: true } },
      subject: { select: { id: true, name: true } },
      _count: { select: { submissions: true } },
    },
  });
  if (!assignment) throw new Error("Assignment not found");
  return assignment;
};

export const gradeSubmission = async (
  userId: string,
  submissionId: string,
  input: GradeSubmissionInput,
) => {
  const submission = await prisma.submission.findUnique({
    where: { id: submissionId },
    include: {
      assignment: {
        select: {
          totalMarks: true,
          teacher: { select: { userId: true } },
        },
      },
    },
  });
  if (!submission) throw new Error("Submission not found");
  if (submission.assignment.teacher.userId !== userId) throw new Error("Unauthorized");

  const grade = calculateGrade(input.score, submission.assignment.totalMarks);

  return await prisma.submission.update({
    where: { id: submissionId },
    data: {
      score: input.score,
      grade,
      feedback: input.feedback,
      status: "graded",
    },
  });
};
