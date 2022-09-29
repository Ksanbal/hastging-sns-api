import { PickType } from '@nestjs/swagger';
import { PostEntity } from '../entities/post.entity';

export class CreatePostDto extends PickType(PostEntity, [
  'title',
  'body',
  'hastags',
]) {}
