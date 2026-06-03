import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from './entities/user.entity';

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('favorites/:poemId')
  toggleFavorite(
    @CurrentUser() user: User,
    @Param('poemId') poemId: number,
  ) {
    return this.usersService.toggleFavorite(user.id, poemId);
  }

  @Get('favorites')
  getFavorites(@CurrentUser() user: User) {
    return this.usersService.getFavorites(user.id);
  }

  @Post('memorized/:poemId')
  toggleMemorized(
    @CurrentUser() user: User,
    @Param('poemId') poemId: number,
  ) {
    return this.usersService.toggleMemorized(user.id, poemId);
  }

  @Get('memorized')
  getMemorized(@CurrentUser() user: User) {
    return this.usersService.getMemorized(user.id);
  }

  @Get('collections')
  getCollections(@CurrentUser() user: User) {
    return this.usersService.getCollections(user.id);
  }

  @Post('collections')
  createCollection(
    @CurrentUser() user: User,
    @Body('name') name: string,
  ) {
    return this.usersService.createCollection(user.id, name);
  }

  @Delete('collections/:id')
  deleteCollection(
    @CurrentUser() user: User,
    @Param('id') id: string,
  ) {
    return this.usersService.deleteCollection(user.id, id);
  }

  @Post('collections/:id/poems')
  addToCollection(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body('poemId') poemId: number,
  ) {
    return this.usersService.addToCollection(user.id, id, poemId);
  }

  @Delete('collections/:collectionId/poems/:poemId')
  removeFromCollection(
    @CurrentUser() user: User,
    @Param('collectionId') collectionId: string,
    @Param('poemId') poemId: number,
  ) {
    return this.usersService.removeFromCollection(user.id, collectionId, poemId);
  }
}
