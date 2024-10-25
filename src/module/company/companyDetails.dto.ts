import Joi from "joi";

export interface companyDetailsDto {
    companyid: number;
    company_name: string;
    e_mail: string;
    phone: String;
    phone_two: string;
    website: string;
    address: string;
    logo: string;
    cuid: number;
    muid: number;
}
export const companyDetailsValidation = Joi.object({
    companyid: Joi.number().optional().allow(null, ""),
    company_name: Joi.string().required(),
    e_mail: Joi.string().required(),
    phone: Joi.string().required(),
    phone_two: Joi.string().optional().allow(null, ""),
    website: Joi.string().optional().allow(null, ""),
    address: Joi.string().required(),
    logo: Joi.string().optional().allow(null, ""),
    cuid: Joi.number().required(),
    muid: Joi.number().required(),
})
