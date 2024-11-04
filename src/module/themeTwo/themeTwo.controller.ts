import { Router } from "express";
import { getAlbumImages, getAlbumName, getAllImages, getPhotographyTypeServices } from "./themeTwo.service";

const themeTwoRouter = Router();
themeTwoRouter.get('/getPhotographyTypeServices',(req,res)=>{getPhotographyTypeServices(req,res)});
themeTwoRouter.get('/getAlbumName/:album_name',(req,res)=>{getAlbumName(req,res)});
themeTwoRouter.get('/getAlbumImages/:albumid',(req,res)=>{getAlbumImages(req,res)});
themeTwoRouter.get('/getAllImages',(req,res)=>{getAllImages(req,res)});


export default themeTwoRouter;