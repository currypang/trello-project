import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from './entities/board.entity';
import { Repository } from 'typeorm';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { MESSAGES_CONSTANT } from 'src/activity/constants/messages.constants';

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

    async findAll(){
        const boards = await this.boardRepository.find({
            order:{
                id:'DESC'
            }
        })
        return boards
    }

    async findOne(id:number){
        const board = await this.boardRepository.findOne({
            where: {id},
            //relations:{} 추후 카드와 리스트가져오기위해 주석처리함
        })
        if(!board){
            throw new NotFoundException(MESSAGES_CONSTANT.BOARD.FIND_DETAIL_BOARD.NOT_FOUND)
        }
        return board
    }

    async update(id:number, updateBoardDto:UpdateBoardDto){
        const board = await this.boardRepository.findOne({
            where:{id}
        })
        if(!board){
            throw new NotFoundException(MESSAGES_CONSTANT.BOARD.UPDATE_BOARD.NOT_FOUND)
        }
        
        const newboard = {
            ...board,
            ...updateBoardDto
        }


        const  data = await this.boardRepository.save(newboard)
        return data
    }
    
    async delete( id: number){
        const board = await this.boardRepository.findOne({
            where: {id}
        })
        if(!board){
            throw new NotFoundException(MESSAGES_CONSTANT.BOARD.DELETE_BOARD.NOT_FOUND)
        }

        if(board){
             return this.boardRepository.softDelete({id})
            
        }
    }
}
