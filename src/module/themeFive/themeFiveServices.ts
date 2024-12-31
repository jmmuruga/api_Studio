import { Request, Response } from "express";
import { galleryMaster, galleryMasterNested } from "../gallery/gallery.model";
import { galleryDetailsDto } from "../gallery/gallery.dto";
import { ValidationException } from "../../core/exception";
import { appSource } from "../../core/db";
import { bannerMaster } from "../banner/banner.model";
import { bannerDetailsDto } from "../banner/banner.dto";
import { companyDetails } from "../company/companyDetails.model";
import nodemailer from "nodemailer";
import { formDetails } from "../formDetails/formDetails.model";


export const HomeBanner = async (req:Request,res:Response)=>{

    try {
        const bannerMasterRepository = appSource.getRepository(bannerMaster);
        const details: bannerDetailsDto[] = await bannerMasterRepository.query(`
      
    `);
        res.status(200).send({
          Result: details,
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

