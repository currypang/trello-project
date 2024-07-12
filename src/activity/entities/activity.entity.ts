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
import { Card } from '../../cards/entities/card.entity';
import { BoardMembers } from '../../board/entities/board-member.entity';

@Entity('Activity')
export class Activity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  cardId: string;

  @Column({ type: 'text' })
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @Column({ type: 'boolean' })
  isLog: boolean;

  @ManyToOne(() => Card, (card) => card.activity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cardId' })
  card: Card;

  @ManyToOne(() => BoardMembers, (boardMembers) => boardMembers.activity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  members: BoardMembers;
}
