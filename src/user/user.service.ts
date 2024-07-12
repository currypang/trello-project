import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import _ from 'lodash';
import { MESSAGES_CONSTANT } from 'src/constants/messages.constants';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async findUserById(id: number) {
    const user = await this.userRepository.findOneBy({ id });

    if (_.isNil(user)) {
      throw new NotFoundException(MESSAGES_CONSTANT.USER.SERVICE.NOT_FOUND_USER);
    }

    return user;
  }
}
