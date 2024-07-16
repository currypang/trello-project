import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { IsNotEmpty } from 'class-validator';
import { Card } from './card.entity';
import { BoardMembers } from '../../board/entities/board-member.entity';
import { MESSAGES_CONSTANT } from 'src/constants/messages.constants';

@Entity('card_assigness')
export class CardAssigness {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @IsNotEmpty({ message: MESSAGES_CONSTANT.CARD.COMMON.USER_ID.REQUIRE })
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
