import Joi from "joi";

// Parent DTO
export interface bannerDetailsDto {
    bannerid: number;
    menu_name: string;
    cuid: number;
    muid: number;
    photos: bannerDetailsNestedDto[]; // Add photos array
}

// Child DTO
export interface bannerDetailsNestedDto {
    photoid: number;
    bannerid: number;
    baseimg: string;
    title: string;
    description: string;
    url_link: string;
}

// Parent validation schema
export const bannerDetailsValidation = Joi.object({
    bannerid: Joi.number().optional().allow(null, ""),
    menu_name: Joi.string().required(),
    cuid: Joi.number().required(),
    muid: Joi.number().required(),
    photos: Joi.array().items( // Validate photos array
        Joi.object({
            photoid: Joi.number().optional().allow(null, ""),
            bannerid: Joi.number().optional().allow(null, ""),
            baseimg: Joi.string().required(),
            title: Joi.string().required().allow(null, ""),
            description: Joi.string().required().allow(null, ""),
            url_link: Joi.string().required().allow(null, "")
        })
    ).required() // photos must be provided
});

