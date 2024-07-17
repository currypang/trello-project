import { PickType } from '@nestjs/swagger';
import { User } from '../../user/entities/user.entity';

export class SendEmailDto extends PickType(User, ['email']) {}
