import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from './config/config.module';
import { databaseConfig } from './config/database.config';
import { AuthModule } from './modules/auth/auth.module';
import { PoemsModule } from './modules/poems/poems.module';
import { UsersModule } from './modules/users/users.module';
import { SearchModule } from './modules/search/search.module';
import { AiModule } from './modules/ai/ai.module';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRoot(databaseConfig),
    AuthModule,
    PoemsModule,
    UsersModule,
    SearchModule,
    AiModule,
  ],
})
export class AppModule {}
