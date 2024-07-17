import { PickType } from '@nestjs/swagger';
import { Card } from '../entities/card.entity';

export class UpdateCardDto extends PickType(Card, ['name', 'description', 'color', 'startDate', 'dueDate']) {}
