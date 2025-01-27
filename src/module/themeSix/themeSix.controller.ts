import { Router } from "express";
import {
    getBannerImages,
    getClientGalleryBanner,
    getClientGalleryImages,
    getCompanyDetails,
    getPortfolioAllTypes,
    getPortfolioBanner,
    getPortfolioImages,
    getPortfolioTypes,
    sendMail,
} from "./themeSix.service";

const themeSixRouter = Router();
themeSixRouter.get("/themeSixBannerImages", (req, res) => getBannerImages(req, res));
themeSixRouter.get("/themeSixPortfolioTypes", (req, res) => getPortfolioTypes(req, res));
themeSixRouter.get("/themeSixPortfolioBanner", (req, res) => getPortfolioBanner(req, res));
themeSixRouter.get("/themeSixCompanyDetails", (req, res) => getCompanyDetails(req, res));
themeSixRouter.get("/themeSixClientGalleryImages", (req, res) => getClientGalleryImages(req, res));
themeSixRouter.get("/themeSixClientGalleryBanner", (req, res) => getClientGalleryBanner(req, res));
themeSixRouter.get("/themeSixPortfolioImages/:albumid", (req, res) => getPortfolioImages(req, res));
themeSixRouter.get("/themeSixPortfolioAllTypes/:albumid",(req, res) => getPortfolioAllTypes(req, res));
themeSixRouter.post("/sendMail", (req, res) => sendMail(req, res));

export default themeSixRouter;