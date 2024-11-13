import Joi from "joi";

// Parent DTO
export interface galleryDetailsDto {
    albumid: number;
    album_name: string;
    title: string;
    description: string;
    location: string;
    isactive: boolean;
    status: boolean;
    cuid: number;
    muid: number;
    photos: galleryDetailsNestedDto[]; // Add photos array
}

// Child DTO
export interface galleryDetailsNestedDto {
    photoid: number;
    albumid: number;
    baseimg: string;
    isactive: boolean;
    cuid: number;
    muid: number;
}

// Parent validation schema
export const galleryDetailsValidation = Joi.object({
    albumid: Joi.number().optional().allow(null, ""),
    album_name: Joi.string().required(),
    title: Joi.string().required(),
    location: Joi.string().required(),
    description: Joi.string().required(),
    isactive: Joi.boolean().required(),
    status: Joi.boolean().required(),
    cuid: Joi.number().required(),
    muid: Joi.number().required(),
    photos: Joi.array().items( // Validate photos array
        Joi.object({
            photoid: Joi.number().optional().allow(null, ""),
            albumid: Joi.number().optional().allow(null, ""),
            baseimg: Joi.string().required(),
            isactive: Joi.boolean().required(),
            cuid: Joi.number().required(),
            muid: Joi.number().required()
        })
    ).required() // photos must be provided
});


export const galleryPhotosValidation = Joi.object({
    albumid: Joi.number().required(),
    photos: Joi.array().items( // Validate photos array
        Joi.object({
            photoid: Joi.number().optional().allow(null, ""),
            albumid: Joi.number().optional().allow(null, ""),
            baseimg: Joi.string().required(),
            isactive: Joi.boolean().required(),
            cuid: Joi.number().required(),
            muid: Joi.number().required()
        })
    ).required() // photos must be provided
});
