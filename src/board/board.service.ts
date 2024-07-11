import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from './entities/board.entity';
import { Repository } from 'typeorm';
import { CreateBoardDto } from './dto/create-board.dto';

@Injectable()
export class BoardService {
    constructor(
        @InjectRepository(Board)
        private readonly boardRepository: Repository<Board>
    ){}
    async create(createBoardDto:CreateBoardDto){
        const {name, background_color} = createBoardDto;
        const board = await this.boardRepository.save({
            name:name,
            background_color:background_color,
            // 추후 유저 생성되면 생성한 유저가 owner_id에 들어가게하기
        })
        return board
    }
}
