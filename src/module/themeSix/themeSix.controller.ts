import { Router } from "express";
import {
    getBannerImages
} from "./themeSix.service";

const themeSixRouter = Router();
themeSixRouter.get("/themeSixBannerImages", (req, res) => getBannerImages(req, res));

export default themeSixRouter;