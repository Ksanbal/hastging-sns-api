import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JoinUserDto } from './dtos/joinUser.dto';
import { UserEntity } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  /**
   * 회원가입
   * @description 비밀번호 암호화를 적용한 유저 생성
   */
  async join(joinUserDto: JoinUserDto) {
    const { email, password } = joinUserDto;

    // [x] email 중복 체크
    const user = await this.usersRepository.findOne({ where: { email } });
    if (user) throw new BadRequestException(['이미 가입된 email입니다.']);

    // [x] user 생성
    const newUser = this.usersRepository.create(joinUserDto);

    // [x] 비밀번호 암호화
    const salt = await bcrypt.genSalt();
    newUser.password = await bcrypt.hash(password, salt);

    await newUser.save();
  }
}
