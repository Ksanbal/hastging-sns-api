import { PickType } from '@nestjs/swagger';
import { UserEntity } from '../entities/user.entity';

export class LoginUserDto extends PickType(UserEntity, ['email', 'password']) {}
