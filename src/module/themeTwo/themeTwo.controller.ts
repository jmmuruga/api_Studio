import { Router } from "express";
import {
  getAlbumImages,
  getAlbumName,
  getAllImages,
  getCompanyDetails,
  getFilterImages,
  getLocBasedAlbums,
  getLocName,
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
themeTwoRouter.get("/getFilterImages/:album_name", (req, res) => {
  getFilterImages(req, res);
});
themeTwoRouter.get("/getCompanyDetails", (req, res) => {
  getCompanyDetails(req, res);
});
themeTwoRouter.post("/sendMail", (req, res) => {
  sendMail(req, res);
});
themeTwoRouter.get("/getLocName", (req, res) => {
  getLocName(req, res);
});
themeTwoRouter.get("/getLocBasedAlbums/:location", (req, res) => {
  getLocBasedAlbums(req, res);
});
export default themeTwoRouter;
