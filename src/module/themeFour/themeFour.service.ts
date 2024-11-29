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
      `select title, description from [${process.env.DB_name}].[dbo].[banner_master] bm inner join [${process.env.DB_name}].[dbo].[banner_master_nested] bmn on bm.bannerid = bmn.bannerid `
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
      `select cd.company_name, cd.e_mail, cd.mobile, cd.whats_app, cd.address, cd.logo from [${process.env.DB_name}].[dbo].[company_details] cd `
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
WHERE gm.isdelete = 1 AND gmn.isdelete = 1 AND gm.album_name = 'blog'
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

export const getServicesType = async (req: Request, res: Response) => {
  try {
    const galleryMasterRepo = appSource.getRepository(galleryMaster);
    const details: galleryDetailsDto[] =
      await galleryMasterRepo.query(`select gm.albumid, gm.title, max(cast(gmn.baseimg as varchar(max))) as baseimg from [${process.env.DB_name}].[dbo].[gallery_master] gm 
inner join [${process.env.DB_name}].[dbo].[gallery_master_nested] gmn on gm.albumid = gmn.albumid
where gm.isdelete = 1 and gmn.isdelete = 1
and (gm.album_name = 'wedding' OR gm.album_name = 'outdoor' OR gm.album_name = 'commercial')
group by  gm.albumid, gm.title; 
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

export const getAllServices = async (req: Request, res: Response) => {
  const title = req.params.title;
  try {
    const galleryMasterRepo = appSource.getRepository(galleryMaster);
    const details: galleryDetailsDto[] =
      await galleryMasterRepo.query(`select gm.albumid, gm.title, gmn.baseimg from [${process.env.DB_name}].[dbo].[gallery_master] gm 
inner join [${process.env.DB_name}].[dbo].[gallery_master_nested] gmn on gm.albumid = gmn.albumid 
where gm.isdelete = 1 and gmn.isdelete = 1 and gm.title = '${title}'
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

export const getHomePageServices = async (req: Request, res: Response) => {
  try {
    const galleryMasterRepo = appSource.getRepository(galleryMaster);
    const albumList: galleryDetailsDto[] = await galleryMasterRepo.query(`
      select album_name from [${process.env.DB_name}].[dbo].[gallery_master]
where isdelete = 1
group by album_name;
      `);

    for (const album of albumList) {
      album.photos =
        await galleryMasterRepo.query(`SELECT gm.albumid, gm.album_name,
       gm.title, 
       MAX(CAST(gmn.baseimg AS VARCHAR(MAX))) AS baseimg, 
       gm.description
FROM [${process.env.DB_name}].[dbo].[gallery_master] gm
INNER JOIN [${process.env.DB_name}].[dbo].[gallery_master_nested] gmn 
    ON gm.albumid = gmn.albumid
WHERE gm.isdelete = 1 
  AND gmn.isdelete = 1
   AND gm.album_name = '${album.album_name}'
GROUP BY gm.albumid, gm.album_name, gm.title, gm.description;
 `);
    }
    res.status(200).send({ Result: albumList });
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
