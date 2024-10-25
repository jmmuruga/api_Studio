import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
@Entity()
export class companyDetails {
    @PrimaryGeneratedColumn()
    companyid: number;
    @Column()
    company_name: string;
    @Column()
    e_mail: string;
    @Column()
    phone: String;
    @Column()
    phone_two: string;
    @Column()
    website: string;
    @Column({ type: 'ntext' })
    address: string;
    @Column({ type: 'ntext' })
    logo: string;
    @Column({ nullable: true })
    cuid: number;
    @Column({ nullable: true })
    muid: number;
    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;
    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date;
}