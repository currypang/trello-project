import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from './entities/board.entity';
import { DataSource, In, Like, Repository } from 'typeorm';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { MESSAGES_CONSTANT } from 'src/constants/messages.constants';
import { BOARD_CONSTANT } from 'src/constants/board.constants';
import { BoardMembers } from './entities/board-member.entity';
import { FindAllBoardDto } from './dto/find-all-board.dto';
import _ from 'lodash';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,
    @InjectRepository(BoardMembers)
    private readonly boardMemberRepository: Repository<BoardMembers>,
    private dataSource: DataSource
  ) {}

  async create(userId: number, createBoardDto: CreateBoardDto) {
    const { name, background_color } = createBoardDto;
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const board = this.boardRepository.create(_.assign({ ownerId: userId }, { name, background_color }));
      await queryRunner.manager.save(board);
      const member = this.boardMemberRepository.create(_.assign({ userId }, { boardId: board.id }));
      await queryRunner.manager.save(member);
      await queryRunner.commitTransaction();
      return board;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(MESSAGES_CONSTANT.BOARD.CREATE_BOARD.INTERNAL_ERROR);
    } finally {
      await queryRunner.release();
    }
  }

  async findAll({ keyword }: FindAllBoardDto, userId: number) {
    const existMember = await this.boardMemberRepository.find({
      where: { userId: userId },
    });
    const boardsId = existMember.map((member) => member.boardId);
    const boards = await this.boardRepository.find({
      where: {
        id: In(boardsId),
        ...(keyword && { name: Like(`%${keyword}%`) }),
      },
      order: { id: BOARD_CONSTANT.ORDER.DESC },
    });
    if (boards.length === 0) {
      throw new NotFoundException(MESSAGES_CONSTANT.BOARD.FIND_ALL_BOARD.NOT_FOUND);
    }
    return boards;
  }

  async findOne(id: number, userId: number) {
    const board = await this.boardRepository.findOne({
      relations: {
        members: true,
        lists: {
          cards: true,
        },
      },
      where: {
        id,
        members: {
          userId,
        },
      },
    });
    if (!board) {
      throw new NotFoundException(MESSAGES_CONSTANT.BOARD.FIND_DETAIL_BOARD.NOT_FOUND);
    }
    return board;
  }

  async update(id: number, updateBoardDto: UpdateBoardDto, userId: number) {
    const board = await this.boardRepository.findOne({
      relations: {
        members: true,
      },
      where: {
        id,
        members: {
          userId,
        },
      },
    });
    if (!board) {
      throw new NotFoundException(MESSAGES_CONSTANT.BOARD.UPDATE_BOARD.NOT_FOUND);
    }

    const newBoard = {
      ...board,
      ...updateBoardDto,
    };
    const data = await this.boardRepository.save(newBoard);
    return data;
  }

  async delete(id: number, userId: number) {
    const board = await this.boardRepository.findOne({
      where: { id, ownerId: userId },
    });
    if (!board) {
      throw new NotFoundException(MESSAGES_CONSTANT.BOARD.DELETE_BOARD.NOT_FOUND);
    }

    if (board) {
      return this.boardRepository.softDelete({ id });
    }
  }
}
