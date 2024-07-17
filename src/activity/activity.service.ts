import _ from 'lodash';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';

import { Activity } from './entities/activity.entity';
import { Card } from 'src/cards/entities/card.entity';
import { SseService } from 'src/sse/sse.service';
import { RedisService } from 'src/redis/redis.service';

import { MESSAGES_CONSTANT } from 'src/constants/messages.constants';
import { CardAssigness } from 'src/cards/entities/card-assigness.entity';


@Injectable()
export class ActivityService {
  constructor(
    @InjectRepository(Card) private cardRepository: Repository<Card>,
    @InjectRepository(Activity) private activityRepository: Repository<Activity>,
    @InjectRepository(CardAssigness) private cardAssignessRepository: Repository<CardAssigness>,
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
    const CardAssignees = await this.cardAssignessRepository.find({ where: { cardId }, select: { userId: true } });
    for (let i = 0; i < CardAssignees.length; i++) {
      const assigneeId = CardAssignees[i].userId;
      const key = `${assigneeId}`;
      const existedData = await this.redisService.get(key);
      const currentData = _.isNil(existedData) ? [] : existedData;

      currentData.push(data);
      await this.redisService.set(key, currentData);
      this.sseService.emitCardChangeEvent(assigneeId, {
        message: MESSAGES_CONSTANT.ACTIVITY.CREATE_ACTIVITY.SSE_NEW_ACTIVITY,
      });
    }
    return data;
  }

  async findAll(cardId: number) {
    const existCard = this.cardRepository.findOneBy({ id: cardId });
    if (_.isNil(existCard)) {
      throw new NotFoundException(MESSAGES_CONSTANT.ACTIVITY.READ_ACTIVITY.NOT_FOUND);
    }

    const activitys = await this.activityRepository.find({
      where: { cardId, deletedAt: null },
    });

    return activitys;
  }

  async findOne(id: number) {
    const activity = await this.activityRepository.findOneBy({ id });
    if (_.isNil(activity)) {
      throw new NotFoundException(MESSAGES_CONSTANT.ACTIVITY.READ_ACTIVITY.NOT_FOUND_DETAIL);
    }
    return activity;
  }

  async update(id: number, updateActivityDto: UpdateActivityDto, userId: number) {
    const activity = await this.activityRepository.findOneBy({ id });
    if (_.isNil(activity)) {
      throw new NotFoundException(MESSAGES_CONSTANT.ACTIVITY.UPDATE_ACTIVITY.NOT_FOUND);
    }
    if (activity.userId !== userId) {
      throw new BadRequestException(MESSAGES_CONSTANT.ACTIVITY.UPDATE_ACTIVITY.BAD_REQUEST);
    }

    return await this.activityRepository.update({ id }, updateActivityDto);
  }

  async remove(id: number, userId: number) {
    const activity = await this.activityRepository.findOneBy({ id });
    if (_.isNil(activity)) {
      throw new NotFoundException(MESSAGES_CONSTANT.ACTIVITY.DELETE_ACTIVITY.NOT_FOUND);
    }
    if (activity.userId !== userId) {
      throw new BadRequestException(MESSAGES_CONSTANT.ACTIVITY.DELETE_ACTIVITY.BAD_REQUEST);
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
