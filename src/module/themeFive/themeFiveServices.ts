import { Request, Response } from "express";
import { galleryMaster, galleryMasterNested,  } from "../gallery/gallery.model";
import { galleryDetailsDto, galleryDetailsNestedDto } from "../gallery/gallery.dto";
import { ValidationException } from "../../core/exception";
import { appSource } from "../../core/db";
import { bannerMaster } from "../banner/banner.model";
import { bannerDetailsDto } from "../banner/banner.dto";
import { companyDetails } from "../company/companyDetails.model";



export const getBannerByMenuName = async (req:Request,res:Response)=>{
  const name = req.params.menu_name;

    try {
        const bannerMasterRepository = appSource.getRepository(bannerMaster);
        const details: bannerDetailsDto[] = await bannerMasterRepository.query(`  select bm.*,bmn.* from [${process.env.DB_NAME}].[dbo].[banner_master] bm
      inner join [${process.env.DB_NAME}].[dbo].[banner_master_nested] bmn on bmn.bannerid=bm.bannerid
      where bm.menu_name='${name}'
      
    `);
        res.status(200).send({
          Result: details,
        });
      } catch (error) {
        if (error instanceof ValidationException) {
          return res.status(400).send({
            message: error?.message,
          });
        }
        res.status(500).send(error);
      }
    };




    // export const getHomeGallery = async (req: Request, res: Response) => {
    //   const name = req.params.menu_name;

    //   try {
    //     const bannerMasterRepository = appSource.getRepository(bannerMaster);
    //     const details: bannerDetailsDto[] =
    //       await  bannerMasterRepository.query(`elect bm.*,bmn.* from [${process.env.DB_NAME}].[dbo].[banner_master] bm
    //   inner join [${process.env.DB_NAME}].[dbo].[banner_master_nested] bmn on bmn.bannerid=bm.bannerid
    //   where bm.menu_name='${name}'
            
    //       `);
    //     res.status(200).send({
    //       Result: details,
    //     });
    //   } catch (error) {
    //     if (error instanceof ValidationException) {
    //       return res.status(400).send({
    //         message: error?.message,
    //       });
    //     }
    //     res.status(500).send(error);
    //   }
    // };




    export const getMenus = async (req: Request, res: Response) => {
      try {
        const galleryMasterRepository = appSource.getRepository(galleryMaster);
        const details: galleryDetailsDto[] = await galleryMasterRepository.query(`
      		  select  count(gmn.albumid) as counts,
		  gmn.albumid ,
		  gm.album_name,
		  gm.title,
		  gm.location,
		  MAX(CAST(gm.description AS NVARCHAR(MAX))) AS description,
		   MAX(CAST( gmn.baseimg AS NVARCHAR(MAX))) AS baseimg
		  from [${process.env.DB_NAME}].[dbo].[gallery_master] gm 
		  left join [${process.env.DB_NAME}].[dbo].[gallery_master_nested] gmn  on gmn.albumid=gm.albumid
		   where gmn.isdelete=0 and gm.isdelete=0 and gm.status = 1
		   group by gmn.albumid, gm.album_name,
		  gm.title,
		  gm.location
		  
    `);

    
    




        res.status(200).send({
          Result: details,
        });
      } catch (error) {
        if (error instanceof ValidationException) {
          return res.status(400).send({
            message: error?.message,
          });
        }
        res.status(500).send(error);
      }
    };
        
    

    export const getImagesByAlbumId = async (req: Request, res: Response) => {
      const albumid = req.params.albumid;
      try {
        const galleryMasterNestedRepository = appSource.getRepository(galleryMasterNested);
        const details: galleryDetailsDto[] = await galleryMasterNestedRepository.query(`
            SELECT gm.album_name , gmn.*
    FROM [${process.env.DB_NAME}].[dbo]. [gallery_master_nested] AS gmn
    INNER JOIN [gallery_master] AS gm
        ON gmn.albumid = gm.albumid
    WHERE gmn.isdelete = 0
      AND gmn.albumid = ${albumid};
      `);
        res.status(200).send({
          Result: details,
        });
      } catch (error) {
        console.log(error);
        if (error instanceof ValidationException) {
          return res.status(400).send({
            message: error?.message,
          });
        }
        res.status(500).send(error);
      }
    };




    export const getHeader = async (req:Request,res:Response)=>{
 

    try {
        const Repository = appSource.getRepository(companyDetails);
        const details = await Repository.query(`  select * from [${process.env.DB_NAME}].[dbo].[company_details] 
    
      
    `);
        res.status(200).send({
          Result: details,
        });
      } catch (error) {
        if (error instanceof ValidationException) {
          return res.status(400).send({
            message: error?.message,
          });
        }
        res.status(500).send(error);
      }
    };

     




    




   