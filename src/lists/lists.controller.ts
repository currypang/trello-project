import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  UseGuards,
  ParseIntPipe,
  Request,
  Req,
} from '@nestjs/common';
import { ListsService } from './lists.service';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@ApiTags('리스트')
@Controller('lists')
export class ListsController {
  constructor(private readonly listsService: ListsService) {}

  /**리스트 생성
   * @param createListDto
   * @returns
   */
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Body() createListDto: CreateListDto) {
    const data = await this.listsService.create(createListDto);

    return {
      statusCode: HttpStatus.CREATED,
      message: '리스트 생성에 성공했습니다.',
      data,
    };
  }
  /**
   * 리스트 수정
<<<<<<< HEAD
<<<<<<< Updated upstream
   * @param id
   * @returns
   */
  @Get()
  findAll() {
    return this.listsService.findAll();
=======
   * @param listId
   * @param updateListDto
   * @returns
   */
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
=======
   * @param listId
   * @returns
   */
  @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
>>>>>>> 4a7ad774819fd7d948164a0701b4c6caa85ec399
  @Patch(':listId')
  async update(@Param('listId', ParseIntPipe) listId: number, @Body() updateListDto: UpdateListDto) {
    const data = await this.listsService.update(listId, updateListDto);

    return {
      statusCode: HttpStatus.OK,
      message: '리스트 수정에 성공했습니다.',
      data,
    };
<<<<<<< HEAD
>>>>>>> Stashed changes
=======
>>>>>>> 4a7ad774819fd7d948164a0701b4c6caa85ec399
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.listsService.remove(+id);
  // }
}
