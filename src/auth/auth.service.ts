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
      throw new UnauthorizedException('현재 비밀번호가 일치하지 않습니다.');
    }
  }
  async signUp({ email, password, confirmPassword, username }: SignUpDto) {
    const isMatched = password === confirmPassword;
    if (!isMatched) {
      throw new BadRequestException('비밀번호가 일치 하지않습니다.');
    }

    const existUser = await this.userRepository.findOneBy({ email });
    if (!_.isNil(existUser)) {
      throw new BadRequestException('이미 가입 된 이메일 입니다.');
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
      throw new UnauthorizedException('사용자를 찾을 수 없습니다.');
    }

    await this.comparePassword(currentPassword, user.password);

    const isMatched = newPassword === confirmNewPassword;
    if (!isMatched) {
      throw new BadRequestException('새 비밀번호가 일치하지 않습니다.');
    }

    const hashedNewPassword = await this.hashingPassword(newPassword);
    await this.userRepository.update(userId, { password: hashedNewPassword });

    return { message: '비밀번호가 성공적으로 변경되었습니다.' };
  }

  async deleteUser(userId: number, deleteUserDto: DeleteUserDto) {
    const { password } = deleteUserDto;

    const user = await this.userRepository.findOne({ where: { id: userId }, select: { password: true } });

    if (!user) {
      throw new UnauthorizedException('사용자를 찾을 수 없습니다.');
    }

    await this.comparePassword(password, user.password);

    await this.userRepository.delete(userId);

    return { message: '사용자 계정이 성공적으로 삭제되었습니다.' };
  }
}
