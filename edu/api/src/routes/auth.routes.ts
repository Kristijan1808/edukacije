import { Router } from 'express';
import { loginUser, registerUser } from '../services/auth.service.js';
import { asyncHandler } from '../utils/async-handler.js';

export const authRouter = Router();

authRouter.post('/register', asyncHandler(async (req: { body: any; }, res: { json: (arg0: any) => void; }) => {
  res.json(await registerUser(req.body));
}));

authRouter.post('/login', asyncHandler(async (req: any, res: any) => {
  const result = await loginUser(req.body);
  if (!result) return res.status(401).json({ message: 'Pogrešan email ili lozinka.' });
  res.json(result);
}));
