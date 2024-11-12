import { appSource } from "../../core/db";
import { HttpException, ValidationException } from "../../core/exception";
import { Request, Response } from "express";
import { bannerMaster, bannerMasterNested } from "./banner.model";
import { bannerDetailsDto, bannerDetailsValidation } from "./banner.dto";

export const getbannerMaster = async (req: Request, res: Response) => {
    try {
        const bannerMasterRepository = appSource.getRepository(bannerMaster);
        const details: bannerDetailsDto[] = await bannerMasterRepository.query(`
    with getCount as (
        select count(bannerid) as counts,bannerid from [${process.env.DB_NAME}].[dbo].[banner_master_nested]
        group by bannerid
        )
        
        select gm.*,gmncount.counts from [${process.env.DB_NAME}].[dbo].[banner_master] gm
        left join getCount gmncount on gmncount.bannerid=gm.bannerid
  `);
        res.status(200).send({
            Result: details
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

export const getBannerMasterNestedList = async (req: Request, res: Response) => {
    const id = req.params.bannerid;
    try {
        const Repository = appSource.getRepository(bannerMasterNested);
        const dataList = await Repository
            .createQueryBuilder('bannerMasterNested')
            .where("bannerMasterNested.bannerid = :bannerid", {
                bannerid: id,
            })
            .getMany();
        res.status(200).send({
            Result: dataList
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

export const newBanner = async (req: Request, res: Response) => {
    const payload: bannerDetailsDto = req.body;
    try {
        // Validate parent and child data
        const validation = bannerDetailsValidation.validate(payload);
        if (validation?.error) {
            throw new ValidationException(validation.error.message);
        }

        const bannerMasterRepoistry = appSource.getRepository(bannerMaster);
        const bannerNestedRepoistry = appSource.getRepository(bannerMasterNested);

        if (payload.bannerid > 0) {
            const deetailsList = await bannerMasterRepoistry.findOneBy({ bannerid: payload.bannerid });
            if (deetailsList) {
                // Check for duplicate Banner name
                if (deetailsList.menu_name !== payload.menu_name) {
                    const validateTypeName = await bannerMasterRepoistry.findBy({ menu_name: payload.menu_name });
                    if (validateTypeName?.length) {
                        throw new ValidationException("Menu Name already exists");
                    }
                }

                const { bannerid, photos, ...updatePayload } = payload;
                await bannerMasterRepoistry.update({ bannerid: payload.bannerid }, updatePayload);

                await bannerNestedRepoistry
                    .createQueryBuilder("bannerMasterNested")
                    .delete()
                    .from(bannerMasterNested)
                    .where("bannerid = :bannerid", { bannerid: payload.bannerid })
                    .execute();

                // Update or insert child entries (photos)
                for (const photo of payload.photos) {
                    const { photoid, ...newNested } = photo;

                    const newPhoto = bannerNestedRepoistry.create({ ...newNested, bannerid: payload.bannerid });
                    await bannerNestedRepoistry.save(newPhoto);
                }

                res.status(200).send({ IsSuccess: "Banner and Photos Updated successfully" });
            }
        } else {
            const validateTypeName = await bannerMasterRepoistry.findBy({ menu_name: payload.menu_name });
            if (validateTypeName?.length) {
                throw new ValidationException("Menu Name already exists");
            }
            // Step 1: Insert into the parent table (bannerMaster)
            const { bannerid, photos, ...updatePayload } = payload;
            const newBanner = bannerMasterRepoistry.create(updatePayload);
            const savedBanner = await bannerMasterRepoistry.save(newBanner);

            // Step 2: Insert into the child table (bannerMasterNested)
            const newPhotos = payload.photos.map(photo => ({
                bannerid: savedBanner.bannerid, // Use generated bannerid
                baseimg: photo.baseimg,
                title: photo.title,
                description: photo.description,
                url_link: photo.url_link
            }));

            await bannerNestedRepoistry.save(newPhotos);

            res.status(200).send({ IsSuccess: "Banner and Photos added successfully" });
        }
    } catch (error) {
        console.log('galerror', error)
        if (error instanceof ValidationException) {
            return res.status(400).send({ message: error.message });
        }
        res.status(500).send({ message: 'Internal server error' });
    }
};

export const deleteBanner = async (req: Request, res: Response) => {
    const id = req.params.bannerid;
    const repoDetails = appSource.getRepository(bannerMaster);
    const repoDetailsNested = appSource.getRepository(bannerMasterNested);
    try {
        const typeNameFromDb = await repoDetails
            .createQueryBuilder('bannerMaster')
            .where("bannerMaster.bannerid = :bannerid", {
                bannerid: id,
            })
            .getOne();
        if (!typeNameFromDb?.bannerid) {
            throw new HttpException("Banner not Found", 400);
        }
        await repoDetails
            .createQueryBuilder("bannerMaster")
            .delete()
            .from(bannerMaster)
            .where("bannerid = :bannerid", { bannerid: id })
            .execute();

        await repoDetailsNested
            .createQueryBuilder("bannerMasterNested")
            .delete()
            .from(bannerMasterNested)
            .where("bannerid = :bannerid", { bannerid: id })
            .execute();
        res.status(200).send({
            IsSuccess: `Banner deleted successfully!`,
        });
    }
    catch (error) {
        if (error instanceof ValidationException) {
            return res.status(400).send({
                message: error?.message,
            });
        }
        res.status(500).send(error);
    }
}