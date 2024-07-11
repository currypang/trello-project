import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Board } from './entities/board.entity';
import { BoardMembers } from './entities/board-member.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Board, BoardMembers])],
  controllers: [],
  providers: [],
  exports: [],
})
export class BoardModule {}
