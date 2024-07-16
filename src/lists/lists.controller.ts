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
} from '@nestjs/common';
import { ListsService } from './lists.service';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UpdateListOrderDto } from './dto/update-list-order.dto';
import { MESSAGES_CONSTANT } from 'src/constants/messages.constants';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/user/types/roles.type';

@ApiTags('리스트')
@UseGuards(RolesGuard)
@Roles(Role.VerifiedUser)
@Controller('lists')
export class ListsController {
  constructor(private readonly listsService: ListsService) {}

  /**리스트 생성
   * @param createListDto
   * @returns
   */
  @ApiBearerAuth()
  @Post()
  async create(@Request() req, @Body() createListDto: CreateListDto) {
    const userId = req.user.id;
    const data = await this.listsService.create(userId, createListDto);

    return {
      statusCode: HttpStatus.CREATED,
      message: MESSAGES_CONSTANT.LIST.UPDATE_LIST.SUCCEED,
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
  @Patch(':listId')
  async update(@Request() req, @Param('listId', ParseIntPipe) listId: number, @Body() updateListDto: UpdateListDto) {
    const userId = req.user.id;
    const data = await this.listsService.update(listId, userId, updateListDto);

    return {
      statusCode: HttpStatus.OK,
      message: MESSAGES_CONSTANT.LIST.UPDATE_LIST.SUCCEED,
      data,
    };
  }
  /**
   * 리스트 삭제
   * @param listId
   * @returns
   */
  @ApiBearerAuth()
  @Delete(':listId')
  async remove(@Request() req, @Param('listId', ParseIntPipe) listId: number) {
    const userId = req.user.id;
    const data = await this.listsService.remove(userId, listId);
    return {
      statusCode: HttpStatus.OK,
      message: MESSAGES_CONSTANT.LIST.DELETE_LIST.SUCCEED,
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
  @Patch(':listId/order')
  async updateOrder(
    @Request() req,
    @Param('listId', ParseIntPipe) listId: number,
    @Body() updateListOrderDto: UpdateListOrderDto
  ) {
    const userId = req.user.id;
    const data = await this.listsService.updateOrder(userId, listId, updateListOrderDto);
    return {
      statusCode: HttpStatus.OK,
      message: MESSAGES_CONSTANT.LIST.UPDATE_ORDER.SUCCEED,
      data,
    };
  }
}
