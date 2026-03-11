import { prisma } from "../../lib/prisma.js";

export const enrollStudent = async (userId: string, classId: string) => {
  const student = await prisma.student.findUnique({ where: { userId } });
  if (!student) throw new Error("Student not found");
  if (student.classId) throw new Error("Student is already enrolled in a class");

  const cls = await prisma.classes.findUnique({ where: { id: classId } });
  if (!cls) throw new Error("Class not found");

  return await prisma.student.update({
    where: { userId },
    data: { classId },
    include: {
      classes: true,
      user: { select: { id: true, fullName: true, email: true, role: true } },
    },
  });
};

export const getStudentProfile = async (userId: string) => {
  const student = await prisma.student.findUnique({
    where: { userId },
    include: {
      user: { select: { id: true, fullName: true, email: true, role: true } },
      classes: true,
    },
  });
  if (!student) throw new Error("Student not found");
  return student;
};

export const updateStudentProfile = async (userId: string, data: { fullName?: string }) => {
  const student = await prisma.student.findUnique({ where: { userId } });
  if (!student) throw new Error("Student not found");

  const user = await prisma.user.update({
    where: { id: userId },
    data: { fullName: data.fullName },
    select: { id: true, fullName: true, email: true, role: true },
  });

  return user;
};

export const getStudentAssignments = async (userId: string) => {
  const student = await prisma.student.findUnique({ where: { userId } });
  if (!student) throw new Error("Student not found");
  if (!student.classId) throw new Error("Student is not enrolled in a class");

  return await prisma.assignment.findMany({
    where: { classId: student.classId },
    include: {
      subject: true,
      classes: true,
      teacher: {
        include: {
          user: { select: { fullName: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

export const getSingleAssignment = async (userId: string, assignmentId: string) => {
  const student = await prisma.student.findUnique({ where: { userId } });
  if (!student) throw new Error("Student not found");

  const assignment = await prisma.assignment.findUnique({
    where: { id: assignmentId },
    include: {
      subject: true,
      classes: true,
      teacher: {
        include: {
          user: { select: { fullName: true } },
        },
      },
    },
  });
  if (!assignment) throw new Error("Assignment not found");
  return assignment;
};

export const submitAssignment = async (
  userId: string,
  assignmentId: string,
  input: { answer?: string; fileUrl?: string }
) => {
  const student = await prisma.student.findUnique({ where: { userId } });
  if (!student) throw new Error("Student not found");

  const assignment = await prisma.assignment.findUnique({ where: { id: assignmentId } });
  if (!assignment) throw new Error("Assignment not found");

  const existing = await prisma.submission.findFirst({
    where: { assignmentId, studentId: student.id },
  });
  if (existing) throw new Error("Assignment already submitted");

  if (new Date() > assignment.deadline) throw new Error("Assignment deadline has passed");

  return await prisma.submission.create({
    data: {
      assignmentId,
      studentId: student.id,
      answer: input.answer,
      fileUrl: input.fileUrl,
    },
  });
};

export const getStudentSubmissions = async (userId: string) => {
  const student = await prisma.student.findUnique({ where: { userId } });
  if (!student) throw new Error("Student not found");

  return await prisma.submission.findMany({
    where: { studentId: student.id },
    include: {
      assignment: {
        include: {
          subject: true,
          classes: true,
        },
      },
    },
    orderBy: { submittedAt: "desc" },
  });
};