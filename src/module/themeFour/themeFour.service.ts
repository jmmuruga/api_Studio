import { Request, Response } from "express";
import { appSource } from "../../core/db";
import { bannerMaster } from "../banner/banner.model";
import { bannerDetailsDto } from "../banner/banner.dto";
import { ValidationException } from "../../core/exception";

export const themeFourBannerImages = async (req: Request, res: Response) => {
  try {
    const bannerMasterRepo = appSource.getRepository(bannerMaster);
    const details: bannerDetailsDto[] =
      await bannerMasterRepo.query(`select menu_name, baseimg, title, description from
         [${process.env.DB_name}].[dbo].[banner_master] bm inner join [banner_master_nested]
          bmn on bm.bannerid = bmn.bannerid `);
    res.status(200).send({ result: details });
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
