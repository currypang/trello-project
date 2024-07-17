import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CardsService } from './cards.service';
import { ActivityService } from 'src/activity/activity.service';
import { MESSAGES_CONSTANT } from 'src/constants/messages.constants';

import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { CreateCardAssignessDto } from './dto/create-cardAssigness.dto';
import { DeleteCardAssignessDto } from './dto/delete-cardAssigness.dto';
import { UpdateListOrderDto } from 'src/lists/dto/update-list-order.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/user/types/roles.type';

@ApiTags('카드')
@UseGuards(RolesGuard)
@Roles(Role.VerifiedUser)
@Controller('cards')
export class CardsController {
  constructor(
    private readonly cardsService: CardsService,
    private readonly activityService: ActivityService
  ) {}
  /**
   * 카드 생성
   * @param CreateCardDto
   * @returns
   */
  @ApiBearerAuth()
  @Post()
  async create(@Body() createCardDto: CreateCardDto, @Request() req) {
    const createCard = await this.cardsService.create(createCardDto, req.user.id);
    const log = await this.activityService.createLog(req.user.id, createCard.id, 'CreateCard');
    return {
      statusCode: HttpStatus.CREATED,
      message: MESSAGES_CONSTANT.CARD.CREATE_CARD.SUCCEED,
      createCard,
      log,
    };
  }
  /**
   * 카드 전체 조회 -> 혹시 몰라서 만들어 놓은 것
   * @returns
   */
  @ApiBearerAuth()
  @Get()
  async findAll() {
    const cards = await this.cardsService.findAll();
    return {
      statusCode: HttpStatus.OK,
      message: MESSAGES_CONSTANT.CARD.READ_CARDS.SUCCEED,
      cards,
    };
  }

  /**
   * 카드 상세 조회
   * @param cardId
   * @returns
   */
  @Get(':cardId')
  async findOne(@Param('cardId') cardId: string) {
    const card = await this.cardsService.cardFindOne(+cardId);
    return {
      statusCode: HttpStatus.OK,
      message: MESSAGES_CONSTANT.CARD.READ_CARD.SUCCEED,
      card,
    };
  }

  /**
   * 카드 수정
   * @param cardId
   * @param updateCardDto
   * @param req
   * @returns
   */
  @ApiBearerAuth()
  @Patch(':cardId')
  async update(@Param('cardId') cardId: string, @Body() updateCardDto: UpdateCardDto, @Request() req) {
    await this.cardsService.update(+cardId, req.user.id, updateCardDto);
    const card = await this.cardsService.cardFindOne(+cardId);
    const log = await this.activityService.createLog(req.user.id, +cardId, 'updateCard');
    return {
      statusCode: HttpStatus.OK,
      message: MESSAGES_CONSTANT.CARD.UPDATE_CARD.SUCCEED,
      card,
      log,
    };
  }

  /**
   * 카드 삭제
   * @param cardId
   * @returns
   */
  @ApiBearerAuth()
  @Delete(':cardId')
  async delete(@Param('cardId') cardId: string) {
    const card = await this.cardsService.delete(+cardId);
    return {
      statusCode: HttpStatus.OK,
      message: MESSAGES_CONSTANT.CARD.DELETE_CARD.SUCCEED,
      card,
    };
  }


  @ApiBearerAuth()
  @Post(':cardId/members')
  async createMembers(
    @Param('cardId',ParseIntPipe) cardId: number,
    @Body() createCardAssignessDto: CreateCardAssignessDto,
    @Request() req
  ) {
    const userId = req.user.id
    const createMembers = await this.cardsService.createMembers(userId,createCardAssignessDto, cardId);
    const log = await this.activityService.createLog(req.user.id, cardId, 'createCardMembers');

    return {
      statusCode: HttpStatus.OK,
      message: MESSAGES_CONSTANT.CARD.CREATE_MEMBER_CARD.SUCCEED,
      createMembers,
      log,
    };
  }

  /**
   * 카드 멤버 삭제
   * @param cardId
   * @param deleteCardAssignessDto
   * @param req
   * @returns
   */
  @ApiBearerAuth()
  @Delete(':cardId/members')
  async deleteMembers(
    @Param('cardId') cardId: string,
    @Body() deleteCardAssignessDto: DeleteCardAssignessDto,
    @Request() req
  ) {
    const deleteMembers = await this.cardsService.deleteMembers(deleteCardAssignessDto.userId, +cardId);
    const log = await this.activityService.createLog(req.user.id, +cardId, 'deleteCardMembers');

    return {
      statusCode: HttpStatus.OK,
      message: MESSAGES_CONSTANT.CARD.DELETE_MEMBER_CARD.SUCCEED,
      deleteMembers,
      log,
    };
  }

  /**
   * 카드 일정 수정 및 추가
   * @param cardId
   * @param updateCardDto
   * @param req
   * @returns
   */
  @ApiBearerAuth()
  @Patch(':cardId/Date')
  async updateCardDate(@Param('cardId') cardId: string, @Body() updateCardDto: UpdateCardDto, @Request() req) {
    await this.cardsService.updateCardDate(+cardId, updateCardDto);
    const updateCardDate = await this.cardsService.cardFindOne(+cardId);
    const log = await this.activityService.createLog(req.user.id, +cardId, 'updateCardDate');

    return {
      statusCode: HttpStatus.OK,
      message: MESSAGES_CONSTANT.CARD.UPDATE_DATE_CARD.SUCCEED,
      updateCardDate,
      log,
    };
  }

  /**
   * 카드 일정 마감
   * @param cardId
   * @param req
   * @returns
   */
  @ApiBearerAuth()
  @Patch(':cardId/DateExpired')
  async updateDateExpire(@Param('cardId') cardId: string, @Request() req) {
    const updateDateExpire = await this.cardsService.updateDateExpire(+cardId);
    const log = await this.activityService.createLog(req.user.id, +cardId, 'updateDateExpired');
    if (updateDateExpire) {
      return {
        statusCode: HttpStatus.OK,
        message: MESSAGES_CONSTANT.CARD.UPDATE_DATE_EXPIRE_CARD.SUCCEED,
        updateDateExpire,
        log,
      };
    } else if (!updateDateExpire) {
      return {
        statusCode: HttpStatus.OK,
        message: MESSAGES_CONSTANT.CARD.UPDATE_DATE_EXPIRE_CARD.FAILED,
      };
    }
  }
  /**
   * 카드 순서 변경
   * @param cardId
   * @param UpdateListOrderDto
   * @returns
   */
  @ApiBearerAuth()
  @Patch(':cardId/order')
  async updateOrder(
    @Request() req,
    @Param('cardId', ParseIntPipe) listId: number,
    @Body() updateListOrderDto: UpdateListOrderDto
  ) {
    const userId = req.user.id;
    const data = await this.cardsService.updateOrder(userId, listId, updateListOrderDto);
    return {
      statusCode: HttpStatus.OK,
      message: MESSAGES_CONSTANT.CARD.UPDATE_LIST_CARD.SUCCEED,
      data,
    };
  }

  /**
   * 카드 리스트 이동
   * @param cardId
   * @param listId
   * @param req
   * @returns
   */
  @ApiBearerAuth()
  @Patch(':cardId/lists/:listId')
  async updateCardList(@Param('cardId') cardId: string, @Param('listId') listId: string, @Request() req) {
    await this.cardsService.updateCardList(+cardId, +listId);
    const updateCardList = await this.cardsService.cardFindOne(+cardId);
    const log = await this.activityService.createLog(req.user.id, +cardId, 'updateCardListId');

    return {
      statusCode: HttpStatus.OK,
      message: MESSAGES_CONSTANT.CARD.UPDATE_LIST_CARD.SUCCEED,
      updateCardList,
      log,
    };
  }


  /**
   * 카드 마감 크론 메소드
   * @returns
   */
  @ApiBearerAuth()
  @Patch('expire/cron')
  async updateDateExpire_ver2(@Request() req) {
    const updateDateExpire = await this.cardsService.updateDateExpire_ver2();
    //const log = await this.activityService.createLog(req.user.id, +cardId, 'updateDateExpire');

    return {
      statusCode: HttpStatus.OK,
      updateDateExpire,
      //log,
    };
  }
}
