import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ActivityService } from './activity.service';
import { ActivityController } from './activity.controller';

import { Activity } from './entities/activity.entity';
import { Card } from '../cards/entities/card.entity';
import { BoardMembers } from '../board/entities/board-member.entity';
import { SseModule } from 'src/sse/sse.module';
import { RedisService } from 'src/redis/redis.service';
import { CardAssigness } from 'src/cards/entities/card-assigness.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Activity, Card, BoardMembers, CardAssigness]), SseModule],
  controllers: [ActivityController],
  providers: [ActivityService, RedisService],
})
export class ActivityModule {}
