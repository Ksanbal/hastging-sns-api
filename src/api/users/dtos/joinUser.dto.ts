import { PickType } from '@nestjs/swagger';
import { UserEntity } from '../entities/user.entity';

export class JoinUserDto extends PickType(UserEntity, [
  'email',
  'password',
  'nickname',
]) {}
