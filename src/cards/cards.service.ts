import _, { isNull } from 'lodash';
import { DataSource, DeepPartial, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';

import { Card } from './entities/card.entity';
import { CardAssigness } from './entities/card-assigness.entity';
import { List } from '../lists/entities/list.entity';
import { BoardMembers } from 'src/board/entities/board-member.entity';
import { SseService } from 'src/sse/sse.service';
import { idText } from 'typescript';
import Decimal from 'decimal.js';

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
    private readonly sseService: SseService,
    private readonly dataSource: DataSource
  ) {}

  async create(createCardDto: CreateCardDto, userId: number) {
    const { name, listId } = createCardDto;

    // 보드가 존재하는지 확인
    const existingList = await this.listRepository.findOne({
      where: { id: listId },
    });
    if (!existingList) {
      throw new BadRequestException('없는 보드입니다.');
    }

    return await this.cardRepository.manager.transaction(async (transactionalEntityManager) => {
      // 보드 ID에서 마지막 카드 찾음
      const lastCard = await transactionalEntityManager.findOne(Card, {
        where: { listId },
        order: { position: 'DESC' },
      });

      // 카드 위치 지정
      const newPosition = lastCard
        ? lastCard.position + Math.floor(Math.random() * 10000)
        : Math.floor(Math.random() * 1000);

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
      where: {
        userId,
        cardId,
      },
    });
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
      },
    });
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
    if (cardInfo.dueDate) {
      cardDate = new Date(cardInfo.dueDate);
    } else {
      throw new BadRequestException('일정이 지정되지 않았습니다.');
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

  async verifyCardById(id: number) {
    const card = await this.cardRepository.findOneBy({ id });
    if (_.isNil(card)) {
      throw new NotFoundException('존재하지 않는 카드입니다.');
    }

    return card;
  }
  //리스트 순서 변경
  async updateOrder(userId, id: number, updateListOrderDto: UpdateListOrderDto) {
    const { position } = updateListOrderDto;
    return await this.dataSource.transaction(async (transactionalEntityManager: EntityManager) => {
      // 리스트 id를 받아 리스트 정보를 가져오기
      const listToUpdateOrder = await transactionalEntityManager.findOne(List, { where: { id } });
      console.log('listToUpdateOrder', listToUpdateOrder);
      if (!listToUpdateOrder) {
        throw new NotFoundException('리스트를 찾을 수 없습니다.');
      }
      const BoardMember = await this.boardMembersRepository.findOne({ where: { userId } });
      const userBoardId = BoardMember.boardId;
      const listBoardId = listToUpdateOrder.boardId;

      if (listBoardId !== userBoardId) {
        throw new ForbiddenException('보드에 가입된 유저가 아닙니다.');
      }

      // 리스트가 속한 보드의 정보를 가져오기
      const board = await transactionalEntityManager.findOne(Board, {
        where: { id: listToUpdateOrder.boardId },
        relations: ['lists'],
      });
      if (!board) {
        throw new NotFoundException('보드를 찾을 수 없습니다.');
      }

      // 보드의 모든 리스트들을 가져오기
      const listsInBoard = board.lists;
      listsInBoard.sort((a: List, b: List): number => a.position - b.position);

      const listArrayLangth = listsInBoard.length;
      if (position + 1 >= listArrayLangth) {
        throw new BadRequestException('옮길 수 있는 위치가 아닙니다.');
      }
      // 바꾸려는 위치의 리스트의 position값
      const targetPosition = listsInBoard[position].position;
      // 바꾸는 위치 이전 포지션 값
      const previousTargetPosition = listsInBoard[position - 1]?.position;
      //위치 리스트의 마지막 표지션

      // 포지션 계산
      const newPosition =
        position + 1 == listArrayLangth
          ? new Decimal(previousTargetPosition).plus(new Decimal(Math.random()).times(20000)).toNumber()
          : previousTargetPosition
            ? new Decimal(new Decimal(targetPosition).minus(previousTargetPosition))
                .times(Math.random())
                .plus(previousTargetPosition)
                .toNumber()
            : new Decimal(targetPosition).times(Math.random()).toNumber();

      // 리스트의 position 업데이트
      listToUpdateOrder.position = newPosition;

      Object.assign(listToUpdateOrder, { position: newPosition });

      const updatedList = await transactionalEntityManager.save(List, listToUpdateOrder);

      return updatedList;
    });
  }
}
