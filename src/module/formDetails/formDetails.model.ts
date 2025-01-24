import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
@Entity()
export class formDetails {
    @PrimaryGeneratedColumn()
    form_id: number;
    @Column()
    customer_name: string;
    @Column({ nullable: true })
    e_mail: string;
    @Column()
    mobileNumber: String;
    @Column({ type: 'ntext' })
    message: string;
    @Column({ nullable: true })
    wedding_date: string;
    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;
}