import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from './entities/board.entity';
import { DataSource, Like, Repository } from 'typeorm';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { MESSAGES_CONSTANT } from 'src/constants/messages.constants';
import { BOARD_CONSTANT } from 'src/constants/board.constants';
import { BoardMembers } from './entities/board-member.entity';
import { FindAllBoardDto } from './dto/find-all-board.dto';

@Injectable()
export class BoardService {
    constructor(
        @InjectRepository(Board)
        private readonly boardRepository: Repository<Board>,
        @InjectRepository(BoardMembers) 
        private readonly boardMemberRepository: Repository<BoardMembers>,
        private dataSource:DataSource
    ){}

    async create(userId:number,createBoardDto:CreateBoardDto){
        const {name, background_color} = createBoardDto;
        const queryRunner = this.dataSource.createQueryRunner()
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try{
        const board = this.boardRepository.create({
            name:name,
            background_color:background_color,
            ownerId: userId
        })
        await queryRunner.manager.save(board)
        const member = this.boardMemberRepository.create({
            userId,
            boardId:board.id
        })
        queryRunner.manager.save(member)
        await queryRunner.commitTransaction();
        return board
        } catch(error){
            await queryRunner.rollbackTransaction();
            throw new InternalServerErrorException('트랜잭션 실패')
        } finally{
            await queryRunner.release();
        }
    }

    async findAll({keyword} : FindAllBoardDto,userId:number){
        const existMember = await this.boardMemberRepository.find({
            where:{userId: userId}
        })
        const boards = await this.boardRepository.find({
            where:{...(keyword && {name:Like(`%${keyword}%`)})},
            order:{
                id: BOARD_CONSTANT.ORDER.DESC 
            },
        })
        const boardsId = existMember.map((member)=> {
            if (member.userId === userId){
                return member.boardId
            }
        })
        const newBoards = boards.filter((board) => {
            if(boardsId.includes(board.id)){
                return board
            }
        })
        if(newBoards.length === 0){
            throw new NotFoundException('사용중인 보드가 없습니다.')
        }
        return newBoards
    }

    async findOne(id:number, userId:number){
        const board = await this.boardRepository.findOne({
            relations:{members: true},
            where: {id, members:{
                userId:userId
            }},
        })
        if(!board){
            throw new NotFoundException(MESSAGES_CONSTANT.BOARD.FIND_DETAIL_BOARD.NOT_FOUND)
        }
        return board
    }

    async update(id:number,updateBoardDto:UpdateBoardDto,userId:number ){
        
        const board = await this.boardRepository.findOne({
            relations: {
                members: true
            },
            where:{id, members:{
                userId:userId
            }}
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
    
    async delete( id: number, userId:number){
        const board = await this.boardRepository.findOne({
            where: {id, ownerId:userId}
        })
        if(!board){
            throw new NotFoundException(MESSAGES_CONSTANT.BOARD.DELETE_BOARD.NOT_FOUND)
        }

        if(board){
             return this.boardRepository.softDelete({id})
            
        }
    }
}
