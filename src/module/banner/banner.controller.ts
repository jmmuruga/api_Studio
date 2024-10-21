import { Router } from "express";
import { deleteBanner, getBannerMasterNestedList, getbannerMaster, newBanner } from "./banner.service";

const bannerRouter = Router();
bannerRouter.post('/newBanner', (req, res) => newBanner(req, res));
bannerRouter.get('/getbannerMaster', (req, res) => getbannerMaster(req, res));
bannerRouter.get('/getBannerMasterNestedList/:bannerid', (req, res) => getBannerMasterNestedList(req, res));
bannerRouter.delete('/deleteBanner/:bannerid', (req, res) => deleteBanner(req, res));
export default bannerRouter;