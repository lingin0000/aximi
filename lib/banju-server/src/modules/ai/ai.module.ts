import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { RagService } from './rag/rag.service';
import { TtsService } from './tts/tts.service';
import { LectureService } from './lecture/lecture.service';
import { VideoService } from './video/video.service';
import { Poem } from '../poems/entities/poem.entity';
import { PoemsModule } from '../poems/poems.module';

@Module({
  imports: [TypeOrmModule.forFeature([Poem]), PoemsModule],
  controllers: [AiController],
  providers: [AiService, RagService, TtsService, LectureService, VideoService],
  exports: [AiService],
})
export class AiModule {}
