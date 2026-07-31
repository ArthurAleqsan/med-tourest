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
    en_shortDescription: { type: String, required: true, trim: true },
    ru_shortDescription: { type: String, required: true, trim: true },
    am_shortDescription: { type: String, required: true, trim: true },
    en_biography: { type: String, required: true, trim: true },
    ru_biography: { type: String, required: true, trim: true },
    am_biography: { type: String, required: true, trim: true },
    en_education: { type: [String], default: [] },
    ru_education: { type: [String], default: [] },
    am_education: { type: [String], default: [] },
    en_certifications: { type: [String], default: [] },
    ru_certifications: { type: [String], default: [] },
    am_certifications: { type: [String], default: [] },
    en_treatments: { type: [String], default: [] },
    ru_treatments: { type: [String], default: [] },
    am_treatments: { type: [String], default: [] },
    languages: { type: [String], default: [], index: true },
    yearsOfExperience: { type: Number, required: true, min: 0 },
    consultationPrice: { type: Number, min: 0 },
    consultationCurrency: { type: String, trim: true, uppercase: true },
    isFeatured: { type: Boolean, default: false, index: true },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true },
);

doctorSchema.index({ firstName: 'text', lastName: 'text' });

export type DoctorDocument = InferSchemaType<typeof doctorSchema> & { _id: Types.ObjectId };

export const Doctor: Model<DoctorDocument> = model<DoctorDocument>('Doctor', doctorSchema);
