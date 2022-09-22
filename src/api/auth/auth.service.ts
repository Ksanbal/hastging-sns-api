import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from '../users/dtos/loginUser.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
  ) {}

  async jwtLogin(loginUserDto: LoginUserDto): Promise<any> {
    const { email, password } = loginUserDto;
    // [x] email로 유저 검색
    const user = await this.userRepository.findOne({ where: { email } });

    // [x] 비밀번호 검증
    if (user && (await bcrypt.compare(password, user.password))) {
      const payload = { sub: user.id };

      return {
        access_token: this.jwtService.sign(payload),
      };
    }

    throw new UnauthorizedException(['이메일과 비밀번호를 입력해주세요.']);
  }
}
