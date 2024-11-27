import { Request, Response } from "express";
import { ThemeOneFormDto, ThemeOneFormDtoValidation } from "./ThemeOneForm.dto";
import { ValidationException } from "../../core/exception";
import { appSource } from "../../core/db";
import { form } from "./ThemeOneForm.model";




export const saveFormDetails = async (req : Request , res : Response) => {
    const details : ThemeOneFormDto = req.body;
    try {
        const validation = ThemeOneFormDtoValidation.validate(details);

        if(validation.error){
            throw new ValidationException(validation.error.message)
        }

        // const formRepoistry = appSource.getRepository(form);

        // await formRepoistry.save(details)

    } catch (error) {
      console.error("Error fetching form details:", error);
      throw new Error("Failed to fetch form details");
    }
  };