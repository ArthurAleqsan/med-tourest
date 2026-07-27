import { Schema, model, Types, type Model, type InferSchemaType } from 'mongoose';
import { ADMIN_ROLES } from '@mta/shared';

const adminUserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    role: { type: String, enum: ADMIN_ROLES, default: 'admin' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export type AdminUserDocument = InferSchemaType<typeof adminUserSchema> & {
  _id: Types.ObjectId;
};

export const AdminUser: Model<AdminUserDocument> = model<AdminUserDocument>(
  'AdminUser',
  adminUserSchema,
);
