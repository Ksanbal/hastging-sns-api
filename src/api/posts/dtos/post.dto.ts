import { OmitType } from '@nestjs/swagger';
import { PostEntity } from '../entities/post.entity';

export class PostDto extends OmitType(PostEntity, ['deleteAt', 'author']) {
  author: string;

  didLiked: boolean;

  constructor(post: PostEntity, didLiked: boolean) {
    super();
    this.id = post.id;
    this.title = post.title;
    this.body = post.body;
    this.hastags = post.hastags;
    this.createAt = post.createAt;
    this.likes = post.likes;
    this.views = post.views;
    // 작성자
    this.author = post.author.nickname;
    this.didLiked = didLiked;
  }
}
