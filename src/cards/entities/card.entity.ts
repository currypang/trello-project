import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

@Entity('card')
export class Card {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  listId: number;

  @Column()
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column()
  color: string;

  @Column({ type: 'double' })
  position: number;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date' })
  dueDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
