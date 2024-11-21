import { Router } from "express";
import {  getGalleryListAsMenu } from "./themeOne.service";
import {getGalleryImagesList} from "./themeOne.service";
import { auth } from "../../shared/helper";
import { getImageListByAlbumid } from "./themeOne.service";

const themeOneRouter = Router();
themeOneRouter.get("/getGalleryImagesList", (req, res) => {
  getGalleryImagesList(req, res);
});

themeOneRouter.get("/getMenus", (req, res) => {
  getGalleryListAsMenu(req, res);
});

themeOneRouter.get("/getImageListByAlbumid/:albumid", (req, res) => {
  getImageListByAlbumid(req, res);
});

export default themeOneRouter;
