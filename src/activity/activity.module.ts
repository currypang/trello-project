import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ActivityService } from './activity.service';
import { ActivityController } from './activity.controller';

import { Activity } from './entities/activity.entity';
import { Card } from '../cards/entities/card.entity';
import { BoardMembers } from '../board/entities/board-member.entity';
import { SseModule } from 'src/sse/sse.module';

@Module({
  imports: [TypeOrmModule.forFeature([Activity, Card, BoardMembers]), SseModule],
  controllers: [ActivityController],
  providers: [ActivityService],
})
export class ActivityModule {}
