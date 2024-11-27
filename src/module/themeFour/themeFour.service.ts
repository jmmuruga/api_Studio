import { Request, Response } from "express";
import { appSource } from "../../core/db";
import { bannerMaster } from "../banner/banner.model";
import { bannerDetailsDto } from "../banner/banner.dto";
import { ValidationException } from "../../core/exception";
import { companyDetails } from "../company/companyDetails.model";
import { companyDetailsDto } from "../company/companyDetails.dto";
import { galleryMaster } from "../gallery/gallery.model";
import { galleryDetailsDto } from "../gallery/gallery.dto";

export const getBannerImages = async (req: Request, res: Response) => {
  const menuName = req.params.page;
  console.log(menuName, "menuName");
  try {
    const bannerMasterRepo = appSource.getRepository(bannerMaster);
    const details =
      await bannerMasterRepo.query(`select menu_name, baseimg, title, description from
         [${process.env.DB_name}].[dbo].[banner_master] bm inner join [${process.env.DB_name}].[dbo].[banner_master_nested]
          bmn on bm.bannerid = bmn.bannerid where bm.menu_name = '${menuName}'`);

    res.status(200).send({ Result: details });
  } catch (error) {
    console.log(error);
    if (error instanceof ValidationException) {
      return res.status(400).send({
        message: error?.message,
      });
    }
    res.status(500).send(error);
  }
};

export const getServices = async (req: Request, res: Response) => {
  try {
    const bannerMasterRepo = appSource.getRepository(bannerMaster);
    const details: bannerDetailsDto[] = await bannerMasterRepo.query(
      `select title, description from banner_master bm inner join banner_master_nested bmn on bm.bannerid = bmn.bannerid `
    );
    res.status(200).send({ Result: details });
  } catch (error) {
    console.log(error);
    if (error instanceof ValidationException) {
      return res.status(400).send({
        message: error?.message,
      });
    }
    res.status(500).send(error);
  }
};

export const getCompanyDetails = async (req: Request, res: Response) => {
  try {
    const companyDetailsRepo = appSource.getRepository(companyDetails);
    const details: companyDetailsDto[] = await companyDetailsRepo.query(
      `select company_name, e_mail, mobile, whats_app, address, logo from company_details  `
    );
    res.status(200).send({ Result: details });
  } catch (error) {
    console.log(error);
    if (error instanceof ValidationException) {
      return res.status(400).send({
        message: error?.message,
      });
    }
    res.status(500).send(error);
  }
};

export const getBlogDetails = async (req: Request, res: Response) => {
  try {
    const galleryMasterRepo = appSource.getRepository(galleryMaster);
    const details: galleryDetailsDto[] = await galleryMasterRepo.query(
      `SELECT gm.albumid, gm.album_name, gm.title, 
       MIN(CAST(gmn.baseimg AS VARCHAR(MAX))) AS baseimg
FROM [${process.env.DB_name}].[dbo].[gallery_master] gm
INNER JOIN [${process.env.DB_name}].[dbo]. [gallery_master_nested] gmn ON gm.albumid = gmn.albumid
WHERE gm.isdelete = 1 AND gmn.isdelete = 1
GROUP BY gm.albumid, gm.album_name, gm.title;
 `
    );
    res.status(200).send({ Result: details });
  } catch (error) {
    console.log(error);
    if (error instanceof ValidationException) {
      return res.status(400).send({
        message: error?.message,
      });
    }
    res.status(500).send(error);
  }
};

export const getBlogImages = async (req: Request, res: Response) => {
  const albumId = req.params.albumid;
  console.log(albumId,"albumId")
  try {
    const galleryMasterRepo = appSource.getRepository(galleryMaster);
    const details: galleryDetailsDto[] =
      await galleryMasterRepo.query(`select baseimg from [${process.env.DB_name}].[dbo].[gallery_master] gm 
inner join [${process.env.DB_name}].[dbo].[gallery_master_nested] gmn on gm.albumid = gmn.albumid 
where gm.isdelete = 1 and gmn.isdelete = 1 and gm.albumid = ${albumId}
 `);
    res.status(200).send({ Result: details });
  } catch (error) {
    console.log(error);
    if (error instanceof ValidationException) {
      return res.status(400).send({
        message: error?.message,
      });
    }
    res.status(500).send(error);
  }
};
