import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CardAssignessService } from './card-assigness.service';
import { CardAssignessController } from './card-assigness.controller';

import { CardAssigness } from './entities/card-assigness.entity'

@Module({
  imports: [TypeOrmModule.forFeature([CardAssigness])],
  controllers: [CardAssignessController],
  providers: [CardAssignessService],
})
export class CardAssignessModule {}
