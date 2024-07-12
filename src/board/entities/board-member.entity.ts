import { IsNumber } from 'class-validator';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Board } from './board.entity';
import { CardAssigness } from '../../cards/entities/card-assigness.entity';
import { Activity } from '../../activity/entities/activity.entity'

@Entity('board_members')
export class BoardMembers {
  @PrimaryGeneratedColumn()
  id: number;

  @IsNumber()
  @Column()
  userId: number;

  @IsNumber()
  @Column({ unsigned: true })
  boardId: number;

  @ManyToOne(() => User, (user) => user.boardMembers)
  user: User;

  @ManyToOne(() => Board, (board) => board.members)
  board: Board;
  
  @ManyToOne(() => CardAssigness, (cardAssigness) => cardAssigness.members)
  cardAssigness: CardAssigness;
  
  @ManyToOne(() => Activity, (activity) => activity.members)
  activity: Activity;
}
