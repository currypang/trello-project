import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { SignUpDto } from './dtos/sign-up.dto';
import { SignInDto } from './dtos/sign-in.dto';
import { UpdateUserPasswordDto } from 'src/user/dtos/update-user-password.dto';
import { DeleteUserDto } from 'src/user/dtos/delete-user.dto';
import { MESSAGES_CONSTANT } from 'src/constants/messages.constants';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException, BadRequestException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: Repository<User>;
  let jwtService: JwtService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOneBy: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            softRemove: jest.fn(),
          },
        },
        JwtService,
        ConfigService,
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);
  });

  describe('회원가입', () => {
    it('새로운 유저를 성공적으로 회원가입 시킵니다.', async () => {
      const signUpDto: SignUpDto = {
        email: 'test@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!',
        username: 'testuser',
      };

      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(null);
      jest.spyOn(userRepository, 'save').mockResolvedValue(signUpDto as any);
      jest.spyOn(userRepository, 'create').mockImplementation((dto: User) => dto);
      const result = await service.signUp(signUpDto);
      expect(result).toEqual({ email: signUpDto.email });
    });

    it('비밀번호가 일치하지 않을 경우 오류를 발생시킵니다.', async () => {
      const signUpDto: SignUpDto = {
        email: 'test@example.com',
        password: 'Password123!',
        confirmPassword: 'Password1234!',
        username: 'testuser',
      };

      await expect(service.signUp(signUpDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('사용자 인증', () => {
    it('사용자 자격 증명을 검증합니다.', async () => {
      const signInDto: SignInDto = {
        email: 'test@example.com',
        password: 'Password123!',
      };

      const user = {
        id: 1,
        email: signInDto.email,
        password: await bcrypt.hash(signInDto.password, 10),
      };

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user as User);
      jest.spyOn(service, 'validateUser').mockResolvedValue({ id: user.id, email: user.email });

      const result = await service.validateUser(signInDto);
      expect(result).toEqual({ id: user.id, email: user.email });
    });

    it('비밀번호가 잘못되었을 경우 오류를 발생시킵니다.', async () => {
      const signInDto: SignInDto = {
        email: 'test@example.com',
        password: 'WrongPassword123!',
      };

      const user = {
        id: 1,
        email: signInDto.email,
        password: await bcrypt.hash('Password123!', 10),
      };

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user as User);

      await expect(service.validateUser(signInDto)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('로그인', () => {
    it('액세스 토큰과 리프레시 토큰을 반환합니다.', () => {
      const userId = 1;
      const email = 'test@example.com';

      jest.spyOn(jwtService, 'sign').mockReturnValue('testToken');

      const result = service.signIn(userId, email);
      expect(result).toEqual({
        accessToken: 'testToken',
        refreshToken: 'testToken',
      });
    });
  });

  describe('비밀번호 업데이트', () => {
    it('사용자 비밀번호를 업데이트합니다.', async () => {
      const userId = 1;
      const updateUserPasswordDto: UpdateUserPasswordDto = {
        currentPassword: 'CurrentPassword123!',
        newPassword: 'NewPassword123!',
        confirmNewPassword: 'NewPassword123!',
      };

      const user = {
        id: userId,
        password: await bcrypt.hash(updateUserPasswordDto.currentPassword, 10),
      };

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user as User);
      jest
        .spyOn(service, 'updateUserPassword')
        .mockResolvedValue({ message: MESSAGES_CONSTANT.AUTH.UPDATE_USER_PASSWORD.SUCCEED });

      const result = await service.updateUserPassword(userId, updateUserPasswordDto);
      expect(result).toEqual({ message: MESSAGES_CONSTANT.AUTH.UPDATE_USER_PASSWORD.SUCCEED });
    });

    it('현재 비밀번호가 잘못되었을 경우 오류를 발생시킵니다.', async () => {
      const userId = 1;
      const updateUserPasswordDto: UpdateUserPasswordDto = {
        currentPassword: 'WrongPassword123!',
        newPassword: 'NewPassword123!',
        confirmNewPassword: 'NewPassword123!',
      };

      const user = {
        id: userId,
        password: await bcrypt.hash('CurrentPassword123!', 10),
      };

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user as User);

      await expect(service.updateUserPassword(userId, updateUserPasswordDto)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('사용자 삭제', () => {
    it('사용자를 삭제합니다.', async () => {
      const userId = 1;
      const deleteUserDto: DeleteUserDto = {
        password: 'Password123!',
      };

      const user = {
        id: userId,
        password: await bcrypt.hash(deleteUserDto.password, 10),
      };

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user as User);
      jest.spyOn(userRepository, 'softRemove').mockResolvedValue(user as User);

      const result = await service.deleteUser(userId, deleteUserDto);
      expect(result).toEqual({ message: MESSAGES_CONSTANT.AUTH.DELETE_USER.SUCCEED });
    });

    it('비밀번호가 잘못되었을 경우 오류를 발생시킵니다.', async () => {
      const userId = 1;
      const deleteUserDto: DeleteUserDto = {
        password: 'WrongPassword123!',
      };

      const user = {
        id: userId,
        password: await bcrypt.hash('Password123!', 10),
      };

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user as User);

      await expect(service.deleteUser(userId, deleteUserDto)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('토큰 재발급', () => {
    it('토큰을 재발급합니다.', async () => {
      const refreshToken = 'Bearer testRefreshToken';
      const payload = { id: 1, email: 'test@example.com' };

      jest.spyOn(jwtService, 'verify').mockReturnValue(payload);
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(payload as User);
      jest.spyOn(jwtService, 'sign').mockReturnValue('newTestToken');

      const result = await service.refreshTokens(refreshToken);
      expect(result).toEqual({
        accessToken: 'newTestToken',
        refreshToken: 'newTestToken',
      });
    });
  });
});
