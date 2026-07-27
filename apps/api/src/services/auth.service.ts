import bcrypt from 'bcryptjs';
import type { AdminLoginInput, AdminLoginResult, AdminUserDto } from '@mta/shared';
import { AdminUser } from '../models/AdminUser';
import { ApiError } from '../utils/ApiError';
import { signAdminToken } from '../middleware/auth';
import { toAdminUserDto } from '../utils/mappers';

export async function loginAdmin(input: AdminLoginInput): Promise<AdminLoginResult> {
  const user = await AdminUser.findOne({ email: input.email }).select('+passwordHash');
  if (!user || !user.isActive) {
    throw ApiError.unauthorized('Invalid email or password.');
  }
  const matches = await bcrypt.compare(input.password, user.passwordHash);
  if (!matches) {
    throw ApiError.unauthorized('Invalid email or password.');
  }
  const token = signAdminToken({ sub: String(user._id), email: user.email, role: user.role });
  return { token, user: toAdminUserDto(user.toObject()) };
}

export async function getAdminById(id: string): Promise<AdminUserDto> {
  const user = await AdminUser.findById(id).lean();
  if (!user || !user.isActive) throw ApiError.unauthorized('Account is no longer active.');
  return toAdminUserDto(user);
}
