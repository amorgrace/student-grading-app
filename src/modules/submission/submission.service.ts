import { prisma } from "../../lib/prisma.js";

export const getSubmission = async (userId: string, submissionId: string, role: string) => {
  const submission = await prisma.submission.findUnique({
    where: { id: submissionId },
    include: {
      assignment: {
        include: { subject: true, classes: true },
      },
      student: {
        include: { user: { select: { fullName: true, email: true } } },
      },
    },
  });
  if (!submission) throw new Error("Submission not found");

  if (role === "student") {
    const student = await prisma.student.findUnique({ where: { userId } });
    if (submission.studentId !== student?.id) throw new Error("Unauthorized");
  }

  if (role === "teacher") {
    const teacher = await prisma.teacher.findUnique({ where: { userId } });
    if (submission.assignment.teacherId !== teacher?.id) throw new Error("Unauthorized");
  }

  return submission;
};

export const updateSubmission = async (
  userId: string,
  submissionId: string,
  input: { answer?: string; fileUrl?: string }
) => {
  const student = await prisma.student.findUnique({ where: { userId } });
  if (!student) throw new Error("Student not found");

  const submission = await prisma.submission.findUnique({ where: { id: submissionId } });
  if (!submission) throw new Error("Submission not found");
  if (submission.studentId !== student.id) throw new Error("Unauthorized");
  if (submission.status === "graded") throw new Error("Cannot update a graded submission");

  return await prisma.submission.update({
    where: { id: submissionId },
    data: {
      answer: input.answer,
      fileUrl: input.fileUrl,
    },
  });
};

export const deleteSubmission = async (userId: string, submissionId: string) => {
  const student = await prisma.student.findUnique({ where: { userId } });
  if (!student) throw new Error("Student not found");

  const submission = await prisma.submission.findUnique({ where: { id: submissionId } });
  if (!submission) throw new Error("Submission not found");
  if (submission.studentId !== student.id) throw new Error("Unauthorized");
  if (submission.status === "graded") throw new Error("Cannot delete a graded submission");

  await prisma.submission.delete({ where: { id: submissionId } });
  return { message: "Submission deleted successfully" };
};