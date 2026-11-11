import { prisma } from '../config/prisma.js';

export async function getCourseReport(courseId: string) {
  const [enrollments, attempts] = await Promise.all([
    prisma.enrollment.findMany({ where: { courseId } }),
    prisma.attempt.findMany({ where: { quiz: { courseId } }, include: { quiz: true } }),
  ]);

  return {
    enrollments,
    attempts,
    summary: {
      assigned: enrollments.length,
      completed: enrollments.filter((x) => x.completedAt).length,
      passed: attempts.filter((x) => x.passed).length,
      average: attempts.length
        ? attempts.reduce((sum, attempt) => sum + attempt.score, 0) / attempts.length
        : 0,
    },
  };
}
