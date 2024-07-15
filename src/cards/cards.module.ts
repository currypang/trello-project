import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CardsService } from './cards.service';
import { ActivityService } from 'src/activity/activity.service'
import { CardsController } from './cards.controller';

import { Card } from './entities/card.entity';
import { CardAssigness } from './entities/card-assigness.entity';
import { BoardMembers } from '../board/entities/board-member.entity'
import { List } from '../lists/entities/list.entity';
import { Activity } from 'src/activity/entities/activity.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Card, CardAssigness, BoardMembers, List, Activity])],
  controllers: [CardsController],
  providers: [CardsService, ActivityService],
})
export class CardsModule {}
