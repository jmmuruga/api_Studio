import { Router } from "express";
import { auth } from "../../shared/helper";
import { themeFourBannerImages } from "./themeFour.service";

export const themeFourRouter = Router ();
themeFourRouter.get('/themeFourBannerImages', auth, (req, res) => (themeFourBannerImages(req, res)) )