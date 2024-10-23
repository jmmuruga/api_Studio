import { Request, Response } from "express";
import { appSource } from "../../core/db";
import { UserDetails } from "../userDetails/userDetails.model";
import { ValidationException } from "../../core/exception";
import jwt from 'jsonwebtoken';

export const login = async (req: Request, res: Response) => {
    try {
        const { e_mail, password } = req.params;

        const userRepository = appSource.getRepository(UserDetails);
        let user = await userRepository.findOneBy({
            e_mail: e_mail
        });

        let checkPassword = await userRepository.findOneBy({
            e_mail: e_mail,
            password: password
        });

        if (!user) {
            throw new ValidationException(`Invalid Email!`);
        }
        else if (!checkPassword) {
            throw new ValidationException(`Password is wrong !`);
        }

        const token = jwt.sign(
            { id: user.userid, email: user.e_mail },
            process.env.JWT_SECRET_KEY as string
        );

        res.status(200).send({
            Result: {
                id: user.userid,
                token,
                status: 'Login Success'
            },
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