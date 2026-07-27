import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/tests/**/*.test.ts'],
    fileParallelism: false,
    hookTimeout: 30000,
    testTimeout: 30000,
    env: {
      NODE_ENV: 'test',
      MONGODB_URI:
        'mongodb://aleqsanyanarthur%40gmail.com:medtourest123@localhost:27017/mta-test?authSource=admin',
      JWT_SECRET: 'test-secret-value-at-least-16-chars',
      JWT_EXPIRES_IN: '1d',
      CLIENT_URL: 'http://localhost:3000',
      ADMIN_EMAIL: 'admin@test.com',
      ADMIN_PASSWORD: 'test-password-123',
      BUSINESS_TIMEZONE: 'Asia/Yerevan',
    },
  },
});
