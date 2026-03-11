import { prisma } from "../../lib/prisma.js";

export const getAllClasses = async () => {
  return await prisma.classes.findMany({
    orderBy: { name: "asc" },
  });
};

export const enrollStudent = async (userId: string, classId: string) => {
  const student = await prisma.student.findUnique({ where: { userId } });
  if (!student) throw new Error("Student not found");

  if (student.classId) throw new Error("Student is already enrolled in a class");

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