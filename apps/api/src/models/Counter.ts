import { Schema, model, type Model } from 'mongoose';

export interface CounterDocument {
  _id: string;
  sequence: number;
}

const counterSchema = new Schema<CounterDocument>({
  _id: { type: String, required: true },
  sequence: { type: Number, required: true, default: 0 },
});

export const Counter: Model<CounterDocument> = model<CounterDocument>('Counter', counterSchema);

/**
 * Atomically increments and returns the next sequence value for a key.
 * Using a single findOneAndUpdate with $inc avoids race conditions when
 * multiple requests generate reference numbers concurrently.
 */
export async function nextSequence(key: string): Promise<number> {
  const doc = await Counter.findByIdAndUpdate(
    key,
    { $inc: { sequence: 1 } },
    { new: true, upsert: true },
  ).lean();
  return doc!.sequence;
}
