import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { List } from './entities/list.entity';
import { Board } from '../board/entities/board.entity';
import { UpdateListOrderDto } from './dto/update-list-order.dto';
import Decimal from 'decimal.js';
import { BoardMembers } from 'src/board/entities/board-member.entity';

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

  //리스트 생성
  async create(userId, createListDto: CreateListDto) {
    const { name, boardId } = createListDto;

    const BoardMember = await this.boardMembersRepository.findOne({ where: { userId } });
    const userBoardId = BoardMember.boardId;

    if (boardId !== userBoardId) {
      throw new ForbiddenException('보드에 가입된 유저가 아닙니다.');
    }

    // 보드가 존재하는지 확인
    const existingBoard = await this.boardRepository.findOne({
      where: { id: boardId },
    });
    if (!existingBoard) {
      throw new BadRequestException('없는 보드입니다.');
    }

    // 트랜잭션 시작
    return await this.dataSource.transaction(async (transactionalEntityManager: EntityManager) => {
      // 보드 ID에서 마지막 리스트 찾음
      const lastList = await transactionalEntityManager.findOne(List, {
        where: { boardId },
        order: { position: 'DESC' },
      });
      const newPosition = lastList
        ? new Decimal(lastList.position).plus(new Decimal(Math.random()).times(20000)).toNumber()
        : new Decimal(Math.random()).times(10000).toNumber();

      // 새로운 리스트 생성
      const list = transactionalEntityManager.create(List, {
        name,
        boardId,
        position: newPosition,
      });
      await transactionalEntityManager.save(List, list);

      delete list.deletedAt;

      return list;
    });
  }
  //리스트 수정(이름)
  async update(id: number, userId, updateListDto: UpdateListDto) {
    const listToUpdate = await this.listRepository.findOne({ where: { id, deletedAt: null } });
    if (!listToUpdate) {
      throw new NotFoundException('리스트를 찾을 수 없습니다.');
    }
    const BoardMember = await this.boardMembersRepository.findOne({ where: { userId } });
    const listBoardId = listToUpdate.boardId;
    const userBoardId = BoardMember.boardId;

    if (listBoardId !== userBoardId) {
      throw new ForbiddenException('보드에 가입된 유저가 아닙니다.');
    }

    Object.assign(listToUpdate, updateListDto);

    const list = await this.listRepository.save(listToUpdate);

    return list;
  }
  //리스트 삭제
  async remove(userId, id: number) {
    const listToDelete = await this.listRepository.findOneBy({ id });

    if (!listToDelete) {
      throw new NotFoundException('리스트를 찾을 수 없습니다.');
    }

    const BoardMember = await this.boardMembersRepository.findOne({ where: { userId } });
    const userBoardId = BoardMember.boardId;
    const listBoardId = listToDelete.boardId;

    if (listBoardId !== userBoardId) {
      throw new ForbiddenException('보드에 가입된 유저가 아닙니다.');
    }

    const list = await this.listRepository.softRemove(listToDelete);
    return list;
  }
  //리스트 순서 변경
  async updateOrder(id: number, updateListOrderDto: UpdateListOrderDto) {
    const { position } = updateListOrderDto;
    return await this.dataSource.transaction(async (transactionalEntityManager: EntityManager) => {
      // 리스트 id를 받아 리스트 정보를 가져오기
      const listToUpdateOrder = await transactionalEntityManager.findOne(List, { where: { id } });
      if (!listToUpdateOrder) {
        throw new NotFoundException('리스트를 찾을 수 없습니다.');
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
      if (position >= listArrayLangth) {
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
