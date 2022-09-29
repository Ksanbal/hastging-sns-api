import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { JoinUserDto } from './dtos/joinUser.dto';
import { LoginUserDto } from './dtos/loginUser.dto';
import { UsersService } from './users.service';

@Controller('api/users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post('join')
  join(@Body() joinUserDto: JoinUserDto) {
    return this.usersService.join(joinUserDto);
  }

  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.jwtLogin(loginUserDto);
  }
}
