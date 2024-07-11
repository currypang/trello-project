import { Column, Entity, PrimaryGeneratedColumn,CreateDateColumn, UpdateDateColumn,DeleteDateColumn } from "typeorm";

@Entity('Activity')
export class Activity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: number;

    @Column()
    cardId: String;

    @Column({ type : 'text'})
    content: String;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;

    @Column({type: 'boolean'})
    isLog: boolean;

}
