import { prisma } from "../../lib/prisma.js";

export const enrollStudent = async (userId: string, classId: string) => {
  // Single query to fetch student and check enrollment status
  const student = await prisma.student.findUnique({
    where: { userId },
    select: { classId: true },
  });
  if (!student) throw new Error("Student not found");
  if (student.classId)
    throw new Error("Student is already enrolled in a class");

  // Verify class exists and enroll in one update
  const updated = await prisma.student.update({
    where: { userId },
    data: { classId },
    include: {
      classes: true,
      user: { select: { id: true, fullName: true, email: true, role: true } },
    },
  });

  if (!updated.classes) throw new Error("Class not found");
  return updated;
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

export const updateStudentProfile = async (
  userId: string,
  data: { fullName?: string },
) => {
  const student = await prisma.student.findUnique({ where: { userId } });
  if (!student) throw new Error("Student not found");

  const user = await prisma.user.update({
    where: { id: userId },
    data: { fullName: data.fullName },
    select: { id: true, fullName: true, email: true, role: true },
  });

  return user;
};

export const getStudentAssignments = async (
  userId: string,
  page: number = 1,
  pageSize: number = 20,
) => {
  const student = await prisma.student.findUnique({
    where: { userId },
    select: { id: true, classId: true },
  });
  if (!student) throw new Error("Student not found");
  if (!student.classId) throw new Error("Student is not enrolled in a class");

  const skip = (page - 1) * pageSize;
  return await prisma.assignment.findMany({
    where: { classId: student.classId },
    include: {
      subject: { select: { id: true, name: true } },
      classes: { select: { id: true, name: true } },
      teacher: {
        select: {
          id: true,
          user: { select: { fullName: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
    skip,
    take: pageSize,
  });
};

export const getSingleAssignment = async (
  userId: string,
  assignmentId: string,
) => {
  const student = await prisma.student.findUnique({
    where: { userId },
    select: { classId: true },
  });
  if (!student) throw new Error("Student not found");
  if (!student.classId) throw new Error("Student is not enrolled in a class");

  const assignment = await prisma.assignment.findFirst({
    where: {
      id: assignmentId,
      classId: student.classId,
    },
    select: {
      id: true,
      title: true,
      question: true,
      fileUrl: true,
      deadline: true,
      totalMarks: true,
      status: true,
      subject: { select: { id: true, name: true } },
      classes: { select: { id: true, name: true } },
      teacher: {
        select: {
          id: true,
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
  input: { answer?: string; fileUrl?: string },
) => {
  const student = await prisma.student.findUnique({
    where: { userId },
    select: { id: true, classId: true },
  });
  if (!student) throw new Error("Student not found");

  const assignment = await prisma.assignment.findUnique({
    where: { id: assignmentId },
    select: { id: true, classId: true, deadline: true },
  });
  if (!assignment) throw new Error("Assignment not found");
  if (student.classId !== assignment.classId) {
    throw new Error("Unauthorized");
  }

  if (new Date() > assignment.deadline)
    throw new Error("Assignment deadline has passed");

  try {
    return await prisma.submission.create({
      data: {
        assignmentId,
        studentId: student.id,
        answer: input.answer,
        fileUrl: input.fileUrl,
      },
    });
  } catch (error: any) {
    if (error?.code === "P2002") {
      throw new Error("Assignment already submitted");
    }
    throw error;
  }
};

export const getStudentSubmissions = async (
  userId: string,
  page: number = 1,
  pageSize: number = 20,
) => {
  const student = await prisma.student.findUnique({
    where: { userId },
    select: { id: true },
  });
  if (!student) throw new Error("Student not found");

  const skip = (page - 1) * pageSize;
  return await prisma.submission.findMany({
    where: { studentId: student.id },
    select: {
      id: true,
      score: true,
      grade: true,
      status: true,
      feedback: true,
      submittedAt: true,
      updatedAt: true,
      assignment: {
        select: {
          id: true,
          title: true,
          subject: { select: { name: true } },
          classes: { select: { name: true } },
        },
      },
    },
    orderBy: { submittedAt: "desc" },
    skip,
    take: pageSize,
  });
};
