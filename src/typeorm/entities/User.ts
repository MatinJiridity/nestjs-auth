import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'users'})
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true, nullable:false})
    email: string;

    @Column({nullable: false})
    password: string;

    @Column()
    createAt: Date;

    @Column({nullable: true})
    hashRt: string;

}