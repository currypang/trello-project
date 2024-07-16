import { PickType } from '@nestjs/swagger';
import { Card } from '../entities/card.entity';

export class UpdateCardOrderDto extends PickType(Card, ['position']) {}
