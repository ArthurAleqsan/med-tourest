import { Schema, model, Types, type Model, type InferSchemaType } from 'mongoose';

const tourSchema = new Schema(
  {
    en_title: { type: String, required: true, trim: true },
    ru_title: { type: String, required: true, trim: true },
    am_title: { type: String, required: true, trim: true },
    en_description: { type: String, required: true, trim: true },
    ru_description: { type: String, required: true, trim: true },
    am_description: { type: String, required: true, trim: true },
  },
  { _id: false },
);

const hotelSchema = new Schema(
  {
    en_name: { type: String, required: true, trim: true },
    ru_name: { type: String, required: true, trim: true },
    am_name: { type: String, required: true, trim: true },
    stars: { type: Number, min: 1, max: 5 },
    en_roomType: { type: String, trim: true },
    ru_roomType: { type: String, trim: true },
    am_roomType: { type: String, trim: true },
    nights: { type: Number, min: 0 },
    en_description: { type: String, trim: true },
    ru_description: { type: String, trim: true },
    am_description: { type: String, trim: true },
  },
  { _id: false },
);

const packageSchema = new Schema(
  {
    en_name: { type: String, required: true, trim: true, index: true },
    ru_name: { type: String, required: true, trim: true },
    am_name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    durationDays: { type: Number, required: true, min: 1, index: true },
    en_shortDescription: { type: String, required: true, trim: true },
    ru_shortDescription: { type: String, required: true, trim: true },
    am_shortDescription: { type: String, required: true, trim: true },
    en_description: { type: String, required: true, trim: true },
    ru_description: { type: String, required: true, trim: true },
    am_description: { type: String, required: true, trim: true },
    hotel: { type: hotelSchema, required: true },
    tours: { type: [tourSchema], default: [] },
    en_inclusions: { type: [String], default: [] },
    ru_inclusions: { type: [String], default: [] },
    am_inclusions: { type: [String], default: [] },
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
