import { Module } from '@nestjs/common';
import { ListsService } from './lists.service';
import { ListsController } from './lists.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { List } from './entities/list.entity';
import { Card } from '../cards/entities/card.entity';
import { Board } from 'src/board/entities/board.entity';
import { BoardMembers } from 'src/board/entities/board-member.entity';

@Module({
  imports: [TypeOrmModule.forFeature([List, Card, Board, BoardMembers])],
  controllers: [ListsController],
  providers: [ListsService],
})
export class ListsModule {}
