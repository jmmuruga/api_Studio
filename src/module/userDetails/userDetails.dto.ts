import Joi from "joi";

export interface userDetailsDto {
    userid: number;
    user_name: string;
    phone: string;
    role: String;
    e_mail: string;
    password: string;
    cuid: number;
    muid: number;
}
export const userDetailsValidation = Joi.object({
    userid: Joi.number().optional().allow(null, ""),
    user_name: Joi.string().required(),
    phone: Joi.string().required(),
    role: Joi.string().optional().allow(null, ""),
    e_mail: Joi.string().required(),
    password: Joi.string().required(),
    cuid: Joi.number().required(),
    muid: Joi.number().required(),
})
