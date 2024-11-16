import { Request, Response } from "express";
import { galleryMaster, galleryMasterNested } from "../gallery/gallery.model";
import { galleryDetailsDto } from "../gallery/gallery.dto";
import { ValidationException } from "../../core/exception";
import { appSource } from "../../core/db";

export const getGalleryListAsMenu = async (req: Request, res: Response) => {
  try {
    // const repo = appSource.getRepository(galleryMasterNested);
    // const galleryMasterNesteddetails = await repo
    //   .createQueryBuilder("galleryMasterNested")
    //   .where("galleryMasterNested.isdelete=:isdelete", { isdelete: true })
    //   .getMany();

    // const galleryR
    // res.status(200).send({
    //   Result: galleryMasterNesteddetails,
    // });

    const galleryMasterRepo = appSource.getRepository(galleryMaster);
    const galleryMasterDetails = await galleryMasterRepo.query(`
        select gmn.baseimg from [${process.env.DB_NAME}].[DBO].[gallery_master] as gm
        inner join [${process.env.DB_NAME}].[DBO].[gallery_master_nested] as gmn on gm.albumid = gmn.albumid
        where gm.isdelete = 1 and gm.status=1`)

    res.status(200).send({
      Result: galleryMasterDetails,
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
