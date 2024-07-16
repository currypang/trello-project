import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import _ from 'lodash';
import { MESSAGES_CONSTANT } from 'src/constants/messages.constants';
import { SseService } from 'src/sse/sse.service';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly sseService: SseService,
    private readonly redisService: RedisService
  ) {}

  async findUserById(id: number) {
    const user = await this.userRepository.findOneBy({ id, deletedAt: null });

    if (_.isNil(user)) {
      throw new NotFoundException(MESSAGES_CONSTANT.USER.SERVICE.NOT_FOUND_USER);
    }

    return user;
  }
  // 알림 테스트
  async createComment(user) {
    const key = '1';
    const existedData = await this.redisService.get(key);
    const data = _.isNil(existedData) ? [] : existedData;

    data.push(user);
    await this.redisService.set(key, data);
    this.sseService.emitCardChangeEvent(user.id, user.data);
  }
  async getComment() {
    const data = await this.redisService.get('1');

    return data;
  }
}
