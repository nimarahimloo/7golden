import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { requireAuth, requireAdmin, type AuthRequest } from '../middleware/auth.js';

const uploadDir = process.env.UPLOAD_DIR || './uploads';
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.random().toString(36).slice(2)}${path.extname(file.originalname)}`;
    cb(null, unique);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
});

const router = Router();

router.post('/', requireAuth, requireAdmin, upload.single('file'), (req: AuthRequest, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const base = process.env.PUBLIC_URL || `http://localhost:${process.env.PORT || 3001}`;
  const file_url = `${base}/uploads/${req.file.filename}`;
  res.json({ file_url });
});

export default router;
