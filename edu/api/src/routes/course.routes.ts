import { Router } from 'express';
import { authMiddleware, type AuthRequest } from '../middleware/auth.middleware.js';
import { createCourse, deleteCourse, getCourse, listCourses, updateCourse } from '../services/course.service.js';
import { exportCourseToPptx, exportCourseToScorm } from '../services/export.service.js';
import { asyncHandler } from '../utils/async-handler.js';

export const courseRouter = Router();
courseRouter.use(authMiddleware);

courseRouter.get('/', asyncHandler(async (req: AuthRequest, res) => {
  res.json(await listCourses(req.user!.sub));
}));

courseRouter.post('/', asyncHandler(async (req: AuthRequest, res) => {
  res.json(await createCourse(req.user!.sub, req.body));
}));

courseRouter.get('/:id', asyncHandler(async (req, res) => {
  res.json(await getCourse(req.params.id.toString()));
}));

courseRouter.put('/:id', asyncHandler(async (req, res) => {
  await updateCourse(req.params.id.toString(), req.body);
  res.json({ ok: true });
}));

courseRouter.delete('/:id', asyncHandler(async (req, res) => {
  await deleteCourse(req.params.id.toString());
  res.json({ ok: true });
}));

courseRouter.get('/:id/export/pptx', asyncHandler(async (req, res) => {
  await exportCourseToPptx(req.params.id.toString() , res);
}));

courseRouter.get('/:id/export/scorm', asyncHandler(async (req, res) => {
  await exportCourseToScorm(req.params.id.toString(), res);
}));
