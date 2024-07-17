import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Card } from '../../cards/entities/card.entity';
import { BoardMembers } from '../../board/entities/board-member.entity';
import { MESSAGES_CONSTANT } from 'src/constants/messages.constants';

@Entity('Activity')
export class Activity {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @IsOptional()
  @Column({ unsigned: true })
  userId: number;

  @IsOptional()
  @Column({ unsigned: true })
  cardId: number;

  @IsString()
  @IsNotEmpty({ message: MESSAGES_CONSTANT.ACTIVITY.COMMON.CONTENT.REQUIRED })
  @Column({ type: 'text' })
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @IsOptional()
  @Column({ type: 'boolean' })
  isLog: boolean;

  @ManyToOne(() => Card, (card) => card.activity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'card_id' })
  card: Card;

  @ManyToOne(() => BoardMembers, (boardMembers) => boardMembers.activity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  members: BoardMembers;
}
