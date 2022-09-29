import { OmitType } from '@nestjs/swagger';
import { PostEntity } from '../entities/post.entity';

export class ListPostDto extends OmitType(PostEntity, [
  'body',
  'deleteAt',
  'author',
]) {
  constructor(post: PostEntity) {
    super();
    this.id = post.id;
    this.title = post.title;
    this.hastags = post.hastags;
    this.createAt = post.createAt;
    this.likes = post.likes;
    this.views = post.views;
  }
}
