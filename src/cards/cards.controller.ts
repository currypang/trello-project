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

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll() {
    const cards = await this.cardsService.findAll();
    return{
      statusCode:HttpStatus.OK,
      message:MESSAGES_CONSTANT.CARD.READ_CARDS.SUCCEED,
      cards
    }   
  }

  @Get(':cardId')
  async findOne(@Param('cardId') cardId: string) {
    const card = await this.cardsService.findOne(+cardId);
    return{
      statusCode:HttpStatus.OK,
      message:MESSAGES_CONSTANT.CARD.READ_CARD.SUCCEED,
      card
    }   
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':cardId')
  async update(@Param('cardId') cardId: string, @Body() updateCardDto: UpdateCardDto, @Request() req) {
    await this.cardsService.update(+cardId, req.user.id, updateCardDto);
    const card = await this.cardsService.findOne(+cardId);
    const log = await this.activityService.createLog(req.user.id, +cardId, 'updateCard');
    return{
      statusCode:HttpStatus.OK,
      message:MESSAGES_CONSTANT.CARD.UPDATE_CARD.SUCCEED,
      card,
      log
    }  
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':cardId')
  async delete(@Param('cardId') cardId: string) {
    const card = await this.cardsService.delete(+cardId);
    return{
      statusCode:HttpStatus.OK,
      message:MESSAGES_CONSTANT.CARD.DELETE_CARD.SUCCEED,
      card
    }  
  }

  // 카드 멤버 추가
  @UseGuards(JwtAuthGuard)
  @Post(':cardId/members')
  async createMembers(@Param('cardId') cardId: string, @Body() createCardAssignessDto: CreateCardAssignessDto, @Request() req){
    const createMembers = await this.cardsService.createMembers(createCardAssignessDto.userId, +cardId);
    const log = await this.activityService.createLog(req.user.id, +cardId, 'createCardMembers');
    
    return{
      statusCode:HttpStatus.OK,
      message:MESSAGES_CONSTANT.CARD.CREATE_MEMBER_CARD.SUCCEED,
      createMembers,
      log
    }  
  }

  // 카드 멤버 삭제
  @UseGuards(JwtAuthGuard)
  @Delete(':cardId/members')
  async deleteMembers(@Param('cardId') cardId: string, @Body() deleteCardAssignessDto: DeleteCardAssignessDto, @Request() req){
    const deleteMembers = await this.cardsService.deleteMembers(deleteCardAssignessDto.userId, +cardId);
    const log = await this.activityService.createLog(req.user.id, +cardId, 'deleteCardMembers');
    
    return{
      statusCode:HttpStatus.OK,
      message:MESSAGES_CONSTANT.CARD.DELETE_MEMBER_CARD.SUCCEED,
      deleteMembers,
      log
    }  
  }

  // 카드 일정 수정 및 추가
  @UseGuards(JwtAuthGuard)
  @Patch(':cardId/Date')
  async updateCardDate(@Param('cardId') cardId: string, @Body() updateCardDto: UpdateCardDto, @Request() req) {
    await this.cardsService.updateCardDate(+cardId, updateCardDto);
    const updateCardDate = await this.cardsService.findOne(+cardId);
    const log = await this.activityService.createLog(req.user.id, +cardId, 'updateCardDate');

    return{
      statusCode:HttpStatus.OK,
      message:MESSAGES_CONSTANT.CARD.UPDATE_DATE_CARD.SUCCEED,
      updateCardDate,
      log
    }  
  }

  // 카드 일정 마감
  @UseGuards(JwtAuthGuard)
  @Patch(':cardId/DateExpired')
  async updateDateExpire(@Param('cardId') cardId: string, @Request() req) {
    const updateDateExpire =  await this.cardsService.updateDateExpire(+cardId);
    const log = await this.activityService.createLog(req.user.id, +cardId, 'updateDateExpired');
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

  // 카드 리스트 이동
  @UseGuards(JwtAuthGuard)
  @Patch(':cardId/lists/:listId')
  async updateCardList(@Param('cardId') cardId: string, @Param('listId') listId: string, @Request() req){
    await this.cardsService.updateCardList(+cardId, +listId);
    const updateCardList = await this.cardsService.findOne(+cardId);
    const log = await this.activityService.createLog(req.user.id, +cardId, 'updateCardListId');
    
    return{
      statusCode:HttpStatus.OK,
      message:MESSAGES_CONSTANT.CARD.UPDATE_LIST_CARD.SUCCEED,
      updateCardList,
      log
    }  
  }
}
