import bcrypt from 'bcryptjs';
import { env } from '../config/env';
import { connectDatabase, disconnectDatabase } from '../config/db';
import { AdminUser } from '../models/AdminUser';

async function main(): Promise<void> {
  await connectDatabase(env.MONGODB_URI);

  const email = env.ADMIN_EMAIL.toLowerCase();
  const passwordHash = await bcrypt.hash(env.ADMIN_PASSWORD, 12);
  const existing = await AdminUser.findOne({ email }).select('+passwordHash');

  if (existing) {
    existing.passwordHash = passwordHash;
    existing.firstName = env.ADMIN_FIRST_NAME;
    existing.lastName = env.ADMIN_LAST_NAME;
    existing.isActive = true;
    existing.role = 'admin';
    await existing.save();
    console.log('Updated admin:', email);
  } else {
    await AdminUser.create({
      email,
      passwordHash,
      firstName: env.ADMIN_FIRST_NAME,
      lastName: env.ADMIN_LAST_NAME,
      role: 'admin',
      isActive: true,
    });
    console.log('Created admin:', email);
  }

  await disconnectDatabase();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
