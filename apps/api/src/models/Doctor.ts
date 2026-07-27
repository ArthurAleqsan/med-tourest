import { Schema, model, Types, type Model, type InferSchemaType } from 'mongoose';

const doctorSchema = new Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    specialty: { type: Schema.Types.ObjectId, ref: 'Specialty', required: true, index: true },
    centers: {
      type: [{ type: Schema.Types.ObjectId, ref: 'MedicalCenter' }],
      default: [],
      index: true,
    },
    photoUrl: { type: String, trim: true },
    shortDescription: { type: String, required: true, trim: true },
    biography: { type: String, required: true, trim: true },
    education: { type: [String], default: [] },
    certifications: { type: [String], default: [] },
    treatments: { type: [String], default: [] },
    languages: { type: [String], default: [], index: true },
    yearsOfExperience: { type: Number, required: true, min: 0 },
    consultationPrice: { type: Number, min: 0 },
    consultationCurrency: { type: String, trim: true, uppercase: true },
    isFeatured: { type: Boolean, default: false, index: true },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true },
);

// Text index to support name search.
doctorSchema.index({ firstName: 'text', lastName: 'text' });

export type DoctorDocument = InferSchemaType<typeof doctorSchema> & { _id: Types.ObjectId };

export const Doctor: Model<DoctorDocument> = model<DoctorDocument>('Doctor', doctorSchema);
