import { Schema, model, Types, type Model, type InferSchemaType } from 'mongoose';

const medicalCenterSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, index: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    shortDescription: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true, index: true },
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
