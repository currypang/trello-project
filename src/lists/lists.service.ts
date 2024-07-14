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

    // 리스트가 속한 보드의 모든 리스트들을 가져오기
    const allListsInBoard = await (
      await this.boardRepository.findOne({
        where: { id: listToUpdateOrder.boardId },
        relations: ['lists'],
      })
    ).lists;
    //바꾸려는 위치의 리스트의 position값
    const indexElement = allListsInBoard[position].position;
    const currentIndexPosition = listToUpdateOrder.position;
    // const add = listsArray[index];
    console.log('indexElement', indexElement);
    console.log('currentIndexPosition', currentIndexPosition);

    //해당 보드의 deletedAt이 값이 없는 애들의 갯수 파악
    //가상의 인덱스 위치잡기 +
    // const index = allListsInBoard[position], allListsInBoard[id];

    return;
  }
}
