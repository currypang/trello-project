import { IsNumber } from 'class-validator';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Board } from './board.entity';
import { CardAssigness } from '../../cards/entities/card-assigness.entity';
import { Activity } from '../../activity/entities/activity.entity';

@Entity('board_members')
export class BoardMembers {
  @PrimaryGeneratedColumn()
  id: number;

  @IsNumber()
  @Column()
  userId: number;

  @IsNumber()
  @Column()
  boardId: number;

  @ManyToOne(() => User, (user) => user.boardMembers)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Board, (board) => board.members)
  @JoinColumn({ name: 'boardId' })
  board: Board;

  @OneToMany(() => CardAssigness, (cardAssigness) => cardAssigness.members)
  cardAssigness: CardAssigness;

  @OneToMany(() => Activity, (activity) => activity.members)
  activity: Activity;
}
