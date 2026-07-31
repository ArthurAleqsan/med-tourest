import { Schema, model, Types, type Model, type InferSchemaType } from 'mongoose';

const specialtySchema = new Schema(
  {
    en_name: { type: String, required: true, trim: true, index: true },
    ru_name: { type: String, required: true, trim: true },
    am_name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    en_shortDescription: { type: String, required: true, trim: true },
    ru_shortDescription: { type: String, required: true, trim: true },
    am_shortDescription: { type: String, required: true, trim: true },
    en_description: { type: String, required: true, trim: true },
    ru_description: { type: String, required: true, trim: true },
    am_description: { type: String, required: true, trim: true },
    icon: { type: String, trim: true },
    en_treatments: { type: [String], default: [] },
    ru_treatments: { type: [String], default: [] },
    am_treatments: { type: [String], default: [] },
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
