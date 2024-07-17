import { IsNotEmpty, IsString, IsOptional, IsHexColor } from 'class-validator';
import { CardAssigness } from './card-assigness.entity';
import { Activity } from '../../activity/entities/activity.entity';
import { List } from 'src/lists/entities/list.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { MESSAGES_CONSTANT } from 'src/constants/messages.constants';

@Entity('card')
export class Card {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  /**스웨거 테스트
   * 카드 리스트 아이디
   * @example "1"
   */

  @IsNotEmpty({ message: MESSAGES_CONSTANT.CARD.COMMON.LIST_ID.REQUIRE })
  @Column({ unsigned: true })
  listId: number;

  /**스웨거 테스트
   * 카드 이름
   * @example "나는 일을 안할거예요~"
   */
  @IsString()
  @IsNotEmpty({ message: MESSAGES_CONSTANT.CARD.COMMON.NAME.REQUIRE })
  @Column()
  name: string;

  /**스웨거 테스트
   * 카드 이름
   * @example "열정적으로 일을 안하는 법 1, 2, 3 당신의 선택은?"
   */
  @IsString()
  @IsNotEmpty({ message: MESSAGES_CONSTANT.CARD.COMMON.DESCRIPTION.REQUIRE })
  @Column({ type: 'text' })
  description: string;

  /**
   * 색상
   * @example "#FF0000"
   */
  @IsHexColor({ message: MESSAGES_CONSTANT.BOARD.COMMON.BACKGROUND_COLOR.INVALID_TYPE })
  @IsOptional()
  @IsString()
  @Column({ nullable: true })
  color?: string;
  /**스웨거 테스트
   * 카드 위치 번호
   *@example "2"
   */

  @Column({ type: 'decimal', precision: 10, scale: 4 })
  position: number;

  @Column({ type: 'boolean' })
  isExpired?: boolean;

  @IsOptional()
  @IsString()
  @Column({ type: 'date', nullable: true })
  startDate?: Date;

  @IsOptional()
  @IsString()
  @Column({ type: 'date', nullable: true })
  dueDate?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @OneToMany(() => CardAssigness, (cardAssigness) => cardAssigness.card, { cascade: true })
  cardAssigness: CardAssigness[];

  @OneToMany(() => Activity, (activity) => activity.card, { cascade: true })
  activity: Activity[];

  @ManyToOne(() => List, (list) => list.cards, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'list_id' })
  list: List;
}
