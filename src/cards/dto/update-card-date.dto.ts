import { PickType } from '@nestjs/swagger';
import { Card } from '../entities/card.entity';

export class UpdateCardDateDto extends PickType(Card, ['startDate', 'dueDate']) {}
