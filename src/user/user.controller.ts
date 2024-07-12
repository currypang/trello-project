import { Body, Controller, Delete, Get, HttpStatus, Patch, Post, Query, Request, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UpdateUserPasswordDto } from './dtos/update-user-password.dto';
import { AuthService } from 'src/auth/auth.service';
import { DeleteUserDto } from './dtos/delete-user.dto';
import { MESSAGES_CONSTANT } from 'src/constants/messages.constants';
import { EmailService } from 'src/email/email.service';

@ApiTags('유저')
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly emailService: EmailService,
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
      message: MESSAGES_CONSTANT.USER.CONTROLLER.FIND_ME,
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

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete('/me')
  async deleteUser(@Request() req, @Body() deleteUserDto: DeleteUserDto) {
    const userId = req.user.id;
    const result = await this.authService.deleteUser(userId, deleteUserDto);

    return {
      statusCode: HttpStatus.OK,
      message: result.message,
    };
  }

  // 이메일 인증
  @Post('/email')
  @UseGuards(JwtAuthGuard)
  async sendEmail(@Request() req, @Body() { email }) {
    const userId = req.user.id;
    this.emailService.sendMemberJoinVerification(email, userId);
    return {
      statusCode: HttpStatus.OK,
      message: '이메일로 인증링크를 보냈습니다.',
    };
  }
  // 이메일 인증 링크 확인
  @Post('/email/email-verify')
  async verifyEmail(@Query() query) {
    this.emailService.verifyEmail(query);
    return {
      statusCode: HttpStatus.OK,
      message: '메일 인증이 완료되었습니다.',
    };
  }
}
