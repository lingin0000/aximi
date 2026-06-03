import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const jwtConfig = {
  secret: process.env.JWT_SECRET || 'banju-jwt-secret',
  expiresIn: process.env.JWT_EXPIRES_IN || '7d',
};
