import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AuthModule } from 'src/auth/auth.module';
import { EmailModule } from 'src/email/email.module';
import { SseModule } from 'src/sse/sse.module';
import { RedisService } from 'src/redis/redis.service';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([User]), EmailModule, SseModule],
  controllers: [UserController],
  providers: [UserService, RedisService],
})
export class UserModule {}
