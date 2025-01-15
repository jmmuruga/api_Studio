import { Router } from "express";
import {
    getBannerImages,
    getClientGalleryImages,
    getCompanyDetails,
    getPortfolioTypes,
} from "./themeSix.service";

const themeSixRouter = Router();
themeSixRouter.get("/themeSixBannerImages", (req, res) => getBannerImages(req, res));
themeSixRouter.get("/themeSixPortfolioTypes", (req, res) => getPortfolioTypes(req, res));
themeSixRouter.get("/themeSixCompanyDetails", (req, res) => getCompanyDetails(req, res));
themeSixRouter.get("/themeSixClientGalleryImages", (req, res) => getClientGalleryImages(req, res));

export default themeSixRouter;