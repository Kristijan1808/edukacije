import { Router } from 'express';
import { authRouter } from './auth.routes.js';
import { courseRouter } from './course.routes.js';
import { otherRouter } from './other.routes.js';

export const apiRouter = Router();
apiRouter.use(otherRouter);
apiRouter.use('/auth', authRouter);
apiRouter.use('/courses', courseRouter);
