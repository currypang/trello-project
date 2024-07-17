import { Body, Controller, Delete, Get, HttpStatus, Patch, Request, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UpdateUserPasswordDto } from './dtos/update-user-password.dto';
import { AuthService } from 'src/auth/auth.service';
import { DeleteUserDto } from './dtos/delete-user.dto';
import { MESSAGES_CONSTANT } from 'src/constants/messages.constants';
import { EmailService } from 'src/email/email.service';
// import { RolesGuard } from 'src/auth/guards/roles.guard';
// import { Roles } from 'src/auth/decorators/roles.decorator';
// import { Role } from './types/roles.type';

@ApiTags('유저')
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly emailService: EmailService,
    private readonly authService: AuthService
  ) {}

  @ApiBearerAuth()
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
  @Delete('/me')
  async deleteUser(@Request() req, @Body() deleteUserDto: DeleteUserDto) {
    const userId = req.user.id;
    const result = await this.authService.deleteUser(userId, deleteUserDto);

    return {
      statusCode: HttpStatus.OK,
      message: result.message,
    };
  }

  @ApiBearerAuth()
  @Get('/notification')
  async getNotification(@Request() req) {
    const userId = req.user.id;
    const data = await this.userService.getNotification(userId);
    return {
      statusCode: HttpStatus.OK,
      message: MESSAGES_CONSTANT.USER.CONTROLLER.GET_NOTIFICATION,
      data,
    };
  }

  @ApiBearerAuth()
  @Delete('/notification')
  async deleteNotification(@Request() req) {
    const userId = req.user.id;
    await this.userService.deleteNotification(userId);

    return {
      statusCode: HttpStatus.OK,
      message: MESSAGES_CONSTANT.USER.CONTROLLER.DELETE_NOTIFICATION,
    };
  }
}
