import { PickType } from '@nestjs/swagger';
import { List } from '../entities/list.entity';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateListDto extends PickType(List, ['name', 'boardId']) {}
