import express from 'express';
import cors from 'cors';
import path from 'path';
import authRoutes from './routes/auth.js';
import entitiesRoutes from './routes/entities.js';
import contentRoutes from './routes/content.js';
import uploadRoutes from './routes/upload.js';
import sitemapRoutes from './routes/sitemap.js';

const app = express();

const origins = (process.env.CORS_ORIGIN || '*').split(',').map((s) => s.trim());
app.use(
  cors({
    origin: origins.includes('*') ? true : origins,
    credentials: true,
  })
);
app.use(express.json({ limit: '2mb' }));
app.use('/uploads', express.static(path.resolve(process.env.UPLOAD_DIR || './uploads')));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: '7golden-backend', time: new Date().toISOString() });
});

// Compatibility stubs for leftover Base44 client calls (AuthContext etc.)
app.get('/api/apps/public/:env/public-settings/by-id/:id', (req, res) => {
  res.json({ id: req.params.id, site_mode: 'corporate', public: true });
});
app.get('/api/apps/:appId/public-settings', (_req, res) => {
  res.json({ site_mode: 'corporate', public: true });
});

app.use('/api/auth', authRoutes);
app.use('/api', entitiesRoutes);
app.use('/api', contentRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api', sitemapRoutes);

app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: err.message || 'Internal error' });
});

export default app;
