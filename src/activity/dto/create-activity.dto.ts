import { PickType } from "@nestjs/swagger";
import { Activity } from '../entities/activity.entity'

export class CreateActivityDto extends PickType(Activity,
    ['userId', 'cardId', 'content', 'isLog']
){}
