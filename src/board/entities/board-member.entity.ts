import { IsNumber } from 'class-validator';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Board } from './board.entity';

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
}
