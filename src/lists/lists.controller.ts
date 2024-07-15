import { Controller, Post, Body, Patch, Param, Delete, HttpStatus, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ListsService } from './lists.service';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { UpdateListOrderDto } from './dto/update-list-order.dto';

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
   * @param listId
   * @param updateListDto
   * @returns
   */
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Patch(':listId')
  async update(@Param('listId', ParseIntPipe) listId: number, @Body() updateListDto: UpdateListDto) {
    const data = await this.listsService.update(listId, updateListDto);

    return {
      statusCode: HttpStatus.OK,
      message: '리스트 수정에 성공했습니다.',
      data,
    };
  }
  /**
   * 리스트 삭제
   * @param listId
   * @returns
   */
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Delete(':listId')
  async remove(@Param('listId', ParseIntPipe) listId: number) {
    const data = await this.listsService.remove(listId);
    return {
      statusCode: HttpStatus.OK,
      message: '리스트 삭제에 성공했습니다.',
      data,
    };
  }
  /**
   * 리스트 순서 변경
   * @param listId
   * @param UpdateListDto
   * @returns
   */
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Patch(':listId/order')
  async updateOrder(@Param('listId', ParseIntPipe) listId: number, @Body() updateListOrderDto: UpdateListOrderDto) {
    const data = await this.listsService.updateOrder(listId, updateListOrderDto);
    return {
      statusCode: HttpStatus.OK,
      message: '리스트 순서 변경에 성공했습니다.',
      data,
    };
  }
}
