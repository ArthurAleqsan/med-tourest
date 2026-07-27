import { Schema, model, Types, type Model, type InferSchemaType } from 'mongoose';
import {
  APPOINTMENT_STATUSES,
  CONTACT_METHODS,
  PREFERRED_TIME_PERIODS,
} from '@mta/shared';

const appointmentRequestSchema = new Schema(
  {
    referenceNumber: { type: String, required: true, unique: true, index: true },
    doctor: { type: Schema.Types.ObjectId, ref: 'Doctor', index: true },
    specialty: { type: Schema.Types.ObjectId, ref: 'Specialty', required: true, index: true },
    preferredDate: { type: Date, required: true, index: true },
    preferredTimePeriod: {
      type: String,
      enum: PREFERRED_TIME_PERIODS,
      required: true,
      default: 'no_preference',
    },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true, index: true },
    country: { type: String, required: true, trim: true },
    phoneNumber: { type: String, trim: true },
    preferredContactMethod: { type: String, enum: CONTACT_METHODS, required: true },
    contactValue: { type: String, required: true, trim: true },
    message: { type: String, trim: true },
    medicalInformation: { type: String, trim: true },
    consentAccepted: { type: Boolean, required: true },
    status: {
      type: String,
      enum: APPOINTMENT_STATUSES,
      default: 'new',
      index: true,
    },
    internalNotes: { type: String, trim: true },
  },
  { timestamps: true },
);

appointmentRequestSchema.index({ createdAt: -1 });

export type AppointmentRequestDocument = InferSchemaType<typeof appointmentRequestSchema> & {
  _id: Types.ObjectId;
};

export const AppointmentRequest: Model<AppointmentRequestDocument> =
  model<AppointmentRequestDocument>('AppointmentRequest', appointmentRequestSchema);
