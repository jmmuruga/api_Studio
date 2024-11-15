import { appSource } from "../../core/db";
import { HttpException, ValidationException } from "../../core/exception";
import { galleryDetailsDto, galleryDetailsValidation, galleryPhotosValidation } from "./gallery.dto";
import { galleryMaster, galleryMasterNested } from "./gallery.model";
import { Request, Response } from "express";


export const getGalleryList = async (req: Request, res: Response) => {
    try {
        const galleryMasterRepository = appSource.getRepository(galleryMaster);
        const details: galleryDetailsDto[] = await galleryMasterRepository.query(`
    with getCount as (
        select count(albumid) as counts,albumid from [${process.env.DB_NAME}].[dbo].[gallery_master_nested] where isdelete=1
        group by albumid
        )
        
        select gm.*,gmncount.counts from [${process.env.DB_NAME}].[dbo].[gallery_master] gm
        left join getCount gmncount on gmncount.albumid=gm.albumid
        where gm.isdelete=1
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
            }).andWhere("galleryMasterNested.isdelete = :isdelete", {
                isdelete: true,
            }).orderBy("galleryMasterNested.photoid", "ASC").limit(10)
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
    try {
        const Repository = appSource.getRepository(galleryMaster);
        const dataList = await Repository
            .createQueryBuilder('galleryMaster')
            .where("galleryMaster.isdelete = :isdelete", {
                isdelete: false,
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

export const getDeletedGalleryMasterNested = async (req: Request, res: Response) => {
    try {
        const Repository = appSource.getRepository(galleryMasterNested);
        const dataList = await Repository
            .createQueryBuilder('galleryMasterNested')
            .where("galleryMasterNested.isdelete = :isdelete", {
                isdelete: false,
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

        // Strip unwanted fields like createdAt from the photos array
        if (payload.photos && Array.isArray(payload.photos)) {
            payload.photos = payload.photos.map(photo => {
                // Strip 'createdAt' from the photo object
                const { createdAt, updatedAt, ...validPhotoFields } = photo;
                return validPhotoFields;
            });
        }

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
                const { albumid, photos, ...updatePayload } = payload;
                await galleryMasterRepoistry.update({ albumid: payload.albumid }, updatePayload);

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
                isdelete: photo.isdelete,
                cuid: photo.cuid,
                muid: photo.muid
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
            .set({ isdelete: false })
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

export const deletePermanantlyGallery = async (req: Request, res: Response) => {
    const id = req.params.albumid;
    const repoDetails = appSource.getRepository(galleryMaster);
    const repoDetailsNested = appSource.getRepository(galleryMasterNested);
    try {
        const typeNameFromDb = await repoDetails
            .createQueryBuilder('galleryMaster')
            .where("galleryMaster.albumid = :albumid", {
                albumid: id,
            })
            .getOne();
        if (!typeNameFromDb?.albumid) {
            throw new HttpException("Gallery not Found", 400);
        }
        await repoDetails
            .createQueryBuilder("galleryMaster")
            .delete()
            .from(galleryMaster)
            .where("albumid = :albumid", { albumid: id })
            .execute();

        await repoDetailsNested
            .createQueryBuilder("galleryMasterNested")
            .delete()
            .from(galleryMasterNested)
            .where("albumid = :albumid", { albumid: id })
            .execute();
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

export const restoreDeleteGalary = async (req: Request, res: Response) => {
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
            .set({ isdelete: true })
            .where({ albumid: id }).execute();

        res.status(200).send({
            IsSuccess: `Gallery Restored successfully!`,
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

export const deletePermanantlyGalleryNested = async (req: Request, res: Response) => {
    const id = req.params.photoid;
    const repoDetails = appSource.getRepository(galleryMasterNested);
    try {
        const typeNameFromDb = await repoDetails
            .createQueryBuilder('galleryMasterNested')
            .where("galleryMasterNested.photoid = :photoid", {
                photoid: id,
            })
            .getOne();
        if (!typeNameFromDb?.photoid) {
            throw new HttpException("Photo not Found", 400);
        }
        await repoDetails
            .createQueryBuilder("galleryMasterNested")
            .delete()
            .from(galleryMasterNested)
            .where("photoid = :photoid", { photoid: id })
            .execute();
        res.status(200).send({
            IsSuccess: `Photo Deleted successfully!`,
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

export const restoreDeleteGalaryNested = async (req: Request, res: Response) => {
    const id = req.params.photoid;
    const delRepo = appSource.getRepository(galleryMasterNested);
    try {
        const typeNameFromDb = await delRepo
            .createQueryBuilder('galleryMasterNested')
            .where("galleryMasterNested.photoid = :photoid", {
                photoid: id,
            })
            .getOne();
        if (!typeNameFromDb?.photoid) {
            throw new HttpException("Data not Found", 400);
        }
        await delRepo
            .createQueryBuilder()
            .update(galleryMasterNested)
            .set({ isdelete: true })
            .where({ photoid: id }).execute();

        res.status(200).send({
            IsSuccess: `Photo Restored successfully!`,
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


export const addMorePhoto = async (req: Request, res: Response) => {
    const payload: galleryDetailsDto = req.body;
    try {
        // Validate parent and child data
        const validation = galleryPhotosValidation.validate(payload);
        if (validation?.error) {
            throw new ValidationException(validation.error.message);
        }

        const galleryNestedRepoistry = appSource.getRepository(galleryMasterNested);

        const newPhotos = payload.photos.map(photo => ({
            albumid: payload.albumid, // Use generated albumid
            baseimg: photo.baseimg,
            isdelete: photo.isdelete,
            cuid: photo.cuid,
            muid: photo.muid
        }));

        await galleryNestedRepoistry.save(newPhotos);
        res.status(200).send({ IsSuccess: "Photos added successfully" });

    } catch (error) {
        console.log('galerror', error)
        if (error instanceof ValidationException) {
            return res.status(400).send({ message: error.message });
        }
        res.status(500).send({ message: 'Internal server error' });
    }
};

export const getAlbumPhotos = async (req: Request, res: Response) => {
    const id = req.params.albumid;
    const count = req.params.count;
    try {
        console.log('call', count)
        const Repository = appSource.getRepository(galleryMasterNested);
        const nested = await Repository
            .createQueryBuilder('galleryMasterNested')
            .where("galleryMasterNested.albumid = :albumid", {
                albumid: id,
            }).andWhere("galleryMasterNested.isdelete = :isdelete", {
                isdelete: true,
            })
            .andWhere("galleryMasterNested.photoid > :photoid", {
                photoid: count,
            })
            .orderBy("galleryMasterNested.albumid", "ASC")
            .limit(10)
            .getMany();
        res.status(200).send({
            Result: nested
        });
    } catch (error) {
        console.log('error', error)
        if (error instanceof ValidationException) {
            return res.status(400).send({
                message: error?.message,
            });
        }
        res.status(500).send(error);
    }
};

export const deletePhoto = async (req: Request, res: Response) => {
    const id = req.params.photoid;
    const delRepo = appSource.getRepository(galleryMasterNested);
    try {
        await delRepo
            .createQueryBuilder()
            .update(galleryMasterNested)
            .set({ isdelete: false })
            .where({ photoid: id }).execute();

        res.status(200).send({
            IsSuccess: `Photo Deleted successfully!`,
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


export const changeStatus = async (req: Request, res: Response) => {
    const id = req.params.albumid;
    const statusVal: boolean = req.params.status === 'true';
    const repo = appSource.getRepository(galleryMaster);

    try {
        const typeNameFromDb = await repo
            .createQueryBuilder('galleryMaster')
            .where("galleryMaster.albumid = :albumid", {
                albumid: id,
            })
            .getOne();
        if (!typeNameFromDb?.albumid) {
            throw new HttpException("Data not Found", 400);
        }
        await repo
            .createQueryBuilder()
            .update(galleryMaster)
            .set({ status: statusVal })
            .where({ albumid: id }).execute();

        res.status(200).send({
            IsSuccess: `Status Updated successfully!`,
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