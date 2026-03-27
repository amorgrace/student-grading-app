import { prisma } from "../../lib/prisma.js";

export const getAllClasses = async (
  page: number = 1,
  pageSize: number = 50,
) => {
  const skip = (page - 1) * pageSize;
  return await prisma.classes.findMany({
    select: {
      id: true,
      name: true,
      createdAt: true,
      _count: { select: { students: true, assignments: true } },
    },
    orderBy: { name: "asc" },
    skip,
    take: pageSize,
  });
};

export const enrollStudent = async (userId: string, classId: string) => {
  const student = await prisma.student.findUnique({ where: { userId } });
  if (!student) throw new Error("Student not found");

  if (student.classId)
    throw new Error("Student is already enrolled in a class");

  const classes = await prisma.classes.findUnique({ where: { id: classId } });
  if (!classes) throw new Error("Class not found");

  return await prisma.student.update({
    where: { userId },
    data: { classId },
    include: {
      classes: true,
      user: { select: { fullName: true, email: true } },
    },
  });
};
