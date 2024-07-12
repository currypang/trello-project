import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from './entities/board.entity';
import { FindOptionsOrderValue, Repository } from 'typeorm';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { BOARD_CONSTANT } from 'src/constants/board.constants';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>
  ) {}

  async create(createBoardDto: CreateBoardDto) {
    const { name, background_color } = createBoardDto;
    const board = await this.boardRepository.save({
      name: name,
      background_color: background_color,
      // 추후 유저 생성되면 생성한 유저가 owner_id에 들어가게하기
    });
    return board;
  }

  async findAll() {
    const boards = await this.boardRepository.find({
      order: {
        id: BOARD_CONSTANT.ORDER.DESC as FindOptionsOrderValue,
      },
    });
    return boards;
  }

  async findOne(id: number) {
    const board = await this.boardRepository.findOne({
      where: { id },
      //relations:{} 추후 카드와 리스트가져오기위해 주석처리함
    });
    if (!board) {
      throw new NotFoundException('존재하지 않은 보드입니다.');
    }
    return board;
  }

  async update(id: number, updateBoardDto: UpdateBoardDto) {
    const board = await this.boardRepository.findOne({
      where: { id },
    });
    if (!board) {
      throw new NotFoundException('존재하지 않은 보드입니다');
    }

    const newboard = {
      ...board,
      ...updateBoardDto,
    };

    const data = await this.boardRepository.save(newboard);
    return data;
  }
}
