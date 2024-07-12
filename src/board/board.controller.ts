import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { BoardService } from './board.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { ApiTags } from '@nestjs/swagger';
import { UpdateBoardDto } from './dto/update-board.dto';
import { MESSAGES_CONSTANT } from 'src/activity/constants/messages.constants';

@ApiTags('보드')
@Controller('board')
export class BoardController {
    constructor(private readonly boardService:BoardService){}

    /**
     * 보드 생성
     * @param createBoardDto 
     * @returns 
     */
    @Post()
    async create(@Body() createBoardDto: CreateBoardDto){
        const data = await this.boardService.create(createBoardDto)
        return{
            statusCode:HttpStatus.CREATED,
            message:MESSAGES_CONSTANT.BOARD.CREATE_BOARD.SUCCEED,
            data
        }
    }

    /**
     * 보드 전체 조회
     * @returns 
     */
    @Get()
    async findAll(){
        const data = await this.boardService.findAll();

        return {
            statusCode:HttpStatus.OK,
            message:MESSAGES_CONSTANT.BOARD.FIND_ALL_BOARD.SUCCEED,
            data,
        }
    }

    /**
     * 보드 상세조회
     * @param id 
     * @returns 
     */
    @Get(':id')
    async findOne(@Param('id') id:number){
        const data = await this.boardService.findOne(id)
        return{
          statusCode:HttpStatus.OK,
          message: MESSAGES_CONSTANT.BOARD.FIND_DETAIL_BOARD.SUCCEED,
          data
        }
    }   

    /**
     * 보드 수정
     * @param id 
     * @param updateBoardDto 
     * @returns 
     */
    @Patch(':id')
    async update(@Param('id') id:number,
                 @Body() updateBoardDto:UpdateBoardDto
        ){
        const data = await this.boardService.update(id,updateBoardDto)
        return{
          statusCode:HttpStatus.OK,
          message:MESSAGES_CONSTANT.BOARD.UPDATE_BOARD.SUCCEED,
          data
        }
    }

    /**
     * 보드 삭제
     * @param id 
     * @returns 
     */
    @Delete(':id')
    async delete(@Param('id') id: number){
        const data = await this.boardService.delete(id)
        return {
            statusCode: HttpStatus.OK,
            message: MESSAGES_CONSTANT.BOARD.DELETE_BOARD.SUCCEED,
            data
        }
    }
}