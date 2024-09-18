import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
@Entity()
export class LoginDetails {
    @PrimaryGeneratedColumn()
    id: number
    @Column()
    userName: string;
    @Column()
    password: string;
    @Column()
    loginTime: string;
    @Column()
    token: string;
    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;
    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date;
}