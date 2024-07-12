import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { SignUpDto } from './dtos/sign-up.dto';
import * as bcrypt from 'bcrypt';
import _ from 'lodash';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}
  async signUp({ email, password, confirmPassword, username }: SignUpDto) {
    const isMatched = password === confirmPassword;
    if (!isMatched) {
      throw new BadRequestException('비밀번호가 일치 하지않습니다.');
    }

    const existUser = await this.userRepository.findOneBy({ email });
    if (!_.isNil(existUser)) {
      throw new BadRequestException('이미 가입 된 이메일 입니다.');
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      username,
    });
    await this.userRepository.save(user);
    return { email: user.email };
  }
}
