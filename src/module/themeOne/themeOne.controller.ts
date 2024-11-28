import { Router } from "express";
import { getBannerByMenuName, getGalleryListAsMenu, getNavHead, getServicesImage } from "./themeOne.service";
import { getGalleryImagesList } from "./themeOne.service";
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
themeOneRouter.get("/getServicesImage", (req, res) => {
  getServicesImage(req, res);
});
themeOneRouter.get("/getBannerByMenuName/:menu_name", (req, res) =>
  getBannerByMenuName(req, res)
);

themeOneRouter.get("/getNavHead", (req, res) =>
  getNavHead(req, res)
);




export default themeOneRouter;
