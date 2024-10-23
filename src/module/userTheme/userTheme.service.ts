import { appSource } from "../../core/db";
import { ValidationException } from "../../core/exception";
import { bannerDetailsDto } from "../banner/banner.dto";
import { bannerMaster } from "../banner/banner.model";
import { Request, Response } from "express";
import { galleryMaster, galleryMasterNested } from "../gallery/gallery.model";
import { galleryDetailsDto } from "../gallery/gallery.dto";

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
        select count(albumid) as counts,albumid from [${process.env.DB_NAME}].[dbo].[gallery_master_nested] where isactive=1
        group by albumid
        )
        
        select gm.*,gmncount.counts from [${process.env.DB_NAME}].[dbo].[gallery_master] gm
        left join getCount gmncount on gmncount.albumid=gm.albumid
        where gm.isactive=1
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
    try {
        console.log('call')
        const ParentRepository = appSource.getRepository(galleryMaster);
        const parent = await ParentRepository
            .createQueryBuilder('galleryMaster')
            .where("galleryMaster.albumid = :albumid", {
                albumid: id,
            }).andWhere("galleryMaster.isactive = :isactive", {
                isactive: true,
            })
            .getMany();

        const Repository = appSource.getRepository(galleryMasterNested);
        const nested = await Repository
            .createQueryBuilder('galleryMasterNested')
            .where("galleryMasterNested.albumid = :albumid", {
                albumid: id,
            }).andWhere("galleryMasterNested.isactive = :isactive", {
                isactive: true,
            })
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