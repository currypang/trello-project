import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('card_assigness')
export class CardAssigness {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  cardId: number;
}
