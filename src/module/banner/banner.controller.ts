import { Router } from "express";
import { deleteBanner, getBannerMasterNestedList, getbannerMaster, newBanner } from "./banner.service";
import { auth } from "../../shared/helper";

const bannerRouter = Router();
bannerRouter.post('/newBanner', auth, (req, res) => newBanner(req, res));
bannerRouter.get('/getbannerMaster', auth, (req, res) => getbannerMaster(req, res));
bannerRouter.get('/getBannerMasterNestedList/:bannerid', auth, (req, res) => getBannerMasterNestedList(req, res));
bannerRouter.delete('/deleteBanner/:bannerid', auth, (req, res) => deleteBanner(req, res));
export default bannerRouter;