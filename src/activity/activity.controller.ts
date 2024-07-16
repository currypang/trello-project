import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards, HttpStatus } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { MESSAGES_CONSTANT } from 'src/constants/messages.constants';

import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';

@Controller('activity')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @UseGuards(JwtAuthGuard)
  @Post('cards/:cardId')
  async create(@Body() createActivityDto: CreateActivityDto, @Request() req, @Param('cardId') cardId: string) {
    const data = await this.activityService.create(createActivityDto, req.user.id, +cardId);
    return{
      statusCode:HttpStatus.CREATED,
      message:MESSAGES_CONSTANT.ACTIVITY.CREATE_ACTIVITY.SUCCEED,
      data
    }   
  }

  @Get('cards/:cardId')
  async findAll(@Param('cardId') cardId: string) {
    const data = await this.activityService.findAll(+cardId);

    return{
      statusCode:HttpStatus.OK,
      message:MESSAGES_CONSTANT.ACTIVITY.READ_ACTIVITY.SUCCEED,
      data
    }   
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.activityService.findOne(+id);

    return{
      statusCode:HttpStatus.OK,
      message:MESSAGES_CONSTANT.ACTIVITY.READ_ACTIVITY.SUCCEED,
      data
    }   
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':activityId')
  async update(@Param('activityId') id: string, @Body() updateActivityDto: UpdateActivityDto, @Request() req) {
    await this.activityService.update(+id, updateActivityDto, req.user.id);
    const data = await this.activityService.findOne(+id);

    return{
      statusCode:HttpStatus.OK,
      message:MESSAGES_CONSTANT.ACTIVITY.UPDATE_ACTIVITY.SUCCEED,
      data
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':activityId')
  async remove(@Param('activityId') id: string, @Request() req) {
    const data = await this.activityService.remove(+id, req.user.id);

    return{
      statusCode:HttpStatus.OK,
      message:MESSAGES_CONSTANT.ACTIVITY.DELETE_ACTIVITY.SUCCEED,
      data
    }
  }
}
