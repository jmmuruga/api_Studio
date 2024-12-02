import { appSource } from "../../core/db";
import { HttpException, ValidationException } from "../../core/exception";
import { Request, Response } from "express";
import { companyDetails } from "./companyDetails.model";
import { companyDetailsDto, companyDetailsValidation } from "./companyDetails.dto";

export const getCompanyList = async (req: Request, res: Response) => {
    try {
        const Repository = appSource.getRepository(companyDetails);
        const data = await Repository
            .createQueryBuilder()
            .getMany();
        res.status(200).send({
            Result: data
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

export const newCompany = async (req: Request, res: Response) => {
    const payload: companyDetailsDto = req.body;
    try {
        const validation = companyDetailsValidation.validate(payload);
        if (validation?.error) {
            throw new ValidationException(
                validation.error.message
            );
        }
        const repo = appSource.getRepository(companyDetails);
        const companyDetailsDetails = await repo.createQueryBuilder('companyDetails').getOne();
        if (companyDetailsDetails?.companyid) {
            const { cuid, companyid, ...updatePayload } = payload;
            await repo
                .update({ companyid: companyDetailsDetails?.companyid }, updatePayload)
                .then((r) => {
                    res.status(200).send({
                        IsSuccess: "Company Details Updated successFully",
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
            const { companyid, ...updatePayload } = payload;
            await repo.save(updatePayload);
            res.status(200).send({
                IsSuccess: "Company Details added SuccessFully",
            });
        }
    }
    catch (error) {
        console.log('Error', error)
        if (error instanceof ValidationException) {
            return res.status(400).send({
                message: error.message, // Ensure the error message is sent properly
            });
        }
        res.status(500).send({ message: 'Internal server error' });
    }
}

export const deleteCompany = async (req: Request, res: Response) => {
    const id = req.params.companyid;
    const repo = appSource.getRepository(companyDetails);
    try {
        const typeNameFromDb = await repo
            .createQueryBuilder('companyDetails')
            .where("companyDetails.companyid = :companyid", {
                companyid: id,
            })
            .getOne();
        if (!typeNameFromDb?.companyid) {
            throw new HttpException("Company not Found", 400);
        }
        await repo
            .createQueryBuilder("companyDetails")
            .delete()
            .from(companyDetails)
            .where("companyid = :companyid", { companyid: id })
            .execute();
        res.status(200).send({
            IsSuccess: `Company deleted successfully!`,
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