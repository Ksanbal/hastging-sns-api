import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { Repository } from 'typeorm';
import { AuthService } from '../auth/auth.service';
import { UserEntity } from '../users/entities/user.entity';
import { CreatePostDto } from './dtos/createPost.dto';
import { PostDto } from './dtos/post.dto';
import { PostEntity } from './entities/post.entity';
import { PostLikeEntity } from './entities/postLike.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postsRepository: Repository<PostEntity>,
    @InjectRepository(PostLikeEntity)
    private readonly postlikeRepository: Repository<PostLikeEntity>,
    private readonly authService: AuthService,
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
   * @description 게시물 상세정보, 조회시마다 view(조회수) 증가
   */
  async retrieve(req: Request, id: number) {
    // id로 post(join user) 가져오기
    const post = await this.postsRepository.findOne({
      where: { id },
      relations: ['author'],
    });
    if (!post) throw new NotFoundException();

    // 조회수 증가
    post.views += 1;
    await post.save();

    // 좋아요를 누른 적 있는지 검색
    let didLiked = false;

    // jwt로 로그인 가져오기
    const userId = this.authService.getCurrentUser(req);

    // 로그인된 유저인 경우
    if (userId) {
      const postLike = await this.postlikeRepository.findOne({
        where: {
          post: { id },
          user: { id: userId },
        },
      });
      didLiked = postLike !== null;
    }

    return new PostDto(post, didLiked);
  }

  /**
   * @description 게시물 좋아요, 있으면 삭제 없으면 생성
   */
  async like(user: UserEntity, id: number) {
    const post = await this.postsRepository.findOne({ where: { id } });
    if (!post) throw new NotFoundException();

    // id, user.id로 좋아요 기록이 있는지 확인
    const postLike = await this.postlikeRepository.findOne({
      where: {
        post: { id },
        user: { id: user.id },
      },
    });

    if (postLike) {
      // 있다면 삭제, like - 1
      await postLike.remove();
      post.likes -= 1;
      await post.save();
    } else {
      // 없다면 생성, like + 1
      await this.postlikeRepository.create({ post, user }).save();
      post.likes += 1;
      await post.save();
    }
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

  /**
   * @description 게시물 복구, 작성자만 복구 가능
   */
  async restore(user: UserEntity, id: number) {
    // id로 post(join user) 가져오기
    const post = await this.postsRepository.findOne({
      where: { id },
      relations: ['author'],
      withDeleted: true, // 삭제된 row 포함 옵션
    });
    if (!post) throw new NotFoundException();

    // user 권한 체크
    if (post.author.id !== user.id) {
      throw new ForbiddenException();
    }

    // 복구
    await post.recover(); // post.deleteAt = null; post.save()와 같음
  }
}
