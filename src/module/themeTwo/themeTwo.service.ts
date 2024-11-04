import { Request, Response } from "express";
import { galleryMaster, galleryMasterNested } from "../gallery/gallery.model";
import { appSource } from "../../core/db";
import { galleryDetailsDto } from "../gallery/gallery.dto";
import { ValidationException } from "../../core/exception";

export const getPhotographyTypeServices = async (
  req: Request,
  res: Response
) => {
  // console.log("called");
  try {
    const galleryMasterRepository = appSource.getRepository(galleryMaster);
    const details: galleryDetailsDto[] = await galleryMasterRepository.query(`
        WITH getFirstImg AS (
    SELECT CAST(baseimg AS VARCHAR(MAX)) AS baseimg,albumid,
        ROW_NUMBER() OVER (PARTITION BY albumid ORDER BY photoid) AS row_num
    FROM [${process.env.DB_NAME}].[dbo].[gallery_master_nested]
    WHERE isactive = 1
)

SELECT gm.album_name, ISNULL(gmn.baseimg, '') AS baseimg
FROM  [${process.env.DB_NAME}].[dbo].[gallery_master] gm
LEFT JOIN getFirstImg gmn ON gmn.albumid = gm.albumid AND gmn.row_num = 1
WHERE gm.isactive = 1
GROUP BY gm.album_name,gmn.baseimg;

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

export const getAlbumName = async (req: Request, res: Response) => {
  const albumName = req.params.album_name;
  // console.log("calledServices", albumName);
  try {
    const galleryMasterRepository = appSource.getRepository(galleryMaster);
    const details = await galleryMasterRepository
      .createQueryBuilder("galleryMaster")
      .where("galleryMaster.album_name = :album_name", {
        album_name: albumName,
      })
      .andWhere("galleryMaster.isactive = :isactive", { isactive: true })
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

export const getAlbumImages = async (req: Request, res: Response) => {
  const albumId = req.params.albumid;
  // console.log("calledAlbumId", albumId);
  try {
    const galleryMasterRepository = appSource.getRepository(galleryMaster);
    const details: galleryDetailsDto[] = await galleryMasterRepository.query(`
        select gmn.baseimg from [${process.env.DB_NAME}].[dbo].[gallery_master] gm
inner join [${process.env.DB_NAME}].[dbo].[gallery_master_nested] gmn on gm.albumid = gmn.albumid
where gm.isactive = 1 and gm.albumid = ${albumId}
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
