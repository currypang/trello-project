import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards, Request, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dtos/sign-up.dto';
import { SignInDto } from './dtos/sign-in.dto';

import { ApiTags } from '@nestjs/swagger';
import { MESSAGES_CONSTANT } from 'src/constants/messages.constants';
import { LocalAuthGuard } from './guards/local-auth.guard';
@ApiTags('인증')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * 회원가입
   * @param signUpDto
   * @returns
   */
  @Post('/signup')
  async signUp(@Body() signUpDto: SignUpDto) {
    const data = await this.authService.signUp(signUpDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: MESSAGES_CONSTANT.AUTH.SIGN_UP.SUCCEED,
      data,
    };
  }
  /**
   * 로그인
   * @param req
   * @param signInDto
   * @returns
   */
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post('/signin')
  signIn(@Request() req, @Body() signInDto: SignInDto) {
    const data = this.authService.signIn(req.user.id, req.user.email);

    return {
      statusCode: HttpStatus.OK,
      message: MESSAGES_CONSTANT.AUTH.SIGN_IN.SUCCEED,
      data,
    };
  }

  /**
   * 토큰 재발급
   * @param req
   * @param signInDto
   * @returns
   */
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  async refresh(@Headers('authorization') refreshToken: string) {
    const tokens = await this.authService.refreshTokens(refreshToken);
    return {
      statusCode: HttpStatus.OK,
      message: MESSAGES_CONSTANT.AUTH.REFRESH_TOKEN.SUCCEED,
      data: tokens,
    };
  }
}
