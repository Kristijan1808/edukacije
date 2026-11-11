import fs from 'fs';
import cors from 'cors';
import express from 'express';
import { env } from './config/env.js';
import { errorHandler } from './middleware/error.middleware.js';
import { apiRouter } from './routes/index.js';

export function createApp() {
  const app = express();
  fs.mkdirSync(env.uploadsDirectory, { recursive: true });
  app.use(cors());
  app.use(express.json({ limit: '20mb' }));
  app.use('/uploads', express.static(env.uploadsDirectory));
  app.use('/api', apiRouter);
  app.use(errorHandler);
  return app;
}
