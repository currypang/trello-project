import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { List } from './entities/list.entity';

@Injectable()
export class ListsService {
  constructor(
    @InjectRepository(List)
    private readonly listReporitory: Repository<List>,
  ) {}

  async create(createListDto: CreateListDto) {
    const { name, boardId } = createListDto;

    const existedList = await this.listReporitory.findOneBy({
      name,
    });
    if (existedList) {
      throw new BadRequestException('이미 사용중인 리스트 이름이다.');
    }
    const lastList = await this.listReporitory.findOne({
      where: { boardId },
      order: { position: 'DESC' },
    });

    const newPosition = lastList
      ? lastList.position + Math.floor(Math.random() * 50000)
      : Math.floor(Math.random() * 10000);
    const list = await this.listReporitory.save({
      name,
      boardId,
      position: newPosition,
    });
    return list;
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
