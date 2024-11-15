import { Request, Response } from "express";
import { appSource } from "../../core/db";
import { UserDetails } from "../userDetails/userDetails.model";
import { ValidationException } from "../../core/exception";
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import { resetPasswordValidation } from "../userDetails/userDetails.dto";

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
                user_name: user.user_name,
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
        const randomOtp = String(Math.floor(100000 + Math.random() * 900000));
        const repo = appSource.getRepository(UserDetails);
        const isThereEmail = await repo.findOneBy({
            e_mail: eMail
        });
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
                text: `Hello ${isThereEmail.user_name},\n\n
                We received a request to reset your password. Please use the following One-Time Password (OTP) to log in and reset your password:\n
                OTP: ${randomOtp}\n\n
                This OTP is valid for a limited time. After logging in, we recommend that you update your password for security purposes.\n\n
                If you did not request a password reset, please contact our support team.\n\n
                Best regards,\nSaveData InfoTech Solutions`
            });
        }
        res.status(200).send({
            IsSuccess: true,
            otp: randomOtp,
            user_details: { user_name: isThereEmail.user_name, userid: isThereEmail.userid },
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

export const resetNewPassword = async (req: Request, res: Response) => {
    const data = req.body;
    try {
        const validation = resetPasswordValidation.validate(data);
        if (validation?.error) {
            throw new ValidationException(
                validation.error.message
            );
        }
        const UserDetailsRepoistry = appSource.getRepository(UserDetails);
        const userDetailsDetails = await UserDetailsRepoistry.createQueryBuilder('UserDetails')
            .where("UserDetails.userid = :userid", {
                userid: data.userid,
            }).getOne();

        if (!userDetailsDetails) {
            throw new ValidationException('Invalid User !');
        }

        await UserDetailsRepoistry
            .update({ userid: data.userid }, { password: data.password, muid: data.muid })
            .then((r) => {
                res.status(200).send({
                    IsSuccess: "Password Updated successfully",
                });
            })
            .catch((error) => {
                if (error instanceof ValidationException) {
                    return res.status(400).send({
                        message: error?.message,
                    });
                }
                res.status(500).send(error);
            });
    }
    catch (error) {
        if (error instanceof ValidationException) {
            return res.status(400).send({
                message: error.message, // Ensure the error message is sent properly
            });
        }
        res.status(500).send({ message: 'Internal server error' });
    }
}