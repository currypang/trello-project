import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ActivityService } from './activity.service';
import { ActivityController } from './activity.controller';

import { Activity } from './entities/activity.entity';
import { Card } from '../cards/entities/card.entity'
import { BoardMembers } from '../board/entities/board-member.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Activity, Card, BoardMembers])],
  controllers: [ActivityController],
  providers: [ActivityService],
})
export class ActivityModule {}
