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
    photography_type: string;
    @Column()
    location: string;
    @Column()
    mobileNumber: String;
    @Column({ type: 'ntext', nullable: true })
    address: string;
    @Column({ type: 'ntext' })
    message: string;
    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;
}