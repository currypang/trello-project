import _, { isNull } from 'lodash';
import { DeepPartial, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';

import { Card } from './entities/card.entity';
import { CardAssigness } from './entities/card-assigness.entity';
import { List } from '../lists/entities/list.entity';
import { BoardMembers } from 'src/board/entities/board-member.entity';
import { SseService } from 'src/sse/sse.service';
import Decimal from 'decimal.js';
import { idText } from 'typescript';

@Injectable()
export class CardsService {
  constructor(
    @InjectRepository(Card) private cardRepository: Repository<Card>,
    @InjectRepository(CardAssigness) private cardAssignessRepository: Repository<CardAssigness>,
    @InjectRepository(List) private listRepository: Repository<List>,
    @InjectRepository(BoardMembers) private boardMembersRepository: Repository<BoardMembers>,
    private readonly sseService: SseService
  ) {}

  async create(createCardDto: CreateCardDto, userId: number) {
    const { name, listId } = createCardDto;

    // 리스트가 존재하는지 확인
    const existingList = await this.listRepository.findOne({
      where: { id: listId },
    });
    if (!existingList) {
      throw new BadRequestException('없는 리스트입니다.');
    }

    return await this.cardRepository.manager.transaction(async (transactionalEntityManager) => {
      // 리스트 ID에서 마지막 카드 찾음
      const lastCard = await transactionalEntityManager.findOne(Card, {
        where: { listId },
        order: { position: 'DESC' },
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

  async findOne(id: number) {
    await this.verifyCardById(id);

    return await this.cardRepository.findOne({
      where: { id, deletedAt: null },
    });
  }

  async update(id: number, userId: number, updateCardDto: UpdateCardDto) {
    await this.verifyCardById(id);

    if (!(updateCardDto instanceof UpdateCardDto)) {
      throw new BadRequestException('Invalid updateCardDto');
    }
    const data = await this.cardRepository.update({ id }, updateCardDto);
    this.sseService.emitCardChangeEvent(userId, { message: 'update card' });
    return data;
  }

  async delete(id: number) {
    await this.verifyCardById(id);
    const post = await this.cardRepository.delete({ id });
    return post;
  }

  async createMembers(userId: number, cardId: number) {
    const cardInfo = await this.findOne(cardId);
    const listInfo = await this.listRepository.findOneBy({ id: cardInfo.listId });
    const verifyMemberbyId = await this.boardMembersRepository.find({
      where: {
        userId,
        boardId: listInfo.boardId,
      },
    });
    if (_.isNil(verifyMemberbyId)) {
      throw new NotFoundException('borad에 존재하지 않는 멤버입니다.');
    }

    const verifyCardMemberbyId = await this.cardAssignessRepository.find({
      where : {
        userId,
        cardId,       
      }
    })
    if (verifyCardMemberbyId.length !== 0) {
      throw new NotFoundException('card에 이미 존재하는 멤버입니다.');
    }

    const createMember = await this.cardAssignessRepository.save({
      userId,
      cardId,
    });

    return createMember;
  }

  async deleteMembers(userId: number, cardId: number) {
    const cardInfo = await this.findOne(cardId);
    const listInfo = await this.listRepository.findOneBy({ id: cardInfo.listId });
    const verifyMemberbyId = await this.boardMembersRepository.find({
      where: {
        userId,
        boardId: listInfo.boardId,
      },
    });
    if (_.isNil(verifyMemberbyId)) {
      throw new NotFoundException('borad에 존재하지 않는 멤버입니다.');
    }

    const verifyCardMemberbyId = await this.cardAssignessRepository.find({
      where: {
        userId,
        cardId,       
      }
    })
    if (verifyCardMemberbyId.length === 0) {
      throw new NotFoundException('card에 존재하지 않는 멤버입니다.');
    }

    const deleteMember = await this.cardAssignessRepository.delete({
      userId,
      cardId,
    });

    return deleteMember;
  }

  async updateCardDate(id: number, updateCardDto: UpdateCardDto) {
    const { startDate, dueDate } = updateCardDto;

    await this.verifyCardById(id);

    if (!(updateCardDto instanceof UpdateCardDto)) {
      throw new BadRequestException('Invalid updateCardDto');
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

  async updateDateExpire(id: number) {
    await this.verifyCardById(id);
    const cardInfo = await this.findOne(id);
    let cardDate;
    if(cardInfo.dueDate){
      cardDate = new Date(cardInfo.dueDate);
    }else{
      throw new BadRequestException('일정이 지정되지 않았습니다.');
    }
    const today = new Date();

    if (cardDate < today) {
      return false;
    } else if (cardDate > today) {
      return await this.cardRepository.update({ id }, { isExpired : true, } );
    } else {
      return false;
    }
  }

  async updateCardList(id: number, listId: number){
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
      throw new BadRequestException('없는 리스트입니다.');
    }

    if(existingList.boardId !== listBoardId.boardId){
      throw new BadRequestException('서로 다른 보드입니다.');
    }
    const lastCard = await this.cardRepository.findOne({
      where: { listId },
      select: ['position'],
      order: { position: 'DESC' },
    });

    const newPosition = +lastCard
        ? new Decimal(+lastCard).plus(new Decimal(Math.random()).times(20000)).toNumber()
        : new Decimal(Math.random()).times(10000).toNumber();

    // 카드 리스트id 업데이트 생성
    const card = this.cardRepository.update({ id },{
      listId,
      position: newPosition,
    });

    return card;
  }

  async verifyCardById(id: number) {
    const card = await this.cardRepository.findOneBy({ id });
    if (_.isNil(card)) {
      throw new NotFoundException('존재하지 않는 카드입니다.');
    }

    return card;
  }
}
