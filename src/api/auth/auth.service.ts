import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from '../users/dtos/loginUser.dto';
import { Request } from 'express';

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

  /**
   * @description req로 현재 유저 id get
   * @param req
   * @returns token이 있으면 userId, 없으면 null
   */
  getCurrentUser(req: Request): number | null {
    // header에서 authorization 구하기
    const authorization = req.header('authorization');

    // authorization가 없으면
    if (!authorization) {
      return null;
    }

    // 있으면 token의 sub 구하기
    const token = authorization.split(' ')[1];
    const decodedToken = this.jwtService.decode(token);
    return decodedToken.sub;
  }
}
