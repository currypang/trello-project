import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import { User } from 'src/user/entities/user.entity';
import { Role } from 'src/user/types/roles.type';
import { Repository } from 'typeorm';

// 메일 옵션. 수신 메일, 메일 제목, html 형식의 메일 본문
interface EmailOptions {
  from: string;
  to: string;
  subject: string;
  html: string;
}

@Injectable()
export class EmailService {
  private transporter: Mail;

  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {
    this.transporter = nodemailer.createTransport({
      service: this.configService.get('MAIL_SERVICE'),
      host: this.configService.get('MAIL_HOST'),
      port: this.configService.get('MAIL_PORT'),
      auth: {
        user: this.configService.get('MAIL_AUTH_USER'),
        pass: this.configService.get('MAIL_AUTH_PASS'),
      },
    });
  }
  // 인증 링크 전송 로직
  async sendMemberJoinVerification(emailAddress: string, userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (user.email !== emailAddress) {
      throw new BadRequestException('가입하신 이메일이 아닙니다.');
    }

    const baseUrl = this.configService.get('MAIL_BASE_URL');
    const payload = { id: userId };
    const token = this.jwtService.sign(payload);
    const url = `${baseUrl}/email/email-verify?signupVerifyToken=${token}`;

    const mailOptions: EmailOptions = {
      from: this.configService.get('MAIL_AUTH_USER'),
      to: emailAddress,
      subject: '가입 인증 메일',
      html: `
        가입확인 버튼를 누르시면 가입 인증이 완료됩니다.<br/>
        <form action="${url}" method="POST">
          <button>가입확인</button>
        </form>
      `,
    };
    return await this.transporter.sendMail(mailOptions);
  }

  // 링크 확인 로직
  async verifyEmail(query) {
    const token = query.signupVerifyToken;
    const id = await this.jwtService.decode(token).id;
    const verifiedUser = await this.userRepository.findOne({ where: { id } });
    verifiedUser.role = Role.VerifiedUser;
    return await this.userRepository.save(verifiedUser);
  }
}
