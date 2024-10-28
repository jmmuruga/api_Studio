import { Router } from "express";
import { getPhotographyTypeServices, getServiceImages } from "./themeTwo.service";

const themeTwoRouter = Router();
themeTwoRouter.get('/getPhotographyTypeServices',(req,res)=>{getPhotographyTypeServices(req,res)});
themeTwoRouter.get('/getServiceImages/:album_name',(req,res)=>{getServiceImages(req,res)});

export default themeTwoRouter;