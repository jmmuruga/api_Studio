import { Request, Response } from "express";
import { galleryMaster, galleryMasterNested } from "../gallery/gallery.model";
import { appSource } from "../../core/db";
import { galleryDetailsDto } from "../gallery/gallery.dto";
import { ValidationException } from "../../core/exception";
import { bannerMaster } from "../banner/banner.model";
import { bannerDetailsDto } from "../banner/banner.dto";

export const getPhotographyTypeServices = async (
  req: Request,
  res: Response
) => {
  try {
    const galleryMasterRepository = appSource.getRepository(galleryMaster);
    const details = await galleryMasterRepository.query(`
      SELECT gm.album_name
      FROM [${process.env.DB_NAME}].[dbo].[gallery_master] gm
      WHERE gm.isactive = 1
      GROUP BY gm.album_name`);

    for (const album of details) {
      const nestedData = await galleryMasterRepository.query(
        `
          SELECT TOP 1 gm.album_name, CAST(gmn.baseimg AS VARCHAR(MAX)) AS baseimg
          FROM [${process.env.DB_NAME}].[dbo].[gallery_master] gm
          INNER JOIN [${process.env.DB_NAME}].[dbo].[gallery_master_nested] gmn 
            ON gmn.albumid = gm.albumid AND gmn.isactive = 1
          WHERE gm.isactive = 1 AND gm.album_name = '${album.album_name}'
          ORDER BY gmn.photoid
        `
      );

      // Attach the base image to the album
      album.baseimg = nestedData[0]?.baseimg || ""; // Get baseimg from the first row if available
    }

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

export const getAlbumName = async (req: Request, res: Response) => {
  const albumName = req.params.album_name;
  try {
    const galleryMasterRepository = appSource.getRepository(galleryMaster);
    const details = await galleryMasterRepository.query(`
     SELECT *
FROM  [${process.env.DB_NAME}].[dbo].[gallery_master] gm
WHERE gm.isactive = 1 and gm.album_name = '${albumName}'`);

    for (const album of details) {
      const nestedData = await galleryMasterRepository.query(
        `SELECT top 1 gm.album_name, CAST(gmn.baseimg AS VARCHAR(MAX)) AS baseimg
FROM [${process.env.DB_NAME}].[dbo].[gallery_master] gm
inner JOIN [${process.env.DB_NAME}].[dbo].[gallery_master_nested] gmn ON gmn.albumid = gm.albumid and gmn.isactive=1
WHERE gm.isactive = 1 and gm.title='${album.title}'
 ORDER BY gmn.photoid`
      );

      // Attach the base image to the album
      album.baseimg = nestedData[0]?.baseimg || ""; // Get baseimg from the first row if available
    }

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

export const getAlbumImages = async (req: Request, res: Response) => {
  const albumId = req.params.albumid;
  try {
    const galleryMasterRepository = appSource.getRepository(galleryMaster);
    const details: galleryDetailsDto[] = await galleryMasterRepository.query(`
        select gmn.baseimg,gm.title,gm.album_name from [${process.env.DB_NAME}].[dbo].[gallery_master] gm
inner join [${process.env.DB_NAME}].[dbo].[gallery_master_nested] gmn on gm.albumid = gmn.albumid and gmn.isactive = 1
where gm.isactive = 1 and gm.albumid = ${albumId}
        `);

    res.status(200).send({
      Result: details,
    });
  } catch (error) {
    console.log('geall',error);
    if (error instanceof ValidationException) {
      return res.status(400).send({
        message: error?.message,
      });
    }
    res.status(500).send(error);
  }
};

export const getAllImages = async (req: Request, res: Response) => {
  try {
    const repo = appSource.getRepository(galleryMasterNested);
    const details = await repo
      .createQueryBuilder("galleryMasterNested")
      .where("galleryMasterNested.isactive = :isactive", {
        isactive: true,
      })
      .getMany();
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

// export const getBanners = async (req: Request, res: Response) => {
//   const pageName = req.params.pageName;
//   try {
//     const galleryMasterRepository = appSource.getRepository(bannerMaster);
//     const details: bannerDetailsDto[] =
//       await galleryMasterRepository.query(`select * from  [${process.env.DB_NAME}].[dbo].[banner_master] bm 
// inner join  [${process.env.DB_NAME}].[dbo].[banner_master_nested] bmn on bmn.bannerid = bm.bannerid 
// where bm.menu_name = '${pageName}'
//         `);

//     res.status(200).send({
//       Result: details,
//     });
//   } catch (error) {
//     console.log(error);
//     if (error instanceof ValidationException) {
//       return res.status(400).send({
//         message: error?.message,
//       });
//     }
//     res.status(500).send(error);
//   }
// };
