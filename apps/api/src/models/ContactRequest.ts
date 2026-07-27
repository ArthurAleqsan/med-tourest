import { Schema, model, Types, type Model, type InferSchemaType } from 'mongoose';
import { CONTACT_METHODS, CONTACT_REQUEST_STATUSES } from '@mta/shared';

const contactRequestSchema = new Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true, index: true },
    preferredContactMethod: { type: String, enum: CONTACT_METHODS },
    contactValue: { type: String, trim: true },
    subject: { type: String, trim: true },
    message: { type: String, required: true, trim: true },
    status: { type: String, enum: CONTACT_REQUEST_STATUSES, default: 'new', index: true },
  },
  { timestamps: true },
);

contactRequestSchema.index({ createdAt: -1 });

export type ContactRequestDocument = InferSchemaType<typeof contactRequestSchema> & {
  _id: Types.ObjectId;
};

export const ContactRequest: Model<ContactRequestDocument> = model<ContactRequestDocument>(
  'ContactRequest',
  contactRequestSchema,
);
