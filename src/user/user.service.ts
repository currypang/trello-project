import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import _ from 'lodash';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async findUserById(id: number) {
    const user = await this.userRepository.findOneBy({ id });

    if (_.isNil(user)) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }
    delete user.deletedAt;
    return user;
  }
}
