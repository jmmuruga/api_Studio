import { Router } from "express";
import { auth } from "../../shared/helper";
import { getAllServices, getBannerImages, getBlogDetails, getBlogImages, getCompanyDetails, getServices, getServicesType } from "./themeFour.service";

const themeFourRouter = Router ();
themeFourRouter.get('/themeFourBannerImages/:page', (req, res) => (getBannerImages(req, res)) );
themeFourRouter.get(`/themeFourHomeServices`, (req, res) => (getServices(req, res)) );
themeFourRouter.get(`/themeFourCompanyDetails`,(req, res) => (getCompanyDetails(req, res)));
themeFourRouter.get('/themeFourBlogDetails', (req, res) => (getBlogDetails(req, res)));
themeFourRouter.get('/themeFourBlogImages/:albumid', (req, res) => (getBlogImages(req, res)));
themeFourRouter.get('/themeFourServicesType' , (req, res) => (getServicesType(req, res)));
themeFourRouter.get('/themeFourAllServices/:title/:albumid', (req, res) =>(getAllServices(req, res)));

export default themeFourRouter;