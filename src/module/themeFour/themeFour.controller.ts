import { Router } from "express";
import { auth } from "../../shared/helper";
import { getBannerImages, getBlogDetails, getBlogImages, getCompanyDetails, getServices } from "./themeFour.service";

const themeFourRouter = Router ();
themeFourRouter.get('/themeFourBannerImages/:page', (req, res) => (getBannerImages(req, res)) );
themeFourRouter.get(`/themeFourHomeServices`, (req, res) => (getServices(req, res)) );
themeFourRouter.get(`/themeFourCompanyDetails`,(req, res) => (getCompanyDetails(req, res)));
themeFourRouter.get('/themeFourBlogDetails', (req, res) => (getBlogDetails(req, res)));
themeFourRouter.get('/themeFourBlogImages/:albumid', (req, res) => (getBlogImages(req, res)));
export default themeFourRouter;