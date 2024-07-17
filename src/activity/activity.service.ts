import _ from 'lodash';
import { DeepPartial, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';

import { Activity } from './entities/activity.entity';
import { Card } from 'src/cards/entities/card.entity';
import { SseService } from 'src/sse/sse.service';
import { RedisService } from 'src/redis/redis.service';
import { BoardMembers } from 'src/board/entities/board-member.entity';

@Injectable()
export class ActivityService {
  constructor(
    @InjectRepository(Card) private cardRepository: Repository<Card>,
    @InjectRepository(Activity) private activityRepository: Repository<Activity>,
    private readonly sseService: SseService,
    private readonly redisService: RedisService
  ) {}

  async create(createActivityDto: CreateActivityDto, userId: number, cardId: number) {
    
    const validateMember = await this.activityRepository.find({
        where:{userId, cardId}
    })
    const checkCardId = validateMember.some((member) => member.cardId )
    if(!checkCardId){
      throw new NotFoundException('댓글작성할 권한이 없습니다.')
    }
    const { content } = createActivityDto;
    const data = await this.activityRepository.save({
      userId,
      cardId,
      content,
      isLog: false,
    });
    const key = `${userId}`;
    const existedData = await this.redisService.get(key);
    const currentData = _.isNil(existedData) ? [] : existedData;

    currentData.push(data);
    await this.redisService.set(key, currentData);

    this.sseService.emitCardChangeEvent(userId, { message: 'new activity' });
    return data;
  }

  async findAll(cardId: number) {
    const existCard = this.cardRepository.findOneBy({ id: cardId });
    if (_.isNil(existCard)) {
      throw new NotFoundException('존재하지 않는 카드입니다.');
    }

    const activitys = await this.activityRepository.find({
      where: { cardId, deletedAt: null },
    });

    return activitys;
  }

  async findOne(id: number) {
    const activity = await this.activityRepository.findOneBy({ id });
    if (_.isNil(activity)) {
      throw new NotFoundException('존재하지 않는 activity입니다.');
    }
    return activity;
  }

  async update(id: number, updateActivityDto: UpdateActivityDto, userId: number) {
    const activity = await this.activityRepository.findOneBy({ id });
    if (_.isNil(activity)) {
      throw new NotFoundException('존재하지 않는 activity입니다.');
    }
    if (activity.userId !== userId) {
      throw new BadRequestException('수정 권한이 없습니다.');
    }

    return await this.activityRepository.update({ id }, updateActivityDto);
  }

  async remove(id: number, userId: number) {
    const activity = await this.activityRepository.findOneBy({ id });
    if (_.isNil(activity)) {
      throw new NotFoundException('존재하지 않는 activity입니다.');
    }
    if (activity.userId !== userId) {
      throw new BadRequestException('삭제 권한이 없습니다.');
    }
    return this.activityRepository.delete({ id });
  }

  // 카드 로그 생성
  async createLog(userId: number, cardId: number, content: string) {
    return await this.activityRepository.save({
      userId,
      cardId,
      content,
      isLog: true,
    });
  }
}
