import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { prisma } from '../config/prisma.js';

function createToken(user: { id: string; email: string; role: string }): string {
  return jwt.sign({ sub: user.id, email: user.email, role: user.role }, env.jwtSecret, { expiresIn: '7d' });
}

export async function registerUser(input: { email: string; password: string; name: string }) {
  const user = await prisma.user.create({
    data: {
      email: input.email,
      passwordHash: await bcrypt.hash(input.password, 10),
      name: input.name,
    },
  });

  return {
    token: createToken(user),
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
  };
}

export async function loginUser(input: { email: string; password: string }) {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  if (!user || !(await bcrypt.compare(input.password, user.passwordHash))) return null;

  return {
    token: createToken(user),
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
  };
}
