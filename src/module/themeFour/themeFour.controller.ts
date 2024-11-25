import { Router } from "express";
import { auth } from "../../shared/helper";
import { getBannerImages, getCompanyDetails, getServices } from "./themeFour.service";

const themeFourRouter = Router ();
themeFourRouter.get('/themeFourBannerImages/:page', (req, res) => (getBannerImages(req, res)) );
themeFourRouter.get(`/themeFourHomeServices`, (req, res) => (getServices(req, res)) );
themeFourRouter.get(`/themeFourCompanyDetails`,(req, res) => (getCompanyDetails(req, res)));
export default themeFourRouter;