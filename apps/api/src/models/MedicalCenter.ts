import { Schema, model, Types, type Model, type InferSchemaType } from 'mongoose';

const medicalCenterSchema = new Schema(
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
    en_address: { type: String, required: true, trim: true },
    ru_address: { type: String, required: true, trim: true },
    am_address: { type: String, required: true, trim: true },
    en_city: { type: String, required: true, trim: true, index: true },
    ru_city: { type: String, required: true, trim: true },
    am_city: { type: String, required: true, trim: true },
    phone: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    website: { type: String, trim: true },
    photoUrl: { type: String, trim: true },
    isActive: { type: Boolean, default: true, index: true },
    displayOrder: { type: Number, default: 0, index: true },
  },
  { timestamps: true },
);

export type MedicalCenterDocument = InferSchemaType<typeof medicalCenterSchema> & {
  _id: Types.ObjectId;
};

export const MedicalCenter: Model<MedicalCenterDocument> = model<MedicalCenterDocument>(
  'MedicalCenter',
  medicalCenterSchema,
);
