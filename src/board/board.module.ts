import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Board } from './entities/board.entity';
import { BoardMembers } from './entities/board-member.entity';
import { BoardController } from './board.controller';
import { BoardService } from './board.service';

@Module({
  imports: [TypeOrmModule.forFeature([Board, BoardMembers])],
  controllers: [BoardController],
  providers: [BoardService],
  exports: [],
})
export class BoardModule {}
