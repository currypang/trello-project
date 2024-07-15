import { PickType } from '@nestjs/swagger';
import { List } from '../entities/list.entity';

export class UpdateListDto extends PickType(List, ['name']) {}
