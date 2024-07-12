import { Module } from '@nestjs/common';
import { ListsService } from './lists.service';
import { ListsController } from './lists.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { List } from './entities/list.entity';
import { Card } from '../cards/entities/card.entity'

@Module({
  imports: [TypeOrmModule.forFeature([List, Card])],
  controllers: [ListsController],
  providers: [ListsService],
})
export class ListsModule {}
