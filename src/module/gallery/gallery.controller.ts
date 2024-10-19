import { Router } from "express";
import { deleteGalary, getDeletedGalleryMaster, getDeletedGalleryMasterNested, getGalleryList, getGalleryMasterNestedList, newGallery } from "./gallery.service";

const galleryRouter = Router();
galleryRouter.post('/newGallery', (req, res) => newGallery(req, res));
galleryRouter.get('/getGalleryList', (req, res) => getGalleryList(req, res));
galleryRouter.get('/getGalleryMasterNestedList/:albumid', (req, res) => getGalleryMasterNestedList(req, res));
galleryRouter.delete('/deleteGalary/:albumid', (req, res) => deleteGalary(req, res));
galleryRouter.get('/getDeletedGalleryMaster', (req, res) => getDeletedGalleryMaster(req, res));
galleryRouter.get('/getDeletedGalleryMasterNested', (req, res) => getDeletedGalleryMasterNested(req, res));
export default galleryRouter;