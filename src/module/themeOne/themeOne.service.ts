import { Request, Response } from "express";
import { galleryMaster, galleryMasterNested } from "../gallery/gallery.model";
import { galleryDetailsDto } from "../gallery/gallery.dto";
import { ValidationException } from "../../core/exception";
import { appSource } from "../../core/db";
import { bannerMaster } from "../banner/banner.model";
import { bannerDetailsDto } from "../banner/banner.dto";
import { companyDetails } from "../company/companyDetails.model";
import nodemailer from "nodemailer";
import { formDetails } from "../formDetails/formDetails.model";

export const getGalleryListAsMenu = async (req: Request, res: Response) => {
  console.log("menu called ");
  try {
    const galleryMasterRepository = appSource.getRepository(galleryMaster);
    const details: galleryDetailsDto[] = await galleryMasterRepository.query(`
  with getCount as (
      select count(albumid) as counts,albumid from [${process.env.DB_NAME}].[dbo].[gallery_master_nested] where isdelete=0 
      group by albumid
      )
      
      select gm.*,gmncount.counts from [${process.env.DB_NAME}].[dbo].[gallery_master] gm
      left join getCount gmncount on gmncount.albumid=gm.albumid
      where gm.isdelete=0 and gm.status = 1
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
      Result: details,
    });
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

export const getImageListByAlbumid = async (req: Request, res: Response) => {
  const albumid = req.params.albumid;
  try {
    const repo = appSource.getRepository(galleryMasterNested);
    const details: galleryDetailsDto[] = await repo.query(`
        SELECT gm.album_name , gmn.* 
FROM [${process.env.DB_NAME}].[dbo]. [gallery_master_nested] AS gmn
INNER JOIN [gallery_master] AS gm 
    ON gmn.albumid = gm.albumid
WHERE gmn.isdelete = 0  
  AND gmn.albumid = ${albumid};
  `);
    res.status(200).send({
      Result: details,
    });
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

export const getGalleryImagesList = async (req: Request, res: Response) => {
  try {
    const Repository = appSource.getRepository(galleryMasterNested);
    const details =
      await Repository.query(`select gmn.baseimg  from [${process.env.DB_NAME}].[dbo].[gallery_master] gm 
        inner join [${process.env.DB_NAME}].[dbo].[gallery_master_nested] gmn on gmn.albumid = gm.albumid
        where gm.isdelete=0 and gmn.isdelete=0 and gm.status = 1
        order by gmn.arrangement asc
      `);
    console.log("called here");
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

export const getServicesImage = async (req: Request, res: Response) => {
  try {
    const Repository = appSource.getRepository(galleryMaster);
    const details = await Repository.query(`
        select gallery_master.albumid, 
    gallery_master.album_name, 
   MAX(CAST( gallery_master.description AS VARCHAR(MAX))) AS description,
     MAX(CAST(gallery_master_nested.baseimg AS VARCHAR(MAX))) AS baseimg
from [${process.env.DB_NAME}].[dbo].[gallery_master] 
inner join  [${process.env.DB_NAME}].[dbo].[gallery_master_nested] 
    on gallery_master.albumid = gallery_master_nested.albumid
where gallery_master.isdelete = 0 and gallery_master.status = 1 and gallery_master_nested.isdelete = 0
group by 
gallery_master.albumid, 
gallery_master.album_name`);
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

export const getNavHead = async (req: Request, res: Response) => {
  try {
    const Repository = appSource.getRepository(companyDetails);
    const details = await Repository.query(
      ` select company_name,e_mail,address,mobile from [${process.env.DB_NAME}].[dbo].[company_details] `
    );

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
      to: "savedatasaranya@gmail.com",
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
