import { IsNumber } from 'class-validator';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Board } from './board.entity';
import { CardAssigness } from '../../cards/entities/card-assigness.entity';
import { Activity } from '../../activity/entities/activity.entity';

@Entity('board_members')
export class BoardMembers {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @IsNumber()
  @Column({ unsigned: true })
  userId: number;

  @IsNumber()
  @Column({ unsigned: true })
  boardId: number;

  @ManyToOne(() => User, (user) => user.boardMembers)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Board, (board) => board.members)
  @JoinColumn({ name: 'board_id' })
  board: Board;

  @OneToMany(() => CardAssigness, (cardAssigness) => cardAssigness.members)
  cardAssigness: CardAssigness[];

  @OneToMany(() => Activity, (activity) => activity.members)
  activity: Activity[];
}
