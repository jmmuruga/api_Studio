import { Router } from "express";
import { getBannerByMenuName,  getHeader,  getImages,  getImagesByAlbumId, getMenus, sendMail, } from "./themeFiveServices";

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
themeFiveRouter.get("/getImages/",(req,res)=>
    getImages(req,res)
);

themeFiveRouter.get("/getImagesByAlbumId/:albumid",(req,res)=>
    getImagesByAlbumId(req,res)
);

themeFiveRouter.get("/getHeader/",(req,res)=>
    getHeader(req,res)
);
themeFiveRouter.post("/sendMail",
    (req, res) => {
   sendMail(req, res);
 });


export default themeFiveRouter