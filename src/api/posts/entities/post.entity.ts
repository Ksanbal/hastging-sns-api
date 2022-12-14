import { IsNotEmpty, MaxLength } from 'class-validator';
import { UserEntity } from 'src/api/users/entities/user.entity';
import { CommonEntity } from 'src/common/entities/common-entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity({
  name: 'post',
})
export class PostEntity extends CommonEntity {
  @Column({
    length: 50,
  })
  @MaxLength(50)
  title: string;

  @Column({
    type: 'text',
  })
  @IsNotEmpty()
  body: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  hastags: string;

  @Column({
    type: 'unsigned big int',
    default: 0,
  })
  likes: number;

  @Column({
    type: 'unsigned big int',
    default: 0,
  })
  views: number;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({
    name: 'user_id',
    referencedColumnName: 'id',
  })
  author: UserEntity;
}
