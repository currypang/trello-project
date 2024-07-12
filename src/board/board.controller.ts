import { Body, Controller, Get, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { BoardService } from './board.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { ApiTags } from '@nestjs/swagger';
import { UpdateBoardDto } from './dto/update-board.dto';

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
            message:"보드 생성에 성공하였습니다",
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
            message:"보드 목록 조회에 성공했습니다",
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
          message:"보드 상세 조회에 성공했습니다",
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
          message:"보드 수정에 성공했습니다",
          data
        }
    }
}