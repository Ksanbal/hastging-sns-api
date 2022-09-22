import { Body, Controller, Post } from '@nestjs/common';
import { JoinUserDto } from './dtos/joinUser.dto';
import { UsersService } from './users.service';

@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('join')
  join(@Body() joinUserDto: JoinUserDto) {
    return this.usersService.join(joinUserDto);
  }
}
