import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../users/entities/user.entity';
import { CreatePostDto } from './dtos/createPost.dto';
import { PostEntity } from './entities/post.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postsRepository: Repository<PostEntity>,
  ) {}

  /**
   * @description 게시물 생성
   */
  async create(user: UserEntity, createPostDto: CreatePostDto) {
    // post 생성
    const newPost = this.postsRepository.create(createPostDto);
    // 작성자 정보 추가
    newPost.author = user;
    await newPost.save();
  }
}
