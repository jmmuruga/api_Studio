import { Router } from "express";
import { getAlbumPhotos, getBannerByMenuName, getGalleryListAsMenu } from "./userTheme.service";

const userThemeRouter = Router();
userThemeRouter.get('/getBannerByMenuName/:menu_name', (req, res) => getBannerByMenuName(req, res));
userThemeRouter.get('/getGalleryListAsMenu', (req, res) => getGalleryListAsMenu(req, res));
userThemeRouter.get('/getAlbumPhotos/:albumid/:count', (req, res) => getAlbumPhotos(req, res));
export default userThemeRouter;