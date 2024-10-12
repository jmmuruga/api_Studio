import { appSource } from "../../core/db";
import { HttpException, ValidationException } from "../../core/exception";
import { userDetailsDto, userDetailsValidation } from "./userDetails.dto";
import { UserDetails } from "./userDetails.model";
import { Request, Response } from "express";

export const getUserList = async (req: Request, res: Response) => {
    try {
        const Repository = appSource.getRepository(UserDetails);
        const userList = await Repository
            .createQueryBuilder()
            .getMany();
        res.status(200).send({
            Result: userList
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

export const newUser = async (req: Request, res: Response) => {
    const newDataobj = req.body;
    delete newDataobj.c_password;
    const payload: userDetailsDto = newDataobj;
    try {
        const validation = userDetailsValidation.validate(payload);
        if (validation?.error) {
            throw new ValidationException(
                validation.error.message
            );
        }
        const UserDetailsRepoistry = appSource.getRepository(UserDetails);
        const userDetailsDetails = await UserDetailsRepoistry.createQueryBuilder('UserDetails')
            .where("UserDetails.userid = :userid", {
                userid: payload.userid,
            })
            .getOne();
        if (userDetailsDetails?.userid && payload.userid > 0) {
            if (userDetailsDetails.e_mail !== payload.e_mail) {
                const validateTypeName = await UserDetailsRepoistry.findBy({
                    e_mail: payload.e_mail
                })
                if (validateTypeName?.length) {
                    throw new ValidationException("E-mail already exist");
                }
            }
            const { userid, ...updatePayload } = payload;
            await UserDetailsRepoistry
                .update({ userid: payload.userid }, updatePayload)
                .then((r) => {
                    res.status(200).send({
                        IsSuccess: "User Details Updated successFully",
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
            return;
        } else {
            const validateTypeName = await UserDetailsRepoistry.findBy({
                e_mail: payload.e_mail
            })
            if (validateTypeName?.length) {
                throw new ValidationException("E-mail already exist");
            }
            const { userid, ...updatePayload } = payload;
            await UserDetailsRepoistry.save(updatePayload);
            res.status(200).send({
                IsSuccess: "User Details added SuccessFully",
            });
        }
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

export const deleteUser = async (req: Request, res: Response) => {
    const id = req.params.userid;
    const userRepo = appSource.getRepository(UserDetails);
    try {
        const typeNameFromDb = await userRepo
            .createQueryBuilder('UserDetails')
            .where("UserDetails.userid = :userid", {
                userid: id,
            })
            .getOne();
        if (!typeNameFromDb?.userid) {
            throw new HttpException("User not Found", 400);
        }
        await userRepo
            .createQueryBuilder("UserDetails")
            .delete()
            .from(UserDetails)
            .where("userid = :userid", { userid: id })
            .execute();
        res.status(200).send({
            IsSuccess: `User deleted successfully!`,
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