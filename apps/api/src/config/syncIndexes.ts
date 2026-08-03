import { logger } from './logger';
import { Specialty } from '../models/Specialty';
import { MedicalCenter } from '../models/MedicalCenter';
import { Package } from '../models/Package';
import { Doctor } from '../models/Doctor';

/**
 * Drops obsolete indexes (e.g. unique `name` from pre-i18n schemas) and
 * creates indexes defined on the current models. Without this, inserts that
 * omit the old `name` field can collide on `name: null` and fail with 11000.
 */
export async function syncContentIndexes(): Promise<void> {
  const models = [
    { name: 'Specialty', model: Specialty },
    { name: 'MedicalCenter', model: MedicalCenter },
    { name: 'Package', model: Package },
    { name: 'Doctor', model: Doctor },
  ] as const;

  for (const { name, model } of models) {
    try {
      const dropped = await model.syncIndexes();
      if (dropped.length > 0) {
        logger.info('Dropped obsolete indexes', { model: name, dropped });
      }
    } catch (error) {
      logger.error('Failed to sync indexes', {
        model: name,
        message: error instanceof Error ? error.message : 'unknown',
      });
      throw error;
    }
  }
}
