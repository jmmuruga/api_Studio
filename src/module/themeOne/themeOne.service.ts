import { Request, Response } from "express";
import { galleryMaster, galleryMasterNested } from "../gallery/gallery.model";
import { galleryDetailsDto } from "../gallery/gallery.dto";
import { ValidationException } from "../../core/exception";
import { appSource } from "../../core/db";

export const getGalleryListAsMenu = async (req: Request, res: Response) => {
  console.log('menu called ')
  try {
      const galleryMasterRepository = appSource.getRepository(galleryMaster);
      const details: galleryDetailsDto[] = await galleryMasterRepository.query(`
  with getCount as (
      select count(albumid) as counts,albumid from [${process.env.DB_NAME}].[dbo].[gallery_master_nested] where isdelete=1
      group by albumid
      )
      
      select gm.*,gmncount.counts from [${process.env.DB_NAME}].[dbo].[gallery_master] gm
      left join getCount gmncount on gmncount.albumid=gm.albumid
      where gm.isdelete=1
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