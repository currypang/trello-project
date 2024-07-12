import { PickType } from '@nestjs/swagger';
import { User } from '../entities/user.entity';

export class DeleteUserDto extends PickType(User, ['password']) {}
