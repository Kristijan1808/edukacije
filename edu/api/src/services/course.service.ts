import { prisma } from '../config/prisma.js';

export function listCourses(ownerId: string) {
  return prisma.course.findMany({
    where: { ownerId },
    include: { lessons: true, quizzes: { include: { questions: true } } },
    orderBy: { updatedAt: 'desc' },
  });
}

export function getCourse(id: string) {
  return prisma.course.findUnique({
    where: { id },
    include: {
      lessons: { orderBy: { order: 'asc' } },
      quizzes: { include: { questions: true } },
    },
  });
}

export function createCourse(ownerId: string, body: any) {
  const lessons = body.lessons || [{ title: 'Prva lekcija', content: [], order: 0 }];

  return prisma.course.create({
    data: {
      title: body.title || 'Nova edukacija',
      description: body.description || '',
      ownerId,
      theme: body.theme || {},
      settings: body.settings || {},
      lessons: {
        create: lessons.map((lesson: any, index: number) => ({
          title: lesson.title,
          content: lesson.content || [],
          order: lesson.order ?? index,
          durationMin: lesson.durationMin || 5,
        })),
      },
    },
    include: { lessons: true, quizzes: true },
  });
}

export async function updateCourse(id: string, body: any): Promise<void> {
  await prisma.$transaction(async (tx) => {
    await tx.course.update({
      where: { id },
      data: {
        title: body.title,
        description: body.description,
        status: body.status,
        theme: body.theme || {},
        settings: body.settings || {},
      },
    });

    await tx.lesson.deleteMany({ where: { courseId: id } });
    if (body.lessons?.length) {
      await tx.lesson.createMany({
        data: body.lessons.map((lesson: any, index: number) => ({
          courseId: id,
          title: lesson.title,
          order: index,
          content: lesson.content || [],
          durationMin: lesson.durationMin || 5,
        })),
      });
    }

    await tx.quiz.deleteMany({ where: { courseId: id } });
    for (const quiz of body.quizzes || []) {
      await tx.quiz.create({
        data: {
          courseId: id,
          title: quiz.title,
          passPercent: quiz.passPercent || 70,
          randomQuestionCount: quiz.randomQuestionCount || null,
          shuffleQuestions: quiz.shuffleQuestions !== false,
          shuffleAnswers: quiz.shuffleAnswers !== false,
          showFeedback: quiz.showFeedback !== false,
          questions: {
            create: (quiz.questions || []).map((question: any) => ({
              type: question.type,
              prompt: question.prompt,
              explanation: question.explanation || '',
              points: question.points || 1,
              config: question.config || {},
            })),
          },
        },
      });
    }
  });
}

export async function deleteCourse(id: string): Promise<void> {
  await prisma.course.delete({ where: { id } });
}
