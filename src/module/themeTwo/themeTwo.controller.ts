import { Router } from "express";
import {
  getAlbumImages,
  getAlbumName,
  getAllImages,
  getCompanyDetails,
  getPhotographyTypeServices,
} from "./themeTwo.service";
import { sendMail } from "./mail.service";

const themeTwoRouter = Router();
themeTwoRouter.get("/getPhotographyTypeServices", (req, res) => {
  getPhotographyTypeServices(req, res);
});
themeTwoRouter.get("/getAlbumName/:album_name", (req, res) => {
  getAlbumName(req, res);
});
themeTwoRouter.get("/getAlbumImages/:albumid", (req, res) => {
  getAlbumImages(req, res);
});
themeTwoRouter.get("/getAllImages", (req, res) => {
  getAllImages(req, res);
});
themeTwoRouter.get("/getCompanyDetails", (req, res) => {
  getCompanyDetails(req, res);
});
// themeTwoRouter.get('/getBanners/:pageName',(req,res)=>{getBanners(req,res)});
themeTwoRouter.post("/sendMail", (req, res) => {
  sendMail(req, res);
});

export default themeTwoRouter;
