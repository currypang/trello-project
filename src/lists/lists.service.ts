import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { List } from './entities/list.entity';
import { Board } from '../board/entities/board.entity';
import { UpdateListOrderDto } from './dto/update-list-order.dto';

@Injectable()
export class ListsService {
  constructor(
    @InjectRepository(List)
    private readonly listRepository: Repository<List>,
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>
  ) {}

  //리스트 생성
  async create(createListDto: CreateListDto) {
    const { name, boardId } = createListDto;

    // 보드가 존재하는지 확인
    const existingBoard = await this.boardRepository.findOne({
      where: { id: boardId },
    });
    if (!existingBoard) {
      throw new BadRequestException('없는 보드입니다.');
    }

    // 트랜잭션 시작
    return await this.listRepository.manager.transaction(async (transactionalEntityManager) => {
      // 보드 ID에서 마지막 리스트 찾음
      const lastList = await transactionalEntityManager.findOne(List, {
        where: { boardId },
        order: { position: 'DESC' },
      });

      // 리스트 위치 지정
      const newPosition = lastList
        ? lastList.position + Math.floor(Math.random() * 10000)
        : Math.floor(Math.random() * 1000);

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
  async update(id: number, updateListDto: UpdateListDto) {
    const listToUpdate = await this.listRepository.findOneBy({ id });

    if (!listToUpdate) {
      return;
    }

    Object.assign(listToUpdate, updateListDto);

    const list = await this.listRepository.save(listToUpdate);

    return list;
  }
  //리스트 삭제
  async remove(id: number) {
    const listToDelete = await this.listRepository.findOneBy({ id });

    if (!listToDelete) {
      throw new NotFoundException('리스트를 찾을 수 없습니다.');
    }
    listToDelete.deletedAt = new Date();

    const list = await this.listRepository.save(listToDelete);
    return list;
  }
  //리스트 순서 변경
  async updateOrder(id: number, updateListOrderDto: UpdateListOrderDto) {
    const { position } = updateListOrderDto;
    // 리스트 id를 받아 리스트 정보를 가져오기
    const listToUpdateOrder = await this.listRepository.findOneBy({ id });
    if (!listToUpdateOrder) {
      throw new NotFoundException('리스트를 찾을 수 없습니다.');
    }

    // 리스트가 속한 보드의 정보를 가져오기
    const board = await this.boardRepository.findOne({
      where: { id: listToUpdateOrder.boardId },
      relations: ['lists'],
    });
    if (!board) {
      throw new NotFoundException('보드를 찾을 수 없습니다.');
    }
    // 보드의 모든 리스트들을 가져오기
    const listsInBoard = board.lists;
    listsInBoard.sort((a: List, b: List): number => a.position - b.position);

    //바꾸려는 위치의 리스트의 position값
    const targetPosition = listsInBoard[position].position;
    //바꾸는 위치 이전 포지션 값
    const previousTargetPosition = listsInBoard[position - 1]?.position;

    //포지션 계산
    const newPosition = !previousTargetPosition
      ? Math.trunc(targetPosition * Math.random())
      : targetPosition - previousTargetPosition < 2000
        ? previousTargetPosition + (targetPosition - previousTargetPosition) * Math.random() //데시멀 사용
        : Math.trunc(previousTargetPosition + (targetPosition - previousTargetPosition) * Math.random());

    // 리스트의 position 업데이트
    listToUpdateOrder.position = newPosition;

    Object.assign(listToUpdateOrder, { position: newPosition });

    const updatedList = await this.listRepository.save(listToUpdateOrder);
    return updatedList;
  }
}
