import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import express from 'express';
import { apiRouter } from './server/apiRouter.js';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

function mongodbApiPlugin(): Plugin {
  const app = express();
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));
  app.use('/api', apiRouter);

  return {
    name: 'mongodb-api-plugin',
    configureServer(server) {
      server.middlewares.use(app);
    },
    configurePreviewServer(server) {
      server.middlewares.use(app);
    },
  };
}

export default defineConfig({
  plugins: [react(), mongodbApiPlugin()],
  server: {
    port: 3000,
    open: false,
  },
});
