import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { BoardService } from './board.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('보드 정보')
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
}
