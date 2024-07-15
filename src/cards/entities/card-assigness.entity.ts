import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { IsNotEmpty } from 'class-validator';
import { Card } from './card.entity';
import { BoardMembers } from '../../board/entities/board-member.entity';

@Entity('card_assigness')
export class CardAssigness {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @IsNotEmpty({ message: '유저를 선택해주세요.' })
  @Column({ unsigned: true })
  userId: number;

  @Column({ unsigned: true })
  cardId: number;

  @ManyToOne(() => Card, (card) => card.cardAssigness, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'card_id' })
  card: Card;

  @ManyToOne(() => BoardMembers, (boardMembers) => boardMembers.cardAssigness, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  members: BoardMembers;
}
