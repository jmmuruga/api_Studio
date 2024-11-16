import {Router} from "express";
import { getGalleryListAsMenu } from "./themeOne.service";
import { auth } from "../../shared/helper";

const themeOneRouter = Router();
themeOneRouter.get("/getAllImages" ,(req,res)=>{getGalleryListAsMenu(req,res)});

export default themeOneRouter; 

