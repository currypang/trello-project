import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Board } from './entities/board.entity';
import { BoardMembers } from './entities/board-member.entity';
import { BoardController } from './board.controller';
import { CardAssigness } from '../cards/entities/card-assigness.entity';
import { Activity } from '../activity/entities/activity.entity'
import { InvitationModule } from 'src/invitation/invitation.module';
import { AuthModule } from 'src/auth/auth.module';
import { BoardService } from './board.service';

@Module({
  imports: [TypeOrmModule.forFeature([Board, BoardMembers, CardAssigness, Activity]),InvitationModule,AuthModule],
  controllers: [BoardController],
  providers: [BoardService],
  exports: [],
})
export class BoardModule {}
