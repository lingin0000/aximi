import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { PoemsService } from './poems.service';
import { PoemQueryDto, PoemSearchDto } from './dto/poem-query.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Public } from '../../common/decorators/public.decorator';

@Controller('poems')
export class PoemsController {
  constructor(private readonly poemsService: PoemsService) {}

  @Public()
  @Get()
  findAll(@Query() query: PoemQueryDto) {
    return this.poemsService.findAll(query);
  }

  @Public()
  @Get('daily')
  getDaily() {
    return this.poemsService.getDaily();
  }

  @Public()
  @Get('popular')
  getPopular(@Query('count') count?: number) {
    return this.poemsService.getPopular(count || 8);
  }

  @Public()
  @Get('search')
  search(@Query() query: PoemSearchDto) {
    return this.poemsService.search(query.q, query.page, query.pageSize);
  }

  @Public()
  @Get('authors')
  getAuthors() {
    return this.poemsService.getAuthors();
  }

  @Public()
  @Get('dynasties')
  getDynasties() {
    return this.poemsService.getDynasties();
  }

  @Public()
  @Get('themes')
  getThemes() {
    return this.poemsService.getThemes();
  }

  @Public()
  @Get('forms')
  getForms() {
    return this.poemsService.getForms();
  }

  @Public()
  @Get(':id')
  findById(@Param('id') id: number) {
    return this.poemsService.findById(id);
  }

  @Public()
  @Get(':id/related')
  getRelated(@Param('id') id: number) {
    return this.poemsService.getRelated(id);
  }
}
