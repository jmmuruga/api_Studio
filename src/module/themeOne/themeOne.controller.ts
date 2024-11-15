import {Router} from "express";
import { getGalleryListAsMenu } from "./themeOne.service";

const themeOneRouter = Router();
themeOneRouter.get("/getAllImages",(req,res)=>{getGalleryListAsMenu(req,res)});

export default themeOneRouter; 