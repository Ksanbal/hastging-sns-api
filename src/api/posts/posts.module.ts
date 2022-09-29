import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { PostEntity } from './entities/post.entity';
import { PostLikeEntity } from './entities/postLike.entity';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';

@Module({
  imports: [TypeOrmModule.forFeature([PostEntity, PostLikeEntity]), AuthModule],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
