import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { SignUpDto } from './dtos/sign-up.dto';
import * as bcrypt from 'bcrypt';
import _ from 'lodash';
import { SignInDto } from './dtos/sign-in.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UpdateUserPasswordDto } from 'src/user/dtos/update-user-password.dto';
import { DeleteUserDto } from 'src/user/dtos/delete-user.dto';
import { MESSAGES_CONSTANT } from 'src/constants/messages.constants';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService
  ) {}

  private async hashPassword(password: string): Promise<string> {
    try {
      return bcrypt.hash(password, 10);
    } catch (error) {
      throw new InternalServerErrorException('비밀번호 해싱 중 오류가 발생했습니다.');
    }
  }
  private async verifyPassword(inputPassword: string, password: string): Promise<void> {
    const isCurrentPasswordValid = bcrypt.compareSync(inputPassword, password);
    if (!isCurrentPasswordValid) {
      throw new UnauthorizedException(MESSAGES_CONSTANT.AUTH.SIGN_UP.NOT_MATCHED_PASSWORD);
    }
  }
  private generateTokens(payload: { id: number; email: string }) {
    try {
      const accessToken = this.jwtService.sign(payload);
      const refreshToken = this.jwtService.sign(payload, {
        secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
        expiresIn: this.configService.get<string>('REFRESH_TOKEN_EXPIRES'),
      });

      return { accessToken, refreshToken };
    } catch (error) {
      throw new InternalServerErrorException(MESSAGES_CONSTANT.AUTH.COMMON.HASH_ERROR);
    }
  }
  async signUp({ email, password, confirmPassword, username }: SignUpDto) {
    if (password !== confirmPassword) {
      throw new BadRequestException(MESSAGES_CONSTANT.AUTH.SIGN_UP.NOT_MATCHED_PASSWORD);
    }
    try {
      const existUser = await this.userRepository.findOneBy({ email });
      if (existUser) {
        throw new BadRequestException(MESSAGES_CONSTANT.AUTH.SIGN_UP.EXISTED_EMAIL);
      }

      const hashedPassword = await this.hashPassword(password);

      const user = this.userRepository.create({
        email,
        password: hashedPassword,
        username,
      });
      await this.userRepository.save(user);
      return { email: user.email };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(MESSAGES_CONSTANT.AUTH.SIGN_UP.FAILED);
    }
  }

  async validateUser({ email, password }: SignInDto) {
    try {
      const user = await this.userRepository.findOne({
        where: { email, deletedAt: null },
        select: { id: true, password: true, email: true },
      });
      if (!user) {
        return null;
      }
      await this.verifyPassword(password, user.password);
      return { id: user.id, email: user.email };
    } catch (error) {
      throw new UnauthorizedException(MESSAGES_CONSTANT.AUTH.STRATEGY.UNAUTHORIZED_ERROR);
    }
  }
  signIn(userId: number, email: string) {
    const payload = { id: userId, email };
    return this.generateTokens(payload);
  }

  async updateUserPassword(userId: number, updateUserPasswordDto: UpdateUserPasswordDto) {
    const { currentPassword, newPassword, confirmNewPassword } = updateUserPasswordDto;

    try {
      const user = await this.userRepository.findOne({
        where: { id: userId, deletedAt: null },
        select: { password: true },
      });

      if (!user) {
        throw new UnauthorizedException(MESSAGES_CONSTANT.AUTH.STRATEGY.UNAUTHORIZED);
      }

      await this.verifyPassword(currentPassword, user.password);

      if (newPassword !== confirmNewPassword) {
        throw new BadRequestException(MESSAGES_CONSTANT.AUTH.UPDATE_USER_PASSWORD.NOT_MATCHED_NEW_PASSWORD);
      }

      const hashedNewPassword = await this.hashPassword(newPassword);
      await this.userRepository.update(userId, { password: hashedNewPassword });

      return { message: MESSAGES_CONSTANT.AUTH.UPDATE_USER_PASSWORD.SUCCEED };
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException(MESSAGES_CONSTANT.AUTH.UPDATE_USER_PASSWORD.FAILED);
    }
  }

  async deleteUser(userId: number, deleteUserDto: DeleteUserDto) {
    const { password } = deleteUserDto;

    try {
      const user = await this.userRepository.findOne({
        where: { id: userId, deletedAt: null },
        select: { password: true, id: true },
      });

      if (!user) {
        throw new UnauthorizedException(MESSAGES_CONSTANT.AUTH.STRATEGY.UNAUTHORIZED);
      }

      await this.verifyPassword(password, user.password);

      await this.userRepository.softRemove(user);

      return { message: MESSAGES_CONSTANT.AUTH.DELETE_USER.SUCCEED };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException(MESSAGES_CONSTANT.AUTH.DELETE_USER.FAILED);
    }
  }

  async refreshTokens(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken.split(' ')[1], {
        secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
      });

      const user = await this.userRepository.findOne({
        where: { id: payload.id, deletedAt: null },
      });

      if (_.isNil(user)) {
        throw new UnauthorizedException(MESSAGES_CONSTANT.AUTH.STRATEGY.UNAUTHORIZED);
      }

      const newPayload = { id: user.id, email: user.email };
      return this.generateTokens(newPayload);
    } catch (e) {
      throw new UnauthorizedException(MESSAGES_CONSTANT.AUTH.COMMON.INVALID_TOKEN);
    }
  }
}
