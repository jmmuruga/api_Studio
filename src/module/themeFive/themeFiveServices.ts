import { Request, Response } from "express";
import { galleryMaster, galleryMasterNested,  } from "../gallery/gallery.model";
import { galleryDetailsDto, galleryDetailsNestedDto } from "../gallery/gallery.dto";
import { ValidationException } from "../../core/exception";
import { appSource } from "../../core/db";
import { bannerMaster } from "../banner/banner.model";
import { bannerDetailsDto } from "../banner/banner.dto";
import { companyDetails } from "../company/companyDetails.model";
import nodemailer from "nodemailer";
import { formDetails } from "../formDetails/formDetails.model";


export const getBannerByMenuName = async (req:Request,res:Response)=>{
  const name = req.params.menu_name;

    try {
        const bannerMasterRepository = appSource.getRepository(bannerMaster);
        const details: bannerDetailsDto[] = await bannerMasterRepository.query(`  select bm.*,bmn.* from [${process.env.DB_NAME}].[dbo].[banner_master] bm
      inner join [${process.env.DB_NAME}].[dbo].[banner_master_nested] bmn on bmn.bannerid=bm.bannerid
      where bm.menu_name='${name}'
      
    `);
        res.status(200).send({
          Result: details,
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




    export const getHomeGallery = async (req: Request, res: Response) => {
      try {
        const galleryMasterNestedRepository = appSource.getRepository(galleryMasterNested);
        const details =
          await  galleryMasterNestedRepository.query(`select top 6 gmn.baseimg  from [${process.env.DB_NAME}].[dbo].[gallery_master] gm
            inner join [${process.env.DB_NAME}].[dbo].[gallery_master_nested] gmn on gmn.albumid = gm.albumid
            where gm.isdelete=0 and gmn.isdelete=0 and gm.status = 1
            order by gmn.albumid desc
          `);
        res.status(200).send({
          Result: details,
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
          
     


  

