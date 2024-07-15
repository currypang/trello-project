import { PickType } from "@nestjs/swagger";
import { CardAssigness } from '../entities/card-assigness.entity'

export class CreateCardAssignessDto extends PickType(CardAssigness,
    ['userId', 'cardId']
){}