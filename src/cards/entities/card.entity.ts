import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToMany, ManyToOne } from 'typeorm';
import { IsNotEmpty, IsString, IsDate } from 'class-validator';
import { CardAssigness } from './card-assigness.entity';
import { Activity } from '../../activity/entities/activity.entity';
import { List } from '../../lists/entities/list.entity';

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
  @Column({ type: 'date',  nullable: true})
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

  @OneToMany(() => CardAssigness, (cardAssigness) => cardAssigness.userId, { cascade : true })
  cardAssigness: CardAssigness[];

  @OneToMany(() => Activity, (activity) => activity.userId, { cascade : true })
  activity: Activity[];

  @ManyToOne(() => List, list => list.id, { onDelete: 'CASCADE' })
  list : List;
}
