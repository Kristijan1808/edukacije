import { Router } from 'express';
import { env } from '../config/env.js';
import { prisma } from '../config/prisma.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { uploadMiddleware } from '../middleware/upload.middleware.js';
import { generateCourseOutline } from '../services/ai.service.js';
import { getCourseReport } from '../services/report.service.js';
import { asyncHandler } from '../utils/async-handler.js';

export const otherRouter = Router();

otherRouter.get('/health', (_req, res) => {
  res.json({ ok: true, ai: Boolean(env.ollamaUrl) });
});

otherRouter.get('/templates', asyncHandler(async (_req, res) => {
  res.json(await prisma.template.findMany({ orderBy: { createdAt: 'desc' } }));
}));

otherRouter.post('/assets', authMiddleware, uploadMiddleware.single('file'), asyncHandler(async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'Datoteka nije poslana.' });
  const asset = await prisma.asset.create({
    data: {
      name: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      path: `/uploads/${req.file.filename}`,
    },
  });
  res.json(asset);
}));

otherRouter.get('/reports/:courseId', authMiddleware, asyncHandler(async (req, res) => {
  res.json(await getCourseReport(req.params.courseId.toString()));
}));

otherRouter.post('/ai/outline', authMiddleware, asyncHandler(async (req, res) => {
  if (!env.ollamaUrl) return res.status(503).json({ message: 'Ollama nije konfigurirana.' });
  res.json(await generateCourseOutline(req.body.text));
}));
