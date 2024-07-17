import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { List } from './entities/list.entity';
import { Board } from '../board/entities/board.entity';
import { UpdateListOrderDto } from './dto/update-list-order.dto';
import Decimal from 'decimal.js';
import { BoardMembers } from 'src/board/entities/board-member.entity';
import { MESSAGES_CONSTANT } from 'src/constants/messages.constants';
import { LISTS_CONSTANT } from 'src/constants/lists.constans';

@Injectable()
export class ListsService {
  constructor(
    @InjectRepository(List)
    private readonly listRepository: Repository<List>,
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,
    @InjectRepository(BoardMembers)
    private readonly boardMembersRepository: Repository<BoardMembers>,
    private readonly dataSource: DataSource
  ) {}
  private async verifyBoardMembership(userId: number, boardId: number) {
    const boardMembers = await this.boardMembersRepository.find({ where: { userId } });
    console.log(boardMembers);

    const isMember = boardMembers.some((member) => member.boardId === boardId);
    console.log(isMember);
    if (!isMember) {
      throw new ForbiddenException(MESSAGES_CONSTANT.LIST.COMMON.FORBIDDEN);
    }
  }
  private calculateNewPosition(lastList: List | undefined): number {
    return lastList
      ? new Decimal(lastList.position).plus(new Decimal(Math.random()).times(20000)).toNumber()
      : new Decimal(Math.random()).times(10000).toNumber();
  }

  private calculateNewPositionBetween(prevPos: number | undefined, targetPos: number, isLast: boolean): number {
    if (isLast) {
      return new Decimal(prevPos).plus(new Decimal(Math.random()).times(20000)).toNumber();
    }
    if (prevPos !== undefined) {
      return new Decimal(new Decimal(targetPos).minus(prevPos)).times(Math.random()).plus(prevPos).toNumber();
    }
    return new Decimal(targetPos).times(Math.random()).toNumber();
  }
  //리스트 생성
  async create(userId, createListDto: CreateListDto) {
    const { name, boardId } = createListDto;

    await this.verifyBoardMembership(userId, boardId);

    // 보드가 존재하는지 확인
    const existingBoard = await this.boardRepository.findOne({
      where: { id: boardId },
    });
    if (!existingBoard) {
      throw new BadRequestException(MESSAGES_CONSTANT.LIST.COMMON.BOARD_NOT_FOUND);
    }

    // 트랜잭션 시작
    return await this.dataSource.transaction(async (transactionalEntityManager: EntityManager) => {
      try {
        // 보드 ID에서 마지막 리스트 찾음
        const lastList = await transactionalEntityManager.findOne(List, {
          where: { boardId },
          order: { position: LISTS_CONSTANT.ORDER.DESC },
        });
        const newPosition = this.calculateNewPosition(lastList);
        // 새로운 리스트 생성
        const list = transactionalEntityManager.create(List, {
          name,
          boardId,
          position: newPosition,
        });
        await transactionalEntityManager.save(List, list);

        delete list.deletedAt;

        return list;
      } catch (error) {
        throw new InternalServerErrorException(MESSAGES_CONSTANT.LIST.CREATE_LIST.FAILED);
      }
    });
  }
  //리스트 수정(이름)
  async update(id: number, userId, updateListDto: UpdateListDto) {
    const listToUpdate = await this.listRepository.findOne({ where: { id, deletedAt: null } });
    if (!listToUpdate) {
      throw new NotFoundException(MESSAGES_CONSTANT.LIST.COMMON.LIST_NOT_FOUND);
    }
    await this.verifyBoardMembership(userId, listToUpdate.boardId);

    Object.assign(listToUpdate, updateListDto);

    const list = await this.listRepository.save(listToUpdate);
    return list;
  }
  //리스트 삭제
  async remove(userId: number, id: number) {
    const listToDelete = await this.listRepository.findOneBy({ id });

    if (!listToDelete) {
      throw new NotFoundException(MESSAGES_CONSTANT.LIST.COMMON.LIST_NOT_FOUND);
    }

    await this.verifyBoardMembership(userId, listToDelete.boardId);

    const list = await this.listRepository.softRemove(listToDelete);
    return list;
  }
  //리스트 순서 변경
  async updateOrder(userId, id: number, updateListOrderDto: UpdateListOrderDto) {
    const { position } = updateListOrderDto;
    return await this.dataSource.transaction(async (transactionalEntityManager: EntityManager) => {
      // 리스트 id를 받아 리스트 정보를 가져오기
      const listToUpdateOrder = await transactionalEntityManager.findOne(List, { where: { id } });
      if (!listToUpdateOrder) {
        throw new NotFoundException(MESSAGES_CONSTANT.LIST.COMMON.LIST_NOT_FOUND);
      }
      await this.verifyBoardMembership(userId, listToUpdateOrder.boardId);

      // 리스트가 속한 보드의 정보를 가져오기
      const board = await transactionalEntityManager.findOne(Board, {
        where: { id: listToUpdateOrder.boardId },
        relations: ['lists'],
      });
      if (!board) {
        throw new NotFoundException(MESSAGES_CONSTANT.LIST.COMMON.BOARD_NOT_FOUND);
      }

      // 보드의 모든 리스트들을 가져오기
      const listsInBoard = board.lists;
      listsInBoard.sort((a: List, b: List): number => a.position - b.position);

      const listArrayLength = listsInBoard.length;
      if (position >= listArrayLength) {
        throw new BadRequestException(MESSAGES_CONSTANT.LIST.COMMON.INVALID_POSITION);
      }
      // 바꾸려는 위치의 리스트의 position값
      const targetPosition = listsInBoard[position].position;
      console.log(targetPosition);
      // 바꾸는 위치 이전 포지션 값
      const previousTargetPosition = listsInBoard[position - 1]?.position;

      // 포지션 계산
      const newPosition = this.calculateNewPositionBetween(
        previousTargetPosition,
        targetPosition,
        position === listsInBoard.length - 1
      );

      // 포지션 계산
      // const newPosition =
      //   position + 1 == listArrayLangth
      //     ? new Decimal(previousTargetPosition).plus(new Decimal(Math.random()).times(20000)).toNumber()
      //     : previousTargetPosition
      //       ? new Decimal(new Decimal(targetPosition).minus(previousTargetPosition))
      //           .times(Math.random())
      //           .plus(previousTargetPosition)
      //           .toNumber()
      //       : new Decimal(targetPosition).times(Math.random()).toNumber();

      // 리스트의 position 업데이트
      listToUpdateOrder.position = newPosition;

      const updatedList = await transactionalEntityManager.save(List, listToUpdateOrder);

      return updatedList;
    });
  }
}
