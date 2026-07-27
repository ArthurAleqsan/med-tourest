import { Schema, model, Types, type Model, type InferSchemaType } from 'mongoose';

const specialtySchema = new Schema(
  {
    name: { type: String, required: true, trim: true, index: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    shortDescription: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    icon: { type: String, trim: true },
    treatments: { type: [String], default: [] },
    isActive: { type: Boolean, default: true, index: true },
    displayOrder: { type: Number, default: 0, index: true },
  },
  { timestamps: true },
);

export type SpecialtyDocument = InferSchemaType<typeof specialtySchema> & { _id: Types.ObjectId };

export const Specialty: Model<SpecialtyDocument> = model<SpecialtyDocument>(
  'Specialty',
  specialtySchema,
);
