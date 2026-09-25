import type { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../lib/auth.js';
import prisma from '../lib/prisma.js';

export interface AuthRequest extends Request {
  user?: { id: string; role: string; email: string };
}

export async function optionalAuth(req: AuthRequest, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (header?.startsWith('Bearer ')) {
    const payload = verifyToken(header.slice(7));
    if (payload) {
      req.user = { id: payload.userId, role: payload.role, email: payload.email };
    }
  }
  next();
}

export async function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const payload = verifyToken(header.slice(7));
  if (!payload) {
    return res.status(401).json({ error: 'Invalid token' });
  }
  const user = await prisma.user.findUnique({ where: { id: payload.userId } });
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }
  req.user = { id: user.id, role: user.role, email: user.email };
  next();
}

export function requireAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin only' });
  }
  next();
}
