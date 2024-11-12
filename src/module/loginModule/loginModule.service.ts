import { Request, Response } from "express";
import { appSource } from "../../core/db";
import { UserDetails } from "../userDetails/userDetails.model";
import { ValidationException } from "../../core/exception";
import nodemailer from 'nodemailer';
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
                user_name:user.user_name,
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


export const forgotPassword = async (req: Request, res: Response) => {
    try {
        const eMail = req.params.e_mail;
        console.log('eMail', eMail);
        const repo = appSource.getRepository(UserDetails);
        const isThereEmail = await repo.findOneBy({
            e_mail: eMail
        });
        console.log('isThereEmail', isThereEmail);
        if (!isThereEmail) {
            throw new ValidationException('Invalid Email !');
        }

        if (isThereEmail) {
            const transporter = nodemailer.createTransport({
                service: "gmail",
                port: 465,
                secure: true,
                auth: {
                    user: "savedatain@gmail.com",
                    pass: "mqks tltb abyk jlyw",
                },
            });

            await transporter.sendMail({
                from: "savedatain@gmail.com",
                to: eMail,
                subject: `Password Recovery Assistance`,
                text: `Hello ${isThereEmail.e_mail},\n\nWe received a request to reset your password. Please use the following password to log in and reset your password:\n\ Password: ${isThereEmail.password}\n\nAfter logging in, we recommend that you update your password for security purposes.\n\nIf you did not request a password reset, please contact our support team.\n\nBest regards,\n SaveData InfoTech Solutions`
            });
        }
        res.status(200).send({
            IsSuccess: true,
            Result: "Mail sent successfully"
        });
    }
    catch (error) {
        console.log('error', error);
        if (error instanceof ValidationException) {
            return res.status(400).send({
                message: error?.message
            });
        }
        res.status(500).send(error);
    }
}