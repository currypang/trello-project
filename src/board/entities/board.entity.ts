import { IsHexColor, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BoardMembers } from './board-member.entity';
import { MESSAGES_CONSTANT } from 'src/constants/messages.constants';
import { List } from 'src/lists/entities/list.entity';

@Entity('boards')
export class Board {
  @PrimaryGeneratedColumn()
  id: number;

  @IsNumber()
  @Column()
  ownerId: number;

  /**
   * 보드 이름
   * @example "보드1번"
   */
  @IsString()
  @IsNotEmpty({ message: MESSAGES_CONSTANT.BOARD.COMMON.NAME.REQUIRED })
  @Column()
  name: string;

  /**
   * 색상
   * @example "#FF0000"
   */
  @IsHexColor({ message: MESSAGES_CONSTANT.BOARD.COMMON.BACKGROUND_COLOR.INVALID_TYPE })
  @IsNotEmpty({ message: MESSAGES_CONSTANT.BOARD.COMMON.BACKGROUND_COLOR.REQUIRED })
  @Column()
  background_color: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToMany(() => BoardMembers, (boardMembers) => boardMembers.board)
  members: BoardMembers[];

  @OneToMany((type) => List, (list) => list.board, { cascade: true })
  lists: List[];
}
