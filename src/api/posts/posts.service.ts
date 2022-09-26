import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

  /**
   * @description 게시물 수정, 작성자만 수정 가능
   */
  async edit(user: UserEntity, id: number, createPostDto: CreatePostDto) {
    // postId로 post(join user) 가져오기
    const post = await this.postsRepository.findOne({
      where: { id },
      relations: ['author'],
    });
    if (!post) throw new NotFoundException();

    // user 권한 체크
    if (post.author.id !== user.id) {
      throw new ForbiddenException();
    }

    // 정보 업데이트
    await this.postsRepository.update({ id }, createPostDto);
  }

  /**
   * @description 게시물 삭제, 작성자만 삭제 가능
   */
  async softDelete(user: UserEntity, id: number) {
    // id로 post(join user) 가져오기
    const post = await this.postsRepository.findOne({
      where: { id },
      relations: ['author'],
    });
    if (!post) throw new NotFoundException();

    // user 권한 체크
    if (post.author.id !== user.id) {
      throw new ForbiddenException();
    }

    // soft delte
    await post.softRemove();
  }
}
