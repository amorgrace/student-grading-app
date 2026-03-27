import { prisma } from "../../lib/prisma.js";

export const getSubmission = async (
  userId: string,
  submissionId: string,
  role: string,
  studentId?: string,
  teacherId?: string,
) => {
  if (role === "student") {
    const submission = await prisma.submission.findFirst({
      where: {
        id: submissionId,
        student: studentId ? { id: studentId } : { userId },
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
        updatedAt: true,
        assignment: {
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
          },
        },
        student: {
          select: {
            id: true,
            user: { select: { fullName: true, email: true } },
          },
        },
      },
    });

    if (!submission) throw new Error("Submission not found");
    return submission;
  }

  if (role === "teacher") {
    const submission = await prisma.submission.findFirst({
      where: {
        id: submissionId,
        assignment: {
          teacher: teacherId ? { id: teacherId } : { userId },
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
        updatedAt: true,
        assignment: {
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
          },
        },
        student: {
          select: {
            id: true,
            user: { select: { fullName: true, email: true } },
          },
        },
      },
    });

    if (!submission) throw new Error("Submission not found");
    return submission;
  }

  const submission = await prisma.submission.findUnique({
    where: { id: submissionId },
    select: {
      id: true,
      answer: true,
      fileUrl: true,
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
          question: true,
          fileUrl: true,
          deadline: true,
          totalMarks: true,
          status: true,
          subject: { select: { id: true, name: true } },
          classes: { select: { id: true, name: true } },
        },
      },
      student: {
        select: {
          id: true,
          user: { select: { fullName: true, email: true } },
        },
      },
    },
  });
  if (!submission) throw new Error("Submission not found");

  return submission;
};

export const updateSubmission = async (
  userId: string,
  submissionId: string,
  input: { answer?: string; fileUrl?: string },
) => {
  const submission = await prisma.submission.findUnique({
    where: { id: submissionId },
    include: { student: { select: { userId: true } } },
  });
  if (!submission) throw new Error("Submission not found");
  if (submission.student.userId !== userId) throw new Error("Unauthorized");
  if (submission.status === "graded")
    throw new Error("Cannot update a graded submission");

  return await prisma.submission.update({
    where: { id: submissionId },
    data: {
      answer: input.answer,
      fileUrl: input.fileUrl,
    },
  });
};

export const deleteSubmission = async (
  userId: string,
  submissionId: string,
) => {
  const submission = await prisma.submission.findUnique({
    where: { id: submissionId },
    include: { student: { select: { userId: true } } },
  });
  if (!submission) throw new Error("Submission not found");
  if (submission.student.userId !== userId) throw new Error("Unauthorized");
  if (submission.status === "graded")
    throw new Error("Cannot delete a graded submission");

  await prisma.submission.delete({ where: { id: submissionId } });
  return { message: "Submission deleted successfully" };
};
