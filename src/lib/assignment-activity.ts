export type ActiveFilter = boolean | undefined;

export const parseActiveFilter = (value: unknown): ActiveFilter => {
  if (value === "true") return true;
  if (value === "false") return false;
  return undefined;
};

export const parsePositiveInteger = (
  value: unknown,
  fallback: number,
): number => {
  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed < 1) {
    return fallback;
  }

  return parsed;
};

export const getDeadlineDayEnd = (deadline: Date): Date => {
  const deadlineDayEnd = new Date(deadline);
  deadlineDayEnd.setHours(23, 59, 59, 999);
  return deadlineDayEnd;
};

export const normalizeDeadlineInput = (deadline: string | Date): Date =>
  getDeadlineDayEnd(new Date(deadline));

export const buildAssignmentDeadlineFilter = (
  active?: boolean,
): { deadline?: { gte?: Date; lt?: Date } } => {
  if (active === undefined) return {};

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  return {
    deadline: active ? { gte: todayStart } : { lt: todayStart },
  };
};

export const isAssignmentActive = (deadline: Date): boolean =>
  getDeadlineDayEnd(deadline).getTime() > Date.now();

export const addAssignmentActivity = <T extends { deadline: Date }>(
  assignment: T,
): T & { isActive: boolean } => ({
  ...assignment,
  isActive: isAssignmentActive(assignment.deadline),
});
