import { Router } from "express";
import {
    getBannerImages,
    getCompanyDetails,
    getPortfolioTypes,
} from "./themeSix.service";

const themeSixRouter = Router();
themeSixRouter.get("/themeSixBannerImages", (req, res) => getBannerImages(req, res));
themeSixRouter.get("/themeSixPortfolioTypes", (req, res) => getPortfolioTypes(req, res));
themeSixRouter.get("/themeSixCompanyDetails", (req, res) => getCompanyDetails(req, res));

export default themeSixRouter;