import { PartialType } from '@nestjs/mapped-types';
import { CreateCardAssignessDto } from './create-card-assigness.dto';

export class UpdateCardAssignessDto extends PartialType(CreateCardAssignessDto) {}
