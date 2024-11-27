import { Router } from "express";
import { saveFormDetails } from "./ThemeOneForm.services";


const themeOneRouterForForms = Router();

themeOneRouterForForms.post('/addDetails' , (req , res) => saveFormDetails(req , res))

export default themeOneRouterForForms
