import { createApp } from './app';
import { env } from './config/env';
import { connectDatabase, disconnectDatabase } from './config/db';
import { logger } from './config/logger';

async function bootstrap(): Promise<void> {
  await connectDatabase(env.MONGODB_URI);
  const app = createApp();

  const server = app.listen(env.PORT, () => {
    logger.info(`API listening on http://localhost:${env.PORT}`, {
      env: env.NODE_ENV,
      docs: `http://localhost:${env.PORT}/api/docs`,
    });
  });

  const shutdown = async (signal: string): Promise<void> => {
    logger.info(`Received ${signal}, shutting down gracefully`);
    server.close();
    await disconnectDatabase();
    process.exit(0);
  };

  process.on('SIGINT', () => void shutdown('SIGINT'));
  process.on('SIGTERM', () => void shutdown('SIGTERM'));
}

bootstrap().catch((error) => {
  logger.error('Failed to start server', {
    message: error instanceof Error ? error.message : 'unknown',
  });
  process.exit(1);
});
