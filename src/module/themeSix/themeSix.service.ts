import { Request, Response } from "express";
import { appSource } from "../../core/db";
import { bannerMaster } from "../banner/banner.model";
import { ValidationException } from "../../core/exception";
import { galleryMaster } from "../gallery/gallery.model";
import { companyDetails } from "../company/companyDetails.model";

export const getBannerImages = async (req: Request, res: Response) => {
  try {
    const bannerMasterRepo = appSource.getRepository(bannerMaster);
    const details =
      await bannerMasterRepo.query(`select  baseimg  from
         [${process.env.DB_name}].[dbo].[banner_master] bm inner join [${process.env.DB_name}].[dbo].[banner_master_nested]
          bmn on bm.bannerid = bmn.bannerid `);

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

export const getPortfolioTypes = async (req: Request, res: Response) => {
  try {
    const galleryMasterRepo = appSource.getRepository(galleryMaster);
    const details =
      await galleryMasterRepo.query(`SELECT 
    gm.title,
    gm.description,
    (SELECT TOP 1 gmn.baseimg 
     FROM [${process.env.DB_name}].[dbo].[gallery_master_nested] gmn 
     WHERE gmn.albumid = gm.albumid 
       AND gmn.isdelete = 0) AS baseimg
FROM [${process.env.DB_name}].[dbo].[gallery_master] gm
WHERE gm.isdelete = 0; `);

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

export const getPortfolioBanner = async (req: Request, res: Response) => {
  try {
    const galleryMasterRepo = appSource.getRepository(galleryMaster);
    const details =
      await galleryMasterRepo.query(`SELECT top 3
    (SELECT TOP 1 gmn.baseimg 
     FROM [${process.env.DB_name}].[dbo].[gallery_master_nested] gmn 
     WHERE gmn.albumid = gm.albumid 
       AND gmn.isdelete = 0) AS baseimg
FROM [${process.env.DB_name}].[dbo].[gallery_master] gm
WHERE gm.isdelete = 0; `);

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
    const details =
      await companyDetailsRepo.query(`SELECT *
     FROM [${process.env.DB_name}].[dbo].[company_details]`)

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

export const getClientGalleryImages = async (req: Request, res: Response) => {
  try {
    const galleryMasterRepo = appSource.getRepository(galleryMaster);
    const details =
      await galleryMasterRepo.query(` select baseimg from [${ process.env.DB_name }].[dbo].[gallery_master] gm 
inner join [${ process.env.DB_name }].[dbo].[gallery_master_nested] gmn on gm.albumid = gmn.albumid 
where gm.isdelete = 0 and gmn.isdelete = 0 and gm.status = 1 `);

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

export const getClientGalleryBanner = async (req: Request, res: Response) => {
  try {
    const galleryMasterRepo = appSource.getRepository(galleryMaster);
    const details =
      await galleryMasterRepo.query(` select top 5 baseimg from [${ process.env.DB_name }].[dbo].[gallery_master] gm 
inner join [${ process.env.DB_name }].[dbo].[gallery_master_nested] gmn on gm.albumid = gmn.albumid 
where gm.isdelete = 0 and gmn.isdelete = 0 and gm.status = 1 `);

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