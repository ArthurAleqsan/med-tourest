import mongoose from 'mongoose';
import { logger } from './logger';

mongoose.set('strictQuery', true);

export async function connectDatabase(uri: string): Promise<typeof mongoose> {
  const connection = await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 10000,
  });
  logger.info('MongoDB connected', { host: connection.connection.host });
  return connection;
}

export async function disconnectDatabase(): Promise<void> {
  await mongoose.disconnect();
  logger.info('MongoDB disconnected');
}

export function isDatabaseConnected(): boolean {
  return mongoose.connection.readyState === 1;
}
