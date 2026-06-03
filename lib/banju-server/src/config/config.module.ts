import { Module, Global } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as path from 'path';

@Global()
@Module({})
export class ConfigModule {
  constructor() {
    const envFile = process.env.NODE_ENV === 'production' ? '.env' : '.env';
    dotenv.config({ path: path.resolve(__dirname, '..', envFile) });
  }

  static get(key: string, defaultValue?: string): string {
    return process.env[key] || defaultValue || '';
  }
}
