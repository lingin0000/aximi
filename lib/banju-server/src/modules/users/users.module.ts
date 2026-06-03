import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { Favorite } from './entities/favorite.entity';
import { Memorized } from './entities/memorized.entity';
import { Collection } from './entities/collection.entity';
import { CollectionPoem } from './entities/collection-poem.entity';
import { Poem } from '../poems/entities/poem.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Favorite,
      Memorized,
      Collection,
      CollectionPoem,
      Poem,
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
