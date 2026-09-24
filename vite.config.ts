import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import express from 'express';
import { apiRouter } from './server/apiRouter.js';

function mongodbApiPlugin(): Plugin {
  return {
    name: 'mongodb-api-plugin',
    configureServer(server) {
      const app = express();
      app.use(express.json({ limit: '50mb' }));
      app.use(express.urlencoded({ extended: true, limit: '50mb' }));
      app.use('/api', apiRouter);
      server.middlewares.use(app);
    },
    configurePreviewServer(server) {
      const app = express();
      app.use(express.json({ limit: '50mb' }));
      app.use(express.urlencoded({ extended: true, limit: '50mb' }));
      app.use('/api', apiRouter);
      server.middlewares.use(app);
    }
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), mongodbApiPlugin()],
  server: {
    port: 3000,
    open: false
  }
});
