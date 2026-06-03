import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PoemsController } from './poems.controller';
import { PoemsService } from './poems.service';
import { Poem } from './entities/poem.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Poem])],
  controllers: [PoemsController],
  providers: [PoemsService],
  exports: [PoemsService],
})
export class PoemsModule {}
