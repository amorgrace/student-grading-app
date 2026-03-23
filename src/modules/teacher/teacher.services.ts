import { prisma } from "../../lib/prisma.js";
import type { CreateAssignmentInput, UpdateAssignmentInput, GradeSubmissionInput } from "./teacher.types.js";

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

export const updateTeacherProfile = async (userId: string, data: { fullName?: string }) => {
  const teacher = await prisma.teacher.findUnique({ where: { userId } });
  if (!teacher) throw new Error("Teacher not found");

  const user = await prisma.user.update({
    where: { id: userId },
    data: { fullName: data.fullName },
    select: { id: true, fullName: true, email: true, role: true },
  });

  return user;
};

export const createAssignment = async (userId: string, input: CreateAssignmentInput) => {
  const teacher = await prisma.teacher.findUnique({ where: { userId } });
  if (!teacher) throw new Error("Teacher not found");

  const assignment = await prisma.assignment.create({
    data: {
      title: input.title,
      question: input.question,
      fileUrl: input.fileUrl,
      deadline: new Date(input.deadline),
      totalMarks: input.totalMarks,
      teacherId: teacher.id,
      classId: input.classId,
      subjectId: input.subjectId,
    },
    include: {
      classes: true,
      subject: true,
    },
  });

  return assignment;
};

export const getTeacherAssignments = async (userId: string) => {
  const teacher = await prisma.teacher.findUnique({ where: { userId } });
  if (!teacher) throw new Error("Teacher not found");

  return await prisma.assignment.findMany({
    where: { teacherId: teacher.id },
    include: {
      classes: true,
      subject: true,
      submissions: true,
    },
    orderBy: { createdAt: "desc" },
  });
};

export const updateAssignment = async (userId: string, assignmentId: string, input: UpdateAssignmentInput) => {
  const teacher = await prisma.teacher.findUnique({ where: { userId } });
  if (!teacher) throw new Error("Teacher not found");

  const assignment = await prisma.assignment.findFirst({
    where: { id: assignmentId, teacherId: teacher.id },
  });
  if (!assignment) throw new Error("Assignment not found");

  return await prisma.assignment.update({
    where: { id: assignmentId },
    data: {
      ...input,
      deadline: input.deadline ? new Date(input.deadline) : undefined,
    },
  });
};

export const deleteAssignment = async (userId: string, assignmentId: string) => {
  const teacher = await prisma.teacher.findUnique({ where: { userId } });
  if (!teacher) throw new Error("Teacher not found");

  const assignment = await prisma.assignment.findFirst({
    where: { id: assignmentId, teacherId: teacher.id },
  });
  if (!assignment) throw new Error("Assignment not found");

  await prisma.assignment.delete({ where: { id: assignmentId } });
  return { message: "Assignment deleted successfully" };
};

export const getAssignmentSubmissions = async (userId: string, assignmentId: string) => {
  const teacher = await prisma.teacher.findUnique({ where: { userId } });
  if (!teacher) throw new Error("Teacher not found");

  const assignment = await prisma.assignment.findFirst({
    where: { id: assignmentId, teacherId: teacher.id },
  });
  if (!assignment) throw new Error("Assignment not found");

  return await prisma.submission.findMany({
    where: { assignmentId },
    include: {
      student: {
        include: {
          user: { select: { fullName: true, email: true } },
        },
      },
    },
  });
};

export const getSingleAssignment = async (userId: string, assignmentId: string) => {
  const teacher = await prisma.teacher.findUnique({ where: { userId } });
  if (!teacher) throw new Error("Teacher not found");

  const assignment = await prisma.assignment.findFirst({
    where: { id: assignmentId, teacherId: teacher.id },
    include: {
      classes: true,
      subject: true,
      submissions: true,
    },
  });
  if (!assignment) throw new Error("Assignment not found");
  return assignment;
};

export const gradeSubmission = async (userId: string, submissionId: string, input: GradeSubmissionInput) => {
  const teacher = await prisma.teacher.findUnique({ where: { userId } });
  if (!teacher) throw new Error("Teacher not found");

  const submission = await prisma.submission.findUnique({
    where: { id: submissionId },
    include: { assignment: true },
  });
  if (!submission) throw new Error("Submission not found");
  if (submission.assignment.teacherId !== teacher.id) throw new Error("Unauthorized");

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