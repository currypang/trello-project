import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BoardMembers } from './board-member.entity';
import { List } from 'src/lists/entities/list.entity';

@Entity('boards')
export class Board {
  @PrimaryGeneratedColumn()
  id: number;

  @IsNumber()
  @Column()
  ownerId: number;

  @IsNotEmpty({ message: '보드 이름을 입력해 주세요.' })
  @Column()
  name: string;

  @Column()
  background_color: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToMany(() => BoardMembers, (boardMembers) => boardMembers.board)
  members: BoardMembers[];

  @OneToMany((type) => List, (list) => list.board, { cascade: true })
  lists: List[];
}
