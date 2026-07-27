import { Schema, model, Types, type Model, type InferSchemaType } from 'mongoose';

const tourSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
  },
  { _id: false },
);

const hotelSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    stars: { type: Number, min: 1, max: 5 },
    roomType: { type: String, trim: true },
    nights: { type: Number, min: 0 },
    description: { type: String, trim: true },
  },
  { _id: false },
);

const packageSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, index: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    durationDays: { type: Number, required: true, min: 1, index: true },
    shortDescription: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    hotel: { type: hotelSchema, required: true },
    tours: { type: [tourSchema], default: [] },
    inclusions: { type: [String], default: [] },
    priceFrom: { type: Number, min: 0 },
    currency: { type: String, trim: true, uppercase: true },
    photoUrl: { type: String, trim: true },
    isActive: { type: Boolean, default: true, index: true },
    displayOrder: { type: Number, default: 0, index: true },
  },
  { timestamps: true },
);

export type PackageDocument = InferSchemaType<typeof packageSchema> & {
  _id: Types.ObjectId;
};

export const Package: Model<PackageDocument> = model<PackageDocument>('Package', packageSchema);
