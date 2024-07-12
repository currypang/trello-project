import { BadRequestException, Injectable } from '@nestjs/common';
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
      return list;
    });
  }
  findAll() {
    return `This action returns all lists`;
  }

  findOne(id: number) {
    return `This action returns a #${id} list`;
  }

  update(id: number, updateListDto: UpdateListDto) {
    return `This action updates a #${id} list`;
  }

  remove(id: number) {
    return `This action removes a #${id} list`;
  }
}
