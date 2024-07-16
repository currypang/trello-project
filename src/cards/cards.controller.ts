import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards } from '@nestjs/common';
import { CardsService } from './cards.service';
import { ActivityService } from 'src/activity/activity.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { CreateCardAssignessDto } from './dto/create-cardAssigness.dto';
import { DeleteCardAssignessDto } from './dto/delete-cardAssigness.dto';

@Controller('cards')
export class CardsController {
  constructor(
    private readonly cardsService: CardsService,
    private readonly activityService: ActivityService
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createCardDto: CreateCardDto, @Request() req) {
    const createCard = await this.cardsService.create(createCardDto, req.user.id);
    const log = this.activityService.createLog(req.user.id, createCard.id, 'CreateCard');
    return [createCard, log];
  }

  @Get()
  findAll() {
    return this.cardsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cardsService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCardDto: UpdateCardDto, @Request() req) {
    const update = this.cardsService.update(+id, req.user.id, updateCardDto);
    const log = this.activityService.createLog(req.user.id, +id, 'updateCard');
    return [update, log];
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.cardsService.delete(+id);
  }

  // 카드 멤버 추가
  @UseGuards(JwtAuthGuard)
  @Post(':id/members')
  createMembers(@Param('id') id: string, @Body() createCardAssignessDto: CreateCardAssignessDto, @Request() req){
    const createMembers = this.cardsService.createMembers(createCardAssignessDto.userId, +id);
    const log = this.activityService.createLog(req.user.id, +id, 'createCardMembers');

    return [createMembers, log];
  }

  // 카드 멤버 삭제
  @UseGuards(JwtAuthGuard)
  @Delete(':id/members')
  deleteMembers(@Param('id') id: string, @Body() deleteCardAssignessDto: DeleteCardAssignessDto, @Request() req){
    const deleteMembers = this.cardsService.deleteMembers(deleteCardAssignessDto.userId, +id);
    const log = this.activityService.createLog(req.user.id, +id, 'deleteCardMembers');

    return [deleteMembers, log];
  }

  // 카드 일정 수정 및 추가
  @UseGuards(JwtAuthGuard)
  @Patch(':id/Date')
  updateCardDate(@Param('id') id: string, @Body() updateCardDto: UpdateCardDto, @Request() req) {
    const updateCardDate = this.cardsService.updateCardDate(+id, updateCardDto);
    const log = this.activityService.createLog(req.user.id, +id, 'updateCardDate');
    return [updateCardDate, log];
  }

  // 카드 일정 마감
  @UseGuards(JwtAuthGuard)
  @Patch(':id/DateExpired')
  updateDateExpire(@Param('id') id: string, @Request() req) {
    const updateDateExpire = this.cardsService.updateDateExpire(+id);
    const log = this.activityService.createLog(req.user.id, +id, 'updateDateExpired');
    return [updateDateExpire, log];
  }
}
