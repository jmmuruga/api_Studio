import { Router } from "express";
import { getBannerByMenuName,  getImagesByAlbumId, getMenus, } from "./themeFiveServices";

const themeFiveRouter = Router();
   themeFiveRouter.get("/getBannerByMenuName/:menu_name",(req,res)=>
    getBannerByMenuName(req,res)

   );


//    themeFiveRouter.get("/getHomeGallery/:menu_name",(req,res)=>
//     getHomeGallery(req,res)
// );
themeFiveRouter.get("/getMenus/",(req,res)=>
    getMenus(req,res)
);

themeFiveRouter.get("/getImagesByAlbumId/:albumid",(req,res)=>
    getImagesByAlbumId(req,res)
);




export default themeFiveRouter