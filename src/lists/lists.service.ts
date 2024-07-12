import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { List } from './entities/list.entity';
import { Board } from '../board/entities/board.entity';

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
  async updateOrder(id: number) {
    // updateListDto: UpdateListDto
    //보드id를 받아서 순차적으로 리스트 만들기
    const listToUpdateOrder = await this.listRepository.findOneBy({ id });
    if (!listToUpdateOrder) {
      throw new NotFoundException('리스트를 찾을 수 없습니다.');
    }
    //리스트에 있는 보드id를 받아서 보스안에 있는 리스트 추출
    const allListsInBoard = await this.boardRepository.findOne({
      where: { id: listToUpdateOrder.boardId },
      relations: ['lists'],
    });

    const listsArray = allListsInBoard.lists;
    // console.log('listsArray', listsArray);

    const index = 0;
    const add = listsArray[index];
    console.log('add', add);

    // 보드
    return add; // 이러면 인덱스가 나옴
    // Object.assign(listToUpdate, updateListDto);

    // const list = await this.listRepository.save(listToUpdate);

    // return list;
  }
}
