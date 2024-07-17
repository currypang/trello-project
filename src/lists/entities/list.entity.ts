import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Board } from 'src/board/entities/board.entity';
import { Card } from 'src/cards/entities/card.entity';
import { MESSAGES_CONSTANT } from 'src/constants/messages.constants';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';

@Entity('lists')
export class List {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  /**스웨거 테스트
   * 리스트 보드 아이디
   * @example "1"
   */

  @IsNotEmpty()
  @IsNumber()
  @Column({ unsigned: true })
  boardId: number;

  /**스웨거 테스트
   * 리스트 이름
   * @example "To do"
   */
  @IsNotEmpty({ message: MESSAGES_CONSTANT.LIST.COMMON.NAME.REQUIRED })
  @IsString()
  @Column()
  name: string;

  /**스웨거 테스트
   * 리스트 위치 번호
   *@example "2"
   */

  @IsNumber()
  @IsNotEmpty({ message: MESSAGES_CONSTANT.LIST.COMMON.POSITION.REQUIRED })
  @Column({ type: 'decimal', precision: 10, scale: 4 })
  position: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ select: false })
  deletedAt?: Date;

  @ManyToOne(() => Board, (board) => board.lists, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'board_id' })
  board: Board;

  @OneToMany(() => Card, (card) => card.list, { cascade: true })
  cards: Card[];
}
