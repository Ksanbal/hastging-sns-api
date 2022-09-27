import { UserEntity } from 'src/api/users/entities/user.entity';
import {
  BaseEntity,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PostEntity } from './post.entity';

@Entity({
  name: 'post_like',
})
export class PostLikeEntity extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => PostEntity)
  @JoinColumn({ name: 'post_id', referencedColumnName: 'id' })
  post: PostEntity;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: UserEntity;
}
