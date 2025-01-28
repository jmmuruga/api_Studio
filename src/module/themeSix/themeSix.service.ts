import { Request, Response } from "express";
import { appSource } from "../../core/db";
import { bannerMaster } from "../banner/banner.model";
import { ValidationException } from "../../core/exception";
import { galleryMaster } from "../gallery/gallery.model";
import { companyDetails } from "../company/companyDetails.model";
import { formDetails } from "../formDetails/formDetails.model";
import nodemailer from 'nodemailer';

export const getBannerImages = async (req: Request, res: Response) => {
  try {
    const bannerMasterRepo = appSource.getRepository(bannerMaster);
    const details = await bannerMasterRepo.query(`select  baseimg  from
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
    const details = await galleryMasterRepo.query(`SELECT top 4
    gm.title,
    gm.albumid,
    gm.description,
    (SELECT TOP 1 gmn.baseimg 
     FROM [${process.env.DB_name}].[dbo].[gallery_master_nested] gmn 
     WHERE gmn.albumid = gm.albumid 
       AND gmn.isdelete = 0) AS baseimg
FROM [${process.env.DB_name}].[dbo].[gallery_master] gm
WHERE gm.isdelete = 0 and gm.status = 1`);

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

export const getPortfolioImages = async (req: Request, res: Response) => {
  const albumid = req.params.albumid;
  try {
    const galleryMasterRepo = appSource.getRepository(galleryMaster);
    const details =
      await galleryMasterRepo.query(`SELECT gm.albumid,gmn.baseimg 
FROM [${process.env.DB_name}].[dbo].[gallery_master] gm 
INNER JOIN [${process.env.DB_name}].[dbo].[gallery_master_nested] gmn 
ON gm.albumid = gmn.albumid 
WHERE gm.isdelete = 0 
AND gmn.isdelete = 0 
AND gm.albumid = ${albumid}
AND gm.status = 1 
order by  arrangement `);

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

export const getPortfolioAllTypes = async (req: Request, res: Response) => {
  try {
    const galleryMasterRepo = appSource.getRepository(galleryMaster);
    const details = await galleryMasterRepo.query(`SELECT 
    gm.title,
    gm.albumid,
    gm.description,
    (SELECT TOP 1 gmn.baseimg 
     FROM [${process.env.DB_name}].[dbo].[gallery_master_nested] gmn 
     WHERE gmn.albumid = gm.albumid 
       AND gmn.isdelete = 0) AS baseimg
FROM [${process.env.DB_name}].[dbo].[gallery_master] gm
WHERE gm.isdelete = 0 and gm.status = 1`);

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
    const details = await galleryMasterRepo.query(`SELECT TOP 3 
    gm.albumid, 
    (SELECT TOP 1 gmn.baseimg 
     FROM [${process.env.DB_name}].[dbo].[gallery_master_nested] gmn 
     WHERE gmn.albumid = gm.albumid 
       AND gmn.isdelete = 0 
     ORDER BY gmn.albumid) AS baseimg
FROM [${process.env.DB_name}].[dbo].[gallery_master] gm
WHERE gm.isdelete = 0 and gm.status = 1; `);

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
    const details = await companyDetailsRepo.query(`SELECT *
     FROM [${process.env.DB_name}].[dbo].[company_details]`);

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
      await galleryMasterRepo.query(` select baseimg from [${process.env.DB_name}].[dbo].[gallery_master] gm 
inner join [${process.env.DB_name}].[dbo].[gallery_master_nested] gmn on gm.albumid = gmn.albumid 
where gm.isdelete = 0 and gmn.isdelete = 0 and gm.status = 1 order by  arrangement`);

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
      await galleryMasterRepo.query(` select top 5 baseimg from [${process.env.DB_name}].[dbo].[gallery_master] gm 
inner join [${process.env.DB_name}].[dbo].[gallery_master_nested] gmn on gm.albumid = gmn.albumid 
where gm.isdelete = 0 and gmn.isdelete = 0 and gm.status = 1 order by  arrangement `);

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
      to: "savedataakshaya03@gmail.com",
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
        "photography Type: " +
        "\n" +
        formDatas.photography_type +
        "Location: " +
        "\n" +
        formDatas.location +
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



