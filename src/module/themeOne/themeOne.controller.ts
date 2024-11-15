import {Router} from "express";
import { getAllImages } from "./themeOne.service";

const themeOneRouter = Router();
themeOneRouter.get("/getAllImages",(req,res)=>{getAllImages(req,res)});

export default themeOneRouter; 