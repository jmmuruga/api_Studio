import { Request, Response } from "express";
import { appSource } from "../../core/db";
import { bannerMaster } from "../banner/banner.model";
import { ValidationException } from "../../core/exception";

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