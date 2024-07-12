import { Module } from '@nestjs/common';
import { InvitationService } from './invitation.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardMembers } from 'src/board/entities/board-member.entity';
import { Board } from 'src/board/entities/board.entity';
import { JwtModule } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports:[TypeOrmModule.forFeature([BoardMembers,Board,User]),JwtModule, AuthModule],
  providers: [InvitationService],
  exports: [InvitationService]
})
export class InvitationModule {}
