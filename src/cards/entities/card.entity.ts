import { IsNotEmpty, IsString, IsDate } from 'class-validator';
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
} from 'typeorm';

@Entity('card')
export class Card {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  listId: number;

  @IsString()
  @IsNotEmpty({ message: '카드 이름을 입력해주세요.' })
  @Column()
  name: string;

  @IsString()
  @IsNotEmpty({ message: '카드 설명을 입력해주세요.' })
  @Column({ type: 'text' })
  description: string;

  @Column({ nullable: true })
  color: string;

  @Column({ type: 'double' })
  position: number;

  @Column({ type: 'boolean' })
  isExpired: boolean;

  @IsDate()
  @Column({ type: 'date', nullable: true })
  startDate: Date;

  @IsDate()
  @Column({ type: 'date', nullable: true })
  dueDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToMany(() => CardAssigness, (cardAssigness) => cardAssigness.card, { cascade: true })
  cardAssigness: CardAssigness[];

  @OneToMany(() => Activity, (activity) => activity.card, { cascade: true })
  activity: Activity[];

  @ManyToOne((type) => List, (list) => list.cards, { onDelete: 'CASCADE' })
  lists: List;
}
