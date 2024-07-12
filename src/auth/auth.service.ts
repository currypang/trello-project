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
      where: { email },
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

    const user = await this.userRepository.findOne({ where: { id: userId }, select: { password: true } });

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

    const user = await this.userRepository.findOne({ where: { id: userId }, select: { password: true } });

    if (!user) {
      throw new UnauthorizedException(MESSAGES_CONSTANT.AUTH.STRATEGY.UNAUTHORIZED);
    }

    await this.comparePassword(password, user.password);

    await this.userRepository.delete(userId);

    return { message: MESSAGES_CONSTANT.AUTH.DELETE_USER.SUCCEED };
  }
}
