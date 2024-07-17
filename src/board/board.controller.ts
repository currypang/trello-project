import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { BoardService } from './board.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UpdateBoardDto } from './dto/update-board.dto';
import { MESSAGES_CONSTANT } from 'src/constants/messages.constants';
import { InvitationService } from 'src/invitation/invitation.service';
import { FindAllBoardDto } from './dto/find-all-board.dto';
import { InviteDto } from './dto/invite-board.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from 'src/user/types/roles.type';
import { Roles } from 'src/auth/decorators/roles.decorator';

@ApiTags('보드')
@Controller('board')
export class BoardController {
  constructor(
    private readonly boardService: BoardService,
    private readonly inviteService: InvitationService
  ) {}

  /**
   * 보드 생성
   * @param createBoardDto
   * @param req
   * @returns
   */
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles(Role.VerifiedUser)
  @Post()
  async create(@Body() createBoardDto: CreateBoardDto, @Request() req) {
    const data = await this.boardService.create(req.user.id, createBoardDto);
    console.log(req.user);
    return {
      statusCode: HttpStatus.CREATED,
      message: MESSAGES_CONSTANT.BOARD.CREATE_BOARD.SUCCEED,
      data,
    };
  }

  /**
   * 보드 전체 조회
   * @returns
   */
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles(Role.VerifiedUser)
  @Get()
  async findAll(@Request() req, @Query() findAllBoardDto: FindAllBoardDto) {
    const userId = req.user.id;
    const data = await this.boardService.findAll(findAllBoardDto, userId);
    return {
      statusCode: HttpStatus.OK,
      message: MESSAGES_CONSTANT.BOARD.FIND_ALL_BOARD.SUCCEED,
      data,
    };
  }

  /**
   * 보드 상세조회
   * @param id
   * @returns
   */
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles(Role.VerifiedUser)
  @Get(':id')
  async findOne(@Request() req, @Param('id', ParseIntPipe) id: number) {
    const userId = req.user.id;
    const data = await this.boardService.findOne(id, userId);
    return {
      statusCode: HttpStatus.OK,
      message: MESSAGES_CONSTANT.BOARD.FIND_DETAIL_BOARD.SUCCEED,
      data,
    };
  }

  /**
   * 보드 수정
   * @param id
   * @param updateBoardDto
   * @returns
   */
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles(Role.VerifiedUser)
  @Patch(':id')
  async update(@Request() req, @Param('id', ParseIntPipe) id: number, @Body() updateBoardDto: UpdateBoardDto) {
    const userId = req.user.id;
    const data = await this.boardService.update(id, updateBoardDto, userId);
    return {
      statusCode: HttpStatus.OK,
      message: MESSAGES_CONSTANT.BOARD.UPDATE_BOARD.SUCCEED,
      data,
    };
  }

  /**
   * 보드 삭제
   * @param id
   * @returns
   */
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles(Role.VerifiedUser)
  @Delete(':id')
  async delete(@Request() req, @Param('id', ParseIntPipe) id: number) {
    const userId = req.user.id;
    await this.boardService.delete(id, userId);
    return {
      statusCode: HttpStatus.OK,
      message: MESSAGES_CONSTANT.BOARD.DELETE_BOARD.SUCCEED,
    };
  }

  /**
   * 보드초대
   * @param req
   * @param inviteDto
   * @returns
   */
  @ApiBearerAuth()
  @Post('/email')
  @UseGuards(RolesGuard)
  @Roles(Role.VerifiedUser)
  async sendEmail(@Request() req, @Body() inviteDto: InviteDto) {
    const userId = req.user.id;
    await this.inviteService.sendInvitieVertification(inviteDto.email, inviteDto.boardId, userId);
    return {
      statusCode: HttpStatus.OK,
      message: MESSAGES_CONSTANT.BOARD.SEND_EMAIL.SUCCEED,
    };
  }

  @Post('/email/verify')
  //@UseGuards(JwtAuthGuard)
  async inviteMember(@Query('inviteVerifyToken') query: string) {
    return this.inviteService.verifyInvite(query);
  }
}
