import { Column, Entity, PrimaryGeneratedColumn,CreateDateColumn, UpdateDateColumn,DeleteDateColumn } from "typeorm";


@Entity('card')
export class Card {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    listId: number;

    @Column()
    name: String;

    @Column({ type : 'text'})
    description: String;

    @Column()
    color: String;

    @Column({ type: 'double'})
    posirion: number;

    @Column({ type : 'date'})
    startDate: Date;

    @Column({ type : 'date'})
    dueDate: Date;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;


}
