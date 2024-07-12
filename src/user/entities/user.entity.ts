import { IsEmail, IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';
import { BoardMembers } from 'src/board/entities/board-member.entity';
import { MESSAGES_CONSTANT } from 'src/constants/messages.constants';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from '../types/roles.type';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;
  /**
   * 유저네임
   * @example "luckybicky"
   */
  @IsNotEmpty({ message: MESSAGES_CONSTANT.AUTH.SIGN_UP.REQUIRED_NAME })
  @IsString()
  @Column()
  username: string;

  /**
   * 이메일
   * @example "example@example.com"
   */
  @IsNotEmpty({ message: MESSAGES_CONSTANT.AUTH.SIGN_UP.REQUIRED_EMAIL })
  @IsEmail({}, { message: MESSAGES_CONSTANT.AUTH.SIGN_UP.INVALID_EMAIL })
  @Column({ unique: true })
  email: string;

  /**
   * 비밀번호
   * @example "KimchiMaster123!@#"
   */
  @IsNotEmpty({ message: MESSAGES_CONSTANT.AUTH.SIGN_UP.REQUIRED_PASSWORD })
  @IsStrongPassword(
    { minLength: 6 },
    {
      message: MESSAGES_CONSTANT.AUTH.COMMON.CONFIRM_PASSWORD.INVALID_TYPE,
    }
  )
  @Column({ select: false })
  password: string;

  @Column({ type: 'enum', enum: Role, default: Role.UnverifiedUser })
  role: Role;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ select: false })
  deletedAt?: Date;

  @OneToMany(() => BoardMembers, (boardMembers) => boardMembers.user)
  boardMembers: BoardMembers[];
}
