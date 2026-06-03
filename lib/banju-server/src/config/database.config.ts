import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../modules/users/entities/user.entity';
import { Poem } from '../modules/poems/entities/poem.entity';
import { Favorite } from '../modules/users/entities/favorite.entity';
import { Memorized } from '../modules/users/entities/memorized.entity';
import { Collection } from '../modules/users/entities/collection.entity';
import { CollectionPoem } from '../modules/users/entities/collection-poem.entity';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'banju',
  password: process.env.DB_PASSWORD || 'banju_secret',
  database: process.env.DB_DATABASE || 'banju',
  entities: [User, Poem, Favorite, Memorized, Collection, CollectionPoem],
  synchronize: process.env.NODE_ENV === 'development',
  logging: process.env.NODE_ENV === 'development',
};
