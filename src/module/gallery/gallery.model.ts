import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
@Entity()
export class galleryMaster {
    @PrimaryGeneratedColumn()
    albumid: number;
    @Column()
    album_name: string;
    @Column()
    title: string;
    @Column({ type: 'ntext' })
    description: string;
    @Column()
    location: string;
    @Column()
    isdelete: boolean;
    @Column()
    status: boolean;
    @Column({ nullable: true })
    cuid: number;
    @Column({ nullable: true })
    muid: number;
    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;
    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date;

    photos: galleryMasterNested;
}
@Entity()
export class galleryMasterNested {
    @PrimaryGeneratedColumn()
    photoid: number;
    @Column()
    albumid: number;
    @Column({ type: 'ntext' })
    baseimg: string;
    @Column({ nullable: true })
    arrangement: number;
    @Column()
    isdelete: boolean;
    @Column({ nullable: true })
    cuid: number;
    @Column({ nullable: true })
    muid: number;
    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;
    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date;
}