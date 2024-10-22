import { appSource } from "../../core/db";
import { ValidationException } from "../../core/exception";
import { bannerDetailsDto } from "../banner/banner.dto";
import { bannerMaster } from "../banner/banner.model";
import { Request, Response } from "express";

export const getBannerByMenuName = async (req: Request, res: Response) => {

    const name = req.params.menu_name;
    console.log(name)
    try {
        const bannerMasterRepository = appSource.getRepository(bannerMaster);
        const details: bannerDetailsDto[] = await bannerMasterRepository.query(`
        select bm.*,bmn.* from [${process.env.DB_NAME}].[dbo].[banner_master] bm
        inner join [${process.env.DB_NAME}].[dbo].[banner_master_nested] bmn on bmn.bannerid=bm.bannerid
        where bm.menu_name='${name}'
        `);

        res.status(200).send({
            Result: details
        });
    } catch (error) {
        console.log(error)
        if (error instanceof ValidationException) {
            return res.status(400).send({
                message: error?.message,
            });
        }
        res.status(500).send(error);
    }
};