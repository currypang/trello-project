import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Card } from './card.entity';
import { BoardMembers } from '../../board/entities/board-member.entity';

@Entity('card_assigness')
export class CardAssigness {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  cardId: number;

  @ManyToOne(() => Card, (card) => card.cardAssigness, { onDelete: 'CASCADE' })
  card: Card;

  @ManyToOne(() => BoardMembers, (boardMembers) => boardMembers.activity, { onDelete: 'CASCADE' })
  members: BoardMembers;
}
