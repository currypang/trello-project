import { PartialType } from '@nestjs/mapped-types';
import { CreateCardAssignessDto } from './create-cardAssigness.dto';

export class DeleteCardAssignessDto extends PartialType(CreateCardAssignessDto) {}
