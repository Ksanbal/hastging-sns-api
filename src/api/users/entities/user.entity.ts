import { IsEmail, MaxLength } from 'class-validator';
import { CommonEntity } from 'src/common/entities/common-entity';
import { Column, Entity } from 'typeorm';

@Entity({
  name: 'user',
})
export class UserEntity extends CommonEntity {
  @Column()
  @IsEmail()
  email: string;

  @Column()
  password: string;

  @Column({
    length: 50,
  })
  @MaxLength(50)
  nickname: string;
}
