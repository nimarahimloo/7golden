import { Router } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma.js';
import { hashPassword, comparePassword, signToken } from '../lib/auth.js';
import { requireAuth, type AuthRequest } from '../middleware/auth.js';

const router = Router();

const credSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().optional(),
});

router.post('/register', async (req, res) => {
  try {
    const body = credSchema.parse(req.body);
    const existing = await prisma.user.findUnique({ where: { email: body.email } });
    if (existing) return res.status(409).json({ error: 'Email already registered' });

    const passwordHash = await hashPassword(body.password);
    const user = await prisma.user.create({
      data: {
        email: body.email,
        passwordHash,
        name: body.name,
        role: 'user',
      },
    });
    const token = signToken({ userId: user.id, role: user.role, email: user.email });
    res.status(201).json({
      access_token: token,
      user: { id: user.id, email: user.email, name: user.name, role: user.role, phone: user.phone },
    });
  } catch (e: any) {
    if (e.name === 'ZodError') return res.status(422).json({ error: 'Validation failed', details: e.errors });
    res.status(500).json({ error: e.message || 'Register failed' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const body = z.object({ email: z.string().email(), password: z.string() }).parse(req.body);
    const user = await prisma.user.findUnique({ where: { email: body.email } });
    if (!user || !(await comparePassword(body.password, user.passwordHash))) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const token = signToken({ userId: user.id, role: user.role, email: user.email });
    res.json({
      access_token: token,
      user: { id: user.id, email: user.email, name: user.name, role: user.role, phone: user.phone },
    });
  } catch (e: any) {
    if (e.name === 'ZodError') return res.status(422).json({ error: 'Validation failed', details: e.errors });
    res.status(500).json({ error: e.message || 'Login failed' });
  }
});

router.post('/logout', (_req, res) => {
  res.json({ success: true });
});

router.get('/me', requireAuth, async (req: AuthRequest, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ id: user.id, email: user.email, name: user.name, role: user.role, phone: user.phone });
});

router.patch('/me', requireAuth, async (req: AuthRequest, res) => {
  try {
    const data = z.object({ name: z.string().optional(), phone: z.string().optional() }).parse(req.body);
    const user = await prisma.user.update({
      where: { id: req.user!.id },
      data,
    });
    res.json({ id: user.id, email: user.email, name: user.name, role: user.role, phone: user.phone });
  } catch (e: any) {
    res.status(500).json({ error: e.message || 'Update failed' });
  }
});

export default router;
