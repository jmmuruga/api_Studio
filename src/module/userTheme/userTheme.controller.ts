import { Router } from "express";
import { getBannerByMenuName } from "./userTheme.service";

const userThemeRouter = Router();
userThemeRouter.get('/getBannerByMenuName/:menu_name', (req, res) => getBannerByMenuName(req, res));
export default userThemeRouter;