import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SignUpDto } from './dtos/sign-up.dto';
import { SignInDto } from './dtos/sign-in.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Repository } from 'typeorm';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        JwtService,
        ConfigService,
        {
          provide: LocalAuthGuard,
          useValue: {
            canActivate: jest.fn(() => true),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  describe('회원가입', () => {
    it('새로운 유저를 성공적으로 회원가입 시킵니다.', async () => {
      const signUpDto: SignUpDto = {
        email: 'test@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!',
        username: 'testuser',
      };

      jest.spyOn(service, 'signUp').mockResolvedValue({ email: signUpDto.email });

      const result = await controller.signUp(signUpDto);
      expect(result).toEqual({
        statusCode: 201,
        message: '회원가입에 성공했습니다.',
        data: { email: signUpDto.email },
      });
    });
  });

  describe('로그인', () => {
    it('사용자를 성공적으로 로그인 시킵니다.', async () => {
      const signInDto: SignInDto = {
        email: 'test@example.com',
        password: 'Password123!',
      };

      const req = { user: { id: 1, email: 'test@example.com' } };

      jest.spyOn(service, 'signIn').mockReturnValue({
        accessToken: 'testToken',
        refreshToken: 'testToken',
      });

      const result = await controller.signIn(req, signInDto);
      expect(result).toEqual({
        statusCode: 200,
        message: '로그인에 성공했습니다.',
        data: {
          accessToken: 'testToken',
          refreshToken: 'testToken',
        },
      });
    });
  });

  describe('토큰 재발급', () => {
    it('토큰을 성공적으로 재발급합니다.', async () => {
      const refreshToken = 'Bearer testRefreshToken';

      jest.spyOn(service, 'refreshTokens').mockResolvedValue({
        accessToken: 'newTestToken',
        refreshToken: 'newTestToken',
      });

      const result = await controller.refresh(refreshToken);
      expect(result).toEqual({
        statusCode: 200,
        message: '토큰이 성공적으로 발급 되었습니다.',
        data: {
          accessToken: 'newTestToken',
          refreshToken: 'newTestToken',
        },
      });
    });
  });
});
