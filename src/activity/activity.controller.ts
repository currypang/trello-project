import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';

@Controller('activity')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @UseGuards(JwtAuthGuard)
  @Post('cards/:cardId')
  create(@Body() createActivityDto: CreateActivityDto, @Request() req, @Param('cardId') cardId: string) {
    return this.activityService.create(createActivityDto, req.user.id, +cardId);
  }

  @Get('cards/:cardId')
  findAll(@Param('cardId') cardId: string) {
    return this.activityService.findAll(+cardId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.activityService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':activityId')
  update(@Param('activityId') id: string, @Body() updateActivityDto: UpdateActivityDto, @Request() req) {
    return this.activityService.update(+id, updateActivityDto, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':activityId')
  remove(@Param('activityId') id: string, @Request() req) {
    return this.activityService.remove(+id, req.user.id);
  }
}
