import { Router } from "express";
import { auth } from "../../shared/helper";
import {
    getBannerImages
} from "./themeSix.service";

const themeSixRouter = Router();
themeSixRouter.get("/themeSixBannerImages/:page", (req, res) => getBannerImages(req, res));

export default themeSixRouter;