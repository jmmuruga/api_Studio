import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
@Entity()
export class bannerMaster {
    @PrimaryGeneratedColumn()
    bannerid: number;
    @Column()
    menu_name: string;
    @Column()
    title: string;
    @Column({ nullable: true })
    cuid: number;
    @Column({ nullable: true })
    muid: number;
    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;
    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date;

    photos: bannerMasterNested;
}
@Entity()
export class bannerMasterNested {
    @PrimaryGeneratedColumn()
    photoid: number;
    @Column()
    bannerid: number;
    @Column({ type: 'ntext' })
    baseimg: string;
}