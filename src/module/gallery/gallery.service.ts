import { appSource } from "../../core/db";
import { HttpException, ValidationException } from "../../core/exception";
import { galleryDetailsDto, galleryDetailsValidation } from "./gallery.dto";
import { galleryMaster, galleryMasterNested } from "./gallery.model";
import { Request, Response } from "express";


export const getGalleryList = async (req: Request, res: Response) => {

    try {
        const galleryMasterRepository = appSource.getRepository(galleryMaster);
        const details: galleryDetailsDto[] = await galleryMasterRepository.query(`
    with getCount as (
        select count(albumid) as counts,albumid from [${process.env.DB_NAME}].[dbo].[gallery_master_nested] where isactive=1
        group by albumid
        )
        
        select gm.*,gmncount.counts from [${process.env.DB_NAME}].[dbo].[gallery_master] gm
        left join getCount gmncount on gmncount.albumid=gm.albumid
        where gm.isactive=1
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

export const getGalleryMasterNestedList = async (req: Request, res: Response) => {
    const id = req.params.albumid;
    try {
        const Repository = appSource.getRepository(galleryMasterNested);
        const dataList = await Repository
            .createQueryBuilder('galleryMasterNested')
            .where("galleryMasterNested.albumid = :albumid", {
                albumid: id,
            }).andWhere("galleryMasterNested.isactive = :isactive", {
                isactive: true,
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

export const getDeletedGalleryMaster = async (req: Request, res: Response) => {
    console.log('call')
    try {
        const Repository = appSource.getRepository(galleryMaster);
        const dataList = await Repository
            .createQueryBuilder('galleryMaster')
            .where("galleryMaster.isactive = :isactive", {
                isactive: false,
            })
            .getMany();
        res.status(200).send({
            Result: dataList
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

export const getDeletedGalleryMasterNested = async (req: Request, res: Response) => {
    console.log('call')
    try {
        const Repository = appSource.getRepository(galleryMasterNested);
        const dataList = await Repository
            .createQueryBuilder('galleryMasterNested')
            .where("galleryMasterNested.isactive = :isactive", {
                isactive: false,
            })
            .getMany();
        res.status(200).send({
            Result: dataList
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


export const newGallery = async (req: Request, res: Response) => {
    const payload: galleryDetailsDto = req.body;
    try {
        // Validate parent and child data
        const validation = galleryDetailsValidation.validate(payload);
        if (validation?.error) {
            throw new ValidationException(validation.error.message);
        }

        const galleryMasterRepoistry = appSource.getRepository(galleryMaster);
        const galleryNestedRepoistry = appSource.getRepository(galleryMasterNested);

        if (payload.albumid > 0) {
            const galleryDetailsList = await galleryMasterRepoistry.findOneBy({ albumid: payload.albumid });
            if (galleryDetailsList) {
                // // Check for duplicate album name
                // if (galleryDetailsList.album_name !== payload.album_name) {
                //     const validateTypeName = await galleryMasterRepoistry.findBy({ album_name: payload.album_name });
                //     if (validateTypeName?.length) {
                //         throw new ValidationException("Album Name already exists");
                //     }
                // }

                const { albumid, photos, ...updatePayload } = payload;
                await galleryMasterRepoistry.update({ albumid: payload.albumid }, updatePayload);

                await galleryNestedRepoistry
                    .createQueryBuilder()
                    .update(galleryMasterNested)
                    .set({ isactive: false })
                    .where({ albumid: payload.albumid }).execute();
                // Update or insert child entries (photos)
                for (const photo of payload.photos) {
                    const { photoid, ...newNested } = photo;
                    if (photo.photoid > 0) {
                        // Update existing photo
                        await galleryNestedRepoistry.update({ photoid: photo.photoid }, newNested);
                    } else {
                        // Insert new photo
                        const newPhoto = galleryNestedRepoistry.create({ ...newNested, albumid: payload.albumid });
                        await galleryNestedRepoistry.save(newPhoto);
                    }
                }

                res.status(200).send({ IsSuccess: "Gallery and Photos Updated successfully" });
            }
        } else {
            // Step 1: Insert into the parent table (galleryMaster)
            const { albumid, photos, ...updatePayload } = payload;
            const newGallery = galleryMasterRepoistry.create(updatePayload);
            const savedGallery = await galleryMasterRepoistry.save(newGallery);

            // Step 2: Insert into the child table (galleryMasterNested)
            const newPhotos = payload.photos.map(photo => ({
                albumid: savedGallery.albumid, // Use generated albumid
                baseimg: photo.baseimg,
                isactive: photo.isactive,
            }));

            await galleryNestedRepoistry.save(newPhotos);

            res.status(200).send({ IsSuccess: "Gallery and Photos added successfully" });
        }
    } catch (error) {
        console.log('galerror', error)
        if (error instanceof ValidationException) {
            return res.status(400).send({ message: error.message });
        }
        res.status(500).send({ message: 'Internal server error' });
    }
};

export const deleteGalary = async (req: Request, res: Response) => {
    const id = req.params.albumid;
    const delRepo = appSource.getRepository(galleryMaster);
    try {
        const typeNameFromDb = await delRepo
            .createQueryBuilder('galleryMaster')
            .where("galleryMaster.albumid = :albumid", {
                albumid: id,
            })
            .getOne();
        if (!typeNameFromDb?.albumid) {
            throw new HttpException("Data not Found", 400);
        }
        await delRepo
            .createQueryBuilder()
            .update(galleryMaster)
            .set({ isactive: false })
            .where({ albumid: id }).execute();

        res.status(200).send({
            IsSuccess: `Gallery deleted successfully!`,
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
