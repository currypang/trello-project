import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CardAssignessService } from './card-assigness.service';
import { CreateCardAssignessDto } from './dto/create-card-assigness.dto';
import { UpdateCardAssignessDto } from './dto/update-card-assigness.dto';

@Controller('card-assigness')
export class CardAssignessController {
  constructor(private readonly cardAssignessService: CardAssignessService) {}

  @Post()
  create(@Body() createCardAssignessDto: CreateCardAssignessDto) {
    return this.cardAssignessService.create(createCardAssignessDto);
  }

  @Get()
  findAll() {
    return this.cardAssignessService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cardAssignessService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCardAssignessDto: UpdateCardAssignessDto) {
    return this.cardAssignessService.update(+id, updateCardAssignessDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cardAssignessService.remove(+id);
  }
}
