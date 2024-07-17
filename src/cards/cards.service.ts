import { DataSource, DeepPartial, EntityManager, Repository } from 'typeorm';
import _ from 'lodash';
import { InjectRepository } from '@nestjs/typeorm';

import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';

import { Card } from './entities/card.entity';
import { CardAssigness } from './entities/card-assigness.entity';
import { List } from '../lists/entities/list.entity';
import { BoardMembers } from 'src/board/entities/board-member.entity';
import { SseService } from 'src/sse/sse.service';
import Decimal from 'decimal.js';
import { UpdateCardOrderDto } from './dto/update-card-order.dto';
import { RedisService } from 'src/redis/redis.service';
import { MESSAGES_CONSTANT } from 'src/constants/messages.constants';
import { CARDS_CONSTANT } from 'src/constants/cards.constant';
import { UpdateCardDateDto } from './dto/update-card-date.dto';
import { Cron } from '@nestjs/schedule';
import { CreateCardAssignessDto } from './dto/create-cardAssigness.dto';
import { Board } from 'src/board/entities/board.entity';

@Injectable()
export class CardsService {
  constructor(
    @InjectRepository(Card)
    private cardRepository: Repository<Card>,
    @InjectRepository(CardAssigness)
    private cardAssignessRepository: Repository<CardAssigness>,
    @InjectRepository(List)
    private listRepository: Repository<List>,
    @InjectRepository(BoardMembers)
    private boardMembersRepository: Repository<BoardMembers>,
    @InjectRepository(Board)
    private boardRepository: Repository<Board>,
    private readonly sseService: SseService,
    private readonly dataSource: DataSource,
    private readonly redisService: RedisService
  ) {}

  async create(createCardDto: CreateCardDto, userId: number) {
    const { name, listId } = createCardDto;

    // 리스트가 존재하는지 확인
    const existingList = await this.listRepository.findOne({
      where: { id: listId },
    });
    if (!existingList) {
      throw new BadRequestException(MESSAGES_CONSTANT.CARD.CREATE_CARD.BAD_REQUEST);
    }

    const listInfo = await this.listRepository.findOneBy({ id: listId });
    const verifyMemberbyId = await this.boardMembersRepository.find({
      where: {
        userId,
        boardId: listInfo.boardId,
      },
    });
    if (verifyMemberbyId.length === 0) {
      throw new NotFoundException(MESSAGES_CONSTANT.CARD.CREATE_CARD.NOT_FOUND_MEMBER);
    }

    return await this.cardRepository.manager.transaction(async (transactionalEntityManager) => {
      // 리스트 ID에서 마지막 카드 찾음
      const lastCard = await transactionalEntityManager.findOne(Card, {
        where: { listId },
        order: { position: CARDS_CONSTANT.ORDER.DESC },
      });

      // 카드 위치 지정
      const newPosition = lastCard
        ? new Decimal(lastCard.position).plus(new Decimal(Math.random()).times(20000)).toNumber()
        : new Decimal(Math.random()).times(10000).toNumber();

      // 새로운 카드 생성
      const card = transactionalEntityManager.create(Card, {
        name,
        listId,
        position: newPosition,
        cardAssigness: [
          {
            userId: userId,
          },
        ] as DeepPartial<CardAssigness>[],
      });
      const result = await transactionalEntityManager.save(Card, card);

      return result;
    });
  }

  async findAll() {
    return await this.cardRepository.find({});
  }

  async cardFindOne(id: number, userId:number) {
    const cardInfo = await this.verifyCardById(id);
    console.log(cardInfo)
    const listId = cardInfo.listId;
    console.log(listId)

    const board = await this.listRepository.findOne({ where: { id: listId } });
    const boardId = board.boardId;
    const validateMember = await this.boardMembersRepository.findOne({
      where: {boardId:boardId, userId:userId}
    })
    if (_.isNil(validateMember)) {
      throw new NotFoundException(MESSAGES_CONSTANT.CARD.READ_CARD.NOT_FOUND_MEMBER);
    }
    return await this.cardRepository.findOne({
      where: { id},
    });
  }
  async update(id: number, updateCardDto: UpdateCardDto) {
    await this.verifyCardById(id);

    const data = await this.cardRepository.update({ id }, updateCardDto);

    return data;
  }

  async delete(id: number) {
    await this.verifyCardById(id);
    const post = await this.cardRepository.softRemove({ id });
    return post;
  }

  async createMembers(userId: number, createCardAssignessDto: CreateCardAssignessDto, cardId: number) {
    const workingBoard = await this.cardRepository.findOne({
      relations: { list: { board: true } },
      where: { id: cardId },
    });

    const authority = await this.boardMembersRepository.findOne({
      where: { userId: userId, boardId: workingBoard.list.board.id },
    });

    if (_.isNil(authority)) {
      throw new NotFoundException('초대권한 이 없습니다.');
    }

    const validateReqUser = await this.boardMembersRepository.findOne({
      where: { userId: createCardAssignessDto.userId, boardId: workingBoard.list.board.id },
    });

    if (_.isNil(validateReqUser)) {
      throw new NotFoundException('보드에 속한 유저가 아닙니다.');
    }

    const createMember = await this.cardAssignessRepository.save({
      userId: createCardAssignessDto.userId,
      cardId,
    });
    return createMember;
  }

  async deleteMembers(userId: number, cardId: number) {
    const cardInfo = await this.cardFindOne(userId,cardId);
    const listInfo = await this.listRepository.findOneBy({ id: cardInfo.listId });
    const verifyMemberbyId = await this.boardMembersRepository.find({
      where: {
        userId,
        boardId: listInfo.boardId,
      },
    });
    if (verifyMemberbyId.length === 0) {
      throw new NotFoundException(MESSAGES_CONSTANT.CARD.DELETE_MEMBER_CARD.NOT_FOUND);
    }

    const verifyCardMemberbyId = await this.cardAssignessRepository.find({
      where: {
        userId,
        cardId,
      },
    });
    if (verifyCardMemberbyId.length === 0) {
      throw new NotFoundException(MESSAGES_CONSTANT.CARD.DELETE_MEMBER_CARD.NOT_FOUND_IN_CARD);
    }

    const deleteMember = await this.cardAssignessRepository.delete({
      userId,
      cardId,
    });

    return deleteMember;
  }

  async updateCardDate(id: number, updateCardDateDto: UpdateCardDateDto) {
    const { startDate, dueDate } = updateCardDateDto;

    await this.verifyCardById(id);

    if (!(updateCardDateDto instanceof UpdateCardDateDto)) {
      throw new BadRequestException(MESSAGES_CONSTANT.CARD.UPDATE_DATE_CARD.INVALID_TYPE);
    }

    return await this.cardRepository.update(
      { id },
      {
        isExpired: false,
        startDate,
        dueDate,
      }
    );
  }
/*
  async updateDateExpire(id: number) {
    await this.verifyCardById(id);
    const cardInfo = await this.cardAssignessRepository.find({});
    let cardDate;
    if (cardInfo.dueDate) {
      cardDate = new Date(cardInfo.dueDate);
    } else {
      throw new BadRequestException(MESSAGES_CONSTANT.CARD.UPDATE_DATE_EXPIRE_CARD.BAD_REQUEST);
    }
    const today = new Date();

    if (cardDate < today) {
      return false;
    } else if (cardDate > today) {
      return await this.cardRepository.update({ id }, { isExpired: true });
    } else {
      return false;
    }
  }

  @Cron('0 0 * * * *')
  async updateDateExpire_ver2() {
    console.log('-----------마감 확인 작업 시작-----------');
    const today = new Date();

    const updateCardQuery = this.cardRepository
      .createQueryBuilder('card')
      .update(Card)
      .set({ isExpired: true })
      .where('dueDate < :date AND isExpired = false', { date: today });

    return await updateCardQuery.execute();
  }

  async updateCardList(id: number, listId: number, updateCardOrderDto: UpdateCardOrderDto) {
    //카드가 존재하는지랑
    //새로운 리스트의 카드를 배열해서 받고 거기서 계산해야한다.
    //계산식은 밑에 가져오고
    //카드 있는지 에러처리용
    await this.verifyCardById(id);

    const cardListId = await this.cardRepository.findOneBy({ id });
    const listBoardId = await this.listRepository.findOne({
      where: { id: cardListId.listId },
    });
    // 리스트가 존재하는지 확인
    const existingList = await this.listRepository.findOne({
      where: { id: listId },
    });
    if (!existingList) {
      throw new NotFoundException(MESSAGES_CONSTANT.CARD.UPDATE_LIST_CARD.NOT_FOUND);
    }

    if (existingList.boardId !== listBoardId.boardId) {
      throw new BadRequestException(MESSAGES_CONSTANT.CARD.UPDATE_LIST_CARD.BAD_REQUEST);
    }
    const lastCard = await this.cardRepository.findOne({
      where: { listId },
      select: ['position'],
      order: { position: CARDS_CONSTANT.ORDER.DESC },
    });

    const newPosition = +lastCard
      ? new Decimal(+lastCard).plus(new Decimal(Math.random()).times(20000)).toNumber()
      : new Decimal(Math.random()).times(10000).toNumber();

    // 카드 리스트id 업데이트 생성
    const card = this.cardRepository.update(
      { id },
      {
        listId,
        position: newPosition,
      }
    );

    return card;
  }
*/
  async verifyCardById(id: number) {
    const card = await this.cardRepository.findOneBy({ id });
    if (_.isNil(card)) {
      throw new NotFoundException(MESSAGES_CONSTANT.CARD.VERIFY_CARD_BY_ID.NOT_FOUND);
    }

    return card;
  }

  //카드 순서 변경
  async updateOrder(userId, id: number, updateCardOrderDto: UpdateCardOrderDto) {
    const { position } = updateCardOrderDto;
    return await this.dataSource.transaction(async (transactionalEntityManager: EntityManager) => {
      // 카드id를 받아 카드 정보를 가져오기
      const cardToUpdateOrder = await this.verifyCardById(id);
      //카드 리스트 아이디
      const cardListId = cardToUpdateOrder.listId;
      //카드의 리스트 정보
      const listInfo = await transactionalEntityManager.findOne(List, { where: { id: cardListId } });
      if (!listInfo) {
        throw new NotFoundException(MESSAGES_CONSTANT.CARD.UPDATE_ORDER.NOT_FOUND);
      }
      //카드 보드 아이디
      const listBoardId = listInfo.boardId;
      const boardMember = await transactionalEntityManager.findOne(BoardMembers, { where: { userId } });

      const userBoardId = boardMember.boardId;

      if (listBoardId !== userBoardId) {
        throw new ForbiddenException(MESSAGES_CONSTANT.CARD.UPDATE_ORDER.FORBIDDEN);
      }

      // 카드가 속한 리스트의 정보를 가져오기
      const list = await transactionalEntityManager.findOne(List, {
        where: { id: cardListId },
        relations: ['cards'],
      });
      if (!list) {
        throw new NotFoundException(MESSAGES_CONSTANT.CARD.UPDATE_ORDER.NOT_FOUND);
      }
      // 리스트의 모든 카드들을 가져오기
      const cardsInlist = list.cards;
      cardsInlist.sort((a: Card, b: Card): number => a.position - b.position);

      const cardArrayLangth = cardsInlist.length;
      if (position + 1 >= cardArrayLangth) {
        throw new BadRequestException(MESSAGES_CONSTANT.CARD.UPDATE_ORDER.BAD_REQUEST);
      }
      // 바꾸려는 위치의 리스트의 position값
      const targetPosition = cardsInlist[position].position;
      // 바꾸는 위치 이전 포지션 값
      const previousTargetPosition = cardsInlist[position - 1]?.position;

      // 포지션 계산
      const newPosition =
        position + 1 == cardArrayLangth
          ? new Decimal(previousTargetPosition).plus(new Decimal(Math.random()).times(20000)).toNumber()
          : previousTargetPosition
            ? new Decimal(new Decimal(targetPosition).minus(previousTargetPosition))
                .times(Math.random())
                .plus(previousTargetPosition)
                .toNumber()
            : new Decimal(targetPosition).times(Math.random()).toNumber();

      // 카드의 position 업데이트
      cardToUpdateOrder.position = newPosition;

      Object.assign(cardToUpdateOrder, { position: newPosition });

      const updatedCard = await transactionalEntityManager.save(Card, cardToUpdateOrder);

      return updatedCard;
    });
  }
}
