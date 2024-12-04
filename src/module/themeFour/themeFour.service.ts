import { Request, Response } from "express";
import { appSource } from "../../core/db";
import { bannerMaster } from "../banner/banner.model";
import { bannerDetailsDto } from "../banner/banner.dto";
import { ValidationException } from "../../core/exception";
import { companyDetails } from "../company/companyDetails.model";
import { companyDetailsDto } from "../company/companyDetails.dto";
import { galleryMaster } from "../gallery/gallery.model";
import { galleryDetailsDto } from "../gallery/gallery.dto";
import nodemailer from "nodemailer";
import { formDetails } from "../formDetails/formDetails.model";

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
      `SELECT bm.bannerid, 
       bmn.title, 
       CAST(bmn.baseimg AS VARCHAR(MAX)) AS baseimg, 
	   CAST( bmn.description AS VARCHAR(MAX)) AS description, 
	   bm.menu_name 
FROM [${process.env.DB_name}].[dbo].[banner_master] bm
INNER JOIN [${process.env.DB_name}].[dbo].[banner_master_nested] bmn ON bm.bannerid = bmn.bannerid
where bm.menu_name = 'blog'
GROUP BY bm.bannerid, bmn.title,  CAST(bmn.baseimg AS VARCHAR(MAX)),  CAST( bmn.description AS VARCHAR(MAX)) , bm.menu_name;
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
where gm.isdelete = 0 and gmn.isdelete = 0 and gm.status = 1 and gm.albumid = ${albumId} order by gmn.arrangement asc
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
      await galleryMasterRepo.query(`SELECT gm.albumid, gm.title, 
       MAX(CAST(gmn.baseimg AS VARCHAR(MAX))) AS baseimg,
       MAX(gmn.arrangement) AS arrangement
FROM [${process.env.DB_name}].[dbo].[gallery_master] gm
INNER JOIN [${process.env.DB_name}].[dbo].[gallery_master_nested] gmn ON gm.albumid = gmn.albumid
WHERE gm.isdelete = 0 
  AND gmn.isdelete = 0 
  AND gm.status = 1 
GROUP BY gm.albumid, gm.title
ORDER BY MAX(gmn.arrangement) ASC;
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
where gm.isdelete = 0 and gmn.isdelete = 0 and  gm.status = 1  and gm.title = '${title}' order by gmn.arrangement asc
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
where isdelete = 0 and status = 1 
group by album_name;
      `);

    for (const album of albumList) {
      console.log(album.album_name , 'name')
      album.photos =
        await galleryMasterRepo.query(`SELECT top 3
       gm.title,
	   gm.albumid,
	   gm.album_name,
	   MAX(CAST(gm.description AS VARCHAR(MAX))) AS description,
       max(CAST(gmn.baseimg AS VARCHAR(MAX))) AS baseimg
FROM [${process.env.DB_name}].[dbo].[gallery_master] gm
INNER JOIN [${process.env.DB_name}].[dbo].[gallery_master_nested] gmn 
    ON gm.albumid = gmn.albumid
WHERE gm.isdelete = 0
  AND gmn.isdelete = 0 and gm.album_name = '${album.album_name}'
   
GROUP BY gm.title,gm.albumid,gm.album_name
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

export const getGalleryImages = async (req: Request, res: Response) => {
  const title = req.params.title;
  try {
    const galleryMasterRepo = appSource.getRepository(galleryMaster);
    const details: galleryDetailsDto[] =
      await galleryMasterRepo.query(`SELECT CAST(gmn.baseimg AS VARCHAR(MAX)) AS baseimg
FROM [${process.env.DB_name}].[dbo].[gallery_master] gm 
INNER JOIN [${process.env.DB_name}].[dbo].[gallery_master_nested] gmn 
    ON gm.albumid = gmn.albumid 
WHERE gm.isdelete = 0
  AND gmn.isdelete = 0 AND gm.status = 1 order by gmn.arrangement asc
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

export const sendMail = async (req: Request, res: Response) => {
  try {
    const formDatas = req.body;
    console.log(formDatas, "email service called");
    const repo = appSource.getRepository(formDetails);
    await repo.save(formDatas);
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
      to: "savedatashreeyamunna@gmail.com",
      subject: `New Inquiry from ${formDatas.customer_name}`,
      text:
        "Name: " +
        formDatas.customer_name +
        "\n" +
        "Mobile Number: " +
        formDatas.mobileNumber +
        "\n" +
        "Mail-ID: " +
        formDatas.e_mail +
        "\n" +
        "date: " +
        formDatas.date +
        "\n" +
        "Message: " +
        formDatas.message,
    });
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


