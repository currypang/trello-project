import { Body, Controller, Get, HttpStatus, Patch, Request, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UpdateUserPasswordDto } from './dtos/update-user-password.dto';
import { AuthService } from 'src/auth/auth.service';

@ApiTags('유저')
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService
  ) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('/me')
  async findUserById(@Request() req) {
    const userId = req.user.id;
    const user = await this.userService.findUserById(userId);

    return {
      statusCode: HttpStatus.OK,
      message: '내 정보 조회에 성공했습니다.',
      data: user,
    };
  }
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch('/me')
  async updatePassword(@Request() req, @Body() updateUserPasswordDto: UpdateUserPasswordDto) {
    const userId = req.user.id;
    const result = await this.authService.updateUserPassword(userId, updateUserPasswordDto);
    return {
      statusCode: HttpStatus.OK,
      message: result.message,
    };
  }
}
