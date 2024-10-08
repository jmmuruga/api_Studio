import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
@Entity()
export class UserDetails {
    @PrimaryGeneratedColumn()
    userid: number;
    @Column()
    user_name: string;
    @Column()
    phone: string;
    @Column()
    role: String;
    @Column()
    e_mail: string;
    @Column()
    password: string;
    @Column({ nullable: true })
    cuid: number;
    @Column({ nullable: true })
    muid: number;
    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;
    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date;
}