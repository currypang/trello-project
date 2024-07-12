import { IsNotEmpty, IsNumber } from 'class-validator';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToMany } from 'typeorm';
import { Card } from '../../cards/entities/card.entity'

@Entity('lists')
export class List {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Column({ unsigned: true })
  boardId: number;

  @IsNotEmpty({ message: '리스트 이름을 입력해 주세요.' })
  @Column()
  name: string;

  @IsNumber()
  @IsNotEmpty({ message: '위치 ID를 입력해 주세요.' })
  @Column({ unsigned: true })
  position: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @OneToMany(() => Card, (card) => card.listId, { cascade : true })
  card: Card[];
}
