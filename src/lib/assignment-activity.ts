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

export const buildAssignmentDeadlineFilter = (
  active?: boolean,
): { deadline?: { gt?: Date; lte?: Date } } => {
  if (active === undefined) return {};

  return {
    deadline: active ? { gt: new Date() } : { lte: new Date() },
  };
};

export const isAssignmentActive = (deadline: Date): boolean =>
  deadline.getTime() > Date.now();

export const addAssignmentActivity = <T extends { deadline: Date }>(
  assignment: T,
): T & { isActive: boolean } => ({
  ...assignment,
  isActive: isAssignmentActive(assignment.deadline),
});
