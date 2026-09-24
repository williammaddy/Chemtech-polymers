import express from 'express';
import { apiRouter } from '../server/apiRouter.js';

const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Support both /api/... rewrites and direct calls on Vercel
app.use('/api', apiRouter);
app.use('/', apiRouter);

export default app;

