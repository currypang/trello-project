import { Injectable } from '@nestjs/common';
import { CreateCardAssignessDto } from './dto/create-card-assigness.dto';
import { UpdateCardAssignessDto } from './dto/update-card-assigness.dto';

@Injectable()
export class CardAssignessService {
  create(createCardAssignessDto: CreateCardAssignessDto) {
    return 'This action adds a new cardAssigness';
  }

  findAll() {
    return `This action returns all cardAssigness`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cardAssigness`;
  }

  update(id: number, updateCardAssignessDto: UpdateCardAssignessDto) {
    return `This action updates a #${id} cardAssigness`;
  }

  remove(id: number) {
    return `This action removes a #${id} cardAssigness`;
  }
}
