import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards, Request, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dtos/sign-up.dto';
import { SignInDto } from './dtos/sign-in.dto';

import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
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
  @ApiOperation({ summary: '회원가입' })
  @ApiResponse({ status: HttpStatus.CREATED, description: '회원가입 성공' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: '회원가입 실패' })
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
  @ApiOperation({ summary: '로그인' })
  @ApiResponse({ status: HttpStatus.OK, description: '로그인 성공' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: '로그인 실패' })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
  @ApiOperation({ summary: '토큰 재발급' })
  @ApiResponse({ status: HttpStatus.OK, description: '토큰 재발급 성공' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: '토큰 재발급 실패' })
  async refresh(@Headers('authorization') refreshToken: string) {
    const tokens = await this.authService.refreshTokens(refreshToken);
    return {
      statusCode: HttpStatus.OK,
      message: MESSAGES_CONSTANT.AUTH.REFRESH_TOKEN.SUCCEED,
      data: tokens,
    };
  }
}
