import { Router } from "express";
import { auth } from "../../shared/helper";
import { themeFourBannerImages } from "./themeFour.service";

const themeFourRouter = Router ();
themeFourRouter.get('/themeFourBannerImages', (req, res) => (themeFourBannerImages(req, res)) )

export default themeFourRouter;