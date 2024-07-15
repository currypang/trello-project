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
import { IsNotEmpty, IsString } from 'class-validator';
import { Card } from '../../cards/entities/card.entity';
import { BoardMembers } from '../../board/entities/board-member.entity';

@Entity('Activity')
export class Activity {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Column({ unsigned: true })
  userId: number;

  @Column({ unsigned: true })
  cardId: number;

  @IsString()
  @IsNotEmpty({ message: '내용을 입력해주세요.' })
  @Column({ type: 'text' })
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @Column({ type: 'boolean' })
  isLog: boolean;

  @ManyToOne(() => Card, (card) => card.activity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'card_id' })
  card: Card;

  @ManyToOne(() => BoardMembers, (boardMembers) => boardMembers.activity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  members: BoardMembers;
}
