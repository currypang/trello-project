import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards, Request, Headers, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dtos/sign-up.dto';
import { SignInDto } from './dtos/sign-in.dto';

import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MESSAGES_CONSTANT } from 'src/constants/messages.constants';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { EmailService } from 'src/email/email.service';
import { SendEmailDto } from './dtos/send-email.dto';
import { VerifyEmailQueryDto } from './dtos/verify-email.query.dto';
@ApiTags('인증')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly emailService: EmailService
  ) {}

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

  // 이메일 인증
  @ApiBearerAuth()
  @Post('/email')
  @UseGuards(JwtAuthGuard)
  async sendEmail(@Request() req, @Body() sendEmailDto: SendEmailDto) {
    const userId = req.user.id;
    const email = sendEmailDto.email;
    await this.emailService.sendMemberJoinVerification(email, userId);
    return {
      statusCode: HttpStatus.OK,
      message: MESSAGES_CONSTANT.AUTH.SEND_EMAIL.SUCCEED,
    };
  }
  // 이메일 인증 링크 확인
  @Post('/email/email-verify')
  async verifyEmail(@Query() query: VerifyEmailQueryDto) {
    await this.emailService.verifyEmail(query);
    return {
      statusCode: HttpStatus.OK,
      message: MESSAGES_CONSTANT.AUTH.VERIFY_EMAIL.SUCCEED,
    };
  }
}
