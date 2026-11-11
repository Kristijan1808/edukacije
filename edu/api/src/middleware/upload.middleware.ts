import multer from 'multer';
import { env } from '../config/env.js';

export const uploadMiddleware = multer({
  dest: `${env.uploadsDirectory}/`,
  limits: { fileSize: 25 * 1024 * 1024 },
});
