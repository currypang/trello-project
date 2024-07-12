import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
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

  private async hashingPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }
  private async comparePassword(inputPassword: string, password: string): Promise<void> {
    const isCurrentPasswordValid = bcrypt.compareSync(inputPassword, password);
    if (!isCurrentPasswordValid) {
      throw new UnauthorizedException(MESSAGES_CONSTANT.AUTH.SIGN_UP.NOT_MATCHED_PASSWORD);
    }
  }
  async signUp({ email, password, confirmPassword, username }: SignUpDto) {
    const isMatched = password === confirmPassword;
    if (!isMatched) {
      throw new BadRequestException(MESSAGES_CONSTANT.AUTH.SIGN_UP.NOT_MATCHED_PASSWORD);
    }
    // 유저 복구기능은 현재 없습니다.
    const existUser = await this.userRepository.findOneBy({ email });
    if (!_.isNil(existUser)) {
      throw new BadRequestException(MESSAGES_CONSTANT.AUTH.SIGN_UP.EXISTED_EMAIL);
    }

    const hashedPassword = await this.hashingPassword(password);

    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      username,
    });
    await this.userRepository.save(user);
    return { email: user.email };
  }

  async validateUser({ email, password }: SignInDto) {
    const user = await this.userRepository.findOne({
      where: { email, deletedAt: null },
      select: { id: true, password: true, email: true },
    });
    if (!user) {
      return null;
    }
    await this.comparePassword(password, user.password);

    return { id: user.id, email: user.email };
  }
  signIn(userId: number, email: string) {
    const payload = { id: userId, email };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
      expiresIn: this.configService.get<string>('REFRESH_TOKEN_EXPIRES'),
    });

    return { accessToken, refreshToken };
  }
  async updateUserPassword(userId: number, updateUserPasswordDto: UpdateUserPasswordDto) {
    const { currentPassword, newPassword, confirmNewPassword } = updateUserPasswordDto;

    const user = await this.userRepository.findOne({
      where: { id: userId, deletedAt: null },
      select: { password: true },
    });

    if (_.isNil(user)) {
      throw new UnauthorizedException(MESSAGES_CONSTANT.AUTH.STRATEGY.UNAUTHORIZED);
    }

    await this.comparePassword(currentPassword, user.password);

    const isMatched = newPassword === confirmNewPassword;
    if (!isMatched) {
      throw new BadRequestException(MESSAGES_CONSTANT.AUTH.UPDATE_USER_PASSWORD.NOT_MATCHED_NEW_PASSWORD);
    }

    const hashedNewPassword = await this.hashingPassword(newPassword);
    await this.userRepository.update(userId, { password: hashedNewPassword });

    return { message: MESSAGES_CONSTANT.AUTH.UPDATE_USER_PASSWORD.SUCCEED };
  }

  async deleteUser(userId: number, deleteUserDto: DeleteUserDto) {
    const { password } = deleteUserDto;

    const user = await this.userRepository.findOne({
      where: { id: userId, deletedAt: null },
      select: { password: true, id: true },
    });

    if (!user) {
      throw new UnauthorizedException(MESSAGES_CONSTANT.AUTH.STRATEGY.UNAUTHORIZED);
    }

    await this.comparePassword(password, user.password);

    await this.userRepository.softRemove(user);

    return { message: MESSAGES_CONSTANT.AUTH.DELETE_USER.SUCCEED };
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
      const newAccessToken = this.jwtService.sign(newPayload);
      const newRefreshToken = this.jwtService.sign(newPayload, {
        secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
        expiresIn: this.configService.get<string>('REFRESH_TOKEN_EXPIRES'),
      });

      return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    } catch (e) {
      throw new UnauthorizedException(MESSAGES_CONSTANT.AUTH.COMMON.INVALID_TOKEN);
    }
  }
}
