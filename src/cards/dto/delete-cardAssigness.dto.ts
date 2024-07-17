import { PartialType } from '@nestjs/swagger';
import { CreateCardAssignessDto } from './create-cardAssigness.dto';

export class DeleteCardAssignessDto extends PartialType(CreateCardAssignessDto) {}
