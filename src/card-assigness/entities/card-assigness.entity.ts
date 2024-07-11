import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('Card_Assigness')
export class CardAssigness {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: number;

    @Column()
    cardId: number;

}
