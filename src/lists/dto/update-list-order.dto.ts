import { PickType } from '@nestjs/swagger';
import { List } from '../entities/list.entity';

export class UpdateListOrderDto extends PickType(List, ['position']) {}
