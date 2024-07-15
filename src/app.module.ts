import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { configModuleValidationSchema } from './configs/env-validation.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmModuleOptions } from './configs/database.config';
import { CardsModule } from './cards/cards.module';
import { ListsModule } from './lists/lists.module';
import { UserModule } from './user/user.module';
import { BoardModule } from './board/board.module';
import { ActivityModule } from './activity/activity.module';
import { AuthModule } from './auth/auth.module';
import { EmailModule } from './email/email.module';
import { InvitationModule } from './invitation/invitation.module';
import { SseModule } from './sse/sse.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: configModuleValidationSchema,
    }),
    TypeOrmModule.forRootAsync(typeOrmModuleOptions),
    CardsModule,
    ListsModule,
    UserModule,
    BoardModule,
    ActivityModule,
    AuthModule,
    EmailModule,
    InvitationModule,
    SseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
