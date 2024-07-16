import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards, HttpStatus } from '@nestjs/common';
import { CardsService } from './cards.service';
import { ActivityService } from 'src/activity/activity.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { MESSAGES_CONSTANT } from 'src/constants/messages.constants';

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
    const log = await this.activityService.createLog(req.user.id, createCard.id, 'CreateCard');
    return{
      statusCode:HttpStatus.CREATED,
      message:MESSAGES_CONSTANT.CARD.CREATE_CARD.SUCCEED,
      createCard,
      log
    }   
  }

  @Get()
  async findAll() {
    const cards = await this.cardsService.findAll();
    return{
      statusCode:HttpStatus.OK,
      message:MESSAGES_CONSTANT.CARD.READ_CARDS.SUCCEED,
      cards
    }   
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const card = await this.cardsService.findOne(+id);
    return{
      statusCode:HttpStatus.OK,
      message:MESSAGES_CONSTANT.CARD.READ_CARD.SUCCEED,
      card
    }   
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateCardDto: UpdateCardDto, @Request() req) {
    const update =  await this.cardsService.update(+id, updateCardDto);
    const card = await this.cardsService.findOne(+id);
    const log = await this.activityService.createLog(req.user.id, +id, 'updateCard');
    return{
      statusCode:HttpStatus.OK,
      message:MESSAGES_CONSTANT.CARD.UPDATE_CARD.SUCCEED,
      card,
      log
    }  
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    const card = await this.cardsService.delete(+id);
    return{
      statusCode:HttpStatus.OK,
      message:MESSAGES_CONSTANT.CARD.DELETE_CARD.SUCCEED,
      card
    }  
  }

  // 카드 멤버 추가
  @UseGuards(JwtAuthGuard)
  @Post(':id/members')
  async createMembers(@Param('id') id: string, @Body() createCardAssignessDto: CreateCardAssignessDto, @Request() req){
    const createMembers = await this.cardsService.createMembers(createCardAssignessDto.userId, +id);
    const log = await this.activityService.createLog(req.user.id, +id, 'createCardMembers');
    
    return{
      statusCode:HttpStatus.OK,
      message:MESSAGES_CONSTANT.CARD.CREATE_MEMBER_CARD.SUCCEED,
      createMembers,
      log
    }  
  }

  // 카드 멤버 삭제
  @UseGuards(JwtAuthGuard)
  @Delete(':id/members')
  async deleteMembers(@Param('id') id: string, @Body() deleteCardAssignessDto: DeleteCardAssignessDto, @Request() req){
    const deleteMembers = await this.cardsService.deleteMembers(deleteCardAssignessDto.userId, +id);
    const log = await this.activityService.createLog(req.user.id, +id, 'deleteCardMembers');
    
    return{
      statusCode:HttpStatus.OK,
      message:MESSAGES_CONSTANT.CARD.DELETE_MEMBER_CARD.SUCCEED,
      deleteMembers,
      log
    }  
  }

  // 카드 일정 수정 및 추가
  @UseGuards(JwtAuthGuard)
  @Patch(':id/Date')
  async updateCardDate(@Param('id') id: string, @Body() updateCardDto: UpdateCardDto, @Request() req) {
    await this.cardsService.updateCardDate(+id, updateCardDto);
    const updateCardDate = await this.cardsService.findOne(+id);
    const log = await this.activityService.createLog(req.user.id, +id, 'updateCardDate');

    return{
      statusCode:HttpStatus.OK,
      message:MESSAGES_CONSTANT.CARD.UPDATE_DATE_CARD.SUCCEED,
      updateCardDate,
      log
    }  
  }

  // 카드 일정 마감
  @UseGuards(JwtAuthGuard)
  @Patch(':id/DateExpired')
  async updateDateExpire(@Param('id') id: string, @Request() req) {
    const updateDateExpire =  await this.cardsService.updateDateExpire(+id);
    const log = await this.activityService.createLog(req.user.id, +id, 'updateDateExpired');
    if(updateDateExpire){
      return{
        statusCode:HttpStatus.OK,
        message:MESSAGES_CONSTANT.CARD.UPDATE_DATE_EXPIRE_CARD.SUCCEED,
        updateDateExpire,
        log
      }  
    }else if(!updateDateExpire){
      return{
        statusCode:HttpStatus.OK,
        message:MESSAGES_CONSTANT.CARD.UPDATE_DATE_EXPIRE_CARD.FAILED,
      } 
    }
  }
}
