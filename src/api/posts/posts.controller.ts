import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/user.decorator';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';
import { UserEntity } from '../users/entities/user.entity';
import { CreatePostDto } from './dtos/createPost.dto';
import { PostsService } from './posts.service';

@Controller('api/posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @CurrentUser() user: UserEntity,
    @Body() createPostDto: CreatePostDto,
  ) {
    return this.postsService.create(user, createPostDto);
  }

  @Get(':id')
  retrieve(@Param('id') id: number) {
    return this.postsService.retrieve(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  edit(
    @CurrentUser() user: UserEntity,
    @Param('id') id: number,
    @Body() createPostDto: CreatePostDto,
  ) {
    return this.postsService.edit(user, id, createPostDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  softDelete(@CurrentUser() user: UserEntity, @Param('id') id: number) {
    return this.postsService.softDelete(user, id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/restore')
  restore(@CurrentUser() user: UserEntity, @Param('id') id: number) {
    return this.postsService.restore(user, id);
  }
}
