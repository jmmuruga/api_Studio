import { appSource } from "../../core/db";
import { ValidationException } from "../../core/exception";
import { bannerDetailsDto } from "../banner/banner.dto";
import { bannerMaster } from "../banner/banner.model";
import { Request, Response } from "express";
import { galleryMaster, galleryMasterNested } from "../gallery/gallery.model";
import { galleryDetailsDto } from "../gallery/gallery.dto";
import { companyDetails } from "../company/companyDetails.model";
import nodemailer from "nodemailer";
import { formDetails } from "../formDetails/formDetails.model";

export const getBannerByMenuName = async (req: Request, res: Response) => {
    const name = req.params.menu_name;
    try {
        const bannerMasterRepository = appSource.getRepository(bannerMaster);
        const details: bannerDetailsDto[] = await bannerMasterRepository.query(`
        select bm.*,bmn.* from [${process.env.DB_NAME}].[dbo].[banner_master] bm
        inner join [${process.env.DB_NAME}].[dbo].[banner_master_nested] bmn on bmn.bannerid=bm.bannerid
        where bm.menu_name='${name}'
        `);

        res.status(200).send({
            Result: details
        });
    } catch (error) {
        console.log(error)
        if (error instanceof ValidationException) {
            return res.status(400).send({
                message: error?.message,
            });
        }
        res.status(500).send(error);
    }
};

export const getGalleryListAsMenu = async (req: Request, res: Response) => {
    try {
        const galleryMasterRepository = appSource.getRepository(galleryMaster);
        const details: galleryDetailsDto[] = await galleryMasterRepository.query(`
    with getCount as (
        select count(albumid) as counts,albumid from [${process.env.DB_NAME}].[dbo].[gallery_master_nested] where isdelete=0
        group by albumid
        )
        
        select gm.*,gmncount.counts from [${process.env.DB_NAME}].[dbo].[gallery_master] gm
        left join getCount gmncount on gmncount.albumid=gm.albumid
        where gm.isdelete=0 and gm.status=1
  `);
        res.status(200).send({
            Result: details
        });
    } catch (error) {
        if (error instanceof ValidationException) {
            return res.status(400).send({
                message: error?.message,
            });
        }
        res.status(500).send(error);
    }
};


export const getAlbumPhotos = async (req: Request, res: Response) => {
    const id = req.params.albumid;
    const count = req.params.count;
    try {
        console.log('call', count)
        const ParentRepository = appSource.getRepository(galleryMaster);
        const parent = await ParentRepository
            .createQueryBuilder('galleryMaster')
            .where("galleryMaster.albumid = :albumid", {
                albumid: id,
            }).andWhere("galleryMaster.isdelete = :isdelete", {
                isdelete: false,
            })
            .getMany();

        const Repository = appSource.getRepository(galleryMasterNested);
        const nested = await Repository
            .createQueryBuilder('galleryMasterNested')
            .where("galleryMasterNested.albumid = :albumid", {
                albumid: id,
            }).andWhere("galleryMasterNested.isdelete = :isdelete", {
                isdelete: false,
            })
            .andWhere("galleryMasterNested.arrangement > :arrangement", {
                arrangement: count,
            })
            .orderBy("CASE WHEN galleryMasterNested.arrangement IS NULL THEN 1 ELSE 0 END", "ASC")
            .addOrderBy("galleryMasterNested.arrangement", "ASC")
            .limit(15)
            .getMany();
        res.status(200).send({
            Result: { parent: parent, child: nested }
        });
    } catch (error) {
        console.log('error', error)
        if (error instanceof ValidationException) {
            return res.status(400).send({
                message: error?.message,
            });
        }
        res.status(500).send(error);
    }
};

export const getCompanyData = async (req: Request, res: Response) => {
    try {
        const Repository = appSource.getRepository(companyDetails);
        const data = await Repository
            .createQueryBuilder()
            .getMany();
        res.status(200).send({
            Result: data
        });
    } catch (error) {
        if (error instanceof ValidationException) {
            return res.status(400).send({
                message: error?.message,
            });
        }
        res.status(500).send(error);
    }
};

export const sendMail = async (req: Request, res: Response) => {
    try {
        const formdata = req.body;
        console.log(formdata, 'formdata');
        const transporter = nodemailer.createTransport({
            service: "gmail",
            port: 465,
            secure: true,
            auth: {
                user: "savedatain@gmail.com",
                pass: "mqks tltb abyk jlyw",
            },
        });
        await transporter.sendMail({
            from: "savedatain@gmail.com",
            to: formdata.to,
            subject: `New Inquiry from ${formdata.customer_name}`,
            text:
                "Name: " +
                formdata.customer_name +
                "\n" +
                "Mobile Number: " +
                formdata.mobileNumber +
                "\n" +
                "Message: " +
                formdata.message,
        });

        const repo = appSource.getTreeRepository(formDetails);
        await repo.save(formdata);

        res.status(200).send({
            Result: "Mail sent successfully",
        });
    } catch (error) {
        console.log(error, "result");
        if (error instanceof ValidationException) {
            return res.status(400).send({
                message: error?.message,
            });
        }
        res.status(500).send(error);
    }
};