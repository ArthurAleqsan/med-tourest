import express, { type Express } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { env } from './config/env';
import { httpLogger } from './config/logger';
import { generalLimiter } from './middleware/rateLimit';
import { apiRouter } from './routes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { setupSwagger } from './config/swagger';

export function createApp(): Express {
  const app = express();

  app.disable('x-powered-by');
  app.set('trust proxy', 1);

  app.use(helmet());
  const allowedOrigins = [env.CLIENT_URL, env.ADMIN_URL].filter(
    (value): value is string => Boolean(value),
  );
  app.use(
    cors({
      origin(origin, callback) {
        // Allow non-browser clients (no Origin) and configured frontends.
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
          return;
        }
        callback(new Error(`CORS blocked for origin: ${origin}`));
      },
      credentials: true,
    }),
  );

  // Request body size limits.
  app.use(express.json({ limit: '100kb' }));
  app.use(express.urlencoded({ extended: true, limit: '100kb' }));

  app.use(httpLogger);
  app.use(generalLimiter);

  setupSwagger(app);

  app.use('/api/v1', apiRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
