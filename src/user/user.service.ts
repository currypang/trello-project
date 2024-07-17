import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import _ from 'lodash';
import { MESSAGES_CONSTANT } from 'src/constants/messages.constants';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly redisService: RedisService
  ) {}

  async findUserById(id: number) {
    const user = await this.userRepository.findOneBy({ id, deletedAt: null });

    if (_.isNil(user)) {
      throw new NotFoundException(MESSAGES_CONSTANT.USER.SERVICE.NOT_FOUND_USER);
    }

    return user;
  }

  async getNotification(userId: number) {
    const data = await this.redisService.get(`${userId}`);
    return data;
  }

  async deleteNotification(userId: number) {
    await this.redisService.set(`${userId}`, []);
    return;
  }
}
