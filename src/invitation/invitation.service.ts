import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import Mail from 'nodemailer/lib/mailer';
import nodemailer from 'nodemailer';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { BoardMembers } from 'src/board/entities/board-member.entity';
import { JwtService } from '@nestjs/jwt';
import { Board } from 'src/board/entities/board.entity';
import { MESSAGES_CONSTANT } from 'src/constants/messages.constants';

interface EmailOptions {
  from: string;
  to: string;
  subject: string;
  html: string;
}

@Injectable()
export class InvitationService {
  private transporter: Mail;
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(BoardMembers)
    private readonly boardMemberRepository: Repository<BoardMembers>,
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>
  ) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('INVITE_HOST'),
      port: this.configService.get('INVITE_PORT'),
      secure: false,
      auth: {
        user: this.configService.get('INVITE_AUTH_USER'),
        pass: this.configService.get('INVITE_AUTH_PASS'),
      },
    });
  }

  async sendInvitieVertification(emailAddress: string, boardId: number, userId: number) {
    const board = await this.boardRepository.find({
      where: { id: boardId, ownerId: userId },
    });
    const usereMail = await this.userRepository.findOneBy({ email: emailAddress });
    if (!usereMail) {
      throw new NotFoundException(MESSAGES_CONSTANT.BOARD.SEND_EMAIL.NOT_FOUND_USER);
    }

    if (board.length === 0) {
      throw new NotFoundException(MESSAGES_CONSTANT.BOARD.SEND_EMAIL.NOT_FOUND);
    }

    const baseUrl = this.configService.get('INVITE_BASE_URL');
    const payload = { boardId: boardId, email: emailAddress };
    const token = await this.jwtService.signAsync(payload, { secret: this.configService.get('ACCESS_TOKEN_SECRET') });
    const url = `${baseUrl}/board/email/verify?inviteVerifyToken=${token}`;
    const mailOptions: EmailOptions = {
      from: this.configService.get('INVITE_AUTH_USER'),
      to: emailAddress,
      subject: '보드초대 인증 메일',
      html: `
              초대코드를 입력하시면 인증이 완료됩니다<br/>
               <form action="${url}" method="POST">
                     <button>초대인증</button>
        </form>`,
    };
    return await this.transporter.sendMail(mailOptions);
  }

  async verifyInvite(query: string) {
    const token = query;
    const boardId = await this.jwtService.decode(token).boardId;
    const userEmail = await this.jwtService.decode(token).email;
    const user = await this.userRepository.findOne({
      where: { email: userEmail },
    });
    await this.boardMemberRepository.save({
      userId: user.id,
      boardId: boardId,
    });
  }
}
