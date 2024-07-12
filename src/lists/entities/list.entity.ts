import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Board } from 'src/board/entities/board.entity';
import { Card } from 'src/cards/entities/card.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

@Entity('lists')
export class List {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @IsNotEmpty()
  @IsNumber()
  @Column({ unsigned: true })
  boardId: number;

  /**스웨거 테스트
   * 리스트 이름
   * @example To do
   */
  @IsNotEmpty({ message: '리스트 이름을 입력해 주세요.' })
  @IsString()
  @Column()
  name: string;

  /**스웨거 테스트
   * 리스트 위치 번호
   *@example 12000
   */

  @IsNumber()
  @IsNotEmpty({ message: '위치 번호를 입력해 주세요.' })
  @Column({ unsigned: true })
  position: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @ManyToOne((type) => Board, (board) => board.lists, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'boardId' })
  board: Board;

  @OneToMany((type) => Card, (card) => card.lists, { cascade: true })
  cards: Card[];
}
