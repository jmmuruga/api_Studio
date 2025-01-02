import { Router } from "express";
import { getBannerByMenuName, getHomeGallery } from "./themeFiveServices";

const themeFiveRouter = Router();
   themeFiveRouter.get("/getBannerByMenuName/:menu_name",(req,res)=>
    getBannerByMenuName(req,res)

   );


   themeFiveRouter.get("/getHomeGallery/",(req,res)=>
    getHomeGallery(req,res)
);
   








export default themeFiveRouter